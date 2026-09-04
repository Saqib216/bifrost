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
        { label: 'Total Employees', count: employeesCount, dot: 'bg-info', border: 'border-info/30', text:'text-info/90'},
        { label: 'Total Tasks', count: tasksCount, dot: 'bg-warning', border: 'border-warning/30', text: 'text-warning/90' },
        { label: 'Completed Tasks', count: getCount('COMPLETED'), dot: 'bg-success', border: 'border-success/30', text: 'text-success/90' },
        { label: 'Pending Tasks', count: getCount('ACTIVE'), dot: 'bg-danger', border: 'border-danger/30', text: 'text-danger/90'},
    ];

    return (
        <div>
            {/* Section Header */}
            <div className='flex flex-col gap-1 mb-6'>
                <h2 className='font-semibold text-xl sm:text-2xl tracking-tight text-primary'>Overview</h2>
                <p className='text-sm text-muted font-medium'>Track employees, monitor task progress, and stay on top of your workforce at a glance.</p>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {
                    globalStats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`bg-card rounded-md border ${stat.border} p-4 flex flex-col gap-2`}
                        >
                            <div className="flex items-center gap-2">
                                <span className={`${stat.dot} w-1.5 h-1.5 rounded-full`}></span>
                                <span className="text-xs font-semibold tracking-wider text-muted uppercase">{stat.label}</span>
                            </div>
                            <span className={`text-3xl font-bold font-mono ${stat.text}`}>{stat.count}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}