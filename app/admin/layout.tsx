import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex justify-between mx-5">
            <Sidebar role="ADMIN"/>
            <main>{children}</main>
        </div>
    )
}