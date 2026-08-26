"use client";

import { Task, TaskStatus } from "@prisma/client";

interface Employee {
    id: string;
    name: string;
    email: string;
    tasks: Task[];
}

export default function TasksBoard({ employees }: { employees: Employee[] }) {
    // 1. Combine all tasks from all employees
    const allTasks = employees.flatMap((emp) => emp.tasks);

    // 2. Compute dynamic stats from actual tasks
    const stats = [
        { label: 'New', count: allTasks.filter((t) => t.status === TaskStatus.NEW).length, dot: 'bg-info' },
        { label: 'Active', count: allTasks.filter((t) => t.status === TaskStatus.ACTIVE).length, dot: 'bg-warning' },
        { label: 'Completed', count: allTasks.filter((t) => t.status === TaskStatus.COMPLETED).length, dot: 'bg-success' },
        { label: 'Failed', count: allTasks.filter((t) => t.status === TaskStatus.FAILED).length, dot: 'bg-danger' },
    ];

    const getStatusStyle = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.NEW:
                return { dot: "bg-info", text: "text-info" };
            case TaskStatus.ACTIVE:
                return { dot: "bg-warning", text: "text-warning" };
            case TaskStatus.COMPLETED:
                return { dot: "bg-success", text: "text-success" };
            case TaskStatus.FAILED:
                return { dot: "bg-danger", text: "text-danger" };
        }
    };

    return (
        <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-card rounded-md border border-border p-4 flex flex-col gap-2"
                    >
                        <div className="flex items-center gap-2">
                            <span className={`${stat.dot} w-1.5 h-1.5 rounded-full`}></span>
                            <span className="text-xs font-semibold tracking-wider text-muted uppercase">{stat.label}</span>
                        </div>
                        <span className="text-3xl font-bold font-mono">{stat.count}</span>
                    </div>
                ))}
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-10">
                {allTasks.map((task) => {
                    const statusStyle = getStatusStyle(task.status);
                    const formattedDate = new Date(task.taskDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    });

                    return (
                        <div
                            key={task.id}
                            className="flex flex-col gap-3 bg-card border border-border rounded-md p-4 hover:border-border-hover transition-colors duration-200"
                        >
                            {/* Header: Category + Status */}
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted px-2 py-0.5 bg-surface rounded-md border border-border">
                                    {task.category}
                                </span>

                                <span className={`flex items-center gap-1.5 text-xs font-medium ${statusStyle?.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle?.dot}`}></span>
                                    {task.status}
                                </span>
                            </div>

                            {/* Title & Description */}
                            <div className="flex flex-col gap-1 flex-1">
                                <h3 className="text-base font-semibold tracking-tight text-primary leading-snug">
                                    {task.title}
                                </h3>
                                <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                                    {task.description}
                                </p>
                            </div>

                            {/* Footer: Date + Delete */}
                            <div className="flex items-center justify-between pt-2 border-t border-border">
                                <span className="text-xs text-muted font-medium">{formattedDate}</span>
                                <button
                                    title="Delete task"
                                    className="text-xs text-muted hover:text-danger cursor-pointer transition-colors duration-150 font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
