'use client';

import Logo from "@/components/Logo";
import { register } from "../lib/actions";
import { useActionState } from "react";
import Link from "next/link";

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

            {/* Left Panel - gradient mesh feel, distinct from login */}
            <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-10"
                style={{
                    background: "linear-gradient(135deg, #0D0E16 0%, #12101A 40%, #1A0F1F 100%)",
                    borderRight: "1px solid #22232D",
                }}>

                {/* Glow blob - top-left accent */}
                <div style={{
                    position: "absolute", top: "-80px", left: "-80px",
                    width: "340px", height: "340px",
                    background: "radial-gradient(circle, rgba(242,38,110,0.18) 0%, transparent 70%)",
                    pointerEvents: "none",
                }} />
                {/* Glow blob - bottom-right purple */}
                <div style={{
                    position: "absolute", bottom: "-60px", right: "-60px",
                    width: "280px", height: "280px",
                    background: "radial-gradient(circle, rgba(100,60,200,0.14) 0%, transparent 70%)",
                    pointerEvents: "none",
                }} />

                {/* Top - Logo */}
                <div className="flex items-center gap-2 relative z-10">
                    <Logo size="text-2xl" />
                </div>

                {/* Middle - headline + features */}
                <div className="flex flex-col gap-8 relative z-10">
                    <div className="flex flex-col gap-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest"
                            style={{ color: "#F2266E" }}>
                            <span style={{
                                display: "inline-block", width: 6, height: 6,
                                borderRadius: "50%", background: "#F2266E",
                                boxShadow: "0 0 6px #F2266E",
                            }} />
                            New workspace
                        </span>
                        <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-primary leading-tight">
                            Build your team&apos;s<br />
                            <span style={{
                                background: "linear-gradient(90deg, #F2266E, #A855F7)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}>
                                command centre.
                            </span>
                        </h1>
                        <p className="text-secondary text-base">
                            Everything your team needs, in one place.
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
                                    background: "rgba(242,38,110,0.12)",
                                    color: "#F2266E", flexShrink: 0,
                                }}>
                                    {f.icon}
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-primary">{f.label}</p>
                                    <p className="text-xs" style={{ color: "#6E6F7B" }}>{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <div className="text-xs text-muted relative z-10">
                    &copy; 2026 Bifrost
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
                                className="border border-border rounded-md p-2.5 bg-card w-full placeholder:text-muted transition-all duration-200 ease-in-out hover:border-muted focus:border-primary focus:ring-4 focus:ring-focus-ring text-sm"
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
                                className="border border-border rounded-md p-2.5 bg-card w-full placeholder:text-muted transition-all duration-200 ease-in-out hover:border-muted focus:border-primary focus:ring-4 focus:ring-focus-ring text-sm"
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
                                className="border border-border rounded-md p-2.5 bg-card w-full placeholder:text-muted transition-all duration-200 ease-in-out hover:border-muted focus:border-primary focus:ring-4 focus:ring-focus-ring text-sm"
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
                            className="font-semibold transition-colors duration-150"
                            style={{ color: "#F2266E" }}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}