import AnimatedNumber from "@/components/AnimatedNumber";
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
        { label: 'Total Employees', count: employeesCount, dot: 'bg-info', border: 'border-info/30', text: 'text-info/90', icon: 'fa-solid fa-users' },
        { label: 'Total Tasks', count: tasksCount, dot: 'bg-warning', border: 'border-warning/30', text: 'text-warning/90', icon: 'fa-solid fa-list-check' },
        { label: 'Completed Tasks', count: getCount('COMPLETED'), dot: 'bg-success', border: 'border-success/30', text: 'text-success/90', icon: 'fa-solid fa-circle-check' },
        { label: 'Pending Tasks', count: getCount('ACTIVE'), dot: 'bg-danger', border: 'border-danger/30', text: 'text-danger/90', icon: 'fa-solid fa-hourglass-half' },
    ];

    const completionRate = tasksCount > 0 ? Math.round((getCount('COMPLETED') / tasksCount) * 100) : 0;

    return (
        <div>
            {/* Section Header */}
            <div className='flex flex-col gap-1 mb-6'>
                <h2 className='font-semibold text-xl sm:text-2xl tracking-tight text-primary'>Overview</h2>
                <p className='text-sm text-muted font-medium'>Track employees, monitor task progress, and stay on top of your team at a glance.</p>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                {
                    globalStats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`bg-card rounded-md border ${stat.border} p-4 flex flex-col gap-2`}
                        >
                            <div className="flex items-center gap-2">
                                <i className={`${stat.icon} ${stat.text} text-xs`}></i>
                                <span className="text-xs font-semibold tracking-wider text-muted uppercase">{stat.label}</span>
                            </div>
                            <AnimatedNumber value={stat.count} className={`text-3xl font-bold font-mono ${stat.text}`} />
                        </div>
                    ))
                }
            </div>

            {/* Completion Rate - Hero Card */}
            <div className="bg-card rounded-md border border-accent/30 p-5 flex flex-col gap-3 mb-3">
                <div className="flex items-center gap-2">
                    <i className="fa-solid fa-chart-line text-accent/70 text-xs"></i>
                    <span className="text-xs font-semibold tracking-wider text-muted uppercase">Completion Rate</span>
                </div>

                <div className="flex items-baseline ">
                    <AnimatedNumber value={completionRate} className="text-4xl font-bold font-mono text-accent" />
                    <span className="text-2xl font-bold text-accent">%</span>
                    <span className="ml-2 text-xs text-muted">({getCount('COMPLETED')} of {tasksCount} tasks)</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden mt-1">
                    <div
                        className="h-full bg-accent rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${completionRate}%` }}
                    ></div>
                </div>
            </div>
        </div>
    )
}