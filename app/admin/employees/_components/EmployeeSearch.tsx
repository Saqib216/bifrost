'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function EmployeeSearch() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSearch = searchParams.get('search') || '';

    const updateSearch = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) params.set('search', value);
        else params.delete('search');

        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="relative max-w-sm mb-6">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs" />
            <input
                type="text"
                defaultValue={currentSearch}
                onChange={(e) => updateSearch(e.target.value)}
                placeholder="Search employees by name..."
                className="w-full bg-card border border-border rounded-md pl-9 pr-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
        </div>
    );
}