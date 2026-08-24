import { prisma } from "@/app/lib/prisma";

export default async function EmployeesOfAdmin() {
    const employees = await prisma.user.findMany({
        where: {role: 'EMPLOYEE'},
        select: {
            id: true,
            email: true,
            name: true,
        },
    });
    // console.log(employees);

    return (
        <div className="mx-10 mb-10">
            <div className='flex flex-col gap-1 mb-6' >
                <h2 className='font-semibold text-xl sm:text-2xl tracking-tight text-primary'>All Employees</h2>
            </div >

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {employees.map((employee) => (
                    <div key={employee.id} className="bg-card border border-border rounded-md px-4 py-3 flex flex-col gap-2">
                        <h1 className="font-bold tracking-tight text-primary text-xl">{employee.name}</h1>
                        <p className="font-medium text-secondary text-sm">{employee.email}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}