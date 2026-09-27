import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { redirect } from "next/navigation";
import { getAccentColor } from "../lib/getAccentColor";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
        redirect("/login");
    }

    const accentColor = await getAccentColor();

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden">
            {/* Mobile Navigation Bar & Drawer */}
            <MobileHeader role="ADMIN">
                <Sidebar role="ADMIN" isMobile accentColor={accentColor} />
            </MobileHeader>

            {/* Desktop Fixed Sidebar */}
            <div className="hidden md:flex h-full shrink-0">
                <Sidebar role="ADMIN" accentColor={accentColor} />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
    )
}