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

    const getCount = (status: string) => tasksByStatus.find(task => task.status === status)?._count ?? 0;

    const globalStats = [
        { label: 'Total Employees', count: employeesCount },
        { label: 'Total Tasks', count: tasksCount },
        { label: 'Completed Tasks', count: getCount('COMPLETED') },
        { label: 'Pending Tasks', count: getCount('ACTIVE') },
    ];

    return (
        <div>
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {
                    globalStats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-card rounded-md border border-border p-4 flex flex-col gap-2"
                        >
                            <div className="flex items-center gap-2">
                                {/* <span className={`${stat.dot} w-1.5 h-1.5 rounded-full`}></span> */}
                                <span className="text-xs font-semibold tracking-wider text-muted uppercase">{stat.label}</span>
                            </div>
                            <span className="text-3xl font-bold font-mono">{stat.count}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}