"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

const COLORS = [
    "#3b82f6", // blue-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#10b981", // emerald-500
    "#64748b", // slate-500
];

export default function CategoryPieChart({ transactions }) {
    const data = useMemo(() => {
        // Only consider expenses for this pie chart
        const expenses = transactions?.filter(t => t.type === "expense") || [];
        
        const categoryMap = {};
        expenses.forEach(t => {
            const cat = t.category || "Lainnya";
            if (!categoryMap[cat]) categoryMap[cat] = 0;
            categoryMap[cat] += t.amount;
        });

        return Object.keys(categoryMap).map(key => ({
            name: key,
            value: categoryMap[key]
        })).sort((a, b) => b.value - a.value); // Sort largest to smallest
    }, [transactions]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass p-3 rounded-xl border border-white/5 shadow-xl">
                    <p className="font-semibold text-sm mb-1">{payload[0].name}</p>
                    <p className="font-bold text-expense text-sm">
                        Rp {payload[0].value.toLocaleString("id-ID")}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (data.length === 0) {
        return (
            <div className="card flex flex-col justify-center items-center h-full min-h-[300px]">
                <PieChartIcon className="w-12 h-12 text-muted mx-auto mb-3 opacity-30" />
                <p className="text-muted-foreground text-sm">Belum ada pengeluaran</p>
            </div>
        );
    }

    return (
        <div className="card flex flex-col h-full">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
                <PieChartIcon className="w-5 h-5 text-accent" />
                Pengeluaran per Kategori
            </h3>
            
            <div className="w-full flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                            verticalAlign="bottom" 
                            height={36} 
                            iconType="circle"
                            formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
