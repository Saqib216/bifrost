interface Task {
    id: number;
    title: string;
    description: string;
    category: string;
    status: string;
    taskDate: string;
}

export default function AdminTasksViewPage() {
    const tasks: Task[] = [
        {
            id: 1,
            title: 'Server migration',
            description: 'Migrate legacy server infrastructure to new cloud provider.',
            category: 'DevOps',
            status: 'New',
            taskDate: '2026-07-01',
        },
        {
            id: 2,
            title: 'Payment gateway integration',
            description: 'Integrate Stripe payment gateway into checkout flow.',
            category: 'Backend',
            status: 'Completed',
            taskDate: '2026-07-06',
        },
        {
            id: 3,
            title: 'Security audit',
            description: 'Run a full security audit on the authentication system.',
            category: 'Security',
            status: 'Active',
            taskDate: '2026-07-12',
        },
    ];

    const stats = [
        { label: 'New', count: 2, dot: 'bg-info' },
        { label: 'Active', count: 3, dot: 'bg-warning' },
        { label: 'Completed', count: 1, dot: 'bg-success' },
        { label: 'Failed', count: 1, dot: 'bg-danger' },
    ]

    const getStatus = (task: Task) => {
        if (task.status === 'New') return {
            dot: 'bg-warning', text: 'text-warning'
        }
        if (task.status === 'Completed') return {
            dot: 'bg-success', text: 'text-success'
        }
        if (task.status === 'Failed') return {
            dot: 'bg-danger', text: 'text-danger'
        }
        return {
            dot: 'bg-info', text: 'text-info'
        }
    }

    return (
        <div className="mx-10">

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-10">
                {
                    tasks.map((task) => {
                        const status = getStatus(task);
                        return <div
                            key={task.id}
                            className="flex flex-col gap-3 bg-card border border-border rounded-md p-4 hover:border-border-hover transition-colors duration-200"
                        >
                            {/* Card Header: Category + Status */}
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted px-2 py-0.5 bg-surface rounded-md border border-border">{task.category}</span>

                                <span className={`flex items-center gap-1.5 text-xs font-medium ${status.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                                    {task.status}
                                </span>
                            </div>

                            {/* Task Title & Description */}
                            <div className='flex flex-col gap-1 flex-1'>
                                <h3 className='text-base font-semibold tracking-tight text-primary leading-snug'>{task.title}</h3>
                                <p className='text-xs text-muted line-clamp-2 leading-relaxed'>{task.description}</p>
                            </div>

                            {/* Card Footer: Date + Delete */}
                            <div className='flex items-center justify-between pt-2 border-t border-border'>
                                <span className="text-xs text-muted font-medium">{task.taskDate}</span>
                                <button
                                    title="Delete task"
                                    className="text-xs text-muted hover:text-danger cursor-pointer transition-colors duration-150 font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    )
}