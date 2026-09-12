'use client';

import AnimatedNumber from "@/components/AnimatedNumber";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface AnalyticsChartsProps {
    statusData: { status: string, count: number }[];
    employeeData: { name: string; count: number }[];
    timelineData: { date: string; count: number }[];
    completionData: { name: string; rate: number }[];
    kpis: { totalTasks: number; overallCompletionRate: number; activeEmployees: number };
}

const tooltipStyle = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
}

const statusColors: Record<string, string> = {
    New: "var(--color-info)",
    Active: "var(--color-warning)",
    Completed: "var(--color-success)",
    Failed: "var(--color-danger)",
};

// Rotated tick label - fixes names getting skipped
const angledTick = { angle: -20, textAnchor: "end" as const, fontSize: 12, fill: "var(--color-muted)" };

export default function AnalyticsCharts({ statusData, employeeData, timelineData, completionData, kpis }: AnalyticsChartsProps) {
    return (
        <div className="flex flex-col gap-4">

            {/* KPI Strip */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">Total Tasks</span>
                    <AnimatedNumber value={kpis.totalTasks} className="text-2xl font-bold font-mono text-primary" />
                </div>
                <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">Completion Rate</span>
                    <span className="text-2xl font-bold font-mono text-primary">
                        <AnimatedNumber value={kpis.overallCompletionRate} />%
                    </span>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">Active Employees</span>
                    <AnimatedNumber value={kpis.activeEmployees} className="text-2xl font-bold font-mono text-primary" />
                </div>
            </div>

            {/* Hero Chart - Timeline, full width */}
            <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold text-secondary mb-4">Tasks Over Time</h3>
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={timelineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                        <XAxis dataKey="date" stroke="var(--color-muted)" fontSize={12} />
                        <YAxis stroke="var(--color-muted)" fontSize={12} allowDecimals={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Line type="linear" dataKey="count" stroke="#F2266E" strokeWidth={2} dot={{ fill: "#F2266E", r: 3 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Secondary charts - 3 column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                <div className="bg-card border border-border rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-secondary mb-4">Tasks by Status</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={statusData} margin={{ bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                            <XAxis dataKey="status" tick={{ fontSize: 12, fill: "var(--color-muted)" }} />
                            <YAxis stroke="var(--color-muted)" fontSize={12} allowDecimals={false} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar
                                dataKey="count"
                                radius={[4, 4, 0, 0]}
                                shape={(props) => (
                                    <Rectangle
                                        {...props}
                                        fill={statusColors[props.payload?.status] ?? "var(--color-primary)"}
                                    />
                                )}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-card border border-border rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-secondary mb-4">Tasks per Employee</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={employeeData} margin={{ bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                            <XAxis dataKey="name" interval={0} tick={angledTick} />
                            <YAxis stroke="var(--color-muted)" fontSize={12} allowDecimals={false} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="count" fill="#F2266E" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-card border border-border rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-secondary mb-4">Completion Rate (%)</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={completionData} margin={{ bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                            <XAxis dataKey="name" interval={0} tick={angledTick} />
                            <YAxis stroke="var(--color-muted)" fontSize={12} domain={[0, 100]} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="rate" fill="#F2266E" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
}