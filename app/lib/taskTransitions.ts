import { TaskStatus } from "@prisma/client";

export const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
    NEW: [TaskStatus.ACTIVE],
    ACTIVE: [TaskStatus.COMPLETED, TaskStatus.FAILED],
    COMPLETED: [],
    FAILED: [],
};
