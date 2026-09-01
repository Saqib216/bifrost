import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if(session?.user?.role !== "ADMIN"){
        redirect("/login");
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar role="ADMIN"/>
            <main className="flex-1 h-full overflow-y-auto p-6">{children}</main>
        </div>
    )
}