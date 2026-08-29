"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import z from "zod";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
    taskDate: z.string().min(1, "Date is required"),
    userId: z.string().min(1, "Please assign an employee"),
});

export async function deleteTask(taskId: string) {
    await prisma.task.delete({
        where: {
            id: taskId,
        },
    }
    );
    revalidatePath("/admin/tasks");
}

export async function createTask(prevState: any, formData: FormData) {
    const result = taskSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        taskDate: formData.get('taskDate'),
        userId: formData.get('assignedTo'),
    });

    if (!result.success) {
        return { errors: z.flattenError(result.error).fieldErrors };
    }

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

    return { error: {} };
}