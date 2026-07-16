import { useState, useMemo, useRef } from "react";
import { Plus, ChevronRight, ArrowLeft, FileText, Upload, X, Sparkles, Share2 } from "lucide-react";
import { AppFrame, type EmbeddedProps } from "./_embedded";

import { sampleSymptoms } from "@/data/sampleData";

type Aggregated = {
  name: string;
  count: number;
  lastLoggedAt: string;
  status: "Passed" | "Ongoing";
};

type LogEntry = {
  id: string;
  loggedAt: string;
  status: "Passed" | "Ongoing";
  note: string;
  alongside: string[];
  attachments: { name: string; size: string }[];
  severity: number; // 1-5
  trigger: string | null;
};

const TRIGGERS = ["After meal", "On waking up", "After activity", "Stress", "After medication", "Random"];

function formatLastLogged(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (sameDay) return `Today, ${time}`;
  const date = d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  return `${date}, ${time}`;
}

// Deterministic mock log generator per symptom
function mockLogsFor(name: string, count: number, status: "Passed" | "Ongoing"): LogEntry[] {
  const seed = name.length;
  const notes = [
    "Felt very low after lunch. Could barely focus on work.",
    "Brief episode in the morning, resolved on its own.",
    "Started mildly and grew intense over the evening.",
    "Woke up with it, eased after breakfast and water.",
  ];
  const alongsidePool = ["Dizziness", "Headache", "After lunch", "Ongoing", "Nausea", "Fatigue"];
  const now = Date.now();
  const logs: LogEntry[] = [];
  for (let i = 0; i < count; i++) {
    const offsetHours = i === 0 ? 3 : 24 * i + seed;
    const loggedAt = new Date(now - offsetHours * 36e5).toISOString();
    const alongside = alongsidePool.slice(i % 3, (i % 3) + 3 + (i % 2));
    logs.push({
      id: `${name}-${i}`,
      loggedAt,
      status: i === 0 ? status : "Passed",
      note: notes[(seed + i) % notes.length],
      alongside,
      attachments:
        i === 0
          ? [{ name: "WhatsApp-2338340124732.pdf", size: "1.1 MB" }]
          : [],
      severity: ((seed + i) % 5) + 1,
      trigger: TRIGGERS[(seed + i) % TRIGGERS.length],
    });
  }
  return logs;
}

