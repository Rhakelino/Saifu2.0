"use client";

import { useState, useEffect } from "react";
import { createWallet, updateWallet } from "@/actions/wallet-actions";
import { X, Wallet } from "lucide-react";

export default function WalletModal({ wallet, onClose }) {
    const isEdit = !!wallet;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);

        if (isEdit) {
            formData.set("id", wallet.id);
            await updateWallet(formData);
        } else {
            await createWallet(formData);
        }

        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-zinc-950/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="drawer-content relative" onClick={(e) => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6" />
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-zinc-50 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-50">
                        <Wallet className="w-5 h-5 text-emerald-500" />
                        {isEdit ? "Edit Dompet" : "Tambah Dompet"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-sm text-zinc-400 mb-1.5">
                            Nama Dompet
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="contoh: BCA, GoPay, Dompet Harian"
                            defaultValue={wallet?.name || ""}
                            required
                            className="input"
                        />
                    </div>

                    {/* Type */}
                    <div className="mb-8">
                        <label className="block text-sm text-zinc-400 mb-1.5">
                            Jenis
                        </label>
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

                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center active:scale-95">
                            Batal
                        </button>
                        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center active:scale-95">
                            {loading ? "Menyimpan..." : isEdit ? "Simpan" : "Tambah"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
