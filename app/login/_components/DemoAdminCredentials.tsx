'use client';

import { useState } from "react";

const DEMO_EMAIL = "admin@ems.com";
const DEMO_PASSWORD = "Admin@123";

export default function DemoAdminCredentials({ disabled = false }: { disabled?: boolean }) {
    const [filled, setFilled] = useState(false);
    const [ripple, setRipple] = useState(false);

    const handleFill = () => {
        if (disabled) return;
        // Programmatically fill the form inputs
        const emailInput = document.getElementById("email") as HTMLInputElement | null;
        const passwordInput = document.getElementById("password") as HTMLInputElement | null;

        if (emailInput && passwordInput) {
            // Native input value setter to bypass React's synthetic event batching
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
            nativeInputValueSetter?.call(emailInput, DEMO_EMAIL);
            emailInput.dispatchEvent(new Event("input", { bubbles: true }));
            nativeInputValueSetter?.call(passwordInput, DEMO_PASSWORD);
            passwordInput.dispatchEvent(new Event("input", { bubbles: true }));
            emailInput.focus();
        }

        // Ripple animation
        setRipple(true);
        setTimeout(() => setRipple(false), 600);
        setFilled(true);

        // Reset hint after a delay
        setTimeout(() => setFilled(false), 4000);
    };

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Supreme animated "Try as Admin" button */}
            <button
                type="button"
                onClick={handleFill}
                disabled={disabled}
                className="group relative w-full overflow-hidden rounded-md border border-amber-500/35 bg-gradient-to-r from-amber-500/[0.04] via-orange-500/[0.06] to-amber-500/[0.04] px-4 py-2.5 text-sm font-semibold text-amber-400 transition-all duration-300 hover:border-amber-400/80 hover:bg-amber-500/10 hover:text-amber-300 hover:shadow-[0_0_24px_rgba(245,158,11,0.20)] active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                aria-label="Try as Admin - auto-fill demo credentials"
            >
                {/* Shimmer sweep */}
                <span
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-300/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    aria-hidden="true"
                />

                {/* Ripple burst on click */}
                {ripple && (
                    <span
                        className="pointer-events-none absolute inset-0 m-auto h-4 w-4 animate-ping rounded-full bg-amber-400/40"
                        aria-hidden="true"
                    />
                )}

                {/* Button content */}
                <span className="relative flex items-center justify-center gap-2">
                    <span
                        className={`inline-flex items-center justify-center w-4 h-4 rounded text-[10px] border transition-all duration-300 ${filled
                            ? "border-amber-400/70 bg-amber-500/25 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                            : "border-amber-500/40 bg-amber-500/15 text-amber-400 group-hover:border-amber-400 group-hover:bg-amber-500/25 group-hover:text-amber-300 group-hover:shadow-[0_0_10px_rgba(245,158,11,0.25)]"
                            }`}
                    >
                        {filled ? (
                            <i className="fa-solid fa-check text-[9px]" />
                        ) : (
                            <i className="fa-solid fa-bolt text-[9px]" />
                        )}
                    </span>
                    <span className="tracking-tight">
                        {filled ? "Fields filled; click Continue" : "Try as Admin"}
                    </span>
                    {!filled && (
                        <span className="ml-auto text-[10px] font-mono tracking-wider uppercase text-amber-400/50 group-hover:text-amber-300/90 transition-colors duration-300">
                            demo
                        </span>
                    )}
                </span>
            </button>

            {/* Credentials peek strip that appears after fill */}
            {filled && (
                <div className="w-full rounded-md border border-amber-500/25 bg-amber-500/[0.04] px-3 py-2 flex items-center justify-between text-[11px] animate-in fade-in slide-in-from-top-1 duration-200">
                    <span className="text-muted font-mono">{DEMO_EMAIL}</span>
                    <span className="text-muted/50 mx-2">·</span>
                    <span className="text-muted font-mono tracking-widest">••••••••</span>
                    <span className="ml-auto text-amber-400 flex items-center gap-1">
                        <i className="fa-solid fa-check-circle text-[10px]" />
                        filled
                    </span>
                </div>
            )}
        </div>
    );
}