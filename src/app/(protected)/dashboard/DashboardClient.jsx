"use client";

import { useState } from "react";
import { Activity, ArrowUpRight, ArrowDownRight, ChevronRight, TrendingUp, Download } from "lucide-react";
import TransactionItem from "@/components/TransactionItem";
import FinanceChart from "@/components/FinanceChart";
import ExportCSV from "@/components/ExportCSV";
import Link from "next/link";

export default function DashboardClient({
    user,
    wallets,
    transactions,
    totalBalance,
    totalIncome,
    totalExpense,
}) {
    const [showExport, setShowExport] = useState(false);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);

    const walletMap = {};
    wallets.forEach((w) => (walletMap[w.id] = w.name));

    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="animate-fade-in flex flex-col gap-6 max-w-2xl mx-auto">

            {/* Balance Hero */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-start justify-between mb-1">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Total Saldo</p>
                    {/* Export Button */}
                    <button
                        onClick={() => setShowExport(true)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold text-zinc-500 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all"
                        title="Export Laporan"
                    >
                        <Download className="w-3 h-3" />
                        Export
                    </button>
                </div>
                <h2 className="text-4xl font-bold text-white tracking-tight mb-6">
                    {formatCurrency(totalBalance)}
                </h2>

                <div className="grid grid-cols-2 gap-3">
                    {/* Income */}
                    <div className="rounded-lg bg-zinc-950/60 border border-zinc-800 p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Pemasukan</p>
                            <p className="text-sm font-bold text-emerald-400">{formatCurrency(totalIncome)}</p>
                        </div>
                    </div>

                    {/* Expense */}
                    <div className="rounded-lg bg-zinc-950/60 border border-zinc-800 p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                            <ArrowDownRight className="w-4 h-4 text-rose-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Pengeluaran</p>
                            <p className="text-sm font-bold text-rose-400">{formatCurrency(totalExpense)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="flex items-center gap-2 mb-5">
                    <TrendingUp className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-sm font-semibold text-zinc-100">Tren Keuangan</h3>
                </div>
                <FinanceChart transactions={transactions} />
            </div>

            {/* Recent Transactions */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                    <h3 className="text-sm font-semibold text-zinc-100">Transaksi Terakhir</h3>
                    <Link
                        href="/wallet"
                        className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                    >
                        Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {recentTransactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center">
                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                            <Activity className="w-6 h-6 text-zinc-600" />
                        </div>
                        <p className="text-sm font-medium text-zinc-500">Belum ada transaksi</p>
                        <p className="text-xs text-zinc-600 mt-1">Mulai catat pengeluaran pertamamu</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-800/60">
                        {recentTransactions.map((t) => (
                            <TransactionItem
                                key={t.id}
                                transaction={t}
                                walletName={walletMap[t.walletId]}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Export Modal */}
            {showExport && (
                <ExportCSV
                    transactions={transactions}
                    wallets={wallets}
                    user={user}
                    totalBalance={totalBalance}
                    totalIncome={totalIncome}
                    totalExpense={totalExpense}
                    onClose={() => setShowExport(false)}
                />
            )}
        </div>
    );
}
