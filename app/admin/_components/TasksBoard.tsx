"use client";

import { deleteTask } from "@/app/lib/actions";
import { Task, TaskStatus } from "@prisma/client";
import { useOptimistic, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import TasksModal from "@/app/admin/_components/TasksModal";
import { getStatusStyle } from "@/app/lib/taskStatusStyles";
import { toast } from "sonner";
import { AnimatePresence, motion } from 'motion/react';

interface Employee {
    id: string;
    name: string;
    email: string;
    tasks: Task[];
}

interface AssignedTo {
    id: string;
    name: string;
    email: string;
}

interface AllTasksData {
    tasks: (Task & { assignedTo: AssignedTo })[];
    totalPages: number;
    currentPage: number;
}

export default function TasksBoard({
    employees,
    allTasksData,
}: {
    employees: Employee[];
    allTasksData: AllTasksData | null;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isAllView = searchParams.get('tab') === 'all';

    // 1. Store only the selected ID in state
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0]?.id);

    // 2. Derive selectedEmployee dynamically from fresh `employees` prop
    const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId) || employees[0];

    // 3. `employeeTasks` now automatically gets fresh tasks on re-render:
    const employeeTasks = selectedEmployee?.tasks || [];

    // 4. Pick which task list is "active" based on view mode
    const sourceTasks = isAllView ? (allTasksData?.tasks ?? []) : employeeTasks;

    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    // For search/filter
    const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
    const [searchQuery, setSearchQuery] = useState('');

    const [isPending, startTransition] = useTransition();

    const [optimisticTasks, deleteOptimisticTask] = useOptimistic(
        sourceTasks,
        (currentTasks, taskIdToDelete: string) => currentTasks.filter((t) => t.id !== taskIdToDelete)
    );

    // filtered version
    const filteredTasks = optimisticTasks.filter((task) => {
        const matchesStatus = statusFilter ? task.status === statusFilter : true;
        const matchesSearch = searchQuery ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;

        return matchesStatus && matchesSearch;
    })

    const openCreateModal = () => {
        setModalMode('create');
        setTaskToEdit(null);
        setModalOpen(true);
    };

    const openEditModal = (task: Task) => {
        setModalMode('edit');
        setTaskToEdit(task);
        setModalOpen(true);
    };

    const goToAllTab = () => {
        router.push(`${pathname}?tab=all&page=1`);
    };

    const goToEmployeeTab = (empId: string) => {
        setSelectedEmployeeId(empId);
        if (isAllView) {
            router.push(pathname); // clears tab/page params
        }
    };

    const goToPage = (page: number) => {
        router.push(`${pathname}?tab=all&page=${page}`);
    };

    // Compute dynamic stats - only meaningful in employee view,
    // since "All" view only holds one page of tasks, not the full dataset.
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
                <div
                    className={`flex items-center gap-2 font-medium text-sm border border-border rounded-md px-3 py-1 cursor-pointer transition-all duration-200 ease-in-out ${isAllView ? 'bg-accent text-surface shadow-sm' : 'hover:text-primary hover:border-border-hover text-secondary bg-card'}`}
                    onClick={goToAllTab}
                >
                    All
                </div>
                {
                    employees.map(emp => (
                        <div
                            key={emp.id}
                            className={`flex items-center gap-2 font-medium text-sm border border-border rounded-md px-3 py-1 cursor-pointer transition-all duration-200 ease-in-out ${!isAllView && selectedEmployee.email === emp.email ? 'bg-accent text-surface shadow-sm' : 'hover:text-primary hover:border-border-hover text-secondary bg-card'}`}
                            onClick={() => goToEmployeeTab(emp.id)}
                        >
                            {emp.name.split(' ')[0]}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
                            ${!isAllView && selectedEmployee.email === emp.email ? 'bg-primary/50 text-surface' : 'bg-surface text-muted'}`}>
                                {emp.tasks.length}
                            </span>
                        </div>
                    ))
                }
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tasks by title..."
                        className="w-full bg-card border border-border rounded-md pl-9 pr-3 py-2 text-sm text-primary placeholder:text-muted transition-all duration-150 ease-in-out hover:border-muted focus:border-accent focus:ring-4 focus:ring-accent/30"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "")}
                    className="bg-card border border-border rounded-md px-3 py-2 text-sm text-primary transition-all duration-150 ease-in-out hover:border-muted focus:border-accent focus:ring-4 focus:ring-accent/30 cursor-pointer"
                >
                    <option value="">All Status</option>
                    <option value={TaskStatus.NEW}>New</option>
                    <option value={TaskStatus.ACTIVE}>Active</option>
                    <option value={TaskStatus.COMPLETED}>Completed</option>
                    <option value={TaskStatus.FAILED}>Failed</option>
                </select>
            </div>

            {/* Stat Cards - hidden in All view (page-level data can't give accurate totals) */}
            {!isAllView && (
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
            )}

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <AnimatePresence mode="popLayout">
                    {filteredTasks.map((task) => {
                        const statusStyle = getStatusStyle(task.status);
                        const assignedTo = isAllView ? (task as Task & { assignedTo: AssignedTo }).assignedTo : null;

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
                                    <p className="text-xs text-muted line-clamp-2 leading-relaxed flex-1">
                                        {task.description}
                                    </p>
                                    {assignedTo && (
                                        <span className="text-[11px] text-accent font-medium mt-1 flex items-center gap-1">
                                            <i className="fa-regular fa-user text-[10px]"></i>
                                            {assignedTo.name}
                                        </span>
                                    )}
                                </div>

                                {/* Footer: Date + Delete */}
                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                    <span className='text-xs text-muted font-medium flex items-center gap-1.5'>
                                        <i className='fa-regular fa-calendar text-[11px]'></i>
                                        {task.taskDate.toLocaleDateString()}
                                    </span>

                                    <button
                                        onClick={() => {
                                            setTaskToDelete(task.id);
                                        }}
                                        title="Delete task"
                                        className="flex items-center gap-1.5 text-xs text-muted hover:text-danger cursor-pointer transition-colors duration-150 font-medium"
                                    >
                                        <i className='fa-regular fa-trash-can text-[13px]'></i>
                                        Delete
                                    </button>

                                    <button
                                        onClick={() => { openEditModal(task); }}
                                        title="Edit task"
                                        className="flex items-center gap-1.5 text-xs text-muted hover:text-primary cursor-pointer transition-colors duration-150 font-medium"
                                    >
                                        <i className='fa-regular fa-edit text-[13px]'></i>
                                        Edit
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Pagination - only in All view */}
            {isAllView && allTasksData && allTasksData.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                        disabled={allTasksData.currentPage <= 1}
                        onClick={() => goToPage(allTasksData.currentPage - 1)}
                        className="px-3 py-1.5 text-sm rounded-md border border-border text-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:border-border-hover cursor-pointer"
                    >
                        Prev
                    </button>
                    <span className="text-sm text-muted font-medium">
                        Page {allTasksData.currentPage} of {allTasksData.totalPages}
                    </span>
                    <button
                        disabled={allTasksData.currentPage >= allTasksData.totalPages}
                        onClick={() => goToPage(allTasksData.currentPage + 1)}
                        className="px-3 py-1.5 text-sm rounded-md border border-border text-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:border-border-hover cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Task deletion confirmation dialog box */}
            {
                taskToDelete && (
                    <div id='delete-task-modal-overlay' className="bg-surface/50 backdrop-blur-xs w-full h-full z-1000 fixed inset-0 flex justify-center items-center">
                        <div id="delete-task-modal-content"
                            className="bg-surface rounded-md border border-border p-4 transition-all duration-200 ease-in-out flex flex-col justify-between">
                            <p className="text-secondary tracking-tight mb-5">Are you sure you want to delete this task?</p>
                            <div className="flex gap-4 justify-end">
                                <button className="text-muted cursor-pointer hover:text-primary transition-all duration-150 ease-in-out" onClick={() => setTaskToDelete(null)}>Cancel</button>
                                <button className="text-[#941a1a] cursor-pointer transition-all duration-150 ease-in-out hover:text-danger" onClick={() => {
                                    const id = taskToDelete;
                                    setTaskToDelete(null);
                                    startTransition(async () => {
                                        deleteOptimisticTask(id!);
                                        await deleteTask(id!);
                                        toast.success("Task deleted successfully.");
                                    });
                                }}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Empty State */}
            {filteredTasks.length === 0 && (
                <div className='flex flex-col items-center justify-center gap-3 py-20 text-center'>
                    <div className='w-12 h-12 flex items-center justify-center bg-card border border-border rounded-md'>
                        <i className='fa-regular fa-folder-open text-xl text-muted'></i>
                    </div>
                    <h3 className='text-lg font-semibold text-secondary'>No tasks yet</h3>
                    <p className='text-xs text-muted'>
                        {isAllView ? 'No tasks found.' : `Assign a task to ${selectedEmployee.name.split(' ')[0]} to get started.`}
                    </p>
                </div>
            )}

            {/* TasksModal Section */}
            <div className="mt-10">
                {/* Section Header */}
                <div className='flex flex-col gap-1 mb-6'>
                    <h2 className='font-semibold text-xl sm:text-2xl tracking-tight text-primary'>Assign Tasks</h2>
                    <p className='text-sm text-muted font-medium'>Want to assign more tasks to employees? Click the button below</p>
                </div>

                {/* Add Task button */}
                <div className="flex justify-center">
                    <button
                        onClick={openCreateModal}
                        className="px-3 py-1.5 bg-accent rounded-md font-semibold text-surface cursor-pointer transition-all duration-250 ease-in-out hover:bg-accent-hover active:scale-95 tracking-tight text-sm">
                        Add Task
                    </button>
                </div>
                <TasksModal
                    employees={employees}
                    isOpen={modalOpen}
                    onClose={() => { setModalOpen(false) }}
                    mode={modalMode}
                    taskToEdit={taskToEdit}
                />
            </div>
        </>
    );
}