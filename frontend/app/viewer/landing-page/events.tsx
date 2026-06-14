"use client";

import { useEffect, useState } from "react";

interface Pageant {
    id: number;
    name: string;
    organization_name: string;
    country: string;
    province: string;
    city: string;
    date: string;
}

type Tab = "upcoming" | "past";

// ── Helpers ────────────────────────────────────────────────────────────────

function getDaysLeft(dateStr: string) {
    return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatDateShort(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// ── Countdown Timer ────────────────────────────────────────────────────────

function Countdown({ dateStr }: { dateStr: string }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calc = () => {
            const diff = new Date(dateStr).getTime() - Date.now();
            if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            setTimeLeft({
                days:    Math.floor(diff / 86400000),
                hours:   Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        };
        calc();
        const id = setInterval(calc, 1000);
        return () => clearInterval(id);
    }, [dateStr]);

    const units = [
        { label: "Days", value: timeLeft.days },
        { label: "Hrs",  value: timeLeft.hours },
        { label: "Min",  value: timeLeft.minutes },
        { label: "Sec",  value: timeLeft.seconds },
    ];

    return (
        <div className="flex items-end gap-2">
            {units.map(({ label, value }, i) => (
                <div key={label} className="flex items-end gap-2">
                    <div className="text-center">
                        <span className="font-display text-2xl font-bold text-gold leading-none tabular-nums">
                            {String(value).padStart(2, "0")}
                        </span>
                        <p className="text-[8px] uppercase tracking-[0.18em] text-gold-shimmer/40 mt-0.5">{label}</p>
                    </div>
                    {i < 3 && (
                        <span className="text-gold/40 font-display text-lg font-bold leading-none mb-4">:</span>
                    )}
                </div>
            ))}
        </div>
    );
}

// ── Featured Upcoming Card (large, first item) ─────────────────────────────

function FeaturedCard({ pageant }: { pageant: Pageant }) {
    const daysLeft = getDaysLeft(pageant.date);
    const isToday = daysLeft === 0;

    return (
        <div
            className="relative border border-gold/25 overflow-hidden group"
            style={{ background: "linear-gradient(135deg, rgba(197,160,89,0.06) 0%, rgba(197,160,89,0.02) 50%, transparent 100%)" }}
        >
            {/* Gold top bar */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold to-transparent" />

            {/* Decorative corner diamonds */}
            <div className="absolute top-5 right-5 w-3 h-3 border border-gold/30 rotate-45" />
            <div className="absolute bottom-5 left-5 w-2 h-2 border border-gold/20 rotate-45" />

            <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    {/* Left: info */}
                    <div className="flex-1 min-w-0">
                        {isToday ? (
                            <span className="inline-flex items-center gap-2 mb-4">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="label-caps text-emerald-400 text-[10px] tracking-[0.2em]">HAPPENING TODAY</span>
                            </span>
                        ) : (
                            <span className="label-caps text-gold tracking-[0.2em] text-[10px] mb-4 block">FEATURED EVENT</span>
                        )}

                        <h3 className="font-display text-cream-warm text-2xl md:text-3xl font-bold leading-tight mb-2">
                            {pageant.name}
                        </h3>
                        <p className="font-body text-gold-shimmer/60 text-sm mb-6">by {pageant.organization_name}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gold-shimmer/60 mb-8">
                            <span className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-gold/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {pageant.city}, {pageant.province}, {pageant.country}
                            </span>
                            <span className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-gold/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formatDate(pageant.date)}
                            </span>
                        </div>

                        <a
                            href="#"
                            className="inline-flex items-center gap-2 bg-gold text-white px-7 py-3 font-body text-xs font-semibold uppercase tracking-[0.1em] btn-shimmer hover:bg-gold-dark transition-all duration-300"
                        >
                            Learn More
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>

                    {/* Right: countdown */}
                    {!isToday && (
                        <div
                            className="flex-shrink-0 border border-gold/15 px-7 py-5"
                            style={{ background: "rgba(197,160,89,0.04)" }}
                        >
                            <p className="label-caps text-gold-shimmer/40 text-[9px] tracking-[0.2em] mb-4">STARTS IN</p>
                            <Countdown dateStr={pageant.date} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Upcoming Grid Card ─────────────────────────────────────────────────────

function UpcomingCard({ pageant }: { pageant: Pageant }) {
    const daysLeft = getDaysLeft(pageant.date);
    const isClose = daysLeft <= 7;

    return (
        <div
            className="relative border border-gold-shimmer/15 hover:border-gold/30 transition-all duration-300 group overflow-hidden"
            style={{ background: "rgba(197,160,89,0.02)" }}
        >
            <div className={`h-[1px] w-full transition-all duration-300 ${
                isClose
                    ? "bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
                    : "bg-gradient-to-r from-transparent via-gold/20 to-transparent group-hover:via-gold/50"
            }`} />

            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <span className={`label-caps text-[9px] tracking-[0.18em] px-2.5 py-1 border ${
                        isClose
                            ? "text-amber-400 border-amber-400/30 bg-amber-400/10"
                            : "text-gold border-gold/20 bg-gold/5"
                    }`}>
                        {daysLeft === 0 ? "TODAY" : isClose ? `${daysLeft}D LEFT` : "UPCOMING"}
                    </span>
                    <span className="font-body text-xs text-gold-shimmer/35">{formatDateShort(pageant.date)}</span>
                </div>

                <h3 className="font-display text-cream-warm text-base font-bold leading-snug mb-1 group-hover:text-gold transition-colors duration-300">
                    {pageant.name}
                </h3>
                <p className="font-body text-gold-shimmer/50 text-xs mb-5">{pageant.organization_name}</p>

                <div className="flex items-center gap-1.5 text-xs text-gold-shimmer/45 mb-6">
                    <svg className="w-3 h-3 text-gold/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {pageant.city}, {pageant.country}
                </div>

                <a
                    href="#"
                    className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-gold hover:text-cream-warm transition-colors duration-200"
                >
                    View Details
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </a>
            </div>
        </div>
    );
}

// ── Past Event Row ─────────────────────────────────────────────────────────

function PastRow({ pageant, index }: { pageant: Pageant; index: number }) {
    return (
        <div className="flex items-center gap-6 py-4 border-b border-gold-shimmer/[0.08] group hover:bg-gold/[0.02] transition-colors duration-200 px-2">
            <span className="font-display text-xs font-bold text-gold-shimmer/20 w-5 flex-shrink-0 tabular-nums">
                {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex-shrink-0 w-24 text-right">
                <p className="font-body text-xs text-gold-shimmer/40">{formatDateShort(pageant.date)}</p>
            </div>
            <div className="w-1.5 h-1.5 border border-gold-shimmer/20 rotate-45 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-bold text-cream-warm/50 truncate group-hover:text-cream-warm/70 transition-colors duration-200">
                    {pageant.name}
                </p>
                <p className="font-body text-xs text-gold-shimmer/30 truncate">{pageant.organization_name}</p>
            </div>
            <p className="hidden md:block font-body text-xs text-gold-shimmer/30 text-right flex-shrink-0">
                {pageant.city}, {pageant.country}
            </p>
            <span className="hidden sm:inline-flex items-center gap-1.5 label-caps text-[9px] tracking-[0.15em] text-gold-shimmer/25 border border-gold-shimmer/10 px-2 py-0.5 flex-shrink-0">
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Concluded
            </span>
        </div>
    );
}

// ── Skeleton Loader ────────────────────────────────────────────────────────

function SkeletonCard() {
    return (
        <div className="border border-gold-shimmer/10 p-6 animate-pulse" style={{ background: "rgba(197,160,89,0.02)" }}>
            <div className="flex justify-between mb-4">
                <div className="h-5 w-16 bg-gold-shimmer/10 rounded-sm" />
                <div className="h-4 w-20 bg-gold-shimmer/10 rounded-sm" />
            </div>
            <div className="h-4 w-3/4 bg-gold-shimmer/10 rounded-sm mb-2" />
            <div className="h-3 w-1/2 bg-gold-shimmer/10 rounded-sm mb-6" />
            <div className="h-3 w-2/5 bg-gold-shimmer/10 rounded-sm" />
        </div>
    );
}

// ── Main Section ───────────────────────────────────────────────────────────

export default function EventsSection() {
    const [tab, setTab] = useState<Tab>("upcoming");
    const [pageants, setPageants] = useState<Pageant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                let all: Pageant[] = [];
                let page = 1;
                let lastPage = 1;
                do {
                    const res = await fetch(`http://localhost:8000/api/pageants?page=${page}`);
                    if (!res.ok) break;
                    const data = await res.json();
                    all = [...all, ...data.data];
                    lastPage = data.last_page;
                    page++;
                } while (page <= lastPage);
                setPageants(all);
            } catch {
                /* ignore */
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const upcoming = pageants
        .filter((p) => getDaysLeft(p.date) >= 0)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const past = pageants
        .filter((p) => getDaysLeft(p.date) < 0)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const [featured, ...rest] = upcoming;

    return (
        <section className="relative bg-purple-deep py-28 overflow-hidden" id="events">
            {/* Radial spotlight */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(197,160,89,0.08) 0%, transparent 60%)" }}
            />

            {/* Floating diamonds — mirrors hero */}
            <div className="absolute top-[8%]  left-[5%]  w-4 h-4 border border-gold-shimmer/20 rotate-45 animate-float z-0" />
            <div className="absolute top-[20%] right-[8%] w-3 h-3 border border-gold-shimmer/15 rotate-45 animate-float-slow z-0" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-[15%] left-[12%] w-5 h-5 border border-gold-shimmer/10 rotate-45 animate-float-slower z-0" style={{ animationDelay: "0.5s" }} />
            <div className="absolute bottom-[30%] right-[5%] w-2 h-2 border border-gold-shimmer/25 rotate-45 animate-float z-0" style={{ animationDelay: "2s" }} />

            <div className="section-container relative z-10">

                {/* ── Section Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
                    <div>
                        <span className="label-caps text-gold tracking-[0.2em] mb-4 block">PAGEANT EVENTS</span>
                        <h2 className="font-display text-cream-warm text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                            On the <span className="text-gold-gradient">Stage</span>
                        </h2>
                        <p className="font-body text-gold-shimmer/60 text-base mt-3 max-w-md leading-relaxed">
                            Browse live, upcoming, and past pageants powered by Crown &amp; Glory.
                        </p>
                    </div>

                    {/* Tab toggle — matches subscription toggle style exactly */}
                    <div className="inline-flex items-center border border-gold/30 p-[3px] self-start sm:self-auto">
                        {(["upcoming", "past"] as Tab[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`font-body text-[11px] font-semibold uppercase tracking-[0.12em] px-5 py-2 transition-all duration-300 ${
                                    tab === t
                                        ? "bg-gold text-white"
                                        : "text-gold-shimmer/50 hover:text-gold"
                                }`}
                            >
                                {t === "upcoming" ? "Upcoming" : "Past Events"}
                                {!loading && (
                                    <span className={`ml-1.5 text-[9px] ${tab === t ? "text-white/70" : "text-gold-shimmer/30"}`}>
                                        ({t === "upcoming" ? upcoming.length : past.length})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Upcoming Tab ── */}
                {tab === "upcoming" && (
                    <div className="space-y-6">
                        {loading ? (
                            <>
                                <div className="border border-gold/15 p-10 animate-pulse" style={{ background: "rgba(197,160,89,0.03)" }}>
                                    <div className="h-3 w-24 bg-gold-shimmer/10 rounded-sm mb-4" />
                                    <div className="h-7 w-2/3 bg-gold-shimmer/10 rounded-sm mb-2" />
                                    <div className="h-4 w-1/3 bg-gold-shimmer/10 rounded-sm mb-8" />
                                    <div className="h-10 w-32 bg-gold-shimmer/10 rounded-sm" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                                </div>
                            </>
                        ) : upcoming.length === 0 ? (
                            <div className="border border-gold-shimmer/10 py-20 text-center">
                                <div className="w-12 h-12 border border-gold-shimmer/15 rotate-45 mx-auto mb-6 flex items-center justify-center">
                                    <svg className="w-5 h-5 -rotate-45 text-gold-shimmer/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="font-display text-cream-warm/40 text-lg font-bold mb-2">No upcoming events</p>
                                <p className="font-body text-gold-shimmer/30 text-sm">Check back soon — new pageants are added regularly.</p>
                            </div>
                        ) : (
                            <>
                                {featured && <FeaturedCard pageant={featured} />}
                                {rest.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {rest.map((p) => <UpcomingCard key={p.id} pageant={p} />)}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* ── Past Tab ── */}
                {tab === "past" && (
                    <div>
                        {loading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-6 py-4 border-b border-gold-shimmer/[0.08] animate-pulse px-2">
                                        <div className="h-3 w-5 bg-gold-shimmer/10 rounded-sm flex-shrink-0" />
                                        <div className="h-3 w-20 bg-gold-shimmer/10 rounded-sm flex-shrink-0" />
                                        <div className="flex-1 space-y-1.5">
                                            <div className="h-3.5 w-2/3 bg-gold-shimmer/10 rounded-sm" />
                                            <div className="h-2.5 w-1/3 bg-gold-shimmer/10 rounded-sm" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : past.length === 0 ? (
                            <div className="border border-gold-shimmer/10 py-20 text-center">
                                <div className="w-12 h-12 border border-gold-shimmer/15 rotate-45 mx-auto mb-6 flex items-center justify-center">
                                    <svg className="w-5 h-5 -rotate-45 text-gold-shimmer/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                </div>
                                <p className="font-display text-cream-warm/40 text-lg font-bold mb-2">No past events yet</p>
                                <p className="font-body text-gold-shimmer/30 text-sm">Concluded pageants will be archived here.</p>
                            </div>
                        ) : (
                            <>
                                {/* Column headers */}
                                <div className="flex items-center gap-6 pb-3 border-b border-gold-shimmer/[0.12] px-2 mb-1">
                                    <span className="w-5 flex-shrink-0" />
                                    <span className="w-24 flex-shrink-0 label-caps text-[9px] tracking-[0.18em] text-gold-shimmer/30 text-right">Date</span>
                                    <span className="w-1.5 flex-shrink-0" />
                                    <span className="flex-1 label-caps text-[9px] tracking-[0.18em] text-gold-shimmer/30">Event</span>
                                    <span className="hidden md:block label-caps text-[9px] tracking-[0.18em] text-gold-shimmer/30 text-right flex-shrink-0">Location</span>
                                    <span className="hidden sm:block w-24 flex-shrink-0" />
                                </div>
                                {past.map((p, i) => <PastRow key={p.id} pageant={p} index={i} />)}
                                <div className="flex items-center gap-4 mt-8">
                                    <div className="flex-1 h-px bg-gradient-to-r from-gold-shimmer/10 to-transparent" />
                                    <span className="label-caps text-[9px] tracking-[0.2em] text-gold-shimmer/20">END OF ARCHIVE</span>
                                    <div className="flex-1 h-px bg-gradient-to-l from-gold-shimmer/10 to-transparent" />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* ── Footer CTA ── */}
                {!loading && (
                    <div className="mt-14 pt-10 border-t border-gold-shimmer/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <p className="font-body text-gold-shimmer/45 text-sm text-center sm:text-left">
                            Want to host your own pageant?{" "}
                            <a href="#" className="text-gold hover:text-cream-warm transition-colors duration-200 underline underline-offset-2">
                                Get started as an organizer.
                            </a>
                        </p>
                        <a
                            href="#"
                            className="border border-gold text-gold hover:text-white px-7 py-3 font-body text-xs font-semibold uppercase tracking-[0.1em] hover:bg-gold/10 transition-all duration-300 whitespace-nowrap"
                        >
                            Browse All Events
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}