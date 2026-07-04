'use client';

import { useMemo, useState, type CSSProperties } from 'react';

/**
 * ScoreSheet — Next.js + Tailwind conversion
 * -------------------------------------------------
 * Drop this file in e.g. `components/ScoreSheet.tsx` and render it from a
 * page (it's a client component because it holds interactive state).
 *
 * All the original hex values from the HTML version are kept as CSS
 * variables (defined inline on the root wrapper) and consumed through
 * Tailwind's arbitrary-value syntax, e.g. `bg-[color:var(--gold)]`.
 * This keeps the exact palette while letting everything else be
 * expressed with Tailwind utility classes.
 */

// ---------------------------------------------------------------------------
// Types & seed data
// ---------------------------------------------------------------------------

type Scores = [number, number, number]; // [Beauty /30, Intelligence /40, Poise /30]

interface Candidate {
  id: string;
  name: string;
  origin: string;
  init: string;
  scores: Scores;
}

const MAX_SCORES: Scores = [30, 40, 30];

const INITIAL_CANDIDATES: Candidate[] = [
  { id: '04', name: 'Maria Santos', origin: 'Laguna', scores: [28, 38, 26], init: 'MS' },
  { id: '07', name: 'Sofia Reyes', origin: 'Batangas', scores: [27, 36, 26], init: 'SR' },
  { id: '01', name: 'Anne Torres', origin: 'Manila', scores: [26, 35, 26], init: 'AT' },
  { id: '11', name: 'Claire Mendoza', origin: 'Cavite', scores: [25, 35, 24], init: 'CM' },
  { id: '09', name: 'Lea Garcia', origin: 'Rizal', scores: [25, 33, 23], init: 'LG' },
  { id: '03', name: 'Bea Villanueva', origin: 'Bulacan', scores: [24, 32, 22], init: 'BV' },
  { id: '06', name: 'Iris Castillo', origin: 'Pampanga', scores: [23, 31, 22], init: 'IC' },
  { id: '02', name: 'Diana Cruz', origin: 'Quezon City', scores: [22, 30, 21], init: 'DC' },
  { id: '10', name: 'Mia Dela Cruz', origin: 'Pasig', scores: [21, 29, 20], init: 'MD' },
  { id: '05', name: 'Rosa Ocampo', origin: 'Caloocan', scores: [20, 28, 19], init: 'RO' },
  { id: '08', name: 'Tina Lopez', origin: 'Marikina', scores: [18, 26, 18], init: 'TL' },
  { id: '12', name: 'Vera Aquino', origin: 'Antipolo', scores: [17, 25, 17], init: 'VA' },
];

const EVENTS = ['Preliminary Round', 'Semi-Finals', 'Grand Finals'];

