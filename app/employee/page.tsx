import { auth } from "@/auth"
import { prisma } from "../lib/prisma";
import AnimatedNumber from "@/components/AnimatedNumber";
import { getStatusStyle } from "../lib/taskStatusStyles";
import Link from "next/link";

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

    const stats = [
        { label: 'Total Tasks', count: totalTasks, dot: 'bg-info', border: 'border-info/30', text: 'text-info/90', icon: 'fa-solid fa-list-check' },
        { label: 'Active', count: getCount('ACTIVE'), dot: 'bg-warning', border: 'border-warning/30', text: 'text-warning/90', icon: 'fa-solid fa-hourglass-half' },
        { label: 'Completed', count: getCount('COMPLETED'), dot: 'bg-success', border: 'border-success/30', text: 'text-success/90', icon: 'fa-solid fa-circle-check' },
        { label: 'Failed', count: getCount('FAILED'), dot: 'bg-danger', border: 'border-danger/30', text: 'text-danger/90', icon: 'fa-solid fa-circle-xmark' },
    ];

    return (
        <div>
            {/* Greeting */}
            <div className='flex flex-col gap-1 mb-6'>
                <h2 className='font-semibold text-xl sm:text-2xl tracking-tight text-primary'>
                    Welcome back, {session?.user?.name?.split(' ')[0]}
                </h2>
                <p className='text-sm text-muted font-medium'>Here's what's on your plate today.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className={`bg-card rounded-md border ${stat.border} p-4 flex flex-col gap-2`}>
                        <div className="flex items-center gap-2">
                            <i className={`${stat.icon} ${stat.text} text-xs`}></i>
                            <span className="text-xs font-semibold tracking-wider text-muted uppercase">{stat.label}</span>
                        </div>
                        <AnimatedNumber value={stat.count} className={`text-3xl font-bold font-mono ${stat.text}`} />
                    </div>
                ))}
            </div>

            {/* Recent Tasks */}
            <div className='flex items-center justify-between mb-4'>
                <h3 className='font-semibold text-lg tracking-tight text-primary'>Recent Tasks</h3>
                <Link href="/employee/tasks" className="text-xs text-accent hover:text-accent-hover font-medium">
                    View All →
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {tasks.map((task) => {
                    const statusStyle = getStatusStyle(task.status);
                    return (
                        <div key={task.id} className="flex flex-col gap-3 bg-card border border-border rounded-md p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted px-2 py-0.5 bg-surface rounded-md border border-border">
                                    {task.category}
                                </span>
                                <span className={`flex items-center gap-1.5 text-xs font-medium ${statusStyle.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                                    {task.status}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-base font-semibold tracking-tight text-primary leading-snug">{task.title}</h3>
                                <p className="text-xs text-muted line-clamp-2 leading-relaxed">{task.description}</p>
                            </div>
                            <div className="flex items-center gap-1.5 pt-2 border-t border-border text-xs text-muted font-medium">
                                <i className='fa-regular fa-calendar text-[11px]'></i>
                                {task.taskDate.toLocaleDateString()}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty state */}
            {tasks.length === 0 && (
                <div className='flex flex-col items-center justify-center gap-3 py-20 text-center'>
                    <div className='w-12 h-12 flex items-center justify-center bg-card border border-border rounded-md'>
                        <i className='fa-regular fa-folder-open text-xl text-muted'></i>
                    </div>
                    <h3 className='text-lg font-semibold text-secondary'>No tasks assigned yet</h3>
                </div>
            )}
        </div>
    )
}