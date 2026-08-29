import { TaskStatus } from "@prisma/client";

export function getStatusStyle(status: TaskStatus) {
    switch (status) {
        case TaskStatus.NEW:
            return {
                dot: 'bg-info', text: 'text-info'
            };
        case TaskStatus.ACTIVE:
            return {
                dot: 'bg-warning', text: 'text-warning'
            };
        case TaskStatus.COMPLETED:
            return {
                dot: 'bg-success', text: 'text-success'
            };
        case TaskStatus.FAILED:
            return {
                dot: 'bg-danger', text: 'text-danger'
            };
        default:
            return { dot: "bg-muted", text: "text-muted" };
    }
}