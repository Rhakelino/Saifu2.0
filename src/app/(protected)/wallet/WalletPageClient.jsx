"use client";

import { useState } from "react";
import { Plus, Wallet, Download } from "lucide-react";
import WalletCard from "@/components/WalletCard";
import WalletModal from "@/components/WalletModal";
import CategoryPieChart from "@/components/CategoryPieChart";
import ExportCSV from "@/components/ExportCSV";
import TransactionItem from "@/components/TransactionItem";
import { useAnimationKey } from "@/hooks/useAnimationKey";

export default function WalletPageClient({
    wallets,
    transactions,
    user,
    totalBalance,
    totalIncome,
    totalExpense,
}) {
    const [showModal, setShowModal] = useState(false);
    const [editWallet, setEditWallet] = useState(null);
    const [showExport, setShowExport] = useState(false);
    const animKey = useAnimationKey();

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);

    const handleEdit = (wallet) => {
        setEditWallet(wallet);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditWallet(null);
    };

    const walletMap = {};
    wallets.forEach((w) => (walletMap[w.id] = w.name));

    return (
        <div key={animKey} className="animate-fade-in max-w-2xl mx-auto flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-100">Dompet Saya</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">
                        Total:{" "}
                        <span className={`font-bold ${totalBalance >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {formatCurrency(totalBalance)}
                        </span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Export Button */}
                    <button
                        onClick={() => setShowExport(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-zinc-400 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all"
                        title="Export Laporan"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Export
                    </button>
                    {/* Add Wallet Button */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary py-2 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah
                    </button>
                </div>
            </div>

            {/* Wallets Grid */}
            {wallets.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-zinc-800 p-12 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                        <Wallet className="w-6 h-6 text-zinc-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-300 mb-1">Belum ada dompet</h3>
                    <p className="text-xs text-zinc-600 mb-5">
                        Tambahkan dompet pertamamu untuk mulai mencatat
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary text-sm py-2"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Dompet
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {wallets.map((wallet, i) => (
                        <div
                            key={wallet.id}
                            className="animate-fade-in"
                            style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "backwards" }}
                        >
                            <WalletCard wallet={wallet} onEdit={handleEdit} />
                        </div>
                    ))}
                </div>
            )}

            {/* Pie Chart */}
            <CategoryPieChart transactions={transactions} />

            {/* Transactions list */}
            {transactions.length > 0 && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                        <h3 className="text-sm font-semibold text-zinc-100">Semua Transaksi</h3>
                        <span className="text-xs text-zinc-600">{transactions.length} data</span>
                    </div>
                    <div className="divide-y divide-zinc-800/60">
                        {transactions.map((t) => (
                            <TransactionItem
                                key={t.id}
                                transaction={t}
                                walletName={walletMap[t.walletId]}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Modals */}
            {showModal && (
                <WalletModal wallet={editWallet} onClose={handleCloseModal} />
            )}

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
