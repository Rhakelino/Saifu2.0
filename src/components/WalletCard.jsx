"use client";

import { Wallet, CreditCard, Banknote, Smartphone, MoreVertical, Trash2, Edit } from "lucide-react";
import { useState } from "react";
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

const typeColors = {
    bank: "from-blue-500 to-indigo-600",
    ewallet: "from-violet-500 to-purple-600",
    cash: "from-amber-500 to-orange-600",
};

export default function WalletCard({ wallet, onEdit }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const Icon = typeIcons[wallet.type] || Wallet;
    const gradient = typeColors[wallet.type] || "from-emerald-500 to-teal-600";

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleDelete = async () => {
        if (confirm(`Hapus dompet "${wallet.name}"? Semua transaksi akan ikut terhapus.`)) {
            await deleteWallet(wallet.id);
            setMenuOpen(false);
        }
    };

    return (
        <div className="card relative group p-5">
            {/* Menu Button */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-50 active:bg-zinc-800 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                >
                    <MoreVertical className="w-5 h-5" />
                </button>
                {menuOpen && (
                    <div className="absolute right-0 top-8 bg-zinc-800 border border-zinc-700 rounded-xl py-1 shadow-2xl z-10 min-w-[140px] animate-scale-in">
                        <button
                            onClick={() => { onEdit(wallet); setMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:text-zinc-50 hover:bg-zinc-700/50 transition-all active:scale-95"
                        >
                            <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-400 hover:text-rose-300 hover:bg-zinc-700/50 transition-all active:scale-95"
                        >
                            <Trash2 className="w-4 h-4" /> Hapus
                        </button>
                    </div>
                )}
            </div>

            {/* Content Row */}
            <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0 pr-6">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">
                        {typeLabels[wallet.type] || wallet.type}
                    </p>
                    <h3 className="text-base font-semibold text-zinc-50 truncate mb-1">{wallet.name}</h3>
                    <p
                        className={`text-lg font-bold ${wallet.balance >= 0 ? "text-emerald-500" : "text-rose-500"
                            }`}
                    >
                        {formatCurrency(wallet.balance || 0)}
                    </p>
                </div>
            </div>
        </div>
    );
}
