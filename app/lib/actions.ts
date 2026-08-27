"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";

export default async function deleteTask(taskId: string) {
    await prisma.task.delete({
        where: {
            id: taskId,
        },
    }
    );
    revalidatePath("/admin/tasks");
}   