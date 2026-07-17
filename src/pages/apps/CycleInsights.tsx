import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, Droplet, Calendar as CalendarIcon, Milestone } from "lucide-react";

const CTA = "#EF4E3B";
const PINK_LINE = "#E86B7A";

type Log = { flow?: string; mood?: string; symptoms?: string[]; productCount?: number };

function toISO(d: Date) { return d.toISOString().slice(0, 10); }

const FLOW_LEVEL: Record<string, number> = { spotting: 1, light: 2, medium: 3, heavy: 4 };
const FLOW_LABEL_BY_LEVEL: Record<number, string> = { 1: "Spotting", 2: "Light", 3: "Medium", 4: "Heavy" };

function computeCycles(periodDays: string[]) {
  if (!periodDays.length) return [];
  const sorted = [...periodDays].sort();
  const runs: string[][] = [];
  let cur: string[] = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curD = new Date(sorted[i]);
    if ((curD.getTime() - prev.getTime()) / 86400000 === 1) cur.push(sorted[i]);
    else { runs.push(cur); cur = [sorted[i]]; }
  }
  runs.push(cur);
  return runs;
}

function formatRange(run: string[]) {
  const s = new Date(run[0]);
  const e = new Date(run[run.length - 1]);
  const opt: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
  return `${s.toLocaleDateString("en", opt)} - ${e.toLocaleDateString("en", opt)}`;
}

function FlowChart({ points }: { points: { date: string; level: number }[] }) {
  if (points.length < 2) return null;
  const w = 320, h = 200, pad = 40;
  const xs = points.map((_, i) => pad + (i * (w - pad * 2)) / (points.length - 1));
  const ys = points.map((p) => pad + ((4 - p.level) / 3) * (h - pad * 2));
  // Smooth cubic path
  let d = `M ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < xs.length; i++) {
    const cx = (xs[i - 1] + xs[i]) / 2;
    d += ` C ${cx} ${ys[i - 1]}, ${cx} ${ys[i]}, ${xs[i]} ${ys[i]}`;
  }
  const rowsLabels = [4, 3, 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {rowsLabels.map((lv) => {
        const y = pad + ((4 - lv) / 3) * (h - pad * 2);
        return (
          <g key={lv}>
            <text x={4} y={y + 4} fontSize="10" fill="#9CA3AF">{FLOW_LABEL_BY_LEVEL[lv]}</text>
            <line x1={pad} y1={y} x2={w - 4} y2={y} stroke="#E5E7EB" strokeDasharray="3 3" />
          </g>
        );
      })}
      <path d={d} fill="none" stroke={PINK_LINE} strokeWidth={3} strokeLinecap="round" />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r={5} fill={PINK_LINE} />
      ))}
      {xs.map((x, i) => (
        <text key={i} x={x} y={h - 8} textAnchor="middle" fontSize="10" fill="#9CA3AF">
          {new Date(points[i].date).toLocaleDateString("en", { month: "short", day: "numeric" })}
        </text>
      ))}
    </svg>
  );
}

function MoodBar({ counts }: { counts: Record<string, number> }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (!total) return null;
  const colors: Record<string, string> = { happy: "#F66B9A", neutral: "#F59E0B", sad: "#60A5FA", anxious: "#A78BFA" };
  return (
    <div className="mt-3 space-y-2">
      {Object.entries(counts).map(([k, v]) => (
        <div key={k} className="flex items-center gap-3">
          <span className="w-16 text-sm capitalize text-neutral-700">{k}</span>
          <div className="flex-1 h-3 rounded-full bg-neutral-100 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(v / total) * 100}%`, background: colors[k] || "#999" }} />
          </div>
          <span className="w-6 text-right text-sm text-neutral-600">{v}</span>
        </div>
      ))}
    </div>
  );
}

