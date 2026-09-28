"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import z from "zod";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { AccentColor, Prisma, TaskStatus } from "@prisma/client";
import { allowedTransitions } from "./taskTransitions";
import { del, put } from "@vercel/blob";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    category: z.string().min(1, "Category is required"),
    taskDate: z.string().min(1, "Date is required"),
    userId: z.string().min(1, "Please assign an employee"),
});

const updateTaskSchema = taskSchema.extend({
    status: z.enum(TaskStatus, {
        error: "Please select a valid status",
    }),
});

export type ActionState = {
    success: boolean;
    errors?: Record<string, string[]>;
    message?: string;
};

async function requireAdmin() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') return null;
    return session;
}

async function isDemoAccount(userId: string | undefined) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isDemo: true },
    });
    return user?.isDemo ?? false;
}

export async function deleteTask(taskId: string): Promise<ActionState> {
    const session = await requireAdmin();
    if (!session) return { success: false, message: 'Unauthorized' };

    if (await isDemoAccount(session.user.id)) {
        return { success: false, message: "Demo admin can't delete tasks." };
    }

    try {
        await prisma.task.delete({
            where: {
                id: taskId,
            },
        });
        revalidatePath('/admin/tasks');
        revalidatePath('/admin');
        revalidatePath('/employee/tasks');
        revalidatePath('/employee');
        return { success: true };
    } catch {
        return { success: false, message: "Failed to delete task." };
    }
}

export async function createTask(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const session = await requireAdmin();
    if (!session) return { success: false, message: 'Unauthorized' };

    if (await isDemoAccount(session.user.id)) {
        return { success: false, message: "Demo admin can't create tasks." };
    }

    const result = taskSchema.safeParse({
        title: formData.get('title'),
        category: formData.get('category'),
        taskDate: formData.get('taskDate'),
        userId: formData.get('assignedTo'),
    });

    if (!result.success) {
        return { success: false, errors: z.flattenError(result.error).fieldErrors };
    }

    try {
        await prisma.task.create({
            data: {
                title: result.data.title,
                description: formData.get('description') as string,
                category: result.data.category,
                taskDate: new Date(result.data.taskDate),
                userId: result.data.userId,
            },
        });
        revalidatePath('/admin/tasks');
        revalidatePath('/admin');
        revalidatePath('/employee/tasks');
        revalidatePath('/employee');
        return { success: true, errors: {} };
    } catch {
        return { success: false, errors: {}, message: "Something went wrong, try again" };
    }
}

export async function updateTask(taskId: string, prevState: ActionState, formData: FormData): Promise<ActionState> {
    const session = await requireAdmin();
    if (!session) return { success: false, message: 'Unauthorized' };

    if (await isDemoAccount(session.user.id)) {
        return { success: false, message: "Demo admin can't update tasks." };
    }

    const result = updateTaskSchema.safeParse({
        title: formData.get('title'),
        category: formData.get('category'),
        taskDate: formData.get('taskDate'),
        userId: formData.get('assignedTo'),
        status: formData.get('status'),
    });

    if (!result.success) {
        return { success: false, errors: z.flattenError(result.error).fieldErrors };
    }

    try {
        await prisma.task.update({
            where: { id: taskId },
            data: {
                title: result.data.title,
                description: formData.get('description') as string,
                category: result.data.category,
                taskDate: new Date(result.data.taskDate),
                userId: result.data.userId,
                status: result.data.status,
            },
        });
        revalidatePath('/admin/tasks');
        revalidatePath('/admin');
        revalidatePath('/employee/tasks');
        revalidatePath('/employee');
        return { success: true, errors: {} };
    } catch {
        return { success: false, errors: {}, message: "Something went wrong, try again" };
    }
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        const email = (formData.get('email') as string).trim().toLowerCase();

        // Find user role to determine the right dashboard

        const user = await prisma.user.findUnique({
            where: { email },
            select: { role: true },
        });

        const redirectTo = user?.role === 'ADMIN' ? '/admin' : '/employee';

        formData.set('email', email); // set normalized email 
        formData.set('redirectTo', redirectTo);

        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials';
                default:
                    return 'Something went wrong';
            }
        }
        throw error;
    }
}

export async function updateTaskStatus(taskId: string, newStatus: TaskStatus): Promise<ActionState> {
    // 1. Id and role from server
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'EMPLOYEE') {
        return { success: false, message: 'Unauthorized' };
    }

    // 2. dont trust value came from client
    if (!Object.values(TaskStatus).includes(newStatus)) {
        return { success: false, message: 'Invalid status' };
    }

    // 3. From which statuses it is allowed to go to newStatus
    const fromStatuses = (Object.keys(allowedTransitions) as TaskStatus[]).filter((from) => allowedTransitions[from].includes(newStatus));

    try {
        // Ownership + valid transition, both in one atomic query:
        const result = await prisma.task.updateMany({
            where: {
                id: taskId,
                userId: session.user.id,
                status: { in: fromStatuses },
            },
            data: { status: newStatus },
        });

        if (result.count === 0) {
            return { success: false, message: 'This status change is not allowed.' };
        }

        revalidatePath('/employee/tasks');
        revalidatePath('/admin/tasks');
        return { success: true };
    }
    catch {
        return { success: false, message: 'Something went wrong, try again' };
    }
}

