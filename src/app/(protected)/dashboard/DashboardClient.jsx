"use client";

import { useState } from "react";
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Download,
} from "lucide-react";
import AddTransactionForm from "@/components/AddTransactionForm";
import TransactionItem from "@/components/TransactionItem";
import FinanceChart from "@/components/FinanceChart";
import ExportCSV from "@/components/ExportCSV";

export default function DashboardClient({
    user,
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

    const [showExport, setShowExport] = useState(false);

    return (
        <div className="animate-fade-in">
            {/* Stats Cards (Stacked horizontally ke samping) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                {/* Total Balance */}
                <div className="card relative overflow-hidden group p-5">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -translate-y-8 translate-x-8 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-muted-foreground">Total Saldo</span>
                            <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Wallet className="w-4 h-4 text-accent" />
                            </div>
                        </div>
                        <p className={`text-2xl font-bold mb-1 ${totalBalance >= 0 ? "text-foreground" : "text-expense"}`}>
                            {formatCurrency(totalBalance)}
                        </p>
                    </div>
                </div>

                {/* Income */}
                <div className="card relative overflow-hidden group p-5">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-income/5 rounded-full -translate-y-8 translate-x-8 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-muted-foreground">Pemasukan</span>
                            <div className="w-8 h-8 rounded-xl bg-income/10 flex items-center justify-center">
                                <ArrowUpRight className="w-4 h-4 text-income" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold mb-1 text-foreground">
                            {formatCurrency(totalIncome)}
                        </p>
                    </div>
                </div>

                {/* Expense */}
                <div className="card relative overflow-hidden group p-5">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-expense/5 rounded-full -translate-y-8 translate-x-8 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-muted-foreground">Pengeluaran</span>
                            <div className="w-8 h-8 rounded-xl bg-expense/10 flex items-center justify-center">
                                <ArrowDownRight className="w-4 h-4 text-expense" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold mb-1 text-foreground">
                            {formatCurrency(totalExpense)}
                        </p>
                    </div>
                </div>
            </div>
            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Form & Stats */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Add Transaction Form (Now at the top of left column contextually) */}
                    <AddTransactionForm wallets={wallets} />


                </div>

                {/* Right Column: Chart & Transactions */}
                <div className="lg:col-span-2 space-y-6">
                    <FinanceChart transactions={transactions} />

                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Activity className="w-5 h-5 text-accent" />
                                Riwayat Transaksi
                            </h3>
                            <span className="text-xs text-muted-foreground">
                                {transactions.length} transaksi
                            </span>
                            {transactions.length > 0 && (
                                <button
                                    onClick={() => setShowExport(true)}
                                    className="btn-ghost py-1.5! px-3! text-xs!"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Export
                                </button>
                            )}
                        </div>

                        {transactions.length === 0 ? (
                            <div className="text-center py-12">
                                <Activity className="w-12 h-12 text-muted mx-auto mb-3 opacity-30" />
                                <p className="text-muted-foreground text-sm">
                                    Belum ada transaksi
                                </p>
                                <p className="text-muted text-xs mt-1">
                                    Tambah transaksi pertamamu!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
                                {transactions.map((t) => (
                                    <TransactionItem
                                        key={t.id}
                                        transaction={t}
                                        walletName={walletMap[t.walletId]}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showExport && (
                <ExportCSV
                    user={user}
                    transactions={transactions}
                    wallets={wallets}
                    totalBalance={totalBalance}
                    totalIncome={totalIncome}
                    totalExpense={totalExpense}
                    onClose={() => setShowExport(false)}
                />
            )}
        </div>
    );
}
