"use client";

import { motion } from 'motion/react';
import AnimatedNumber from './AnimatedNumber';


export default function TrustStats() {
    return (
        <section className="flex">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className='bg-card p-4 flex gap-4 rounded-md'
            >
                {
                    [
                        { value: 500, suffix: "+", label: "Tasks Managed" },
                        { value: 100, suffix: "%", label: "Role-Based Security" },
                        { value: 24, suffix: "/7", label: "Real-time Sync" },
                    ].map((stat) => (
                        <div
                        key={stat.label}
                        className='bg-surface px-3 py-2 rounded-md'>
                            <div className='flex gap-1 items-center'>
                                <AnimatedNumber
                                    value={stat.value}
                                    className='text-accent text-xl'
                                />
                                <span>{stat.suffix}</span>
                            </div>
                            <div className='text-secondary text-sm'>{stat.label}</div>
                        </div>
                    ))
                }
            </motion.div>
        </section>
    )
}