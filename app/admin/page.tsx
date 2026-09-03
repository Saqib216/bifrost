import { prisma } from "../lib/prisma"

export default async function AdminDashboardPage() {
    const [employeesCount, tasksCount, tasksByStatus] = await Promise.all([prisma.user.count({
        where: { role: 'EMPLOYEE' },
    }),
    prisma.task.count(),
    prisma.task.groupBy({
        by: ['status'],
        _count: true,
    }),
    ]);


    return (
        <div>Hello this is admin page.</div>
    )
}