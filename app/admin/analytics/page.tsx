import { prisma } from "@/app/lib/prisma";
import AnalyticsCharts from "./_components/AnalyticsCharts";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Analytics",
};

export default async function AnalyticsPage() {
    const tasks = await prisma.task.findMany({
        select: {
            status: true,
            taskDate: true,
            assignedTo: { select: { name: true } },
        },
    });

    const statusData = [
        { status: "New", count: tasks.filter(t => t.status === "NEW").length },
        { status: "Active", count: tasks.filter(t => t.status === "ACTIVE").length },
        { status: "Completed", count: tasks.filter(t => t.status === "COMPLETED").length },
        { status: "Failed", count: tasks.filter(t => t.status === "FAILED").length },
    ];

    // 2. Tasks per employee
    const employeeGroups = tasks.reduce((acc, task) => {
        const name = task.assignedTo.name;
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const employeeData = Object.entries(employeeGroups).map(([name, count]) => ({ name, count }));

    // 3. Tasks Over Time (data bucketing)
    const dateGroups = tasks.reduce((acc, task) => {
        const dateKey = task.taskDate.toISOString().split('T')[0];
        acc[dateKey] = (acc[dateKey] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const timelineData = Object.entries(dateGroups).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));

    // 4. Completion Rate per Employee
    const employeeStats = tasks.reduce((acc, task) => {
        const name = task.assignedTo.name;
        if (!acc[name]) acc[name] = { total: 0, completed: 0 };
        acc[name].total += 1;
        if (task.status === 'COMPLETED') acc[name].completed += 1;
        return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    const completionData = Object.entries(employeeStats).map(([name, { total, completed }]) => ({
        name,
        rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    }));

    // KPI strip data
    const totalTasks = tasks.length;
    const completedCount = tasks.filter(t => t.status === "COMPLETED").length;
    const overallCompletionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
    const activeEmployees = employeeData.length;

    return (
        <div className="mx-0 sm:mx-6 lg:mx-10 mb-10">
            <div className="flex flex-col gap-1 mb-6">
                <h2 className="font-semibold text-xl sm:text-2xl tracking-tight text-primary">Analytics</h2>
                <p className="text-sm text-muted font-medium">Team performance and task trends at a glance.</p>
            </div>
            <AnalyticsCharts
                statusData={statusData}
                employeeData={employeeData}
                timelineData={timelineData}
                completionData={completionData}
                kpis={{ totalTasks, overallCompletionRate, activeEmployees }}
            />
        </div>
    );
}