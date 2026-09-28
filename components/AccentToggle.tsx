"use client";

import { useOptimistic, useTransition } from "react";
import { updateAccentColor } from "@/app/lib/actions";
import { AccentColor } from "@prisma/client";

const accents: { value: AccentColor; label: string; hex: string }[] = [
    { value: "MAGENTA", label: "Magenta", hex: "#F2266E" },
    { value: "BLUE", label: "Blue", hex: "#0070F3" },
    { value: "AMBER", label: "Amber", hex: "#F97316" },
];

export default function AccentToggle({ currentAccent }: { currentAccent: AccentColor }) {
    const [optimisticAccent, setOptimisticAccent] = useOptimistic(
        currentAccent,
        (_, next: AccentColor) => next
    );
    const [isPending, startTransition] = useTransition();

    const handleSelect = (color: AccentColor) => {
        if (color === optimisticAccent || isPending) return;

        document.documentElement.setAttribute("data-accent", color.toLowerCase());

        startTransition(async () => {
            setOptimisticAccent(color);
            const result = await updateAccentColor(color);
            if (!result.success) {
                document.documentElement.setAttribute("data-accent", currentAccent.toLowerCase());
            }
        });
    };

    return (
        <div className="flex flex-col gap-2 px-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted px-1">
                Accent
            </span>
            <div className="flex items-center gap-2 px-1">
                {accents.map((a) => (
                    <button
                        key={a.value}
                        type="button"
                        title={a.label}
                        disabled={isPending}
                        onClick={() => handleSelect(a.value)}
                        style={{ backgroundColor: a.hex }}
                        className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-150 disabled:opacity-50 ${optimisticAccent === a.value
                                ? "ring-2 ring-offset-2 ring-offset-surface ring-white/40"
                                : ""
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}