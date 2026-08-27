"use client";

import deleteTask from "@/app/lib/actions";
import { Task, TaskStatus } from "@prisma/client";
import { useState } from "react";

interface Employee {
    id: string;
    name: string;
    email: string;
    tasks: Task[];
}

export default function TasksBoard({ employees }: { employees: Employee[] }) {
    // 1. Store only the selected ID in state
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id);

    // 2. Derive selectedEmployee dynamically from fresh `employees` prop
    const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId) || employees[0];

    // 3. `employeeTasks` now automatically gets fresh tasks on re-render:
    const employeeTasks = selectedEmployee?.tasks || [];

    // Compute dynamic stats from actual tasks
    const stats = [
        { label: 'New', count: employeeTasks.filter((t) => t.status === TaskStatus.NEW).length, dot: 'bg-info' },
        { label: 'Active', count: employeeTasks.filter((t) => t.status === TaskStatus.ACTIVE).length, dot: 'bg-warning' },
        { label: 'Completed', count: employeeTasks.filter((t) => t.status === TaskStatus.COMPLETED).length, dot: 'bg-success' },
        { label: 'Failed', count: employeeTasks.filter((t) => t.status === TaskStatus.FAILED).length, dot: 'bg-danger' },
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
            {/* Section Header */}
            <div className='flex flex-col gap-1 mb-6'>
                <h2 className='font-semibold text-xl sm:text-2xl tracking-tight text-primary'>Employee Tasks</h2>
                <p className='text-sm text-muted font-medium'>View and manage tasks assigned to each employee.</p>
            </div>

            {/* Employee Tab Pills */}
            <div className="flex gap-5 mb-5 border-b border-border pb-3 overflow-x-auto no-scrollbar whitespace-nowrap">
                {
                    employees.map(emp => (
                        <div
                            key={emp.id}
                            className={`flex items-center gap-2 font-medium text-sm border border-border rounded-md px-3 py-1 cursor-pointer transition-all duration-200 ease-in-out ${selectedEmployee.email === emp.email ? 'bg-accent text-surface shadow-sm' : 'hover:text-primary hover:border-border-hover text-secondary bg-card'}`}
                            onClick={() => {
                                setSelectedEmployeeId(emp.id);
                            }}
                        >
                            {emp.name.split(' ')[0]}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
                            ${selectedEmployee.email === emp.email ? 'bg-primary/50 text-surface' : 'bg-surface text-muted'}`}>
                                {emp.tasks.length}
                            </span>
                        </div>
                    ))
                }
            </div>


            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {employeeTasks.map((task) => {
                    const statusStyle = getStatusStyle(task.status);

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
                                <span className="text-xs text-muted font-medium">{task.taskDate.toLocaleDateString()}</span>
                                <button
                                    onClick={() => {
                                        deleteTask(task.id);
                                    }}
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
