'use client';

import { updateTaskStatus } from "@/app/lib/actions";
import { allowedTransitions } from "@/app/lib/taskTransitions";
import { TaskStatus } from "@prisma/client";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface ActionConfig {
    label: string;
    icon: string;
    className: string;
}

const buttonConfig: Partial<Record<TaskStatus, ActionConfig>> = {
    ACTIVE: {
        label: "Accept",
        icon: "fa-solid fa-arrow-right",
        className: "bg-info/10 text-info border-info/25 hover:bg-info/20 hover:border-info/40",
    },
    COMPLETED: {
        label: "Complete",
        icon: "fa-solid fa-check",
        className: "bg-success/10 text-success border-success/25 hover:bg-success/20 hover:border-success/40",
    },
    FAILED: {
        label: "Fail",
        icon: "fa-solid fa-xmark",
        className: "bg-transparent text-muted hover:text-danger border-border hover:border-danger/30 hover:bg-danger/10",
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
            <div className="flex items-center gap-1.5">
                {nextStatuses.map((next) => {
                    const config = buttonConfig[next];
                    if (!config) return null;
                    return (
                        <button
                            key={next}
                            disabled={isPending}
                            onClick={() => (next === TaskStatus.FAILED ? setConfirmFail(true) : changeStatus(next))}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border cursor-pointer whitespace-nowrap transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${config.className}`}
                        >
                            <i className={`${config.icon} text-[10px]`} />
                            <span>{config.label}</span>
                        </button>
                    );
                })}
            </div>

            {confirmFail && (
                <div className="bg-black/60 backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface rounded-md border border-border p-5 max-w-sm w-full flex flex-col gap-4 shadow-xl">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center shrink-0">
                                <i className="fa-solid fa-triangle-exclamation text-danger text-xs" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h4 className="text-sm font-semibold text-primary">Mark task as failed?</h4>
                                <p className="text-xs text-muted leading-relaxed">
                                    This action will mark the task as failed and cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                            <button
                                disabled={isPending}
                                className="px-3 py-1.5 text-xs font-medium text-muted hover:text-primary rounded-md border border-border hover:bg-card transition-colors disabled:opacity-50 cursor-pointer"
                                onClick={() => setConfirmFail(false)}
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isPending}
                                className="px-3 py-1.5 text-xs font-medium bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
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