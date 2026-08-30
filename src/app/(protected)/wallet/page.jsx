"use client";

import { useSession } from "@/lib/auth-client";
import { useWallets } from "@/hooks/useWallets";
import { useTransactions } from "@/hooks/useTransactions";
import WalletPageClient from "./WalletPageClient";
import { WalletSkeleton } from "@/components/LoadingSkeleton";
import { useMemo } from "react";

export default function WalletPage() {
    const { data: session } = useSession();
    const { wallets, isLoading: walletsLoading } = useWallets();
    const { transactions, isLoading: transactionsLoading } = useTransactions();

    const summary = useMemo(() => {
        const safeWallets = Array.isArray(wallets) ? wallets : [];
        const safeTransactions = Array.isArray(transactions) ? transactions : [];

        const totalBalance = safeWallets.reduce((sum, w) => sum + (w.balance || 0), 0);
        const totalIncome = safeTransactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + (t.amount || 0), 0);
        const totalExpense = safeTransactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + (t.amount || 0), 0);
        return { totalBalance, totalIncome, totalExpense };
    }, [wallets, transactions]);

    if (walletsLoading || transactionsLoading) {
        return <WalletSkeleton />;
    }

    return (
        <WalletPageClient
            wallets={wallets}
            transactions={transactions}
            user={session?.user}
            totalBalance={summary.totalBalance}
            totalIncome={summary.totalIncome}
            totalExpense={summary.totalExpense}
        />
    );
}