export async function updateAvatar(formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        return { success: false, message: 'Unauthorized' };
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
        return {
            success: false,
            message: 'Missing BLOB_READ_WRITE_TOKEN OR BLOB_STORE_ID. Please connect Vercel Blob or configure the token/id in your project environment variables.',
        };
    }

    const file = formData.get('file') as File;
    if (!file || file.size === 0) {
        return {
            success: false,
            message: 'Please select an image file.'
        };
    }

    // Validate size (4MB limit)
    if (file.size > 4 * 1024 * 1024) {
        return {
            success: false,
            message: "Image size must be under 4MB"
        };
    }

    // Validate mime type 
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
        return {
            success: false,
            message: "Only JPG, PNG, WEBP, or GIF images are supported."
        };
    }

    try {
        // Fetch current image so we can delete the old one from storage if it exists
        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { image: true },
        });

        const extension = file.name.split('.').pop() || 'jpg';
        const pathname = `avatars/${session.user.id}-${Date.now()}.${extension}`;

        // 1. Upload new image to Vercel Blob
        const blob = await put(pathname, file, {
            access: 'public',
        }); // returns a URL

        // 2. Save new URL in PostgreSQL
        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: blob.url },
        });

        // 3. Clean up the old blob from storage if existed
        if (currentUser?.image && currentUser.image.includes("public.blob.vercel-storage.com")) {
            try {
                await del(currentUser.image);
            } catch {
                // Silently ignore delete errors so upload doesn't fail
            }
        }

        revalidatePath('/employee/profile');
        revalidatePath('/employee');
        revalidatePath('/admin/employees');

        return { success: true, url: blob.url };
    } catch (error) {
        console.error("Avatar upload error:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to upload image. Please try again."
        };
    }
}

export async function removeAvatar() {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "Unauthorized" };
    }

    try {
        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { image: true },
        });

        if (currentUser?.image && currentUser.image.includes('public.blob.vercel-storage.com')) {
            try {
                await del(currentUser.image);
            } catch {
                // Ignore deletion error
            }
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: null },
        });

        revalidatePath('/employee/profile');
        revalidatePath('/employee');
        revalidatePath('/admin/employees');

        return { success: true };
    } catch {
        return {
            success: false,
            message:
                'Failed to remove avatar. Please try again.'
        };
    }
}

const updateNameSchema = z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
});

export async function updateProfileName(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isDemo: true },
    });

    if (user?.isDemo) {
        return { success: false, message: "Demo accounts can't change their profile name." };
    }

    const result = updateNameSchema.safeParse({
        name: formData.get("name"),
    });

    if (!result.success) {
        return {
            success: false,
            errors: z.flattenError(result.error).fieldErrors,
        };
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { name: result.data.name },
        });
        revalidatePath("/employee/profile");
        revalidatePath("/employee");
        revalidatePath("/admin/employees");
        return { success: true, message: "Name updated successfully!" };
    } catch {
        return { success: false, message: "Failed to update name. Please try again." };
    }
}

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current Password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'New passwords do not match',
        path: ['confirmPassword'],
    });

export async function changePassword(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true, isDemo: true },
    });

    if (user?.isDemo) {
        return { success: false, message: "Demo accounts can't change their password." };
    }

    const result = changePasswordSchema.safeParse({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
    });

    if (!result.success) {
        return {
            success: false,
            errors: z.flattenError(result.error).fieldErrors,
        };
    }

    try {
        if (!user) {
            return { success: false, message: "User not found" };
        }

        // 1. Verify current password
        const isCurrentValid = await bcrypt.compare(result.data.currentPassword, user.password);
        if (!isCurrentValid) {
            return {
                success: false,
                errors: { currentPassword: ["Current password is incorrect"] },
            };
        }

        // 2. Prevent using the same password again
        const isSamePassword = await bcrypt.compare(result.data.newPassword, user.password);
        if (isSamePassword) {
            return {
                success: false,
                errors: { newPassword: ["New password must be different from current password"] },
            };
        }

        // 3. Hash and save new password
        const hashedPassword = await bcrypt.hash(result.data.newPassword, 10);
        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword },
        });
        return { success: true, message: "Password changed successfully!" };
    } catch {
        return { success: false, message: "Failed to change password. Please try again." };
    }
}

const registerSchema = z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
    email: z.string().trim().toLowerCase().pipe(z.email('Enter a valid email')),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function register(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const result = registerSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!result.success) {
        return { success: false, errors: z.flattenError(result.error).fieldErrors };
    }

    const { name, email, password } = result.data;

    try {
        const hashed = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                role: 'EMPLOYEE', // hardcoded and not from formData
                // nested create: user and their sample tasks in one atomic query
                tasks: {
                    create: [
                        { title: 'Welcome aboard: accept this task', description: 'Click Accept to move it to Active.', category: 'onboarding', taskDate: new Date() },
                        { title: 'Complete your profile', description: 'Upload a photo and check your details on the Profile page.', category: 'onboarding', taskDate: new Date() },
                        { title: 'Mark a task as completed', description: 'Accept a task first, then mark it Completed.', category: 'onboarding', taskDate: new Date() },
                    ],
                },
            },
        });
    } catch (error) {
        // P2002 = unique constraint violation (email already exists)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return { success: false, errors: { email: ['This email is already registered'] } };
        }
        return { success: false, message: 'Something went wrong, try again' };
    }

    // it is outside try/catch bcz Next.js's redirect throws a special error 
    await signIn('credentials', { email, password, redirectTo: '/employee' });
    return { success: true };
}

export async function updateAccentColor(color: AccentColor) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'Unauthorized' };
    }

    if (!Object.values(AccentColor).includes(color)) {
        return { success: false, message: 'Invalid color' };
    }

    const cookieStore = await cookies();
    cookieStore.set('accent', color.toLowerCase(), {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
    });

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { accentColor: color },
        });
        revalidatePath('/', 'layout');
        return { success: true };
    } catch {
        return { success: false, message: 'Failed to update accent color' };
    }
}