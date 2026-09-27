import { signOut } from "@/auth";
import Navlinks from "./Navlinks";
import Logo from "./Logo";
import SidebarStats from "./SidebarStats";
import { AccentColor } from "@prisma/client";
import AccentToggle from "./AccentToggle";

export default function Sidebar({
    role,
    isMobile = false,
    accentColor,
}: {
    role: 'ADMIN' | 'EMPLOYEE';
    isMobile?: boolean;
    accentColor: AccentColor;
}) {
    return (
        <div className={`flex flex-col gap-1 ${isMobile ? 'h-full w-full' : 'border-r border-border h-full shrink-0 w-56 px-3 py-5'}`}>

            {/* Logo (Desktop only, drawer has its own header) */}
            {!isMobile && (
                <div className='flex items-center gap-3 shrink-0 px-1 mb-5'>
                    <div className='flex flex-col gap-0.5'>
                        <Logo />
                        <span className='text-[10px] font-semibold tracking-widest uppercase text-muted leading-tight'>{role}</span>
                    </div>
                </div>
            )}

            {/* Navlinks: */}
            <Navlinks role={role} />

            {/* Stats + Logout */}
            <div className="mt-auto flex flex-col gap-3 pt-4">
                <AccentToggle currentAccent={accentColor} />
                <SidebarStats role={role} />
                <form action={
                    async () => {
                        'use server';
                        await signOut({ redirectTo: '/' });
                    }
                }>
                    <button
                        title="Logout"
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-secondary hover:text-danger hover:bg-danger/10 cursor-pointer transition-colors duration-150 ease-in-out"
                    >
                        <i className="fa-solid fa-right-from-bracket fa-fw text-[13px]" />
                        <span>Logout</span>
                    </button>
                </form>
            </div>
        </div>
    )
}