"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navlinks({ role }: { role: "ADMIN" | "EMPLOYEE" }) {
    const adminLinks = [
        { href: "/admin", label: "Dashboard", icon: "fa-solid fa-gauge-high" },
        { href: "/admin/employees", label: "Employees", icon: "fa-solid fa-users" },
        { href: "/admin/tasks", label: "Tasks", icon: "fa-solid fa-list-check" },
    ];

    const employeeLinks = [
        { href: "/employee", label: "Home", icon: "fa-solid fa-house" },
        { href: "/employee/tasks", label: "Tasks", icon: "fa-solid fa-list-check" },
    ];

    const currentPath = usePathname();
    const links = role === "ADMIN" ? adminLinks : employeeLinks;

    return (
        <div className="flex flex-col gap-1">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
                        currentPath === link.href
                            ? "bg-accent/10 text-accent font-semibold"
                            : "text-secondary hover:text-primary hover:bg-card"
                    }`}
                >
                    <i className={`${link.icon} fa-fw text-[13px]`} />
                    <span>{link.label}</span>
                </Link>
            ))}
        </div>
    );
}