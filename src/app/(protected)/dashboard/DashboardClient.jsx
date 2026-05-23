"use client";

import { Activity, ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react";
import TransactionItem from "@/components/TransactionItem";
import FinanceChart from "@/components/FinanceChart";
import Link from "next/link";

export default function DashboardClient({
    wallets,
    transactions,
    totalBalance,
    totalIncome,
    totalExpense,
}) {
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
        <div className="animate-fade-in flex flex-col space-y-6">
            {/* Hero Balance Card */}
            <div className="flex flex-col items-center pt-2 pb-4">
                <span className="text-sm font-medium text-zinc-400 mb-1">Total Saldo</span>
                <h2 className="text-4xl font-bold tracking-tight text-zinc-50 mb-6">
                    {formatCurrency(totalBalance)}
                </h2>

                <div className="flex items-center gap-3 w-full">
                    <div className="flex-1 bg-emerald-500/10 rounded-2xl p-4 flex items-center gap-3 border border-emerald-500/10">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-emerald-500/80 mb-0.5">Pemasukan</p>
                            <p className="text-sm font-bold text-emerald-500">{formatCurrency(totalIncome)}</p>
                        </div>
                    </div>
                    <div className="flex-1 bg-rose-500/10 rounded-2xl p-4 flex items-center gap-3 border border-rose-500/10">
                        <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                            <ArrowDownRight className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-rose-500/80 mb-0.5">Pengeluaran</p>
                            <p className="text-sm font-bold text-rose-500">{formatCurrency(totalExpense)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <h3 className="text-sm font-medium text-zinc-400 mb-4">Tren Keuangan</h3>
                <FinanceChart transactions={transactions} />
            </div>

            {/* Recent Transactions */}
            <div>
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-base font-semibold text-zinc-50">Transaksi Terakhir</h3>
                    <Link href="/wallet" className="text-sm text-zinc-400 flex items-center hover:text-zinc-50 transition-colors">
                        Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-2">
                    {recentTransactions.length === 0 ? (
                        <div className="text-center py-8">
                            <Activity className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
                            <p className="text-sm text-zinc-500">Belum ada transaksi</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {recentTransactions.map((t, i) => (
                                <div key={t.id} className={i !== recentTransactions.length - 1 ? "border-b border-zinc-800/50" : ""}>
                                    <TransactionItem
                                        transaction={t}
                                        walletName={walletMap[t.walletId]}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
