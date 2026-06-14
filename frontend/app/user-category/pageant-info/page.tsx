"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Candidate {
    id: number;
    first_name: string;
    last_name: string;
    email: string | null;
    pivot: { pageant_id: number; candidate_id: number };
}

interface PageantDetail {
    id: number;
    name: string;
    organization_name: string;
    country: string;
    province: string;
    city: string;
    barangay: string;
    zip: string;
    date: string;
    candidates: Candidate[];
}

function PageantInfoInner() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [pageant, setPageant] = useState<PageantDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/pageants/${id}`);
                if (res.ok) setPageant(await res.json());
            } catch {
                // ignore
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const daysLeft = pageant
        ? Math.max(0, Math.ceil((new Date(pageant.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : 0;

    const status = daysLeft === 0 ? "Ongoing" : "Upcoming";

    if (loading) {
        return (
            <div className="min-h-screen bg-purple-deep flex items-center justify-center">
                <div className="animate-pulse space-y-4 w-full max-w-md px-8">
                    <div className="h-6 bg-white/10 rounded w-3/4 mx-auto" />
                    <div className="h-4 bg-white/10 rounded w-1/2 mx-auto" />
                    <div className="h-40 bg-white/10 rounded" />
                </div>
            </div>
        );
    }

    if (!pageant) {
        return (
            <div className="min-h-screen bg-purple-deep flex items-center justify-center text-cream-dim/60">
                <p>Pageant not found.</p>
            </div>
        );
    }

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
                        id="back-to-pageant-list-link"
                        href="/user-category/pageant"
                        className="group flex items-center gap-2 text-gold-shimmer hover:text-gold transition-colors duration-200 label-caps text-xs font-semibold"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                        <span>Back to Pageants</span>
                    </Link>
                </div>

                {/* Pageant Header */}
                <div className="bg-purple-deep/40 border border-gold-shimmer/20 rounded-xl shadow-gold backdrop-blur-md mb-12 overflow-hidden border-b-2 border-b-gold animate-fade-in-up">
                    <div className="flex flex-col md:flex-row items-start gap-8 p-8">
                        <div className="flex-1">
                            <span className="label-caps text-gold tracking-[0.25em] mb-2 block">
                                {pageant.organization_name}
                            </span>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-cream-warm tracking-tight mb-3">
                                {pageant.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 font-body text-sm text-cream-dim/80">
                                <div className="flex items-center gap-2">
                                    <span className="text-gold-shimmer">📍</span>
                                    <span>{pageant.city}, {pageant.province}, {pageant.country}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gold-shimmer">📅</span>
                                    <span>{new Date(pageant.date).toLocaleDateString("en-US", {
                                        year: "numeric", month: "long", day: "numeric",
                                    })}</span>
                                </div>
                                <span className={`inline-block px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full ${status === "Ongoing"
                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                        : "bg-gold/20 text-gold-light border border-gold/30"
                                    }`}>
                                    {status}
                                </span>
                            </div>
                            <p className="font-body text-sm text-cream-dim/70">
                                {daysLeft === 0 ? "This event is happening today!" : `${daysLeft} day${daysLeft > 1 ? "s" : ""} until the event.`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Candidates */}
                <div className="text-center mb-10 animate-fade-in-up">
                    <span className="label-caps text-gold tracking-[0.25em] mb-3 block">
                        OFFICIAL DELEGATES
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-cream-warm tracking-tight">
                        Candidates
                    </h2>
                    <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
                </div>

                {pageant.candidates.length === 0 ? (
                    <div className="text-center text-cream-dim/40 py-12">
                        <p>No candidates assigned yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pageant.candidates.map((c, idx) => (
                            <div key={c.id}
                                className="bg-purple-deep/40 border border-gold-shimmer/20 rounded-xl p-6 shadow-gold backdrop-blur-md border-b-2 border-b-gold animate-fade-in-up"
                                style={{ animationDelay: `${idx * 0.05}s` }}>
                                <h3 className="font-display text-lg font-bold text-cream-warm">
                                    {c.first_name} {c.last_name}
                                </h3>
                                {c.email && (
                                    <p className="font-body text-xs text-cream-dim/60 mt-1">{c.email}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <p className="relative z-10 font-body text-[10px] text-gold-shimmer/30 uppercase tracking-widest mt-16">
                © 2026 Crown & Glory. All rights reserved.
            </p>
        </div>
    );
}

export default function PageantInfo() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-purple-deep flex items-center justify-center">
                <div className="animate-pulse space-y-4 w-full max-w-md px-8">
                    <div className="h-6 bg-white/10 rounded w-3/4 mx-auto" />
                    <div className="h-4 bg-white/10 rounded w-1/2 mx-auto" />
                    <div className="h-40 bg-white/10 rounded" />
                </div>
            </div>
        }>
            <PageantInfoInner />
        </Suspense>
    );
}