// Root CSS variables — same values as the original stylesheet.
const themeVars: CSSProperties = {
  ['--purple-deep' as string]: '#0E0A1F',
  ['--purple-mid' as string]: '#1A1235',
  ['--purple-card' as string]: '#1E1540',
  ['--purple-hover' as string]: '#261B50',
  ['--gold' as string]: '#C5A059',
  ['--gold-light' as string]: '#D4B472',
  ['--gold-shimmer' as string]: '#E8C87A',
  ['--gold-dim' as string]: 'rgba(197,160,89,0.15)',
  ['--gold-border' as string]: 'rgba(197,160,89,0.25)',
  ['--gold-border-strong' as string]: 'rgba(197,160,89,0.5)',
  ['--cream' as string]: '#F5EDD8',
  ['--cream-dim' as string]: 'rgba(245,237,216,0.6)',
  ['--cream-muted' as string]: 'rgba(245,237,216,0.35)',
  ['--text-muted' as string]: 'rgba(245,237,216,0.45)',
  ['--success' as string]: '#4CAF7D',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function total(c: Candidate) {
  return c.scores[0] + c.scores[1] + c.scores[2];
}

function rankBadgeClasses(rank: number) {
  switch (rank) {
    case 0:
      return 'text-[color:var(--gold-shimmer)] border border-[color:var(--gold)] bg-[color:var(--gold-dim)]';
    case 1:
      return 'text-[rgba(192,192,192,0.9)] border border-[rgba(192,192,192,0.3)] bg-[rgba(192,192,192,0.05)]';
    case 2:
      return 'text-[rgba(205,127,50,0.9)] border border-[rgba(205,127,50,0.3)] bg-[rgba(205,127,50,0.05)]';
    default:
      return 'text-[color:var(--text-muted)] border border-white/10';
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface ScoreSheetProps {
  /** Optional hook for the "↗" action buttons (export, validate, tiebreakers…). */
  onAction?: (prompt: string) => void;
}

export default function ScoreSheet({ onAction }: ScoreSheetProps) {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [activeEvent, setActiveEvent] = useState(EVENTS[0]);

  const [selectedId, setSelectedId] = useState<string>(INITIAL_CANDIDATES[0].id);

  const sorted = useMemo(
    () => [...candidates].sort((a, b) => total(b) - total(a)),
    [candidates],
  );

  const topFive = useMemo(
    () => [...candidates].sort((a, b) => total(b) - total(a)).slice(0, 5),
    [candidates],
  );

  const maxTotal = sorted.length ? total(sorted[0]) : 100;

  function updateScore(candidateId: string, scoreIdx: number, rawValue: number) {
    const max = MAX_SCORES[scoreIdx];
    const clamped = Number.isFinite(rawValue) ? Math.max(0, Math.min(max, rawValue)) : 0;
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== candidateId) return c;
        const next = [...c.scores] as Scores;
        next[scoreIdx] = clamped;
        return { ...c, scores: next };
      }),
    );
  }

  function fire(prompt: string) {
    onAction?.(prompt);
  }

  return (
    <div
      style={themeVars}
      className="relative min-h-screen overflow-hidden bg-[color:var(--purple-deep)] font-serif"
    >
      {/* ambient background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(197,160,89,0.08) 0%, transparent 55%)',
        }}
      />
      <span className="pointer-events-none absolute left-[8%] top-[12%] z-0 h-3.5 w-3.5 rotate-45 border border-[color:var(--gold-border)] opacity-40" />
      <span className="pointer-events-none absolute right-[6%] top-[30%] z-0 h-5 w-5 rotate-45 border border-[color:var(--gold-border)] opacity-20" />
      <span className="pointer-events-none absolute left-[12%] top-[60%] z-0 h-2.5 w-2.5 rotate-45 border border-[color:var(--gold-border)] opacity-25" />
      <span className="pointer-events-none absolute bottom-[20%] right-[15%] z-0 h-4 w-4 rotate-45 border border-[color:var(--gold-border)] opacity-30" />

      {/* Top bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--gold-border)] bg-[color:var(--purple-deep)]/80 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-0.5">
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[color:var(--gold)] opacity-70">
            Dashboard&nbsp;›&nbsp;Events&nbsp;›&nbsp;Score Sheet
          </span>
          <span className="text-[17px] font-bold tracking-wide text-[color:var(--cream)] sm:text-xl">
            Score Sheet
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => fire('How do I export the score sheet to PDF or Excel?')}
            className="border border-[color:var(--gold-border-strong)] px-4 py-2 font-sans text-[11px] uppercase tracking-[0.12em] text-[color:var(--gold)] transition hover:bg-[color:var(--gold-dim)]"
          >
            Export ↗
          </button>
          <button
            onClick={() => fire('How does the score validation work?')}
            className="border border-[color:var(--gold-border-strong)] px-4 py-2 font-sans text-[11px] uppercase tracking-[0.12em] text-[color:var(--gold)] transition hover:bg-[color:var(--gold-dim)]"
          >
            Validate ↗
          </button>
          <button className="bg-[color:var(--gold)] px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-[#0E0A1F] transition hover:bg-[color:var(--gold-shimmer)]">
            Finalize Round
          </button>
        </div>
      </div>

      <div className="relative z-10 px-4 py-7 sm:px-6">
        {/* Event selector */}
        <div className="mb-6 flex flex-wrap gap-3">
          {EVENTS.map((ev) => (
            <button
              key={ev}
              onClick={() => setActiveEvent(ev)}
              className={`border px-4 py-1.5 font-sans text-[11px] uppercase tracking-[0.15em] transition ${
                activeEvent === ev
                  ? 'border-[color:var(--gold)] bg-[color:var(--gold-dim)] text-[color:var(--gold)]'
                  : 'border-[color:var(--gold-border)] text-[color:var(--cream-dim)] hover:border-[color:var(--gold-border-strong)] hover:text-[color:var(--cream)]'
              }`}
            >
              {ev}
            </button>
          ))}
        </div>

        {/* Stat cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Candidates" value="12" sub="All confirmed" />

          <StatCard label="Completion" value="60" valueSuffix="%" sub="36 of 60 scores" />
          <StatCard
            label="Current Leader"
            value={`Candidate ${sorted[0]?.id ?? '—'}`}
            valueClassName="text-[15px] text-[color:var(--gold)]"
            sub={`Avg ${sorted[0] ? total(sorted[0]).toFixed(1) : '—'} pts`}
          />
        </div>

        {/* Overview panels */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="border border-[color:var(--gold-border)] bg-[color:var(--purple-card)] p-4">
            <div className="mb-2.5 font-sans text-[9px] uppercase tracking-[0.2em] text-[color:var(--gold)] opacity-60">
              Top Candidates (avg)
            </div>
            <div className="flex flex-col gap-2">
              {topFive.map((c) => {
                const t = total(c);
                return (
                  <div key={c.id} className="flex items-center gap-2">
                    <span className="w-[110px] flex-shrink-0 truncate font-sans text-[11px] text-[color:var(--cream-dim)]">
                      Cand. {c.id} · {c.name.split(' ')[0]}
                    </span>
                    <div className="relative h-[3px] flex-1 overflow-hidden bg-white/[0.07]">
                      <div
                        className="absolute inset-y-0 left-0 bg-[color:var(--gold)] opacity-80"
                        style={{ width: `${t}%` }}
                      />
                    </div>
                    <span className="w-7 flex-shrink-0 text-right font-sans text-[11px] font-bold text-[color:var(--cream)]">
                      {t}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>


        </div>

        {/* Score table */}
        <div className="border border-[color:var(--gold-border)] bg-[color:var(--purple-card)]">
          {/* Criteria legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-3.5">
            <div className="flex flex-wrap gap-4">
              <LegendItem color="var(--gold)" label="Beauty (30 pts)" />
              <LegendItem color="#7F77DD" label="Intelligence (40 pts)" />
              <LegendItem color="#4CAF7D" label="Poise (30 pts)" />
            </div>
          </div>

          {/* Table header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[color:var(--gold-border)] px-5 py-4">
            <span className="text-[13px] font-bold tracking-wide text-[color:var(--cream)]">
              {activeEvent} — Individual Scores
            </span>
  
          </div>

          <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b border-[color:var(--gold-border)] py-2.5 pl-5 text-center font-sans text-[9px] uppercase tracking-[0.18em] text-[color:var(--gold)] opacity-75">
                    Rank
                  </th>
                  <th className="w-[200px] whitespace-nowrap border-b border-[color:var(--gold-border)] px-4 py-2.5 text-left font-sans text-[9px] uppercase tracking-[0.18em] text-[color:var(--gold)] opacity-75">
                    Candidate
                  </th>
                  <th className="whitespace-nowrap border-b border-[color:var(--gold-border)] px-4 py-2.5 text-center font-sans text-[9px] uppercase tracking-[0.18em] text-[color:var(--gold)]">
                    Beauty
                    <br />
                    <span className="text-[8px] font-normal tracking-[0.1em] opacity-50">/30</span>
                  </th>
                  <th className="whitespace-nowrap border-b border-[color:var(--gold-border)] px-4 py-2.5 text-center font-sans text-[9px] uppercase tracking-[0.18em] text-[#9F9BDF]">
                    Intelligence
                    <br />
                    <span className="text-[8px] font-normal tracking-[0.1em] opacity-50">/40</span>
                  </th>
                  <th className="whitespace-nowrap border-b border-[color:var(--gold-border)] px-4 py-2.5 text-center font-sans text-[9px] uppercase tracking-[0.18em] text-[#4CAF7D]">
                    Poise
                    <br />
                    <span className="text-[8px] font-normal tracking-[0.1em] opacity-50">/30</span>
                  </th>
                  <th className="whitespace-nowrap border-b border-[color:var(--gold-border)] px-4 py-2.5 text-center font-sans text-[9px] uppercase tracking-[0.18em] text-[color:var(--gold)] opacity-75">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((c, i) => {
                  const t = total(c);
                  const barPct = Math.max(0, Math.min(100, Math.round((t / 100) * 100)));
                  const isTop = t === maxTotal;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
                      className={`cursor-pointer border-b border-[rgba(197,160,89,0.08)] transition hover:bg-white/[0.12] last:border-b-0 ${
                        selectedId === c.id ? 'bg-[rgba(197,160,89,0.05)]' : ''
                      }`}
                    >
                      <td className="p-0 text-center align-middle">
                        <div className="flex items-center justify-center py-3.5">
                          <span
                            className={`flex h-7 w-7 items-center justify-center font-sans text-xs font-bold ${rankBadgeClasses(
                              i,
                            )}`}
                          >
                            {i + 1}
                          </span>
                        </div>
                      </td>
                      <td className="p-0 align-middle">
                        <div className="flex items-center gap-3 px-4 py-3.5">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-[color:var(--gold-border-strong)] bg-[color:var(--gold-dim)] font-sans text-[11px] font-bold tracking-wide text-[color:var(--gold)]">
                            {c.init}
                          </div>
                          <div>
                            <div className="text-sm font-semibold leading-tight text-[color:var(--cream)]">
                              # {c.id} &nbsp; {c.name}
                            </div>
                            <div className="mt-0.5 font-sans text-[10px] tracking-[0.08em] text-[color:var(--text-muted)]">
                              {c.origin}
                            </div>
                          </div>
                        </div>
                      </td>
                      {([0, 1, 2] as const).map((scoreIdx) => (
                        <td key={scoreIdx} className="p-0 text-center align-middle">
                          <div className="flex flex-col items-center gap-1 px-4 py-3.5">
                            <input
                              type="number"
                              value={c.scores[scoreIdx]}
                              min={0}
                              max={MAX_SCORES[scoreIdx]}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updateScore(c.id, scoreIdx, parseInt(e.target.value, 10))}
                              className={`h-[34px] w-[54px] border font-sans text-[15px] font-bold outline-none transition focus:bg-[color:var(--purple-hover)] focus:border-[color:var(--gold)] ${
                                c.scores[scoreIdx] === MAX_SCORES[scoreIdx]
                                  ? 'border-[color:var(--gold)] bg-[color:var(--purple-mid)] text-[color:var(--gold-shimmer)]'
                                  : 'border-[color:var(--gold-border)] bg-[color:var(--purple-mid)] text-[color:var(--cream)]'
                              } text-center`}
                            />
                            <span className="font-sans text-[9px] tracking-[0.1em] text-[color:var(--text-muted)]">
                              /{MAX_SCORES[scoreIdx]}
                            </span>
                          </div>
                        </td>
                      ))}
                      <td className="p-0 text-center align-middle">
                        <div className="px-4 py-3.5">
                          <div
                            className={`font-sans text-lg font-bold ${
                              isTop ? 'text-[color:var(--gold-shimmer)]' : 'text-[color:var(--cream)]'
                            }`}
                          >
                            {t}
                          </div>
                          <div className="relative mx-auto mt-1 h-1 w-[70px] overflow-hidden bg-white/[0.08]">
                            <div
                              className="absolute inset-y-0 left-0 bg-[color:var(--gold)] transition-[width]"
                              style={{ width: `${barPct}%` }}
                            />
                          </div>
                          <div className="mt-0.5 font-sans text-[10px] text-[color:var(--text-muted)]">{t}%</div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[color:var(--gold-border)] px-5 py-3">
            <div className="flex items-center gap-1.5 font-sans text-[10px] tracking-[0.08em] text-[color:var(--text-muted)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--success)]" />
              Scores save automatically · Ranked by current total
            </div>
            <button
              onClick={() => fire('What happens if two candidates have tied scores?')}
              className="border border-[color:var(--gold-border-strong)] px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.12em] text-[color:var(--gold)] transition hover:bg-[color:var(--gold-dim)]"
            >
              Tiebreaker rules ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small presentational subcomponents
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  valueSuffix,
  sub,
  valueClassName,
}: {
  label: string;
  value: string;
  valueSuffix?: string;
  sub: string;
  valueClassName?: string;
}) {
  return (
    <div className="relative overflow-hidden border border-[color:var(--gold-border)] bg-[color:var(--purple-card)] p-4">
      <div
        className="absolute inset-x-0 top-0 h-0.5 opacity-50"
        style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
      />
      <div className="mb-1.5 font-sans text-[9px] uppercase tracking-[0.2em] text-[color:var(--gold)] opacity-70">
        {label}
      </div>
      <div className={`text-[22px] font-bold leading-none text-[color:var(--cream)] sm:text-[28px] ${valueClassName ?? ''}`}>
        {value}
        {valueSuffix && <span className="text-base opacity-60">{valueSuffix}</span>}
      </div>
      <div className="mt-1 font-sans text-[10px] text-[color:var(--text-muted)]">{sub}</div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.1em] text-[color:var(--cream-muted)]">
      <span className="h-2 w-2 flex-shrink-0 rounded-[1px]" style={{ backgroundColor: color, opacity: 0.9 }} />
      {label}
    </div>
  );
}