'use client';

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface AnalyticsChartsProps {
    statusData: { status: string, count: number }[];
    employeeData: { name: string; count: number }[];
    timelineData: { date: string; count: number }[];
}

const tooltipStyle = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
}

export default function AnalyticsCharts({ statusData, employeeData, timelineData }: AnalyticsChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Tasks by Status */}
            <div className="bg-card border border-border rounded-md p-4">
                <h3 className="text-sm font-semibold text-secondary mb-4">Tasks by Status</h3>
                <ResponsiveContainer width='100%' height={260}>
                    <BarChart data={statusData}>
                        <CartesianGrid strokeDasharray='3 3' stroke="var(--color-border)" />
                        <XAxis dataKey="status" stroke="var(--color-muted)" fontSize={12} />
                        <YAxis stroke="var(--color-muted)" fontSize={12} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey='count' fill="#F2266E" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Tasks per Employee */}
            <div className="bg-card border border-border rounded-md p-4">
                <h3 className="text-sm font-semibold text-secondary mb-4">Tasks per Employee</h3>
                <ResponsiveContainer width='100%' height={260}>
                    <BarChart data={employeeData}>
                        <CartesianGrid strokeDasharray='3 3' stroke="var(--color-border)" />
                        <XAxis dataKey="name" stroke="var(--color-muted)" fontSize={12} />
                        <YAxis stroke="var(--color-muted)" fontSize={12} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey='count' fill="#F2266E" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Tasks over Time */}
            <div className="bg-card border border-border rounded-md p-4">
                <h3 className="text-sm font-semibold text-secondary mb-4">Tasks Over Time</h3>
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={timelineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis dataKey="date" stroke="var(--color-muted)" fontSize={12} />
                        <YAxis stroke="var(--color-muted)" fontSize={12} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Line type="monotone" dataKey="count" stroke="#F2266E" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}