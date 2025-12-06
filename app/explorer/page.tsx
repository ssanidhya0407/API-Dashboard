"use client";

import { useState, useEffect, useMemo } from "react";
import { Filter, Search, Activity, Clock, Database } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { API_BASE_URL } from "@/lib/config";

interface Log {
    timestamp: string;
    serviceName: string;
    method: string;
    endpoint: string;
    statusCode: number;
    latencyMs: number;
    tags: Record<string, string>;
}

export default function Explorer() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [filter, setFilter] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetch(`${API_BASE_URL}/logs`)
            .then(res => res.json())
            .then(data => setLogs(data))
            .catch(err => console.error(err));
    }, []);

    // Process data for charts
    const chartData = useMemo(() => {
        if (!logs.length) return [];

        // Group by minute (or logical bucket) for demo purposes
        // In a real app, this would be more sophisticated time-bucketing
        const buckets: Record<string, { time: string, count: number, latency: number, errors: number }> = {};

        // Sort logs by time first
        const sortedLogs = [...logs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        sortedLogs.forEach(log => {
            const date = new Date(log.timestamp);
            const key = `${date.getHours()}:${date.getMinutes()}`; // Simple bucketing

            if (!buckets[key]) {
                buckets[key] = { time: key, count: 0, latency: 0, errors: 0 };
            }

            buckets[key].count++;
            buckets[key].latency += log.latencyMs;
            if (log.statusCode >= 400) buckets[key].errors++;
        });

        return Object.values(buckets).map(b => ({
            ...b,
            latency: Math.round(b.latency / b.count) // Average latency
        })).slice(-20); // Show last 20 data points
    }, [logs]);

    if (!mounted) return null;

    return (
        <div className="min-h-screen p-8 font-sans text-zinc-100">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
                            Explorer
                        </h1>
                        <p className="text-zinc-400">Deep dive into your API traffic and system performance.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-sm font-bold flex items-center gap-2">
                            <Activity size={16} />
                            <span>Live Stream</span>
                        </div>
                    </div>
                </div>

                {/* Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Log Volume Chart */}
                    <div className="p-6 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/5 shadow-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div>
                                <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Traffic Volume</h3>
                                <p className="text-2xl font-bold text-white mt-1">{logs.length} <span className="text-sm font-medium text-zinc-500">requests</span></p>
                            </div>
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                <Database size={20} />
                            </div>
                        </div>
                        <div className="h-[180px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                                        itemStyle={{ color: '#e4e4e7' }}
                                        labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Latency Chart */}
                    <div className="p-6 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/5 shadow-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none"></div>
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div>
                                <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Avg Latency</h3>
                                <p className="text-2xl font-bold text-white mt-1">
                                    {logs.length ? Math.round(logs.reduce((a, b) => a + b.latencyMs, 0) / logs.length) : 0}
                                    <span className="text-sm font-medium text-zinc-500">ms</span>
                                </p>
                            </div>
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                <Clock size={20} />
                            </div>
                        </div>
                        <div className="h-[180px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                                        itemStyle={{ color: '#e4e4e7' }}
                                        labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                                    />
                                    <Bar dataKey="latency" radius={[4, 4, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.latency > 100 ? '#ef4444' : '#a855f7'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4 items-center bg-zinc-900/80 backdrop-blur-2xl p-4 rounded-2xl border border-white/10 shadow-lg sticky top-20 z-40 transition-all duration-300">
                    <Search className="text-zinc-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by service, endpoint, or method..."
                        className="bg-transparent border-none focus:ring-0 flex-1 text-white placeholder-zinc-500 text-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                    <div className="h-6 w-px bg-white/10" />
                    <button className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                        <Filter size={16} /> <span className="hidden sm:inline">Filters</span>
                    </button>
                </div>

                {/* Logs Table */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-transparent rounded-3xl blur-md opacity-30 group-hover:opacity-70 transition duration-700"></div>
                    <div className="relative bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/5">
                                        <th className="p-5 font-bold text-zinc-400 uppercase tracking-wider text-xs">Timestamp</th>
                                        <th className="p-5 font-bold text-zinc-400 uppercase tracking-wider text-xs">Service</th>
                                        <th className="p-5 font-bold text-zinc-400 uppercase tracking-wider text-xs">Method</th>
                                        <th className="p-5 font-bold text-zinc-400 uppercase tracking-wider text-xs">Endpoint</th>
                                        <th className="p-5 font-bold text-zinc-400 uppercase tracking-wider text-xs">Status</th>
                                        <th className="p-5 font-bold text-zinc-400 uppercase tracking-wider text-xs">Latency</th>
                                        <th className="p-5 font-bold text-zinc-400 uppercase tracking-wider text-xs">Tags</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {logs.filter((log) =>
                                        log.serviceName?.toLowerCase().includes(filter.toLowerCase()) ||
                                        log.endpoint?.toLowerCase().includes(filter.toLowerCase())
                                    ).map((log, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors group/row">
                                            <td className="p-5 text-zinc-500 whitespace-nowrap text-xs font-mono">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                            <td className="p-5 font-medium text-zinc-300">{log.serviceName}</td>
                                            <td className="p-5">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm ${log.method === 'GET' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                    log.method === 'POST' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                        'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                                                    }`}>{log.method}</span>
                                            </td>
                                            <td className="p-5 font-mono text-zinc-400 group-hover/row:text-white transition-colors">{log.endpoint}</td>
                                            <td className="p-5">
                                                <span className={`inline-flex items-center gap-2 ${log.statusCode >= 500 ? 'text-red-400' :
                                                    log.statusCode >= 400 ? 'text-orange-400' :
                                                        'text-green-400'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${log.statusCode >= 500 ? 'bg-red-500 animate-pulse' :
                                                        log.statusCode >= 400 ? 'bg-orange-500' :
                                                            'bg-green-500'
                                                        }`} />
                                                    <span className="font-bold">{log.statusCode}</span>
                                                </span>
                                            </td>
                                            <td className="p-5 text-zinc-400 font-mono">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${log.latencyMs > 200 ? 'bg-red-500' : log.latencyMs > 100 ? 'bg-orange-500' : 'bg-green-500'}`}
                                                            style={{ width: `${Math.min(log.latencyMs / 5, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    {log.latencyMs}ms
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                {log.tags && Object.keys(log.tags).length > 0 && (
                                                    <div className="flex gap-1 flex-wrap">
                                                        {Object.entries(log.tags).map(([k, v]) => (
                                                            <span key={k} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/5 text-zinc-400 border border-white/5">
                                                                {k}:{v}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
