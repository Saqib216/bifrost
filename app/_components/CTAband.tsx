"use client";

import { motion } from "motion/react";
import Link from "next/link";

export default function CTAband() {
    return (
        <section className="px-6 sm:px-10 lg:px-20 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative bg-card border border-border/80 rounded-md px-6 sm:px-16 py-14 sm:py-20 flex flex-col items-center text-center gap-6 overflow-hidden shadow-2xl"
            >
                {/* Subtle top ambient glow & hairline */}
                <div
                    className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(var(--accent-rgb),0.10),transparent_70%)]"
                    aria-hidden="true"
                />
                <div
                    className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent pointer-events-none"
                    aria-hidden="true"
                />

                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary max-w-lg relative z-10">
                    Experience Bifrost in action.
                </h2>
                <p className="text-secondary text-base max-w-md relative z-10">
                    Explore admin delegation, strict task transitions, and team analytics with instant 1-click demo access.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-2 relative z-10">
                    <Link
                        href="/signup"
                        className="inline-flex items-center justify-center px-8 py-3 bg-accent rounded-md font-semibold text-surface transition-all duration-200 hover:bg-accent-hover hover:scale-[1.02] active:scale-95 text-sm shadow-lg shadow-accent/20 tracking-tight"
                    >
                        <span>Sign Up</span>
                        <i className="fa-solid fa-arrow-right ml-2 text-xs" />
                    </Link>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-md font-semibold text-primary border border-border bg-surface/50 transition-all duration-200 hover:border-border-hover hover:bg-surface active:scale-95 text-sm tracking-tight"
                    >
                        Try Live Demo
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
