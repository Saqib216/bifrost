"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";

export default function MobileHeader({
    role,
    children,
}: {
    role: "ADMIN" | "EMPLOYEE";
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Automatically close the mobile drawer when navigating to a new route
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    // Prevent background scrolling while drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <>
            {/* Topbar visible only on mobile screens (< md) */}
            <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-surface/90 backdrop-blur-md sticky top-0 z-40 shrink-0">
                <div className="flex items-center gap-2.5">
                    <Link href={role === "ADMIN" ? "/admin" : "/employee"}>
                        <Logo size="text-base" />
                    </Link>
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-muted px-1.5 py-0.5 rounded bg-card border border-border/80 leading-tight">
                        {role}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="w-9 h-9 rounded-md flex items-center justify-center text-secondary hover:text-primary hover:bg-card border border-border transition-colors cursor-pointer"
                    aria-label="Open navigation menu"
                >
                    <i className="fa-solid fa-bars text-sm"></i>
                </button>
            </header>

            {/* Slide-over Drawer Backdrop & Panel */}
            {isOpen && (
                <div
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsOpen(false);
                    }}
                    className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex"
                >
                    <div className="w-72 max-w-[85vw] h-full bg-surface border-r border-border p-4 flex flex-col gap-3 relative shadow-2xl animate-in slide-in-from-left duration-200 overflow-y-auto">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
                            <div className="flex flex-col">
                                <Logo size="text-base" />
                                <span className="text-[10px] font-semibold tracking-widest uppercase text-muted leading-tight mt-0.5">
                                    {role}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-md flex items-center justify-center text-muted hover:text-primary hover:bg-card transition-colors cursor-pointer"
                                aria-label="Close menu"
                            >
                                <i className="fa-solid fa-xmark text-sm"></i>
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 flex flex-col min-h-0">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
