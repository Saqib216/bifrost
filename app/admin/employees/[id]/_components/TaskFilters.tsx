"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import StatusFilterSelect from "@/app/admin/_components/StatusFilterSelect";

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
                    className="w-full bg-card border border-border rounded-md pl-9 pr-3 py-2 text-sm text-primary placeholder:text-muted transition-all duration-150 ease-in-out hover:border-muted focus:border-accent focus:ring-4 focus:ring-accent/30"
                />
            </div>

            <StatusFilterSelect
                value={currentStatus}
                onChange={(val) => updateParam("status", val)}
                className="w-full sm:w-44"
            />
        </div>
    );
}
