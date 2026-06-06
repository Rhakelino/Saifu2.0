"use client";

import { useSession } from "@/lib/auth-client";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import DashboardClient from "./DashboardClient";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";

export default function DashboardPage() {
    const { data: session } = useSession();
    const {
        wallets,
        transactions,
        totalBalance,
        totalIncome,
        totalExpense,
        isLoading,
    } = useDashboardSummary();

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <DashboardClient
            user={session?.user}
            wallets={wallets}
            transactions={transactions}
            totalBalance={totalBalance}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
        />
    );
}
