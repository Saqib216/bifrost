import { prisma } from "@/app/lib/prisma";
import TasksBoard from "@/app/admin/_components/TasksBoard";
import { Metadata } from "next";

const TASKS_PER_PAGE = 9;

export const metadata: Metadata = {
    title: "Tasks",
};

export default async function AdminTasksViewPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string; page?: string }>;
}) {
    const { tab, page } = await searchParams;
    const currentPage = Number(page) || 1;

    const employees = await prisma.user.findMany({
        where: { role: 'EMPLOYEE' },
        orderBy: { name: 'asc' },
        select: {
            id: true,
            name: true,
            email: true,
            tasks: true,
        },
    });

    let allTasksData = null;

    if (tab === 'all') {
        const [tasks, totalCount] = await Promise.all([
            prisma.task.findMany({
                where: { assignedTo: { role: 'EMPLOYEE' } },
                include: { assignedTo: { select: { id: true, name: true, email: true } } },
                orderBy: { createdAt: 'desc' },
                skip: (currentPage - 1) * TASKS_PER_PAGE,
                take: TASKS_PER_PAGE,
            }),
            prisma.task.count({ where: { assignedTo: { role: 'EMPLOYEE' } } }),
        ]);

        allTasksData = {
            tasks,
            totalPages: Math.max(1, Math.ceil(totalCount / TASKS_PER_PAGE)),
            currentPage,
        };
    }

    return (
        <div className="mx-10">
            <TasksBoard employees={employees} allTasksData={allTasksData} />
        </div>
    )
}