"use client";

import { useState } from "react";
import { updateTransaction, deleteTransaction } from "@/actions/transaction-actions";
import { X, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

import { createPortal } from "react-dom";

export default function EditTransactionModal({ transaction, onClose }) {
    const [loading, setLoading] = useState(false);
    
    // We only format the amount display, raw amount is just the number string
    const [amountDisplay, setAmountDisplay] = useState(
        new Intl.NumberFormat("id-ID").format(transaction.amount)
    );
    const [amountRaw, setAmountRaw] = useState(transaction.amount.toString());

    const isTransfer = transaction.type === "transfer";
    const type = transaction.type;

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

    const handleDelete = async () => {
        Swal.fire({
            title: 'Hapus Transaksi?',
            text: "Data yang dihapus tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            background: "#0f172a",
            color: "#f8fafc",
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#334155',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            customClass: {
                popup: "rounded-2xl border border-slate-800",
                confirmButton: "rounded-xl px-4 py-2 font-medium",
                cancelButton: "rounded-xl px-4 py-2 font-medium",
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    await deleteTransaction(transaction.id);
                    Swal.fire({
                        title: "Terhapus!",
                        text: "Transaksi berhasil dihapus.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                        toast: true,
                        position: "bottom-end",
                        background: "#0f172a",
                        color: "#f8fafc",
                        iconColor: "#10b981",
                        customClass: {
                            popup: "rounded-2xl border border-slate-800 shadow-2xl shadow-black/50 mb-4 mr-4",
                        }
                    });
                    onClose();
                } catch (err) {
                    Swal.fire({
                        title: "Gagal",
                        text: err.message,
                        icon: "error",
                        background: "#0f172a",
                        color: "#f8fafc",
                    });
                }
                setLoading(false);
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.target);
            formData.append("transactionId", transaction.id);
            await updateTransaction(formData);
            
            // Show success notification with elegant dark SweetAlert2
            Swal.fire({
                title: "Berhasil!",
                text: "Perubahan transaksi disimpan.",
                icon: "success",
                timer: 2500,
                timerProgressBar: true,
                showConfirmButton: false,
                toast: true,
                position: "bottom-end",
                background: "#0f172a", // Tailwind slate-900
                color: "#f8fafc", // Tailwind slate-50
                iconColor: "#10b981", // Tailwind emerald-500
                customClass: {
                    popup: "rounded-2xl border border-slate-800 shadow-2xl shadow-black/50 mb-4 mr-4",
                    title: "text-sm font-semibold",
                }
            });

            onClose();
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

    // Use Portal to escape stacking contexts and render the modal at the root level.
    if (typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-zinc-950/80 backdrop-blur-sm animate-fade-in" onClick={(e) => {
            e.stopPropagation();
            onClose();
        }}>
            <div className="drawer-content relative" onClick={(e) => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6" />
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-zinc-50 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold mb-6 text-zinc-50">Edit Transaksi</h3>

                <form onSubmit={handleSubmit}>
                    {/* Category Select — hidden for transfers */}
                    {!isTransfer && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                                Kategori
                            </label>
                            <select 
                                name="category" 
                                required 
                                className="input"
                                defaultValue={transaction.category || "Lainnya"}
                            >
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
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                            Jumlah (Rp)
                        </label>
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
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                            Deskripsi
                        </label>
                        <input
                            type="text"
                            name="description"
                            defaultValue={transaction.description || ""}
                            placeholder="Deskripsi (opsional)"
                            className="input"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-xl transition-colors active:scale-95"
                            disabled={loading}
                            title="Hapus Transaksi"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-ghost flex-1 justify-center active:scale-95"
                            disabled={loading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1 justify-center active:scale-95"
                        >
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
