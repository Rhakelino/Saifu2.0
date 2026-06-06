"use client";

import { Wallet, CreditCard, Banknote, Smartphone, MoreVertical, Trash2, Edit } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWallet } from "@/actions/wallet-actions";

const typeIcons = {
    bank: CreditCard,
    ewallet: Smartphone,
    cash: Banknote,
};

const typeLabels = {
    bank: "Bank",
    ewallet: "E-Wallet",
    cash: "Tunai",
};

const typeStyles = {
    bank: { icon: "bg-blue-500/10 border-blue-500/20 text-blue-400", badge: "text-blue-400" },
    ewallet: { icon: "bg-zinc-700/50 border-zinc-600/30 text-zinc-300", badge: "text-zinc-400" },
    cash: { icon: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", badge: "text-emerald-400" },
};

export default function WalletCard({ wallet, onEdit }) {
    const queryClient = useQueryClient();
    const [menuOpen, setMenuOpen] = useState(false);
    const Icon = typeIcons[wallet.type] || Wallet;
    const style = typeStyles[wallet.type] || typeStyles.ewallet;

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);

    const { mutate: doDelete } = useMutation({
        mutationFn: () => deleteWallet(wallet.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wallets"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            setMenuOpen(false);
        },
    });

    const handleDelete = () => {
        if (confirm(`Hapus dompet "${wallet.name}"? Semua transaksi akan ikut terhapus.`)) {
            doDelete();
        }
    };

    return (
        <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors group">
            {/* Menu */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>
                {menuOpen && (
                    <div className="absolute right-0 top-9 bg-zinc-900 border border-zinc-800 rounded-xl py-1 shadow-2xl z-10 min-w-[140px] animate-scale-in">
                        <button
                            onClick={() => { onEdit(wallet); setMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
                        >
                            <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex items-center gap-4 pr-8">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${style.icon}`}>
                    <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className={`text-[10px] font-semibold uppercase tracking-widest mb-0.5 ${style.badge}`}>
                        {typeLabels[wallet.type] || wallet.type}
                    </p>
                    <h3 className="text-sm font-semibold text-zinc-100 truncate">{wallet.name}</h3>
                    <p className={`text-base font-bold tracking-tight mt-0.5 ${
                        wallet.balance >= 0 ? "text-zinc-100" : "text-rose-400"
                    }`}>
                        {formatCurrency(wallet.balance || 0)}
                    </p>
                </div>
            </div>
        </div>
    );
}
