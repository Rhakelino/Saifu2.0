import { useQuery } from "@tanstack/react-query";

async function fetchWallets() {
    const res = await fetch("/api/wallets");
    if (!res.ok) {
        throw new Error("Failed to fetch wallets");
    }
    return res.json();
}

export function useWallets() {
    const { data: wallets = [], isLoading, error } = useQuery({
        queryKey: ["wallets"],
        queryFn: fetchWallets,
    });

    return { wallets, isLoading, error };
}
