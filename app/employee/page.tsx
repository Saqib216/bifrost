import { auth } from "@/auth"
import { prisma } from "../lib/prisma";
import AnimatedNumber from "@/components/AnimatedNumber";
import { getStatusStyle } from "../lib/taskStatusStyles";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Employee Portal",
};

export default async function EmployeeDashboardPage() {
    const session = await auth();
    const userId = session?.user?.id;

    const [tasks, tasksCount, user] = await Promise.all([
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
        prisma.user.findUnique({
            where: { id: userId },
            select: { name: true },
        })
    ]);

    const getCount = (status: string) => tasksCount.find(task => task.status === status)?._count ?? 0;

    const totalTasks = tasksCount.reduce((sum, task) => sum + task._count, 0);
    const completedCount = getCount('COMPLETED');
    const activeCount = getCount('ACTIVE');
    const newCount = getCount('NEW');
    const failedCount = getCount('FAILED');
    const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    return (
        <div>
            {/* Greeting */}
            <div className='flex flex-col gap-1 mb-6'>
                <h2 className='font-semibold text-xl sm:text-2xl tracking-tight text-primary'>
                    Welcome, {user?.name?.split(' ')[0]}
                </h2>
                <p className='text-sm text-muted font-medium'>Here's what's on your plate today.</p>
            </div>

            {/* Lead + Side Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">

                {/* Lead Card: Completion Rate */}
                <div className="lg:col-span-3 bg-card border border-border p-5 flex flex-col gap-4 rounded-md">
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-chart-line text-accent/70 text-xs" />
                        <span className="text-xs font-semibold tracking-wider text-muted uppercase">Completion Rate</span>
                    </div>

                    <div className="flex items-baseline gap-1">
                        <AnimatedNumber value={completionRate} className="text-5xl font-bold font-mono text-accent" />
                        <span className="text-3xl font-bold text-accent">%</span>
                    </div>

                    <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${completionRate}%` }}
                        />
                    </div>

                    <span className="text-xs text-muted">
                        <span className="text-secondary font-medium">{completedCount}</span> of <span className="text-secondary font-medium">{totalTasks}</span> tasks completed
                    </span>
                </div>

                {/* Side Cards: Active Tasks + Total Tasks */}
                <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-3">
                    <div className="bg-card rounded-md border border-warning/30 p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-hourglass-half text-warning/90 text-xs" />
                            <span className="text-xs font-semibold tracking-wider text-muted uppercase">Active Tasks</span>
                        </div>
                        <AnimatedNumber value={activeCount} className="text-3xl font-bold font-mono text-warning/90" />
                    </div>
                    <div className="bg-card rounded-md border border-info/30 p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-list-check text-info/90 text-xs" />
                            <span className="text-xs font-semibold tracking-wider text-muted uppercase">Total Tasks</span>
                        </div>
                        <AnimatedNumber value={totalTasks} className="text-3xl font-bold font-mono text-info/90" />
                    </div>
                </div>
            </div>

            {/* Status Strip */}
            <div className="flex items-center gap-5 px-4 py-3 bg-card border border-border rounded-md mb-8">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-info" />
                    <span className="text-xs text-muted font-medium">New</span>
                    <span className="text-sm font-bold font-mono text-primary">{newCount}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                    <span className="text-xs text-muted font-medium">Active</span>
                    <span className="text-sm font-bold font-mono text-primary">{activeCount}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    <span className="text-xs text-muted font-medium">Completed</span>
                    <span className="text-sm font-bold font-mono text-primary">{completedCount}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger" />
                    <span className="text-xs text-muted font-medium">Failed</span>
                    <span className="text-sm font-bold font-mono text-primary">{failedCount}</span>
                </div>
            </div>

            {/* Recent Tasks Feed */}
            <div className='flex items-center justify-between mb-4'>
                <h3 className='font-semibold text-lg tracking-tight text-primary'>Recent Tasks</h3>
                <Link href="/employee/tasks" className="text-xs text-accent hover:text-accent-hover font-medium">
                    View All →
                </Link>
            </div>

            {tasks.length > 0 ? (
                <div className="bg-card border border-border rounded-md divide-y divide-border">
                    {tasks.map((task) => {
                        const statusStyle = getStatusStyle(task.status);
                        return (
                            <div key={task.id} className="flex items-center gap-3 px-4 py-3">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusStyle.dot}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-primary truncate">{task.title}</p>
                                    <p className="text-[11px] text-muted">
                                        {task.category} · {task.taskDate.toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`text-[11px] font-medium shrink-0 ${statusStyle.text}`}>
                                    {task.status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center gap-3 py-16 text-center'>
                    <div className='w-12 h-12 flex items-center justify-center bg-card border border-border rounded-md'>
                        <i className='fa-regular fa-folder-open text-xl text-muted' />
                    </div>
                    <h3 className='text-lg font-semibold text-secondary'>No tasks assigned yet</h3>
                    <p className='text-xs text-muted'>When tasks are assigned to you, they'll show up here.</p>
                </div>
            )}
        </div>
    )
}