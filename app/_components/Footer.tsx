import Logo from "@/components/Logo";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="px-6 sm:px-10 lg:px-20 py-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <Logo />

            <p className="text-xs text-muted">&copy; 2026 Workforce. All rights reserved.</p>

            <div className="flex items-center gap-4">
                <Link href="https://github.com/Saqib216" target="_blank" className="text-muted hover:text-primary transition-colors duration-200">
                    <i className="fa-brands fa-github text-base"></i>
                </Link>
                <Link href="https://linkedin.com/in/saqib-hussnain" target="_blank" className="text-muted hover:text-primary transition-colors duration-200">
                    <i className="fa-brands fa-linkedin text-base"></i>
                </Link>
            </div>
        </footer>
    );
}