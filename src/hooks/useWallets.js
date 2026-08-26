"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api-client";
import { toast } from "sonner";

export function useWallets() {
  return useQuery({
    queryKey: ["wallets"],
    queryFn: () => api.getWallets(),
    staleTime: 1000 * 60 * 1, // 1 minute
    retry: 1,
  });
}

export function useCreateWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.createWallet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Dompet berhasil ditambahkan");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Gagal menambahkan dompet");
    },
  });
}

export function useUpdateWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ walletId, data }) => api.updateWallet(walletId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      toast.success("Dompet berhasil diperbarui");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Gagal memperbarui dompet");
    },
  });
}

export function useDeleteWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (walletId) => api.deleteWallet(walletId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Dompet berhasil dihapus");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Gagal menghapus dompet");
    },
  });
}
