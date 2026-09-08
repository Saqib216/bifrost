export default function Logo({size= "text-lg"}: {size?:string}){
    return(
        <span className={`font-bold ${size} tracking-tight font-display`}>
            <span className="text-accent">W</span>
            <span className="text-primary">ORKFORCE</span>
        </span>
    )
}