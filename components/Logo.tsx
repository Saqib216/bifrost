export default function Logo({size= "text-lg"}: {size?:string}){
    return(
        <span className={`font-bold ${size} tracking-tight font-display`}>
            <span className="text-accent">B</span>
            <span className="text-primary">IFROST</span>
        </span>
    )
}