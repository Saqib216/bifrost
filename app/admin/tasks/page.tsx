export default function AdminTasksViewPage() {
    const tasks = [
        {
            title: 'Server migration',
            description: 'Migrate legacy server infrastructure to new cloud provider.',
            category: 'DevOps',
            status: 'New',
            taskDate: new Date('2026-07-01'),
        },
        {
            title: 'Payment gateway integration',
            description: 'Integrate Stripe payment gateway into checkout flow.',
            category: 'Backend',
            status: 'Completed',
            taskDate: new Date('2026-07-06'),
        },
        {
            title: 'Security audit',
            description: 'Run a full security audit on the authentication system.',
            category: 'Security',
            status: 'Active',
            taskDate: new Date('2026-07-12'),
        },
    ];

    const stats = [
        { label: 'New', count: 2, dot: 'bg-info' },
        { label: 'Active', count: 2, dot: 'bg-warning' },
        { label: 'New', count: 2, dot: 'bg-success' },
        { label: 'New', count: 2, dot: 'bg-danger' },
    ]

    return (
        <div className="mx-10 mb-10">

            {/* Stat Cards: */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-card rounded-md border border-border p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className={`${stat.dot} w-1.5 h-1.5 rounded-full`}></span>
                            <span className="text-xs font-semibold tracking-wider text-muted uppercase">{stat.label}</span>
                        </div>
                        <span className="text-3xl font-bold font-mono">{stat.count}</span>
                    </div>
                ))}
            </div>

            {/* Tasks Grid */}
            
        </div>
    )
}