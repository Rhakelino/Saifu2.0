"use client";

import Link from "next/link";
import { signOut, useSession } from "@/lib/auth-client";
import { LogOut, Coins, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AddTransactionForm from "./AddTransactionForm";
import { useWallets } from "@/hooks/useWallets";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const { wallets } = useWallets();

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/";
                },
            },
        });
    };

    const navLinks = [
        { href: "/dashboard", label: "Beranda" },
        { href: "/wallet", label: "Dompet" },
    ];

    return (
        <>
            <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                <Coins className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight hidden sm:block">
                                Saifu
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const active = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                                            active
                                                ? "bg-zinc-800 text-white"
                                                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="hidden md:flex items-center gap-2 bg-white hover:bg-zinc-200 text-zinc-900 px-4 py-2 rounded-md text-sm font-semibold transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            Catat
                        </button>

                        <div className="h-5 w-px bg-zinc-800 hidden md:block" />

                        {/* Avatar */}
                        <div className="flex items-center gap-2">
                            {session?.user?.image ? (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name}
                                    className="w-8 h-8 rounded-full border border-zinc-700"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-zinc-300">
                                        {session?.user?.name?.charAt(0) || "U"}
                                    </span>
                                </div>
                            )}
                            <button
                                onClick={handleSignOut}
                                className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-md transition-all active:scale-95"
                                title="Keluar"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {isAddOpen && (
                <AddTransactionForm wallets={wallets} onClose={() => setIsAddOpen(false)} />
            )}
        </>
    );
}
