"use client";

import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

const PERIODS = [
    { key: "7d", label: "7 Hari" },
    { key: "1m", label: "1 Bulan" },
    { key: "1y", label: "1 Tahun" },
];

export default function FinanceChart({ transactions }) {
    const [period, setPeriod] = useState("7d");

    const data = useMemo(() => {
        const now = new Date();
        now.setHours(23, 59, 59, 999);

        if (period === "7d") {
            // Group by day, last 7 days
            const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
            const days = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const key = d.toISOString().slice(0, 10);
                const label = `${dayNames[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
                days.push({ key, label, income: 0, expense: 0 });
            }
            transactions?.forEach((t) => {
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
            // Group by day, last 30 days — show every 3rd day label
            const days = [];
            for (let i = 29; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const key = d.toISOString().slice(0, 10);
                const label = `${d.getDate()}/${d.getMonth() + 1}`;
                days.push({ key, label, income: 0, expense: 0 });
            }
            transactions?.forEach((t) => {
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
            // Group by month, last 12 months
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
            const months = [];
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
                months.push({ key, label, income: 0, expense: 0 });
            }
            transactions?.forEach((t) => {
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

    const periodLabel = {
        "7d": "7 hari terakhir",
        "1m": "30 hari terakhir",
        "1y": "12 bulan terakhir",
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-zinc-800 p-4 rounded-2xl border border-zinc-700 shadow-xl">
                    <p className="font-semibold mb-2 text-zinc-50 text-sm">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between gap-4 mb-1 text-xs">
                            <span style={{ color: entry.color }}>
                                {entry.name === "income" ? "Pemasukan" : "Pengeluaran"}
                            </span>
                            <span className="font-bold text-zinc-50">
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
        <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-base font-semibold flex items-center gap-2 text-zinc-50">
                        <Activity className="w-5 h-5 text-emerald-500" />
                        Analisis Arus Kas
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                        Statistik {periodLabel[period]}
                    </p>
                </div>
                <div className="flex gap-1 bg-zinc-950/50 rounded-xl p-1 border border-zinc-800/50 self-start sm:self-auto">
                    {PERIODS.map((p) => (
                        <button
                            key={p.key}
                            onClick={() => setPeriod(p.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${period === p.key
                                    ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                                    : "text-zinc-400 hover:text-zinc-50"
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#a1a1aa", fontSize: 10 }}
                            dy={10}
                            interval={period === "1m" ? 4 : period === "7d" ? 1 : 0}
                            tickFormatter={(value) => {
                                // Shorten the 7d format on the tick without modifying the tooltip label
                                if (period === "7d") {
                                    return value.split(' ')[0]; // E.g. "Sen 18/5" -> "Sen"
                                }
                                return value;
                            }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#a1a1aa", fontSize: 10 }}
                            tickFormatter={(value) => {
                                if (value >= 1000000) return `${value / 1000000}jt`;
                                if (value >= 1000) return `${value / 1000}k`;
                                return value;
                            }}
                            dx={-10}
                            width={35}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#3f3f46", strokeWidth: 1, strokeDasharray: "4 4" }} />
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="expense"
                            stroke="#ef4444"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorExpense)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: "#ef4444" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
