"use client";

import { motion, Variants } from "motion/react";

const features = [
    { icon: "fa-users-gear", title: "Role-Based Dashboards", desc: "Separate admin & employee views, tailored to each role's needs." },
    { icon: "fa-list-check", title: "Task Management", desc: "Assign, edit, and track tasks with real-time status updates." },
    { icon: "fa-chart-line", title: "Live Analytics", desc: "Visual insights into team performance and completion trends." },
    { icon: "fa-lock", title: "Secure Auth", desc: "Credential-based authentication with protected, role-aware routes." },
];

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

export default function FeaturesGrid() {
    return (
        <section id="features" className="px-6 sm:px-10 lg:px-20 py-20">

            <div className="flex flex-col items-center text-center gap-2 mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
                    Everything you need, built in.
                </h2>
                <p className="text-secondary text-base max-w-md">
                    No clutter, no extra setup, just the tools your team actually uses.
                </p>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {features.map((feature) => (
                    <motion.div
                        key={feature.title}
                        variants={itemVariants}
                        className="group bg-card border border-border rounded-md p-6 flex flex-col gap-4 transition-all duration-250 hover:border-accent/50 hover:-translate-y-1"
                    >
                        <div className="w-11 h-11 flex items-center justify-center bg-accent/10 rounded-md group-hover:bg-accent/20 transition-colors duration-250">
                            <i className={`fa-solid ${feature.icon} text-accent text-lg`}></i>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <h3 className="text-base font-semibold tracking-tight text-primary">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-muted leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

        </section>
    );
}