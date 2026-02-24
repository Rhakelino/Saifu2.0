"use client";

import { signIn } from "@/lib/auth-client";
import { Wallet, TrendingUp, Shield, ArrowRight, Coins } from "lucide-react";

export default function LoginPage() {
    const handleGoogleLogin = async () => {
        await signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div
                className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
                style={{ background: "radial-gradient(circle, #10b981, transparent)" }}
            />
            <div
                className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
                style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }}
            />

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-md animate-fade-in">
                {/* Logo & Brand */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                        <Coins className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="gradient-text">Saifu</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Kelola keuanganmu dengan cerdas
                    </p>
                </div>

                {/* Login Card */}
                <div className="glass rounded-2xl p-8 mb-8">
                    <h2 className="text-xl font-semibold mb-2 text-center">
                        Selamat Datang
                    </h2>
                    <p className="text-muted text-sm text-center mb-8">
                        Masuk untuk mulai mengelola keuanganmu
                    </p>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3.5 px-6 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:shadow-lg hover:shadow-white/10 cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Masuk dengan Google
                    </button>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="card text-center py-4 px-3">
                        <Wallet className="w-6 h-6 text-accent mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Multi Wallet</p>
                    </div>
                    <div className="card text-center py-4 px-3">
                        <TrendingUp className="w-6 h-6 text-accent mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Real-time</p>
                    </div>
                    <div className="card text-center py-4 px-3">
                        <Shield className="w-6 h-6 text-accent mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Aman</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
