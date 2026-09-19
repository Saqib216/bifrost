"use client";

import { motion, stagger, Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";

type Employee = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    totalTasks: number;
    pendingTasks: number;
};

const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: stagger(0.08) } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function EmployeesGrid({ employees }: { employees: Employee[] }) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
            {employees.map((employee) => (
                <motion.div key={employee.id} variants={itemVariants}>
                    <Link
                        href={`/admin/employees/${employee.id}`}
                        className="group bg-card border border-border rounded-md px-4 py-4 flex flex-col gap-3 transition-all duration-200 hover:border-accent/50 hover:-translate-y-0.5"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 shrink-0 flex items-center justify-center rounded-full overflow-hidden bg-accent/15 text-accent font-bold text-sm border border-border">
                                {employee.image ? (
                                    <Image
                                        src={employee.image}
                                        alt={employee.name}
                                        fill
                                        sizes="40px"
                                        className="object-cover"
                                    />
                                ) : (
                                    getInitials(employee.name)
                                )}
                            </div>

                            <div className="flex flex-col">
                                <h3 className="font-bold tracking-tight text-primary text-base leading-snug">
                                    {employee.name}
                                </h3>
                                <p className="font-medium text-muted text-xs">{employee.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-3 border-t border-border text-xs">
                            <span className="text-secondary font-medium">
                                {employee.totalTasks} task{employee.totalTasks !== 1 ? "s" : ""}
                            </span>
                            {employee.pendingTasks > 0 && (
                                <span className="text-warning font-medium">
                                    {employee.pendingTasks} pending
                                </span>
                            )}
                        </div>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}