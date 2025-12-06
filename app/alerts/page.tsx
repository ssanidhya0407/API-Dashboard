"use client";

import { AlertTriangle, CheckCircle, Clock, ShieldAlert } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { API_BASE_URL } from "@/lib/config";

interface Issue {
    id: string;
    type: string;
    status: string;
    serviceName: string;
    endpoint: string;
    firstSeen: string;
    lastSeen: string;
    count: number;
}

export default function Alerts() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [mounted, setMounted] = useState(false);

    const fetchIssues = () => {
        fetch(`${API_BASE_URL}/logs/issues`)
            .then(res => res.json())
            .then(data => setIssues(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        setMounted(true);
        fetchIssues();
        const interval = setInterval(fetchIssues, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleResolve = async (id: string) => {
        try {
            await fetch(`${API_BASE_URL}/logs/issues/${id}/resolve`, { method: "POST" });
            fetchIssues();
        } catch (e) {
            console.error("Failed to resolve", e);
        }
    };

    // Chart Data
    const severityData = useMemo(() => {
        const counts = { High: 0, Medium: 0, Low: 0 };
        issues.forEach(issue => {
            if (issue.status === 'RESOLVED') return;
            if (issue.type === 'BROKEN') counts.High++;
            else if (issue.type === 'SLOW') counts.Medium++;
            else counts.Low++;
        });
        return [
            { name: 'Critical', value: counts.High, color: '#ef4444' },
            { name: 'Warning', value: counts.Medium, color: '#f97316' },
            { name: 'Info', value: counts.Low, color: '#3b82f6' },
        ].filter(d => d.value > 0);
    }, [issues]);

    if (!mounted) return null;

    return (
        <div className="min-h-screen p-8 font-sans text-zinc-100">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-2">
                            Alerts Center
                        </h1>
                        <p className="text-zinc-400">Monitor and resolve critical system incidents.</p>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider">Live Incidents</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Charts Section */}
                    {severityData.length > 0 && (
                        <div className="lg:col-span-1 space-y-6">
                            <div className="p-6 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/5 shadow-xl relative overflow-hidden">
                                <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-4">Active Incident Distribution</h3>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={severityData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {severityData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                                                itemStyle={{ color: '#e4e4e7' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-[-20px]">
                                    <span className="text-3xl font-bold text-white">{issues.filter(i => i.status !== 'RESOLVED').length}</span>
                                    <span className="block text-xs text-zinc-500 uppercase">Active</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Incident List */}
                    <div className={`${severityData.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
                        {issues.map((issue) => (
                            <div key={issue.id} className={`group relative p-6 rounded-2xl border flex items-start gap-5 transition-all duration-500 ${issue.status === 'RESOLVED'
                                ? 'bg-white/5 border-white/5 opacity-60 grayscale'
                                : 'bg-zinc-900/60 backdrop-blur-xl border-white/10 hover:border-white/20 hover:bg-zinc-800/80 hover:-translate-y-1 shadow-lg'
                                }`}>

                                {issue.status !== 'RESOLVED' && <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition duration-500 pointer-events-none"></div>}

                                <div className={`p-3 rounded-2xl shadow-lg flex-shrink-0 ${issue.status === 'RESOLVED' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500 shadow-red-500/20'
                                    }`}>
                                    {issue.status === 'RESOLVED' ? <CheckCircle size={24} /> : <ShieldAlert size={24} />}
                                </div>
                                <div className="flex-1 relative z-10">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                        <h3 className="font-bold text-xl text-white tracking-tight">
                                            {issue.type === 'SLOW' ? 'High Latency Detected' : issue.type === 'BROKEN' ? 'Service Error' : 'Rate Limit Exceeded'}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded-lg self-start">
                                            <Clock size={12} />
                                            <span>{new Date(issue.lastSeen).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                    <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
                                        Service <span className="font-bold text-zinc-200">{issue.serviceName}</span> reported issue at <code className="bg-black/30 px-1.5 py-0.5 rounded text-yellow-500/90 font-mono">{issue.endpoint}</code>
                                    </p>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="text-xs text-zinc-500 font-medium">
                                            Occurrences: <span className="text-zinc-300">{issue.count}</span>
                                        </div>

                                        {issue.status !== 'RESOLVED' && (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleResolve(issue.id)}
                                                    className="px-4 py-2 bg-zinc-100 text-zinc-950 text-xs font-bold rounded-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95">
                                                    Resolve
                                                </button>
                                            </div>
                                        )}
                                        {issue.status === 'RESOLVED' && (
                                            <div className="text-xs text-green-500 font-bold uppercase tracking-wider flex items-center gap-1">
                                                <CheckCircle size={12} /> Resolved
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {issues.length === 0 && (
                            <div className="p-16 text-center rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 border-dashed">
                                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                                    <CheckCircle size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Systems Nominal</h3>
                                <p className="text-zinc-500 max-w-sm mx-auto">No active incidents detected. All services are operating within normal parameters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