export function InsightsBody({ embedded = false }: { embedded?: boolean } = {}) {
  const periodDays: string[] = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("cycle_period_days") || "[]"); }
    catch { return []; }
  }, []);
  const logs: Record<string, Log> = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("cycle_logs") || "{}"); }
    catch { return {}; }
  }, []);
  const onboarding = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("cycle_onboarding") || "{}"); }
    catch { return {}; }
  }, []);

  const cycles = computeCycles(periodDays);
  const lastCycle = cycles[cycles.length - 1];
  const lastCycleRange = lastCycle ? formatRange(lastCycle) : "—";
  const periodLength = lastCycle ? lastCycle.length : 0;

  let cycleLength = 0;
  if (cycles.length >= 2) {
    const a = new Date(cycles[cycles.length - 2][0]);
    const b = new Date(cycles[cycles.length - 1][0]);
    cycleLength = Math.round((b.getTime() - a.getTime()) / 86400000);
  } else if (cycles.length === 1) {
    cycleLength = onboarding.cycleDays ?? 0;
  }

  const flowPoints = (lastCycle || [])
    .map((iso) => ({ date: iso, level: FLOW_LEVEL[logs[iso]?.flow || ""] || 0 }))
    .filter((p) => p.level > 0);

  const moodCounts: Record<string, number> = {};
  (lastCycle || []).forEach((iso) => {
    const m = logs[iso]?.mood;
    if (m) moodCounts[m] = (moodCounts[m] || 0) + 1;
  });

  const symCounts: Record<string, number> = {};
  (lastCycle || []).forEach((iso) => {
    (logs[iso]?.symptoms || []).forEach((s) => {
      if (s === "none") return;
      symCounts[s] = (symCounts[s] || 0) + 1;
    });
  });

  const prodDays = (lastCycle || []).filter((iso) => (logs[iso]?.productCount ?? 0) > 0);
  const avgProducts = prodDays.length
    ? Math.round(prodDays.reduce((s, iso) => s + (logs[iso]?.productCount || 0), 0) / prodDays.length)
    : 0;

  const hasFlow = flowPoints.length > 0;
  const hasMood = Object.keys(moodCounts).length > 0;
  const hasSym = Object.keys(symCounts).length > 0;

  const padX = embedded ? "" : "px-5";

  return (
    <div className={embedded ? "" : "pb-4"}>
      {!embedded && (
        <div className={`${padX} flex items-center justify-between`}>
          <h1 className="text-3xl font-bold">Insights</h1>
          <button className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Cycles logged pill */}
      <div className={`${padX} ${embedded ? "mt-2" : "mt-6"}`}>
        <div className="w-full rounded-full text-white text-xl font-semibold py-4 text-center"
             style={{ background: CTA }}>
          {cycles.length} {cycles.length === 1 ? "cycle" : "cycles"} logged
        </div>
        <p className="mt-3 text-center text-neutral-700">Log consistently for better insights</p>
      </div>


      {/* Your flow */}
      <div className="px-5 mt-6">
        <div className="rounded-2xl bg-neutral-50 p-5">
          <p className="text-lg font-semibold">Your flow</p>
          <p className="mt-1 text-base" style={{ color: CTA }}>
            {hasFlow ? lastCycleRange : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 p-5 mt-3">
          {hasFlow ? (
            <FlowChart points={flowPoints} />
          ) : (
            <p className="py-12 text-center text-neutral-500 leading-relaxed">
              It looks like you haven't added your period flow details yet. Logging this info can improve your health insights.
            </p>
          )}
        </div>
      </div>

      {/* Your last cycle */}
      <div className="px-5 mt-6">
        <div className="rounded-2xl bg-neutral-50 p-5">
          <p className="text-lg font-semibold">Your last cycle</p>
          <p className="mt-1 text-xl font-semibold" style={{ color: CTA }}>{lastCycleRange}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 p-5 mt-3 space-y-3">
          <Row icon={<Droplet className="w-5 h-5" style={{ color: CTA }} />} label="Period length:" value={`${periodLength} days`} />
          <Row icon={<CalendarIcon className="w-5 h-5" style={{ color: CTA }} />} label="Cycle length:" value={`${cycleLength} days`} />
          <Row icon={<Milestone className="w-5 h-5" style={{ color: CTA }} />} label="Period products changed:" value={`${avgProducts} a day`} />
        </div>
      </div>

      {/* Mood */}
      <div className="px-5 mt-6">
        <div className="rounded-2xl bg-neutral-50 p-5">
          <p className="text-lg font-semibold">Mood Tracker</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 p-5 mt-3">
          {hasMood ? (
            <MoodBar counts={moodCounts} />
          ) : (
            <p className="py-8 text-center text-neutral-500 leading-relaxed">
              It looks like you haven't added your moods for this cycle yet. Logging this info can improve your health insights.
            </p>
          )}
        </div>
      </div>

      {/* Symptoms */}
      <div className="px-5 mt-6">
        <div className="rounded-2xl bg-neutral-50 p-5">
          <p className="text-lg font-semibold">Symptoms Tracker</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 p-5 mt-3">
          {hasSym ? (
            <div className="flex flex-wrap gap-2">
              {Object.entries(symCounts).map(([k, v]) => (
                <span key={k} className="px-3 py-1.5 rounded-full text-sm capitalize"
                      style={{ background: "#FFF3E4", color: CTA }}>
                  {k} · {v}
                </span>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-neutral-500 leading-relaxed">
              It looks like you haven't added your symptoms for this cycle yet. Logging this info can improve your health insights.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <span className="flex-1 text-neutral-800">{label}</span>
      <span className="text-neutral-800">{value}</span>
    </div>
  );
}
