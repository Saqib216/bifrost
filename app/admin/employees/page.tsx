import { prisma } from "@/app/lib/prisma";
import EmployeesGrid from "./_components/EmployeesGrid";
import EmployeeSearch from "./_components/EmployeeSearch";

export default async function EmployeesOfAdmin({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
    const { search } = await searchParams;

    const employees = await prisma.user.findMany({
        where: { role: 'EMPLOYEE' },
        select: {
            id: true,
            email: true,
            name: true,
            image: true,
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
            image: emp.image,
            totalTasks: emp.tasks.length,
            pendingTasks: emp.tasks.filter(t => t.status !== 'COMPLETED').length,
        }
    ));

    const filteredEmployees = search ? employeesWithStats.filter((emp) => emp.name.toLowerCase().includes(search.toLowerCase())) : employeesWithStats;

    return (
        <div className="mx-10 mb-10">
            <div className="flex flex-col gap-1 mb-6">
                <h2 className="font-semibold text-xl sm:text-2xl tracking-tight text-primary">All Employees</h2>
                <p className="text-sm text-muted font-medium">Browse your team and view individual task activity.</p>
            </div>

            <EmployeeSearch />
            <EmployeesGrid employees={filteredEmployees} />
        </div>
    )
}