import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { redirect } from "next/navigation";

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if(session?.user?.role !== "EMPLOYEE"){
        redirect('/login');
    }

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden">
            {/* Mobile Navigation Bar & Drawer */}
            <MobileHeader role="EMPLOYEE">
                <Sidebar role="EMPLOYEE" isMobile />
            </MobileHeader>

            {/* Desktop Fixed Sidebar */}
            <div className="hidden md:flex h-full shrink-0">
                <Sidebar role="EMPLOYEE" />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
    )
}