"use client";

import { useRef } from "react";
import { Printer, X, Coins } from "lucide-react";

export default function PrintReport({
    user,
    transactions,
    wallets,
    totalBalance,
    totalIncome,
    totalExpense,
    onClose,
}) {
    const printRef = useRef(null);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);

    const formatDate = (date) =>
        new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date));

    const formatDateShort = (date) =>
        new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(new Date(date));

    const today = new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    const walletMap = {};
    wallets.forEach((w) => (walletMap[w.id] = w.name));

    const handlePrint = () => {
        const content = printRef.current;
        const printWindow = window.open("", "_blank");

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8">
                <title>Laporan Transaksi - Saifu</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

                    * { margin: 0; padding: 0; box-sizing: border-box; }

                    body {
                        font-family: 'Inter', sans-serif;
                        color: #1a1a2e;
                        background: #fff;
                        padding: 40px;
                        font-size: 12px;
                        line-height: 1.5;
                    }

                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 32px;
                        padding-bottom: 24px;
                        border-bottom: 2px solid #10b981;
                    }

                    .brand {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }

                    .brand-icon {
                        width: 44px;
                        height: 44px;
                        background: linear-gradient(135deg, #10b981, #059669);
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 20px;
                        font-weight: 700;
                    }

                    .brand h1 {
                        font-size: 24px;
                        font-weight: 700;
                        color: #10b981;
                        letter-spacing: -0.5px;
                    }

                    .brand p {
                        font-size: 11px;
                        color: #64748b;
                        margin-top: 2px;
                    }

                    .meta {
                        text-align: right;
                        font-size: 11px;
                        color: #64748b;
                    }

                    .meta .title {
                        font-size: 14px;
                        font-weight: 600;
                        color: #1a1a2e;
                        margin-bottom: 4px;
                    }

                    /* Summary Cards */
                    .summary {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 16px;
                        margin-bottom: 32px;
                    }

                    .summary-card {
                        padding: 16px 20px;
                        border-radius: 12px;
                        border: 1px solid #e2e8f0;
                        background: #f8fafc;
                    }

                    .summary-card .label {
                        font-size: 11px;
                        color: #64748b;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        font-weight: 600;
                        margin-bottom: 6px;
                    }

                    .summary-card .value {
                        font-size: 20px;
                        font-weight: 700;
                    }

                    .summary-card.balance .value { color: #1a1a2e; }
                    .summary-card.income .value { color: #10b981; }
                    .summary-card.expense .value { color: #ef4444; }

                    /* Table */
                    .table-section h2 {
                        font-size: 14px;
                        font-weight: 600;
                        margin-bottom: 12px;
                        color: #1a1a2e;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 11px;
                    }

                    thead th {
                        background: #f1f5f9;
                        padding: 10px 14px;
                        text-align: left;
                        font-weight: 600;
                        color: #475569;
                        text-transform: uppercase;
                        font-size: 10px;
                        letter-spacing: 0.5px;
                        border-bottom: 2px solid #e2e8f0;
                    }

                    thead th:first-child { border-radius: 8px 0 0 0; }
                    thead th:last-child { border-radius: 0 8px 0 0; text-align: right; }

                    tbody td {
                        padding: 10px 14px;
                        border-bottom: 1px solid #f1f5f9;
                        vertical-align: middle;
                    }

                    tbody tr:hover { background: #fafafa; }

                    .type-badge {
                        display: inline-block;
                        padding: 3px 10px;
                        border-radius: 20px;
                        font-size: 10px;
                        font-weight: 600;
                    }

                    .type-income {
                        background: #ecfdf5;
                        color: #059669;
                    }

                    .type-expense {
                        background: #fef2f2;
                        color: #dc2626;
                    }

                    .type-transfer {
                        background: #eff6ff;
                        color: #2563eb;
                    }

                    .amount {
                        text-align: right;
                        font-weight: 600;
                        font-variant-numeric: tabular-nums;
                    }

                    .amount.income { color: #10b981; }
                    .amount.expense { color: #ef4444; }
                    .amount.transfer { color: #3b82f6; }

                    /* Footer */
                    .footer {
                        margin-top: 40px;
                        padding-top: 16px;
                        border-top: 1px solid #e2e8f0;
                        display: flex;
                        justify-content: space-between;
                        font-size: 10px;
                        color: #94a3b8;
                    }

                    @media print {
                        body { padding: 20px; }
                        .summary-card { break-inside: avoid; }
                        tbody tr { break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                ${content.innerHTML}
            </body>
            </html>
        `);

        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 300);
    };

    const typeLabels = {
        income: "Pemasukan",
        expense: "Pengeluaran",
        transfer: "Transfer",
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Printer className="w-5 h-5 text-accent" />
                        Cetak Laporan Transaksi
                    </h2>
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrint} className="btn-primary">
                            <Printer className="w-4 h-4" />
                            Cetak / PDF
                        </button>
                        <button onClick={onClose} className="btn-ghost !p-2">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Preview */}
                <div className="overflow-y-auto p-6 bg-white">
                    <div ref={printRef}>
                        {/* Header */}
                        <div className="header">
                            <div className="brand">
                                <div className="brand-icon">S</div>
                                <div>
                                    <h1>Saifu</h1>
                                    <p>Laporan Keuangan Pribadi</p>
                                </div>
                            </div>
                            <div className="meta">
                                <div className="title">Laporan Transaksi</div>
                                <div>{user?.name}</div>
                                <div>{user?.email}</div>
                                <div style={{ marginTop: "4px" }}>Dicetak: {today}</div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="summary">
                            <div className="summary-card balance">
                                <div className="label">Total Saldo</div>
                                <div className="value">{formatCurrency(totalBalance)}</div>
                            </div>
                            <div className="summary-card income">
                                <div className="label">Total Pemasukan</div>
                                <div className="value">{formatCurrency(totalIncome)}</div>
                            </div>
                            <div className="summary-card expense">
                                <div className="label">Total Pengeluaran</div>
                                <div className="value">{formatCurrency(totalExpense)}</div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="table-section">
                            <h2>Rincian Transaksi ({transactions.length} data)</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Tanggal</th>
                                        <th>Dompet</th>
                                        <th>Tipe</th>
                                        <th>Deskripsi</th>
                                        <th>Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((t, i) => (
                                        <tr key={t.id}>
                                            <td>{i + 1}</td>
                                            <td>{formatDateShort(t.createdAt)}</td>
                                            <td>
                                                {walletMap[t.walletId] || "-"}
                                                {t.type === "transfer" && t.toWalletId
                                                    ? ` → ${walletMap[t.toWalletId] || "-"}`
                                                    : ""}
                                            </td>
                                            <td>
                                                <span className={`type-badge type-${t.type}`}>
                                                    {typeLabels[t.type] || t.type}
                                                </span>
                                            </td>
                                            <td>{t.description || "-"}</td>
                                            <td className={`amount ${t.type}`}>
                                                {t.type === "income" ? "+" : t.type === "expense" ? "-" : ""}
                                                {formatCurrency(t.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="footer">
                            <span>Dibuat otomatis oleh Saifu — saifu.app</span>
                            <span>Halaman 1</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
