"use client";

import { deleteTask } from "@/app/lib/actions";
import { Task, TaskStatus } from "@prisma/client";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import TasksModal from "@/app/admin/_components/TasksModal";
import { getStatusStyle } from "@/app/lib/taskStatusStyles";
import { toast } from "sonner";
import { AnimatePresence, motion } from 'motion/react';
import StatusFilterSelect from "@/app/admin/_components/StatusFilterSelect";

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
    const [isDeleting, setIsDeleting] = useState(false);

    // Close confirmation on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && taskToDelete && !isDeleting) {
                setTaskToDelete(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [taskToDelete, isDeleting]);


    const handleConfirmDelete = async () => {
        if (!taskToDelete || isDeleting) return;
        const id = taskToDelete;
        setIsDeleting(true);
        try {
            const res = await deleteTask(id);
            if (res?.success) {
                startTransition(() => {
                    deleteOptimisticTask(id);
                });
                setTaskToDelete(null);
                toast.success("Task deleted successfully.");
            } else {
                toast.error(res?.message || "Failed to delete task.");
            }
        } catch {
            toast.error("Failed to delete task.");
        } finally {
            setIsDeleting(false);
        }
    };

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
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
                <div className='flex flex-col gap-1'>
                    <h2 className='font-semibold text-xl sm:text-2xl tracking-tight text-primary'>Employee Tasks</h2>
                    <p className='text-sm text-muted font-medium'>View and manage tasks assigned to each employee.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-accent rounded-md font-semibold text-surface cursor-pointer transition-all duration-250 ease-in-out hover:bg-accent-hover active:scale-95 tracking-tight text-sm shrink-0 self-start sm:self-auto"
                >
                    <i className="fa-solid fa-plus text-xs"></i>
                    New Task
                </button>
            </div>

            {/* Employee Tab Pills */}
            <div className="flex gap-5 mb-5 border-b border-border pb-3 overflow-x-auto no-scrollbar whitespace-nowrap">
                <div
                    className={`flex items-center gap-2 font-medium text-sm border border-border rounded-md px-3 py-1 cursor-pointer transition-all duration-200 ease-in-out ${isAllView ? 'bg-accent/15 text-accent border-accent/40 shadow-sm' : 'hover:text-primary hover:border-border-hover text-secondary bg-card'}`}
                    onClick={goToAllTab}
                >
                    All
                </div>
                {
                    employees.map(emp => (
                        <div
                            key={emp.id}
                            className={`flex items-center gap-2 font-medium text-sm border border-border rounded-md px-3 py-1 cursor-pointer transition-all duration-200 ease-in-out ${!isAllView && selectedEmployee.email === emp.email ? 'bg-accent/15 text-accent border-accent/40 shadow-sm' : 'hover:text-primary hover:border-border-hover text-secondary bg-card'}`}
                            onClick={() => goToEmployeeTab(emp.id)}
                        >
                            {emp.name.split(' ')[0]}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
                            ${!isAllView && selectedEmployee.email === emp.email ? 'bg-accent/25 text-accent' : 'bg-surface text-muted'}`}>
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

                <StatusFilterSelect
                    value={statusFilter}
                    onChange={(val) => setStatusFilter(val as TaskStatus | "")}
                />
            </div>

            {/* Stat Bar - compact inline row, hidden in All view */}
            {!isAllView && (
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 bg-card border border-border rounded-md mb-5">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${stat.dot}`} />
                            <span className="text-xs text-muted font-medium">{stat.label}</span>
                            <span className="text-sm font-bold font-mono text-primary">{stat.count}</span>
                        </div>
                    ))}
                    {employeeTasks.length > 0 && (
                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-xs text-muted font-medium">Completion</span>
                            <span className="text-sm font-bold font-mono text-accent">
                                {Math.round((employeeTasks.filter(t => t.status === TaskStatus.COMPLETED).length / employeeTasks.length) * 100)}%
                            </span>
                        </div>
                    )}
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
                                className="group relative flex flex-col gap-3 bg-card border border-border rounded-md p-4 hover:border-border-hover hover:shadow-lg hover:shadow-black/20 transition-all duration-200"
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
                                        <span className="text-[11px] text-secondary font-medium mt-1 flex items-center gap-1.5">
                                            <i className="fa-regular fa-user text-[10px] text-accent/70"></i>
                                            {assignedTo.name}
                                        </span>
                                    )}
                                </div>

                                {/* Footer: Date + Action Buttons */}
                                <div className="flex items-center justify-between pt-2.5 border-t border-border/80">
                                    <span className="text-[11px] font-mono text-muted flex items-center gap-1.5">
                                        <i className="fa-regular fa-calendar text-[10px]" />
                                        {new Date(task.taskDate).toLocaleDateString(undefined, {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => { openEditModal(task); }}
                                            title="Edit task"
                                            className="px-2.5 py-1 rounded-md text-xs font-medium text-secondary bg-surface/80 border border-border hover:border-accent/40 hover:text-accent hover:bg-accent/10 active:scale-95 transition-all duration-150 cursor-pointer flex items-center gap-1.5 shadow-xs"
                                        >
                                            <i className="fa-regular fa-pen-to-square text-[11px]" />
                                            <span>Edit</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => { setTaskToDelete(task.id); }}
                                            title="Delete task"
                                            className="p-1 sm:px-2 sm:py-1 rounded-md text-xs font-medium text-muted hover:text-danger hover:border-danger/30 hover:bg-danger/10 border border-transparent active:scale-95 transition-all duration-150 cursor-pointer flex items-center gap-1"
                                        >
                                            <i className="fa-regular fa-trash-can text-[11px]" />
                                            <span className="hidden sm:inline">Delete</span>
                                        </button>
                                    </div>
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

            {/* Task deletion confirmation dialog */}
            {taskToDelete && (
                <div
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !isDeleting) {
                            setTaskToDelete(null);
                        }
                    }}
                    className="bg-black/60 backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    <div className="bg-surface rounded-md border border-border p-5 max-w-sm w-full flex flex-col gap-4 shadow-xl">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center shrink-0">
                                <i className="fa-solid fa-triangle-exclamation text-danger text-xs" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h4 className="text-sm font-semibold text-primary">Delete task?</h4>
                                <p className="text-xs text-muted leading-relaxed">
                                    This action will permanently delete this task and cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                            <button
                                disabled={isDeleting}
                                className="px-3 py-1.5 text-xs font-medium text-muted hover:text-primary rounded-md border border-border hover:bg-card transition-colors disabled:opacity-50 cursor-pointer"
                                onClick={() => setTaskToDelete(null)}
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isDeleting}
                                className="px-3 py-1.5 text-xs font-medium bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25 rounded-md transition-colors disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5"
                                onClick={handleConfirmDelete}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
            {modalOpen && (
                <div className="mt-10">
                    <TasksModal
                        key={`${modalMode}-${taskToEdit?.id ?? 'create'}`}
                        employees={employees}
                        isOpen={modalOpen}
                        onClose={() => {
                            setModalOpen(false);
                            setTaskToEdit(null);
                        }}
                        mode={modalMode}
                        taskToEdit={taskToEdit}
                    />
                </div>
            )}
        </>
    );
}