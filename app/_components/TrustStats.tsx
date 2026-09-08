"use client";

import { motion } from 'motion/react';
import AnimatedNumber from '../../components/AnimatedNumber';

const stats = [
    { value: 500, suffix: "+", label: "Tasks Managed" },
    { value: 100, suffix: "%", label: "Role-Based Security" },
    { value: 24, suffix: "/7", label: "Real-time Sync" },
];

export default function TrustStats() {
    return (
        <section className="px-6 sm:px-10 lg:px-20 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-card border border-border rounded-md px-6 sm:px-10 py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border"
            >
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        className="flex flex-col items-center text-center gap-1.5 py-6 sm:py-0"
                    >
                        <div className="flex items-baseline gap-0.5">
                            <AnimatedNumber
                                value={stat.value}
                                className="text-accent text-4xl sm:text-5xl font-bold tracking-tight font-mono"
                            />
                            <span className="text-accent text-4xl sm:text-5xl font-bold tracking-tight font-mono">
                                {stat.suffix}
                            </span>
                        </div>
                        <span className="text-muted text-xs sm:text-sm font-semibold uppercase tracking-wider">
                            {stat.label}
                        </span>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}