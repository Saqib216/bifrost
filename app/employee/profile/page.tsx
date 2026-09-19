import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import AvatarUpload from "./_components/AvatarUpload";
import AnimatedNumber from "@/components/AnimatedNumber";

export default async function EmployeeProfilePage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            createdAt: true,
            tasks: {
                select: { status: true },
            },
        },
    });

    if (!user) {
        redirect("/login");
    }

    const totalTasks = user.tasks.length;
    const completedTasks = user.tasks.filter((t) => t.status === "COMPLETED").length;
    const activeTasks = user.tasks.filter((t) => t.status === "ACTIVE").length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const memberSince = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
    }).format(new Date(user.createdAt));

    const stats = [
        {
            label: "Total Tasks",
            count: totalTasks,
            border: "border-info/30",
            text: "text-info",
            icon: "fa-solid fa-list-check",
        },
        {
            label: "Active",
            count: activeTasks,
            border: "border-warning/30",
            text: "text-warning",
            icon: "fa-solid fa-hourglass-half",
        },
        {
            label: "Completed",
            count: completedTasks,
            border: "border-success/30",
            text: "text-success",
            icon: "fa-solid fa-circle-check",
        },
    ];

    return (
        <div className="mx-4 sm:mx-10 mb-10 max-w-4xl">
            {/* Page Header */}
            <div className="flex flex-col gap-1 mb-8">
                <h2 className="font-semibold text-xl sm:text-2xl tracking-tight text-primary">
                    My Profile
                </h2>
                <p className="text-sm text-muted">
                    Manage your personal details and profile picture.
                </p>
            </div>

            {/* Profile Card */}
            <div className="bg-card border border-border rounded-lg p-6 sm:p-8 flex flex-col gap-8 mb-8">
                {/* Avatar Uploader Section */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                        Profile Photo
                    </h3>
                    <AvatarUpload currentImage={user.image} userName={user.name} />
                </div>

                {/* Personal Information Grid */}
                <div className="pt-6 border-t border-border flex flex-col gap-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                        Account Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="flex flex-col gap-1 p-3.5 rounded-md bg-surface border border-border">
                            <span className="text-[11px] font-medium text-muted uppercase tracking-wider flex items-center gap-1.5">
                                <i className="fa-regular fa-user text-xs"></i> Full Name
                            </span>
                            <span className="text-sm font-semibold text-primary">{user.name}</span>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1 p-3.5 rounded-md bg-surface border border-border">
                            <span className="text-[11px] font-medium text-muted uppercase tracking-wider flex items-center gap-1.5">
                                <i className="fa-regular fa-envelope text-xs"></i> Email Address
                            </span>
                            <span className="text-sm font-semibold text-primary">{user.email}</span>
                        </div>

                        {/* Role */}
                        <div className="flex flex-col gap-1 p-3.5 rounded-md bg-surface border border-border">
                            <span className="text-[11px] font-medium text-muted uppercase tracking-wider flex items-center gap-1.5">
                                <i className="fa-solid fa-shield-halved text-xs"></i> Role
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-wider text-accent px-2 py-0.5 bg-accent/10 border border-accent/20 rounded w-fit">
                                {user.role}
                            </span>
                        </div>

                        {/* Member Since */}
                        <div className="flex flex-col gap-1 p-3.5 rounded-md bg-surface border border-border">
                            <span className="text-[11px] font-medium text-muted uppercase tracking-wider flex items-center gap-1.5">
                                <i className="fa-regular fa-calendar text-xs"></i> Member Since
                            </span>
                            <span className="text-sm font-semibold text-primary">{memberSince}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Task Performance Overview */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base tracking-tight text-primary">
                        Task Performance
                    </h3>
                    <span className="text-xs text-muted font-medium">
                        Completion Rate: <span className="text-success font-semibold">{completionRate}%</span>
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-card rounded-full overflow-hidden border border-border">
                    <div
                        className="h-full bg-success transition-all duration-500 rounded-full"
                        style={{ width: `${completionRate}%` }}
                    />
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`bg-card rounded-md border ${stat.border} p-4 flex flex-col gap-2`}
                        >
                            <div className="flex items-center gap-2">
                                <i className={`${stat.icon} ${stat.text} text-xs`}></i>
                                <span className="text-xs font-semibold tracking-wider text-muted uppercase">
                                    {stat.label}
                                </span>
                            </div>
                            <AnimatedNumber
                                value={stat.count}
                                className={`text-2xl sm:text-3xl font-bold font-mono ${stat.text}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
