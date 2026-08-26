"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api-client";
import { toast } from "sonner";

export function useTransactions(walletId) {
  const query = useQuery({
    queryKey: walletId ? ["transactions", walletId] : ["transactions"],
    queryFn: () => api.getTransactions(walletId),
    staleTime: 1000 * 60 * 1,
    retry: 1,
  });

  return {
    transactions: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    ...query,
  };
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      toast.success("Transaksi berhasil disimpan");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Gagal menyimpan transaksi");
    },
  });
}

export function useTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.transferBetweenWallets(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      toast.success("Transfer berhasil dilakukan");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Gagal melakukan transfer");
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ transactionId, data }) => api.updateTransaction(transactionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      toast.success("Perubahan transaksi disimpan");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Gagal menyimpan perubahan");
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId) => api.deleteTransaction(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      toast.success("Transaksi berhasil dihapus");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Gagal menghapus transaksi");
    },
  });
}
