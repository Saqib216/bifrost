"use client";

import { useEffect, useState } from "react";

export default function AnimatedNumber({ value, className }: { value: number, className?: string }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 600;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setDisplayValue(Math.round(progress * value));

            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, [value]);

    return <span className={className}>{displayValue}</span>;
}