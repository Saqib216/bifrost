"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navlinks({ role }: { role: "ADMIN" | "EMPLOYEE" }) {
    const adminLinks = [
        { href: "/admin", label: "Home" },
        { href: "/admin/employees", label: "Employees" },
        { href: "/admin/tasks", label: "Tasks" },
    ];

    const employeeLinks = [
        { href: "/employee", label: "Home" },
        { href: "/employee/tasks", label: "Tasks" },
    ];

    const currentPath = usePathname();
    const links = role === "ADMIN" ? adminLinks : employeeLinks;

    return (
        <div className="flex flex-col justify-between gap-2">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={currentPath === link.href ? "text-accent font-semibold" : "text-secondary"}
                >
                    {link.label}
                </Link>
            ))}
        </div>
    )
}