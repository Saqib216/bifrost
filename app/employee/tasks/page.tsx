import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth"
import { getStatusStyle } from "@/app/lib/taskStatusStyles";
import TaskStatusActions from "../_components/TaskStatusActions";

export default async function EmployeeTasksPage() {
    const session = await auth();

    const tasks = await prisma.task.findMany({
        where: { userId: session?.user?.id },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className='mx-4 sm:mx-10'>
            <div className='flex flex-col gap-1 mb-6'>
                <h2 className='font-semibold text-xl sm:text-2xl tracking-tight text-primary'>My Tasks</h2>
                <p className='text-sm text-muted'>Your assigned tasks and their current status.</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6'>
                {tasks.map((task) => {
                    const statusStyle = getStatusStyle(task.status);
                    return (
                        <div
                            key={task.id}
                            className="flex flex-col gap-3 bg-card border border-border rounded-md p-4 hover:border-border-hover transition-colors duration-200"
                        >
                            {/* Card Header: Category + Status */}
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted px-2 py-0.5 bg-surface rounded-md border border-border">{task.category}</span>

                                <span className={`flex items-center gap-1.5 text-xs font-medium ${statusStyle.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
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
                                <span className="text-xs text-muted font-medium">{task.taskDate.toLocaleDateString()}</span>
                                
                                <TaskStatusActions taskId={task.id} status={task.status} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {tasks.length === 0 && (
                <div className='col-span-3 flex flex-col items-center gap-3 py-20'>
                    <div className='w-12 h-12 flex items-center justify-center bg-card border border-border rounded-md'>
                        <i className='fa-regular fa-circle-check text-xl text-muted'></i>
                    </div>
                    <p className='text-lg font-semibold text-secondary'>No tasks assigned yet</p>
                    <p className='text-xs text-muted'>Check back later or contact your admin.</p>
                </div>
            )
            }
        </div>
    )
}