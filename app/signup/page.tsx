'use client';

import Logo from "@/components/Logo";
import { register } from "../lib/actions";
import { useActionState } from "react";

export default function SignupPage() {
    const [state, formAction, isPending] = useActionState(register, { success: false });

    return (
        <div className="min-h-screen flex">

            {/* Left Panel - Branding (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-[45%] bg-card border-r border-border relative overflow-hidden flex-col justify-between p-10">

                {/* Logo/Brand mark top */}
                <div className="flex items-center gap-2">
                    <Logo size="text-2xl" />
                </div>

                {/* Center content */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-primary leading-tight">
                        Manage your team, effortlessly.
                    </h1>
                    <p className="text-secondary text-base">
                        Role-based task management built for modern teams.
                    </p>
                </div>

                {/* Bottom - subtle footer/stat */}
                <div className="text-xs text-muted">
                    &copy; 2026 Workforce
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-sm flex flex-col gap-8">

                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Welcome</h2>
                        <p className="text-sm text-muted">Let's get started, register here to continue.</p>
                    </div>

                    <form action={formAction}
                        className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="name"
                                className="text-xs font-semibold uppercase tracking-wider text-muted">
                                Name
                            </label>
                            <input
                                autoFocus
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                className="border border-border rounded-md p-2.5 bg-card w-full placeholder:text-muted transition-all duration-200 ease-in-out hover:border-muted focus:border-primary focus:ring-4 focus:ring-focus-ring text-sm"
                            />

                            {state.errors?.name && (
                                <p className="text-danger text-xs">{state.errors.name[0]}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted">
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                placeholder="name@company.com"
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
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="border border-border rounded-md p-2.5 bg-card w-full placeholder:text-muted transition-all duration-200 ease-in-out hover:border-muted focus:border-primary
                                focus:ring-4 focus:ring-focus-ring text-sm"
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
                            {isPending ? 'Registering you...' : 'Sign up'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}