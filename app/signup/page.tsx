'use client';

import Logo from "@/components/Logo";
import { register } from "../lib/actions";
import { useActionState } from "react";
import Link from "next/link";
import { motion } from 'motion/react';

const features = [
    {
        icon: (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
        ),
        label: "Team management",
        desc: "Roles, permissions & org structure",
    },
    {
        icon: (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
        label: "Task tracking",
        desc: "Assign, prioritize & monitor progress",
    },
    {
        icon: (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        label: "Live analytics",
        desc: "Real-time productivity insights",
    },
];

export default function SignupPage() {
    const [state, formAction, isPending] = useActionState(register, { success: false });

    return (
        <div className="min-h-screen flex">

            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-10"
                style={{
                    background: "linear-gradient(135deg, #0D0E16 0%, #12101A 40%, #14151C 100%)",
                    borderRight: "1px solid #22232D",
                }}>

                {/* Grid pattern - faint structural lines, fading at edges */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
                        `,
                        backgroundSize: '52px 52px',
                        maskImage: 'radial-gradient(ellipse 85% 75% at 50% 50%, black 25%, transparent 85%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 50%, black 25%, transparent 85%)',
                    }}
                />

                {/* Ambient color wash - sweeps diagonally across the grid */}
                <motion.div
                    className="absolute pointer-events-none"
                    style={{
                        width: '140%',
                        height: '140%',
                        top: '-20%',
                        left: '-20%',
                        background: `radial-gradient(
                            ellipse 500px 350px at 50% 50%,
                            rgba(var(--accent-rgb),0.13) 0%,
                            rgba(var(--accent-rgb),0.05) 40%,
                            transparent 70%
                        )`,
                    }}
                    animate={{
                        x: ['-15%', '55%', '-15%'],
                        y: ['-10%', '45%', '-10%'],
                    }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                {/* Grid intersection nodes - breathing dots at scattered positions */}
                {[
                    { x: '18%', y: '22%', delay: 0 },
                    { x: '72%', y: '15%', delay: 2.5 },
                    { x: '45%', y: '55%', delay: 1.2 },
                    { x: '28%', y: '78%', delay: 3.8 },
                    { x: '82%', y: '62%', delay: 0.8 },
                    { x: '55%', y: '35%', delay: 4.5 },
                ].map((node, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            left: node.x,
                            top: node.y,
                            width: 4,
                            height: 4,
                            background: 'var(--color-accent)',
                            boxShadow: '0 0 8px rgba(var(--accent-rgb),0.5)',
                        }}
                        animate={{
                            opacity: [0, 0.7, 0],
                            scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: node.delay,
                        }}
                    />
                ))}

                {/* Top - Logo */}
                <div className="flex items-center gap-2 relative z-10">
                    <Logo size="text-2xl" />
                </div>

                {/* Middle - headline + features */}
                <div className="flex flex-col gap-8 relative z-10">
                    <div className="flex flex-col gap-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
                            <span style={{
                                display: "inline-block", width: 6, height: 6,
                                borderRadius: "50%", background: "var(--color-accent)",
                                boxShadow: "0 0 6px var(--color-accent)",
                            }} />
                            New workspace
                        </span>
                        <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-primary leading-tight">
                            Build your team&apos;s<br />
                            <span style={{
                                background: "linear-gradient(90deg, var(--color-accent), var(--accent-gradient-end))",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}>
                                command centre.
                            </span>
                        </h1>
                        <p className="text-secondary text-base">
                            Everything your workforce needs, in one place.
                        </p>
                    </div>

                    {/* Feature pills */}
                    <div className="flex flex-col gap-3">
                        {features.map((f) => (
                            <div key={f.label}
                                className="flex items-center gap-3 rounded-md p-3.5"
                                style={{
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    backdropFilter: "blur(8px)",
                                }}>
                                <span style={{
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    width: 36, height: 36, borderRadius: 10,
                                    background: "rgba(var(--accent-rgb),0.12)",
                                    color: "var(--color-accent)", flexShrink: 0,
                                }}>
                                    {f.icon}
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-primary">{f.label}</p>
                                    <p className="text-xs text-muted">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <div className="text-xs text-muted relative z-10">
                    &copy; 2026 Workforce
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-sm flex flex-col gap-8">

                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
                            Create an account
                        </h2>
                        <p className="text-sm text-muted">
                            Get started free - no rush.
                        </p>
                    </div>

                    <form action={formAction} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="name"
                                className="text-xs font-semibold uppercase tracking-wider text-muted">
                                Full Name
                            </label>
                            <input
                                autoFocus
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Thor Odinson"
                                className="border border-border rounded-md p-2.5 bg-card w-full placeholder:text-muted transition-all duration-150 ease-in-out hover:border-muted focus:border-accent focus:ring-4 focus:ring-accent/30 text-sm"
                            />
                            {state.errors?.name && (
                                <p className="text-danger text-xs">{state.errors.name[0]}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted">
                                Work Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="thor@asgard.com"
                                className="border border-border rounded-md p-2.5 bg-card w-full placeholder:text-muted transition-all duration-150 ease-in-out hover:border-muted focus:border-accent focus:ring-4 focus:ring-accent/30 text-sm"
                            />
                            {state.errors?.email && (
                                <p className="text-danger text-xs">{state.errors.email[0]}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="border border-border rounded-md p-2.5 bg-card w-full placeholder:text-muted transition-all duration-150 ease-in-out hover:border-muted focus:border-accent focus:ring-4 focus:ring-accent/30 text-sm"
                            />
                            {state.errors?.password && (
                                <p className="text-danger text-xs">{state.errors.password[0]}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="mt-2 px-4 py-2.5 bg-accent rounded-md font-semibold text-surface cursor-pointer transition-all duration-250 ease-in-out hover:bg-accent-hover active:scale-95 tracking-tight text-sm"
                        >
                            {isPending ? 'Creating your account…' : 'Create account'}
                        </button>
                    </form>

                    {/* Link to login */}
                    <p className="text-sm text-center text-muted">
                        Already have an account?{" "}
                        <Link href="/login"
                            className="font-semibold transition-colors duration-150 text-accent">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}