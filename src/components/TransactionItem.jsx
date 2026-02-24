"use client";

import { TrendingUp, TrendingDown, ArrowLeftRight, Trash2 } from "lucide-react";
import { deleteTransaction } from "@/actions/transaction-actions";

export default function TransactionItem({ transaction, walletName }) {
    const isIncome = transaction.type === "income";
    const isTransfer = transaction.type === "transfer";

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date));
    };

    const handleDelete = async () => {
        if (confirm("Hapus transaksi ini?")) {
            await deleteTransaction(transaction.id);
        }
    };

    return (
        <div className="flex items-center gap-4 py-4 px-4 hover:bg-card-hover/50 transition-all group border-b border-border/50 last:border-0 cursor-pointer">
            {/* Icon */}
            <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${isTransfer ? "bg-blue-500/10" : isIncome ? "bg-income/10" : "bg-expense/10"
                    }`}
            >
                {isTransfer ? (
                    <ArrowLeftRight className="w-5 h-5 text-blue-400" />
                ) : isIncome ? (
                    <TrendingUp className="w-5 h-5 text-income" />
                ) : (
                    <TrendingDown className="w-5 h-5 text-expense" />
                )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                    {transaction.description || (isIncome ? "Pemasukan" : "Pengeluaran")}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                    {walletName && (
                        <span className="text-xs text-muted-foreground">{walletName}</span>
                    )}
                    <span className="text-xs text-muted">
                        {formatDate(transaction.createdAt)}
                    </span>
                </div>
            </div>

            {/* Amount */}
            <p
                className={`text-sm font-bold whitespace-nowrap ${isTransfer ? "text-blue-400" : isIncome ? "text-income" : "text-expense"
                    }`}
            >
                {isTransfer ? "" : isIncome ? "+" : "-"}
                {formatCurrency(transaction.amount)}
            </p>

            {/* Delete */}
            <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                title="Hapus"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
