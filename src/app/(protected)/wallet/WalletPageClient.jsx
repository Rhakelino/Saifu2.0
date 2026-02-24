"use client";

import { useState } from "react";
import { Plus, Wallet } from "lucide-react";
import WalletCard from "@/components/WalletCard";
import WalletModal from "@/components/WalletModal";

export default function WalletPageClient({ wallets }) {
    const [showModal, setShowModal] = useState(false);
    const [editWallet, setEditWallet] = useState(null);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);

    const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);

    const handleEdit = (wallet) => {
        setEditWallet(wallet);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditWallet(null);
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
                        <Wallet className="w-6 h-6 text-accent" />
                        Dompet Saya
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Total saldo:{" "}
                        <span
                            className={`font-semibold ${totalBalance >= 0 ? "text-income" : "text-expense"
                                }`}
                        >
                            {formatCurrency(totalBalance)}
                        </span>
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Dompet
                </button>
            </div>

            {/* Wallet Grid */}
            {wallets.length === 0 ? (
                <div className="card text-center py-16">
                    <Wallet className="w-16 h-16 text-muted mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-semibold mb-2">Belum ada dompet</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                        Mulai dengan menambahkan dompetmu yang pertama
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary mx-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Dompet
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wallets.map((wallet, i) => (
                        <div
                            key={wallet.id}
                            className="animate-slide-up"
                            style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "backwards" }}
                        >
                            <WalletCard wallet={wallet} onEdit={handleEdit} />
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <WalletModal wallet={editWallet} onClose={handleCloseModal} />
            )}
        </div>
    );
}
