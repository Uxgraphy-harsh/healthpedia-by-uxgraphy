import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";

const CTA = "#EF4E3B";

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

function MonthGrid({
  year, month, selected, onToggle, today,
}: {
  year: number; month: number; selected: Set<string>; onToggle: (iso: string) => void; today: Date;
}) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = first.getDay();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="mt-4">
      <p className="mb-3 text-xs font-semibold tracking-widest text-neutral-500">
        {first.toLocaleString("en", { month: "long" }).toUpperCase()} {year}
      </p>
      <div className="grid grid-cols-7 gap-y-3">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="h-14" />;
          const iso = toISO(new Date(year, month, d));
          const isSel = selected.has(iso);
          const dObj = new Date(year, month, d);
          const isPast = dObj < new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
          const isToday = iso === toISO(today);
          return (
            <button key={i} onClick={() => isPast && onToggle(iso)} disabled={!isPast}
              className="flex flex-col items-center justify-center h-14 gap-1">
              <span className={`text-sm ${isToday ? "font-bold" : ""}`} style={{ color: isPast ? "#111" : "#C7C7C7" }}>{d}</span>
              {isPast && (
                <span className={`h-6 w-6 rounded-full border-2 flex items-center justify-center`}
                  style={{ borderColor: isSel ? CTA : "#B7B7B7", background: isSel ? "transparent" : "transparent" }}>
                  {isSel && <span className="h-3 w-3 rounded-full" style={{ background: CTA }} />}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CycleLogPeriod() {
  const navigate = useNavigate();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [yearOpen, setYearOpen] = useState(false);

  const [selected, setSelected] = useState<Set<string>>(() => {
    const arr: string[] = JSON.parse(localStorage.getItem("cycle_period_days") || "[]");
    return new Set(arr);
  });

  const toggle = (iso: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(iso) ? n.delete(iso) : n.add(iso);
      return n;
    });
  };

  const save = () => {
    localStorage.setItem("cycle_period_days", JSON.stringify([...selected].sort()));
    navigate(-1);
  };

  // 12 months of chosen year, but scroll centered around current
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="mobile-container min-h-[100dvh] bg-white pb-32">
      <div className="px-5 pt-6 pb-2 flex items-center">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="px-5 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <button onClick={() => setYearOpen(true)} className="flex items-center gap-1 text-lg text-neutral-700">
          {year} <ChevronDown className="w-5 h-5" />
        </button>
      </div>
      <div className="px-5 mt-6 grid grid-cols-7 text-center text-sm text-neutral-500">
        {["sun","mon","tue","wed","thu","fri","sat"].map((d) => <div key={d}>{d}</div>)}
      </div>

      <div className="px-5">
        {months.map((m) => (
          <MonthGrid key={m} year={year} month={m} selected={selected} onToggle={toggle} today={today} />
        ))}
      </div>

      {/* Save button */}
      <button onClick={save}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] py-5 text-white text-lg font-semibold"
        style={{ background: CTA }}>
        Save
      </button>

      {/* Year sheet */}
      {yearOpen && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setYearOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-[430px] rounded-t-3xl bg-white p-5 pb-10"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center">
              <button onClick={() => setYearOpen(false)} className="w-10 h-10 flex items-center justify-center -ml-2">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="flex-1 text-center text-lg font-semibold pr-8">Select Year</h2>
            </div>
            <div className="mt-6 space-y-3">
              {[today.getFullYear() - 2, today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1].map((y) => {
                const sel = y === year;
                const dist = Math.abs(y - today.getFullYear());
                const opacity = sel ? 1 : dist === 0 ? 1 : dist === 1 ? 0.55 : 0.3;
                return (
                  <button key={y} onClick={() => { setYear(y); setYearOpen(false); }}
                    className="w-full h-16 rounded-full flex items-center justify-center text-3xl font-semibold"
                    style={{
                      background: sel ? "#FFF3E4" : "transparent",
                      color: CTA,
                      opacity,
                    }}>
                    {y}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
