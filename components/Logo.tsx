export default function Logo({
    size = "text-lg",
    showVersion = true,
    version = "v1.0",
}: {
    size?: string;
    showVersion?: boolean;
    version?: string;
}) {
    return (
        <span className="inline-flex items-center gap-2 font-display select-none">
            <span className={`font-bold ${size} tracking-tight`}>
                <span className="text-accent">B</span>
                <span className="text-primary">IFROST</span>
            </span>
            {showVersion && (
                <span className="text-[10px] font-mono font-medium text-muted/70 bg-card border border-border/70 px-1.5 py-0.5 rounded leading-none">
                    {version}
                </span>
            )}
        </span>
    );
}