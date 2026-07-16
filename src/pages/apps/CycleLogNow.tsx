import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Check } from "lucide-react";

const CTA = "#EF4E3B";
const PINK = "#F66B9A";
const ORANGE = "#F97316";
const CREAM = "#FFF3E4";
const BURGUNDY = "#5B0A0A";

type Flow = "spotting" | "light" | "medium" | "heavy";
type Mood = "happy" | "sad" | "neutral" | "anxious";
type Phase = "menstrual" | "follicular" | "ovular" | "luteal";

const FLOWS: { id: Flow; label: string; drops: number }[] = [
  { id: "spotting", label: "Spotting", drops: 3 },
  { id: "light", label: "Light", drops: 1 },
  { id: "medium", label: "Medium", drops: 2 },
  { id: "heavy", label: "Heavy", drops: 2 },
];

const MOODS: { id: Mood; label: string; face: "happy" | "sad" | "neutral" | "anxious" }[] = [
  { id: "happy", label: "Happy", face: "happy" },
  { id: "sad", label: "Sad", face: "sad" },
  { id: "neutral", label: "Neutral", face: "neutral" },
  { id: "anxious", label: "Anxious", face: "anxious" },
];

const SYMPTOMS = [
  { id: "none", label: "None" },
  { id: "acne", label: "Acne" },
  { id: "back", label: "Back Ache" },
  { id: "bloating", label: "Bloating" },
  { id: "cramps", label: "Cramps" },
  { id: "fatigue", label: "Fatigue" },
  { id: "headache", label: "Headache" },
  { id: "nausea", label: "Nausea" },
];

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

function getPhaseForDate(iso: string): Phase {
  const periodDays: string[] = JSON.parse(localStorage.getItem("cycle_period_days") || "[]");
  if (periodDays.includes(iso)) return "menstrual";
  if (!periodDays.length) return "luteal";
  const sorted = [...periodDays].sort();
  const last = new Date(sorted[sorted.length - 1]);
  const diff = Math.floor((new Date(iso).getTime() - last.getTime()) / 86400000);
  const onboarding = JSON.parse(localStorage.getItem("cycle_onboarding") || "{}");
  const cycleLen = onboarding.cycleDays ?? 28;
  const ov = Math.round(cycleLen * 0.5);
  if (diff < 0) return "luteal";
  if (diff <= ov - 2) return "follicular";
  if (diff <= ov + 1) return "ovular";
  return "luteal";
}

