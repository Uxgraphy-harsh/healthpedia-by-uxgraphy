import { useMemo, useState } from "react";
import { Plus, User, Building2, Calendar, Pill, Search as SearchIcon, X, ArrowLeft, ChevronRight, Sparkles, FileText, Sun, Moon } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import AppLockGate from "@/components/AppLockGate";
import { getMiniApp } from "@/data/miniApps";

interface Medicine {
  id: string;
  name: string;
  qty: string;
  timing: "Before food" | "After food";
  schedule: { morning: boolean; afternoon: boolean; evening: boolean; night: boolean };
  images: string[]; // placeholders
}

interface LinkedFile {
  id: string;
  name: string;
  size: string;
}

interface RelatedReport {
  id: string;
  date: string; // "14 JAN 2025"
  files: string;
  lab: string;
  doctor: string;
}

interface Rx {
  id: string;
  title: string;
  doctor: string;
  specialty: string;
  hospital: string;
  date: string;
  dateLong: string; // "14 JAN, 2025"
  items: number;
  tags: string[];
  reportDate: string;
  sampleCollected: string;
  labReference: string;
  medicines: Medicine[];
  linkedFiles: LinkedFile[];
  related: RelatedReport[];
}

const sampleMeds: Medicine[] = [
  {
    id: "m1",
    name: "Thyrox 50 Tablet",
    qty: "1x",
    timing: "Before food",
    schedule: { morning: true, afternoon: false, evening: false, night: false },
    images: ["", ""],
  },
  {
    id: "m2",
    name: "Thyrox 50 Tablet",
    qty: "1x",
    timing: "Before food",
    schedule: { morning: true, afternoon: false, evening: false, night: false },
    images: ["", ""],
  },
  {
    id: "m3",
    name: "Thyrox 50 Tablet",
    qty: "1x",
    timing: "Before food",
    schedule: { morning: true, afternoon: false, evening: false, night: false },
    images: ["", ""],
  },
];

const initialRx: Rx[] = [
  {
    id: "p1",
    title: "Metformin 500mg + Vitamin D3",
    doctor: "Dr. Sharma",
    specialty: "Endocrinology",
    hospital: "SRL Diagnostics, Baner",
    date: "28 Feb 2026",
    dateLong: "14 JAN, 2025",
    items: 3,
    tags: ["Diabetes"],
    reportDate: "14 Jan 2025",
    sampleCollected: "14 Jan  •  7:30 AM",
    labReference: "SRL/PUN/25/004821",
    medicines: sampleMeds,
    linkedFiles: [{ id: "f1", name: "Thyroid_Jan25.pdf", size: "24.4 MB" }],
    related: [
      { id: "r1", date: "14 JAN 2025", files: "3 files  •  PDF + 2 photos", lab: "SRL Diagnostics, Baner", doctor: "Ref. Dr. Meena Sharma" },
      { id: "r2", date: "14 JAN 2025", files: "3 files  •  PDF + 2 photos", lab: "SRL Diagnostics, Baner", doctor: "Ref. Dr. Meena Sharma" },
    ],
  },
  {
    id: "p2",
    title: "Atorvastatin 10mg",
    doctor: "Dr. Mehta",
    specialty: "Cardiology",
    hospital: "Fortis",
    date: "10 Jan 2026",
    dateLong: "10 JAN, 2026",
    items: 2,
    tags: ["Cardio"],
    reportDate: "10 Jan 2026",
    sampleCollected: "10 Jan  •  8:15 AM",
    labReference: "FOR/PUN/26/000128",
    medicines: sampleMeds.slice(0, 2),
    linkedFiles: [{ id: "f2", name: "Cardio_Jan26.pdf", size: "12.1 MB" }],
    related: [],
  },
];

function ScheduleIcon({ label, active }: { label: string; active: boolean }) {
  const base = "w-9 h-9 rounded-lg flex items-center justify-center text-[13px] font-semibold";
  if (label === "M") {
    return (
      <div className={base} style={{ background: active ? "#DCEBFF" : "transparent" }}>
        <Sun className="w-5 h-5" style={{ color: active ? "#60A5FA" : "#C4C4C4" }} strokeWidth={2.5} />
      </div>
    );
  }
  if (label === "N") {
    return (
      <div className={base}>
        <Moon className="w-5 h-5" style={{ color: active ? "#60A5FA" : "#C4C4C4" }} strokeWidth={2.5} />
      </div>
    );
  }
  return (
    <div className={base} style={{ color: active ? "#60A5FA" : "#C4C4C4" }}>
      {label}
    </div>
  );
}

