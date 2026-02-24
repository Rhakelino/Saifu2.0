"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import {
    LayoutDashboard,
    Wallet,
    LogOut,
    Coins,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/wallet", label: "Dompet", icon: Wallet },
    ];

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/";
                },
            },
        });
    };

    return (
        <nav className="glass sticky top-0 z-40 border-b border-border">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <Coins className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold">Saifu</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden sm:flex items-center gap-1">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const active = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active
                                        ? "bg-accent/10 text-accent"
                                        : "text-muted-foreground hover:text-foreground hover:bg-card"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Section */}
                    <div className="hidden sm:flex items-center gap-3">
                        {session?.user?.image && (
                            <img
                                src={session.user.image}
                                alt={session.user.name}
                                className="w-8 h-8 rounded-full border-2 border-border"
                                referrerPolicy="no-referrer"
                            />
                        )}
                        <span className="text-sm text-muted-foreground max-w-[120px] truncate">
                            {session?.user?.name}
                        </span>
                        <button onClick={handleSignOut} className="btn-ghost !p-2" title="Keluar">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="sm:hidden btn-ghost !p-2"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {mobileOpen && (
                    <div className="sm:hidden pb-4 space-y-1 animate-fade-in">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const active = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active
                                        ? "bg-accent/10 text-accent"
                                        : "text-muted-foreground hover:text-foreground hover:bg-card"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                        <div className="flex items-center gap-3 px-4 py-3 border-t border-border mt-2 pt-3">
                            {session?.user?.image && (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name}
                                    className="w-8 h-8 rounded-full border-2 border-border"
                                    referrerPolicy="no-referrer"
                                />
                            )}
                            <span className="text-sm text-muted-foreground flex-1 truncate">
                                {session?.user?.name}
                            </span>
                            <button onClick={handleSignOut} className="btn-ghost !p-2">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
