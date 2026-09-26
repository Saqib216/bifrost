'use client';

import { useState } from "react";

export default function DemoAdminCredentials() {
    const [showDemo, setShowDemo] = useState(false);

    return (
        !showDemo ? (
            <button
                type="button"
                onClick={() => setShowDemo(true)}
                className="text-xs text-muted hover:text-primary transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
            >
                <i className="fa-regular fa-eye text-[11px]"></i>
                View demo credentials
            </button>
        ) : (
            <div className="rounded-md border border-border bg-surface/50 p-3.5 flex flex-col gap-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Demo Admin</p>
                <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary">admin@ems.com</span>
                    <span className="text-muted font-mono">Admin@123</span>
                </div>
            </div>
        )
    )
}