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
        <div className="card relative group">
            {/* Menu Button */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-all opacity-0 group-hover:opacity-100"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>
                {menuOpen && (
                    <div className="absolute right-0 top-8 bg-card border border-border rounded-xl py-1 shadow-xl z-10 min-w-[140px] animate-scale-in">
                        <button
                            onClick={() => { onEdit(wallet); setMenuOpen(false); }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-all"
                        >
                            <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-surface transition-all"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                    </div>
                )}
            </div>

            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
            </div>

            {/* Info */}
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {typeLabels[wallet.type] || wallet.type}
            </p>
            <h3 className="text-lg font-semibold mb-3 truncate pr-8">{wallet.name}</h3>

            {/* Balance */}
            <p
                className={`text-xl font-bold ${wallet.balance >= 0 ? "text-income" : "text-expense"
                    }`}
            >
                {formatCurrency(wallet.balance || 0)}
            </p>
        </div>
    );
}
