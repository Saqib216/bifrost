'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AnalyticsCharts({ statusData }: { statusData: { status: string; count: number }[] }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-md p-4">
                <h3 className="text-sm font-semibold text-secondary mb-4">Tasks by Status</h3>
                <ResponsiveContainer width='100%' height={260}>
                    <BarChart data={statusData}>
                        <CartesianGrid strokeDasharray='3 3' stroke="var(--color-border)" />
                        <XAxis dataKey="status" stroke="var(--color-muted)" fontSize={12} />
                        <YAxis stroke="var(--color-muted)" fontSize={12} />
                        <Tooltip contentStyle={{background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '6px'}} />
                        <Bar dataKey='count' fill="#F2266E" radius={[4,4,0,0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}