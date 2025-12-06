import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
    title: "Observability Platform",
    description: "API Monitoring and Observability",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>
                <div className="flex min-h-screen font-sans selection:bg-blue-500/30">
                    <Sidebar />
                    <main className="flex-1 max-h-screen overflow-auto relative">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
                        {children}
                    </main>
                </div>
                <Analytics />
            </body>
        </html>
    );
}
