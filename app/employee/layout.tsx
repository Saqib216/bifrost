import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";
import { redirect } from "next/navigation";

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if(session?.user?.role !== "EMPLOYEE"){
        redirect('/login');
    }

    return (
        <div className="flex justify-between mx-5">
            <Sidebar role="EMPLOYEE"/>
            <main className="flex-1 p-6">{children}</main>
        </div>
    )
}