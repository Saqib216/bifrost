import { prisma } from "@/app/lib/prisma";
import TasksBoard from "@/app/admin/_components/TasksBoard";

export default async function AdminTasksViewPage() {
    const employees = await prisma.user.findMany({
        where: { role: 'EMPLOYEE' },
        select: {
            id: true,
            name: true,
            email: true,
            tasks: true,
        },
    });

    return (
        <div className="mx-10">
            <TasksBoard employees={employees} />
        </div>
    )
}