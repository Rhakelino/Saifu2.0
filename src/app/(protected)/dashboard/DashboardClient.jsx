"use client";

import { useState, useMemo } from "react";
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Filter,
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
    totalIncome: globalTotalIncome,
    totalExpense: globalTotalExpense,
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
    
    // Filter States
    const [timeFilter, setTimeFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    // Filter Logic
    const filteredTransactions = useMemo(() => {
        const isWithinRange = (dateStr, range) => {
            if (range === 'all') return true;
            const date = new Date(dateStr);
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            // reset time for date to compare
            const tDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            
            if (range === 'today') {
                return tDate.getTime() === today.getTime();
            }
            if (range === 'yesterday') {
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                return tDate.getTime() === yesterday.getTime();
            }
            if (range === 'last_week') {
                const lastWeek = new Date(today);
                lastWeek.setDate(lastWeek.getDate() - 7);
                return tDate >= lastWeek && tDate <= today;
            }
            if (range === 'last_month') {
                const lastMonth = new Date(today);
                lastMonth.setDate(lastMonth.getDate() - 30);
                return tDate >= lastMonth && tDate <= today;
            }
            if (range === 'last_year') {
                const lastYear = new Date(today);
                lastYear.setFullYear(lastYear.getFullYear() - 1);
                return tDate >= lastYear && tDate <= today;
            }
            return true;
        };

        return transactions.filter(t => {
            const typeMatch = typeFilter === "all" || t.type === typeFilter;
            const timeMatch = isWithinRange(t.createdAt, timeFilter);
            return typeMatch && timeMatch;
        });
    }, [transactions, timeFilter, typeFilter]);

    const filteredIncome = useMemo(() => 
        filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]);

    const filteredExpense = useMemo(() => 
        filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]);

    return (
        <div className="animate-fade-in flex flex-col">
            {/* Mobile ONLY: Add Transaction Form at the absolute top */}
            <div className="block lg:hidden mb-6 order-1">
                <AddTransactionForm wallets={wallets} />
            </div>

            {/* Stats Cards (Stacked horizontally ke samping) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8 order-2">
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
                            <span className="text-sm font-medium text-muted-foreground">
                                Pemasukan {timeFilter !== "all" && "(Difilter)"}
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-income/10 flex items-center justify-center">
                                <ArrowUpRight className="w-4 h-4 text-income" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold mb-1 text-foreground">
                            {formatCurrency(filteredIncome)}
                        </p>
                    </div>
                </div>

                {/* Expense */}
                <div className="card relative overflow-hidden group p-5">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-expense/5 rounded-full -translate-y-8 translate-x-8 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-muted-foreground">
                                Pengeluaran {timeFilter !== "all" && "(Difilter)"}
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-expense/10 flex items-center justify-center">
                                <ArrowDownRight className="w-4 h-4 text-expense" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold mb-1 text-foreground">
                            {formatCurrency(filteredExpense)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 order-3">
                
                {/* Left Column: Chart & Transactions (col-span-2) */}
                <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
                    <FinanceChart transactions={filteredTransactions} />

                    <div className="card">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Activity className="w-5 h-5 text-accent" />
                                Riwayat Transaksi
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center bg-surface border border-border rounded-lg overflow-hidden">
                                    <div className="pl-3 py-1.5 flex items-center justify-center text-muted-foreground">
                                        <Filter className="w-3.5 h-3.5" />
                                    </div>
                                    <select 
                                        className="bg-transparent border-none text-sm py-1.5 pr-2 focus:ring-0 outline-none text-foreground"
                                        value={timeFilter}
                                        onChange={(e) => setTimeFilter(e.target.value)}
                                    >
                                        <option value="all">Semua Waktu</option>
                                        <option value="today">Hari Ini</option>
                                        <option value="yesterday">Kemarin</option>
                                        <option value="last_week">7 Hari Terakhir</option>
                                        <option value="last_month">30 Hari Terakhir</option>
                                        <option value="last_year">1 Tahun Terakhir</option>
                                    </select>
                                </div>
                                
                                <div className="flex items-center bg-surface border border-border rounded-lg overflow-hidden">
                                    <select 
                                        className="bg-transparent border-none text-sm py-1.5 px-3 focus:ring-0 outline-none text-foreground"
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                    >
                                        <option value="all">Semua Tipe</option>
                                        <option value="income">Pemasukan</option>
                                        <option value="expense">Pengeluaran</option>
                                    </select>
                                </div>

                                {filteredTransactions.length > 0 && (
                                    <button
                                        onClick={() => setShowExport(true)}
                                        className="btn-ghost py-1.5! px-3! text-xs! ml-auto sm:ml-0"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        Export
                                    </button>
                                )}
                            </div>
                        </div>

                        {filteredTransactions.length === 0 ? (
                            <div className="text-center py-12">
                                <Activity className="w-12 h-12 text-muted mx-auto mb-3 opacity-30" />
                                <p className="text-muted-foreground text-sm">
                                    Tidak ada transaksi untuk filter ini
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
                                {filteredTransactions.map((t) => (
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

                {/* Right Column: Wallets & Form (col-span-1) */}
                <div className="lg:col-span-1 flex flex-col gap-6 order-1 lg:order-2">
                    
                    {/* Desktop ONLY: Add Transaction Form */}
                    <div className="hidden lg:block lg:order-2">
                        <AddTransactionForm wallets={wallets} />
                    </div>

                    {/* Wallet List */}
                    <div className="order-2 lg:order-1 card">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <Wallet className="w-5 h-5 text-accent" />
                            Dompet Saya
                        </h3>
                        {wallets.length === 0 ? (
                            <div className="text-center py-6">
                                <Wallet className="w-8 h-8 text-muted mx-auto mb-2 opacity-30" />
                                <p className="text-sm text-muted-foreground">Belum ada dompet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                                {wallets.map(w => (
                                    <div key={w.id} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border hover:border-accent/30 transition-colors">
                                        <div>
                                            <p className="font-medium text-sm text-foreground">{w.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{w.type}</p>
                                        </div>
                                        <p className={`font-semibold text-sm ${w.balance >= 0 ? "text-income" : "text-expense"}`}>
                                            {formatCurrency(w.balance || 0)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showExport && (
                <ExportCSV
                    user={user}
                    transactions={filteredTransactions}
                    wallets={wallets}
                    totalBalance={totalBalance}
                    totalIncome={filteredIncome}
                    totalExpense={filteredExpense}
                    onClose={() => setShowExport(false)}
                />
            )}
        </div>
    );
}
