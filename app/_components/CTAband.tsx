"use client";

import { motion } from "motion/react";
import Link from "next/link";

export default function CTAband() {
    return (
        <section className="px-6 sm:px-10 lg:px-20 py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-accent rounded-md px-6 sm:px-16 py-14 sm:py-20 flex flex-col items-center text-center gap-6 shadow-xl"
            >
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-surface max-w-lg">
                    Ready to get your team organized?
                </h2>
                <p className="text-surface/85 text-base max-w-md">
                    Jump in and see how effortless role-based task management can be.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-2">
                    <Link
                        href="/signup"
                        className="inline-flex items-center justify-center px-8 py-3 bg-surface rounded-md font-semibold text-accent transition-all duration-200 hover:bg-surface/90 hover:scale-[1.02] active:scale-95 text-sm shadow-lg tracking-tight"
                    >
                        <span>Sign Up</span>
                        <i className="fa-solid fa-arrow-right ml-2 text-xs" />
                    </Link>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-md font-semibold text-surface border border-surface/30 transition-all duration-200 hover:bg-surface/10 active:scale-95 text-sm tracking-tight"
                    >
                        Try Demo
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
