"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

type Theme = "dark" | "light";

interface ThemeOption {
    value: Theme;
    icon: string;
    label: string;
}

const options: ThemeOption[] = [
    { value: "dark", icon: "fa-solid fa-moon", label: "Dark" },
    { value: "light", icon: "fa-solid fa-sun", label: "Light" },
];

export default function ThemeToggle({ currentTheme }: { currentTheme: Theme }) {
    const [theme, setTheme] = useState<Theme>(currentTheme);
    const router = useRouter();

    // Keep state in sync if prop changes (e.g. server revalidation)
    useEffect(() => {
        setTheme(currentTheme);
    }, [currentTheme]);

    // Keep multi-instances (mobile drawer + desktop sidebar) synchronized
    useEffect(() => {
        const handleSync = (e: Event) => {
            const customEvent = e as CustomEvent<Theme>;
            if (customEvent.detail && customEvent.detail !== theme) {
                setTheme(customEvent.detail);
            }
        };

        window.addEventListener("bifrost-theme-change", handleSync);
        return () => window.removeEventListener("bifrost-theme-change", handleSync);
    }, [theme]);

    const applyTheme = (next: Theme) => {
        document.documentElement.setAttribute("data-theme", next);
        document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
        window.dispatchEvent(new CustomEvent("bifrost-theme-change", { detail: next }));
    };

    const handleSelect = (next: Theme) => {
        if (next === theme) return;
        setTheme(next);

        // Check if browser supports View Transitions and user hasn't requested reduced motion
        const prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (
            typeof document === "undefined" ||
            !("startViewTransition" in document) ||
            typeof (document as any).startViewTransition !== "function" ||
            prefersReducedMotion
        ) {
            applyTheme(next);
            router.refresh();
            return;
        }

        // Calm, elegant 220ms crossfade without jarring flashes
        const transition = (document as any).startViewTransition(() => {
            applyTheme(next);
        });

        transition.finished?.finally(() => {
            router.refresh();
        });
    };

    return (
        <div className="flex flex-col gap-1.5 px-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted px-1 select-none">
                Theme
            </span>
            <div
                role="radiogroup"
                aria-label="Theme selection"
                className="relative flex items-center p-1 rounded-md bg-card border border-border select-none"
            >
                {options.map((o) => {
                    const isActive = theme === o.value;
                    return (
                        <button
                            key={o.value}
                            type="button"
                            role="radio"
                            aria-checked={isActive}
                            title={`Switch to ${o.label} mode`}
                            onClick={() => handleSelect(o.value)}
                            className="relative flex-1 flex items-center justify-center gap-1.5 py-1 px-2 text-xs font-medium cursor-pointer select-none transition-colors duration-150 z-10 active:scale-[0.98]"
                        >
                            {/* Sliding physical tactile pill behind active option */}
                            {isActive && (
                                <motion.div
                                    layoutId="bifrost-theme-pill"
                                    className="absolute inset-0 rounded bg-accent/15 border border-accent/25 shadow-xs"
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 35,
                                    }}
                                />
                            )}

                            {/* Icon with subtle micro-refinement */}
                            <span
                                className={`relative z-10 flex items-center justify-center transition-colors duration-150 ${isActive
                                    ? "text-accent"
                                    : "text-muted hover:text-secondary"
                                    }`}
                            >
                                <i className={`${o.icon} text-[11px]`} />
                            </span>

                            {/* Label */}
                            <span
                                className={`relative z-10 transition-colors duration-150 ${isActive
                                    ? "text-accent font-semibold"
                                    : "text-muted hover:text-primary"
                                    }`}
                            >
                                {o.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}