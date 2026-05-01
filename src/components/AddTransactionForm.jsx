"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTransaction, transferBetweenWallets } from "@/actions/transaction-actions";
import { Plus, TrendingUp, TrendingDown, ArrowLeftRight } from "lucide-react";
import Swal from "sweetalert2";

export default function AddTransactionForm({ wallets }) {
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
        <form onSubmit={handleSubmit} className="card relative">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-accent" />
                Tambah Transaksi
            </h3>

            {/* Type Toggle */}
            <div className="flex gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => handleTypeChange("income")}
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
                    onClick={() => handleTypeChange("expense")}
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
                    onClick={() => handleTypeChange("transfer")}
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
                        <select 
                            name="fromWalletId" 
                            required 
                            className="input"
                            value={fromWalletId}
                            onChange={(e) => setFromWalletId(e.target.value)}
                        >
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
                        <select 
                            name="toWalletId" 
                            required 
                            className="input"
                            value={toWalletId}
                            onChange={(e) => setToWalletId(e.target.value)}
                        >
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
                <div className="mb-3">
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
