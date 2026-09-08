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
                className="bg-accent rounded-md px-6 sm:px-16 py-14 sm:py-20 flex flex-col items-center text-center gap-6"
            >
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-surface max-w-lg">
                    Ready to get your team organized?
                </h2>
                <p className="text-surface/80 text-base max-w-md">
                    Jump in and see how simple task management can be.
                </p>
                <Link
                    href="/login"
                    className="mt-2 inline-flex items-center justify-center px-8 py-3 bg-surface rounded-md font-semibold text-accent transition-all duration-200 hover:bg-surface/90 hover:scale-[1.02] active:scale-95 text-sm shadow-lg"
                >
                    Get Started
                </Link>
            </motion.div>
        </section>
    );
}