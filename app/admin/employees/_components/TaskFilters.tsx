"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function TaskFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentStatus = searchParams.get("status") || "";
    const currentSearch = searchParams.get("search") || "";

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs" />
                <input
                    type="text"
                    defaultValue={currentSearch}
                    onChange={(e) => updateParam("search", e.target.value)}
                    placeholder="Search tasks by title..."
                    className="w-full bg-card border border-border rounded-md pl-9 pr-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
                />
            </div>

            <select
                value={currentStatus}
                onChange={(e) => updateParam("status", e.target.value)}
                className="bg-card border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-accent/50 transition-colors cursor-pointer"
            >
                <option value="">All Status</option>
                <option value="NEW">New</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
            </select>
        </div>
    );
}