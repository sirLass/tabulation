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
    candidate_number: string;
    first_name: string;
    last_name: string;
    email: string | null;
    gender: string;
    votes: number;
    primary_image: string | null;
    hover_image: string | null;
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
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
            <aside className={`${sidebarCollapsed ? "w-16" : "w-60"} flex flex-col h-screen sticky top-0 border-r border-white/[0.06] transition-all duration-300`} style={{ background: '#100e1a' }}>
                {/* Brand */}
                <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
                    {!sidebarCollapsed && (
                        <div>
                            <h1 className="font-display text-base font-extrabold text-gold leading-tight tracking-wide">CROWN &amp; GLORY</h1>
                            <p className="text-[9px] text-cream-warm/30 uppercase tracking-[0.2em] mt-0.5">Organizer Panel</p>
                        </div>
                    )}
                    <button onClick={() => setSidebarCollapsed((prev) => !prev)}
                        className="text-cream-warm/30 hover:text-cream-warm transition flex-shrink-0">
                        <svg className={`w-5 h-5 transition-transform duration-300 ${sidebarCollapsed ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const active = activeSection === item.key;
                        return (
                            <button
                                key={item.key}
                                onClick={() => setActiveSection(item.key)}
                                className={`w-full flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"} px-3 py-2.5 text-sm font-body transition-all duration-200 rounded-md ${
                                    active
                                        ? "bg-gold/10 text-gold border border-gold/20"
                                        : "text-cream-warm/40 hover:text-cream-warm/80 hover:bg-white/[0.04]"
                                }`}
                            >
                                <SvgIcon d={item.icon} className={`w-4 h-4 flex-shrink-0 ${active ? "text-gold" : "text-cream-warm/30"}`} />
                                {!sidebarCollapsed && <span className="font-medium text-[13px]">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                {/* Profile Hub */}
                {!sidebarCollapsed && (
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
                )}
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
    const [pageantCount, setPageantCount] = useState(0);
    const [candidateCount, setCandidateCount] = useState(0);
    const [leadingCandidate, setLeadingCandidate] = useState<{ name: string; avg: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`http://localhost:8000/api/pageants?page=1&per_page=1`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => { if (data) setPageantCount(data.total ?? 0); })
            .catch(() => {});

        fetch(`http://localhost:8000/api/candidates?page=1&per_page=1`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => { if (data) { setCandidateCount(data.total ?? 0); } })
            .catch(() => {});
    }, []);

    const pageantSubtext = pageantCount > 0
        ? `${pageantCount} pageant${pageantCount > 1 ? "s" : ""} active`
        : "No active campaigns detected";

    const candidateSubtext = candidateCount > 0
        ? `${candidateCount} candidate${candidateCount > 1 ? "s" : ""} registered`
        : "Registration phase not started";

    const stats = [
        {
            label: "Active Pageants", value: String(pageantCount),
            status: (pageantCount > 0 ? "stable" : "awaiting") as "stable" | "awaiting",
            icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
            subtext: pageantSubtext,
        },
        {
            label: "Total Candidates", value: String(candidateCount),
            status: (candidateCount > 0 ? "stable" : "awaiting") as "stable" | "awaiting",
            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
            subtext: candidateSubtext,
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
                    <p className="font-display text-lg font-bold text-gold leading-none mb-1">{leadingCandidate?.name ?? "—"}</p>
                    <p className="text-[11px] text-cream-warm/40 font-medium mt-2">Current Leader</p>
                    <p className="text-[10px] text-cream-warm/20 mt-1.5">{leadingCandidate ? `Avg ${leadingCandidate.avg} pts` : "No scores yet"}</p>
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

interface Criterion {
    id: number;
    pageant_id: number;
    name: string;
    percentage: number;
}

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
    const [filterStatus, setFilterStatus] = useState("");
    const [filterMonth, setFilterMonth] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const filteredPageants = pageants
        .filter((p) => !filterStatus || p.status === filterStatus)
        .filter((p) => {
            if (!filterMonth) return true;
            const monthIndex = new Date(p.date).getMonth();
            return monthNames[monthIndex] === filterMonth;
        })
        .filter((p) => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.province.toLowerCase().includes(q);
        })
        .sort((a, b) => {
            if (sortOrder === "az") return a.name.localeCompare(b.name);
            if (sortOrder === "za") return b.name.localeCompare(a.name);
            return 0;
        });

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
                <div className="flex items-center justify-end gap-3">
                    <button onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-gold text-[#0d0b14] rounded-md hover:bg-gold/90 transition">
                        <SvgIcon d="M12 4v16m8-8H4" className="w-3.5 h-3.5" /> New Pageant
                    </button>
                    <button onClick={() => {}}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-gold/30 text-gold rounded-md hover:bg-gold/10 transition">
                        <SvgIcon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" className="w-3.5 h-3.5" /> Score Sheet
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search pageants..."
                        className="bg-[#0d0b14] border border-white/[0.08] text-cream-warm/70 px-3 py-2 rounded-md text-xs focus:outline-none focus:border-gold/50 flex-1 max-w-lg placeholder:text-cream-warm/20" />
                    <div className="flex items-center gap-3">
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-[#0d0b14] border border-white/[0.08] text-cream-warm/70 px-3 py-2 rounded-md text-xs focus:outline-none focus:border-gold/50">
                            <option value="">All Status</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Hold">Hold</option>
                            <option value="Terminated">Terminated</option>
                        </select>
                        <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}
                            className="bg-[#0d0b14] border border-white/[0.08] text-cream-warm/70 px-3 py-2 rounded-md text-xs focus:outline-none focus:border-gold/50">
                            <option value="">All Months</option>
                            {monthNames.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                            className="bg-[#0d0b14] border border-white/[0.08] text-cream-warm/70 px-3 py-2 rounded-md text-xs focus:outline-none focus:border-gold/50">
                            <option value="">Sort</option>
                            <option value="az">A-Z</option>
                            <option value="za">Z-A</option>
                        </select>
                    </div>
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
                                ) : filteredPageants.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-10 text-center text-cream-warm/25 text-sm">No pageants match the selected filters.</td>
                                    </tr>
                                ) : (
                                    filteredPageants.map((p) => {
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

            {viewing && <ViewPageantModal pageant={viewing} onClose={() => setViewing(null)} onUpdate={(updated) => { setPageants((prev) => prev.map((p) => p.id === updated.id ? updated : p)); }} />}
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
        <div className="fixed inset-0 z-50 bg-[#0d0b14] overflow-y-auto">
            <div className="min-h-screen w-full p-6 md:p-10">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-cream-warm/40 hover:text-cream-warm text-2xl transition">✕</button>
                </div>
            </div>
        </div>
    );
}

function ViewPageantModal({ pageant, onClose, onUpdate }: { pageant: Pageant; onClose: () => void; onUpdate?: (updated: Pageant) => void }) {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<"details" | "score" | "criteria" | "segment">("details");
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: pageant.name, country: pageant.country, province: pageant.province, city: pageant.city, barangay: pageant.barangay, zip: pageant.zip, date: pageant.date, status: pageant.status });
    const [saving, setSaving] = useState(false);
    const [exiting, setExiting] = useState(false);
    const [candidateCount, setCandidateCount] = useState<number | null>(null);

    const handleClose = () => {
        setExiting(true);
        setTimeout(() => onClose(), 350);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:8000/api/pageants/${pageant.id}/candidates`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.ok ? res.json() : [])
            .then((data) => setCandidateCount(Array.isArray(data) ? data.length : 0))
            .catch(() => {});
    }, []);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8000/api/pageants/${pageant.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(editForm),
            });
            if (!res.ok) throw new Error("Failed to update pageant");
            const updated = await res.json();
            onUpdate?.(updated);
            toast("Pageant updated");
            setEditing(false);
        } catch {
            toast("Failed to update pageant", "error");
        } finally { setSaving(false); }
    };

    const tabs = [
        { key: "details" as const, label: "Pageant Details" },
        { key: "criteria" as const, label: "Criteria" },
        { key: "segment" as const, label: "Segment" },
        { key: "score" as const, label: "Score" },
    ];

    return (
        <div className={`fixed inset-0 z-50 bg-[#0d0b14] overflow-y-auto ${exiting ? "animate-fade-out" : "animate-fade-in"}`}>
            <div className="min-h-screen w-full p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-2xl font-bold text-cream-warm">{pageant.name}</h2>
                    <button onClick={handleClose} className="text-cream-warm/40 hover:text-cream-warm text-2xl transition">✕</button>
                </div>

                <div className="flex gap-6 border-b border-white/[0.08] mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`pb-3 text-sm font-semibold uppercase tracking-wider transition ${
                                activeTab === tab.key
                                    ? "text-gold border-b-2 border-gold"
                                    : "text-cream-warm/40 hover:text-cream-warm/70"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "details" && (
                    <div className="space-y-5 text-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div />
                            {!editing && pageant.status !== "Terminated" && (
                                <button onClick={() => { setEditForm({ name: pageant.name, country: pageant.country, province: pageant.province, city: pageant.city, barangay: pageant.barangay, zip: pageant.zip, date: pageant.date, status: pageant.status }); setEditing(true); }}
                                    className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-gold/25 text-gold rounded-md hover:bg-gold/10 transition">
                                    Edit
                                </button>
                            )}
                        </div>

                            {editing ? (
                                <form onSubmit={handleSaveEdit} className="space-y-4">
                                    <div>
                                        <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Pageant Name</label>
                                        <input name="name" value={editForm.name} onChange={handleEditChange}
                                            className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Organization</label>
                                            <p className="text-cream-warm/80 py-2.5">{pageant.organization_name}</p>
                                        </div>
                                        <div>
                                            <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Date</label>
                                            <input name="date" type="date" value={editForm.date} onChange={handleEditChange}
                                                className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm" required />
                                        </div>
                                    </div>
                                    <fieldset className="space-y-3">
                                        <legend className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 mb-1.5 font-semibold">Location</legend>
                                        <input name="country" value={editForm.country} onChange={handleEditChange} placeholder="Country"
                                            className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm" required />
                                        <div className="grid grid-cols-2 gap-3">
                                            {["province", "city", "barangay", "zip"].map((field) => (
                                                <input key={field} name={field} value={(editForm as Record<string, string>)[field]}
                                                    onChange={handleEditChange} placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                                    className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm" required />
                                            ))}
                                        </div>
                                    </fieldset>
                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setEditing(false)}
                                            className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border border-white/[0.1] text-cream-warm/50 rounded-md hover:bg-white/5 transition">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={saving}
                                            className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-gold text-[#0d0b14] rounded-md hover:bg-gold/90 transition disabled:opacity-50">
                                            {saving ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
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
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/30 mb-0.5 font-semibold">Days Until Event</p>
                                            <p className="text-gold font-semibold">
                                                {(() => { const d = Math.max(0, Math.ceil((new Date(pageant.date).getTime() - Date.now()) / 86400000)); return d === 0 ? "Today!" : `${d} day${d > 1 ? "s" : ""} left`; })()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/30 mb-0.5 font-semibold">No. of Candidates</p>
                                            <p className="text-cream-warm/80">{candidateCount === null ? "-" : candidateCount}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/30 mb-0.5 font-semibold">Status</p>
                                        <p className="text-cream-warm/80 capitalize">{pageant.status}</p>
                                    </div>
                                </>
                            )}


                        </div>
                    )}

                    {activeTab === "criteria" && <CriteriaTab pageantId={pageant.id} />}

                    {activeTab === "segment" && <SegmentTab pageantId={pageant.id} />}

                    {activeTab === "score" && <ScoreTab pageantId={pageant.id} />}
            </div>
        </div>
    );
}

/* ─────────────────────────────── Criteria Tab ────────────────────────────── */

function CriteriaTab({ pageantId }: { pageantId: number }) {
    const { toast } = useToast();
    const [criteria, setCriteria] = useState<Criterion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Criterion | null>(null);
    const [viewing, setViewing] = useState<Criterion | null>(null);
    const [form, setForm] = useState({ name: "", percentage: 0 });
    const [submitting, setSubmitting] = useState(false);

    const fetchCriteria = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8000/api/pageants/${pageantId}/criteria`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) setCriteria(await res.json());
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    useEffect(() => { fetchCriteria(); }, []);

    const usedPercentage = criteria.reduce((sum, c) => sum + (editing && c.id === editing.id ? 0 : c.percentage), 0);
    const remaining = 100 - usedPercentage;

    const openAdd = () => { setEditing(null); setForm({ name: "", percentage: 0 }); setShowModal(true); };
    const openEdit = (c: Criterion) => { setEditing(c); setForm({ name: c.name, percentage: c.percentage }); setShowModal(true); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem("token");
        try {
            const url = editing
                ? `http://localhost:8000/api/criteria/${editing.id}`
                : `http://localhost:8000/api/pageants/${pageantId}/criteria`;
            const method = editing ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });
            if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body?.message || "Failed to save criterion"); }
            toast(editing ? "Criterion updated" : "Criterion added");
            if (editing) {
                setShowModal(false);
            } else {
                setForm({ name: "", percentage: 0 });
            }
            await fetchCriteria();
        } catch (err) {
            toast(err instanceof Error ? err.message : "Failed to save criterion", "error");
        } finally { setSubmitting(false); }
    };

    const handleDelete = async (c: Criterion) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8000/api/criteria/${c.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete criterion");
            toast("Criterion deleted");
            await fetchCriteria();
        } catch {
            toast("Failed to delete criterion", "error");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-end mb-4">
                <button onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-gold text-[#0d0b14] rounded-md hover:bg-gold/90 transition">
                    <SvgIcon d="M12 4v16m8-8H4" className="w-3.5 h-3.5" /> Add Criteria
                </button>
            </div>

            <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ background: '#13111f' }}>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/[0.06] text-left text-cream-warm/30 text-[10px] uppercase tracking-wider">
                            <th className="px-5 py-3 font-semibold">Name</th>
                            <th className="px-5 py-3 font-semibold">Percentage</th>
                            <th className="px-5 py-3 font-semibold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                        {loading ? (
                            Array.from({ length: 2 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-3/4" /></td>
                                    <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-16" /></td>
                                    <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-20 ml-auto" /></td>
                                </tr>
                            ))
                        ) : criteria.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-5 py-8 text-center text-cream-warm/25 text-sm">No criteria added yet.</td>
                            </tr>
                        ) : (
                            criteria.map((c) => (
                                <tr key={c.id} className="hover:bg-white/[0.02] transition">
                                    <td className="px-5 py-3.5 text-cream-warm font-medium">{c.name}</td>
                                    <td className="px-5 py-3.5 text-cream-warm/50">{c.percentage}%</td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => setViewing(c)}
                                                className="p-1.5 text-cream-warm/30 hover:text-cream-warm transition" title="View">
                                                <SvgIcon d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => openEdit(c)}
                                                className="p-1.5 text-cream-warm/30 hover:text-gold transition" title="Edit">
                                                <SvgIcon d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(c)}
                                                className="p-1.5 text-cream-warm/30 hover:text-red-400 transition" title="Remove">
                                                <SvgIcon d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
                    <div className="border border-white/[0.08] rounded-xl p-6 max-w-md w-full shadow-2xl" style={{ background: '#100e1a' }} onClick={(e) => e.stopPropagation()}>
                        <h4 className="font-display text-base font-bold text-cream-warm mb-4">{editing ? "Edit Criteria" : "Add Criteria"}</h4>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Name</label>
                                <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                                    className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm" required />
                            </div>
                            <div>
                                <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Percentage</label>
                                <p className="text-xs text-cream-warm/40 mb-2">
                                    Used: <span className="text-cream-warm/80 font-semibold">{usedPercentage}%</span>
                                    {" "}/ Remaining: <span className="text-gold font-semibold">{remaining}%</span>
                                </p>
                                <select value={form.percentage} onChange={(e) => setForm((prev) => ({ ...prev, percentage: parseInt(e.target.value) }))}
                                    className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm" required>
                                    <option value="" disabled>Select percentage</option>
                                    {Array.from({ length: remaining / 10 }, (_, i) => (i + 1) * 10).map((v) => (
                                        <option key={v} value={v}>{v}%</option>
                                    ))}
                                </select>
                                {remaining <= 0 && <p className="text-xs text-red-400 mt-1">All 100% has been allocated. Edit or remove an existing criterion first.</p>}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border border-white/[0.1] text-cream-warm/50 rounded-md hover:bg-white/5 transition">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting || (!editing && remaining <= 0)}
                                    className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-gold text-[#0d0b14] rounded-md hover:bg-gold/90 transition disabled:opacity-50">
                                    {submitting ? "Saving..." : editing ? "Update" : "Save and Add Another"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {viewing && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setViewing(null)}>
                    <div className="border border-white/[0.08] rounded-xl p-6 max-w-md w-full shadow-2xl" style={{ background: '#100e1a' }} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-display text-base font-bold text-cream-warm">{viewing.name}</h4>
                            <button onClick={() => setViewing(null)} className="text-cream-warm/30 hover:text-cream-warm text-lg transition">✕</button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/30 mb-0.5 font-semibold">Name</p>
                                <p className="text-cream-warm/80">{viewing.name}</p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/30 mb-0.5 font-semibold">Percentage</p>
                                <p className="text-cream-warm/80">{viewing.percentage}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────── Segment Tab ─────────────────────────────── */

function SegmentTab({ pageantId }: { pageantId: number }) {
    const { toast } = useToast();
    const [segments, setSegments] = useState<{ id: number; pageant_id: number; name: string; type: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<{ id: number; name: string; type: string } | null>(null);
    const [viewing, setViewing] = useState<{ id: number; name: string; type: string } | null>(null);
    const [segmentName, setSegmentName] = useState("");
    const [segmentType, setSegmentType] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchSegments = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8000/api/pageants/${pageantId}/segments`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) {
                const data = await res.json();
                const order = ["Preliminary Segment", "Semi-Final Segment", "Final Segment"];
                data.sort((a: { type: string }, b: { type: string }) => order.indexOf(a.type) - order.indexOf(b.type));
                setSegments(data);
            }
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    useEffect(() => { fetchSegments(); }, []);

    const openAdd = () => { setEditing(null); setSegmentName(""); setSegmentType(""); setShowModal(true); };
    const openEdit = (s: { id: number; name: string; type: string }) => { setEditing(s); setSegmentName(s.name); setSegmentType(s.type || ""); setShowModal(true); };

    const segmentOptions = ["Preliminary Segment", "Semi-Final Segment", "Final Segment"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem("token");
        try {
            const url = editing
                ? `http://localhost:8000/api/segments/${editing.id}`
                : `http://localhost:8000/api/pageants/${pageantId}/segments`;
            const method = editing ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: segmentName, type: segmentType }),
            });
            if (!res.ok) throw new Error("Failed to save segment");
            toast(editing ? "Segment updated" : "Segment added");
            setShowModal(false);
            await fetchSegments();
        } catch {
            toast("Failed to save segment", "error");
        } finally { setSubmitting(false); }
    };

    const handleDelete = async (s: { id: number }) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8000/api/segments/${s.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete segment");
            toast("Segment deleted");
            await fetchSegments();
        } catch {
            toast("Failed to delete segment", "error");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-end mb-4">
                <button onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-gold text-[#0d0b14] rounded-md hover:bg-gold/90 transition">
                    <SvgIcon d="M12 4v16m8-8H4" className="w-3.5 h-3.5" /> Add Segment
                </button>
            </div>

            <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ background: '#13111f' }}>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.06] text-left text-cream-warm/30 text-[10px] uppercase tracking-wider">
                                <th className="px-5 py-3 font-semibold">Name</th>
                                <th className="px-5 py-3 font-semibold">Type</th>
                                <th className="px-5 py-3 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {loading ? (
                                Array.from({ length: 2 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-3/4" /></td>
                                        <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-20 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : segments.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-5 py-8 text-center text-cream-warm/25 text-sm">No segments added yet.</td>
                                </tr>
                            ) : (
                                segments.map((s) => (
                                    <tr key={s.id} className="hover:bg-white/[0.02] transition">
                                        <td className="px-5 py-3.5 text-cream-warm font-medium">{s.name}</td>
                                        <td className="px-5 py-3.5 text-cream-warm/50 text-xs">{s.type || "—"}</td>
                                        <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => setViewing(s)}
                                                className="p-1.5 text-cream-warm/30 hover:text-cream-warm transition" title="View">
                                                <SvgIcon d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => openEdit(s)}
                                                className="p-1.5 text-cream-warm/30 hover:text-gold transition" title="Edit">
                                                <SvgIcon d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(s)}
                                                className="p-1.5 text-cream-warm/30 hover:text-red-400 transition" title="Remove">
                                                <SvgIcon d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
                    <div className="border border-white/[0.08] rounded-xl p-6 max-w-md w-full shadow-2xl" style={{ background: '#100e1a' }} onClick={(e) => e.stopPropagation()}>
                        <h4 className="font-display text-base font-bold text-cream-warm mb-4">{editing ? "Edit Segment" : "Add Segment"}</h4>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Segment Name</label>
                                <input value={segmentName} onChange={(e) => setSegmentName(e.target.value)}
                                    className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm" required />
                            </div>
                            <div>
                                <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Segment Type</label>
                                <select value={segmentType} onChange={(e) => setSegmentType(e.target.value)}
                                    className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm" required>
                                    <option value="">Select type</option>
                                    {segmentOptions.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border border-white/[0.1] text-cream-warm/50 rounded-md hover:bg-white/5 transition">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting}
                                    className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-gold text-[#0d0b14] rounded-md hover:bg-gold/90 transition disabled:opacity-50">
                                    {submitting ? "Saving..." : editing ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {viewing && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setViewing(null)}>
                    <div className="border border-white/[0.08] rounded-xl p-6 max-w-md w-full shadow-2xl" style={{ background: '#100e1a' }} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-display text-base font-bold text-cream-warm">{viewing.name}</h4>
                            <button onClick={() => setViewing(null)} className="text-cream-warm/30 hover:text-cream-warm text-lg transition">✕</button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/30 mb-0.5 font-semibold">Name</p>
                                <p className="text-cream-warm/80">{viewing.name}</p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/30 mb-0.5 font-semibold">Type</p>
                                <p className="text-cream-warm/80">{viewing.type || "—"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────── Score Tab ────────────────────────────────── */

function ScoreTab({ pageantId }: { pageantId: number }) {
    const { toast } = useToast();
    const [segments, setSegments] = useState<{ id: number; name: string; type: string }[]>([]);
    const [criteria, setCriteria] = useState<Criterion[]>([]);
    const [candidates, setCandidates] = useState<{ id: number; first_name: string; last_name: string; candidate_number?: string }[]>([]);
    const [scores, setScores] = useState<Record<string, number>>({});
    const [segmentAverages, setSegmentAverages] = useState<Record<string, { total_score: number; average_score: number }>>({});
    const [activeSegment, setActiveSegment] = useState<number | null>(null);
    const [showCriteria, setShowCriteria] = useState(false);
    const [showSegments, setShowSegments] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        Promise.all([
            fetch(`http://localhost:8000/api/pageants/${pageantId}/segments`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`http://localhost:8000/api/pageants/${pageantId}/criteria`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`http://localhost:8000/api/pageants/${pageantId}/candidates`, { headers: { Authorization: `Bearer ${token}` } }),
        ]).then(async ([segRes, critRes, candRes]) => {
            const segs = segRes.ok ? await segRes.json() : [];
            const order = ["Preliminary Segment", "Semi-Final Segment", "Final Segment"];
            segs.sort((a: { type: string }, b: { type: string }) => order.indexOf(a.type) - order.indexOf(b.type));
            setSegments(segs);
            if (critRes.ok) setCriteria(await critRes.json());
            if (candRes.ok) {
                const candData = await candRes.json();
                setCandidates(candData.data ?? candData);
            }
            if (segs.length > 0) setActiveSegment(segs[0].id);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!activeSegment) return;
        const token = localStorage.getItem("token");
        Promise.all([
            fetch(`http://localhost:8000/api/pageants/${pageantId}/scores?segment_id=${activeSegment}`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`http://localhost:8000/api/pageants/${pageantId}/segment-averages?segment_id=${activeSegment}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]).then(async ([scoresRes, avgsRes]) => {
            const scoresData = scoresRes.ok ? await scoresRes.json() : [];
            const map: Record<string, number> = {};
            scoresData.forEach((s: { candidate_id: number; criterion_id: number; score: number }) => {
                map[`${s.candidate_id}-${s.criterion_id}`] = s.score;
            });
            setScores(map);
            const avgsData = avgsRes.ok ? await avgsRes.json() : [];
            const avgMap: Record<string, { total_score: number; average_score: number }> = {};
            avgsData.forEach((a: { candidate_id: number; total_score: number; average_score: number }) => {
                avgMap[a.candidate_id] = { total_score: a.total_score, average_score: a.average_score };
            });
            setSegmentAverages(avgMap);
        }).catch(() => {});
    }, [activeSegment]);

    const updateScore = async (candidateId: number, criterionId: number, value: number) => {
        const key = `${candidateId}-${criterionId}`;
        const newScores = { ...scores, [key]: value };
        setScores(newScores);
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:8000/api/pageants/${pageantId}/scores`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ segment_id: activeSegment, candidate_id: candidateId, criterion_id: criterionId, score: value }),
        });
        const total = criteria.reduce((sum, c) => sum + (newScores[`${candidateId}-${c.id}`] || 0), 0);
        const avg = criteria.length > 0 ? total / criteria.length : 0;
        const res = await fetch(`http://localhost:8000/api/pageants/${pageantId}/segment-averages`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ segment_id: activeSegment, candidate_id: candidateId, total_score: total, average_score: avg }),
        });
        if (res.ok) {
            const saved = await res.json();
            setSegmentAverages((prev) => ({ ...prev, [candidateId]: { total_score: saved.total_score, average_score: saved.average_score } }));
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-6 border-b border-white/[0.08] flex-1">
                    {loading ? (
                        Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="pb-3 animate-pulse"><div className="h-4 w-20 bg-white/10 rounded" /></div>
                        ))
                    ) : segments.length === 0 ? (
                        <div className="pb-3 text-sm text-cream-warm/30">No segments yet. Add one first.</div>
                    ) : (
                        segments.map((seg) => (
                            <button key={seg.id} onClick={() => setActiveSegment(seg.id)}
                                className={`pb-3 text-sm font-semibold uppercase tracking-wider transition ${
                                    activeSegment === seg.id
                                        ? "text-gold border-b-2 border-gold"
                                        : "text-cream-warm/40 hover:text-cream-warm/70"
                                }`}>
                                {seg.name}
                            </button>
                        ))
                    )}
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowCriteria(!showCriteria)}
                        className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-gold/25 text-gold rounded-md hover:bg-gold/10 transition">
                        Criteria
                    </button>
                    <button onClick={() => setShowSegments(!showSegments)}
                        className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-gold/25 text-gold rounded-md hover:bg-gold/10 transition">
                        Segments
                    </button>
                </div>
            </div>

            {showCriteria && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowCriteria(false)}>
                    <div className="border border-white/[0.08] rounded-xl p-6 max-w-md w-full shadow-2xl" style={{ background: '#100e1a' }} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-display text-base font-bold text-cream-warm">Criteria List</h4>
                            <button onClick={() => setShowCriteria(false)} className="text-cream-warm/30 hover:text-cream-warm text-lg transition">✕</button>
                        </div>
                        {loading ? (
                            <div className="space-y-2 animate-pulse">
                                {Array.from({ length: 2 }).map((_, i) => (
                                    <div key={i} className="flex justify-between pb-1.5"><div className="h-4 w-32 bg-white/10 rounded" /><div className="h-4 w-12 bg-white/10 rounded" /></div>
                                ))}
                            </div>
                        ) : criteria.length === 0 ? (
                            <p className="text-sm text-cream-warm/25">No criteria set.</p>
                        ) : (
                            <div className="space-y-2">
                                {criteria.map((c, i) => (
                                    <div key={c.id} className="flex justify-between text-sm text-cream-warm/70 border-b border-white/[0.04] pb-1.5">
                                        <span>C{i + 1}. {c.name}</span>
                                        <span className="text-gold text-xs">{c.percentage}%</span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-sm text-cream-warm font-semibold pt-1">
                                    <span>Total</span>
                                    <span className="text-gold text-xs">{criteria.reduce((s, c) => s + c.percentage, 0)}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showSegments && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowSegments(false)}>
                    <div className="border border-white/[0.08] rounded-xl p-6 max-w-md w-full shadow-2xl" style={{ background: '#100e1a' }} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-display text-base font-bold text-cream-warm">Segment List</h4>
                            <button onClick={() => setShowSegments(false)} className="text-cream-warm/30 hover:text-cream-warm text-lg transition">✕</button>
                        </div>
                        {loading ? (
                            <div className="space-y-2 animate-pulse">
                                {Array.from({ length: 2 }).map((_, i) => (
                                    <div key={i} className="h-4 w-40 bg-white/10 rounded" />
                                ))}
                            </div>
                        ) : segments.length === 0 ? (
                            <p className="text-sm text-cream-warm/25">No segments set.</p>
                        ) : (
                            <div className="space-y-2">
                                {segments.map((seg, i) => (
                                    <div key={seg.id} className="flex justify-between text-sm text-cream-warm/70 border-b border-white/[0.04] pb-1.5">
                                        <span>S{i + 1}. {seg.name}</span>
                                        <span className={`text-xs ${activeSegment === seg.id ? "text-gold" : "text-cream-warm/30"}`}>{activeSegment === seg.id ? "Active" : ""}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="rounded-xl border border-white/[0.06] overflow-x-auto" style={{ background: '#13111f' }}>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/[0.06] text-left text-cream-warm/30 text-[10px] uppercase tracking-wider">
                            <th className="px-5 py-3 font-semibold sticky left-0" style={{ background: '#13111f' }}>No.</th>
                            <th className="px-5 py-3 font-semibold">Candidate</th>
                            {criteria.map((c, i) => (
                                <th key={c.id} className="px-4 py-3 font-semibold text-center min-w-[80px]">C{i + 1}<br /><span className="text-[9px] font-normal text-cream-warm/20">({c.percentage}%)</span></th>
                            ))}
                            <th className="px-4 py-3 font-semibold text-center min-w-[90px]">Total/Ave.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-5 py-3"><div className="h-4 w-8 bg-white/10 rounded" /></td>
                                    <td className="px-5 py-3"><div className="h-4 w-32 bg-white/10 rounded" /></td>
                                    {criteria.map((_, ci) => (
                                        <td key={ci} className="px-4 py-3 text-center"><div className="h-8 w-16 bg-white/10 rounded mx-auto" /></td>
                                    ))}
                                    <td className="px-4 py-3 text-center"><div className="h-4 w-8 bg-white/10 rounded mx-auto" /></td>
                                </tr>
                            ))
                        ) : candidates.length === 0 ? (
                            <tr>
                                <td colSpan={criteria.length + 3} className="px-5 py-8 text-center text-cream-warm/25 text-sm">No candidates assigned.</td>
                            </tr>
                        ) : (
                            candidates.map((cand) => {
                                const total = criteria.reduce((sum, c) => {
                                    const s = scores[`${cand.id}-${c.id}`] || 0;
                                    return sum + s;
                                }, 0);
                                return (
                                    <tr key={cand.id} className="hover:bg-white/[0.02] transition">
                                        <td className="px-5 py-3 text-cream-warm/40 font-mono text-xs sticky left-0" style={{ background: '#13111f' }}>{cand.candidate_number || "—"}</td>
                                        <td className="px-5 py-3 text-cream-warm font-medium">{cand.first_name} {cand.last_name}</td>
                                        {criteria.map((c) => {
                                            const key = `${cand.id}-${c.id}`;
                                            return (
                                                <td key={key} className="px-4 py-3 text-center">
                                                    <input type="number" min={0} max={100} value={scores[key] ?? ""}
                                                        onChange={(e) => {
                                                            if (e.target.value === "") return;
                                                            const v = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                                            updateScore(cand.id, c.id, v);
                                                        }}
                                                        className="w-16 bg-[#0d0b14] border border-white/[0.08] text-cream-warm text-center px-2 py-1.5 rounded-md focus:outline-none focus:border-gold/50 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                                </td>
                                            );
                                        })}
                                        <td className="px-4 py-3 text-center"><span className="text-gold font-semibold">{segmentAverages[cand.id] ? Number(segmentAverages[cand.id].average_score).toFixed(1) : criteria.length > 0 ? (total / criteria.length).toFixed(1) : "0"}</span><br /><span className="text-[10px] text-cream-warm/40">{segmentAverages[cand.id]?.total_score ?? total}</span></td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
    );
}

/* ─────────────────────────────── Candidates ─────────────────────────────── */

function CandidatesSection() {
    const { toast } = useToast();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ first_name: "", last_name: "", gender: "", pageant_id: "" });
    const [primaryImage, setPrimaryImage] = useState<File | null>(null);
    const [hoverImage, setHoverImage] = useState<File | null>(null);
    const [primaryPreview, setPrimaryPreview] = useState<string>("");
    const [hoverPreview, setHoverPreview] = useState<string>("");
    const [viewing, setViewing] = useState<Candidate | null>(null);
    const [editing, setEditing] = useState<Candidate | null>(null);
    const [editForm, setEditForm] = useState({ first_name: "", last_name: "", gender: "", candidate_number: "" });
    const [editPrimaryImage, setEditPrimaryImage] = useState<File | null>(null);
    const [editHoverImage, setEditHoverImage] = useState<File | null>(null);
    const [editPrimaryPreview, setEditPrimaryPreview] = useState<string>("");
    const [editHoverPreview, setEditHoverPreview] = useState<string>("");
    const [editPageantId, setEditPageantId] = useState("");
    const [candidatePageants, setCandidatePageants] = useState<Pageant[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState<Candidate | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [pageants, setPageants] = useState<Pageant[]>([]);

    const fetchCandidates = async (page = currentPage, size = perPage) => {
        const token = localStorage.getItem("token");
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/api/candidates?page=${page}&per_page=${size}`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) {
                const json = await res.json();
                setCandidates(json.data);
                setCurrentPage(json.current_page);
                setLastPage(json.last_page);
                setPerPage(json.per_page);
                setTotal(json.total);
            }
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchCandidates(1, perPage);
        const token = localStorage.getItem("token");
        fetch(`http://localhost:8000/api/pageants?page=1&per_page=50`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => { if (data) setPageants(data.data ?? []); })
            .catch(() => {});
    }, []);

    const changePage = (page: number) => {
        if (page < 1 || page > lastPage) return;
        fetchCandidates(page, perPage);
    };

    const changePerPage = (size: number) => {
        setPerPage(size);
        fetchCandidates(1, size);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem("token");
        try {
            const fd = new FormData();
            fd.append("first_name", form.first_name);
            fd.append("last_name", form.last_name);
            if (form.gender) fd.append("gender", form.gender);
            if (form.pageant_id) fd.append("pageant_id", form.pageant_id);
            if (primaryImage) fd.append("primary_image", primaryImage);
            if (hoverImage) fd.append("hover_image", hoverImage);

            const res = await fetch("http://localhost:8000/api/candidates", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            if (!res.ok) throw new Error("Failed to create candidate");
            setShowModal(false);
            setForm({ first_name: "", last_name: "", gender: "", pageant_id: "" });
            setPrimaryImage(null);
            setHoverImage(null);
            setPrimaryPreview("");
            setHoverPreview("");
            toast("Candidate added!");
            await fetchCandidates();
        } catch { toast("Failed to create candidate", "error"); } finally { setSubmitting(false); }
    };

    const handlePrimaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setPrimaryImage(file);
        setPrimaryPreview(file ? URL.createObjectURL(file) : "");
    };

    const handleHoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setHoverImage(file);
        setHoverPreview(file ? URL.createObjectURL(file) : "");
    };

    const imgUrl = (path: string | null) => path ? `http://localhost:8000/storage/${path}` : null;

    const openEdit = (c: Candidate) => {
        setEditing(c);
        setEditForm({
            first_name: c.first_name ?? "",
            last_name: c.last_name ?? "",
            gender: c.gender ?? "",
            candidate_number: c.candidate_number ?? "",
        });
        setEditPrimaryImage(null);
        setEditHoverImage(null);
        setEditPrimaryPreview("");
        setEditHoverPreview("");
        setEditPageantId("");
        const token = localStorage.getItem("token");
        fetch(`http://localhost:8000/api/candidates/${c.id}/pageants`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setCandidatePageants(Array.isArray(data) ? data : []))
            .catch(() => setCandidatePageants([]));
    };

    const handleDelete = async () => {
        if (!deleting) return;
        setSubmitting(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8000/api/candidates/${deleting.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete candidate");
            setDeleting(null);
            toast("Candidate deleted!");
            await fetchCandidates();
        } catch { toast("Failed to delete candidate", "error"); } finally { setSubmitting(false); }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        setSubmitting(true);
        const token = localStorage.getItem("token");
        try {
            const fd = new FormData();
            fd.append("first_name", editForm.first_name);
            fd.append("last_name", editForm.last_name);
            fd.append("candidate_number", editForm.candidate_number);
            if (editForm.gender) fd.append("gender", editForm.gender);
            if (editPageantId) fd.append("pageant_id", editPageantId);
            if (editPrimaryImage) fd.append("primary_image", editPrimaryImage);
            if (editHoverImage) fd.append("hover_image", editHoverImage);

            const res = await fetch(`http://localhost:8000/api/candidates/${editing.id}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            if (!res.ok) throw new Error("Failed to update candidate");
            setEditing(null);
            toast("Candidate updated!");
            await fetchCandidates();
        } catch { toast("Failed to update candidate", "error"); } finally { setSubmitting(false); }
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
                                <th className="px-5 py-3 font-semibold w-12">No.</th>
                                <th className="px-5 py-3 font-semibold">Photo</th>
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
                                        <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-8" /></td>
                                        <td className="px-5 py-3.5"><div className="h-10 w-10 bg-white/10 rounded-full" /></td>
                                        <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-1/3" /></td>
                                        <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-16" /></td>
                                        <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-12" /></td>
                                        <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-16 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : candidates.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-10 text-center">
                                        <SvgIcon d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" className="w-8 h-8 text-cream-warm/10 mx-auto mb-3" />
                                        <p className="text-sm text-cream-warm/30">No candidates registered yet.</p>
                                    </td>
                                </tr>
                            ) : (
                                candidates.map((c) => (
                                    <tr key={c.id} className="hover:bg-white/[0.02] transition">
                                        <td className="px-5 py-3.5 text-cream-warm/40 font-mono text-xs">{c.candidate_number}</td>
                                        <td className="px-5 py-3.5">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden group bg-gold/20 flex items-center justify-center">
                                                {c.primary_image ? (
                                                    <img
                                                        src={imgUrl(c.primary_image)}
                                                        alt=""
                                                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                                                    />
                                                ) : (
                                                    <span className="text-gold text-xs font-bold transition-opacity duration-300 group-hover:opacity-0">
                                                        {c.first_name.charAt(0)}{c.last_name.charAt(0)}
                                                    </span>
                                                )}
                                                {c.hover_image ? (
                                                    <img
                                                        src={imgUrl(c.hover_image)}
                                                        alt=""
                                                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 w-full h-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                                        {c.first_name.charAt(0)}{c.last_name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-cream-warm font-medium">{c.first_name} {c.last_name}</td>
                                        <td className="px-5 py-3.5 text-cream-warm/50">{c.gender}</td>
                                        <td className="px-5 py-3.5 text-cream-warm/50">{c.votes}</td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button onClick={() => setViewing(c)} className="p-2 border border-gold/25 text-gold rounded-md hover:bg-gold/10 transition" title="View candidate">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                                    </svg>
                                                </button>
                                                <button onClick={() => openEdit(c)} className="p-2 border border-gold/25 text-gold rounded-md hover:bg-gold/10 transition" title="Edit candidate">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                                    </svg>
                                                </button>
                                                <button onClick={() => setDeleting(c)} className="p-2 border border-red-400/30 text-red-400 rounded-md hover:bg-red-500/10 transition" title="Delete candidate">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]">
                        <div className="flex items-center gap-2 text-[11px] text-cream-warm/40">
                            <span>Show</span>
                            <select value={perPage} onChange={(e) => changePerPage(Number(e.target.value))}
                                className="bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-2 py-1 rounded text-[11px] focus:outline-none focus:border-gold/50">
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span>of {total} entries</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => changePage(currentPage - 1)} disabled={currentPage <= 1}
                                className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider border border-white/[0.08] text-cream-warm/50 rounded hover:bg-white/5 transition disabled:opacity-30 disabled:cursor-not-allowed">
                                Prev
                            </button>
                            {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                                <button key={p} onClick={() => changePage(p)}
                                    className={`w-7 h-7 text-[11px] font-semibold rounded transition ${
                                        p === currentPage
                                            ? "bg-gold/20 text-gold border border-gold/30"
                                            : "text-cream-warm/50 border border-white/[0.08] hover:bg-white/5"
                                    }`}>
                                    {p}
                                </button>
                            ))}
                            <button onClick={() => changePage(currentPage + 1)} disabled={currentPage >= lastPage}
                                className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider border border-white/[0.08] text-cream-warm/50 rounded hover:bg-white/5 transition disabled:opacity-30 disabled:cursor-not-allowed">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="border border-white/[0.08] rounded-xl p-8 max-w-lg w-full shadow-2xl" style={{ background: '#100e1a' }}>
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
                            <div>
                                <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Gender</label>
                                <select name="gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                                    className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm">
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Assign to Pageant</label>
                                <select value={form.pageant_id} onChange={(e) => setForm({ ...form, pageant_id: e.target.value })}
                                    className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm">
                                    <option value="">Not assigned</option>
                                    {pageants.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Primary Image</label>
                                    <input type="file" accept="image/*" onChange={handlePrimaryChange}
                                        className="w-full text-cream-warm/50 text-xs file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:uppercase file:tracking-wider file:bg-gold/20 file:text-gold file:cursor-pointer hover:file:bg-gold/30 transition" />
                                    <div className="mt-2 w-full h-32 rounded-md border border-white/[0.08] bg-[#0d0b14] flex items-center justify-center overflow-hidden">
                                        {primaryPreview ? (
                                            <img src={primaryPreview} alt="Primary preview" className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-cream-warm/20 text-[10px] uppercase tracking-wider">No image</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Hover Image</label>
                                    <input type="file" accept="image/*" onChange={handleHoverChange}
                                        className="w-full text-cream-warm/50 text-xs file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:uppercase file:tracking-wider file:bg-gold/20 file:text-gold file:cursor-pointer hover:file:bg-gold/30 transition" />
                                    <div className="mt-2 w-full h-32 rounded-md border border-white/[0.08] bg-[#0d0b14] flex items-center justify-center overflow-hidden">
                                        {hoverPreview ? (
                                            <img src={hoverPreview} alt="Hover preview" className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-cream-warm/20 text-[10px] uppercase tracking-wider">No image</span>
                                        )}
                                    </div>
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
            {viewing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="border border-white/[0.08] rounded-xl p-8 max-w-lg w-full shadow-2xl" style={{ background: '#100e1a' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display text-xl font-bold text-cream-warm">{viewing.first_name} {viewing.last_name}</h3>
                            <button onClick={() => setViewing(null)} className="text-cream-warm/30 hover:text-cream-warm text-lg transition">✕</button>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <div className="w-28 h-28 rounded-xl overflow-hidden border border-white/[0.08] bg-[#0d0b14] flex items-center justify-center mb-1">
                                        {viewing.primary_image ? (
                                            <img src={imgUrl(viewing.primary_image)} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-cream-warm/20 text-[10px] uppercase tracking-wider">No image</span>
                                        )}
                                    </div>
                                    <span className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 font-semibold">Primary</span>
                                </div>
                                <div className="text-center">
                                    <div className="w-28 h-28 rounded-xl overflow-hidden border border-white/[0.08] bg-[#0d0b14] flex items-center justify-center mb-1">
                                        {viewing.hover_image ? (
                                            <img src={imgUrl(viewing.hover_image)} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-cream-warm/20 text-[10px] uppercase tracking-wider">No image</span>
                                        )}
                                    </div>
                                    <span className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 font-semibold">Hover</span>
                                </div>
                            </div>
                            <div className="w-full space-y-3 mt-2">
                                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                                    <span className="text-[10px] uppercase tracking-wider text-cream-warm/40 font-semibold">Candidate No.</span>
                                    <span className="text-sm text-cream-warm">{viewing.candidate_number}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                                    <span className="text-[10px] uppercase tracking-wider text-cream-warm/40 font-semibold">Gender</span>
                                    <span className="text-sm text-cream-warm capitalize">{viewing.gender || "—"}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                                    <span className="text-[10px] uppercase tracking-wider text-cream-warm/40 font-semibold">Email</span>
                                    <span className="text-sm text-cream-warm">{viewing.email || "—"}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                                    <span className="text-[10px] uppercase tracking-wider text-cream-warm/40 font-semibold">Votes</span>
                                    <span className="text-sm text-cream-warm">{viewing.votes}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {deleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="border border-white/[0.08] rounded-xl p-8 max-w-sm w-full shadow-2xl text-center" style={{ background: '#100e1a' }}>
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="font-display text-lg font-bold text-cream-warm mb-2">Delete Candidate</h3>
                        <p className="text-sm text-cream-warm/50 mb-6">
                            Are you sure you want to delete <span className="text-cream-warm font-medium">{deleting.first_name} {deleting.last_name}</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleting(null)} disabled={submitting}
                                className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border border-white/[0.1] text-cream-warm/50 rounded-md hover:bg-white/5 transition disabled:opacity-50">
                                Cancel
                            </button>
                            <button onClick={handleDelete} disabled={submitting}
                                className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-red-500/20 border border-red-500/40 text-red-400 rounded-md hover:bg-red-500/30 transition disabled:opacity-50">
                                {submitting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="border border-white/[0.08] rounded-xl p-8 max-w-lg w-full shadow-2xl" style={{ background: '#100e1a' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display text-xl font-bold text-cream-warm">Edit Candidate</h3>
                            <button onClick={() => setEditing(null)} className="text-cream-warm/30 hover:text-cream-warm text-lg transition">✕</button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">First Name</label>
                                    <input value={editForm.first_name} onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                                        className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm" required />
                                </div>
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Last Name</label>
                                    <input value={editForm.last_name} onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                                        className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm" required />
                                </div>
                            </div>
                            <div>
                                <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Candidate No.</label>
                                <input value={editForm.candidate_number} onChange={(e) => setEditForm({ ...editForm, candidate_number: e.target.value })}
                                    className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm" />
                            </div>
                            <div>
                                <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Gender</label>
                                <select value={editForm.gender} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                                    className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm">
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            {candidatePageants.length > 0 && (
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Currently Assigned To</label>
                                    <div className="flex flex-wrap gap-2">
                                        {candidatePageants.map((p) => (
                                            <span key={p.id} className="px-2.5 py-1 text-[10px] font-semibold rounded-md bg-gold/10 text-gold border border-gold/20">
                                                {p.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Add to Another Pageant</label>
                                <select value={editPageantId} onChange={(e) => setEditPageantId(e.target.value)}
                                    className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm">
                                    <option value="">— Select —</option>
                                    {pageants.filter((p) => !candidatePageants.some((cp) => cp.id === p.id)).map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Primary Image</label>
                                    <input type="file" accept="image/*" onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setEditPrimaryImage(file);
                                        setEditPrimaryPreview(file ? URL.createObjectURL(file) : "");
                                    }}
                                        className="w-full text-cream-warm/50 text-xs file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:uppercase file:tracking-wider file:bg-gold/20 file:text-gold file:cursor-pointer hover:file:bg-gold/30 transition" />
                                    <div className="mt-2 w-full h-32 rounded-md border border-white/[0.08] bg-[#0d0b14] flex items-center justify-center overflow-hidden">
                                        {editPrimaryPreview ? (
                                            <img src={editPrimaryPreview} alt="" className="w-full h-full object-contain" />
                                        ) : editing.primary_image ? (
                                            <img src={imgUrl(editing.primary_image)} alt="" className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-cream-warm/20 text-[10px] uppercase tracking-wider">No image</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Hover Image</label>
                                    <input type="file" accept="image/*" onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setEditHoverImage(file);
                                        setEditHoverPreview(file ? URL.createObjectURL(file) : "");
                                    }}
                                        className="w-full text-cream-warm/50 text-xs file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:uppercase file:tracking-wider file:bg-gold/20 file:text-gold file:cursor-pointer hover:file:bg-gold/30 transition" />
                                    <div className="mt-2 w-full h-32 rounded-md border border-white/[0.08] bg-[#0d0b14] flex items-center justify-center overflow-hidden">
                                        {editHoverPreview ? (
                                            <img src={editHoverPreview} alt="" className="w-full h-full object-contain" />
                                        ) : editing.hover_image ? (
                                            <img src={imgUrl(editing.hover_image)} alt="" className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-cream-warm/20 text-[10px] uppercase tracking-wider">No image</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button type="submit" disabled={submitting}
                                className="w-full mt-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider bg-gold text-[#0d0b14] rounded-md hover:bg-gold/90 transition disabled:opacity-50">
                                {submitting ? "Saving..." : "Save Changes"}
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
    const { toast } = useToast();
    const [judges, setJudges] = useState<{ id: number; name: string; judge_code: string; pageants: { id: number; name: string }[] }[]>([]);
    const [pageants, setPageants] = useState<Pageant[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [judgeName, setJudgeName] = useState("");
    const [judgePageantId, setJudgePageantId] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchJudges = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/judges", { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) setJudges(await res.json());
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchJudges();
        const token = localStorage.getItem("token");
        fetch(`http://localhost:8000/api/pageants?page=1&per_page=50`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => { if (data) setPageants(data.data ?? []); })
            .catch(() => {});
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!judgeName.trim()) return;
        setSubmitting(true);
        const token = localStorage.getItem("token");
        try {
            const pageantIds = judgePageantId ? [parseInt(judgePageantId)] : [];
            const res = await fetch("http://localhost:8000/api/judges", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: judgeName, pageant_ids: pageantIds }),
            });
            if (!res.ok) throw new Error("Failed to add judge");
            const data = await res.json();
            toast(`Judge added! Code: ${data.judge.code}`);
            setJudgeName("");
            setJudgePageantId("");
            setShowModal(false);
            await fetchJudges();
        } catch { toast("Failed to add judge", "error"); } finally { setSubmitting(false); }
    };

    const handleDelete = async () => {
        if (!deleting) return;
        setSubmitting(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8000/api/judges/${deleting}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete judge");
            setDeleting(null);
            toast("Judge removed!");
            await fetchJudges();
        } catch { toast("Failed to delete judge", "error"); } finally { setSubmitting(false); }
    };

    return (
        <div className="max-w-5xl space-y-5">
            <div className="flex items-center justify-end">
                <button onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-gold text-[#0d0b14] rounded-md hover:bg-gold/90 transition">
                    <SvgIcon d="M12 4v16m8-8H4" className="w-3.5 h-3.5" /> Add Judge
                </button>
            </div>

            {loading ? (
                <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ background: '#13111f' }}>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.06] text-left text-cream-warm/30 text-[10px] uppercase tracking-wider">
                                <th className="px-5 py-3 font-semibold">Name</th>
                                <th className="px-5 py-3 font-semibold">Code</th>
                                <th className="px-5 py-3 font-semibold">Assigned To</th>
                                <th className="px-5 py-3 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 2 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-1/3" /></td>
                                    <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-16" /></td>
                                    <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-1/2" /></td>
                                    <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-16 ml-auto" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : judges.length === 0 ? (
                <div className="rounded-xl border border-white/[0.06] p-10 text-center" style={{ background: '#13111f' }}>
                    <svg className="w-8 h-8 text-cream-warm/10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    <p className="text-sm text-cream-warm/30">No judges added yet.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ background: '#13111f' }}>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.06] text-left text-cream-warm/30 text-[10px] uppercase tracking-wider">
                                <th className="px-5 py-3 font-semibold">Name</th>
                                <th className="px-5 py-3 font-semibold">Code</th>
                                <th className="px-5 py-3 font-semibold">Assigned To</th>
                                <th className="px-5 py-3 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {judges.map((j) => (
                                <tr key={j.id} className="hover:bg-white/[0.02] transition">
                                    <td className="px-5 py-3.5 text-cream-warm font-medium">{j.name}</td>
                                    <td className="px-5 py-3.5 font-mono text-xs text-gold font-semibold">{j.judge_code}</td>
                                    <td className="px-5 py-3.5 text-cream-warm/50 text-xs">
                                        {j.pageants?.length ? j.pageants.map((p) => p.name).join(", ") : "—"}
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <button onClick={() => setDeleting(j.id)}
                                            className="p-2 border border-red-400/30 text-red-400 rounded-md hover:bg-red-500/10 transition" title="Remove judge">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

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
                            <div>
                                <label className="text-[9px] uppercase tracking-[0.18em] text-cream-warm/40 block mb-1.5 font-semibold">Assign to Pageant</label>
                                <select value={judgePageantId} onChange={(e) => setJudgePageantId(e.target.value)}
                                    className="w-full bg-[#0d0b14] border border-white/[0.08] text-cream-warm px-4 py-2.5 rounded-md focus:outline-none focus:border-gold/50 text-sm">
                                    <option value="">Not assigned</option>
                                    {pageants.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider border border-white/[0.1] text-cream-warm/40 rounded-md hover:bg-white/5 transition">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting}
                                    className="flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider bg-gold text-[#0d0b14] rounded-md hover:bg-gold/90 transition disabled:opacity-50">
                                    {submitting ? "Adding..." : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="border border-white/[0.08] rounded-xl p-8 max-w-sm w-full shadow-2xl text-center" style={{ background: '#100e1a' }}>
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="font-display text-lg font-bold text-cream-warm mb-2">Remove Judge</h3>
                        <p className="text-sm text-cream-warm/50 mb-6">Are you sure you want to remove this judge?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleting(null)} disabled={submitting}
                                className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border border-white/[0.1] text-cream-warm/50 rounded-md hover:bg-white/5 transition disabled:opacity-50">
                                Cancel
                            </button>
                            <button onClick={handleDelete} disabled={submitting}
                                className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-red-500/20 border border-red-500/40 text-red-400 rounded-md hover:bg-red-500/30 transition disabled:opacity-50">
                                {submitting ? "Removing..." : "Remove"}
                            </button>
                        </div>
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
    const { toast } = useToast();
    const [pageants, setPageants] = useState<Pageant[]>([]);
    const [loading, setLoading] = useState(true);
    const [terminatingId, setTerminatingId] = useState<number | null>(null);
    const [confirmId, setConfirmId] = useState<number | null>(null);

    const fetchPageants = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8000/api/pageants", { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) {
                const data = await res.json();
                setPageants(data.data || data);
            }
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    useEffect(() => { fetchPageants(); }, []);

    const handleTerminate = async (id: number) => {
        const pageant = pageants.find((p) => p.id === id);
        if (!pageant) return;
        setTerminatingId(id);
        setConfirmId(null);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:8000/api/pageants/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    name: pageant.name,
                    country: pageant.country,
                    province: pageant.province,
                    city: pageant.city,
                    barangay: pageant.barangay,
                    zip: pageant.zip,
                    date: pageant.date,
                    status: "Terminated",
                }),
            });
            if (!res.ok) throw new Error("Failed to terminate pageant");
            const updated = await res.json();
            setPageants((prev) => prev.map((p) => p.id === updated.id ? updated : p));
            toast("Pageant terminated");
        } catch {
            toast("Failed to terminate pageant", "error");
        } finally { setTerminatingId(null); }
    };

    return (
        <div className="max-w-5xl space-y-6">
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

            {/* Pageants Management */}
            <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ background: '#13111f' }}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                    <div>
                        <div className="flex items-center gap-2">
                            <SvgIcon d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" className="w-4 h-4 text-red-400/60" />
                            <h3 className="font-display text-base font-bold text-cream-warm">Danger Zone</h3>
                        </div>
                        <p className="text-[10px] text-cream-warm/25 uppercase tracking-widest mt-0.5">Terminate pageants</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.06] text-left text-cream-warm/30 text-[10px] uppercase tracking-wider">
                                <th className="px-5 py-3 font-semibold">Name</th>
                                <th className="px-5 py-3 font-semibold">Date</th>
                                <th className="px-5 py-3 font-semibold">Status</th>
                                <th className="px-5 py-3 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {loading ? (
                                Array.from({ length: 2 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-3/4" /></td>
                                        <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-1/3" /></td>
                                        <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-20" /></td>
                                        <td className="px-5 py-3.5"><div className="h-4 bg-white/10 rounded w-16 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : pageants.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-5 py-8 text-center text-cream-warm/25 text-sm">No pageants yet.</td>
                                </tr>
                            ) : (
                                pageants.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/[0.02] transition">
                                        <td className="px-5 py-3.5 text-cream-warm font-medium">{p.name}</td>
                                        <td className="px-5 py-3.5 text-cream-warm/50">{new Date(p.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</td>
                                        <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                                        <td className="px-5 py-3.5 text-right">
                                            {p.status !== "Terminated" ? (
                                                <button onClick={() => setConfirmId(p.id)} disabled={terminatingId === p.id}
                                                    className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-red-500/30 bg-red-500/[0.08] text-red-400 rounded-md hover:bg-red-500/20 transition disabled:opacity-50">
                                                    {terminatingId === p.id ? "Terminating..." : "Terminate"}
                                                </button>
                                            ) : (
                                                <span className="text-[10px] text-cream-warm/25">Terminated</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {confirmId && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setConfirmId(null)}>
                    <div className="border border-red-500/30 rounded-xl p-6 max-w-sm w-full shadow-2xl" style={{ background: '#100e1a' }} onClick={(e) => e.stopPropagation()}>
                        <h4 className="font-display text-base font-bold text-cream-warm mb-2">Terminate Pageant?</h4>
                        <p className="text-sm text-cream-warm/50 leading-relaxed mb-6">
                            Once terminated, this pageant will be kept in the system for record-keeping purposes but will no longer be active or running.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmId(null)}
                                className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border border-white/[0.1] text-cream-warm/50 rounded-md hover:bg-white/5 transition">
                                Cancel
                            </button>
                            <button onClick={() => handleTerminate(confirmId)}
                                className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-red-500/20 border border-red-500/30 text-red-400 rounded-md hover:bg-red-500/30 transition">
                                Yes, Terminate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

