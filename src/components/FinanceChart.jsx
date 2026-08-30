"use client";

import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const PERIODS = [
    { key: "7d", label: "7H" },
    { key: "1m", label: "1B" },
    { key: "1y", label: "1T" },
];

export default function FinanceChart({ transactions }) {
    const [period, setPeriod] = useState("7d");

    const data = useMemo(() => {
        const safeTransactions = Array.isArray(transactions) ? transactions : [];
        const now = new Date();
        now.setHours(23, 59, 59, 999);

        if (period === "7d") {
            const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
            const days = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const key = d.toISOString().slice(0, 10);
                const label = dayNames[d.getDay()];
                days.push({ key, label, income: 0, expense: 0 });
            }
            safeTransactions.forEach((t) => {
                const txDate = new Date(t.createdAt).toISOString().slice(0, 10);
                const day = days.find((d) => d.key === txDate);
                if (day) {
                    if (t.type === "income") day.income += t.amount;
                    else if (t.type === "expense") day.expense += t.amount;
                }
            });
            return days.map((d) => ({ name: d.label, income: d.income, expense: d.expense }));
        }

        if (period === "1m") {
            const days = [];
            for (let i = 29; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const key = d.toISOString().slice(0, 10);
                const label = `${d.getDate()}/${d.getMonth() + 1}`;
                days.push({ key, label, income: 0, expense: 0 });
            }
            safeTransactions.forEach((t) => {
                const txDate = new Date(t.createdAt).toISOString().slice(0, 10);
                const day = days.find((d) => d.key === txDate);
                if (day) {
                    if (t.type === "income") day.income += t.amount;
                    else if (t.type === "expense") day.expense += t.amount;
                }
            });
            return days.map((d) => ({ name: d.label, income: d.income, expense: d.expense }));
        }

        if (period === "1y") {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
            const months = [];
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                months.push({ key, label: monthNames[d.getMonth()], income: 0, expense: 0 });
            }
            safeTransactions.forEach((t) => {
                const d = new Date(t.createdAt);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                const month = months.find((m) => m.key === key);
                if (month) {
                    if (t.type === "income") month.income += t.amount;
                    else if (t.type === "expense") month.expense += t.amount;
                }
            });
            return months.map((m) => ({ name: m.label, income: m.income, expense: m.expense }));
        }

        return [];
    }, [transactions, period]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 shadow-2xl">
                    <p className="text-xs font-semibold text-zinc-400 mb-2">{label}</p>
                    {payload.map((entry, i) => (
                        <div key={i} className="flex items-center justify-between gap-6 text-xs mb-1">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                                <span className="text-zinc-400">
                                    {entry.name === "income" ? "Masuk" : "Keluar"}
                                </span>
                            </div>
                            <span className="font-bold text-zinc-100">
                                Rp {entry.value.toLocaleString("id-ID")}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            {/* Period tabs */}
            <div className="flex items-center gap-1 mb-4">
                {PERIODS.map((p) => (
                    <button
                        key={p.key}
                        onClick={() => setPeriod(p.key)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            period === p.key
                                ? "bg-zinc-800 text-zinc-100"
                                : "text-zinc-500 hover:text-zinc-300"
                        }`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            <div className="w-full h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#27272a"
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#52525b", fontSize: 10, fontWeight: 500 }}
                            dy={8}
                            interval={period === "1m" ? 5 : 0}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#52525b", fontSize: 10, fontWeight: 500 }}
                            tickFormatter={(v) => {
                                if (v >= 1000000) return `${v / 1000000}jt`;
                                if (v >= 1000) return `${v / 1000}k`;
                                return v;
                            }}
                            dx={-4}
                            width={32}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: "#3f3f46", strokeWidth: 1, strokeDasharray: "4 4" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#22c55e"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#incomeGrad)"
                            activeDot={{ r: 4, fill: "#22c55e", stroke: "#09090b", strokeWidth: 2 }}
                            isAnimationActive={false}
                        />
                        <Area
                            type="monotone"
                            dataKey="expense"
                            stroke="#f43f5e"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#expenseGrad)"
                            activeDot={{ r: 4, fill: "#f43f5e", stroke: "#09090b", strokeWidth: 2 }}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs text-zinc-500">Pemasukan</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-xs text-zinc-500">Pengeluaran</span>
                </div>
            </div>
        </div>
    );
}
