import AnimatedNumber from "@/components/AnimatedNumber";
import { prisma } from "../lib/prisma";
import { Metadata } from "next";
import { getStatusStyle } from "../lib/taskStatusStyles";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Overview",
};

export default async function AdminDashboardPage() {
    const [employeesCount, tasksCount, tasksByStatus, recentTasks] = await Promise.all([
        prisma.user.count({
            where: { role: 'EMPLOYEE' },
        }),
        prisma.task.count(),
        prisma.task.groupBy({
            by: ['status'],
            _count: true,
        }),
        prisma.task.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { assignedTo: { select: { name: true } } },
        }),
    ]);

    const getCount = (status: string) => tasksByStatus.find(task => task.status === status)?._count ?? 0;

    const completionRate = tasksCount > 0 ? Math.round((getCount('COMPLETED') / tasksCount) * 100) : 0;
    const completedCount = getCount('COMPLETED');
    const activeCount = getCount('ACTIVE');
    const newCount = getCount('NEW');
    const failedCount = getCount('FAILED');

    return (
        <div>
            {/* Section Header */}
            <div className='flex flex-col gap-1 mb-6'>
                <h2 className='font-semibold text-xl sm:text-2xl tracking-tight text-primary'>Overview</h2>
                <p className='text-sm text-muted font-medium'>Track employees, monitor task progress, and stay on top of your team at a glance.</p>
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
                        <span className="text-secondary font-medium">{completedCount}</span> of <span className="text-secondary font-medium">{tasksCount}</span> tasks completed
                    </span>
                </div>

                {/* Side Cards: Employees + Total Tasks */}
                <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-3">
                    <div className="bg-card rounded-md border border-info/30 p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-users text-info/90 text-xs" />
                            <span className="text-xs font-semibold tracking-wider text-muted uppercase">Employees</span>
                        </div>
                        <AnimatedNumber value={employeesCount} className="text-3xl font-bold font-mono text-info/90" />
                    </div>
                    <div className="bg-card rounded-md border border-warning/30 p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-list-check text-warning/90 text-xs" />
                            <span className="text-xs font-semibold tracking-wider text-muted uppercase">Total Tasks</span>
                        </div>
                        <AnimatedNumber value={tasksCount} className="text-3xl font-bold font-mono text-warning/90" />
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
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg tracking-tight text-primary">Recent Tasks</h3>
                <Link href="/admin/tasks?tab=all" className="text-xs text-accent hover:text-accent-hover font-medium">
                    View All →
                </Link>
            </div>

            {recentTasks.length > 0 ? (
                <div className="bg-card border border-border rounded-md divide-y divide-border">
                    {recentTasks.map((task) => {
                        const statusStyle = getStatusStyle(task.status);
                        return (
                            <div key={task.id} className="flex items-center gap-3 px-4 py-3">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusStyle.dot}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-primary truncate">{task.title}</p>
                                    <p className="text-[11px] text-muted">
                                        {task.assignedTo.name} · {task.taskDate.toLocaleDateString()}
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
                    <h3 className='text-lg font-semibold text-secondary'>No tasks yet</h3>
                    <p className='text-xs text-muted'>Create your first task to get started.</p>
                </div>
            )}
        </div>
    )
}