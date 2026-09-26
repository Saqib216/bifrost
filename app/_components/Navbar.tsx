"use client";

import { useState } from "react";
import Logo from "@/components/Logo";
import Link from "next/link";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-surface/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 h-16 flex items-center justify-between">
                
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2 hover:opacity-95 transition-opacity">
                    <Logo size="text-xl" />
                </Link>

                {/* Center Nav Links - Desktop */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link
                        href="#features"
                        className="text-secondary hover:text-primary transition-colors duration-150"
                    >
                        Features
                    </Link>
                    <Link
                        href="#how-it-works"
                        className="text-secondary hover:text-primary transition-colors duration-150"
                    >
                        How It Works
                    </Link>
                    <Link
                        href="#metrics"
                        className="text-secondary hover:text-primary transition-colors duration-150"
                    >
                        Metrics
                    </Link>
                </nav>

                {/* Action CTAs - Desktop */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-secondary hover:text-primary transition-colors duration-150 px-3 py-1.5"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/signup"
                        className="inline-flex items-center justify-center px-4 py-2 bg-accent rounded-md font-semibold text-surface transition-all duration-200 hover:bg-accent-hover active:scale-95 text-xs sm:text-sm tracking-tight shadow-sm"
                    >
                        Sign Up
                    </Link>
                </div>

                {/* Mobile Hamburger Toggle */}
                <button
                    type="button"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden flex items-center justify-center w-9 h-9 rounded-md border border-border text-secondary hover:text-primary transition-colors"
                    aria-label="Toggle navigation menu"
                    aria-expanded={mobileOpen}
                >
                    <i className={`fa-solid ${mobileOpen ? "fa-xmark" : "fa-bars"} text-sm`} />
                </button>
            </div>

            {/* Mobile Dropdown */}
            {mobileOpen && (
                <div className="md:hidden border-t border-border/50 bg-surface/95 px-6 py-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <nav className="flex flex-col gap-2 pb-3 border-b border-border/50 text-sm font-medium">
                        <Link
                            href="#features"
                            onClick={() => setMobileOpen(false)}
                            className="text-secondary hover:text-primary transition-colors py-1.5"
                        >
                            Features
                        </Link>
                        <Link
                            href="#how-it-works"
                            onClick={() => setMobileOpen(false)}
                            className="text-secondary hover:text-primary transition-colors py-1.5"
                        >
                            How It Works
                        </Link>
                        <Link
                            href="#metrics"
                            onClick={() => setMobileOpen(false)}
                            className="text-secondary hover:text-primary transition-colors py-1.5"
                        >
                            Metrics
                        </Link>
                    </nav>

                    <div className="flex flex-col gap-2 pt-1">
                        <Link
                            href="/login"
                            onClick={() => setMobileOpen(false)}
                            className="w-full text-center py-2 text-sm font-medium text-secondary hover:text-primary border border-border rounded-md"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            onClick={() => setMobileOpen(false)}
                            className="w-full text-center py-2 bg-accent text-surface rounded-md font-semibold text-sm hover:bg-accent-hover transition-colors"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
