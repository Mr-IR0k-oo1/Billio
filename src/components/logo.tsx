import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor, white }: { className?: string; uniColor?: boolean; white?: boolean }) => {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div className={cn(
                "flex items-center justify-center size-8 rounded-lg font-black text-2xl font-display transition-all",
                white ? "bg-white" : (uniColor ? "bg-current" : "bg-gradient-to-br from-[#9B99FE] to-[#2BC8B7]")
            )}>
                <span className={white ? "text-black" : (uniColor ? "text-background" : "text-white")}>Σ</span>
            </div>
            <span className={cn(
                "text-xl font-black tracking-tight font-display transition-colors",
                white || uniColor ? "text-white" : "text-white"
            )}>
                Billio
            </span>
        </div>
    )
}

export const LogoIcon = ({ className, uniColor, white }: { className?: string; uniColor?: boolean; white?: boolean }) => {
    return (
        <div className={cn(
            "flex items-center justify-center size-5 rounded-md font-black text-xs font-display transition-all",
            white ? "bg-white" : (uniColor ? "bg-current" : "bg-gradient-to-br from-[#9B99FE] to-[#2BC8B7]"),
            className
        )}>
            <span className={white ? "text-black" : (uniColor ? "text-background" : "text-white")}>Σ</span>
        </div>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <span className={cn("font-display font-black text-2xl text-white", className)}>Σ</span>
    )
}
