import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { getStatusStyle } from "@/app/lib/taskStatusStyles";
import TaskStatusActions from "../_components/TaskStatusActions";
import { TaskStatus } from "@prisma/client";
import Link from "next/link";

const statusPills: { label: string; value?: TaskStatus }[] = [
    { label: "All" },
    { label: "Active", value: "ACTIVE" },
    { label: "New", value: "NEW" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Failed", value: "FAILED" },
];

export default async function EmployeeTasksPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const session = await auth();
    const { status } = await searchParams;

    const tasks = await prisma.task.findMany({
        where: {
            userId: session?.user?.id,
            ...(status ? { status: status as TaskStatus } : {}),
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="mx-4 sm:mx-10 mb-10">
            {/* Header */}
            <div className="flex flex-col gap-1 mb-6">
                <h2 className="font-semibold text-xl sm:text-2xl tracking-tight text-primary">
                    My Tasks
                </h2>
                <p className="text-sm text-muted">Your assigned tasks and their current status.</p>
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
                {statusPills.map((pill) => {
                    const isActive = pill.value ? status === pill.value : !status;
                    const href = pill.value ? `/employee/tasks?status=${pill.value}` : `/employee/tasks`;

                    return (
                        <Link
                            key={pill.label}
                            href={href}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                isActive
                                    ? "bg-accent/15 text-accent font-semibold border border-accent/30"
                                    : "bg-card text-muted hover:text-primary hover:bg-card/80 border border-border"
                            }`}
                        >
                            {pill.label}
                        </Link>
                    );
                })}
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {tasks.map((task) => {
                    const statusStyle = getStatusStyle(task.status);
                    return (
                        <div
                            key={task.id}
                            className="flex flex-col gap-3 bg-card border border-border rounded-md p-4 hover:border-border-hover transition-colors duration-200"
                        >
                            {/* Card Header: Category + Status */}
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted px-2 py-0.5 bg-surface rounded-md border border-border">
                                    {task.category}
                                </span>

                                <span className={`flex items-center gap-1.5 text-xs font-medium ${statusStyle.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                                    {task.status}
                                </span>
                            </div>

                            {/* Task Title & Description */}
                            <div className="flex flex-col gap-1 flex-1">
                                <h3 className="text-base font-semibold tracking-tight text-primary leading-snug">
                                    {task.title}
                                </h3>
                                <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                                    {task.description}
                                </p>
                            </div>

                            {/* Card Footer: Date + Action buttons */}
                            <div className="flex items-center justify-between pt-2 border-t border-border">
                                <span className="text-xs text-muted font-medium">
                                    {task.taskDate.toLocaleDateString()}
                                </span>

                                <TaskStatusActions taskId={task.id} status={task.status} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {tasks.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-20 text-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-card border border-border rounded-md">
                        <i className="fa-regular fa-folder-open text-xl text-muted"></i>
                    </div>
                    <p className="text-base font-semibold text-secondary">
                        {status ? `No ${status.toLowerCase()} tasks found` : "No tasks assigned yet"}
                    </p>
                    {status && (
                        <Link href="/employee/tasks" className="text-xs text-accent hover:underline font-medium">
                            Show all tasks
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
