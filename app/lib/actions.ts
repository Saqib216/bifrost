"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";

export async function deleteTask(taskId: string) {
    await prisma.task.delete({
        where: {
            id: taskId,
        },
    }
    );
    revalidatePath("/admin/tasks");
}

export async function createTask(formData: FormData) {
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
}