"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({ value, className }: { value: number, className?: string }) {
    const [displayValue, setDisplayValue] = useState(0);

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (easeOutQuad) for smooth slowdown at the end
            const easeOutProgress = 1 - Math.pow(1 - progress, 2);

            setDisplayValue(Math.round(easeOutProgress * value));

            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, [value, isInView]);

    return <span ref={ref} className={className}>{displayValue}</span>;
}