"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import z from "zod";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { TaskStatus } from "@prisma/client";
import { allowedTransitions } from "./taskTransitions";

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