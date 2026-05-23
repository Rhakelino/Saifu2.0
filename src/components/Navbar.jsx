"use client";

import Link from "next/link";
import { signOut, useSession } from "@/lib/auth-client";
import { LogOut, Coins } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/";
                },
            },
        });
    };

    // Determine title based on pathname
    let pageTitle = "Saifu";
    if (pathname === "/wallet") pageTitle = "Dompet & Transaksi";
    if (pathname === "/dashboard") pageTitle = "Dashboard";

    return (
        <header className="sticky top-0 z-40 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 h-16 flex flex-col justify-center">
            <div className="px-4 flex items-center justify-between">
                {/* Logo & Title */}
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center active:scale-95 transition-transform">
                        <Coins className="w-4 h-4 text-white" />
                    </Link>
                    <h1 className="text-lg font-semibold text-zinc-50 tracking-tight">
                        {pageTitle}
                    </h1>
                </div>

                {/* User Info & Logout */}
                <div className="flex items-center gap-3">
                    {session?.user?.image ? (
                        <img
                            src={session.user.image}
                            alt={session.user.name}
                            className="w-8 h-8 rounded-full border border-zinc-800"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                            <span className="text-xs font-medium text-zinc-400">
                                {session?.user?.name?.charAt(0) || "U"}
                            </span>
                        </div>
                    )}
                    <button onClick={handleSignOut} className="text-zinc-400 hover:text-rose-400 active:scale-95 transition-all p-1" title="Keluar">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
