"use client";

import { deleteTask } from "@/app/lib/actions";
import { Task, TaskStatus } from "@prisma/client";
import { useState } from "react";
import TasksModal from "./TasksModal";
import { getStatusStyle } from "@/app/lib/taskStatusStyles";
import { toast } from "sonner";
import { AnimatePresence, motion } from 'motion/react';

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

    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    // Compute dynamic stats from actual tasks
    const stats = [
        { label: 'New', count: employeeTasks.filter((t) => t.status === TaskStatus.NEW).length, dot: 'bg-info' },
        { label: 'Active', count: employeeTasks.filter((t) => t.status === TaskStatus.ACTIVE).length, dot: 'bg-warning' },
        { label: 'Completed', count: employeeTasks.filter((t) => t.status === TaskStatus.COMPLETED).length, dot: 'bg-success' },
        { label: 'Failed', count: employeeTasks.filter((t) => t.status === TaskStatus.FAILED).length, dot: 'bg-danger' },
    ];

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
                <AnimatePresence mode="popLayout">
                    {employeeTasks.map((task) => {
                        const statusStyle = getStatusStyle(task.status);

                        return (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-col gap-3 bg-card border border-border rounded-md p-4 hover:border-border-hover hover:-translate-y-0.5 transition-all duration-250"
                            >
                                {/* Header: Category + Status */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted px-2 py-0.5 bg-surface rounded-md border border-border">
                                        {task.category}
                                    </span>

                                    <span className={`flex items-center gap-1.5 text-xs font-medium ${statusStyle.text}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
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
                                            setTaskToDelete(task.id);
                                        }}
                                        title="Delete task"
                                        className="text-xs text-muted hover:text-danger cursor-pointer transition-colors duration-150 font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Task deletion confirmation dialog box */}
            {
                taskToDelete && (
                    <div id='delete-task-modal-overlay' className="bg-surface/50 backdrop-blur-xs w-full h-full z-1000 fixed inset-0 flex justify-center items-center">
                        <div id="delete-task-modal-content"
                            className="bg-surface rounded-md border border-border p-4 transition-all duration-200 ease-in-out flex flex-col justify-between">
                            <p className="text-secondary tracking-tight mb-5">Are you sure you want to delete this task?</p>
                            <div className="flex gap-4 justify-end">
                                <button className="text-muted cursor-pointer hover:text-primary transition-all duration-150 ease-in-out" onClick={() => setTaskToDelete(null)}>Cancel</button>
                                <button className="text-[#941a1a] cursor-pointer transition-all duration-150 ease-in-out hover:text-danger" onClick={async () => {
                                    await deleteTask(taskToDelete);
                                    setTaskToDelete(null);
                                    toast.success("Task deleted successfully.");
                                }}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Empty State */}
            {selectedEmployee.tasks.length === 0 && (
                <div className='flex flex-col items-center justify-center gap-3 py-20 text-center'>
                    <div className='w-12 h-12 flex items-center justify-center bg-card border border-border rounded-md'>
                        <i className='fa-regular fa-folder-open text-xl text-muted'></i>
                    </div>
                    <h3 className='text-lg font-semibold text-secondary'>No tasks yet</h3>
                    <p className='text-xs text-muted'>Assign a task to {selectedEmployee.name.split(' ')[0]} to get started.</p>
                </div>
            )}

            {/* TasksModal */}
            <TasksModal employees={employees} />
        </>
    );
}
