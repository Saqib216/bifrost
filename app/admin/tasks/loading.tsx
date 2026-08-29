export default function Loading(){
    return (
        <div className="mx-10 mt-10 animate-pulse">
            {/* Stat Cards skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {
                    [...Array(4)].map((_,i) => (
                        <div key={i} className="bg-card border border-border rounded-md p-4 h-20" />
                    ))
                }
            </div>

            {/* Task Cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {
                    [...Array(6)].map((_, i) => { 
                        return <div key={i} className="bg-card border border-border rounded-md p-4 h-32" />
                     })
                }
            </div>
        </div>
    )
}