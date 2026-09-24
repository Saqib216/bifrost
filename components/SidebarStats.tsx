import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";

export default async function SidebarStats({ role }: { role: "ADMIN" | "EMPLOYEE" }) {
    if (role === "ADMIN") {
        const [employeeCount, pendingTasksCount] = await Promise.all([
            prisma.user.count({ where: { role: "EMPLOYEE" } }),
            prisma.task.count({ where: { status: { in: ["ACTIVE", "NEW"] } } }),
        ]);

        return (
            <div className="px-3 py-3 rounded-md bg-card border border-border flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-wider text-muted uppercase">Workspace</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    <Link
                        href="/admin/employees"
                        className="group flex flex-col gap-0.5"
                    >
                        <span className="text-[10px] text-muted font-medium group-hover:text-primary transition-colors">Team</span>
                        <span className="text-base font-bold font-mono text-primary leading-tight">{employeeCount}</span>
                    </Link>
                    <Link
                        href="/admin/tasks?tab=all"
                        className="group flex flex-col gap-0.5"
                    >
                        <span className="text-[10px] text-muted font-medium group-hover:text-primary transition-colors">Pending</span>
                        <span className="text-base font-bold font-mono text-warning leading-tight">{pendingTasksCount}</span>
                    </Link>
                </div>
            </div>
        );
    }

    const session = await auth();
    const userId = session?.user?.id;
    const [activeCount, completedCount] = userId
        ? await Promise.all([
            prisma.task.count({ where: { userId, status: { in: ["ACTIVE", "NEW"] } } }),
            prisma.task.count({ where: { userId, status: "COMPLETED" } }),
        ])
        : [0, 0];

    return (
        <div className="px-3 py-3 rounded-md bg-card border border-border flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-wider text-muted uppercase">My Work</span>
                <span className="w-1.5 h-1.5 rounded-full bg-info" />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                <Link
                    href="/employee/tasks?status=ACTIVE"
                    className="group flex flex-col gap-0.5"
                >
                    <span className="text-[10px] text-muted font-medium group-hover:text-primary transition-colors">To Do</span>
                    <span className="text-base font-bold font-mono text-warning leading-tight">{activeCount}</span>
                </Link>
                <Link
                    href="/employee/tasks?status=COMPLETED"
                    className="group flex flex-col gap-0.5"
                >
                    <span className="text-[10px] text-muted font-medium group-hover:text-primary transition-colors">Done</span>
                    <span className="text-base font-bold font-mono text-success leading-tight">{completedCount}</span>
                </Link>
            </div>
        </div>
    );
}
