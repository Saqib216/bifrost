"use client";

import { createTask, updateTask, type ActionState } from "@/app/lib/actions";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task, TaskStatus } from "@prisma/client";
import { useActionState, useEffect, useState, useRef } from "react";
import { toast } from "sonner";

interface Employee {
    id: string;
    name: string;
    email: string;
}

interface Props {
    employees: Employee[];
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    taskToEdit: Task | null;
}

export default function TasksModal({ employees, isOpen, onClose, mode, taskToEdit }: Props) {
    const [isVisible, setIsVisible] = useState(false);
    const [date, setDate] = useState<Date | undefined>(taskToEdit?.taskDate ? new Date(taskToEdit.taskDate) : undefined);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => { setIsVisible(true); });
            setDate(taskToEdit?.taskDate ? new Date(taskToEdit.taskDate) : undefined);
        } else {
            setIsCalendarOpen(false);
        }
    }, [isOpen, taskToEdit]);

    const closeModal = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 180);
    };

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                closeModal();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    const handleAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
        if (mode === 'edit' && taskToEdit) {
            return updateTask(taskToEdit.id, prevState, formData);
        }
        return createTask(prevState, formData);
    };

    const [state, formAction, isPending] = useActionState(handleAction, { success: false, errors: {} });

    useEffect(() => {
        if (state.success) {
            closeModal();
            toast.success(mode === "edit" ? "Task updated successfully" : "New Task created");
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    const employeeItems = Object.fromEntries(employees.map((e) => [e.id, e.name]));
    const statusItems = Object.fromEntries(Object.values(TaskStatus).map((s) => [s, s]));

    if (!isOpen) return null;

    return (
        <div
            id="create-task-modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) closeModal();
            }}
            className={`fixed inset-0 z-[1000] flex justify-center items-start pt-[10vh] sm:pt-[14vh] px-4 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ease-out ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
        >
            <div
                id="create-task-modal-content"
                className={`w-full max-w-2xl bg-surface/95 backdrop-blur-xl border border-border/80 rounded-md shadow-2xl shadow-black/50 overflow-hidden relative before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-accent/60 before:to-transparent transition-all duration-200 ease-out transform ${isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-98 -translate-y-2 opacity-0"
                    }`}
            >
                <form
                    ref={formRef}
                    action={formAction}
                    onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                            e.preventDefault();
                            formRef.current?.requestSubmit();
                        }
                    }}
                >
                    {/* Header bar */}
                    <div className="flex items-center justify-between px-5 pt-4 pb-2">
                        <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-accent/15 text-accent flex items-center justify-center text-xs">
                                <i className={mode === "edit" ? "fa-solid fa-pen-to-square text-[10px]" : "fa-solid fa-plus text-[10px]"}></i>
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                                {mode === "edit" ? "Edit Task" : "New Task"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <kbd className="hidden sm:inline-block text-[10px] text-muted/70 bg-card border border-border/60 px-1.5 py-0.5 rounded-md font-mono">
                                Esc
                            </kbd>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="w-7 h-7 rounded-md flex items-center justify-center text-muted hover:text-primary hover:bg-card transition-colors cursor-pointer"
                                aria-label="Close modal"
                            >
                                <i className="fa-solid fa-xmark text-sm"></i>
                            </button>
                        </div>
                    </div>

                    {/* Canvas Area: Title & Description */}
                    <div className="px-6 pt-2 pb-5 flex flex-col gap-3">
                        <div>
                            <input
                                name="title"
                                type="text"
                                autoFocus
                                defaultValue={taskToEdit?.title}
                                placeholder="Task title..."
                                className="w-full bg-transparent text-xl sm:text-2xl font-semibold text-primary placeholder:text-muted/40 outline-none border-0 focus:ring-0 focus:outline-none p-0 tracking-tight"
                            />
                            {state.errors?.title && (
                                <p className="text-danger text-xs mt-1.5 flex items-center gap-1.5">
                                    <i className="fa-solid fa-circle-exclamation text-[11px]"></i>
                                    {state.errors.title[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <textarea
                                name="description"
                                defaultValue={taskToEdit?.description ?? ""}
                                placeholder="Add description, notes, or acceptance criteria..."
                                rows={3}
                                className="w-full bg-transparent text-sm sm:text-base text-primary/80 placeholder:text-muted/40 outline-none border-0 focus:ring-0 focus:outline-none p-0 resize-none leading-relaxed min-h-22.5"
                            />
                        </div>
                    </div>

                    {/* Validation Errors Strip (for secondary fields) */}
                    {(state.errors?.userId || state.errors?.category || state.errors?.taskDate) && (
                        <div className="px-6 py-2 bg-danger/10 border-t border-danger/20 text-danger text-xs flex flex-wrap items-center gap-3">
                            <i className="fa-solid fa-circle-exclamation text-[11px] shrink-0"></i>
                            {state.errors.userId && <span>Assignee: {state.errors.userId[0]}</span>}
                            {state.errors.category && <span>Category: {state.errors.category[0]}</span>}
                            {state.errors.taskDate && <span>Date: {state.errors.taskDate[0]}</span>}
                        </div>
                    )}

                    {/* Bottom Properties & Action Bar */}
                    <div className="border-t border-border/70 bg-card/40 px-5 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        {/* Interactive Property Pills */}
                        <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
                            {/* Assignee Pill */}
                            <Select
                                key={taskToEdit?.id ?? "create-assigned"}
                                name="assignedTo"
                                defaultValue={taskToEdit?.userId}
                                items={employeeItems}
                            >
                                <SelectTrigger
                                    size="sm"
                                    className="w-auto max-w-45 h-7 px-2.5 rounded-md bg-surface/90 border border-border/80 hover:bg-card hover:border-muted text-xs shrink-0"
                                >
                                    <div className="flex items-center gap-1.5 truncate">
                                        <i className="fa-regular fa-user text-muted text-[10px] shrink-0"></i>
                                        <SelectValue placeholder="Assignee" className="text-xs truncate" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map((employee) => (
                                        <SelectItem key={employee.id} value={employee.id}>
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 rounded-md bg-accent/15 text-accent text-[10px] font-semibold flex items-center justify-center shrink-0">
                                                    {employee.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                                                </span>
                                                <span className="truncate text-xs">{employee.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Due Date Pill */}
                            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                <PopoverTrigger
                                    type="button"
                                    className={`h-7 px-2.5 rounded-md border text-xs font-medium text-primary transition-all duration-150 flex items-center gap-1.5 cursor-pointer outline-none shrink-0 ${isCalendarOpen
                                            ? "border-accent ring-4 ring-accent/30 bg-card"
                                            : "border border-border/80 bg-surface/90 hover:bg-card hover:border-muted focus:border-accent focus:ring-4 focus:ring-accent/30 data-[popup-open]:border-accent data-[popup-open]:ring-4 data-[popup-open]:ring-accent/30 aria-expanded:border-accent aria-expanded:ring-4 aria-expanded:ring-accent/30"
                                        }`}
                                >
                                    <i className="fa-regular fa-calendar text-muted text-[10px] shrink-0"></i>
                                    <span className={date ? "text-primary font-medium" : "text-muted"}>
                                        {date ? format(date, "MMM d, yyyy") : "Due date"}
                                    </span>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(newDate) => {
                                            setDate(newDate);
                                            setIsCalendarOpen(false);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                            <input type="hidden" name="taskDate" value={date ? date.toISOString() : ""} />

                            {/* Category Pill */}
                            <label className="h-7 px-2.5 rounded-md border border-border/80 bg-surface/90 hover:bg-card hover:border-muted focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/30 flex items-center gap-1.5 transition-all duration-150 shrink-0 cursor-text">
                                <i className="fa-solid fa-tag text-[10px] text-muted shrink-0"></i>
                                <input
                                    name="category"
                                    type="text"
                                    defaultValue={taskToEdit?.category}
                                    placeholder="Category"
                                    className="bg-transparent border-none outline-none text-xs text-primary placeholder:text-muted w-20 sm:w-24 focus:ring-0 p-0 cursor-text"
                                />
                            </label>

                            {/* Status Pill (Edit mode) */}
                            {mode === "edit" && (
                                <Select
                                    key={taskToEdit?.id ? `status-${taskToEdit.id}` : "status-create"}
                                    name="status"
                                    defaultValue={taskToEdit?.status || TaskStatus.NEW}
                                    items={statusItems}
                                >
                                    <SelectTrigger
                                        size="sm"
                                        className="w-auto h-7 px-2.5 rounded-md bg-surface/90 border border-border/80 hover:bg-card hover:border-muted text-xs shrink-0"
                                    >
                                        <div className="flex items-center gap-1.5 truncate">
                                            <span
                                                className={`w-2 h-2 rounded-md shrink-0 ${taskToEdit?.status === TaskStatus.COMPLETED
                                                        ? "bg-emerald-500"
                                                        : taskToEdit?.status === TaskStatus.ACTIVE
                                                            ? "bg-amber-500"
                                                            : taskToEdit?.status === TaskStatus.FAILED
                                                                ? "bg-red-500"
                                                                : "bg-sky-500"
                                                    }`}
                                            />
                                            <SelectValue placeholder="Status" className="text-xs" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(TaskStatus).map((status) => (
                                            <SelectItem key={status} value={status}>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`w-2 h-2 rounded-md shrink-0 ${status === TaskStatus.COMPLETED
                                                                ? "bg-emerald-500"
                                                                : status === TaskStatus.ACTIVE
                                                                    ? "bg-amber-500"
                                                                    : status === TaskStatus.FAILED
                                                                        ? "bg-red-500"
                                                                        : "bg-sky-500"
                                                            }`}
                                                    />
                                                    <span className="text-xs">{status}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 shrink-0">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-3 py-1.5 rounded-md text-xs font-medium text-muted hover:text-primary hover:bg-card transition-colors cursor-pointer shrink-0"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 bg-accent hover:bg-accent-hover text-surface text-xs font-semibold rounded-md shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer whitespace-nowrap shrink-0"
                            >
                                {isPending && <i className="fa-solid fa-circle-notch fa-spin text-[10px]"></i>}
                                <span className="whitespace-nowrap">{mode === "edit" ? "Update Task" : "Create Task"}</span>
                                <span className="hidden sm:inline-block text-[10px] opacity-75 font-mono bg-black/20 px-1 py-0.5 rounded shrink-0">
                                    ⌘↵
                                </span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}