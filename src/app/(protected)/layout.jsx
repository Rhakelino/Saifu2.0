"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import OfflineBanner from "@/components/OfflineBanner";
import InstallPrompt from "@/components/InstallPrompt";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";

export default function ProtectedLayout({ children }) {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && !session) {
            router.replace("/");
        }
    }, [session, isPending, router]);

    if (isPending || !session) {
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
