"use client";

import { useState } from "react";
import { createTransaction, transferBetweenWallets } from "@/actions/transaction-actions";
import { Plus, TrendingUp, TrendingDown, ArrowLeftRight } from "lucide-react";

export default function AddTransactionForm({ wallets }) {
    const [type, setType] = useState("expense");
    const [loading, setLoading] = useState(false);
    const [amountDisplay, setAmountDisplay] = useState("");
    const [amountRaw, setAmountRaw] = useState("");

    const formatNumber = (value) => {
        const num = value.replace(/\D/g, "");
        if (!num) return "";
        return new Intl.NumberFormat("id-ID").format(Number(num));
    };

    const handleAmountChange = (e) => {
        const raw = e.target.value.replace(/\D/g, "");
        setAmountRaw(raw);
        setAmountDisplay(formatNumber(e.target.value));
    };

    const isTransfer = type === "transfer";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.target);

            if (isTransfer) {
                await transferBetweenWallets(formData);
            } else {
                formData.set("type", type);
                await createTransaction(formData);
            }

            e.target.reset();
            setAmountDisplay("");
            setAmountRaw("");
        } catch (err) {
            alert(err.message);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-accent" />
                Tambah Transaksi
            </h3>

            {/* Type Toggle */}
            <div className="flex gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => setType("income")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${type === "income"
                        ? "bg-income/15 text-income border border-income/30"
                        : "bg-surface text-muted-foreground border border-border hover:border-border-hover"
                        }`}
                >
                    <TrendingUp className="w-4 h-4" />
                    Masuk
                </button>
                <button
                    type="button"
                    onClick={() => setType("expense")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${type === "expense"
                        ? "bg-expense/15 text-expense border border-expense/30"
                        : "bg-surface text-muted-foreground border border-border hover:border-border-hover"
                        }`}
                >
                    <TrendingDown className="w-4 h-4" />
                    Keluar
                </button>
                <button
                    type="button"
                    onClick={() => setType("transfer")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${type === "transfer"
                        ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                        : "bg-surface text-muted-foreground border border-border hover:border-border-hover"
                        }`}
                >
                    <ArrowLeftRight className="w-4 h-4" />
                    Transfer
                </button>
            </div>

            {/* Wallet Select — changes based on type */}
            {isTransfer ? (
                <>
                    <div className="mb-3">
                        <label className="block text-xs text-muted-foreground mb-1.5">Dari Dompet</label>
                        <select name="fromWalletId" required className="input">
                            <option value="">Pilih dompet asal</option>
                            {wallets?.map((w) => (
                                <option key={w.id} value={w.id}>
                                    {w.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="block text-xs text-muted-foreground mb-1.5">Ke Dompet</label>
                        <select name="toWalletId" required className="input">
                            <option value="">Pilih dompet tujuan</option>
                            {wallets?.map((w) => (
                                <option key={w.id} value={w.id}>
                                    {w.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            ) : (
                <div className="mb-3">
                    <select name="walletId" required className="input">
                        <option value="">Pilih Dompet</option>
                        {wallets?.map((w) => (
                            <option key={w.id} value={w.id}>
                                {w.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Amount */}
            <div className="mb-3">
                <input
                    type="text"
                    inputMode="numeric"
                    value={amountDisplay}
                    onChange={handleAmountChange}
                    placeholder="Jumlah (Rp)"
                    required
                    className="input"
                />
                <input type="hidden" name="amount" value={amountRaw} />
            </div>

            {/* Description */}
            <div className="mb-4">
                <input
                    type="text"
                    name="description"
                    placeholder={isTransfer ? "Keterangan (contoh: Tarik tunai BRImo)" : "Deskripsi (opsional)"}
                    className="input"
                />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading
                    ? "Menyimpan..."
                    : isTransfer
                        ? "Transfer Sekarang"
                        : "Simpan Transaksi"}
            </button>
        </form>
    );
}
