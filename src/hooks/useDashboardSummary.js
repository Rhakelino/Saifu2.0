import { useMemo } from "react";
import { useWallets } from "./useWallets";
import { useTransactions } from "./useTransactions";

export function useDashboardSummary() {
    const { wallets, isLoading: walletsLoading, error: walletsError } = useWallets();
    const { transactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions();

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

    return {
        wallets,
        transactions,
        ...summary,
        isLoading: walletsLoading || transactionsLoading,
        error: walletsError || transactionsError,
    };
}
