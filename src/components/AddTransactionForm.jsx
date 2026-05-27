"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTransaction, transferBetweenWallets } from "@/actions/transaction-actions";
import { Plus, TrendingUp, TrendingDown, ArrowLeftRight, X } from "lucide-react";
import { toast } from "sonner";

export default function AddTransactionForm({ wallets, onClose }) {
    const router = useRouter();

    const [type, setType] = useState("expense");
    const [loading, setLoading] = useState(false);

    const [amountDisplay, setAmountDisplay] = useState("");
    const [amountRaw, setAmountRaw] = useState("");
    const [walletId, setWalletId] = useState("");
    const [fromWalletId, setFromWalletId] = useState("");
    const [toWalletId, setToWalletId] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

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

    const handleTypeChange = (newType) => {
        setType(newType);
        setCategory("");
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

            setAmountDisplay("");
            setAmountRaw("");
            setWalletId("");
            setFromWalletId("");
            setToWalletId("");
            setCategory("");
            setDescription("");

            router.refresh();

            toast.success("Transaksi berhasil disimpan.");

        } catch (err) {
            toast.error(err.message || "Gagal menyimpan transaksi");
        }

        setLoading(false);
    };

    const typeButtons = [
        { id: "income", label: "Masuk", icon: TrendingUp, activeColor: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" },
        { id: "expense", label: "Keluar", icon: TrendingDown, activeColor: "text-rose-400 border-rose-500/40 bg-rose-500/10" },
        { id: "transfer", label: "Transfer", icon: ArrowLeftRight, activeColor: "text-zinc-100 border-zinc-500/40 bg-zinc-500/10" },
    ];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="drawer-content relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Handle bar */}
                <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-5" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                            <Plus className="w-4 h-4 text-zinc-400" />
                        </div>
                        <h3 className="text-base font-semibold text-zinc-100">Tambah Transaksi</h3>
                    </div>
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Type Toggle */}
                    <div className="flex gap-2 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
                        {typeButtons.map(({ id, label, icon: Icon, activeColor }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => handleTypeChange(id)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition-all border ${
                                    type === id
                                        ? activeColor
                                        : "text-zinc-500 border-transparent hover:text-zinc-300"
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Wallet */}
                    {isTransfer ? (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1.5">Dari Dompet</label>
                                <select
                                    name="fromWalletId"
                                    required
                                    className="input"
                                    value={fromWalletId}
                                    onChange={(e) => setFromWalletId(e.target.value)}
                                >
                                    <option value="">Pilih</option>
                                    {wallets?.map((w) => (
                                        <option key={w.id} value={w.id}>{w.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1.5">Ke Dompet</label>
                                <select
                                    name="toWalletId"
                                    required
                                    className="input"
                                    value={toWalletId}
                                    onChange={(e) => setToWalletId(e.target.value)}
                                >
                                    <option value="">Pilih</option>
                                    {wallets?.map((w) => (
                                        <option key={w.id} value={w.id}>{w.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Dompet</label>
                            <select
                                name="walletId"
                                required
                                className="input"
                                value={walletId}
                                onChange={(e) => setWalletId(e.target.value)}
                            >
                                <option value="">Pilih Dompet</option>
                                {wallets?.map((w) => (
                                    <option key={w.id} value={w.id}>{w.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Category */}
                    {!isTransfer && (
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Kategori</label>
                            <select
                                name="category"
                                required
                                className="input"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Pilih Kategori</option>
                                {type === "expense" ? (
                                    <>
                                        <option value="Makan & Minum">Makan & Minum</option>
                                        <option value="Transportasi">Transportasi</option>
                                        <option value="Tagihan">Tagihan</option>
                                        <option value="Belanja">Belanja</option>
                                        <option value="Hiburan">Hiburan</option>
                                        <option value="Kesehatan">Kesehatan</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="Gaji">Gaji</option>
                                        <option value="Bonus">Bonus</option>
                                        <option value="Hasil Usaha">Hasil Usaha</option>
                                        <option value="Pemberian">Pemberian</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </>
                                )}
                            </select>
                        </div>
                    )}

                    {/* Amount */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Jumlah</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={amountDisplay}
                            onChange={handleAmountChange}
                            placeholder="0"
                            required
                            className="input text-xl font-bold text-zinc-100"
                        />
                        <input type="hidden" name="amount" value={amountRaw} />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Catatan</label>
                        <input
                            type="text"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={isTransfer ? "Keterangan transfer..." : "Deskripsi (opsional)"}
                            className="input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 mt-1 text-sm"
                    >
                        {loading
                            ? "Menyimpan..."
                            : isTransfer
                            ? "Transfer Sekarang"
                            : "Simpan Transaksi"}
                    </button>
                </form>
            </div>
        </div>
    );
}
