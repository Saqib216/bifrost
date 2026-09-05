"use client";

import { motion, Variants } from "motion/react";
import Link from "next/link";

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    },
};

export default function Hero() {
    return (
        <section className="min-h-screen flex flex-col lg:flex-row items-center px-6 sm:px-10 lg:px-20 py-20 gap-16">

            {/* Left - Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 flex flex-col gap-6 max-w-xl"
            >
                <motion.div variants={itemVariants} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent rounded-md"></div>
                    <span className="font-bold text-lg tracking-tight text-primary font-display">WORKFORCE</span>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-primary leading-[1.1]"
                >
                    Manage your team,
                    <br />
                    <span className="text-accent">effortlessly.</span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-secondary text-base sm:text-lg max-w-md">
                    Role-based task management built for modern teams. Assign, track, and complete - all in one clean dashboard.
                </motion.p>

                <motion.div variants={itemVariants} className="flex items-center gap-4 mt-2">
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center px-6 py-3 bg-accent rounded-md font-semibold text-surface transition-all duration-200 ease-in-out hover:bg-accent-hover active:scale-95 text-sm"
                    >
                        Get Started
                    </Link>

                    <Link
                        href="#features"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-md font-semibold text-primary border border-border transition-all duration-200 hover:border-border-hover active:scale-95 text-sm"
                    >
                        See how it works
                    </Link>
                </motion.div>

            </motion.div>

            {/* Right - Animated Dashboard Mockup */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="flex-1 w-full max-w-lg"
            >
                <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-card border border-border rounded-xl p-6 shadow-2xl"
                >
                    {/* Fake window bar */}
                    <div className="flex gap-1.5 mb-5">
                        <div className="w-2.5 h-2.5 rounded-full bg-danger/60"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-warning/60"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-success/60"></div>
                    </div>

                    {/* Fake stat cards */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {[
                            { label: "Total Tasks", value: "128", color: "text-info" },
                            { label: "Completed", value: "94", color: "text-success" },
                            { label: "Active", value: "24", color: "text-warning" },
                            { label: "Employees", value: "12", color: "text-accent" },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                                className="bg-surface border border-border rounded-md p-3"
                            >
                                <p className="text-[10px] text-muted uppercase tracking-wider font-semibold">{stat.label}</p>
                                <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Fake progress bar */}
                    <div className="bg-surface border border-border rounded-md p-3">
                        <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-2">Completion Rate</p>
                        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "73%" }}
                                transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                                className="h-full bg-accent rounded-full"
                            />
                        </div>
                    </div>
                </motion.div>
            </motion.div>

        </section >
    );
}