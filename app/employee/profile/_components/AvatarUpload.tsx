"use client";

import { updateAvatar, removeAvatar } from "@/app/lib/actions";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

interface AvatarUploadProps {
    currentImage: string | null;
    userName: string;
}

export default function AvatarUpload({ currentImage, userName }: AvatarUploadProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage);
    const [isPending, startTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Client-side quick checks
        if (!file.type.startsWith("image/")) {
            toast.error("Please choose a valid image file.");
            return;
        }

        if (file.size > 4 * 1024 * 1024) {
            toast.error("Image must be smaller than 4MB.");
            return;
        }

        // 2. Instant local preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // 3. Upload via Server Action
        const formData = new FormData();
        formData.append("file", file);

        startTransition(async () => {
            const result = await updateAvatar(formData);
            if (result.success) {
                toast.success("Avatar updated successfully!");
                if (result.url) setPreviewUrl(result.url);
            } else {
                toast.error(result.message || "Failed to upload image.");
                // Revert to current image on error
                setPreviewUrl(currentImage);
            }
        });
    };

    const handleRemove = () => {
        startTransition(async () => {
            const result = await removeAvatar();
            if (result.success) {
                toast.success("Avatar removed.");
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
            } else {
                toast.error(result.message || "Failed to remove avatar.");
            }
        });
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Circle */}
            <div className="relative group">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border group-hover:border-accent/60 transition-colors duration-200 bg-surface flex items-center justify-center">
                    {previewUrl ? (
                        <Image
                            src={previewUrl}
                            alt={userName}
                            fill
                            className="object-cover"
                            sizes="96px"
                            unoptimized={previewUrl.startsWith("blob:")}
                        />
                    ) : (
                        <span className="text-2xl font-bold font-mono text-accent">
                            {initials}
                        </span>
                    )}

                    {/* Loading Overlay */}
                    {isPending && (
                        <div className="absolute inset-0 bg-surface/80 flex items-center justify-center">
                            <i className="fa-solid fa-circle-notch fa-spin text-accent text-xl"></i>
                        </div>
                    )}
                </div>

                {/* Hover Camera Badge */}
                <button
                    type="button"
                    disabled={isPending}
                    onClick={() => fileInputRef.current?.click()}
                    title="Change photo"
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-xs shadow-md hover:bg-accent-hover transition-colors cursor-pointer disabled:opacity-50"
                >
                    <i className="fa-solid fa-camera"></i>
                </button>
            </div>

            {/* Upload Controls & Instructions */}
            <div className="flex flex-col items-center sm:items-start gap-2">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/gif"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isPending}
                />

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {isPending ? "Uploading..." : "Upload New Photo"}
                    </button>

                    {previewUrl && (
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={handleRemove}
                            className="px-3.5 py-1.5 rounded-md text-xs font-medium text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Remove
                        </button>
                    )}
                </div>

                <p className="text-[11px] text-muted">
                    JPG, PNG, WEBP or GIF up to 4MB.
                </p>
            </div>
        </div>
    );
}
