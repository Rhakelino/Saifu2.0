"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, Plus } from "lucide-react";
import { useState } from "react";
import AddTransactionForm from "./AddTransactionForm";
import { useWallets } from "@/hooks/useWallets";

export default function BottomNav() {
    const pathname = usePathname();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const { wallets } = useWallets();

    const navItems = [
        { href: "/dashboard", icon: LayoutDashboard, label: "Beranda" },
        { isFab: true },
        { href: "/wallet", icon: Wallet, label: "Dompet" },
    ];

    return (
        <>
            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-zinc-950 border-t border-zinc-800">
                <div className="relative flex items-center justify-around h-20 px-6 pb-safe max-w-md mx-auto">
                    {navItems.map((item, i) => {
                        if (item.isFab) {
                            return (
                                <button
                                    key="fab"
                                    onClick={() => setIsAddOpen(true)}
                                    className="relative -top-4 flex items-center justify-center w-14 h-14 rounded-full bg-white text-zinc-900 border-[3px] border-zinc-950 hover:bg-zinc-200 active:scale-95 transition-transform"
                                >
                                    <Plus className="w-6 h-6" />
                                </button>
                            );
                        }

                        const active = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 ${
                                    active
                                        ? "text-white"
                                        : "text-zinc-500 hover:text-zinc-300"
                                }`}
                            >
                                <div className={`p-1.5 rounded-lg transition-colors ${active ? "bg-white/10" : ""}`}>
                                    <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
                                </div>
                                <span className={`text-[10px] font-semibold tracking-wide ${active ? "text-white" : "text-zinc-600"}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {isAddOpen && (
                <AddTransactionForm wallets={wallets} onClose={() => setIsAddOpen(false)} />
            )}
        </>
    );
}
