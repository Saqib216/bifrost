"use client";

import { createTask } from "@/app/lib/actions";
import { useActionState, useEffect, useState } from "react";

interface Employee {
    id: string;
    name: string;
    email: string;
}

export default function TasksModal({ employees }: { employees: Employee[] }) {
    const [isOpen, setIsOpen] = useState(false);

    const [state, formAction] = useActionState(createTask, { errors: {} });

    useEffect(() => {
        if (state.errors && Object.keys(state.errors).length === 0) {
            setIsOpen(false);
        }
    }, [state]);

    return (
        <div className="mt-10">
            {/* Section Header */}
            <div className='flex flex-col gap-1 mb-6'>
                <h2 className='font-semibold text-xl sm:text-2xl tracking-tight text-primary'>Assign Tasks</h2>
                <p className='text-sm text-muted font-medium'>Want to assign more tasks to employees? Click the button below</p>
            </div>

            {/* Add Task button */}
            <button
                onClick={() => {
                    setIsOpen(true);
                }}
                className="absolute left-[50%] px-3 py-1.5 bg-accent rounded-md font-semibold text-surface cursor-pointer transition-all duration-250 ease-in-out hover:bg-accent-hover active:scale-95 tracking-tight text-sm">
                Add Task
            </button>

            {/* Create Task Modal */}
            {
                isOpen && (
                    <div id='create-task-modal-overlay' className="bg-surface/50 backdrop-blur-xs w-full h-full z-1000 fixed inset-0 flex justify-center items-center">
                        <div id="create-task-modal-content"
                            className="w-3/4 h-3/4 bg-surface rounded-md border border-border p-4 transition-all duration-200 ease-in-out">
                            <form action={formAction}>
                                {/* Modal header  */}
                                <div className="flex justify-between">
                                    <h2 className='font-semibold text-lg sm:text-2xl tracking-tight text-primary'>Create a Task</h2>
                                    <span
                                        onClick={() => {
                                            setIsOpen(false);
                                        }}
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
                                            type="text" placeholder='Make a Navbar component in react' className='border border-border rounded-md p-2 bg-card w-full placeholder:text-muted transition-all duration-150 ease-in-out hover:border-muted focus:border-primary focus:ring-4 focus:ring-focus-ring text-base sm:text-sm' />
                                        {
                                            state.errors?.title && (
                                                <p className="text-danger text-xs">{state.errors.title[0]}</p>
                                            )
                                        }
                                    </div>

                                    <div className='col-span-5 sm:col-span-2 flex flex-col gap-1'>
                                        <h3 className='flex gap-1 items-center'>Assign to <span className='w-1.5 h-1.5 rounded-full bg-danger inline-block'></span></h3>
                                        <select
                                            name="assignedTo"
                                            id="employee-names"
                                            className='rounded-md p-2 w-full transition-all duration-150 ease-in-out sm:text-base'
                                        >
                                            {employees.map((employee) => (
                                                <option className='text-base sm:text-sm' value={employee.id} key={employee.id}>
                                                    {employee.name}
                                                </option>
                                            ))}
                                        </select>

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
                                            type="text" placeholder='programming, dev, design, etc...' className='outline-none border border-border rounded-md p-2 w-full placeholder:text-muted bg-card transition-all duration-150 ease-in-out hover:border-muted focus:border-primary focus:ring-4 focus:ring-focus-ring text-base sm:text-sm' />

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
                                            className='border border-border rounded-md p-2 w-full bg-card text-primary transition-all duration-150 ease-in-out hover:border-muted focus:border-primary focus:ring-4 focus:ring-focus-ring cursor-pointer text-base sm:text-sm'
                                        />

                                        {
                                            state.errors?.taskDate && (
                                                <p className="text-danger text-xs">{state.errors.taskDate[0]}</p>
                                            )
                                        }
                                    </div>

                                    <div className='flex flex-col gap-1 col-span-5' id='taskDesc'>
                                        <h3>Description</h3>
                                        <textarea
                                            name="description"
                                            placeholder='Add Description' className='border border-border rounded-md p-2 w-full placeholder:text-muted min-h-30 bg-card
                        transition-colors duration-150 ease-in-out hover:border-muted focus:border-primary focus:ring-4 focus:ring-focus-ring text-base sm:text-sm'></textarea>
                                        {
                                            state.errors?.description && (
                                                <p className="text-danger text-xs">{state.errors.description}</p>
                                            )
                                        }
                                    </div>
                                </div>

                                {/* Add Task Button */}
                                <div className='flex justify-end mt-5'>
                                    <button
                                        className="px-3 py-1.5 bg-accent rounded-md font-semibold text-surface cursor-pointer transition-all duration-250 ease-in-out hover:bg-accent-hover active:scale-95 tracking-tight text-sm">
                                        Add Task
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