'use client';

import { updateTaskStatus } from "@/app/lib/actions";
import { allowedTransitions } from "@/app/lib/taskTransitions";
import { TaskStatus } from "@prisma/client";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const buttonConfig: Partial<Record<TaskStatus, { label: string, className: string }>> = {
    ACTIVE: {
        label: "Accept",
        className: "bg-info/10 text-info border-info/20 hover:bg-info/20",
    },
    COMPLETED: {
        label: "Mark Completed",
        className: "bg-success/10 text-success border-success/20 hover:bg-success/20",
    },
    FAILED: {
        label: "Mark Failed",
        className: "bg-danger/10 text-danger border-danger/20 hover:bg-danger/20",
    },
};

export default function TaskStatusActions({ taskId, status }: { taskId: string; status: TaskStatus }) {
    const [isPending, startTransition] = useTransition();
    const [confirmFail, setConfirmFail] = useState(false);

    const nextStatuses = allowedTransitions[status];
    if (nextStatuses.length === 0) return null;

    const changeStatus = (newStatus: TaskStatus) => {
        startTransition(async () => {
            const result = await updateTaskStatus(taskId, newStatus);
            if (result.success) {
                toast.success("Task updated.");
            } else {
                toast.error(result.message ?? "Something went wrong.");
            }
            setConfirmFail(false);
        });
    };

    return (
        <>
            <div className="flex gap-2">
                {nextStatuses.map((next) => {
                    const config = buttonConfig[next];
                    if (!config) return null;
                    return (
                        <button
                            key={next}
                            disabled={isPending}
                            onClick={() => (next === TaskStatus.FAILED ? setConfirmFail(true) : changeStatus(next))}
                            className={`text-xs font-medium px-3 py-1.5 rounded-md border cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${config.className}`}
                        >
                            {config.label}
                        </button>
                    );
                })}
            </div>

            {confirmFail && (
                <div className="bg-surface/50 backdrop-blur-xs w-full h-full z-1000 fixed inset-0 flex justify-center items-center">
                    <div className="bg-surface rounded-md border border-border p-4 flex flex-col justify-between">
                        <p className="text-secondary tracking-tight mb-5">
                            Mark this task as failed? This can't be undone.
                        </p>
                        <div className="flex gap-4 justify-end">
                            <button
                                disabled={isPending}
                                className="text-muted cursor-pointer hover:text-primary transition-all duration-150 disabled:opacity-50"
                                onClick={() => setConfirmFail(false)}
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isPending}
                                className="text-danger cursor-pointer transition-all duration-150 hover:opacity-80 disabled:opacity-50"
                                onClick={() => changeStatus(TaskStatus.FAILED)}
                            >
                                Mark Failed
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}