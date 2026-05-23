"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

const COLORS = [
    "#ffffff", // white
    "#3b82f6", // blue-500
    "#f59e0b", // amber-500
    "#22c55e", // emerald-500
    "#f43f5e", // rose-500
    "#06b6d4", // cyan-500
    "#71717a", // zinc-500
];

export default function CategoryPieChart({ transactions }) {
    const data = useMemo(() => {
        const expenses = transactions?.filter(t => t.type === "expense") || [];
        const categoryMap = {};
        expenses.forEach(t => {
            const cat = t.category || "Lainnya";
            if (!categoryMap[cat]) categoryMap[cat] = 0;
            categoryMap[cat] += t.amount;
        });
        return Object.keys(categoryMap)
            .map(key => ({ name: key, value: categoryMap[key] }))
            .sort((a, b) => b.value - a.value);
    }, [transactions]);

    const total = data.reduce((sum, d) => sum + d.value, 0);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 shadow-2xl">
                    <p className="text-xs font-semibold text-zinc-400 mb-1">{payload[0].name}</p>
                    <p className="font-bold text-zinc-100 text-sm">
                        Rp {payload[0].value.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                        {((payload[0].value / total) * 100).toFixed(1)}% dari total
                    </p>
                </div>
            );
        }
        return null;
    };

    if (data.length === 0) {
        return (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                    <PieChartIcon className="w-6 h-6 text-zinc-600" />
                </div>
                <p className="text-sm font-semibold text-zinc-400 mb-1">Pengeluaran per Kategori</p>
                <p className="text-xs text-zinc-600">Belum ada pengeluaran yang dicatat</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-center gap-2 mb-4">
                <PieChartIcon className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Pengeluaran per Kategori</h3>
            </div>

            <div className="w-full h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 mt-3">
                {data.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ background: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-zinc-400">{entry.name}</span>
                        </div>
                        <span className="font-semibold text-zinc-300">
                            Rp {entry.value.toLocaleString("id-ID")}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
