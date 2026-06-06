import { useQuery } from "@tanstack/react-query";

async function fetchTransactions() {
    const res = await fetch("/api/transactions");
    if (!res.ok) {
        throw new Error("Failed to fetch transactions");
    }
    return res.json();
}

export function useTransactions() {
    const { data: transactions = [], isLoading, error } = useQuery({
        queryKey: ["transactions"],
        queryFn: fetchTransactions,
    });

    return { transactions, isLoading, error };
}
