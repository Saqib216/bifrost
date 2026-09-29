"use client";

import { motion, Variants } from "motion/react";

const steps = [
    {
        number: "01",
        title: "Role-Based Access",
        desc: "Sign in with your account or test immediately with 1-click Admin and Employee demo credentials.",
    },
    {
        number: "02",
        title: "Delegate & Accept",
        desc: "Admins create tasks with deadlines and categories; employees review and accept them into Active status.",
    },
    {
        number: "03",
        title: "Execute & Analyze",
        desc: "Advance through strict status transitions to Completed or Failed, and track team velocity on visual analytics.",
    },
];

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 },
    }
};

const itemVariants: Variants = {
    hidden: {
        opacity: 0, y: 20,
    },
    visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
    }
};


export default function HowItWorks() {
    return (
        <section id="how-it-works" className="px-6 sm:px-10 lg:px-20 py-20 scroll-mt-20">

            <div className="flex flex-col items-center text-center gap-2 mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
                    Get started in three steps.
                </h2>
                <p className="text-secondary text-base max-w-md">
                    Zero learning curve, strict lifecycles, and complete role clarity.
                </p>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6"
            >
                {
                    steps.map((step, i) => (
                        <motion.div
                            key={step.number}
                            variants={itemVariants}
                            className="relative flex flex-col items-center text-center gap-4"
                        >
                            {/* Connecting line - hidden on last step & mobile */}
                            {i < steps.length - 1 && (
                                <span className="hidden sm:block absolute top-7 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-border" />
                            )}

                            <div className="relative z-10 w-14 h-14 flex items-center justify-center bg-card border border-border rounded-full">
                                <span className="text-lg font-bold font-mono text-accent">{step.number}</span>
                            </div>

                            <div className="flex flex-col gap-1.5 max-w-55">
                                <h3 className="text-base font-semibold tracking-tight text-primary">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-muted leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))
                }
            </motion.div>
        </section >
    )
}
