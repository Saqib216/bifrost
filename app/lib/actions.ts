"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import z, { success } from "zod";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { TaskStatus } from "@prisma/client";
import { allowedTransitions } from "./taskTransitions";
import { del, put } from "@vercel/blob";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    category: z.string().min(1, "Category is required"),
    taskDate: z.string().min(1, "Date is required"),
    userId: z.string().min(1, "Please assign an employee"),
});

export type ActionState = {
    success: boolean;
    errors?: Record<string, string[]>;
    message?: string;
};

export async function deleteTask(taskId: string) {
    await prisma.task.delete({
        where: {
            id: taskId,
        },
    }
    );
    revalidatePath("/admin/tasks");
}

export async function createTask(prevState: ActionState, formData: FormData): Promise<ActionState> {
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
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as string,
                taskDate: new Date(formData.get('taskDate') as string),
                userId: formData.get('assignedTo') as string,
            },
        });
        revalidatePath("/admin/tasks");
        return { success: true, errors: {} };
    } catch {
        return { success: false, errors: {}, message: "Something went wrong, try again" };
    }
}

export async function updateTask(taskId: string, prevState: ActionState, formData: FormData): Promise<ActionState> {
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
        await prisma.task.update({
            where: { id: taskId },
            data: {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as string,
                taskDate: new Date(formData.get('taskDate') as string),
                userId: formData.get('assignedTo') as string,
            },
        });
        revalidatePath('/admin/tasks');
        return { success: true, errors: {} };
    } catch {
        return { success: false, errors: {}, message: "Something went wrong, try again" };
    }
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        const email = formData.get('email') as string;

        // Find user role to determine the right dashboard

        const user = await prisma.user.findUnique({
            where: { email },
            select: { role: true },
        });

        const redirectTo = user?.role === 'ADMIN' ? '/admin' : '/employee';

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

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return {
            success: false,
            message: 'Missing BLOB_READ_WRITE_TOKEN in .env. Please configure your Vervel Blob token.',
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