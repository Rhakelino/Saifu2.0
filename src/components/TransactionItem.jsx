"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, ArrowLeftRight } from "lucide-react";
import EditTransactionModal from "./EditTransactionModal";

export default function TransactionItem({ transaction, walletName }) {
    const [isEditing, setIsEditing] = useState(false);
    
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

    return (
        <>
            <div 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-3 py-3 px-1 active:bg-zinc-800/50 transition-colors cursor-pointer"
            >
                {/* Icon */}
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isTransfer ? "bg-blue-500/10" : isIncome ? "bg-emerald-500/10" : "bg-rose-500/10"
                        }`}
                >
                    {isTransfer ? (
                        <ArrowLeftRight className="w-5 h-5 text-blue-400" />
                    ) : isIncome ? (
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                    ) : (
                        <TrendingDown className="w-5 h-5 text-rose-500" />
                    )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-50 truncate mb-0.5">
                        {transaction.description || (isIncome ? "Pemasukan" : "Pengeluaran")}
                    </p>
                    <div className="flex items-center gap-1.5">
                        {walletName && (
                            <span className="text-xs text-zinc-400">{walletName}</span>
                        )}
                        <span className="text-[10px] text-zinc-600">•</span>
                        <span className="text-xs text-zinc-400">
                            {formatDate(transaction.createdAt)}
                        </span>
                    </div>
                </div>

                {/* Amount */}
                <div className="text-right shrink-0">
                    <p
                        className={`text-sm font-bold whitespace-nowrap ${isTransfer ? "text-zinc-50" : isIncome ? "text-emerald-500" : "text-rose-500"
                            }`}
                    >
                        {isTransfer ? "" : isIncome ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                    </p>
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider block mt-0.5">
                        {transaction.category || (isTransfer ? "Transfer" : "Lainnya")}
                    </span>
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
