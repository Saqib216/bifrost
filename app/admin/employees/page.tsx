import { prisma } from "@/app/lib/prisma";
import EmployeesGrid from "./_components/EmployeesGrid";

export default async function EmployeesOfAdmin() {
    const employees = await prisma.user.findMany({
        where: { role: 'EMPLOYEE' },
        select: {
            id: true,
            email: true,
            name: true,
            tasks: {
                select: { status: true },
            },
        },
    });

    const employeesWithStats = employees.map((emp) => (
        {
            id: emp.id,
            name: emp.name,
            email: emp.email,
            totalTasks: emp.tasks.length,
            pendingTasks: emp.tasks.filter(t => t.status !== 'COMPLETED').length,
        }
    ));

    return (
        <div className="mx-10 mb-10">
            <div className="flex flex-col gap-1 mb-6">
                <h2 className="font-semibold text-xl sm:text-2xl tracking-tight text-primary">All Employees</h2>
                <p className="text-sm text-muted font-medium">Browse your team and view individual task activity.</p>
            </div>

            <EmployeesGrid employees={employeesWithStats} />
        </div>
    )
}