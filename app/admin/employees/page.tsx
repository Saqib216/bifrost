export default function EmployeesOfAdmin() {
    const dummyEmployees = [
        { id: 1, name: "Ali Raza", role: "Developer" },
        { id: 2, name: "Ayesha Khan", role: "Designer" },
        { id: 3, name: "Umair Khan", role: "Tester" },
    ];

    return (
        <div className="mx-10 mb-10">
            <div className='flex flex-col gap-1 mb-6' >
                <h2 className='font-semibold text-xl sm:text-2xl tracking-tight text-primary'>All Employees</h2>
            </div >
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {dummyEmployees.map((employee) => (
                    <div key={employee.id} className="bg-card border border-border rounded-md px-4 py-3 flex flex-col gap-2">
                        <h1 className="font-bold tracking-tight text-primary text-xl">{employee.name}</h1>
                        <p className="font-medium text-secondary text-sm">{employee.role}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}