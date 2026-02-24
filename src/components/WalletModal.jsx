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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-accent" />
                        {isEdit ? "Edit Dompet" : "Tambah Dompet"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-sm text-muted-foreground mb-1.5">
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
                    <div className="mb-6">
                        <label className="block text-sm text-muted-foreground mb-1.5">
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
                        <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">
                            Batal
                        </button>
                        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                            {loading ? "Menyimpan..." : isEdit ? "Simpan" : "Tambah"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
