import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import MiniAppShell from "@/components/MiniAppShell";
import AppLockGate from "@/components/AppLockGate";
import { getMiniApp } from "@/data/miniApps";
import { Calendar as CalendarIcon, LayoutDashboard, Plus, ChevronDown, Info, BarChart3 } from "lucide-react";

// ─── Colors (burgundy palette from reference) ───────────────────────────────
const BURGUNDY = "#5B0A0A";
const WINE = "#7A1F1F";
const RUST = "#A0522D";
const OCHRE = "#B8860B";
const CTA = "#EF4E3B";
const CREAM = "#FBEEE1";
const PERIOD_DOT = "#B32222";

// ─── Config ─────────────────────────────────────────────────────────────────
// Days 1..28 phase map (based on stored onboarding, or defaults)
type Phase = "menstrual" | "follicular" | "ovular" | "luteal";
function getPhase(day: number, periodLen = 5, cycleLen = 28): Phase {
  if (day <= periodLen) return "menstrual";
  const ovStart = Math.round(cycleLen * 0.5) - 1; // ~14
  const ovEnd = ovStart + 2;
  if (day < ovStart) return "follicular";
  if (day <= ovEnd) return "ovular";
  return "luteal";
}

const PHASE_COLORS: Record<Phase, string> = {
  menstrual: BURGUNDY,
  follicular: WINE,
  ovular: RUST,
  luteal: OCHRE,
};
const PHASE_LABEL: Record<Phase, string> = {
  menstrual: "Menstrual",
  follicular: "Follicular",
  ovular: "Ovular",
  luteal: "Luteal",
};

// ─── Ring ───────────────────────────────────────────────────────────────────
function CycleRing({
  size = 280,
  currentDay,
  cycleLen,
  periodLen,
  onLog,
  centerLabel,
}: {
  size?: number;
  currentDay: number;
  cycleLen: number;
  periodLen: number;
  onLog: () => void;
  centerLabel: { date: string; sub: string };
}) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const C = 2 * Math.PI * r;

  // Phase segment lengths in fractions of cycle
  const menstrualEnd = periodLen; // 1..5
  const ovStart = Math.round(cycleLen * 0.5) - 1;
  const ovEnd = ovStart + 2;

  const segs: { phase: Phase; from: number; to: number }[] = [
    { phase: "menstrual", from: 0, to: menstrualEnd },
    { phase: "follicular", from: menstrualEnd, to: ovStart - 1 },
    { phase: "ovular", from: ovStart - 1, to: ovEnd },
    { phase: "luteal", from: ovEnd, to: cycleLen },
  ];

  // Current day marker position on ring
  const angleFor = (day: number) => (day / cycleLen) * 360 - 90;
  const currentAngle = angleFor(currentDay);
  const markerX = cx + r * Math.cos((currentAngle * Math.PI) / 180);
  const markerY = cy + r * Math.sin((currentAngle * Math.PI) / 180);

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring gap */}
        <circle cx={cx} cy={cy} r={r} stroke="transparent" strokeWidth={stroke} fill="none" />
        {segs.map((s, i) => {
          const len = ((s.to - s.from) / cycleLen) * C;
          const offset = (s.from / cycleLen) * C;
          // gap between segments
          const gap = 8;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              stroke={PHASE_COLORS[s.phase]}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${Math.max(0, len - gap)} ${C}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Current day marker */}
      <div
        className="absolute rounded-full border-2 border-white bg-white shadow-md"
        style={{
          width: 26,
          height: 26,
          left: markerX - 13,
          top: markerY - 13,
        }}
      >
        <div className="h-full w-full rounded-full border-2 border-neutral-300" />
      </div>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-medium text-neutral-500">{centerLabel.date}</p>
        <p className="mt-1 text-[22px] font-bold text-neutral-900">{centerLabel.sub}</p>
        <button
          onClick={onLog}
          className="mt-5 flex items-center gap-2 rounded-2xl border-2 bg-white px-6 py-3"
          style={{ borderColor: CTA, color: CTA }}
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
          <span className="text-lg font-semibold">Log Now</span>
        </button>
      </div>
    </div>
  );
}

