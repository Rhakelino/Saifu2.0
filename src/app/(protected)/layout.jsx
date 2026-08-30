"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import OfflineBanner from "@/components/OfflineBanner";
import InstallPrompt from "@/components/InstallPrompt";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";

export default function ProtectedLayout({ children }) {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const [tokenHandled, setTokenHandled] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("session_token");
        if (token) {
            document.cookie = `better-auth.session_token=${token};path=/;max-age=${60 * 60 * 24 * 30};samesite=lax`;
            const url = new URL(window.location.href);
            url.searchParams.delete("session_token");
            window.location.replace(url.pathname);
            return;
        }
        setTokenHandled(true);
    }, []);

    useEffect(() => {
        if (tokenHandled && !isPending && !session) {
            router.replace("/");
        }
    }, [session, isPending, router, tokenHandled]);

    if (!tokenHandled || isPending || !session) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <OfflineBanner />
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto pb-28 md:pb-10 pt-5 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
            <BottomNav />
            <InstallPrompt />
        </div>
    );
}
