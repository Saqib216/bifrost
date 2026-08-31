import { signOut } from "@/auth";
import Navlinks from "./Navlinks";

export default function Sidebar({ role }: { role: 'ADMIN' | 'EMPLOYEE' }) {
    return (
        <div className="flex flex-col gap-1 border-r border-border min-h-screen w-56 px-3 py-5">

            {/* Logo */}
            <div className='flex items-center gap-3 shrink-0 px-1 mb-5'>
                <div className='w-8 h-8 flex items-center justify-center bg-accent rounded-md shrink-0'>
                    <span className='text-white font-bold text-sm'>W</span>
                </div>
                <div className='flex flex-col'>
                    <h2 className='text-lg font-bold tracking-tight text-primary whitespace-nowrap leading-tight'>Workforce</h2>
                    <span className='text-[10px] font-semibold tracking-widest uppercase text-muted leading-tight'>{role}</span>
                </div>
            </div>

            {/* Navlinks: */}
            <Navlinks role={role} />

            {/* Logout */}
            <div className="mt-auto">
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