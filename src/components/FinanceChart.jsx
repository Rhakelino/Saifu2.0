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
                <div className="glass p-4 rounded-xl border border-white/5 shadow-xl">
                    <p className="font-semibold mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between gap-4 mb-1 text-sm">
                            <span style={{ color: entry.color }}>
                                {entry.name === "income" ? "Pemasukan" : "Pengeluaran"}
                            </span>
                            <span className="font-bold">
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
        <div className="card flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-accent" />
                        Analisis Arus Kas
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Statistik {periodLabel[period]}
                    </p>
                </div>
                <div className="flex gap-1 bg-surface rounded-xl p-1 border border-border">
                    {PERIODS.map((p) => (
                        <button
                            key={p.key}
                            onClick={() => setPeriod(p.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${period === p.key
                                    ? "bg-accent/15 text-accent border border-accent/30"
                                    : "text-muted-foreground hover:text-foreground"
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
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#64748b", fontSize: 11 }}
                            dy={10}
                            interval={period === "1m" ? 4 : 0}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#64748b", fontSize: 12 }}
                            tickFormatter={(value) => {
                                if (value >= 1000000) return `${value / 1000000}jt`;
                                if (value >= 1000) return `${value / 1000}k`;
                                return value;
                            }}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#334155", strokeWidth: 1, strokeDasharray: "4 4" }} />
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
