"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

/* ────────────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────────── */
interface Candidate {
    id: number;
    first_name: string;
    last_name: string;
    email: string | null;
    gender: string;
    candidate_number: string;
    primary_image: string | null;
    hover_image: string | null;
    pivot: { pageant_id: number; candidate_id: number };
}

interface PageantDetail {
    id: number;
    name: string;
    organization_name: string;
    logo: string | null;
    cover_photo: string | null;
    country: string;
    province: string;
    city: string;
    barangay: string;
    zip: string;
    date: string;
    candidates: Candidate[];
}

/* ────────────────────────────────────────────────────────────────
   Constants
   ──────────────────────────────────────────────────────────────── */
const API_BASE = "http://localhost:8000";
const STORAGE_BASE = `${API_BASE}/storage`;

const SECTIONS = ["cover", "profile", "podium", "candidates"] as const;
type SectionId = (typeof SECTIONS)[number];

/* ────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────── */
const imgUrl = (path: string | null) => (path ? `${STORAGE_BASE}/${path}` : null);

/* ────────────────────────────────────────────────────────────────
   Loading / Not found states
   ──────────────────────────────────────────────────────────────── */
function SkeletonPulse({ className }: { className?: string }) {
    return <div className={`animate-pulse rounded-xl bg-gold-shimmer/[0.06] ${className ?? ""}`} />;
}

function LoadingFallback() {
    return (
        <div className="min-h-screen bg-purple-deep flex items-center justify-center">
            <div className="w-full max-w-md px-8 space-y-5">
                <SkeletonPulse className="h-48" />
                <SkeletonPulse className="h-6 w-3/4 mx-auto" />
                <SkeletonPulse className="h-4 w-1/2 mx-auto" />
                <SkeletonPulse className="h-40" />
            </div>
        </div>
    );
}

