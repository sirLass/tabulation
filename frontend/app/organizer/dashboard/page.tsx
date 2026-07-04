"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastProvider, useToast } from "./toast";

type Section = "overview" | "pageants" | "candidates" | "judges" | "analytics" | "settings";

interface User {
    name: string;
    email: string;
    organization_name: string;
}

interface Candidate {
    id: number;
    first_name: string;
    last_name: string;
    email: string | null;
    gender: string;
    votes: number;
}

const navItems: { key: Section; label: string; icon: string }[] = [
    { key: "overview",   label: "Overview",    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { key: "pageants",   label: "Pageants",    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
    { key: "candidates", label: "Candidates",  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { key: "judges",    label: "Judges",      icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" },
    { key: "analytics", label: "Analytics & Reports", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
];

const sectionTitles: Record<Section, { title: string; subtitle: string }> = {
    overview:   { title: "Overview",    subtitle: "Here's what's happening with your account." },
    pageants:   { title: "Pageants",    subtitle: "Create and manage your pageant events." },
    candidates: { title: "Candidates",  subtitle: "Add and manage candidates for your pageants." },
    judges:     { title: "Judges",      subtitle: "Manage judges assigned to your pageants." },
    analytics:  { title: "Analytics & Reports", subtitle: "View insights, rankings, and reports for your pageants." },
    settings:   { title: "Settings",    subtitle: "Manage your organization profile and account." },
};

function SvgIcon({ d, className = "w-4 h-4" }: { d: string; className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={d} />
        </svg>
    );
}

function OrganizerDashboardInner() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [activeSection, setActiveSection] = useState<Section>("overview");
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/organizer/auth-organizer"); return; }
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/organizer/auth-organizer");
    };

    if (!user) return null;

    const { title, subtitle } = sectionTitles[activeSection];

    return (
        <div className="min-h-screen bg-[#0d0b14] text-cream-warm flex">
            {/* ── Sidebar ── */}
            <aside className="w-60 flex flex-col h-screen sticky top-0 border-r border-white/[0.06]" style={{ background: '#100e1a' }}>
                {/* Brand */}
                <div className="px-6 py-5 border-b border-white/[0.06]">
                    <h1 className="font-display text-base font-extrabold text-gold leading-tight tracking-wide">
                        CROWN &amp; GLORY
                    </h1>
                    <p className="text-[9px] text-cream-warm/30 uppercase tracking-[0.2em] mt-0.5">Organizer Panel</p>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const active = activeSection === item.key;
                        return (
                            <button
                                key={item.key}
                                onClick={() => setActiveSection(item.key)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-body transition-all duration-200 rounded-md ${
                                    active
                                        ? "bg-gold/10 text-gold border border-gold/20"
                                        : "text-cream-warm/40 hover:text-cream-warm/80 hover:bg-white/[0.04]"
                                }`}
                            >
                                <SvgIcon d={item.icon} className={`w-4 h-4 flex-shrink-0 ${active ? "text-gold" : "text-cream-warm/30"}`} />
                                <span className="font-medium text-[13px]">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Profile Hub */}
                <div className="mt-auto border-t border-white/[0.06]">
                    <div className="px-4 pt-4 pb-1">
                        <p className="text-[9px] text-cream-warm/25 uppercase tracking-[0.2em] px-2 mb-2 font-semibold">Profile Hub</p>
                        <button onClick={() => setActiveSection("settings")} className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-cream-warm/40 hover:text-cream-warm/80 hover:bg-white/[0.04] transition rounded-md">
                            <SvgIcon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            Settings
                        </button>
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-red-400/50 hover:text-red-400 hover:bg-red-500/[0.06] transition rounded-md"
                        >
                            <SvgIcon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            Logout
                        </button>
                    </div>

                    {/* User chip */}
                    <div className="flex items-center gap-2.5 px-4 py-3 border-t border-white/[0.06] mt-2">
                        <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-gold">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-medium truncate text-cream-warm/90">{user.name}</p>
                            <p className="text-[11px] text-cream-warm/30 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── Main ── */}
            <main className="flex-1 min-w-0 flex flex-col">
                {/* Top bar */}
                <div className="flex items-center justify-between border-b border-white/[0.06] px-8 py-5" style={{ background: '#0d0b14' }}>
                    <div>
                        <h2 className="font-display text-2xl font-bold text-cream-warm">{title}</h2>
                        <p className="text-sm text-cream-warm/40 mt-0.5">{subtitle}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.08] text-cream-warm/40 hover:text-cream-warm hover:border-white/20 transition">
                            <SvgIcon d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.08] text-cream-warm/40 hover:text-cream-warm hover:border-white/20 transition">
                            <SvgIcon d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 overflow-y-auto">
                    {activeSection === "overview"   && <OverviewSection user={user} />}
                    {activeSection === "pageants"   && <PageantsSection user={user} />}
                    {activeSection === "candidates" && <CandidatesSection />}
                    {activeSection === "judges" && <JudgesSection />}
                    {activeSection === "analytics" && <AnalyticsSection />}
                    {activeSection === "settings" && <SettingsSection user={user} />}
                </div>
            </main>

            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="border border-white/[0.08] rounded-xl p-8 max-w-sm w-full shadow-2xl" style={{ background: '#100e1a' }}>
                        <h3 className="font-display text-xl font-bold text-cream-warm">Confirm Logout</h3>
                        <p className="text-sm text-cream-warm/50 mt-2">Are you sure you want to sign out?</p>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowLogoutModal(false)}
                                className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border border-white/[0.1] text-cream-warm/50 rounded-md hover:bg-white/5 transition">
                                Cancel
                            </button>
                            <button onClick={handleLogout}
                                className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-red-500/20 border border-red-500/40 text-red-400 rounded-md hover:bg-red-500/30 transition">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function OrganizerDashboard() {
    return (
        <ToastProvider>
            <OrganizerDashboardInner />
        </ToastProvider>
    );
}

/* ─────────────────────────────── Overview ─────────────────────────────── */

function StatBadge({ status }: { status: "stable" | "awaiting" | "pending" }) {
    const map = {
        stable:   { label: "Stable",   color: "text-emerald-400", dot: "bg-emerald-400", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
        awaiting: { label: "Awaiting", color: "text-cream-warm/30", dot: "bg-cream-warm/30", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
        pending:  { label: "Pending",  color: "text-amber-400", dot: "bg-amber-400", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    };
    const { label, color, dot, icon } = map[status];
    return (
        <span className={`flex items-center gap-1.5 text-[10px] font-semibold tracking-wider ${color}`}>
            <SvgIcon d={icon} className="w-3 h-3" />
            {label}
        </span>
    );
}

function OverviewSection({ user }: { user: User }) {
    const stats = [
        {
            label: "Active Pageants", value: "0",
            status: "stable" as const,
            icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
            subtext: "No active campaigns detected",
        },
        {
            label: "Total Candidates", value: "0",
            status: "awaiting" as const,
            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
            subtext: "Registration phase not started",
        },

    ];

    return (
        <div className="max-w-5xl space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4">
                {stats.map((s) => (
                    <div key={s.label} className="rounded-xl p-5 border border-white/[0.06]" style={{ background: '#13111f' }}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                                <SvgIcon d={s.icon} className="w-4 h-4 text-gold" />
                            </div>
                            <StatBadge status={s.status} />
                        </div>
                        <p className="font-display text-4xl font-bold text-cream-warm leading-none mb-1">{s.value}</p>
                        <p className="text-[11px] text-cream-warm/40 font-medium mt-2">{s.label}</p>
                        <p className="text-[10px] text-cream-warm/20 mt-1.5">{s.subtext}</p>
                    </div>
                ))}
                <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: '#13111f' }}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                            <SvgIcon d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" className="w-4 h-4 text-gold" />
                        </div>
                        <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-gold">
                            Leading
                        </span>
                    </div>
                    <p className="font-display text-lg font-bold text-gold leading-none mb-1">Candidate 04</p>
                    <p className="text-[11px] text-cream-warm/40 font-medium mt-2">Current Leader</p>
                    <p className="text-[10px] text-cream-warm/20 mt-1.5">Avg 92.0 pts</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-white/[0.06]" style={{ background: '#13111f' }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                    <h3 className="font-display text-base font-bold text-cream-warm">Recent Activity</h3>
                    <button className="text-[11px] text-gold/70 hover:text-gold transition font-semibold uppercase tracking-wider">View All</button>
                </div>
                <div className="px-6 py-8 text-center">
                    <p className="text-sm text-cream-warm/25">No recent activity to display.</p>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────── Pageants ─────────────────────────────── */

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
    created_at: string;
    status: string;
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Scheduled: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25",
        Ongoing: "text-blue-400 bg-blue-400/10 border-blue-400/25",
        Hold: "text-amber-400 bg-amber-400/10 border-amber-400/25",
        Terminated: "text-red-400 bg-red-400/10 border-red-400/25",
    };
    const s = styles[status] || "text-cream-warm/40 bg-white/[0.03] border-white/[0.1]";
    return (
        <span className={`inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider border rounded-md ${s}`}>
            {status}
        </span>
    );
}

function PageantsSection({ user }: { user: User }) {
    const { toast } = useToast();
    const [pageants, setPageants] = useState<Pageant[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: "", country: "", province: "", city: "", barangay: "", zip: "", date: "", status: "Ongoing" });
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [viewing, setViewing] = useState<Pageant | null>(null);
    const [editingPageant, setEditingPageant] = useState<Pageant | null>(null);
    const [editForm, setEditForm] = useState({ name: "", country: "", province: "", city: "", barangay: "", zip: "", date: "", status: "Ongoing" });

    const fetchPageants = async (p = 1) => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8000/api/pageants?page=${p}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setPageants(data.data);
                setPage(data.current_page);
                setLastPage(data.last_page);
            }
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    useEffect(() => { fetchPageants(); }, []);

    const daysLeft = form.date
        ? Math.max(0, Math.ceil((new Date(form.date).getTime() - Date.now()) / 86400000))
        : null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleCreate = async () => {
        setSubmitting(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/pageants", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });
            if (!res.ok) { const d = await res.json(); throw new Error(d.message || "Failed"); }
            setShowModal(false);
            setForm({ name: "", country: "", province: "", city: "", barangay: "", zip: "", date: "", status: "Ongoing" });
            toast("Pageant created successfully!");
            await fetchPageants();
        } catch (err: unknown) {
            toast(err instanceof Error ? err.message : "Something went wrong", "error");
        } finally { setSubmitting(false); }
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <>
            <div className="max-w-5xl space-y-5">
                <div className="flex items-center justify-end">
                    <button onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-gold text-[#0d0b14] rounded-md hover:bg-gold/90 transition">
                        <SvgIcon d="M12 4v16m8-8H4" className="w-3.5 h-3.5" /> New Pageant
                    </button>
                </div>

                {loading || pageants.length > 0 ? (
                    <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ background: '#13111f' }}>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/[0.06] text-left text-cream-warm/30 text-[10px] uppercase tracking-wider">
                                    <th className="px-5 py-3 font-semibold">Name</th>
                                    <th className="px-5 py-3 font-semibold">Location</th>
                                    <th className="px-5 py-3 font-semibold">Date</th>
                                    <th className="px-5 py-3 font-semibold">Days Left</th>
                                    <th className="px-5 py-3 font-semibold">Status</th>
                                    <th className="px-5 py-3 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {loading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-3/4" /></td>
                                            <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-1/2" /></td>
                                            <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-1/3" /></td>
                                            <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-12" /></td>
                                            <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-20" /></td>
                                            <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-16 ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : (
                                    pageants.map((p) => {
                                        const days = Math.max(0, Math.ceil((new Date(p.date).getTime() - Date.now()) / 86400000));
                                        return (
                                            <tr key={p.id} className="hover:bg-white/[0.02] transition">
                                                <td className="px-5 py-3.5 text-cream-warm font-medium">{p.name}</td>
                                                <td className="px-5 py-3.5 text-cream-warm/50">{p.city}, {p.province}</td>
                                                <td className="px-5 py-3.5 text-cream-warm/50">
                                                    {new Date(p.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="text-gold text-xs font-semibold">
                                                        {days === 0 ? "Today!" : `${days}d`}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <StatusBadge status={p.status} />
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button onClick={() => { setEditingPageant(p); setEditForm({ name: p.name, country: p.country, province: p.province, city: p.city, barangay: p.barangay, zip: p.zip, date: p.date, status: p.status }); }}
                                                            className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-gold/25 text-gold rounded-md hover:bg-gold/10 transition">
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button onClick={() => setViewing(p)}
                                                            className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-gold/25 text-gold rounded-md hover:bg-gold/10 transition">
                                                            View
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                        {!loading && lastPage > 1 && (
                            <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-white/[0.06]">
                                <button onClick={() => fetchPageants(page - 1)} disabled={page <= 1}
                                    className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider border border-white/[0.1] text-cream-warm/40 rounded-md hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition">
                                    Prev
                                </button>
                                {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                                    <button key={p} onClick={() => fetchPageants(p)}
                                        className={`w-8 h-8 text-xs font-semibold rounded-md transition ${p === page ? "bg-gold text-[#0d0b14]" : "text-cream-warm/40 hover:bg-white/5"}`}>
                                        {p}
                                    </button>
                                ))}
                                <button onClick={() => fetchPageants(page + 1)} disabled={page >= lastPage}
                                    className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider border border-white/[0.1] text-cream-warm/40 rounded-md hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition">
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="rounded-xl border border-white/[0.06] p-10 text-center" style={{ background: '#13111f' }}>
                        <SvgIcon d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" className="w-8 h-8 text-cream-warm/10 mx-auto mb-3" />
                        <p className="text-sm text-cream-warm/30">No pageants yet. Create your first one to get started.</p>
                    </div>
                )}
            </div>

            {/* New Pageant Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="border border-white/[0.08] rounded-xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" style={{ background: '#100e1a' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display text-xl font-bold text-cream-warm">New Pageant</h3>
                            <button onClick={() => setShowModal(false)} className="text-cream-warm/30 hover:text-cream-warm text-lg transition">✕</button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} className="space-y-5">
                            <div>
                                <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Pageant Name</label>
                                <input name="name" value={form.name} onChange={handleChange} placeholder="Miss Universe 2026"
                                    className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm placeholder-cream-warm/20" required />
                            </div>
                            <div>
                                <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Organization</label>
                                <input value={user.organization_name}
                                    className="w-full bg-white/[0.02] border border-white/[0.05] text-cream-warm/40 px-4 py-2.5 rounded-md text-sm cursor-not-allowed" disabled />
                            </div>
                            <fieldset className="space-y-3">
                                <legend className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 mb-1.5 font-semibold">Location</legend>
                                <input name="country" value={form.country} onChange={handleChange} placeholder="Country"
                                    className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm placeholder-cream-warm/20" required />
                                <div className="grid grid-cols-2 gap-3">
                                    {["province", "city", "barangay", "zip"].map((field) => (
                                        <input key={field} name={field} value={(form as Record<string, string>)[field]}
                                            onChange={handleChange} placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                            className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm placeholder-cream-warm/20" required />
                                    ))}
                                </div>
                            </fieldset>
                            <div>
                                <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Status</label>
                                <select name="status" value={form.status} onChange={handleChange}
                                    className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm">
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Hold">Hold</option>
                                    <option value="Terminated">Terminated</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Pageant Date</label>
                                <input name="date" type="date" value={form.date} onChange={handleChange} min={today}
                                    className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm" required />
                                {daysLeft !== null && (
                                    <p className="text-xs text-gold/50 mt-1.5">{daysLeft === 0 ? "Today!" : `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`}</p>
                                )}
                            </div>
                            <button type="submit" disabled={submitting}
                                className="w-full mt-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider bg-gold text-[#0d0b14] rounded-md hover:bg-gold/90 transition disabled:opacity-50">
                                {submitting ? "Creating..." : "Create Pageant"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {viewing && <ViewPageantModal pageant={viewing} onClose={() => setViewing(null)} />}
            {editingPageant && <EditPageantModal pageant={editingPageant} onClose={() => setEditingPageant(null)} onSave={(updated) => { setPageants((prev) => prev.map((p) => p.id === updated.id ? updated : p)); setEditingPageant(null); }} />}
        </>
    );
}

/* ─────────────────────────────── View Pageant Modal ─────────────────────── */

/* ─────────────────────────────── Edit Pageant Modal ──────────────────── */

function EditPageantModal({ pageant, onClose, onSave }: { pageant: Pageant; onClose: () => void; onSave: (updated: Pageant) => void }) {
    const { toast } = useToast();
    const [form, setForm] = useState({ name: pageant.name, country: pageant.country, province: pageant.province, city: pageant.city, barangay: pageant.barangay, zip: pageant.zip, date: pageant.date, status: pageant.status });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8000/api/pageants/${pageant.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Failed to update pageant");
            const updated = await res.json();
            onSave(updated);
            toast("Pageant updated successfully!");
        } catch {
            toast("Failed to update pageant", "error");
        } finally { setSubmitting(false); }
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="border border-white/[0.08] rounded-xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" style={{ background: '#100e1a' }}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-xl font-bold text-cream-warm">Edit Pageant</h3>
                    <button onClick={onClose} className="text-cream-warm/30 hover:text-cream-warm text-lg transition">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Pageant Name</label>
                        <input name="name" value={form.name} onChange={handleChange}
                            className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm" required />
                    </div>
                    <fieldset className="space-y-3">
                        <legend className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 mb-1.5 font-semibold">Location</legend>
                        <input name="country" value={form.country} onChange={handleChange} placeholder="Country"
                            className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm" required />
                        <div className="grid grid-cols-2 gap-3">
                            {["province", "city", "barangay", "zip"].map((field) => (
                                <input key={field} name={field} value={(form as Record<string, string>)[field]}
                                    onChange={handleChange} placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm" required />
                            ))}
                        </div>
                    </fieldset>
                    <div>
                        <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Status</label>
                        <select name="status" value={form.status} onChange={handleChange}
                            className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm">
                            <option value="Scheduled">Scheduled</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Hold">Hold</option>
                            <option value="Terminated">Terminated</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Pageant Date</label>
                        <input name="date" type="date" value={form.date} onChange={handleChange}
                            className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm" required />
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose}
                            className="flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider border border-white/[0.1] text-cream-warm/40 rounded-md hover:bg-white/5 transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting}
                            className="flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider bg-gold text-[#0d0b14] rounded-md hover:bg-gold/90 transition disabled:opacity-50">
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ViewPageantModal({ pageant, onClose }: { pageant: Pageant; onClose: () => void }) {
    const { toast } = useToast();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
    const [showPicker, setShowPicker] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        try {
            const [assignedRes, allRes] = await Promise.all([
                fetch(`http://localhost:8000/api/pageants/${pageant.id}/candidates`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`http://localhost:8000/api/candidates`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            if (assignedRes.ok) setCandidates(await assignedRes.json());
            if (allRes.ok) setAllCandidates(await allRes.json());
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const attachCandidate = async (candidateId: number) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8000/api/pageants/${pageant.id}/candidates`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ candidate_id: candidateId }),
        });
        if (res.ok) { toast("Candidate added to pageant"); setShowPicker(false); await fetchData(); }
        else toast("Failed to add candidate", "error");
    };

    const unassignedCandidates = allCandidates.filter((ac) => !candidates.some((c) => c.id === ac.id));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="border border-white/[0.08] rounded-xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" style={{ background: '#100e1a' }}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-xl font-bold text-cream-warm">{pageant.name}</h3>
                    <button onClick={onClose} className="text-cream-warm/30 hover:text-cream-warm text-lg transition">✕</button>
                </div>
                <div className="space-y-5 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/30 mb-0.5 font-semibold">Organization</p>
                            <p className="text-cream-warm/80">{pageant.organization_name}</p>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/30 mb-0.5 font-semibold">Date</p>
                            <p className="text-cream-warm/80">{new Date(pageant.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/30 mb-0.5 font-semibold">Location</p>
                        <p className="text-cream-warm/80">{pageant.barangay}, {pageant.city}, {pageant.province}, {pageant.country} {pageant.zip}</p>
                    </div>
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/30 mb-0.5 font-semibold">Days Until Event</p>
                        <p className="text-gold font-semibold">
                            {(() => { const d = Math.max(0, Math.ceil((new Date(pageant.date).getTime() - Date.now()) / 86400000)); return d === 0 ? "Today!" : `${d} day${d > 1 ? "s" : ""} left`; })()}
                        </p>
                    </div>
                    <div className="pt-4 border-t border-white/[0.06]">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/30 font-semibold">Candidates</p>
                            <button onClick={() => setShowPicker(true)} className="text-[10px] font-semibold uppercase tracking-wider text-gold hover:text-gold/80 transition">+ Add</button>
                        </div>
                        {loading ? (
                            <div className="space-y-2">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-6 bg-white/10 rounded animate-pulse" />)}</div>
                        ) : candidates.length === 0 ? (
                            <p className="text-xs text-cream-warm/25">No candidates assigned.</p>
                        ) : (
                            <ul className="space-y-1.5">
                                {candidates.map((c) => (
                                    <li key={c.id} className="text-sm text-cream-warm/80">{c.first_name} {c.last_name}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="flex gap-3 mt-8">
                    <button onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border border-red-500/30 bg-red-500/[0.08] text-red-400 rounded-md hover:bg-red-500/20 transition">
                        Terminate
                    </button>
                    <button onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border border-white/[0.1] text-cream-warm/50 rounded-md hover:bg-white/5 transition">
                        Close
                    </button>
                </div>
            </div>
            {showPicker && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowPicker(false)}>
                    <div className="border border-white/[0.08] rounded-xl p-6 max-w-sm w-full shadow-2xl" style={{ background: '#100e1a' }} onClick={(e) => e.stopPropagation()}>
                        <h4 className="font-display text-base font-bold text-cream-warm mb-4">Select Candidate</h4>
                        {unassignedCandidates.length === 0 ? (
                            <p className="text-sm text-cream-warm/30">All candidates are already assigned.</p>
                        ) : (
                            <div className="space-y-1 max-h-60 overflow-y-auto">
                                {unassignedCandidates.map((c) => (
                                    <button key={c.id} onClick={() => attachCandidate(c.id)}
                                        className="w-full text-left px-4 py-2.5 rounded-md text-sm text-cream-warm/80 hover:bg-white/5 transition">
                                        {c.first_name} {c.last_name}
                                    </button>
                                ))}
                            </div>
                        )}
                        <button onClick={() => setShowPicker(false)}
                            className="w-full mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-white/[0.1] text-cream-warm/40 rounded-md hover:bg-white/5 transition">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────── Candidates ─────────────────────────────── */

function CandidatesSection() {
    const { toast } = useToast();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ first_name: "", last_name: "" });
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchCandidates = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/candidates", { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) setCandidates(await res.json());
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    useEffect(() => { fetchCandidates(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/candidates", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Failed to create candidate");
            setShowModal(false);
            setForm({ first_name: "", last_name: "" });
            toast("Candidate added!");
            await fetchCandidates();
        } catch { toast("Failed to create candidate", "error"); } finally { setSubmitting(false); }
    };

    return (
        <>
            <div className="max-w-5xl space-y-5">
                <div className="flex items-center justify-end">
                    <button onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-gold text-[#0d0b14] rounded-md hover:bg-gold/90 transition">
                        <SvgIcon d="M12 4v16m8-8H4" className="w-3.5 h-3.5" /> Add Candidate
                    </button>
                </div>
                <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ background: '#13111f' }}>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.06] text-left text-cream-warm/30 text-[10px] uppercase tracking-wider">
                                <th className="px-5 py-3 font-semibold">Name</th>
                                <th className="px-5 py-3 font-semibold">Gender</th>
                                <th className="px-5 py-3 font-semibold">Votes</th>
                                <th className="px-5 py-3 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-1/3" /></td>
                                        <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-16" /></td>
                                        <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-12" /></td>
                                        <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-16 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : candidates.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-5 py-10 text-center">
                                        <SvgIcon d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" className="w-8 h-8 text-cream-warm/10 mx-auto mb-3" />
                                        <p className="text-sm text-cream-warm/30">No candidates registered yet.</p>
                                    </td>
                                </tr>
                            ) : (
                                candidates.map((c) => (
                                    <tr key={c.id} className="hover:bg-white/[0.02] transition">
                                        <td className="px-5 py-3.5 text-cream-warm font-medium">{c.first_name} {c.last_name}</td>
                                        <td className="px-5 py-3.5 text-cream-warm/50">{c.gender}</td>
                                        <td className="px-5 py-3.5 text-cream-warm/50">{c.votes}</td>
                                        <td className="px-5 py-3.5 text-right">
                                            <button className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-gold/25 text-gold rounded-md hover:bg-gold/10 transition">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="border border-white/[0.08] rounded-xl p-8 max-w-md w-full shadow-2xl" style={{ background: '#100e1a' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display text-xl font-bold text-cream-warm">Add Candidate</h3>
                            <button onClick={() => setShowModal(false)} className="text-cream-warm/30 hover:text-cream-warm text-lg transition">✕</button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">First Name</label>
                                    <input name="first_name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                                        className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm" required />
                                </div>
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Last Name</label>
                                    <input name="last_name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                                        className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm" required />
                                </div>
                            </div>
                            <button type="submit" disabled={submitting}
                                className="w-full mt-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider bg-gold text-[#0d0b14] rounded-md hover:bg-gold/90 transition disabled:opacity-50">
                                {submitting ? "Adding..." : "Add Candidate"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

/* ─────────────────────────────── Judges ─────────────────────────────── */

function JudgesSection() {
    const [showModal, setShowModal] = useState(false);
    const [judgeName, setJudgeName] = useState("");

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!judgeName.trim()) return;
        setJudgeName("");
        setShowModal(false);
    };

    return (
        <div className="max-w-5xl space-y-5">
            <div className="flex items-center justify-end">
                <button onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-gold text-[#0d0b14] rounded-md hover:bg-gold/90 transition">
                    <SvgIcon d="M12 4v16m8-8H4" className="w-3.5 h-3.5" /> Add Judge
                </button>
            </div>
            <div className="rounded-xl border border-white/[0.06] p-10 text-center" style={{ background: '#13111f' }}>
                <svg className="w-8 h-8 text-cream-warm/10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <p className="text-sm text-cream-warm/30">No judges added yet.</p>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="border border-white/[0.08] rounded-xl p-8 max-w-md w-full shadow-2xl" style={{ background: '#100e1a' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display text-xl font-bold text-cream-warm">Add Judge</h3>
                            <button onClick={() => setShowModal(false)} className="text-cream-warm/30 hover:text-cream-warm text-lg transition">✕</button>
                        </div>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Judge Name</label>
                                <input value={judgeName} onChange={(e) => setJudgeName(e.target.value)} placeholder="e.g. John Doe"
                                    className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm placeholder-cream-warm/20" required />
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider border border-white/[0.1] text-cream-warm/40 rounded-md hover:bg-white/5 transition">
                                    Cancel
                                </button>
                                <button type="submit"
                                    className="flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider bg-gold text-[#0d0b14] rounded-md hover:bg-gold/90 transition">
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────── Analytics & Reports ─────────────────── */

function AnalyticsSection() {
    return (
        <div className="max-w-5xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: '#13111f' }}>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/30 mb-1.5 font-semibold">Total Pageants</p>
                    <p className="font-display text-3xl font-bold text-cream-warm">0</p>
                </div>
                <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: '#13111f' }}>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/30 mb-1.5 font-semibold">Total Candidates</p>
                    <p className="font-display text-3xl font-bold text-cream-warm">0</p>
                </div>
                <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: '#13111f' }}>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/30 mb-1.5 font-semibold">Total Judges</p>
                    <p className="font-display text-3xl font-bold text-cream-warm">0</p>
                </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] p-10 text-center" style={{ background: '#13111f' }}>
                <svg className="w-8 h-8 text-cream-warm/10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm text-cream-warm/30">Analytics and detailed reports coming soon.</p>
            </div>
        </div>
    );
}

/* ─────────────────────────────── Settings ─────────────────────────────── */

function SettingsSection({ user }: { user: User }) {
    return (
        <div className="max-w-3xl space-y-6">
            {/* Organization card */}
            <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ background: '#13111f' }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                    <div>
                        <div className="flex items-center gap-2">
                            <SvgIcon d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" className="w-4 h-4 text-gold/60" />
                            <h3 className="font-display text-base font-bold text-cream-warm">Organization</h3>
                        </div>
                        <p className="text-[10px] text-cream-warm/25 uppercase tracking-widest mt-0.5">Primary Administrative Profile</p>
                    </div>
                    <button className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-gold text-[#0d0b14] rounded-md hover:bg-gold/90 transition">
                        Edit Profile
                    </button>
                </div>

                <div className="flex gap-6 p-6">
                    {/* Fields */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/30 mb-1.5 font-semibold">Name</p>
                            <div className="flex items-center gap-2 bg-[#0d0b14] border border-white/[0.06] rounded-md px-4 py-2.5">
                                <span className="text-sm text-cream-warm font-medium">{user.organization_name}</span>
                                <span className="ml-auto">
                                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/30 mb-1.5 font-semibold">Email Address</p>
                            <div className="flex items-center gap-2 bg-[#0d0b14] border border-white/[0.06] rounded-md px-4 py-2.5">
                                <span className="text-sm text-cream-warm/80">{user.email}</span>
                                <button className="ml-auto text-cream-warm/25 hover:text-cream-warm/60 transition">
                                    <SvgIcon d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 pt-1">
                            <button className="flex items-center gap-1.5 text-[11px] text-cream-warm/35 hover:text-cream-warm/60 transition">
                                <SvgIcon d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-3.5 h-3.5" />
                                Audit Logs
                            </button>
                            <button className="flex items-center gap-1.5 text-[11px] text-cream-warm/35 hover:text-cream-warm/60 transition">
                                <SvgIcon d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" className="w-3.5 h-3.5" />
                                Privacy Settings
                            </button>
                        </div>
                    </div>

                    {/* Org avatar / verified */}
                    <div className="flex flex-col items-center gap-2 w-28">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                                <SvgIcon d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" className="w-8 h-8 text-gold" />
                            </div>
                            <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                                <SvgIcon d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" className="w-3 h-3 text-[#0d0b14]" />
                            </button>
                        </div>
                        <p className="text-[9px] text-cream-warm/25 text-center leading-tight">
                            Organization verified since June 2024. Your profile is public to candidates.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