// ─── Horizontal date strip ──────────────────────────────────────────────────
function DateStrip({ today }: { today: Date }) {
  const days = useMemo(() => {
    const arr: Date[] = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [today]);
  return (
    <div className="flex items-center justify-between px-1 py-3">
      {days.map((d) => {
        const isToday = d.toDateString() === today.toDateString();
        return (
          <div
            key={d.toISOString()}
            className={`flex h-11 w-11 items-center justify-center rounded-full text-lg ${
              isToday ? "border-2 border-neutral-900 font-bold text-neutral-900" : "text-neutral-500"
            }`}
          >
            {d.getDate()}
          </div>
        );
      })}
    </div>
  );
}

// Small blood-drop icon used above period days
function BloodDrop({ size = 10, muted = false }: { size?: number; muted?: boolean }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 10 13" fill="none" aria-hidden>
      <path
        d="M5 0.5C5 0.5 9 5.2 9 8.2C9 10.4 7.2 12.2 5 12.2C2.8 12.2 1 10.4 1 8.2C1 5.2 5 0.5 5 0.5Z"
        fill={muted ? "#F5A9A0" : CTA}
      />
    </svg>
  );
}

// ─── Calendar view ──────────────────────────────────────────────────────────
function MonthCalendar({
  year,
  month,
  today,
  periodDays,
  predictedPeriod,
  onToggle,
}: {
  year: number;
  month: number;
  today: Date;
  periodDays: number[];
  predictedPeriod: number[];
  onToggle: (day: number) => void;
}) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = first.getDay(); // 0=Sun

  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = first.toLocaleString("en", { month: "long" }).toUpperCase();
  const ROW_H = 60;

  // group contiguous runs so we can draw pill backgrounds row by row
  const runs: number[][] = [];
  let cur: number[] = [];
  [...periodDays].sort((a, b) => a - b).forEach((d) => {
    if (cur.length && d === cur[cur.length - 1] + 1) cur.push(d);
    else {
      if (cur.length) runs.push(cur);
      cur = [d];
    }
  });
  if (cur.length) runs.push(cur);

  // split each run into per-row segments
  const pillSegments: { row: number; startCol: number; endCol: number; solid: boolean }[] = [];
  runs.forEach((run) => {
    if (run.length < 2) return; // single day → no pill, just droplet + colored number
    let segStart = run[0];
    for (let i = 1; i <= run.length; i++) {
      const prev = run[i - 1];
      const next = run[i];
      const prevIdx = startWeekday + prev - 1;
      const nextIdx = next != null ? startWeekday + next - 1 : -1;
      const rowBreak = next == null || Math.floor(prevIdx / 7) !== Math.floor(nextIdx / 7);
      if (rowBreak) {
        const startIdx = startWeekday + segStart - 1;
        const endIdx = prevIdx;
        pillSegments.push({
          row: Math.floor(startIdx / 7),
          startCol: startIdx % 7,
          endCol: endIdx % 7,
          solid: true,
        });
        if (next != null) segStart = next;
      }
    }
  });

  return (
    <div className="mt-6">
      <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-neutral-500">
        {monthLabel} {year}
      </p>
      <div className="relative">
        {/* solid pink pills behind contiguous period runs */}
        {pillSegments.map((s, i) => (
          <div
            key={`p-${i}`}
            className="pointer-events-none absolute rounded-full"
            style={{
              top: `calc(${s.row} * ${ROW_H}px + 6px)`,
              left: `calc(${(s.startCol / 7) * 100}% + 4px)`,
              width: `calc(${((s.endCol - s.startCol + 1) / 7) * 100}% - 8px)`,
              height: ROW_H - 12,
              background: "#F9D9D3",
            }}
          />
        ))}

        {/* predicted period: dashed pill outline */}
        {predictedPeriod.length > 0 && (() => {
          const first = predictedPeriod[0];
          const last = predictedPeriod[predictedPeriod.length - 1];
          const firstIdx = startWeekday + first - 1;
          const lastIdx = startWeekday + last - 1;
          if (Math.floor(firstIdx / 7) !== Math.floor(lastIdx / 7)) return null;
          const row = Math.floor(firstIdx / 7);
          const startCol = firstIdx % 7;
          const endCol = lastIdx % 7;
          return (
            <div
              className="pointer-events-none absolute rounded-full border"
              style={{
                top: `calc(${row} * ${ROW_H}px + 6px)`,
                left: `calc(${(startCol / 7) * 100}% + 4px)`,
                width: `calc(${((endCol - startCol + 1) / 7) * 100}% - 8px)`,
                height: ROW_H - 12,
                borderColor: "#F5A9A0",
              }}
            />
          );
        })()}

        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            if (!d) return <div key={i} style={{ height: ROW_H }} />;
            const isToday =
              d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isPeriod = periodDays.includes(d);
            const isPredicted = predictedPeriod.includes(d);
            return (
              <button
                key={i}
                onClick={() => onToggle(d)}
                className="relative flex items-center justify-center"
                style={{ height: ROW_H }}
              >
                {(isPeriod || isPredicted) && (
                  <span className="absolute top-1.5">
                    <BloodDrop muted={isPredicted && !isPeriod} />
                  </span>
                )}
                {isToday ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-neutral-900 text-base font-bold text-neutral-900">
                    {d}
                  </div>
                ) : (
                  <span
                    className="relative text-base"
                    style={{
                      color: isPeriod ? CTA : isPredicted ? "#F5A9A0" : "#111",
                      fontWeight: isPeriod ? 600 : 400,
                    }}
                  >
                    {d}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


// ─── Main ───────────────────────────────────────────────────────────────────
export default function Cycle() {
  const app = getMiniApp("cycle")!;
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("cycle_onboarding")) {
      navigate("/apps/cycle/onboarding", { replace: true });
    }
  }, [navigate]);

  const [tab, setTab] = useState<"dashboard" | "calendar">("dashboard");
  const [yearOpen, setYearOpen] = useState(false);
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  // Load onboarding data if present
  const onboarding = useMemo(() => {
    try {
      const raw = localStorage.getItem("cycle_onboarding");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);
  const cycleLen: number = onboarding?.cycleDays ?? 28;
  const periodLen: number = onboarding?.periodDays ?? 5;

  // Stored period days from Log Period screen (mutable via calendar taps)
  const [storedPeriodDays, setStoredPeriodDays] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("cycle_period_days") || "[]"); }
    catch { return []; }
  });
  const periodDaysForMonth = (y: number, m: number) =>
    storedPeriodDays
      .map((iso) => new Date(iso))
      .filter((d) => d.getFullYear() === y && d.getMonth() === m)
      .map((d) => d.getDate());

  // Predicted period days — projected cycles starting from onboarding lastPeriod
  const lastPeriodStart = useMemo(() => {
    const raw = onboarding?.lastPeriod as string | undefined;
    if (!raw) return null;
    const [dStr, mStr, yStr] = raw.split(" ");
    const monthIdx = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(mStr);
    if (monthIdx < 0) return null;
    return new Date(Number(yStr), monthIdx, Number(dStr));
  }, [onboarding]);

  const predictedForMonth = (y: number, m: number): number[] => {
    if (!lastPeriodStart) return [];
    const actualISO = new Set(storedPeriodDays.map((s) => s.slice(0, 10)));
    const days = new Set<number>();
    for (let k = 0; k < 36; k++) {
      const start = new Date(lastPeriodStart);
      start.setDate(lastPeriodStart.getDate() + k * cycleLen);
      for (let j = 0; j < periodLen; j++) {
        const d = new Date(start);
        d.setDate(start.getDate() + j);
        if (d.getFullYear() === y && d.getMonth() === m) {
          const iso = d.toISOString().slice(0, 10);
          if (!actualISO.has(iso)) days.add(d.getDate());
        }
      }
    }
    return [...days].sort((a, b) => a - b);
  };

  const openLogForDate = (y: number, m: number, d: number) => {
    const iso = new Date(y, m, d).toISOString().slice(0, 10);
    navigate(`/apps/cycle/log?date=${iso}`);
  };



  const today = new Date();
  const currentDay = 16; // mock — would be derived from last-period date
  const daysUntilPeriod = cycleLen - currentDay;
  const phase = getPhase(currentDay, periodLen, cycleLen);

  const dateStr = today.toLocaleDateString("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Storage name greeting
  const name = (localStorage.getItem("user_display_name") || "there").toUpperCase();

  const goLogNow = () => navigate("/apps/cycle/log");
  const goLogPeriod = () => navigate("/apps/cycle/log-period");

  return (
    <AppLockGate appId="cycle">
      <MiniAppShell
        appId="cycle"
        name={app.name}
        tagline={app.tagline}
        icon={app.icon}
        bg={app.bg}
        fg={app.fg}
        bottomActions={[
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            active: tab === "dashboard",
            onClick: () => setTab("dashboard"),
          },
          {
            icon: CalendarIcon,
            label: "Calendar",
            active: tab === "calendar",
            onClick: () => setTab("calendar"),
          },
          
          { icon: BarChart3, label: "Insights", onClick: () => navigate("/apps/cycle/insights") },
        ]}
      >
        {tab === "dashboard" && (
          <div>
            <div className="mt-2 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900">Hello, {name}</h2>
            </div>

            <DateStrip today={today} />

            <div className="mt-4">
              <CycleRing
                currentDay={currentDay}
                cycleLen={cycleLen}
                periodLen={periodLen}
                onLog={goLogNow}
                centerLabel={{
                  date: dateStr,
                  sub: `Period in ${daysUntilPeriod} days`,
                }}
              />
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-y-3">
              {(Object.keys(PHASE_COLORS) as Phase[]).map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-1.5 rounded-full"
                    style={{ background: PHASE_COLORS[p] }}
                  />
                  <span className="text-sm text-neutral-800">{PHASE_LABEL[p]}</span>
                </div>
              ))}
            </div>

            {/* Phase info card */}
            <button
              type="button"
              onClick={() => navigate(`/apps/cycle/phase?phase=${phase}`)}
              className="mt-6 flex w-full items-center gap-4 rounded-2xl p-4 text-left transition active:scale-[0.99]"
              style={{ background: `${PHASE_COLORS[phase]}18` }}
            >
              <div className="flex-1">
                <p className="text-base font-bold" style={{ color: PHASE_COLORS[phase] }}>
                  You are in your {PHASE_LABEL[phase].toLowerCase()} phase
                </p>
                <div className="mt-1 flex items-center gap-2 text-sm text-neutral-700">
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ background: PHASE_COLORS[phase] }}
                  >
                    i
                  </span>
                  <span>What does this mean?</span>
                </div>
              </div>
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ background: PHASE_COLORS[phase] }}
              >
                {phase === "luteal" && <MoonIcon />}
                {phase === "menstrual" && <DropletIconGlyph />}
                {phase === "follicular" && <FlowerGlyph />}
                {phase === "ovular" && <SparkGlyph />}
              </div>
            </button>
          </div>
        )}

        {tab === "calendar" && (
          <div>
            <div className="mt-2 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900">Calendar</h2>
              <button onClick={() => setYearOpen(true)} className="flex items-center gap-1 text-lg text-neutral-700">
                {calYear}
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>

            {/* Weekday header */}
            <div className="mt-4 grid grid-cols-7 text-center text-sm text-neutral-500">
              {["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {Array.from({ length: 12 }, (_, m) => (
              <MonthCalendar
                key={m}
                year={calYear}
                month={m}
                today={today}
                periodDays={periodDaysForMonth(calYear, m)}
                predictedPeriod={predictedForMonth(calYear, m)}
                onToggle={(d) => openLogForDate(calYear, m, d)}
              />
            ))}

            {/* Floating log button */}
            <button
              onClick={goLogPeriod}
              className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg"
              style={{ background: CTA }}
            >
              <Plus className="h-5 w-5" strokeWidth={2.5} />
              <span className="font-semibold">Log your period</span>
            </button>

            {/* Year picker sheet */}
            {yearOpen && (
              <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setYearOpen(false)}>
                <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-[430px] rounded-t-3xl bg-white p-5 pb-10"
                  onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center">
                    <button onClick={() => setYearOpen(false)} className="w-10 h-10 flex items-center justify-center -ml-2">
                      <ChevronDown className="w-6 h-6 rotate-90" />
                    </button>
                    <h2 className="flex-1 text-center text-lg font-semibold pr-8">Select Year</h2>
                  </div>
                  <div className="mt-6 space-y-3">
                    {[today.getFullYear() - 2, today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1].map((y) => {
                      const sel = y === calYear;
                      const dist = Math.abs(y - today.getFullYear());
                      const opacity = sel ? 1 : dist === 0 ? 1 : dist === 1 ? 0.55 : 0.3;
                      return (
                        <button key={y} onClick={() => { setCalYear(y); setYearOpen(false); }}
                          className="w-full h-16 rounded-full flex items-center justify-center text-3xl font-semibold"
                          style={{ background: sel ? "#FFF3E4" : "transparent", color: CTA, opacity }}>
                          {y}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </MiniAppShell>
    </AppLockGate>
  );
}

// Small decorative glyphs
function MoonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20 14A8 8 0 019 4a8 8 0 1011 10z" fill="#FBEEE1" />
    </svg>
  );
}
function DropletIconGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#FBEEE1">
      <path d="M12 2s7 8 7 13a7 7 0 11-14 0c0-5 7-13 7-13z" />
    </svg>
  );
}
function FlowerGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#FBEEE1">
      <circle cx="12" cy="6" r="3" />
      <circle cx="12" cy="18" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="12" r="3" />
      <circle cx="12" cy="12" r="2" fill="#7A1F1F" />
    </svg>
  );
}
function SparkGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#FBEEE1">
      <path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />
    </svg>
  );
}
