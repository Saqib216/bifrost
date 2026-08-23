import Sidebar from "@/components/Sidebar";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex justify-between mx-5">
            <Sidebar role="EMPLOYEE"/>
            <main>{children}</main>
        </div>
    )
}