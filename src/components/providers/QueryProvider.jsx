"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Data dianggap "fresh" selama 1 menit.
                        // Pindah halaman dalam waktu < 1 menit TIDAK akan trigger fetch ulang.
                        staleTime: 1000 * 60 * 1,
                        // Cache disimpan di memori selama 5 menit sebelum dihapus total jika tidak digunakan.
                        gcTime: 1000 * 60 * 5,
                        // Jangan fetch ulang setiap kali user mindahin fokus window (hemat kuota Supabase).
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
