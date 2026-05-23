"use client";

import { useState } from "react";
import { updateTransaction, deleteTransaction } from "@/actions/transaction-actions";
import { X, Trash2, Edit3 } from "lucide-react";
import Swal from "sweetalert2";
import { createPortal } from "react-dom";

export default function EditTransactionModal({ transaction, onClose }) {
    const [loading, setLoading] = useState(false);
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
            title: "Hapus Transaksi?",
            text: "Data yang dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            background: "#18181b",
            color: "#fafafa",
            confirmButtonColor: "#f43f5e",
            cancelButtonColor: "#27272a",
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
            customClass: {
                popup: "rounded-2xl border border-zinc-700 shadow-2xl",
                confirmButton: "rounded-lg px-5 py-2 font-semibold text-sm",
                cancelButton: "rounded-lg px-5 py-2 font-semibold text-sm text-zinc-300",
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
                        background: "#18181b",
                        color: "#fafafa",
                        iconColor: "#22c55e",
                        customClass: {
                            popup: "rounded-xl border border-zinc-700 shadow-2xl mb-4 mr-4",
                        }
                    });
                    onClose();
                } catch (err) {
                    Swal.fire({
                        title: "Gagal",
                        text: err.message,
                        icon: "error",
                        background: "#18181b",
                        color: "#fafafa",
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

            Swal.fire({
                title: "Berhasil!",
                text: "Perubahan transaksi disimpan.",
                icon: "success",
                timer: 2500,
                timerProgressBar: true,
                showConfirmButton: false,
                toast: true,
                position: "bottom-end",
                background: "#18181b",
                color: "#fafafa",
                iconColor: "#22c55e",
                customClass: {
                    popup: "rounded-xl border border-zinc-700 shadow-2xl mb-4 mr-4",
                    title: "text-sm font-semibold",
                }
            });

            onClose();
        } catch (err) {
            Swal.fire({
                title: "Gagal",
                text: err.message,
                icon: "error",
                background: "#18181b",
                color: "#fafafa",
                iconColor: "#f43f5e",
                customClass: {
                    popup: "rounded-xl border border-zinc-700 shadow-2xl",
                    confirmButton: "bg-white text-zinc-900 rounded-lg px-5 py-2 text-sm font-semibold",
                }
            });
        }

        setLoading(false);
    };

    if (typeof document === "undefined") return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
            <div
                className="drawer-content relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Handle */}
                <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-5" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                            <Edit3 className="w-4 h-4 text-zinc-400" />
                        </div>
                        <h3 className="text-base font-semibold text-zinc-100">Edit Transaksi</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Category */}
                    {!isTransfer && (
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Kategori</label>
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
                            defaultValue={transaction.description || ""}
                            placeholder="Deskripsi (opsional)"
                            className="input"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2.5 mt-1">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/15 rounded-lg transition-colors active:scale-95"
                            title="Hapus"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="btn-ghost flex-1 justify-center py-2.5 text-sm"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1 justify-center py-2.5 text-sm"
                        >
                            {loading ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
