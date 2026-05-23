"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, Plus } from "lucide-react";
import { useState } from "react";
import AddTransactionForm from "./AddTransactionForm";

export default function BottomNav({ wallets }) {
    const pathname = usePathname();
    const [isAddOpen, setIsAddOpen] = useState(false);

    const navItems = [
        { href: "/dashboard", icon: LayoutDashboard, label: "Beranda" },
        { isFab: true },
        { href: "/wallet", icon: Wallet, label: "Dompet" },
    ];

    return (
        <>
            <div className="fixed bottom-0 z-50 w-full max-w-md mx-auto bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
                <div className="flex items-center justify-around h-16 px-4">
                    {navItems.map((item, index) => {
                        if (item.isFab) {
                            return (
                                <button
                                    key="fab"
                                    onClick={() => setIsAddOpen(true)}
                                    className="relative -top-5 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 active:scale-95 transition-all duration-200 border-4 border-zinc-950"
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
                                className={`flex flex-col items-center justify-center w-16 h-full space-y-1 active:scale-95 transition-all duration-200 ${
                                    active ? "text-zinc-50" : "text-zinc-500 hover:text-zinc-400"
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${active ? "animate-scale-in" : ""}`} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {isAddOpen && (
                <AddTransactionForm wallets={wallets} onClose={() => setIsAddOpen(false)} />
            )}
        </>
    );
}
