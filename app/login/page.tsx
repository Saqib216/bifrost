"use client";

import { useActionState } from "react";
import { authenticate } from "../lib/actions";
import Logo from "@/components/Logo";
import Link from "next/link";
import { motion } from 'motion/react';
import DemoAdminCredentials from "./_components/DemoAdminCredentials";

export default function LoginPage() {
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

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

                {/* Logo/Brand mark top */}
                <div className="flex items-center gap-2 relative z-10">
                    <Logo size="text-2xl" />
                </div>

                {/* Center content */}
                <div className="flex flex-col gap-4 relative z-10">
                    <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-primary leading-tight">
                        Manage your team, effortlessly.
                    </h1>
                    <p className="text-secondary text-base">
                        Role-based task management built for modern teams.
                    </p>
                </div>

                <div className="text-xs text-muted relative z-10">
                    &copy; 2026 Bifrost
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-sm flex flex-col gap-8">

                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Welcome back</h2>
                        <p className="text-sm text-muted">Let's get started, sign in to continue.</p>
                    </div>


                    <form action={formAction}
                        className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted">
                                Email Address
                            </label>
                            <input
                                autoFocus
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                className="border border-border rounded-md p-2.5 bg-card w-full placeholder:text-muted transition-all duration-150 ease-in-out hover:border-muted focus:border-accent focus:ring-4 focus:ring-accent/30 text-sm"
                            />
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
                                required
                                className="border border-border rounded-md p-2.5 bg-card w-full placeholder:text-muted transition-all duration-150 ease-in-out hover:border-muted focus:border-accent focus:ring-4 focus:ring-accent/30 text-sm"
                            />
                        </div>

                        {/* Error message */}
                        {errorMessage && <p className="text-danger text-xs">{errorMessage}</p>}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="mt-2 px-4 py-2.5 bg-accent rounded-md font-semibold text-surface cursor-pointer transition-all duration-250 ease-in-out hover:bg-accent-hover active:scale-95 tracking-tight text-sm"
                        >
                            {isPending ? 'Signing in...' : 'Continue'}
                        </button>
                    </form>

                    {/* OR Divider */}
                    <div className="relative flex items-center justify-center -my-2">
                        <div className="w-full border-t border-border" />
                        <span className="absolute bg-surface px-3 text-xs uppercase tracking-widest text-muted font-medium">
                            Or
                        </span>
                    </div>

                    <DemoAdminCredentials />

                    {/* Link to signup */}
                    <p className="text-sm text-center text-muted">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup"
                            className="font-semibold transition-colors duration-150 text-accent">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}