"use client";

import ThreeScene from "@/components/ThreeScene";
import { Activity, AlertTriangle, Clock, Server, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import { API_BASE_URL } from "@/lib/config";

interface Stats {
  totalRequests: number;
  avgLatency: number;
  activeServices: number;
  activeAlerts: number;
  requestHistory: { time: string; value: number }[];
  latencyHistory: { time: string; value: number }[];
  topSlowEndpoints: { method: string; endpoint: string; avgLatency: number }[];
  systemStatus: { name: string; status: string }[];
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Poll for stats every 5 seconds
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/logs/dashboard/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error("Failed to fetch stats", e);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen p-8 font-sans text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Activity size={24} />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                Platform Overview
              </h1>
            </div>
            <p className="text-zinc-400 text-lg">
              Real-time monitoring and observability command center.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-bold tracking-wide uppercase">System Live</span>
            </div>
          </div>
        </div>

        {/* 3D Visualizer & Main Metrics Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative group rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {/* REMOVED: backdrop-blur-sm overlay to keep 3D scene crisp */}
            <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none"></div>

            <div className="h-[400px] w-full relative z-0">
              <ThreeScene />
            </div>
            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent z-20">
              <h3 className="text-2xl font-bold text-white mb-2">Network Topology</h3>
              <p className="text-zinc-300 max-w-md">Visualizing real-time service interactions and data flow across your infrastructure.</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Main Stat Card - Requests */}
            <div className="p-6 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                  <Activity size={24} />
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <ArrowUpRight size={14} />
                  <span>Live</span>
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Total Requests</p>
                <h3 className="text-4xl font-extrabold text-white tracking-tight">{stats?.totalRequests.toLocaleString() ?? "..."}</h3>
              </div>
              <div className="h-16 w-full mt-4 -mx-2 opacity-50 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.requestHistory || []}>
                    <defs>
                      <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorReq)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Main Stat Card - Latency */}
            <div className="p-6 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20">
                  <Clock size={24} />
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <ArrowDownRight size={14} />
                  <span>Live</span>
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Avg Latency</p>
                <h3 className="text-4xl font-extrabold text-white tracking-tight">{stats ? `${stats.avgLatency}ms` : "..."}</h3>
              </div>
              <div className="h-16 w-full mt-4 -mx-2 opacity-50 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.latencyHistory || []}>
                    <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 flex flex-col justify-between group hover:bg-white/5 transition-all">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Server size={20} />
              </div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Services</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-white">{stats?.activeServices ?? "..."}</h3>
              <p className="text-sm text-zinc-400 mt-1">Active microservices</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 flex flex-col justify-between group hover:bg-white/5 transition-all">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
                <AlertTriangle size={20} />
              </div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Alerts</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-white">{stats?.activeAlerts ?? "..."}</h3>
              <p className="text-sm text-zinc-400 mt-1">Critical incidents</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 flex flex-col justify-between group hover:bg-white/5 transition-all">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Zap size={20} />
              </div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Uptime</span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-white">99.99%</h3>
              <p className="text-sm text-zinc-400 mt-1">Last 30 days</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-600 border border-white/10 flex flex-col justify-between relative overflow-hidden group shadow-lg shadow-indigo-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="flex justify-between items-start relative z-10">
              <div className="p-2 rounded-xl bg-white/20 text-white">
                <Activity size={20} />
              </div>
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Health</span>
            </div>
            <div className="mt-4 relative z-10">
              <h3 className="text-3xl font-bold text-white">Excellent</h3>
              <p className="text-sm text-indigo-100 mt-1">System is performing optimally</p>
            </div>
          </div>
        </div>

        {/* Detailed Lists Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Slow Endpoints */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative p-8 h-full bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl">
              <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
                <span className="w-1.5 h-8 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
                Performance Bottlenecks
              </h3>
              <div className="space-y-3">
                {stats?.topSlowEndpoints && stats.topSlowEndpoints.length > 0 ? (
                  stats.topSlowEndpoints.map((ep, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors group/item cursor-default">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 group-hover/item:text-orange-300 transition-colors">
                          <Clock size={16} />
                        </div>
                        <div>
                          <span className="block font-bold text-sm text-zinc-300">{ep.method}</span>
                          <span className="font-mono text-xs text-zinc-500">{ep.endpoint}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded-lg border border-orange-500/10">{ep.avgLatency}ms</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6 text-zinc-500 italic">No slow requests detected recently.</div>
                )}
              </div>
            </div>
          </div>

          {/* System Health Status */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative p-8 h-full bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl">
              <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                System Status
              </h3>
              <div className="space-y-3">
                {stats?.systemStatus && stats.systemStatus.length > 0 ? (
                  stats.systemStatus.map((svc, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_currentColor]"></div>
                        <span className="text-zinc-300 font-medium capitalize">{svc.name}</span>
                      </div>
                      <span className="text-xs font-bold text-green-400 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                        {svc.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6 text-zinc-500 italic">No active services found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
