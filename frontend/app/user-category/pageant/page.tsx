"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Pageant {
    id: number;
    name: string;
    organization_name: string;
    country: string;
    province: string;
    city: string;
    barangay: string;
    zip: string;
    date: string;
}

export default function PageantList() {
    const [pageants, setPageants] = useState<Pageant[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const fetchPageants = async (p: number = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/api/pageants/public?page=${p}`);
            if (res.ok) {
                const data = await res.json();
                setPageants(data.data);
                setPage(data.current_page);
                setLastPage(data.last_page);
            }
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPageants();
    }, []);

    const filtered = searchQuery
        ? pageants.filter(
            (p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.organization_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : pageants;

    return (
        <div className="relative min-h-screen bg-purple-deep flex flex-col items-center overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 z-0 opacity-80"
                style={{ background: "radial-gradient(circle at 50% 30%, rgba(197, 160, 89, 0.1) 0%, transparent 70%)" }}
            />
            <div className="absolute top-[10%] left-[5%] w-4 h-4 border border-gold-shimmer/20 rotate-45 animate-float z-0" />
            <div className="absolute bottom-[15%] right-[5%] w-5 h-5 border border-gold-shimmer/20 rotate-45 animate-float-slow z-0" style={{ animationDelay: "1s" }} />

            <div className="relative z-10 w-full max-w-6xl flex flex-col">
                <div className="mb-8 self-start">
                    <Link
                        id="back-to-category-link"
                        href="/user-category/category"
                        className="group flex items-center gap-2 text-gold-shimmer hover:text-gold transition-colors duration-200 label-caps text-xs font-semibold"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                        <span>Back to Categories</span>
                    </Link>
                </div>

                <div className="text-center mb-12 animate-fade-in-up">
                    <span className="label-caps text-gold tracking-[0.25em] mb-3 block">
                        SUPPORTER DIRECTORY
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-cream-warm tracking-tight">
                        Active & Upcoming Pageants
                    </h1>
                    <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
                </div>

                {/* Search */}
                <div className="bg-purple-deep/40 border border-gold-shimmer/20 p-6 rounded-xl shadow-gold backdrop-blur-md mb-8">
                    <div className="relative w-full max-w-md mx-auto">
                        <input
                            id="pageant-search-input"
                            type="text"
                            placeholder="Search pageant name, city, or organizer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-purple-deep/60 border border-gold-shimmer/30 text-cream-warm px-4 py-3 pl-10 rounded-md focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-300 text-sm placeholder-cream-dim/40"
                        />
                        <span className="absolute left-3.5 top-3.5 text-gold-shimmer/50 text-sm">🔍</span>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-purple-deep/40 border border-gold-shimmer/20 rounded-xl overflow-hidden shadow-gold backdrop-blur-md border-b-2 border-b-gold">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gold-shimmer/10 bg-purple-deep/80">
                                    <th className="py-4 px-6 label-caps text-gold text-xs tracking-wider">Pageant Title</th>
                                    <th className="py-4 px-6 label-caps text-gold text-xs tracking-wider">Organizer</th>
                                    <th className="py-4 px-6 label-caps text-gold text-xs tracking-wider">Location</th>
                                    <th className="py-4 px-6 label-caps text-gold text-xs tracking-wider">Date</th>
                                    <th className="py-4 px-6 label-caps text-gold text-xs tracking-wider">Days Left</th>
                                    <th className="py-4 px-6 label-caps text-gold text-xs tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gold-shimmer/10 font-body text-sm text-cream-dim/95">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 px-6">
                                            <div className="space-y-4 animate-pulse">
                                                {Array.from({ length: 4 }).map((_, i) => (
                                                    <div key={i} className="flex items-center gap-4">
                                                        <div className="h-4 bg-white/10 rounded w-1/4" />
                                                        <div className="h-4 bg-white/10 rounded w-1/5" />
                                                        <div className="h-4 bg-white/10 rounded w-1/6" />
                                                        <div className="h-4 bg-white/10 rounded w-12 ml-auto" />
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 px-6 text-center text-cream-dim/40 font-body">
                                            No pageants found.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((p, idx) => {
                                        const days = Math.max(0, Math.ceil((new Date(p.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                                        return (
                                            <tr key={p.id} className="hover:bg-gold/5 transition-colors duration-200 animate-fade-in-up"
                                                style={{ animationDelay: `${idx * 0.05}s` }}>
                                                <td className="py-4 px-6">
                                                    <span className="font-semibold text-cream-warm">{p.name}</span>
                                                </td>
                                                <td className="py-4 px-6 text-cream-dim/70">{p.organization_name}</td>
                                                <td className="py-4 px-6">{p.city}, {p.province}</td>
                                                <td className="py-4 px-6 text-cream-dim/80">
                                                    {new Date(p.date).toLocaleDateString("en-US", {
                                                        year: "numeric", month: "short", day: "numeric",
                                                    })}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-gold text-xs font-semibold">
                                                        {days === 0 ? "Today!" : `${days}d`}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <button
                                                        id={`action-btn-${p.id}`}
                                                        onClick={() => router.push(`/user-category/pageant-info?id=${p.id}`)}
                                                        className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border border-gold/40 text-gold rounded-md hover:border-gold hover:bg-gold/5 transition-all duration-300 cursor-pointer"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    {lastPage > 1 && (
                        <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-gold-shimmer/10">
                            <button onClick={() => fetchPageants(page - 1)} disabled={page <= 1}
                                className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider border border-gold-shimmer/30 text-cream-dim/60 rounded-md hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition">
                                Prev
                            </button>
                            {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                                <button key={p} onClick={() => fetchPageants(p)}
                                    className={`w-8 h-8 text-xs font-semibold rounded-md transition ${p === page ? "bg-gold text-purple-deep" : "text-cream-dim/60 hover:bg-white/5"}`}>
                                    {p}
                                </button>
                            ))}
                            <button onClick={() => fetchPageants(page + 1)} disabled={page >= lastPage}
                                className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider border border-gold-shimmer/30 text-cream-dim/60 rounded-md hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition">
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <p className="relative z-10 font-body text-[10px] text-gold-shimmer/30 uppercase tracking-widest mt-16">
                © 2026 Crown & Glory. All rights reserved.
            </p>
        </div>
    );
}