const PHASE_MEAT: Record<Phase, { title: string; bg: string; fg: string; icon: JSX.Element }> = {
  menstrual: {
    title: "You are in your menstrual phase",
    bg: "#FDECEC",
    fg: BURGUNDY,
    icon: (
      <div className="h-14 w-14 rounded-full flex items-center justify-center" style={{ background: "#EF4E3B" }}>
        <svg width="20" height="24" viewBox="0 0 20 24" fill="#fff"><path d="M10 0s10 11 10 15a10 10 0 11-20 0C0 11 10 0 10 0z"/></svg>
      </div>
    ),
  },
  follicular: {
    title: "You are in your follicular phase",
    bg: "#FFF3E4",
    fg: "#A0522D",
    icon: (
      <div className="h-14 w-14 rounded-full flex items-center justify-center" style={{ background: ORANGE }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="12" r="3"/></svg>
      </div>
    ),
  },
  ovular: {
    title: "You are in your ovular phase",
    bg: "#FFF3E4",
    fg: "#B8860B",
    icon: (
      <div className="h-14 w-14 rounded-full flex items-center justify-center" style={{ background: "#F59E0B" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2z"/></svg>
      </div>
    ),
  },
  luteal: {
    title: "You are in your luteal phase",
    bg: CREAM,
    fg: "#B8860B",
    icon: (
      <div className="h-14 w-14 rounded-full flex items-center justify-center" style={{ background: "#F59E0B" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M20 14A8 8 0 019 4a8 8 0 1011 10z"/></svg>
      </div>
    ),
  },
};

function FaceIcon({ kind }: { kind: "happy" | "sad" | "neutral" | "anxious" }) {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
      <circle cx="23" cy="23" r="23" fill={PINK} />
      {kind === "happy" && (
        <>
          <path d="M14 18c1.5-2 3.5-2 5 0M27 18c1.5-2 3.5-2 5 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M15 26c2 4 6 6 8 6s6-2 8-6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </>
      )}
      {kind === "sad" && (
        <>
          <path d="M14 20c1-2 3-2 5-0.5M27 19.5c2-1.5 4-1.5 5 0.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M16 32c2-3 6-4 8-4s6 1 8 4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </>
      )}
      {kind === "neutral" && (
        <>
          <path d="M14 18c1.5-2 3.5-2 5 0M27 18c1.5-2 3.5-2 5 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M15 27c2 3 6 4 8 4s6-1 8-4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </>
      )}
      {kind === "anxious" && (
        <>
          <path d="M14 18c1.5-2 3.5-2 5 0M27 18c1.5-2 3.5-2 5 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="23" cy="30" rx="3.5" ry="4.5" fill="#fff" />
        </>
      )}
    </svg>
  );
}

function Drop({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size + 4} viewBox="0 0 22 26" fill="#EF4E3B">
      <path d="M11 0s10 12 10 16a10 10 0 11-20 0C1 12 11 0 11 0z" />
    </svg>
  );
}

export default function CycleLogNow() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initial = params.get("date") || toISO(new Date());
  const [dateISO, setDateISO] = useState(initial);

  const dateObj = new Date(dateISO);
  const dateTitle = dateObj.toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" });

  // Load existing log
  const [flow, setFlow] = useState<Flow | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem("cycle_logs") || "{}");
    const l = logs[dateISO];
    setFlow(l?.flow ?? null);
    setMood(l?.mood ?? null);
    setSymptoms(l?.symptoms ?? []);
    setProductCount(l?.productCount ?? 0);
  }, [dateISO]);

  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem("cycle_logs") || "{}");
    logs[dateISO] = { flow, mood, symptoms, productCount };
    localStorage.setItem("cycle_logs", JSON.stringify(logs));
  }, [dateISO, flow, mood, symptoms, productCount]);

  const week = useMemo(() => {
    const d = new Date(dateISO);
    const dow = d.getDay();
    const start = new Date(d);
    start.setDate(d.getDate() - dow);
    return Array.from({ length: 7 }, (_, i) => {
      const nd = new Date(start);
      nd.setDate(start.getDate() + i);
      return nd;
    });
  }, [dateISO]);

  const phase = getPhaseForDate(dateISO);
  const meat = PHASE_MEAT[phase];
  const periodDays: string[] = JSON.parse(localStorage.getItem("cycle_period_days") || "[]");

  const toggleSymptom = (id: string) => {
    if (id === "none") { setSymptoms(["none"]); return; }
    setSymptoms((prev) => {
      const p = prev.filter((x) => x !== "none");
      return p.includes(id) ? p.filter((x) => x !== id) : [...p, id];
    });
  };

  return (
    <div className="mobile-container min-h-[100dvh] bg-white pb-12">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold pr-8">{dateTitle}</h1>
      </div>

      {/* Week strip */}
      <div className="px-5">
        <div className="grid grid-cols-7 text-center text-sm text-neutral-500 mb-2">
          {["sun","mon","tue","wed","thu","fri","sat"].map((d) => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 relative">
          {(() => {
            // period pill background across contiguous week period days
            const isPeriod = week.map((d) => periodDays.includes(toISO(d)));
            const runs: { s: number; e: number }[] = [];
            let s = -1;
            isPeriod.forEach((v, i) => {
              if (v && s === -1) s = i;
              if ((!v || i === 6) && s !== -1) { runs.push({ s, e: v ? i : i - 1 }); s = -1; }
            });
            return runs.map((r, i) => (
              <div key={i} className="absolute rounded-full" style={{
                background: "#FDECEC",
                top: 0, height: 40,
                left: `calc(${(r.s / 7) * 100}% + 2px)`,
                width: `calc(${((r.e - r.s + 1) / 7) * 100}% - 4px)`,
              }} />
            ));
          })()}
          {week.map((d) => {
            const iso = toISO(d);
            const isSel = iso === dateISO;
            const isPeriod = periodDays.includes(iso);
            return (
              <button key={iso} onClick={() => setDateISO(iso)} className="relative h-10 flex items-center justify-center">
                {isPeriod && <span className="absolute top-0 right-2 h-1.5 w-1.5 rounded-full" style={{ background: "#EF4E3B" }} />}
                {isSel ? (
                  <span className="h-9 w-9 rounded-full border-2 border-neutral-900 flex items-center justify-center font-bold">{d.getDate()}</span>
                ) : (
                  <span className={`text-base ${isPeriod ? "font-semibold" : ""}`} style={{ color: isPeriod ? BURGUNDY : "#111" }}>{d.getDate()}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Phase banner */}
      <div className="px-5 mt-6">
        <div className="flex items-center gap-4 rounded-2xl p-4" style={{ background: meat.bg }}>
          <p className="flex-1 text-base font-bold" style={{ color: meat.fg }}>{meat.title}</p>
          {meat.icon}
        </div>
      </div>

      {/* Flow */}
      <div className="px-5 mt-6">
        <div className="rounded-2xl border border-neutral-200 p-5">
          <p className="text-lg font-semibold mb-4">Flow</p>
          <div className="grid grid-cols-4 gap-2">
            {FLOWS.map((f) => {
              const sel = flow === f.id;
              return (
                <button key={f.id} onClick={() => setFlow(sel ? null : f.id)} className="flex flex-col items-center gap-2">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center ${sel ? "" : "bg-neutral-100"}`}
                       style={sel ? { background: CREAM, border: `2px solid ${ORANGE}` } : {}}>
                    <div className="flex gap-0.5">
                      {Array.from({ length: f.drops }).map((_, i) => <Drop key={i} size={f.drops === 1 ? 22 : 14} />)}
                    </div>
                  </div>
                  <span className="text-sm">{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mood */}
      <div className="px-5 mt-5">
        <div className="rounded-2xl border border-neutral-200 p-5">
          <p className="text-lg font-semibold mb-4">Mood</p>
          <div className="grid grid-cols-4 gap-2">
            {MOODS.map((m) => {
              const sel = mood === m.id;
              return (
                <button key={m.id} onClick={() => setMood(sel ? null : m.id)} className="flex flex-col items-center gap-2">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center ${sel ? "" : "bg-neutral-100"}`}
                       style={sel ? { background: CREAM, border: `2px solid ${ORANGE}` } : {}}>
                    <FaceIcon kind={m.face} />
                  </div>
                  <span className="text-sm">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Symptoms */}
      <div className="px-5 mt-5">
        <div className="rounded-2xl border border-neutral-200 p-5">
          <p className="text-lg font-semibold mb-4">Symptoms</p>
          <div className="grid grid-cols-4 gap-y-4 gap-x-2">
            {SYMPTOMS.map((s) => {
              const sel = symptoms.includes(s.id);
              return (
                <button key={s.id} onClick={() => toggleSymptom(s.id)} className="flex flex-col items-center gap-2">
                  <div className={`h-14 w-14 rounded-full flex items-center justify-center ${sel ? "" : "bg-neutral-100"}`}
                       style={sel ? { background: CREAM, border: `2px solid ${ORANGE}` } : {}}>
                    <div className="h-11 w-11 rounded-full flex items-center justify-center" style={{ background: ORANGE }}>
                      {s.id === "none" ? <Check className="w-6 h-6 text-white" strokeWidth={3} /> : <span className="text-white text-xs font-bold">{s.label[0]}</span>}
                    </div>
                  </div>
                  <span className="text-xs text-center">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product count */}
      <div className="px-5 mt-5">
        <div className="rounded-2xl border border-neutral-200 p-5">
          <p className="text-base font-semibold mb-4">How many times did you change your period product today?</p>
          <div className="flex items-center justify-between">
            <button onClick={() => setProductCount(Math.max(0, productCount - 1))} className="w-10 h-10 flex items-center justify-center">
              <Minus className="w-6 h-6" style={{ color: "#F1A99F" }} strokeWidth={3} />
            </button>
            <div className="h-24 w-24 rounded-full bg-neutral-100 flex items-center justify-center relative">
              <svg width="46" height="60" viewBox="0 0 46 60" fill="none">
                <path d="M6 8h34l-4 26a14 14 0 01-13 12 14 14 0 01-13-12L6 8z" fill="#EF4E3B"/>
                <path d="M20 46l-2 8 3 3 3-3-2-8" fill="#EF4E3B"/>
              </svg>
              <span className="absolute text-white font-bold text-lg" style={{ top: 32 }}>{productCount}</span>
            </div>
            <button onClick={() => setProductCount(productCount + 1)} className="w-10 h-10 flex items-center justify-center">
              <Plus className="w-6 h-6" style={{ color: CTA }} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
