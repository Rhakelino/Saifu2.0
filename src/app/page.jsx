"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { Wallet, TrendingUp, Shield, Coins } from "lucide-react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await signIn.social({
                provider: "google",
                callbackURL: `${window.location.origin}/dashboard`,
            });
        } catch (error) {
            console.error("Login failed:", error);
            setIsLoading(false);
        }
    };

    const features = [
        { icon: Wallet, label: "Multi Dompet", color: "text-zinc-300", bg: "bg-zinc-800/60 border-zinc-700/50" },
        { icon: TrendingUp, label: "Real-time", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
        { icon: Shield, label: "Aman", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-zinc-950 relative overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[120px] bg-white pointer-events-none" />

            {/* Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-sm animate-fade-in">
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-5 shadow-2xl">
                        <Coins className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Saifu</h1>
                    <p className="text-sm text-zinc-500 text-center">
                        Kelola keuangan dengan lebih cerdas
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 mb-6 shadow-2xl">
                    <h2 className="text-base font-semibold text-zinc-100 mb-1">Selamat Datang</h2>
                    <p className="text-sm text-zinc-500 mb-6">
                        Masuk untuk mulai mengelola keuanganmu
                    </p>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className={`w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold py-3 px-5 rounded-xl transition-all duration-150 text-sm border border-zinc-200 ${
                            isLoading
                                ? "opacity-60 cursor-wait"
                                : "active:scale-[0.98] cursor-pointer"
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                                <span>Memuat...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Lanjutkan dengan Google
                            </>
                        )}
                    </button>
                </div>

                {/* Feature Pills */}
                <div className="grid grid-cols-3 gap-2.5">
                    {features.map(({ icon: Icon, label, color, bg }) => (
                        <div
                            key={label}
                            className={`rounded-xl border ${bg} p-3.5 flex flex-col items-center gap-2`}
                        >
                            <Icon className={`w-4 h-4 ${color}`} />
                            <span className={`text-[10px] font-semibold ${color} opacity-80`}>{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
