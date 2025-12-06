"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Compass, Bell, Activity, Settings, Shield, ChevronLeft, ChevronRight, Zap, PlayCircle } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isActive = (path: string) => {
        return pathname === path;
    };

    const navItems = [
        { path: "/", label: "Overview", icon: LayoutDashboard },
        { path: "/explorer", label: "Explorer", icon: Compass },
        { path: "/alerts", label: "Alerts", icon: Bell },
        { path: "/simulator", label: "Simulator", icon: PlayCircle },
    ];

    return (
        <aside className={`${isCollapsed ? 'w-24' : 'w-72'} relative bg-black/40 backdrop-blur-3xl border-r border-white/5 flex-shrink-0 flex flex-col hidden md:flex sticky top-0 h-screen z-50 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group/sidebar`}>
            {/* Ambient background glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-20%] w-[50%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen opacity-50"></div>
                <div className="absolute bottom-[-10%] right-[-20%] w-[50%] h-[40%] bg-purple-500/10 blur-[100px] rounded-full mix-blend-screen opacity-50"></div>
            </div>

            <div className={`p-8 mb-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <div className={`flex items-center gap-4 overflow-hidden transition-all duration-500 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl blur opacity-60"></div>
                        <div className="relative w-full h-full bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl border border-white/20 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Zap className="text-white fill-white" size={20} />
                        </div>
                    </div>
                    <div>
                        <span className="block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-tight whitespace-nowrap">MonitorOS</span>
                        <span className="block text-[10px] text-zinc-500 font-medium tracking-widest uppercase">Enterprise</span>
                    </div>
                </div>
                {isCollapsed && (
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl blur opacity-60"></div>
                        <div className="relative w-full h-full bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl border border-white/20 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Zap className="text-white fill-white" size={20} />
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-10 w-6 h-6 bg-black border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:scale-110 hover:border-white/30 transition-all shadow-lg z-50 backdrop-blur-md"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <nav className="flex-1 px-4 space-y-2 mt-2">
                {!isCollapsed && <div className="px-4 mb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] transition-opacity duration-300">Dashboards</div>}

                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            title={isCollapsed ? item.label : ""}
                            className={`group flex items-center gap-4 px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300 relative overflow-hidden ${active
                                ? "text-white"
                                : "text-zinc-500 hover:text-zinc-200"
                                } ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            {/* Active Background Glow */}
                            {active && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent border border-white/5 rounded-2xl"></div>
                            )}

                            {/* Hover Background */}
                            {!active && (
                                <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            )}

                            <item.icon size={22} className={`flex-shrink-0 transition-all duration-300 relative z-10 ${active ? "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "group-hover:text-zinc-300"}`} />
                            <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap relative z-10 ${active ? "font-bold tracking-wide" : ""} ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                                {item.label}
                            </span>

                            {active && !isCollapsed && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_currentColor] animate-pulse"></div>
                            )}
                        </Link>
                    );
                })}

                <div className={`mt-12 transition-all duration-300 ${isCollapsed ? 'opacity-0 scale-95 hidden' : 'opacity-100 scale-100'}`}>
                    <div className="px-4 mb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Configuration</div>
                </div>

                <button title={isCollapsed ? "Security" : ""} className={`w-full flex items-center gap-4 px-4 py-3.5 text-sm font-medium rounded-2xl text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all group ${isCollapsed ? 'justify-center mt-4' : ''}`}>
                    <Shield size={22} className="flex-shrink-0 group-hover:text-indigo-400 transition-colors" />
                    <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>Security</span>
                </button>
                <button title={isCollapsed ? "Preferences" : ""} className={`w-full flex items-center gap-4 px-4 py-3.5 text-sm font-medium rounded-2xl text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all group ${isCollapsed ? 'justify-center' : ''}`}>
                    <Settings size={22} className="flex-shrink-0 group-hover:text-pink-400 transition-colors" />
                    <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>Preferences</span>
                </button>
            </nav>

            <div className="p-4 mx-4 mb-6 relative">
                {/* Card Background for collapsed/expanded */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl border border-white/5 pointer-events-none"></div>

                <div className={`relative p-3 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="relative flex-shrink-0 group cursor-pointer">
                        <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <span className="block w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-black/40 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                        <span className="absolute top-0 left-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-50"></span>
                    </div>
                    <div className={`flex-1 transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                        <p className="text-xs font-bold text-white tracking-wide">System Operational</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">v2.4.0-stable</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
