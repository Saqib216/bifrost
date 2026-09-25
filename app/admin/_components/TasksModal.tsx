"use client";

import { createTask, updateTask } from "@/app/lib/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task, TaskStatus } from "@prisma/client";
import { useActionState, useEffect, useState } from "react";
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

    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => { setIsVisible(true) });
        }
    }, [isOpen]);

    const closeModal = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 200);
    }

    const updateTaskWithId = taskToEdit ? updateTask.bind(null, taskToEdit.id) : null;

    const [state, formAction] = useActionState(
        mode === 'edit' && updateTaskWithId ? updateTaskWithId : createTask,
        { success: false, errors: {} }
    );

    useEffect(() => {
        if (state.success) {
            closeModal();
            toast.success(mode === "edit" ? "Task updated successfully" : "New Task created");
        }
        else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    const employeeItems = Object.fromEntries(employees.map((e) => [e.id, e.name]));
    const statusItems = Object.fromEntries(Object.values(TaskStatus).map((s) => [s, s]));

    return (
        <div>
            {/* Dynamic Create + Edit  Task Modal */}
            {
                isOpen && (
                    <div id='create-task-modal-overlay' className={`bg-surface/50 backdrop-blur-xs w-full h-full z-1000 fixed inset-0 flex justify-center items-center transition-opacity duration-200 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <div id="create-task-modal-content"
                            className={`w-3/4 h-3/4 bg-surface rounded-md border border-border p-4 transition-all duration-200 ease-in-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                            <form action={formAction}>

                                {/* Modal header  */}
                                <div className="flex justify-between">
                                    <h2 className='font-semibold text-lg sm:text-2xl tracking-tight text-primary'>{mode === 'edit' ? 'Edit Task' : 'Create a Task'}</h2>
                                    <span
                                        onClick={closeModal}
                                        className="text-xl cursor-pointer px-2">
                                        <i className="fa-solid fa-xmark"></i>
                                    </span>
                                </div>
                                <div className='grid grid-cols-5 gap-x-6 gap-y-5 mt-5'>
                                    <div className='col-span-5 sm:col-span-3 flex flex-col gap-1'>
                                        <h3 className='flex gap-1 items-center'>Task Title <span className='w-1.5 h-1.5 rounded-full bg-danger inline-block'></span>
                                        </h3>
                                        <input
                                            name="title"
                                            type="text"
                                            defaultValue={taskToEdit?.title}
                                            placeholder='Make a Navbar component in react'
                                            className='border border-border rounded-md p-2 bg-card w-full placeholder:text-muted transition-all duration-150 ease-in-out hover:border-muted focus:border-accent focus:ring-4 focus:ring-accent/30 text-base sm:text-sm' />
                                        {
                                            state.errors?.title && (
                                                <p className="text-danger text-xs">{state.errors.title[0]}</p>
                                            )
                                        }
                                    </div>

                                    <div className='col-span-5 sm:col-span-2 flex flex-col gap-1'>
                                        <h3 className='flex gap-1 items-center'>Assign to <span className='w-1.5 h-1.5 rounded-full bg-danger inline-block'></span></h3>
                                        <Select
                                            key={taskToEdit?.id ?? "create-assigned"}
                                            name="assignedTo"
                                            defaultValue={taskToEdit?.userId}
                                            items={employeeItems}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select employee" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {employees.map((employee) => (
                                                    <SelectItem key={employee.id} value={employee.id}>
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-5 h-5 rounded-full bg-accent/15 text-accent text-[10px] font-semibold flex items-center justify-center shrink-0">
                                                                {employee.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                                                            </span>
                                                            <span className="truncate">{employee.name}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {
                                            state.errors?.userId && (
                                                <p className="text-danger text-xs">{state.errors.userId[0]}</p>
                                            )
                                        }
                                    </div>

                                    <div className='col-span-5 sm:col-span-2 flex flex-col gap-1'>
                                        <h3 className='flex gap-1 items-center'>Category <span className='w-1.5 h-1.5 rounded-full bg-danger inline-block'></span></h3>
                                        <input
                                            name="category"
                                            type="text"
                                            defaultValue={taskToEdit?.category}
                                            placeholder='programming, dev, design, etc...'
                                            className='border border-border rounded-md p-2 w-full placeholder:text-muted bg-card transition-all duration-150 ease-in-out hover:border-muted focus:border-accent focus:ring-4 focus:ring-accent/30 text-base sm:text-sm' />

                                        {
                                            state.errors?.category && (
                                                <p className="text-danger text-xs">{state.errors.category[0]}</p>
                                            )
                                        }
                                    </div>

                                    <div className='col-span-5 sm:col-span-2 flex flex-col gap-1'>
                                        <h3 className='flex gap-1 items-center'>
                                            Date <span className='w-1.5 h-1.5 rounded-full bg-danger inline-block'></span>
                                        </h3>
                                        <input
                                            name="taskDate"
                                            type="date"
                                            defaultValue={taskToEdit?.taskDate ? new Date(taskToEdit.taskDate).toISOString().split('T')[0] : ''}
                                            className='border border-border rounded-md p-2 w-full bg-card text-primary transition-all duration-150 ease-in-out hover:border-muted focus:border-accent focus:ring-4 focus:ring-accent/30 cursor-pointer text-base sm:text-sm'
                                        />

                                        {
                                            state.errors?.taskDate && (
                                                <p className="text-danger text-xs">{state.errors.taskDate[0]}</p>
                                            )
                                        }
                                    </div>

                                    {mode === 'edit' && (
                                        <div className='col-span-5 sm:col-span-1 flex flex-col gap-1'>
                                            <h3 className='flex gap-1 items-center'>
                                                Status <span className='w-1.5 h-1.5 rounded-full bg-danger inline-block'></span>
                                            </h3>
                                            <Select
                                                key={taskToEdit?.id ? `status-${taskToEdit.id}` : "status-create"}
                                                name="status"
                                                defaultValue={taskToEdit?.status || TaskStatus.NEW}
                                                items={statusItems}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.values(TaskStatus).map((status) => (
                                                        <SelectItem key={status} value={status}>
                                                            {status}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {state.errors?.status && (
                                                <p className="text-danger text-xs">{state.errors.status[0]}</p>
                                            )}
                                        </div>
                                    )}

                                    <div className='flex flex-col gap-1 col-span-5' id='taskDesc'>
                                        <h3>Description</h3>
                                        <textarea
                                            name="description"
                                            defaultValue={taskToEdit?.description}
                                            placeholder='Add Description'
                                            className='border border-border rounded-md p-2 w-full placeholder:text-muted min-h-30 bg-card transition-all duration-150 ease-in-out hover:border-muted focus:border-accent focus:ring-4 focus:ring-accent/30 text-base sm:text-sm'>
                                        </textarea>
                                    </div>
                                </div>

                                {/* Add + Edit Task Button */}
                                <div className='flex justify-end mt-5'>
                                    <button
                                        className="px-3 py-1.5 bg-accent rounded-md font-semibold text-surface cursor-pointer transition-all duration-250 ease-in-out hover:bg-accent-hover active:scale-95 tracking-tight text-sm">
                                        {mode === 'edit' ? 'Update Task' : 'Add Task'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    )
}