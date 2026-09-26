"use client";

import { TaskStatus } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const statusFilterItems: Record<string, string> = {
    ALL: "All Status",
    [TaskStatus.NEW]: "New",
    [TaskStatus.ACTIVE]: "Active",
    [TaskStatus.COMPLETED]: "Completed",
    [TaskStatus.FAILED]: "Failed",
};

export const statusDotMap: Record<string, string> = {
    ALL: "bg-muted",
    [TaskStatus.NEW]: "bg-info",
    [TaskStatus.ACTIVE]: "bg-warning",
    [TaskStatus.COMPLETED]: "bg-success",
    [TaskStatus.FAILED]: "bg-danger",
};

interface StatusFilterSelectProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

export default function StatusFilterSelect({
    value,
    onChange,
    className = "w-full sm:w-44",
    placeholder = "All Status",
}: StatusFilterSelectProps) {
    const selectedValue = value || "ALL";

    return (
        <div className={`shrink-0 ${className}`}>
            <Select
                value={selectedValue}
                onValueChange={(val) => onChange(val === "ALL" ? "" : (val as string))}
                items={statusFilterItems}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder}>
                        {(val) => {
                            const label = statusFilterItems[val as string] || placeholder;
                            const dot = statusDotMap[val as string];
                            return (
                                <div className="flex items-center gap-2">
                                    {dot ? <span className={`w-1.5 h-1.5 rounded-full ${dot}`} /> : null}
                                    <span>{label}</span>
                                </div>
                            );
                        }}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted" />
                            <span>All Status</span>
                        </div>
                    </SelectItem>
                    <SelectItem value={TaskStatus.NEW}>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-info" />
                            <span>New</span>
                        </div>
                    </SelectItem>
                    <SelectItem value={TaskStatus.ACTIVE}>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                            <span>Active</span>
                        </div>
                    </SelectItem>
                    <SelectItem value={TaskStatus.COMPLETED}>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-success" />
                            <span>Completed</span>
                        </div>
                    </SelectItem>
                    <SelectItem value={TaskStatus.FAILED}>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-danger" />
                            <span>Failed</span>
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
