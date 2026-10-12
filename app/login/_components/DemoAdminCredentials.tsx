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
                className="group relative w-full overflow-hidden rounded-md px-4 py-2.5 text-sm font-semibold active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none demo-admin-btn"
                aria-label="Try as Admin - auto-fill demo credentials"
            >
                {/* Shimmer sweep */}
                <span
                    className="pointer-events-none absolute inset-0 -translate-x-full demo-admin-shimmer transition-transform duration-700 group-hover:translate-x-full"
                    aria-hidden="true"
                />

                {/* Ripple burst on click */}
                {ripple && (
                    <span
                        className="pointer-events-none absolute inset-0 m-auto h-4 w-4 animate-ping rounded-full"
                        style={{ backgroundColor: "var(--demo-btn-ripple)" }}
                        aria-hidden="true"
                    />
                )}

                {/* Button content */}
                <span className="relative flex items-center justify-center gap-2">
                    <span
                        className={`inline-flex items-center justify-center w-4 h-4 rounded text-[10px] demo-admin-icon ${filled ? "is-filled" : ""
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
                        <span className="ml-auto text-[10px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded demo-admin-badge font-semibold">
                            demo
                        </span>
                    )}
                </span>
            </button>

            {/* Credentials peek strip that appears after fill */}
            {filled && (
                <div className="w-full rounded-md px-3 py-2 flex items-center justify-between text-[11px] animate-in fade-in slide-in-from-top-1 duration-200 demo-admin-strip">
                    <span className="text-muted font-mono">{DEMO_EMAIL}</span>
                    <span className="text-muted/50 mx-2">·</span>
                    <span className="text-muted font-mono tracking-widest">••••••••</span>
                    <span className="ml-auto flex items-center gap-1 demo-admin-strip-text font-medium">
                        <i className="fa-solid fa-check-circle text-[10px]" />
                        filled
                    </span>
                </div>
            )}
        </div>
    );
}