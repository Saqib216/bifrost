interface Task {
    id: number;
    title: string;
    description: string;
    category: string;
    status: string;
    taskDate: string;
}

export default function EmployeeTasksPage() {
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
        <div className='mx-4 sm:mx-10'>
            <div className='flex flex-col gap-1 mb-6'>
                <h2 className='font-semibold text-xl sm:text-2xl tracking-tight text-primary'>My Tasks</h2>
                <p className='text-sm text-muted'>Your assigned tasks and their current status.</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6'>
                {tasks.map((task) => {
                    const status = getStatus(task);
                    return (
                        <div
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

                            {/* Card Footer: Date + dummy action buttons  */}
                            <div className='flex items-center justify-between pt-2 border-t border-border'>
                                <span className="text-xs text-muted font-medium">{task.taskDate}</span>
                                <button
                                    className='text-xs font-medium px-3 py-1.5 rounded-md bg-info/10 text-info border border-info/20 hover:bg-info/20 cursor-pointer transition-colors'
                                    title="Accept task"
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}