function NotFound() {
    return (
        <div className="min-h-screen bg-purple-deep flex flex-col items-center justify-center text-gold-shimmer/50 gap-4">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                <svg className="w-8 h-8 text-gold/70" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                </svg>
            </div>
            <p className="font-display text-lg text-cream-warm">Pageant not found.</p>
            <Link
                href="/user-category/pageant"
                className="label-caps text-gold hover:text-gold-dark text-xs tracking-[0.2em] transition-colors"
            >
                ← Back to Pageants
            </Link>
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────
   Shared decorative background (echoes HeroSection)
   ──────────────────────────────────────────────────────────────── */
function DecorativeBackground() {
    return (
        <>
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-70"
                style={{
                    background: "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(197, 160, 89, 0.12) 0%, transparent 65%)",
                }}
            />
            <div className="absolute top-[18%] left-[10%] w-3 h-3 border border-gold-shimmer/25 rotate-45 animate-float z-0 pointer-events-none" />
            <div
                className="absolute bottom-[22%] right-[9%] w-4 h-4 border border-gold-shimmer/20 rotate-45 animate-float-slow z-0 pointer-events-none"
                style={{ animationDelay: "1.5s" }}
            />
            <div
                className="absolute top-[45%] right-[15%] w-2 h-2 rounded-full bg-gold-shimmer/15 animate-float-slower z-0 pointer-events-none"
                style={{ animationDelay: "0.5s" }}
            />
        </>
    );
}

/* ────────────────────────────────────────────────────────────────
   Vertical progress rail — the signature interactive element.
   A crown of four pips tracing the reader's descent through the page.
   ──────────────────────────────────────────────────────────────── */
function ScrollRail({ active, onNavigate }: { active: SectionId; onNavigate: (s: SectionId) => void }) {
    const labels: Record<SectionId, string> = {
        cover: "Cover",
        profile: "Profile",
        podium: "Podium",
        candidates: "Candidates",
    };
    const activeIndex = SECTIONS.indexOf(active);

    return (
        <div className="fixed right-5 md:right-8 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-center gap-0">
            {SECTIONS.map((s, i) => (
                <div key={s} className="flex flex-col items-center">
                    <button
                        onClick={() => onNavigate(s)}
                        aria-label={`Go to ${labels[s]}`}
                        className="group relative flex items-center justify-center w-6 h-6"
                    >
                        <span
                            className={`rounded-full transition-all duration-500 ${
                                i === activeIndex
                                    ? "w-2.5 h-2.5 bg-gold shadow-[0_0_8px_rgba(197,160,89,0.7)]"
                                    : "w-1.5 h-1.5 bg-gold-shimmer/30 group-hover:bg-gold-shimmer/60"
                            }`}
                        />
                        <span className="absolute right-6 whitespace-nowrap label-caps text-[9px] tracking-[0.2em] text-gold-shimmer/0 group-hover:text-gold-shimmer/70 transition-colors duration-300 pointer-events-none">
                            {labels[s]}
                        </span>
                    </button>
                    {i < SECTIONS.length - 1 && (
                        <span className="w-px h-8 bg-gold-shimmer/15 relative overflow-hidden">
                            <span
                                className="absolute inset-x-0 top-0 bg-gold transition-all duration-700 ease-out"
                                style={{ height: i < activeIndex ? "100%" : "0%" }}
                            />
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────
   Countdown
   ──────────────────────────────────────────────────────────────── */
function useCountdown(dateStr: string) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calc = () => {
            const diff = new Date(dateStr).getTime() - Date.now();
            if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        };
        calc();
        const id = setInterval(calc, 1000);
        return () => clearInterval(id);
    }, [dateStr]);

    return timeLeft;
}

function CountdownTimer({ dateStr, size = "sm" }: { dateStr: string; size?: "sm" | "lg" }) {
    const t = useCountdown(dateStr);
    const isPast = new Date(dateStr).getTime() <= Date.now();

    if (isPast) {
        return (
            <span className={`font-display text-gold ${size === "lg" ? "text-4xl md:text-6xl" : "text-lg"}`}>
                Underway
            </span>
        );
    }

    const units = [
        { label: "Days", value: t.days },
        { label: "Hrs", value: t.hours },
        { label: "Min", value: t.minutes },
        { label: "Sec", value: t.seconds },
    ];

    const numberClass = size === "lg" ? "text-7xl sm:text-8xl md:text-9xl lg:text-9xl" : "text-2xl md:text-3xl";
    const labelClass = size === "lg" ? "text-xs md:text-sm mt-2" : "text-[8px] mt-1";
    const gapClass = size === "lg" ? "gap-4 md:gap-8" : "gap-1.5";
    const colonClass = size === "lg" ? "text-5xl md:text-7xl mb-6 md:mb-10" : "text-lg mb-4";

    return (
        <div className={`flex items-end justify-center ${gapClass}`}>
            {units.map(({ label, value }, i) => (
                <div key={label} className={`flex items-end ${gapClass}`}>
                    <div className="text-center">
                        <div className={`${numberClass} font-display font-bold text-gold leading-none tabular-nums`}>
                            {String(value).padStart(2, "0")}
                        </div>
                        <div className={`label-caps text-gold-shimmer/50 tracking-[0.2em] ${labelClass}`}>{label}</div>
                    </div>
                    {i < 3 && <span className={`text-gold-shimmer/30 font-black leading-none ${colonClass}`}>:</span>}
                </div>
            ))}
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────
   Rotating word slot — bottom-to-top slide, cycles through traits
   ──────────────────────────────────────────────────────────────── */
function RotatingWords({ words }: { words: string[] }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2200);
        return () => clearInterval(id);
    }, [words.length]);

    return (
        <span
            className="relative inline-block h-[1.3em] md:h-[1.4em] overflow-hidden align-bottom"
            style={{ minWidth: "6.5ch" }}
        >
            <span
                className="flex flex-col transition-transform duration-700 ease-in-out"
                style={{ transform: `translateY(-${index * 100}%)` }}
            >
                {words.map((w, i) => (
                    <span key={i} className="h-[1.3em] md:h-[1.4em] flex items-center text-gold whitespace-nowrap">
                        {w}
                    </span>
                ))}
            </span>
        </span>
    );
}

/* ────────────────────────────────────────────────────────────────
   Section 1 — Cover: logo, name, organization only
   ──────────────────────────────────────────────────────────────── */
const COVER_TRAITS = ["Consistency", "Elegant", "Unique", "Good-Looking", "Prestige", "Timeless"];

function CoverSection({ pageant, progress }: { pageant: PageantDetail; progress: number }) {
    const bg = imgUrl(pageant.cover_photo);
    const logo = imgUrl(pageant.logo);

    return (
        <section
            className="snap-start snap-always relative min-h-screen w-full overflow-hidden transition-[opacity,transform] duration-300 ease-out"
            style={{ opacity: progress, transform: `translateY(${(1 - progress) * 24}px)` }}
        >
            {bg ? (
                <>
                    <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-45" />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-deep via-purple-deep/75 to-purple-deep/40" />
                </>
            ) : (
                <div className="absolute inset-0 bg-purple-deep" />
            )}
            <DecorativeBackground />

            {/* Back link */}
            <div className="absolute top-5 left-5 md:top-8 md:left-8 z-20">
                <Link
                    href="/user-category/pageant"
                    className="group inline-flex items-center gap-2.5 text-gold-shimmer/70 hover:text-gold transition-all duration-300 text-xs label-caps tracking-[0.15em] bg-purple-deep/40 hover:bg-purple-deep/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-gold-shimmer/10 hover:border-gold/30"
                >
                    <svg
                        className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Pageant List
                </Link>
            </div>

            {/* Huge countdown, overlaid top-center on the cover photo */}
            <div className="absolute top-24 sm:top-28 md:top-32 left-1/2 -translate-x-1/2 z-10 text-center px-4 w-full animate-fade-in-up">
                <span className="label-caps text-gold/60 text-[10px] md:text-xs tracking-[0.35em] block mb-3">
                    Countdown To The Crowning
                </span>
                <CountdownTimer dateStr={pageant.date} size="lg" />
            </div>

            {/* Bottom-left identity cluster: logo, name, rotating traits, organization */}
            <div className="absolute bottom-24 md:bottom-28 left-6 md:left-14 right-6 z-10 flex items-center gap-5 md:gap-7 animate-fade-in-up-delay-1">
                <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-gold/30 overflow-hidden bg-purple-deep flex items-center justify-center shadow-2xl shadow-black/40">
                        {logo ? (
                            <img src={logo} alt={pageant.organization_name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-display text-gold text-3xl font-bold">
                                {pageant.organization_name.charAt(0)}
                            </span>
                        )}
                    </div>
                    <div className="absolute -inset-1.5 rounded-full border border-gold-shimmer/15" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-4 md:gap-8">
                        <h1 className="font-display text-cream-warm text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] truncate min-w-0">
                            {pageant.name}
                        </h1>
                        <span className="hidden sm:inline-flex items-center gap-2 text-sm sm:text-base md:text-xl font-body font-medium text-gold-shimmer/60 flex-shrink-0">
                            <span className="w-1 h-1 rounded-full bg-gold/50 flex-shrink-0" />
                            <RotatingWords words={COVER_TRAITS} />
                        </span>
                    </div>
                    <h4 className="font-body text-gold-gradient text-sm sm:text-base md:text-lg font-semibold mt-1.5">
                        {pageant.organization_name}
                    </h4>
                </div>
            </div>

            {/* Scroll cue */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-2 z-10 opacity-70">
                <span className="label-caps text-gold-shimmer/50 text-[9px] tracking-[0.35em] block">SCROLL</span>
                <div className="w-4 h-4 border-b-2 border-r-2 border-gold-shimmer/60 rotate-45 animate-chevron" />
            </div>
        </section>
    );
}

/* ────────────────────────────────────────────────────────────────
   Section 2 — Full profile: logo, name, org, date, location, countdown
   ──────────────────────────────────────────────────────────────── */
function InfoTile({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="group flex-1 min-w-[200px] rounded-2xl border border-gold-shimmer/10 bg-gold-shimmer/[0.03] backdrop-blur-md px-6 py-5 hover:border-gold/30 hover:bg-gold-shimmer/[0.06] transition-all duration-300">
            <div className="flex items-center gap-2 mb-3 text-gold/70">
                {icon}
                <span className="label-caps text-[10px] tracking-[0.2em]">{label}</span>
            </div>
            <div className="font-display text-cream-warm">{value}</div>
        </div>
    );
}

function ProfileSection({
    pageant,
    progress,
    onNavigate,
}: {
    pageant: PageantDetail;
    progress: number;
    onNavigate: (s: SectionId) => void;
}) {
    const logo = imgUrl(pageant.logo);
    const isOngoing = new Date(pageant.date).getTime() <= Date.now();

    return (
        <section
            className="snap-start snap-always relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-[opacity,transform] duration-300 ease-out"
            style={{ opacity: progress, transform: `translateY(${(1 - progress) * 24}px)` }}
        >
            <DecorativeBackground />

            <div className="relative z-10 section-container w-full max-w-5xl px-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-gold/30 overflow-hidden bg-purple-deep flex items-center justify-center mb-5 shadow-xl shadow-black/30">
                    {logo ? (
                        <img src={logo} alt={pageant.organization_name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="font-display text-gold text-2xl font-bold">
                            {pageant.organization_name.charAt(0)}
                        </span>
                    )}
                </div>

                <h2 className="font-display text-cream-warm text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                    {pageant.name}
                </h2>
                <p className="font-body text-gold-gradient text-base md:text-lg font-semibold mt-2 mb-3">
                    {pageant.organization_name}
                </p>

                <span
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border label-caps text-[10px] tracking-[0.2em] mb-10 ${
                        isOngoing ? "border-gold text-gold bg-gold/10" : "border-gold-shimmer/30 text-gold-shimmer/70 bg-transparent"
                    }`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${isOngoing ? "bg-gold animate-pulse" : "bg-gold-shimmer/50"}`} />
                    {isOngoing ? "Ongoing" : "Upcoming"}
                </span>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl justify-center">
                    <InfoTile
                        label="Date"
                        icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                                />
                            </svg>
                        }
                        value={new Date(pageant.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    />
                    <InfoTile
                        label="Location"
                        icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                                />
                            </svg>
                        }
                        value={`${pageant.city}, ${pageant.province}`}
                    />
                    <InfoTile
                        label="Candidates"
                        icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                                />
                            </svg>
                        }
                        value={`${pageant.candidates.length} Candidate${pageant.candidates.length !== 1 ? "s" : ""}`}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto justify-center">
                    <button
                        onClick={() => onNavigate("candidates")}
                        className="group inline-flex items-center justify-center gap-2.5 bg-gold text-white px-7 py-3.5 rounded-xl font-body text-xs font-semibold uppercase tracking-[0.15em] btn-shimmer hover:bg-gold-dark transition-all duration-300"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Take a Vote
                    </button>

                    <button
                        onClick={() => onNavigate("podium")}
                        className="group inline-flex items-center justify-center gap-2.5 border border-gold text-gold hover:text-white hover:bg-gold/10 px-7 py-3.5 rounded-xl font-body text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.75A1.125 1.125 0 0013.5 15.375V18.75m3-9v-3.375c0-.621-.504-1.125-1.125-1.125h-.75A1.125 1.125 0 0013.5 6.375V9.75m0 9h-3v-4.875c0-.621-.504-1.125-1.125-1.125h-.75A1.125 1.125 0 007.5 13.875V18.75m3-9V7.875c0-.621-.504-1.125-1.125-1.125h-.75A1.125 1.125 0 007.5 7.875V9.75m3 0h3m-3 0h-3"
                            />
                        </svg>
                        See Top Ranking
                    </button>

                    <button
                        type="button"
                        disabled
                        title="Coming soon"
                        className="inline-flex items-center justify-center gap-2.5 border border-gold-shimmer/15 text-gold-shimmer/35 px-7 py-3.5 rounded-xl font-body text-xs font-semibold uppercase tracking-[0.15em] cursor-not-allowed"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                            />
                        </svg>
                        Pageant Community
                    </button>
                </div>
            </div>
        </section>
    );
}

/* ────────────────────────────────────────────────────────────────
   Section 3 — Podium: big 1st place box + 2nd / 3rd, hover effects
   ──────────────────────────────────────────────────────────────── */
function PodiumCard({
    candidate,
    rank,
    tall,
}: {
    candidate: Candidate;
    rank: number;
    tall?: boolean;
}) {
    const primary = imgUrl(candidate.primary_image);
    const hover = imgUrl(candidate.hover_image);
    const medal = rank === 1 ? "👑" : rank === 2 ? "🥈" : "🥉";

    return (
        <div
            className={`group relative rounded-2xl border overflow-hidden bg-gold-shimmer/[0.03] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 ${
                tall
                    ? "w-full sm:w-64 border-gold/40 shadow-[0_0_30px_rgba(197,160,89,0.12)] hover:shadow-[0_0_45px_rgba(197,160,89,0.25)] order-2 sm:order-none"
                    : "w-full sm:w-52 border-gold-shimmer/10 hover:border-gold/30"
            }`}
        >
            <div className={`relative w-full ${tall ? "h-72 md:h-80" : "h-56 md:h-64"} overflow-hidden bg-purple-deep`}>
                {primary ? (
                    <img
                        src={primary}
                        alt={`${candidate.first_name} ${candidate.last_name}`}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-0"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 group-hover:opacity-0">
                        <span className="font-display text-gold/30 text-4xl font-bold">
                            {candidate.first_name.charAt(0)}
                            {candidate.last_name.charAt(0)}
                        </span>
                    </div>
                )}
                {hover ? (
                    <img
                        src={hover}
                        alt={`${candidate.first_name} ${candidate.last_name}`}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 scale-110 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gold/5">
                        <span className="label-caps text-gold/60 text-[10px] tracking-[0.2em]">View Profile</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-deep via-transparent to-transparent" />

                <div className="absolute top-3 left-3 w-9 h-9 rounded-full bg-purple-deep/70 backdrop-blur-md border border-gold/20 flex items-center justify-center text-base">
                    {medal}
                </div>
                <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-purple-deep/70 backdrop-blur-md border border-gold/20 flex items-center justify-center">
                    <span className="text-cream-warm text-[11px] font-bold">
                        {candidate.candidate_number || rank}
                    </span>
                </div>
            </div>

            <div className="px-4 py-4 text-center">
                <h3 className="font-display text-cream-warm font-bold group-hover:text-gold transition-colors duration-300">
                    {candidate.first_name} {candidate.last_name}
                </h3>
                {candidate.gender && (
                    <p className="text-xs text-gold-shimmer/50 mt-1 capitalize font-medium">{candidate.gender}</p>
                )}
                <p className="text-[11px] label-caps tracking-[0.15em] text-gold-shimmer/40 mt-2">0 votes</p>
            </div>
        </div>
    );
}

function RankRow({ candidate, rank }: { candidate: Candidate; rank: number }) {
    const primary = imgUrl(candidate.primary_image);
    return (
        <div className="group flex items-center gap-4 px-5 py-3 rounded-xl hover:bg-gold-shimmer/[0.04] transition-colors duration-200 border-b border-gold-shimmer/5 last:border-b-0">
            <span className="w-6 text-center text-sm font-bold text-gold-shimmer/40">{rank}</span>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-deep border border-gold-shimmer/10 flex items-center justify-center flex-shrink-0">
                {primary ? (
                    <img src={primary} alt="" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gold text-[10px] font-bold">{candidate.first_name.charAt(0)}</span>
                )}
            </div>
            <span className="flex-1 text-left text-sm text-cream-warm/90 font-medium group-hover:text-gold transition-colors">
                {candidate.first_name} {candidate.last_name}
            </span>
            <span className="text-xs text-gold-shimmer/40 font-mono">0</span>
        </div>
    );
}

function PodiumSection({ candidates, progress }: { candidates: Candidate[]; progress: number }) {
    const fadeStyle = {
        opacity: progress,
        transform: `translateY(${(1 - progress) * 24}px)`,
    };

    if (candidates.length === 0) {
        return (
            <section
                className="snap-start snap-always relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-[opacity,transform] duration-300 ease-out"
                style={fadeStyle}
            >
                <DecorativeBackground />
                <div className="relative z-10 text-center px-6">
                    <span className="label-caps text-gold text-xs tracking-[0.25em] mb-4 block">Ranking</span>
                    <p className="font-display text-cream-warm/50 text-lg">No candidates yet.</p>
                </div>
            </section>
        );
    }

    const top3 = candidates.slice(0, 3);
    const rest = candidates.slice(3);
    const [first, second, third] = top3;

    return (
        <section
            className="snap-start snap-always relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden py-24 transition-[opacity,transform] duration-300 ease-out"
            style={fadeStyle}
        >
            <DecorativeBackground />
            <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center">
                <span className="label-caps text-gold text-xs tracking-[0.25em] mb-2">Top Honors</span>
                <h2 className="font-display text-cream-warm text-3xl md:text-4xl font-bold mb-10 text-center">
                    The Podium
                </h2>

                <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center gap-6 w-full mb-10">
                    {second && <PodiumCard candidate={second} rank={2} />}
                    {first && <PodiumCard candidate={first} rank={1} tall />}
                    {third && <PodiumCard candidate={third} rank={3} />}
                </div>

                {rest.length > 0 && (
                    <div className="w-full max-w-2xl rounded-2xl border border-gold-shimmer/10 bg-gold-shimmer/[0.02] backdrop-blur-md max-h-52 overflow-y-auto">
                        {rest.map((c, i) => (
                            <RankRow key={c.id} candidate={c} rank={i + 4} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

/* ────────────────────────────────────────────────────────────────
   Section 4 — All candidates, collapsible, hover per card
   ──────────────────────────────────────────────────────────────── */
function CandidateCard({ candidate, index }: { candidate: Candidate; index: number }) {
    const primary = imgUrl(candidate.primary_image);
    const hover = imgUrl(candidate.hover_image);

    return (
        <div className="group bg-gold-shimmer/[0.03] border border-gold-shimmer/10 rounded-2xl p-4 backdrop-blur-md hover:border-gold/30 hover:bg-gold-shimmer/[0.06] transition-all duration-300 hover:-translate-y-1">
            <div className="relative w-full h-40 rounded-xl overflow-hidden mb-3 bg-purple-deep border border-gold-shimmer/5">
                {primary ? (
                    <img
                        src={primary}
                        alt={`${candidate.first_name} ${candidate.last_name}`}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 group-hover:opacity-0">
                        <span className="font-display text-gold/30 text-3xl font-bold">
                            {candidate.first_name.charAt(0)}
                            {candidate.last_name.charAt(0)}
                        </span>
                    </div>
                )}
                {hover ? (
                    <img
                        src={hover}
                        alt={`${candidate.first_name} ${candidate.last_name}`}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gold/5">
                        <span className="label-caps text-gold/60 text-[9px] tracking-[0.2em]">View Profile</span>
                    </div>
                )}
                <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-purple-deep/70 backdrop-blur-md border border-gold/20 flex items-center justify-center">
                    <span className="text-cream-warm text-[10px] font-bold">
                        {candidate.candidate_number || index + 1}
                    </span>
                </div>
            </div>
            <h3 className="text-sm font-display font-bold text-cream-warm group-hover:text-gold transition-colors duration-300 leading-snug">
                {candidate.first_name} {candidate.last_name}
            </h3>
            {candidate.gender && (
                <p className="text-[11px] text-gold-shimmer/40 mt-0.5 capitalize font-medium">{candidate.gender}</p>
            )}
        </div>
    );
}

function CandidatesSection({ candidates, progress }: { candidates: Candidate[]; progress: number }) {
    const [expanded, setExpanded] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [maxHeight, setMaxHeight] = useState<string>("420px");

    useEffect(() => {
        if (!contentRef.current) return;
        setMaxHeight(expanded ? `${contentRef.current.scrollHeight}px` : "420px");
    }, [expanded, candidates]);

    return (
        <section
            className="snap-start snap-always relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden py-20 transition-[opacity,transform] duration-300 ease-out"
            style={{ opacity: progress, transform: `translateY(${(1 - progress) * 24}px)` }}
        >
            <DecorativeBackground />
            <div className="relative z-10 w-full max-w-5xl px-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <span className="label-caps text-gold text-xs tracking-[0.25em] block mb-1">Full Roster</span>
                        <h2 className="font-display text-cream-warm text-2xl md:text-3xl font-bold">
                            All Candidates{" "}
                            <span className="text-gold-shimmer/40 text-lg font-body font-normal">
                                ({candidates.length})
                            </span>
                        </h2>
                    </div>
                    {candidates.length > 0 && (
                        <button
                            onClick={() => setExpanded((v) => !v)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gold/30 text-gold label-caps text-[10px] tracking-[0.2em] hover:bg-gold/10 transition-all duration-300 flex-shrink-0"
                        >
                            {expanded ? "Collapse" : "Expand"}
                            <svg
                                className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                    )}
                </div>

                {candidates.length === 0 ? (
                    <div className="rounded-2xl border border-gold-shimmer/10 p-10 text-center bg-gold-shimmer/[0.02] backdrop-blur-md">
                        <p className="text-gold-shimmer/50 text-sm">No candidates assigned yet.</p>
                    </div>
                ) : (
                    <div className="relative">
                        <div
                            className="overflow-hidden transition-[max-height] duration-500 ease-out rounded-2xl border border-gold-shimmer/10 bg-gold-shimmer/[0.02] backdrop-blur-md"
                            style={{ maxHeight }}
                        >
                            <div ref={contentRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
                                {candidates.map((c, idx) => (
                                    <CandidateCard key={c.id} candidate={c} index={idx} />
                                ))}
                            </div>
                        </div>
                        {!expanded && (
                            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-purple-deep to-transparent rounded-b-2xl pointer-events-none" />
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

/* ────────────────────────────────────────────────────────────────
   Main Inner Component
   ──────────────────────────────────────────────────────────────── */
function PageantInfoInner() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [pageant, setPageant] = useState<PageantDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState<SectionId>("cover");
    const [progress, setProgress] = useState<Record<SectionId, number>>({
        cover: 1,
        profile: 0,
        podium: 0,
        candidates: 0,
    });
    const containerRef = useRef<HTMLDivElement>(null);
    const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
        cover: null,
        profile: null,
        podium: null,
        candidates: null,
    });

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`${API_BASE}/api/pageants/${id}`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                if (!cancelled) setPageant(data);
            } catch {
                // silently handle
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [id]);

    useEffect(() => {
        if (!containerRef.current) return;
        const fineThresholds = Array.from({ length: 21 }, (_, i) => i / 20); // 0, 0.05, ... 1

        const observer = new IntersectionObserver(
            (entries) => {
                setProgress((prev) => {
                    const next = { ...prev };
                    entries.forEach((entry) => {
                        const match = (Object.keys(sectionRefs.current) as SectionId[]).find(
                            (key) => sectionRefs.current[key] === entry.target
                        );
                        if (match) next[match] = entry.intersectionRatio;
                    });
                    return next;
                });

                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
                        const match = (Object.keys(sectionRefs.current) as SectionId[]).find(
                            (key) => sectionRefs.current[key] === entry.target
                        );
                        if (match) setActive(match);
                    }
                });
            },
            { root: containerRef.current, threshold: fineThresholds }
        );
        Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, [pageant]);

    const registerSection = (id: SectionId) => (el: HTMLElement | null) => {
        sectionRefs.current[id] = el;
    };

    const navigate = (s: SectionId) => {
        sectionRefs.current[s]?.scrollIntoView({ behavior: "smooth" });
    };

    if (loading) return <LoadingFallback />;
    if (!pageant) return <NotFound />;

    return (
        <div className="relative bg-purple-deep">
            <ScrollRail active={active} onNavigate={navigate} />

            <div
                ref={containerRef}
                className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth"
            >
                <div ref={registerSection("cover")}>
                    <CoverSection pageant={pageant} progress={progress.cover} />
                </div>
                <div ref={registerSection("profile")}>
                    <ProfileSection pageant={pageant} progress={progress.profile} onNavigate={navigate} />
                </div>
                <div ref={registerSection("podium")}>
                    <PodiumSection candidates={pageant.candidates} progress={progress.podium} />
                </div>
                <div ref={registerSection("candidates")}>
                    <CandidatesSection candidates={pageant.candidates} progress={progress.candidates} />

                    <footer className="relative z-10 pb-10 pt-6 border-t border-gold-shimmer/5">
                        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-[11px] text-gold-shimmer/30 label-caps tracking-[0.2em]">
                                © 2026 Crown &amp; Glory. All rights reserved.
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                                <span className="text-[11px] text-gold-shimmer/30 label-caps tracking-[0.15em]">
                                    Pageant Management System
                                </span>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────
   Export
   ──────────────────────────────────────────────────────────────── */
export default function PageantInfo() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <PageantInfoInner />
        </Suspense>
    );
}