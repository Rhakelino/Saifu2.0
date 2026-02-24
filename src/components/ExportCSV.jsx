"use client";

import { useRef, useState } from "react";
import { Download, FileText, FileSpreadsheet, X, Filter, Calendar, Wallet } from "lucide-react";
import * as XLSX from "xlsx";

export default function ExportCSV({
    transactions,
    wallets,
    user,
    totalBalance,
    totalIncome,
    totalExpense,
    onClose,
}) {
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [selectedWallet, setSelectedWallet] = useState("");
    const printRef = useRef(null);

    const walletMap = {};
    wallets.forEach((w) => (walletMap[w.id] = w.name));

    const typeLabels = {
        income: "Pemasukan",
        expense: "Pengeluaran",
        transfer: "Transfer",
    };

    const filteredTransactions = transactions.filter((t) => {
        const date = new Date(t.createdAt);
        if (dateFrom && date < new Date(dateFrom)) return false;
        if (dateTo) {
            const toEnd = new Date(dateTo);
            toEnd.setHours(23, 59, 59, 999);
            if (date > toEnd) return false;
        }
        if (selectedWallet && t.walletId !== selectedWallet && t.toWalletId !== selectedWallet) return false;
        return true;
    });

    const filteredIncome = filteredTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    const filteredExpense = filteredTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);

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

    const periodLabel =
        dateFrom || dateTo
            ? `${dateFrom || "awal"} s/d ${dateTo || "sekarang"}`
            : "Semua periode";

    // ========== EXCEL EXPORT ==========
    const handleExportExcel = () => {
        const wb = XLSX.utils.book_new();
        const sheetData = [];

        sheetData.push(["LAPORAN TRANSAKSI KEUANGAN - SAIFU"]);
        sheetData.push([]);
        sheetData.push(["Nama", user?.name || "-"]);
        sheetData.push(["Email", user?.email || "-"]);
        sheetData.push(["Tanggal Cetak", today]);
        sheetData.push(["Periode", periodLabel]);
        if (selectedWallet) {
            sheetData.push(["Dompet", walletMap[selectedWallet] || "-"]);
        }
        sheetData.push([]);
        sheetData.push(["RINGKASAN"]);
        sheetData.push(["Total Pemasukan", filteredIncome]);
        sheetData.push(["Total Pengeluaran", filteredExpense]);
        sheetData.push(["Selisih", filteredIncome - filteredExpense]);
        sheetData.push([]);

        const tableHeaderRow = sheetData.length;
        sheetData.push(["No", "Tanggal", "Dompet", "Tipe", "Deskripsi", "Jumlah (Rp)"]);

        filteredTransactions.forEach((t, i) => {
            const date = new Intl.DateTimeFormat("id-ID", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit",
            }).format(new Date(t.createdAt));

            let walletName = walletMap[t.walletId] || "-";
            if (t.type === "transfer" && t.toWalletId) {
                walletName += ` → ${walletMap[t.toWalletId] || "-"}`;
            }

            const amount = t.type === "expense" ? -t.amount : t.amount;
            sheetData.push([i + 1, date, walletName, typeLabels[t.type] || t.type, t.description || "-", amount]);
        });

        sheetData.push([]);
        sheetData.push(["", "", "", "", "Total Data:", `${filteredTransactions.length} transaksi`]);

        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        ws["!cols"] = [{ wch: 5 }, { wch: 22 }, { wch: 25 }, { wch: 14 }, { wch: 30 }, { wch: 18 }];
        ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];

        const startDataRow = tableHeaderRow + 1;
        for (let i = 0; i < filteredTransactions.length; i++) {
            const cellRef = XLSX.utils.encode_cell({ r: startDataRow + i, c: 5 });
            if (ws[cellRef]) ws[cellRef].z = "#,##0";
        }

        XLSX.utils.book_append_sheet(wb, ws, "Transaksi");
        XLSX.writeFile(wb, `saifu_transaksi_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    // ========== PDF EXPORT ==========
    const handleExportPDF = () => {
        const txList = filteredTransactions;
        const printWindow = window.open("", "_blank");

        const tableRows = txList.map((t, i) => {
            let walletName = walletMap[t.walletId] || "-";
            if (t.type === "transfer" && t.toWalletId) {
                walletName += ` → ${walletMap[t.toWalletId] || "-"}`;
            }
            return `<tr>
                <td>${i + 1}</td>
                <td>${formatDateShort(t.createdAt)}</td>
                <td>${walletName}</td>
                <td><span class="type-badge type-${t.type}">${typeLabels[t.type] || t.type}</span></td>
                <td>${t.description || "-"}</td>
                <td class="amount ${t.type}">${t.type === "income" ? "+" : t.type === "expense" ? "-" : ""}${formatCurrency(t.amount)}</td>
            </tr>`;
        }).join("");

        printWindow.document.write(`<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Transaksi - Saifu</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; color: #1a1a2e; background: #fff; padding: 40px; font-size: 12px; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #10b981; }
        .brand { display: flex; align-items: center; gap: 12px; }
        .brand-icon { width: 44px; height: 44px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 700; }
        .brand h1 { font-size: 24px; font-weight: 700; color: #10b981; }
        .brand p { font-size: 11px; color: #64748b; margin-top: 2px; }
        .meta { text-align: right; font-size: 11px; color: #64748b; }
        .meta .title { font-size: 14px; font-weight: 600; color: #1a1a2e; margin-bottom: 4px; }
        .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
        .summary-card { padding: 16px 20px; border-radius: 12px; border: 1px solid #e2e8f0; background: #f8fafc; }
        .summary-card .label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; margin-bottom: 6px; }
        .summary-card .value { font-size: 20px; font-weight: 700; }
        .summary-card.balance .value { color: #1a1a2e; }
        .summary-card.income .value { color: #10b981; }
        .summary-card.expense .value { color: #ef4444; }
        .table-section h2 { font-size: 14px; font-weight: 600; margin-bottom: 12px; color: #1a1a2e; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        thead th { background: #f1f5f9; padding: 10px 14px; text-align: left; font-weight: 600; color: #475569; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; }
        thead th:first-child { border-radius: 8px 0 0 0; }
        thead th:last-child { border-radius: 0 8px 0 0; text-align: right; }
        tbody td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .type-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 600; }
        .type-income { background: #ecfdf5; color: #059669; }
        .type-expense { background: #fef2f2; color: #dc2626; }
        .type-transfer { background: #eff6ff; color: #2563eb; }
        .amount { text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; }
        .amount.income { color: #10b981; }
        .amount.expense { color: #ef4444; }
        .amount.transfer { color: #3b82f6; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; }
        @media print { body { padding: 20px; } .summary-card { break-inside: avoid; } tbody tr { break-inside: avoid; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">
            <div class="brand-icon">S</div>
            <div><h1>Saifu</h1><p>Laporan Keuangan Pribadi</p></div>
        </div>
        <div class="meta">
            <div class="title">Laporan Transaksi</div>
            <div>${user?.name || ""}</div>
            <div>${user?.email || ""}</div>
            <div style="margin-top:4px">Dicetak: ${today}</div>
            <div>Periode: ${periodLabel}</div>
        </div>
    </div>
    <div class="summary">
        <div class="summary-card balance"><div class="label">Total Saldo</div><div class="value">${formatCurrency(totalBalance)}</div></div>
        <div class="summary-card income"><div class="label">Total Pemasukan</div><div class="value">${formatCurrency(filteredIncome)}</div></div>
        <div class="summary-card expense"><div class="label">Total Pengeluaran</div><div class="value">${formatCurrency(filteredExpense)}</div></div>
    </div>
    <div class="table-section">
        <h2>Rincian Transaksi (${txList.length} data)</h2>
        <table>
            <thead><tr><th>No</th><th>Tanggal</th><th>Dompet</th><th>Tipe</th><th>Deskripsi</th><th>Jumlah</th></tr></thead>
            <tbody>${tableRows}</tbody>
        </table>
    </div>
    <div class="footer">
        <span>Dibuat otomatis oleh Saifu</span>
        <span>${today}</span>
    </div>
</body>
</html>`);

        printWindow.document.close();
        setTimeout(() => printWindow.print(), 300);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content max-w-lg!"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Download className="w-5 h-5 text-accent" />
                        Export Laporan
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Filters */}
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1.5">
                            <Wallet className="w-3.5 h-3.5" />
                            Dompet
                        </label>
                        <select
                            value={selectedWallet}
                            onChange={(e) => setSelectedWallet(e.target.value)}
                            className="input"
                        >
                            <option value="">Semua Dompet</option>
                            {wallets.map((w) => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                Dari Tanggal
                            </label>
                            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="input" />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                Sampai Tanggal
                            </label>
                            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="input" />
                        </div>
                    </div>
                </div>

                {/* Preview Summary */}
                <div className="bg-surface rounded-xl p-4 mb-6 border border-border">
                    <div className="flex items-center gap-2 mb-3">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Preview</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                            <p className="text-xs text-muted-foreground">Data</p>
                            <p className="text-lg font-bold">{filteredTransactions.length}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Masuk</p>
                            <p className="text-sm font-bold text-income">{formatCurrency(filteredIncome)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Keluar</p>
                            <p className="text-sm font-bold text-expense">{formatCurrency(filteredExpense)}</p>
                        </div>
                    </div>
                </div>

                {/* Export Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={handleExportPDF}
                        disabled={filteredTransactions.length === 0}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-surface hover:bg-card-hover hover:border-border-hover transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5 text-red-400" />
                        </div>
                        <span className="text-sm font-semibold">PDF</span>
                        <span className="text-xs text-muted-foreground">Cetak / Save as PDF</span>
                    </button>
                    <button
                        onClick={handleExportExcel}
                        disabled={filteredTransactions.length === 0}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-surface hover:bg-card-hover hover:border-border-hover transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileSpreadsheet className="w-5 h-5 text-green-400" />
                        </div>
                        <span className="text-sm font-semibold">Excel</span>
                        <span className="text-xs text-muted-foreground">Download .xlsx</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