function PrescriptionDetail({ rx, onClose }: { rx: Rx; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[85] bg-[#F5F5F7] flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 bg-[#F5F5F7]">
        <div className="flex items-start gap-3">
          <button
            onClick={onClose}
            className="h-9 w-9 -ml-2 flex items-center justify-center rounded-full"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0 pt-0.5">
            <h1 className="text-[22px] font-bold leading-tight text-black">{rx.hospital}</h1>
            <p className="text-[13px] text-muted-foreground mt-1">{rx.dateLong}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {/* Prescribed Medicines */}
        <div className="px-5 pt-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Prescribed medicines
          </p>
        </div>
        <div className="pl-5 pb-5">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pr-5">
            {rx.medicines.map((m) => (
              <div
                key={m.id}
                className="shrink-0 w-[210px] bg-white rounded-2xl p-3 border border-black/5"
              >
                {/* Main image */}
                <div className="relative w-full aspect-square rounded-xl bg-[#F5F5F7] flex items-center justify-center overflow-hidden">
                  <Pill className="w-14 h-14 text-muted-foreground/40" />
                  <span className="absolute top-2 right-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/90 border border-black/5">
                    {m.qty}
                  </span>
                </div>
                {/* Thumbs */}
                <div className="flex gap-2 mt-2">
                  {m.images.map((_, i) => (
                    <div key={i} className="w-11 h-11 rounded-lg bg-[#F5F5F7] border border-black/5 flex items-center justify-center">
                      <Pill className="w-5 h-5 text-muted-foreground/40" />
                    </div>
                  ))}
                </div>
                <p className="mt-3 font-semibold text-[15px] text-black">{m.name}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">~ {m.timing}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ScheduleIcon label="M" active={m.schedule.morning} />
                  <ScheduleIcon label="L" active={m.schedule.afternoon} />
                  <ScheduleIcon label="D" active={m.schedule.evening} />
                  <ScheduleIcon label="N" active={m.schedule.night} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prescription Details */}
        <div className="px-5 pt-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Prescription details
          </p>
          <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5">
            {[
              ["Hospital / Lab", rx.hospital],
              ["Referring doctor", rx.doctor],
              ["Report date", rx.reportDate],
              ["Sample collected", rx.sampleCollected],
              ["Lab reference", rx.labReference],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between px-4 py-3.5">
                <span className="text-[14px] text-muted-foreground">{k}</span>
                <span className="text-[14px] font-medium text-black text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Linked Files */}
        <div className="px-5 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Linked files
          </p>
          <div className="space-y-3">
            {rx.linkedFiles.map((f) => (
              <button
                key={f.id}
                className="w-full bg-white rounded-2xl px-4 py-3.5 border border-black/5 flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FDECEC] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#E5484D]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] text-black truncate">{f.name}</p>
                  <p className="text-[12px] text-muted-foreground">{f.size}</p>
                </div>
                <ArrowLeft className="w-4 h-4 -rotate-[135deg] text-muted-foreground" />
              </button>
            ))}

            {rx.related.map((rel) => (
              <button
                key={rel.id}
                className="w-full bg-white rounded-2xl px-3 py-3 border border-black/5 flex items-center gap-3 text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-[#1a1330] text-white flex flex-col items-center justify-center leading-none">
                  <span className="text-[15px] font-bold">{rel.date.split(" ")[0]}</span>
                  <span className="text-[10px] font-semibold mt-0.5">{rel.date.split(" ")[1]}</span>
                  <span className="text-[9px] mt-0.5 opacity-80">{rel.date.split(" ")[2]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-muted-foreground">{rel.files}</p>
                  <p className="font-semibold text-[14px] text-black truncate mt-0.5">{rel.lab}</p>
                  <p className="text-[12px] text-muted-foreground truncate">{rel.doctor}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-3 bg-gradient-to-t from-[#F5F5F7] via-[#F5F5F7]/95 to-transparent">
        <div className="flex items-center gap-3">
          <button
            className="flex-1 h-14 rounded-full flex items-center justify-center gap-2 text-white font-semibold"
            style={{ background: "linear-gradient(135deg, #4A1D3A 0%, #7A2A4E 100%)" }}
          >
            <Sparkles className="w-5 h-5" />
            Ask AI
          </button>
          <button className="flex-1 h-14 rounded-full flex items-center justify-center font-semibold bg-white border border-black/10 text-black">
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Prescriptions() {
  const app = getMiniApp("prescriptions")!;
  const [rx] = useState<Rx[]>(initialRx);
  const [showAdd, setShowAdd] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as Rx[];
    return rx.filter((r) =>
      [r.title, r.doctor, r.hospital, ...r.tags].join(" ").toLowerCase().includes(q)
    );
  }, [query, rx]);

  const commitSearch = (q: string) => {
    const s = q.trim();
    if (!s) return;
    setRecent((prev) => [s, ...prev.filter((x) => x !== s)].slice(0, 8));
  };

  const openRx = rx.find((r) => r.id === openId) || null;

  return (
    <AppLockGate appId="prescriptions">
      <MiniAppShell
        appId="prescriptions"
        name={app.name}
        tagline={app.tagline}
        icon={app.icon}
        bg={app.bg}
        fg={app.fg}
        bottomActions={[
          { icon: Pill, label: "All", active: true },
          { icon: User, label: "Doctors" },
          { icon: SearchIcon, label: "Search", onClick: () => setShowSearch(true) },
        ]}
      >
        <div className="space-y-3">
          {rx.map((r) => (
            <button
              key={r.id}
              onClick={() => setOpenId(r.id)}
              className="w-full text-left bg-card rounded-2xl px-4 py-3.5 border border-border/60 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-muted-foreground">{r.date}</p>
                <p className="font-semibold text-[15px] mt-0.5 truncate">
                  {r.doctor} — {r.specialty}
                </p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{r.items} items</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>


        {/* Floating Add prescription button */}
        {!showAdd && !showSearch && !openRx && (
          <button
            onClick={() => setShowAdd(true)}
            className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg"
            style={{ background: "#171717" }}
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
            <span className="font-semibold">Add prescription</span>
          </button>
        )}

        {/* Add prescription bottom sheet (placeholder) */}
        {showAdd && (
          <div
            className="fixed inset-0 z-[90] bg-black/40 flex items-end"
            onClick={() => setShowAdd(false)}
          >
            <div
              className="w-full max-w-md mx-auto bg-background rounded-t-3xl flex flex-col max-h-[92dvh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 rounded-full bg-muted mx-auto my-3 shrink-0" />
              <div className="flex items-center px-5 pb-4 shrink-0">
                <button
                  onClick={() => setShowAdd(false)}
                  className="text-sm font-medium text-[#60A5FA] w-16 text-left"
                >
                  Cancel
                </button>
                <h3 className="flex-1 text-center text-[17px] font-bold">Add prescription</h3>
                <div className="w-16" />
              </div>
              <div className="px-5 pb-8 text-sm text-muted-foreground">
                Upload photo, scan, or fill details manually.
              </div>
            </div>
          </div>
        )}

        {/* Detail overlay */}
        {openRx && <PrescriptionDetail rx={openRx} onClose={() => setOpenId(null)} />}

        {/* Fullscreen search overlay */}
        {showSearch && (
          <div className="fixed inset-0 z-[80] bg-background flex flex-col">
            <div className="px-4 pt-4 pb-3 flex items-center gap-3">
              <button
                onClick={() => { setShowSearch(false); setQuery(""); }}
                className="h-10 w-10 flex items-center justify-center rounded-full"
                aria-label="Close search"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 flex items-center gap-2 rounded-full bg-muted/60 px-4 py-2.5">
                <SearchIcon className="w-4 h-4 text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && commitSearch(query)}
                  placeholder="Find prescriptions"
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                />
                {query && (
                  <button onClick={() => setQuery("")}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-6">
              {query.trim() === "" ? (
                recent.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Recent</p>
                    <div className="flex flex-wrap gap-2">
                      {recent.map((r) => (
                        <button
                          key={r}
                          onClick={() => setQuery(r)}
                          className="px-3 py-1.5 rounded-full border border-border/60 text-xs"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              ) : results.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground pt-16">
                  No matching prescriptions.
                </p>
              ) : (
                <div className="space-y-3">
                  {results.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => { setShowSearch(false); setOpenId(r.id); }}
                      className="w-full text-left bg-card rounded-2xl px-4 py-3.5 border border-border/60 flex items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-muted-foreground">{r.date}</p>
                        <p className="font-semibold text-[15px] mt-0.5 truncate">
                          {r.doctor} — {r.specialty}
                        </p>
                        <p className="text-[12px] text-muted-foreground mt-0.5">{r.items} items</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </MiniAppShell>
    </AppLockGate>
  );
}
