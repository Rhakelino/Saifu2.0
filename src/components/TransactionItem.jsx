"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, ArrowLeftRight } from "lucide-react";
import EditTransactionModal from "./EditTransactionModal";

export default function TransactionItem({ transaction, walletName }) {
    const [isEditing, setIsEditing] = useState(false);

    const isIncome = transaction.type === "income";
    const isTransfer = transaction.type === "transfer";

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);

    const formatDate = (date) =>
        new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date));

    const iconBg = isTransfer
        ? "bg-zinc-700/50 border-zinc-600/30 text-zinc-300"
        : isIncome
        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
        : "bg-rose-500/10 border-rose-500/20 text-rose-400";

    const amountColor = isTransfer
        ? "text-zinc-200"
        : isIncome
        ? "text-emerald-400"
        : "text-rose-400";

    return (
        <>
            <div
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-800/40 active:bg-zinc-800/60 transition-colors cursor-pointer"
            >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${iconBg}`}>
                    {isTransfer ? (
                        <ArrowLeftRight className="w-4 h-4" />
                    ) : isIncome ? (
                        <TrendingUp className="w-4 h-4" />
                    ) : (
                        <TrendingDown className="w-4 h-4" />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-100 truncate">
                        {transaction.description || (isIncome ? "Pemasukan" : isTransfer ? "Transfer" : "Pengeluaran")}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        {transaction.category && (
                            <span className="text-xs text-zinc-500">{transaction.category}</span>
                        )}
                        {transaction.category && walletName && (
                            <span className="text-zinc-700">·</span>
                        )}
                        {walletName && (
                            <span className="text-xs text-zinc-500">{walletName}</span>
                        )}
                        <span className="text-zinc-700">·</span>
                        <span className="text-xs text-zinc-600">{formatDate(transaction.createdAt)}</span>
                    </div>
                </div>

                {/* Amount */}
                <div className="text-right shrink-0">
                    <p className={`text-sm font-bold whitespace-nowrap ${amountColor}`}>
                        {isTransfer ? "" : isIncome ? "+" : "−"}
                        {formatCurrency(transaction.amount)}
                    </p>
                </div>
            </div>

            {isEditing && (
                <EditTransactionModal
                    transaction={transaction}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </>
    );
}
