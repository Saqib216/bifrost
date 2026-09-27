"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { updateProfileName, changePassword, ActionState } from "@/app/lib/actions";
import { toast } from "sonner";

interface ProfileSettingsProps {
    userName: string;
    userEmail: string;
}

const initialState: ActionState = {
    success: false,
};

export default function ProfileSettings({ userName, userEmail }: ProfileSettingsProps) {
    const [activeTab, setActiveTab] = useState<"general" | "security">("general");

    // Password visibility toggles
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Form state handling 
    const [nameState, nameAction, isNamePending] = useActionState(updateProfileName, initialState);
    const [passState, passAction, isPassPending] = useActionState(changePassword, initialState);

    const passwordFormRef = useRef<HTMLFormElement>(null);

    // Toast notifications on success/error
    useEffect(() => {
        if (nameState.success && nameState.message) {
            toast.success(nameState.message);
        } else if (!nameState.success && nameState.message) {
            toast.error(nameState.message);
        }
    }, [nameState]);

    useEffect(() => {
        if (passState.success && passState.message) {
            toast.success(passState.message);
            passwordFormRef.current?.reset();
        } else if (!passState.success && passState.message) {
            toast.error(passState.message);
        }
    }, [passState]);

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col mb-8">
            {/* Tab Navigation */}
            <div className="flex border-b border-border bg-surface/50">
                <button
                    type="button"
                    onClick={() => setActiveTab("general")}
                    className={`flex items-center gap-2 px-6 py-3.5 text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer border-b-2 -mb-px ${activeTab === "general"
                            ? "border-accent text-accent bg-card"
                            : "border-transparent text-muted hover:text-primary hover:bg-card/40"
                        }`}
                >
                    <i className="fa-regular fa-user"></i>
                    General Details
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("security")}
                    className={`flex items-center gap-2 px-6 py-3.5 text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer border-b-2 -mb-px ${activeTab === "security"
                            ? "border-accent text-accent bg-card"
                            : "border-transparent text-muted hover:text-primary hover:bg-card/40"
                        }`}
                >
                    <i className="fa-solid fa-lock"></i>
                    Security & Password
                </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 sm:p-8">
                {/* 1. GENERAL TAB */}
                {activeTab === "general" && (
                    <form action={nameAction} className="flex flex-col gap-6 max-w-lg">
                        {/* Display Name Input */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={userName}
                                required
                                disabled={isNamePending}
                                placeholder="Enter your full name"
                                className="px-3.5 py-2.5 rounded-md bg-surface border border-border text-primary text-sm transition-all duration-150 ease-in-out hover:border-muted focus:border-accent focus:ring-4 focus:ring-accent/30 disabled:opacity-50"
                            />
                            {nameState.errors?.name && (
                                <p className="text-xs text-danger font-medium mt-0.5">
                                    {nameState.errors.name[0]}
                                </p>
                            )}
                        </div>

                        {/* Email Address (Read-only) */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                    Email Address
                                </label>
                                <span className="text-[11px] text-muted flex items-center gap-1">
                                    <i className="fa-solid fa-lock text-[10px]"></i> Managed by organization
                                </span>
                            </div>
                            <input
                                type="email"
                                value={userEmail}
                                disabled
                                className="px-3.5 py-2.5 rounded-md bg-surface/50 border border-border text-muted text-sm cursor-not-allowed"
                            />
                        </div>

                        {/* Save Name Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isNamePending}
                                className="px-5 py-2 rounded-md text-xs font-semibold bg-accent text-surface hover:bg-accent-hover transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                            >
                                {isNamePending && (
                                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                                )}
                                {isNamePending ? "Saving..." : "Save Name"}
                            </button>
                        </div>
                    </form>
                )}

                {/* 2. SECURITY TAB */}
                {activeTab === "security" && (
                    <form
                        ref={passwordFormRef}
                        action={passAction}
                        className="flex flex-col gap-5 max-w-lg"
                    >
                        {/* Current Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrent ? "text" : "password"}
                                    name="currentPassword"
                                    required
                                    disabled={isPassPending}
                                    placeholder="Enter current password"
                                    className="w-full px-3.5 py-2.5 pr-10 rounded-md bg-surface border border-border text-primary text-sm transition-all duration-150 ease-in-out hover:border-muted focus:border-accent focus:ring-4 focus:ring-accent/30 disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors cursor-pointer text-xs"
                                >
                                    <i className={showCurrent ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"}></i>
                                </button>
                            </div>
                            {passState.errors?.currentPassword && (
                                <p className="text-xs text-danger font-medium mt-0.5">
                                    {passState.errors.currentPassword[0]}
                                </p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNew ? "text" : "password"}
                                    name="newPassword"
                                    required
                                    disabled={isPassPending}
                                    placeholder="At least 6 characters"
                                    className="w-full px-3.5 py-2.5 pr-10 rounded-md bg-surface border border-border text-primary text-sm transition-all duration-150 ease-in-out hover:border-muted focus:border-accent focus:ring-4 focus:ring-accent/30 disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors cursor-pointer text-xs"
                                >
                                    <i className={showNew ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"}></i>
                                </button>
                            </div>
                            {passState.errors?.newPassword && (
                                <p className="text-xs text-danger font-medium mt-0.5">
                                    {passState.errors.newPassword[0]}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-secondary uppercase tracking-wider">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    name="confirmPassword"
                                    required
                                    disabled={isPassPending}
                                    placeholder="Confirm new password"
                                    className="w-full px-3.5 py-2.5 pr-10 rounded-md bg-surface border border-border text-primary text-sm transition-all duration-150 ease-in-out hover:border-muted focus:border-accent focus:ring-4 focus:ring-accent/30 disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors cursor-pointer text-xs"
                                >
                                    <i className={showConfirm ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"}></i>
                                </button>
                            </div>
                            {passState.errors?.confirmPassword && (
                                <p className="text-xs text-danger font-medium mt-0.5">
                                    {passState.errors.confirmPassword[0]}
                                </p>
                            )}
                        </div>

                        {/* Change Password Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isPassPending}
                                className="px-5 py-2 rounded-md text-xs font-semibold bg-accent text-surface hover:bg-accent-hover transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                            >
                                {isPassPending && (
                                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                                )}
                                {isPassPending ? "Updating Password..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