export default function Symptoms({ embedded }: EmbeddedProps = {}) {
  const [symptoms] = useState(sampleSymptoms);
  const [openSymptom, setOpenSymptom] = useState<Aggregated | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const aggregated = useMemo<Aggregated[]>(() => {
    const map = new Map<string, Aggregated>();
    for (const s of symptoms) {
      const existing = map.get(s.name);
      if (!existing) {
        map.set(s.name, { name: s.name, count: 1, lastLoggedAt: s.loggedAt, status: "Passed" });
      } else {
        existing.count += 1;
        if (new Date(s.loggedAt) > new Date(existing.lastLoggedAt)) {
          existing.lastLoggedAt = s.loggedAt;
        }
      }
    }
    const now = Date.now();
    const items = Array.from(map.values()).map((a) => {
      const hours = (now - new Date(a.lastLoggedAt).getTime()) / 36e5;
      a.status = hours <= 48 ? "Ongoing" : "Passed";
      return a;
    });
    items.sort((a, b) => +new Date(b.lastLoggedAt) - +new Date(a.lastLoggedAt));
    return items;
  }, [symptoms]);

  return (
    <AppFrame appId="symptoms" embedded={embedded}>

      <div className="space-y-3">
        {aggregated.map((s) => (
          <button
            key={s.name}
            onClick={() => setOpenSymptom(s)}
            className="w-full text-left bg-card rounded-2xl px-4 py-3.5 border border-border/50 flex items-center gap-3 active:scale-[0.99] transition-transform"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-muted-foreground mb-0.5">
                Last logged • {formatLastLogged(s.lastLoggedAt)}
              </p>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-[17px] text-foreground truncate">{s.name}</p>
                <span
                  className={`text-[12px] font-medium px-2.5 py-0.5 rounded-full ${
                    s.status === "Ongoing"
                      ? "bg-[#F59E0B]/12 text-[#C2410C]"
                      : "bg-[#60A5FA]/15 text-[#2563EB]"
                  }`}
                >
                  {s.status}
                </span>
              </div>
              <p className="text-[13px] text-muted-foreground">{s.count} times logged</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground/60 shrink-0" strokeWidth={2} />
          </button>
        ))}
      </div>

      {/* Floating Log symptom button */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg"
        style={{ background: "#171717" }}
      >
        <Plus className="h-5 w-5" strokeWidth={2.5} />
        <span className="font-semibold">Log symptom</span>
      </button>

      {openSymptom && (
        <SymptomDetail symptom={openSymptom} onClose={() => setOpenSymptom(null)} />
      )}

      {showAdd && (
        <AddSymptomSheet
          existingNames={aggregated.map((a) => a.name)}
          onClose={() => setShowAdd(false)}
        />
      )}
    </MiniAppShell>
  );
}

function SymptomDetail({ symptom, onClose }: { symptom: Aggregated; onClose: () => void }) {
  const [tab, setTab] = useState<"Passed" | "Ongoing">(symptom.status);
  const allLogs = useMemo(
    () => mockLogsFor(symptom.name, symptom.count, symptom.status),
    [symptom]
  );
  const logs = allLogs.filter((l) => l.status === tab);

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl px-5 pt-5 pb-4">
        <div className="flex items-start gap-3">
          <button onClick={onClose} className="p-1 -ml-1 mt-1">
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <div className="flex-1">
            <h1 className="text-[28px] font-bold leading-tight">{symptom.name}</h1>
            <p className="text-[11px] tracking-[0.14em] text-muted-foreground font-medium mt-1">
              {symptom.count} TIMES LOGGED
            </p>
          </div>
        </div>

        {/* Segmented control */}
        <div className="mt-4 inline-flex bg-transparent gap-2">
          {(["Passed", "Ongoing"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-[15px] font-medium transition-colors ${
                tab === t
                  ? "bg-[#60A5FA]/15 text-[#2563EB]"
                  : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border/50" />

      {/* Timeline */}
      <div className="relative px-5 pt-6 pb-32">
        <div className="absolute left-6 top-8 bottom-24 w-px bg-border/70" />
        <div className="space-y-5 relative">
          {logs.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-16">
              No {tab.toLowerCase()} logs
            </p>
          )}
          {logs.map((log) => (
            <div key={log.id} className="relative pl-6">
              <div className="absolute left-[-2px] top-6 h-2.5 w-2.5 rounded-full bg-foreground" />
              <LogCard log={log} />
            </div>
          ))}
        </div>
      </div>

      {/* Sticky footer actions */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-5 pt-3 pb-6 bg-gradient-to-t from-background via-background/95 to-background/0">
        <div className="grid grid-cols-2 gap-3">
          <button
            className="rounded-full py-3.5 flex items-center justify-center gap-2 text-white font-semibold text-[15px] shadow-lg"
            style={{
              background: "linear-gradient(135deg, #3B1220 0%, #5C1E33 55%, #7A2340 100%)",
            }}
          >
            <Sparkles className="h-4 w-4" strokeWidth={2.2} />
            Ask AI
          </button>
          <button className="rounded-full py-3.5 flex items-center justify-center gap-2 border border-foreground/80 bg-background font-semibold text-[15px] text-foreground">
            <Share2 className="h-4 w-4" strokeWidth={2} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

function LogCard({ log }: { log: LogEntry }) {
  const sevColors = [
    "bg-[#60A5FA]/15 text-[#2563EB] border-[#60A5FA]/40",
    "bg-[#34D399]/15 text-[#059669] border-[#34D399]/40",
    "bg-[#FBBF24]/20 text-[#B45309] border-[#FBBF24]/50",
    "bg-[#FB923C]/20 text-[#C2410C] border-[#FB923C]/50",
    "bg-[#F87171]/20 text-[#DC2626] border-[#F87171]/50",
  ];

  return (
    <div className="bg-card rounded-2xl p-4 border border-border/50">
      <p className="text-[13px] text-muted-foreground mb-1.5">{formatLastLogged(log.loggedAt)}</p>
      <p className="text-[16px] font-semibold text-foreground leading-snug mb-4">{log.note}</p>

      <SectionLabel>ALONGSIDE</SectionLabel>
      <div className="flex flex-wrap gap-2 mb-4">
        {log.alongside.map((a) => (
          <span key={a} className="text-[13px] px-3 py-1 rounded-full bg-muted text-foreground border border-border/60">
            {a}
          </span>
        ))}
      </div>

      {log.attachments.length > 0 && (
        <>
          <SectionLabel>ATTACHMENTS</SectionLabel>
          <div className="space-y-2 mb-4">
            {log.attachments.map((a) => (
              <div
                key={a.name}
                className="flex items-center gap-3 border border-border/60 rounded-xl px-3 py-2.5"
              >
                <FileText className="h-5 w-5 text-[#3B82F6] shrink-0" />
                <p className="flex-1 min-w-0 text-[14px] font-medium truncate">{a.name}</p>
                <span className="text-[12px] text-muted-foreground shrink-0">{a.size}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <SectionLabel>SEVERITY</SectionLabel>
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= log.severity;
          return (
            <div
              key={n}
              className={`h-9 w-9 rounded-lg border flex items-center justify-center text-[13px] font-medium ${
                active ? sevColors[n - 1] : "border-border/60 text-muted-foreground/60"
              }`}
            >
              {n}
            </div>
          );
        })}
      </div>

      <SectionLabel>POSSIBLE TRIGGER</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {TRIGGERS.map((t) => {
          const active = t === log.trigger;
          return (
            <span
              key={t}
              className={`text-[13px] px-3 py-1 rounded-full border ${
                active
                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                  : "bg-transparent text-foreground border-border/60"
              }`}
            >
              {t}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] tracking-[0.14em] text-muted-foreground font-medium mb-2">
      {children}
    </p>
  );
}

// ─── Add Symptom Bottom Sheet ───────────────────────────────────────────────

const ALONGSIDE_OPTS = ["Dizziness", "Headache", "Throat tightness", "Stress", "Nausea", "Fatigue"];

function AddSymptomSheet({
  existingNames,
  onClose,
}: {
  existingNames: string[];
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [meridiem, setMeridiem] = useState<"AM" | "PM">("AM");
  const [status, setStatus] = useState<"Passed" | "Ongoing">("Passed");
  const [severity, setSeverity] = useState<number>(0);
  const [alongside, setAlongside] = useState<string[]>([]);
  const [trigger, setTrigger] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const canSave = name.trim().length > 0;

  const filteredSuggest = existingNames.filter(
    (n) => name.trim() && n.toLowerCase().includes(name.trim().toLowerCase()) && n !== name
  );

  const toggle = <T,>(arr: T[], v: T, setter: (a: T[]) => void) =>
    setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const sevColors = [
    "border-[#60A5FA] bg-[#EEF4FF] text-[#2563EB]",
    "border-[#34D399] bg-[#ECFDF5] text-[#059669]",
    "border-[#FBBF24] bg-[#FEFCE8] text-[#B45309]",
    "border-[#FB923C] bg-[#FFF7ED] text-[#C2410C]",
    "border-[#F87171] bg-[#FEF2F2] text-[#DC2626]",
  ];

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFiles((prev) => [...prev, { name: f.name, size: `${(f.size / (1024 * 1024)).toFixed(1)} MB` }]);
    e.target.value = "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={onClose}>
      <div
        className="w-full bg-background rounded-t-[28px] max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grabber */}
        <div className="pt-2 pb-1 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="grid grid-cols-3 items-center px-5 py-3">
          <button onClick={onClose} className="text-[15px] text-[#2563EB] font-medium text-left">
            Cancel
          </button>
          <h2 className="text-[16px] font-semibold text-center">Add symptom</h2>
          <span />
        </div>

        {/* Scroll body */}
        <div className="overflow-y-auto px-5 pb-6 pt-2 flex-1">
          {/* Symptom */}
          <SectionLabel>SYMPTOM</SectionLabel>
          <div className="rounded-2xl border border-border/60 px-4 py-3 mb-3 relative">
            <p className="text-[11px] text-muted-foreground mb-0.5">
              Symptom name<span className="text-[#EF4444]">*</span>
            </p>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setShowSuggest(true);
              }}
              onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
              onFocus={() => setShowSuggest(true)}
              placeholder="Type to add or search existing symptom..."
              className="w-full bg-transparent outline-none text-[15px] placeholder:text-muted-foreground/70"
              maxLength={80}
            />
            {showSuggest && filteredSuggest.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-10 bg-background border border-border/60 rounded-2xl shadow-lg overflow-hidden">
                {filteredSuggest.slice(0, 5).map((s) => (
                  <button
                    key={s}
                    onMouseDown={() => {
                      setName(s);
                      setShowSuggest(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-[14px] hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="rounded-2xl border border-border/60 px-4 py-3">
              <p className="text-[11px] text-muted-foreground mb-0.5">Date</p>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent outline-none text-[15px]"
              />
            </div>
            <div className="rounded-2xl border border-border/60 px-4 py-3 flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted-foreground mb-0.5">Time</p>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-transparent outline-none text-[15px]"
                />
              </div>
              <div className="flex text-[13px] font-semibold shrink-0">
                <button
                  onClick={() => setMeridiem("AM")}
                  className={meridiem === "AM" ? "text-foreground" : "text-muted-foreground/60"}
                >
                  AM
                </button>
                <span className="mx-1 text-muted-foreground/40">|</span>
                <button
                  onClick={() => setMeridiem("PM")}
                  className={meridiem === "PM" ? "text-foreground" : "text-muted-foreground/60"}
                >
                  PM
                </button>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-2 rounded-full bg-muted/40 p-1 mb-6">
            {(["Passed", "Ongoing"] as const).map((s) => {
              const active = status === s;
              const activeClass =
                s === "Passed"
                  ? "bg-[#60A5FA]/15 text-[#2563EB]"
                  : "bg-[#F59E0B]/15 text-[#C2410C]";
              return (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`py-2.5 rounded-full text-[15px] font-medium transition-colors ${
                    active ? activeClass : "text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>

          {/* Severity */}
          <SectionLabel>SEVERITY</SectionLabel>
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((n) => {
              const active = n <= severity;
              return (
                <button
                  key={n}
                  onClick={() => setSeverity(n)}
                  className={`h-12 flex-1 rounded-xl border text-[15px] font-medium transition-colors ${
                    active
                      ? sevColors[n - 1]
                      : "border-border/60 text-foreground bg-background"
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>

          {/* Alongside */}
          <SectionLabel>ALONGSIDE</SectionLabel>
          <div className="flex flex-wrap gap-2 mb-6">
            {ALONGSIDE_OPTS.map((o) => {
              const active = alongside.includes(o);
              return (
                <button
                  key={o}
                  onClick={() => toggle(alongside, o, setAlongside)}
                  className={`text-[13px] px-3 py-1.5 rounded-full border transition-colors ${
                    active
                      ? "bg-[#2563EB] text-white border-[#2563EB]"
                      : "bg-background text-foreground border-border/60"
                  }`}
                >
                  {o}
                </button>
              );
            })}
          </div>

          {/* Trigger */}
          <SectionLabel>POSSIBLE TRIGGER</SectionLabel>
          <div className="flex flex-wrap gap-2 mb-6">
            {TRIGGERS.map((t) => {
              const active = trigger === t;
              return (
                <button
                  key={t}
                  onClick={() => setTrigger(active ? null : t)}
                  className={`text-[13px] px-3 py-1.5 rounded-full border transition-colors ${
                    active
                      ? "bg-[#2563EB] text-white border-[#2563EB]"
                      : "bg-background text-foreground border-border/60"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* Additional information */}
          <SectionLabel>ADDITIONAL INFORMATION</SectionLabel>
          <div className="rounded-2xl border border-border/60 px-4 py-3 mb-6">
            <p className="text-[11px] text-muted-foreground mb-1">Note</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write or paste a link"
              rows={3}
              maxLength={1000}
              className="w-full bg-transparent outline-none text-[15px] placeholder:text-muted-foreground/70 resize-none"
            />
          </div>

          {/* Attachments */}
          <SectionLabel>ATTACHMENTS</SectionLabel>
          <button
            onClick={() => fileInput.current?.click()}
            className="w-full rounded-2xl border border-dashed border-border py-6 flex flex-col items-center gap-2 mb-3"
          >
            <Upload className="h-5 w-5 text-[#F66B9A]" strokeWidth={2} />
            <p className="text-[15px] font-semibold">Tap to upload</p>
            <p className="text-[12px] text-muted-foreground">Max upto 2 mb per file upload</p>
            <div className="flex gap-2 mt-1">
              {["PDF", "JPG", "PNG"].map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={onPickFile}
          />

          {files.length > 0 && (
            <div className="space-y-2 mb-4">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border border-border/60 rounded-xl px-3 py-2.5"
                >
                  <FileText className="h-5 w-5 text-[#3B82F6] shrink-0" />
                  <p className="flex-1 min-w-0 text-[14px] font-medium truncate">{f.name}</p>
                  <span className="text-[12px] text-muted-foreground shrink-0">{f.size}</span>
                  <button
                    onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    className="p-1"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky footer */}
        <div className="px-5 pt-3 pb-6 border-t border-border/40 bg-background">
          <button
            disabled={!canSave}
            onClick={onClose}
            className={`w-full rounded-full py-4 text-[16px] font-semibold text-white transition-opacity ${
              canSave ? "opacity-100" : "opacity-40"
            }`}
            style={{ background: "#0A0A0A" }}
          >
            Save Symptom
          </button>
        </div>
      </div>
    </div>
  );
}
