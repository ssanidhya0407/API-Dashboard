"use client";

import { useRef, useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";
import { Play, Zap, AlertTriangle, Database, Activity, Wifi, Server } from "lucide-react";

export default function Simulator() {
    const [logs, setLogs] = useState<string[]>([]);
    const [activeScenario, setActiveScenario] = useState<string | null>(null);
    const [signals, setSignals] = useState<{ id: number, type: string, left: string }[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const signalIdRef = useRef(0);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
    };

    const spawnSignal = (type: string) => {
        const id = signalIdRef.current++;
        // Random horizontal position for variety
        const left = `${20 + Math.random() * 60}%`;
        setSignals(prev => [...prev, { id, type, left }]);

        // Cleanup signal after animation
        setTimeout(() => {
            setSignals(prev => prev.filter(s => s.id !== id));
        }, 1000);
    };

    const sendRequest = async (scenario: string, count: number = 1) => {
        setActiveScenario(scenario);
        addLog(`Starting scenario: ${scenario} (${count} events)...`);

        const endpoints = ["/api/v1/checkout", "/api/v1/login", "/api/v1/search", "/api/v1/user/profile"];
        const services = ["order-service", "auth-service", "search-service", "user-service"];

        try {
            for (let i = 0; i < count; i++) {
                spawnSignal(scenario);

                const isError = scenario === "Error Burst" || (scenario === "Organic" && Math.random() > 0.95);
                const isSlow = scenario === "Latency Spike" || (scenario === "Organic" && Math.random() > 0.9);

                const payload = {
                    serviceName: services[Math.floor(Math.random() * services.length)],
                    endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
                    method: "POST",
                    requestSize: Math.floor(Math.random() * 1000),
                    responseSize: Math.floor(Math.random() * 5000),
                    statusCode: isError ? 500 : 200,
                    timestamp: new Date().toISOString(),
                    latencyMs: isSlow ? Math.floor(Math.random() * 800) + 200 : Math.floor(Math.random() * 100) + 10,
                    tags: isError ? { "error": "simulated_failure" } : {}
                };

                // Non-blocking fetch
                fetch(`${API_BASE_URL}/logs`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }).catch(() => { });

                if (count > 1) await new Promise(r => setTimeout(r, 150));
            }
            addLog(`Completed: ${scenario}`);
        } catch (e) {
            addLog(`Error: Failed to send requests`);
        } finally {
            setActiveScenario(null);
        }
    };

    return (
        <main className="min-h-screen p-8 text-white relative">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col gap-2 relative z-10">
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        Traffic Simulator
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Generate real-time load patterns to test system observability.
                    </p>
                </div>

                {/* Signal Visualizer Area */}
                <div className="relative h-32 w-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

                    {/* Central "Receiver" Node */}
                    <div className="relative z-10 p-4 rounded-full bg-black/50 border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                        <div className={`absolute inset-0 rounded-full bg-blue-500/20 blur-xl transition-opacity duration-300 ${activeScenario ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
                        <Server size={32} className="text-zinc-200" />
                    </div>

                    {/* Animated Signals */}
                    {signals.map(s => (
                        <div
                            key={s.id}
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] animate-in slide-in-from-left-full duration-1000 fill-mode-forwards"
                            style={{
                                left: s.left, // Start from random position or actually animating towards center would need more complex CSS or Framer Motion
                                // Let's do a simple "fade up and scale" or "move to center" if we can.
                                // Determining start position is tricky without refs.
                                // Instead, let's make them fly from bottom up into the server?
                                bottom: '0',
                                animation: 'flyIntoServer 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                                backgroundColor: s.type === 'Error Burst' ? '#ef4444' : s.type === 'Latency Spike' ? '#f59e0b' : '#34d399'
                            }}
                        />
                    ))}

                    {/* We need animation keyframes for flyIntoServer, usually better in globals.css or just style tag here */}
                    <style jsx>{`
                        @keyframes flyIntoServer {
                            0% { transform: translateY(60px) scale(0.5); opacity: 0; }
                            50% { opacity: 1; }
                            100% { transform: translateY(0) scale(1); opacity: 0; } 
                        }
                    `}</style>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Organic Traffic */}
                    <button
                        onClick={() => sendRequest("Organic", 5)}
                        disabled={!!activeScenario}
                        className={`group relative p-6 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border transition-all text-left overflow-hidden ${activeScenario === "Organic" ? "border-emerald-500 ring-1 ring-emerald-500" : "border-white/5 hover:border-emerald-500/50"}`}
                    >
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center transition-transform ${activeScenario === "Organic" ? "animate-bounce" : "group-hover:scale-110"}`}>
                                    <Activity size={24} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Organic Pulse</h3>
                            <p className="text-sm text-zinc-400">Simulate 5 normal user requests.</p>
                        </div>
                    </button>

                    {/* Latency Spike */}
                    <button
                        onClick={() => sendRequest("Latency Spike", 20)}
                        disabled={!!activeScenario}
                        className={`group relative p-6 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border transition-all text-left overflow-hidden ${activeScenario === "Latency Spike" ? "border-amber-500 ring-1 ring-amber-500" : "border-white/5 hover:border-amber-500/50"}`}
                    >
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center transition-transform ${activeScenario === "Latency Spike" ? "animate-pulse" : "group-hover:scale-110"}`}>
                                    <Database size={24} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Latency Spike</h3>
                            <p className="text-sm text-zinc-400">Inject 20 slow database queries.</p>
                        </div>
                    </button>

                    {/* Error Burst */}
                    <button
                        onClick={() => sendRequest("Error Burst", 10)}
                        disabled={!!activeScenario}
                        className={`group relative p-6 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border transition-all text-left overflow-hidden ${activeScenario === "Error Burst" ? "border-red-500 ring-1 ring-red-500" : "border-white/5 hover:border-red-500/50"}`}
                    >
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center transition-transform ${activeScenario === "Error Burst" ? "animate-shake" : "group-hover:scale-110"}`}>
                                    <AlertTriangle size={24} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Error Burst</h3>
                            <p className="text-sm text-zinc-400">Flood with 500 Internal Errors.</p>
                        </div>
                    </button>

                    {/* High Load */}
                    <button
                        onClick={() => sendRequest("High Load", 50)}
                        disabled={!!activeScenario}
                        className={`group relative p-6 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border transition-all text-left overflow-hidden ${activeScenario === "High Load" ? "border-blue-500 ring-1 ring-blue-500" : "border-white/5 hover:border-blue-500/50"}`}
                    >
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center transition-transform ${activeScenario === "High Load" ? "animate-spin" : "group-hover:scale-110"}`}>
                                    <Zap size={24} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Traffic Surge</h3>
                            <p className="text-sm text-zinc-400">Simulate flash crowd (50 req).</p>
                        </div>
                    </button>
                </div>

                {/* Console Output (Minimap style) */}
                <div className="flex flex-col gap-2 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 text-zinc-500 px-2">
                        <Play size={14} />
                        <span className="uppercase tracking-widest text-xs font-bold">Live Execution Log</span>
                    </div>
                    <div ref={scrollRef} className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs space-y-1 h-[200px] overflow-y-auto">
                        {logs.length === 0 && <span className="text-zinc-700 italic">Ready to simulate traffic...</span>}
                        {logs.map((log, i) => (
                            <div key={i} className="text-zinc-300 border-l border-zinc-700 pl-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
                                {log}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
