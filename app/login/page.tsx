"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(Boolean);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError('Invalid email or password');
            return;
        }

        router.push("/");
        router.refresh();
    };

    return (
        <div className="min-h-screen flex">

            {/* Left Panel - Branding (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-[45%] bg-card border-r border-border relative overflow-hidden flex-col justify-between p-10">

                {/* Logo/Brand mark top */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent rounded-md"></div>
                    <span className="font-bold text-lg tracking-tight text-primary font-display">WORKFORCE</span>
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
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Welcome back</h2>
                        <p className="text-sm text-muted">Let's get started, sign in to continue.</p>
                    </div>


                    <form className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                className="border border-border rounded-md p-2.5 bg-card w-full placeholder:text-muted transition-all duration-200 ease-in-out hover:border-muted focus:border-primary focus:ring-4 focus:ring-focus-ring text-sm"
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
                                className="border border-border rounded-md p-2.5 bg-card w-full placeholder:text-muted transition-all duration-200 ease-in-out hover:border-muted focus:border-primary
                                focus:ring-4 focus:ring-focus-ring text-sm"
                            />
                        </div>

                        {/* Error message placeholder */}
                        {/* {error && <p className="text-danger text-xs">{error}</p>} */}

                        <button
                            type="submit"
                            className="mt-2 px-4 py-2.5 bg-accent rounded-md font-semibold text-surface cursor-pointer transition-all duration-250 ease-in-out hover:bg-accent-hover active:scale-95 tracking-tight text-sm"
                        >
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}