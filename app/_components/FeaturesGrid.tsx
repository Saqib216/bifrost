"use client";

import { motion, Variants } from "motion/react";

const features = [
    {
        icon: "fa-users-gear",
        title: "Role-Isolated Workspaces",
        desc: "Tailored Admin delegation hub and Employee execution view, strictly partitioned by Next.js proxy middleware.",
    },
    {
        icon: "fa-diagram-project",
        title: "Strict Task Lifecycle",
        desc: "Enforced state machine (NEW → ACTIVE → COMPLETED/FAILED) guaranteeing zero out-of-order execution.",
    },
    {
        icon: "fa-chart-pie",
        title: "Interactive Analytics",
        desc: "Visual team metrics powered by Recharts (Area, Bar, Pie) tracking completion rates and category distributions.",
    },
    {
        icon: "fa-palette",
        title: "4 Signature Accent Themes",
        desc: "Zero-flicker database-persisted styling across Magenta, Blue, Amber, and Violet colorways.",
    },
    {
        icon: "fa-bolt-lightning",
        title: "Optimistic UI & Pagination",
        desc: "Instant task deletion with React 19 useOptimistic, URL-driven server pagination, and toast feedback.",
    },
    {
        icon: "fa-shield-halved",
        title: "Server-Enforced Security",
        desc: "Auth.js v5 session checks, bcrypt hashing, Zod validation, and atomic Prisma update constraints.",
    },
];

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1 },
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
        <section id="features" className="px-6 sm:px-10 lg:px-20 py-20 scroll-mt-20">

            <div className="flex flex-col items-center text-center gap-2 mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
                    Engineered for full-stack excellence.
                </h2>
                <p className="text-secondary text-base max-w-lg">
                    Every feature is backed by real server validations, strict PostgreSQL schemas, and modern Next.js 16 architecture.
                </p>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
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
