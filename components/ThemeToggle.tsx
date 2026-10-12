"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Theme = "dark" | "light";

export default function ThemeToggle({ currentTheme }: { currentTheme: Theme }) {
    const [theme, setTheme] = useState<Theme>(currentTheme);
    const router = useRouter();

    const handleSelect = (next: Theme) => {
        if (next === theme) return;
        setTheme(next);

        document.documentElement.setAttribute('data-theme', next);
        document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
        router.refresh();
    };

    const options: { value: Theme; icon: string, label: string }[] = [
        { value: "dark", icon: "fa-solid fa-moon", label: "Dark" },
        { value: "light", icon: "fa-solid fa-sun", label: "Light" },
    ];

    return (
        <div className="flex flex-col gap-2 px-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted px-1">Theme</span>
            <div className="flex items-center gap-1 p-1 rounded-md bg-card border border-border">
                {options.map(o => (
                    <button
                        key={o.value}
                        type="button"
                        title={o.label}
                        onClick={() => handleSelect(o.value)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors duration-150 ${theme === o.value
                            ? "bg-accent/15 text-accent"
                            : "text-muted hover:text-primary"
                            }`}
                    >
                        <i className={`${o.icon} text-[11px]`} />
                        {o.label}
                    </button>
                ))}
            </div>
        </div>
    )
}