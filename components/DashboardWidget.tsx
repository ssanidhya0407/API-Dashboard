"use client";


import { LucideIcon } from "lucide-react";

interface Props {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    color?: "blue" | "green" | "red" | "orange" | "gray" | "indigo";
}

export default function DashboardWidget({ title, value, icon: Icon, trend, color = "gray" }: Props) {
    const colorStyles = {
        blue: "text-blue-400 bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]",
        green: "text-green-400 bg-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.3)]",
        red: "text-red-400 bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.3)]",
        orange: "text-orange-400 bg-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.3)]",
        indigo: "text-indigo-400 bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.3)]",
        gray: "text-zinc-400 bg-zinc-500/20"
    };

    return (
        <div className="relative group perspective-1000">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 via-white/5 to-transparent rounded-3xl blur-md opacity-0 group-hover:opacity-100 transition duration-700 ease-out"></div>
            <div className="relative p-6 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.4)] ring-1 ring-white/5">
                <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-2xl ${colorStyles[color]} backdrop-blur-md`}>
                        <Icon size={24} />
                    </div>
                    {trend && (
                        <span className={`text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border ${trend.includes("High") ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                trend.includes("Live") ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                    "bg-green-500/10 text-green-400 border-green-500/20"
                            }`}>
                            {trend}
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
                    <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 tracking-tight drop-shadow-sm">{value}</h3>
                </div>
            </div>
        </div>
    );
}
