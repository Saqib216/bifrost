import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import TaskFilters from "../_components/TaskFilters";

export default async function EmployeeProfilePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ status?: string; search?: string }>; }) {
    const { id } = await params;
    const { status, search } = await searchParams;

    const employee = await prisma.user.findUnique({
        where: { id },
        select: {
            name: true,
            email: true,
            role: true,
            tasks: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true,
                    status: true,
                    taskDate: true,
                },
                orderBy: { taskDate: "desc" },
            },
        },
    });

    if (!employee) {
        notFound();
    }

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const counts = {
        NEW: employee.tasks.filter((t) => t.status === "NEW").length,
        ACTIVE: employee.tasks.filter((t) => t.status === "ACTIVE").length,
        COMPLETED: employee.tasks.filter((t) => t.status === "COMPLETED").length,
        FAILED: employee.tasks.filter((t) => t.status === "FAILED").length,
    };

    const stats = [
        { label: "New", count: counts.NEW, color: "text-info", border: "border-info/20", dot: "bg-info" },
        { label: "Active", count: counts.ACTIVE, color: "text-warning", border: "border-warning/20", dot: "bg-warning" },
        { label: "Completed", count: counts.COMPLETED, color: "text-success", border: "border-success/20", dot: "bg-success" },
        { label: "Failed", count: counts.FAILED, color: "text-danger", border: "border-danger/20", dot: "bg-danger" },
    ];

    const statusMap = {
        NEW: { label: "New", dot: "bg-info", text: "text-info" },
        ACTIVE: { label: "Active", dot: "bg-warning", text: "text-warning" },
        COMPLETED: { label: "Completed", dot: "bg-success", text: "text-success" },
        FAILED: { label: "Failed", dot: "bg-danger", text: "text-danger" },
    } as const;

    // Filtering Logic
    const filteredTasks = employee.tasks.filter((task) => {
        const matchesStatus = status ? task.status === status : true;
        const matchesSearch = search ? task.title.toLowerCase().includes(search.toLowerCase()) : true;

        return matchesStatus && matchesSearch;
    });

    return (
        <div className="mx-4 sm:mx-10 mb-10">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-bold text-lg font-mono">
                    {getInitials(employee.name)}
                </div>
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-primary">{employee.name}</h1>
                    <div className="flex items-center gap-3 text-sm text-muted">
                        <span className="flex items-center gap-1.5">
                            <i className="fa-regular fa-envelope text-xs" />
                            {employee.email}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 bg-card border border-border rounded-md text-secondary">
                            {employee.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            {employee.tasks.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className={`bg-card border ${stat.border} rounded-md p-4 flex flex-col gap-2`}>
                            <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${stat.dot}`}></span>
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted">{stat.label}</span>
                            </div>
                            <span className={`text-2xl sm:text-3xl font-bold tracking-tight font-mono ${stat.color}`}>{stat.count}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <TaskFilters />

            {/* Task Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredTasks.map((task) => {
                    const taskStatus = statusMap[task.status];
                    return (
                        <div key={task.id} className="flex flex-col gap-3 bg-card border border-border rounded-md p-3 sm:p-4 hover:border-border-hover transition-colors duration-200">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted px-2 py-0.5 bg-surface rounded-md border border-border">
                                    {task.category}
                                </span>
                                <span className={`flex items-center gap-1.5 text-xs font-medium ${taskStatus.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${taskStatus.dot}`}></span>
                                    {taskStatus.label}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <h3 className="text-base font-semibold tracking-tight text-primary leading-snug">{task.title}</h3>
                                <p className="text-xs text-muted line-clamp-2 leading-relaxed">{task.description}</p>
                            </div>
                            <div className="flex items-center pt-2 border-t border-border">
                                <span className="text-xs text-muted font-medium flex items-center gap-1.5">
                                    <i className="fa-regular fa-calendar text-[11px]" />
                                    {task.taskDate.toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-card border border-border rounded-md">
                        <i className="fa-regular fa-folder-open text-xl text-muted" />
                    </div>
                    <p className="text-sm font-medium text-secondary">
                        {employee.tasks.length === 0 ? "No tasks assigned yet" : "No tasks match your filters"}
                    </p>
                </div>
            )}

        </div>
    );
}