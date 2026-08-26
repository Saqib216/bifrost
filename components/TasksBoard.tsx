"use client";

import { Task, TaskStatus } from "@prisma/client";

interface Employee {
    id: string,
    name: string,
    email: string,
    tasks: Task[],
}

export default function TasksBoard({ employees }: { employees: Employee[] }) {


    return (
        <>
            
        </>
    )

}