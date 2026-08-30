"use client";

import { useState } from "react";
import { Download, FileText, FileSpreadsheet, X, Calendar, Wallet, BarChart3 } from "lucide-react";
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

    const safeWallets = Array.isArray(wallets) ? wallets : [];
    const safeTransactions = Array.isArray(transactions) ? transactions : [];

    const walletMap = {};
    safeWallets.forEach((w) => (walletMap[w.id] = w.name));

    const typeLabels = {
        income: "Pemasukan",
        expense: "Pengeluaran",
        transfer: "Transfer",
    };

    const filteredTransactions = safeTransactions.filter((t) => {
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
        if (selectedWallet) sheetData.push(["Dompet", walletMap[selectedWallet] || "-"]);
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
                <td class="amount ${t.type}">${t.type === "income" ? "+" : t.type === "expense" ? "−" : ""}${formatCurrency(t.amount)}</td>
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
        body { font-family: 'Inter', sans-serif; color: #09090b; background: #fff; padding: 48px; font-size: 12px; line-height: 1.6; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 36px; padding-bottom: 28px; border-bottom: 1.5px solid #e4e4e7; }
        .brand { display: flex; align-items: center; gap: 14px; }
        .brand-icon { width: 42px; height: 42px; background: #09090b; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: 800; }
        .brand h1 { font-size: 22px; font-weight: 700; color: #09090b; letter-spacing: -0.5px; }
        .brand p { font-size: 11px; color: #71717a; margin-top: 2px; }
        .meta { text-align: right; font-size: 11px; color: #71717a; line-height: 1.8; }
        .meta .badge { display: inline-block; background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 6px; padding: 2px 10px; font-size: 10px; font-weight: 600; color: #3f3f46; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 6px; }
        .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 36px; }
        .summary-card { padding: 16px 20px; border-radius: 10px; border: 1px solid #e4e4e7; }
        .summary-card .label { font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600; margin-bottom: 8px; }
        .summary-card .value { font-size: 18px; font-weight: 700; letter-spacing: -0.5px; }
        .summary-card.balance .value { color: #09090b; }
        .summary-card.income .value { color: #16a34a; }
        .summary-card.expense .value { color: #dc2626; }
        .section-title { font-size: 11px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        thead th { background: #fafafa; padding: 10px 12px; text-align: left; font-weight: 600; color: #52525b; font-size: 10px; letter-spacing: 0.5px; text-transform: uppercase; border-top: 1px solid #e4e4e7; border-bottom: 1px solid #e4e4e7; }
        thead th:last-child { text-align: right; }
        tbody td { padding: 10px 12px; border-bottom: 1px solid #f4f4f5; vertical-align: middle; color: #3f3f46; }
        tbody tr:last-child td { border-bottom: none; }
        .type-badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; }
        .type-income { background: #f0fdf4; color: #16a34a; }
        .type-expense { background: #fef2f2; color: #dc2626; }
        .type-transfer { background: #f4f4f5; color: #52525b; }
        .amount { text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; }
        .amount.income { color: #16a34a; }
        .amount.expense { color: #dc2626; }
        .amount.transfer { color: #52525b; }
        .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e4e4e7; display: flex; justify-content: space-between; font-size: 10px; color: #a1a1aa; }
        @media print { body { padding: 24px; } tbody tr { break-inside: avoid; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">
            <div class="brand-icon">S</div>
            <div><h1>Saifu</h1><p>Laporan Keuangan Pribadi</p></div>
        </div>
        <div class="meta">
            <div class="badge">Laporan Transaksi</div><br>
            <strong style="color:#09090b;font-size:12px">${user?.name || ""}</strong><br>
            ${user?.email || ""}<br>
            Dicetak: ${today}<br>
            Periode: ${periodLabel}
        </div>
    </div>
    <div class="summary">
        <div class="summary-card balance"><div class="label">Total Saldo</div><div class="value">${formatCurrency(totalBalance)}</div></div>
        <div class="summary-card income"><div class="label">Pemasukan</div><div class="value">${formatCurrency(filteredIncome)}</div></div>
        <div class="summary-card expense"><div class="label">Pengeluaran</div><div class="value">${formatCurrency(filteredExpense)}</div></div>
    </div>
    <div class="section-title">Rincian Transaksi — ${txList.length} data</div>
    <table>
        <thead><tr><th>#</th><th>Tanggal</th><th>Dompet</th><th>Tipe</th><th>Deskripsi</th><th>Jumlah</th></tr></thead>
        <tbody>${tableRows}</tbody>
    </table>
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
        <div
            className="fixed inset-0 z-[100] flex items-start pt-10 sm:pt-20 justify-center bg-black/80 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="drawer-content relative w-full max-w-md max-h-[90vh] overflow-y-auto sm:rounded-2xl sm:border sm:border-zinc-800 sm:bg-zinc-900 sm:shadow-2xl sm:p-6 !mt-0 !mb-0 sm:max-h-[90vh] sm:animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Handle (mobile only) */}
                <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-5 sm:hidden" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                            <Download className="w-4 h-4 text-zinc-300" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-zinc-100">Export Laporan</h2>
                            <p className="text-xs text-zinc-500">PDF atau Excel</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 mb-5">
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 mb-1.5">
                            <Wallet className="w-3.5 h-3.5" /> Dompet
                        </label>
                        <select
                            value={selectedWallet}
                            onChange={(e) => setSelectedWallet(e.target.value)}
                            className="input"
                        >
                            <option value="">Semua Dompet</option>
                            {safeWallets.map((w) => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 mb-1.5">
                                <Calendar className="w-3.5 h-3.5" /> Dari
                            </label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 mb-1.5">
                                <Calendar className="w-3.5 h-3.5" /> Sampai
                            </label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="input"
                            />
                        </div>
                    </div>
                </div>

                {/* Preview Summary */}
                <div className="rounded-lg bg-zinc-950/60 border border-zinc-800 p-4 mb-5">
                    <div className="flex items-center gap-1.5 mb-3">
                        <BarChart3 className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-xs font-medium text-zinc-500">Preview Data</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <p className="text-[10px] text-zinc-600 mb-1">Transaksi</p>
                            <p className="text-lg font-bold text-zinc-100">{filteredTransactions.length}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-600 mb-1">Masuk</p>
                            <p className="text-xs font-bold text-emerald-400">{formatCurrency(filteredIncome)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-600 mb-1">Keluar</p>
                            <p className="text-xs font-bold text-rose-400">{formatCurrency(filteredExpense)}</p>
                        </div>
                    </div>
                </div>

                {/* Export Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={handleExportPDF}
                        disabled={filteredTransactions.length === 0}
                        className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-rose-500/15 transition-all">
                            <FileText className="w-5 h-5 text-rose-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-zinc-100">PDF</p>
                            <p className="text-[11px] text-zinc-500 mt-0.5">Cetak / Save as PDF</p>
                        </div>
                    </button>

                    <button
                        onClick={handleExportExcel}
                        disabled={filteredTransactions.length === 0}
                        className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/15 transition-all">
                            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-zinc-100">Excel</p>
                            <p className="text-[11px] text-zinc-500 mt-0.5">Download .xlsx</p>
                        </div>
                    </button>
                </div>

                {filteredTransactions.length === 0 && (
                    <p className="text-center text-xs text-zinc-600 mt-3">
                        Tidak ada transaksi dalam rentang waktu ini
                    </p>
                )}
            </div>
        </div>
    );
}
