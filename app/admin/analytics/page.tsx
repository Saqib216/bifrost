import { prisma } from "@/app/lib/prisma";
import AnalyticsCharts from "./_components/AnalyticsCharts";

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

    return (
        <div className="mx-10 mb-10">
            <div className="flex flex-col gap-1 mb-6">
                <h2 className="font-semibold text-xl sm:text-2xl tracking-tight text-primary">Analytics</h2>
                <p className="text-sm text-muted font-medium">Team performance and task trends at a glance.</p>
            </div>
            <AnalyticsCharts statusData={statusData} />
        </div>
    );
}