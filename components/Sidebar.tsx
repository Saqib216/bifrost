import Navlinks from "./Navlinks";

export default function Sidebar({ role }: { role: 'ADMIN' | 'EMPLOYEE' }) {
    return (
        <div className="flex flex-col gap-5 border-r-2 border-muted h-screen pr-4">
            <div className='flex items-center gap-2 sm:gap-3 group shrink-0'>
                <div className='w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-card border border-border rounded-lg group-hover:border-border-hover transition-colors duration-150 ease-in-out'>
                    <span className='text-accent font-bold text-sm sm:text-base'>W</span>
                </div>
                <h2 className='hidden sm:block text-sm font-semibold tracking-tight uppercase text-primary whitespace-nowrap'>Workforce Pro</h2>
            </div>
            <span className="px-2 py-1 bg-accent text-sm rounded-md font-semibold text-primary text-center tracking-wide">
                {role}
            </span>

            {/* Navlinks: */}
            <Navlinks role={role} />

            {/* Logout */}
            <button title="Logout"
                className="bg-surface border border-border rounded-md py-1 cursor-pointer hover:bg-card transition-all ease-in-out duration-300 font-semibold active:scale-95">
                Logout
            </button>
        </div>
    )
}