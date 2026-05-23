"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTransaction, transferBetweenWallets } from "@/actions/transaction-actions";
import { Plus, TrendingUp, TrendingDown, ArrowLeftRight, X } from "lucide-react";
import Swal from "sweetalert2";

export default function AddTransactionForm({ wallets, onClose }) {
    const router = useRouter();
    
    // Controlled states for all inputs to guarantee clean resets
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
        setCategory(""); // Reset category when switching income/expense
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

            // Explicitly reset all react states for a clean slate
            setAmountDisplay("");
            setAmountRaw("");
            setWalletId("");
            setFromWalletId("");
            setToWalletId("");
            setCategory("");
            setDescription("");
            
            // Force Next.js router to refresh and sync server components fully
            router.refresh();
            
            // Show success notification with elegant dark SweetAlert2
            Swal.fire({
                title: "Berhasil!",
                text: "Transaksi berhasil disimpan.",
                icon: "success",
                timer: 2500,
                timerProgressBar: true,
                showConfirmButton: false,
                toast: true,
                position: "bottom-end",
                background: "#0f172a",
                color: "#f8fafc",
                iconColor: "#10b981",
                customClass: {
                    popup: "rounded-2xl border border-slate-800 shadow-2xl shadow-black/50 mb-4 mr-4",
                    title: "text-sm font-semibold",
                }
            });
            
        } catch (err) {
            Swal.fire({
                title: "Gagal",
                text: err.message,
                icon: "error",
                background: "#0f172a",
                color: "#f8fafc",
                iconColor: "#ef4444",
                customClass: {
                    popup: "rounded-2xl border border-slate-800",
                    confirmButton: "bg-primary text-white rounded-xl px-4 py-2",
                }
            });
        }

        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-zinc-950/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="drawer-content relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6" />
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-zinc-50 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                <h3 className="text-xl font-bold mb-6 text-zinc-50 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-emerald-500" />
                    Tambah Transaksi
                </h3>

                <form onSubmit={handleSubmit}>
                    {/* Type Toggle */}
                    <div className="flex gap-2 mb-6">
                        <button
                            type="button"
                            onClick={() => handleTypeChange("income")}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${type === "income"
                                ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                                : "bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                                }`}
                        >
                            <TrendingUp className="w-4 h-4" />
                            Masuk
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTypeChange("expense")}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${type === "expense"
                                ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                                : "bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                                }`}
                        >
                            <TrendingDown className="w-4 h-4" />
                            Keluar
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTypeChange("transfer")}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${type === "transfer"
                                ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                                : "bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                                }`}
                        >
                            <ArrowLeftRight className="w-4 h-4" />
                            Transfer
                        </button>
                    </div>

                    {/* Wallet Select — changes based on type */}
                    {isTransfer ? (
                        <div className="flex gap-2 mb-4">
                            <div className="flex-1">
                                <label className="block text-xs text-zinc-400 mb-1.5">Dari Dompet</label>
                                <select 
                                    name="fromWalletId" 
                                    required 
                                    className="input"
                                    value={fromWalletId}
                                    onChange={(e) => setFromWalletId(e.target.value)}
                                >
                                    <option value="">Pilih Asal</option>
                                    {wallets?.map((w) => (
                                        <option key={w.id} value={w.id}>
                                            {w.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs text-zinc-400 mb-1.5">Ke Dompet</label>
                                <select 
                                    name="toWalletId" 
                                    required 
                                    className="input"
                                    value={toWalletId}
                                    onChange={(e) => setToWalletId(e.target.value)}
                                >
                                    <option value="">Pilih Tujuan</option>
                                    {wallets?.map((w) => (
                                        <option key={w.id} value={w.id}>
                                            {w.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-4">
                            <select 
                                name="walletId" 
                                required 
                                className="input"
                                value={walletId}
                                onChange={(e) => setWalletId(e.target.value)}
                            >
                                <option value="">Pilih Dompet</option>
                                {wallets?.map((w) => (
                                    <option key={w.id} value={w.id}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Category Select — hidden for transfers */}
                    {!isTransfer && (
                        <div className="mb-4">
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
                    <div className="mb-4">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={amountDisplay}
                            onChange={handleAmountChange}
                            placeholder="Jumlah (Rp)"
                            required
                            className="input font-bold text-lg"
                        />
                        <input type="hidden" name="amount" value={amountRaw} />
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <input
                            type="text"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={isTransfer ? "Keterangan (contoh: Tarik tunai BRImo)" : "Deskripsi (opsional)"}
                            className="input"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center active:scale-95 py-3.5">
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
