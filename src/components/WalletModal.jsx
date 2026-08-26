"use client";

import { useEffect } from "react";
import { useCreateWallet, useUpdateWallet } from "@/hooks/useWallets";
import { X, Wallet } from "lucide-react";

export default function WalletModal({ wallet, onClose }) {
    const isEdit = !!wallet;

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const createWalletMutation = useCreateWallet();
    const updateWalletMutation = useUpdateWallet();

    const loading = createWalletMutation.isPending || updateWalletMutation.isPending;

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get("name");
        const type = formData.get("type");

        if (isEdit) {
            updateWalletMutation.mutate(
                { walletId: wallet.id, data: { name, type } },
                {
                    onSuccess: () => {
                        onClose();
                    },
                }
            );
        } else {
            createWalletMutation.mutate(
                { name, type },
                {
                    onSuccess: () => {
                        onClose();
                    },
                }
            );
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="drawer-content relative w-full max-w-[480px]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Handle */}
                <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-5" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                            <Wallet className="w-4 h-4 text-zinc-400" />
                        </div>
                        <h2 className="text-base font-semibold text-zinc-100">
                            {isEdit ? "Edit Dompet" : "Tambah Dompet"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Nama Dompet</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="contoh: BCA, GoPay, Dompet Harian"
                            defaultValue={wallet?.name || ""}
                            required
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Jenis</label>
                        <select
                            name="type"
                            defaultValue={wallet?.type || "bank"}
                            required
                            className="input"
                        >
                            <option value="bank">🏦 Bank</option>
                            <option value="ewallet">📱 E-Wallet</option>
                            <option value="cash">💵 Tunai</option>
                        </select>
                    </div>

                    <div className="flex gap-2.5 mt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-ghost flex-1 justify-center py-2.5 text-sm"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1 justify-center py-2.5 text-sm"
                        >
                            {loading ? "Menyimpan..." : isEdit ? "Simpan" : "Tambah"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
