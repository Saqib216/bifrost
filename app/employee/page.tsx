import { auth } from "@/auth"
import { prisma } from "../lib/prisma";

export default async function EmployeeDashboardPage() {
    const session = await auth();
    const userId = session?.user?.id;

    const [tasks, tasksCount] = await Promise.all([
        prisma.task.findMany({
            where: { userId },
            orderBy: { taskDate: 'desc' },
            take: 5,
        }),
        prisma.task.groupBy({
            by: ['status'],
            where: { userId },
            _count: true,
        }),
    ]);

    const getCount = (status: string) => tasksCount.find(task => task.status === status)?._count ?? 0;

    const totalTasks = tasksCount.reduce((sum, task) => sum + task._count, 0);

    return (
        <div>

        </div>
    )
}