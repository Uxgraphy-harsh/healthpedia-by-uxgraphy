import { useState, useMemo, useRef } from "react";
import { Upload, Search as SearchIcon, FolderOpen, X, ArrowLeft, MoreHorizontal, SlidersHorizontal, FileText, Image as ImageIcon, ChevronRight, Check, Sparkles } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import AppLockGate from "@/components/AppLockGate";
import { getMiniApp } from "@/data/miniApps";

interface VaultFile {
  name: string;
  type: "pdf" | "img";
}
interface VaultReport {
  id: string;
  day: string;
  month: string;
  year: string;
  dateISO: string; // for sorting
  lab: string;
  doctor: string;
  summary: string;
  files: VaultFile[];
}
interface VaultFolder {
  id: string;
  name: string;
  updated: string;
  files: number;
  emoji: string;
  reports?: VaultReport[];
}

const sampleReports: VaultReport[] = [
  {
    id: "r1", day: "14", month: "JAN", year: "2025", dateISO: "2025-01-14",
    lab: "SRL Diagnostics, Baner", doctor: "Ref. Dr. Meena Sharma",
    summary: "TSH came back elevated at 6.2 mIU/L, above the normal range. Free T3 and T4 are within limits. Anti-TPO antibodies slightly raised. Doctor has recommended a retest in 6 weeks and a possible Eltroxin dosage review.",
    files: [{ name: "Thyroid_Jan25.pdf", type: "pdf" }, { name: "Report_p1.jpg", type: "img" }, { name: "Report_p2.jpg", type: "img" }],
  },
  {
    id: "r2", day: "22", month: "OCT", year: "2024", dateISO: "2024-10-22",
    lab: "Metropolis Healthcare", doctor: "Ref. Dr. Anil Kapoor",
    summary: "TSH within normal range at 3.1 mIU/L. Anti-TPO stable. Continue current dosage; retest in 3 months as routine follow-up.",
    files: [{ name: "Thyroid_Oct24.pdf", type: "pdf" }, { name: "Scan_1.jpg", type: "img" }],
  },
  {
    id: "r3", day: "05", month: "JUL", year: "2024", dateISO: "2024-07-05",
    lab: "Thyrocare, Aundh", doctor: "Ref. Dr. Meena Sharma",
    summary: "Initial workup. TSH elevated, T4 low-normal. Started on Eltroxin 25 mcg.",
    files: [{ name: "Baseline.pdf", type: "pdf" }],
  },
];

const initialFolders: VaultFolder[] = [
  { id: "f1", name: "Thyroid", updated: "14 Jan 2025", files: 6, emoji: "🦋", reports: sampleReports },
  { id: "f2", name: "Diabetes", updated: "14 Jan 2025", files: 4, emoji: "🩸" },
  { id: "f3", name: "Cardiovascular", updated: "2 Nov 2024", files: 3, emoji: "❤️" },
  { id: "f4", name: "General", updated: "2 Nov 2024", files: 8, emoji: "🗂️" },
  { id: "p1", name: "Metformin", updated: "5 Mar 2025", files: 2, emoji: "💊" },
  { id: "p2", name: "Thyronorm", updated: "12 Jan 2025", files: 4, emoji: "🧴" },
];

type SortKey = "newest" | "oldest" | "most" | "lab";
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest date first" },
  { key: "oldest", label: "Oldest data first" },
  { key: "most", label: "Most files" },
  { key: "lab", label: "Lab name A-Z" },
];

export default function Vault() {
  const app = getMiniApp("vault")!;
  const [folders, setFolders] = useState(initialFolders);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [folderQuery, setFolderQuery] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [openReportId, setOpenReportId] = useState<string | null>(null);

  const openFolder = openFolderId ? folders.find((f) => f.id === openFolderId) : null;
  const openReport = openReportId ? openFolder?.reports?.find((r) => r.id === openReportId) ?? null : null;

  const sortedReports = useMemo(() => {
    const reports = openFolder?.reports ?? [];
    const copy = [...reports];
    switch (sortKey) {
      case "newest": copy.sort((a, b) => b.dateISO.localeCompare(a.dateISO)); break;
      case "oldest": copy.sort((a, b) => a.dateISO.localeCompare(b.dateISO)); break;
      case "most": copy.sort((a, b) => b.files.length - a.files.length); break;
      case "lab": copy.sort((a, b) => a.lab.localeCompare(b.lab)); break;
    }
    const q = folderQuery.trim().toLowerCase();
    return q
      ? copy.filter((r) => r.lab.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q) || r.files.some((fi) => fi.name.toLowerCase().includes(q)))
      : copy;
  }, [openFolder, sortKey, folderQuery]);

  const createFolder = () => {
    if (!newName.trim()) return;
    setFolders((prev) => [
      {
        id: `n${Date.now()}`,
        name: newName.trim(),
        updated: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        files: 0,
        emoji: "📁",
      },
      ...prev,
    ]);
    setNewName("");
    setShowAdd(false);
  };

  const results = query.trim()
    ? folders.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const commitSearch = (q: string) => {
    const s = q.trim();
    if (!s) return;
    setRecent((prev) => [s, ...prev.filter((x) => x !== s)].slice(0, 8));
  };

  return (
    <AppLockGate appId="vault">
      <MiniAppShell
        appId="vault"
        name={app.name}
        tagline={app.tagline}
        icon={app.icon}
        bg={app.bg}
        fg={app.fg}
        bottomActions={[
          { icon: FolderOpen, label: "Files", active: true },
          { icon: SearchIcon, label: "Search", onClick: () => setShowSearch(true) },
        ]}
      >
        {/* Folder grid */}
        <div className="grid grid-cols-2 gap-3">
          {folders.map((f) => (
            <button
              key={f.id}
              onClick={() => setOpenFolderId(f.id)}
              className="bg-card rounded-2xl p-4 border border-border/40 text-left flex flex-col gap-3 aspect-[1/1.05]"
            >
              <div className="text-4xl leading-none">{f.emoji}</div>
              <div className="mt-auto">
                <p className="text-[15px] font-bold leading-tight">{f.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Updated · {f.updated}
                </p>
                <span className="inline-block mt-2 text-[10px] font-medium px-2.5 py-1 rounded-full border border-border/60 text-muted-foreground">
                  {f.files} files
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Folder detail overlay */}
        {openFolder && (
          <div className="fixed inset-0 z-[70] bg-background flex flex-col">
            {/* Header */}
            <div className="px-5 pt-5 pb-3 flex items-start gap-3">
              <button onClick={() => setOpenFolderId(null)} className="pt-1">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="text-3xl leading-none pt-0.5">{openFolder.emoji}</div>
              <div className="flex-1 min-w-0">
                <h1 className="text-[22px] font-bold leading-tight">{openFolder.name}</h1>
                <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mt-0.5">
                  {openFolder.reports?.reduce((a, r) => a + r.files.length, 0) ?? openFolder.files} files total
                </p>
              </div>
              <button className="pt-1">
                <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Search + Sort */}
            <div className="px-5 pb-4 flex items-center gap-3 border-b border-border/40">
              <div className="flex-1 flex items-center gap-2 rounded-full bg-muted/60 px-4 py-2.5">
                <SearchIcon className="w-4 h-4 text-muted-foreground" />
                <input
                  value={folderQuery}
                  onChange={(e) => setFolderQuery(e.target.value)}
                  placeholder="Search report name, symptom, n..."
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                />
                {folderQuery && (
                  <button onClick={() => setFolderQuery("")}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowSort(true)}
                className="w-11 h-11 rounded-full border border-border/60 flex items-center justify-center"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Report list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {sortedReports.length === 0 && (
                <p className="text-center text-sm text-muted-foreground pt-16">
                  No reports in this folder yet.
                </p>
              )}
              {sortedReports.map((r, idx) => {
                const prevYear = idx > 0 ? sortedReports[idx - 1].year : null;
                const showYearDivider = prevYear && prevYear !== r.year;
                return (
                  <div key={r.id}>
                    {showYearDivider && (
                      <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-border/60" />
                        <span className="text-xs text-muted-foreground">{r.year}</span>
                        <div className="flex-1 h-px bg-border/60" />
                      </div>
                    )}
                    <button
                      onClick={() => setOpenReportId(r.id)}
                      className="w-full text-left rounded-2xl border border-border/40 bg-card p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white shrink-0"
                          style={{ background: "#2A1A1F" }}
                        >
                          <span className="text-lg font-bold leading-none">{r.day}</span>
                          <span className="text-[9px] font-semibold tracking-wider mt-0.5">{r.month}</span>
                          <span className="text-[8px] opacity-80 mt-0.5">{r.year}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-muted-foreground">
                            {r.files.length} files · PDF + {r.files.filter((f) => f.type === "img").length} photos
                          </p>
                          <p className="text-[15px] font-bold leading-tight mt-0.5">{r.lab}</p>
                          <p className="text-[13px] text-muted-foreground">{r.doctor}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground mt-1" />
                      </div>
                      <p className="text-[13px] leading-relaxed text-foreground/80 mt-3">
                        {r.summary}
                      </p>
                      <div className="border-t border-border/40 mt-3 pt-3 flex flex-wrap gap-2">
                        {r.files.map((fi) => (
                          <div
                            key={fi.name}
                            className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-2.5 py-1"
                          >
                            {fi.type === "pdf" ? (
                              <span className="w-4 h-4 rounded-sm bg-[#F66B9A]/15 text-[#F66B9A] text-[8px] font-bold flex items-center justify-center">PDF</span>
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5 text-[#60A5FA]" />
                            )}
                            <span className="text-[11px] font-medium">{fi.name}</span>
                          </div>
                        ))}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Sort bottom sheet */}
            {showSort && (
              <div
                className="absolute inset-0 z-10 bg-black/40 flex items-end"
                onClick={() => setShowSort(false)}
              >
                <div
                  className="w-full max-w-md mx-auto bg-background rounded-t-3xl pb-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-10 h-1 rounded-full bg-muted mx-auto my-3" />
                  <div className="flex items-center px-5 pb-3">
                    <button
                      onClick={() => setShowSort(false)}
                      className="text-sm font-medium text-[#60A5FA] w-16 text-left"
                    >
                      Cancel
                    </button>
                    <h3 className="flex-1 text-center text-[15px] font-bold">Sort by</h3>
                    <div className="w-16" />
                  </div>
                  <div className="border-t border-border/60">
                    {SORT_OPTIONS.map((o) => (
                      <button
                        key={o.key}
                        onClick={() => {
                          setSortKey(o.key);
                          setShowSort(false);
                        }}
                        className="w-full flex items-center justify-between px-5 py-4 border-b border-border/40 last:border-b-0 text-left"
                      >
                        <span className="text-[15px] font-medium">{o.label}</span>
                        {sortKey === o.key && <Check className="w-5 h-5 text-[#60A5FA]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Report detail overlay */}
        {openReport && (
          <ReportDetail report={openReport} onClose={() => setOpenReportId(null)} />
        )}

        {/* Floating upload pill */}
        {!showAdd && !showSearch && (
          <button
            onClick={() => setShowAdd(true)}
            className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3.5 shadow-lg border border-[#F66B9A]/30"
            style={{ background: "#FDECF2", color: "#F66B9A" }}
          >
            <Upload className="h-4 w-4" strokeWidth={2.5} />
            <span className="font-semibold text-sm">Upload a new report</span>
          </button>
        )}

        {/* Add sheet */}
        {showAdd && (
          <div
            className="fixed inset-0 z-50 bg-black/40 flex items-end"
            onClick={() => setShowAdd(false)}
          >
            <div
              className="w-full max-w-md mx-auto bg-background rounded-t-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-5" />
              <h3 className="text-lg font-bold mb-1">New folder</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Group related files together for quick access.
              </p>
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createFolder()}
                placeholder="Folder name (e.g. Thyroid)"
                className="w-full rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-sm outline-none mb-4"
              />
              <button
                onClick={createFolder}
                disabled={!newName.trim()}
                className="w-full rounded-full py-3 font-semibold text-white disabled:opacity-40"
                style={{ background: "#F66B9A" }}
              >
                Create folder
              </button>
            </div>
          </div>
        )}

        {/* Fullscreen search overlay */}
        {showSearch && (
          <div className="fixed inset-0 z-[80] bg-background flex flex-col">
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
              <div className="flex-1 flex items-center gap-2 rounded-full bg-muted/60 px-4 py-2.5">
                <SearchIcon className="w-4 h-4 text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && commitSearch(query)}
                  placeholder="Find files"
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                />
                {query && (
                  <button onClick={() => setQuery("")}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setShowSearch(false);
                  setQuery("");
                }}
                className="text-sm font-medium text-[#60A5FA]"
              >
                Cancel
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              {query.trim() === "" ? (
                <>
                  {recent.length > 0 && (
                    <div className="mb-6">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                        Recent
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((r) => (
                          <button
                            key={r}
                            onClick={() => setQuery(r)}
                            className="rounded-full bg-muted/60 px-3 py-1.5 text-xs font-medium"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col items-center justify-center text-center pt-24">
                    <div className="w-24 h-20 mb-5 rounded-lg border-2 border-muted-foreground/30 relative flex items-center justify-center">
                      <div className="absolute -bottom-3 -right-3 w-11 h-11 rounded-full border-2 border-muted-foreground/40 bg-background" />
                      <div className="absolute -bottom-6 -right-6 w-3 h-3 border-2 border-muted-foreground/40 rotate-45 bg-background" />
                    </div>
                    <p className="text-base font-semibold mt-6">No recent searches</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-[240px]">
                      Your search history will be saved here for safe keeping.
                    </p>
                  </div>
                </>
              ) : results.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground pt-16">
                  No matches for "{query}"
                </p>
              ) : (
                <div className="space-y-2 pt-2">
                  {results.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        commitSearch(query);
                        setShowSearch(false);
                        setQuery("");
                      }}
                      className="w-full flex items-center gap-3 rounded-2xl border border-border/40 bg-card p-3 text-left"
                    >
                      <div className="text-2xl">{f.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{f.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {f.files} files · Updated {f.updated}
                        </p>
                      </div>
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

// ---------- Report Detail ----------
interface LabResult {
  parameter: string;
  sub: string;
  result: string;
  unit: string;
  range: string;
  flag?: boolean;
}
const DEMO_RESULTS: LabResult[] = [
  { parameter: "TSH", sub: "Thyroid stimulating hormone", result: "6.2", unit: "mIU/L", range: "0.4 – 4.0", flag: true },
  { parameter: "Free T3", sub: "Triiodothyronine", result: "3.1", unit: "pg/mL", range: "2.3 – 4.2" },
  { parameter: "Free T4", sub: "Thyroxine", result: "0.9", unit: "ng/dL", range: "0.8 – 1.8" },
  { parameter: "Anti-TPO", sub: "Thyroid peroxidase Ab", result: "42", unit: "IU/mL", range: "0 – 34", flag: true },
];

function ReportDetail({ report, onClose }: { report: VaultReport; onClose: () => void }) {
  const displayDate = `${report.day} ${report.month.charAt(0) + report.month.slice(1).toLowerCase()}, ${report.year}`;
  return (
    <div className="fixed inset-0 z-[85] bg-background flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-start gap-3">
        <button onClick={onClose} className="pt-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-[20px] font-bold leading-tight">{report.lab}</h1>
          <p className="text-[12px] text-muted-foreground mt-0.5 uppercase tracking-wider">{displayDate}</p>
        </div>
        <button className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-40 space-y-6">
        {/* Doctor's impression */}
        <div className="rounded-2xl bg-muted/40 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Doctor's Impression</p>
          <p className="text-[14px] leading-relaxed">
            "TSH elevated. Anti-TPO borderline positive. Patient on Eltroxin 50mcg — consider dose titration to 75mcg. Retest TSH and Anti-TPO after 6 weeks. Continue current diet and sleep schedule."
          </p>
          <p className="text-[12px] text-muted-foreground mt-3">– {report.doctor.replace(/^Ref\.\s*/, "")}, Endocrinologist</p>
        </div>

        {/* Report Details */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Report Details</p>
          <div className="rounded-2xl border border-border/40 bg-card divide-y divide-border/40">
            {[
              ["Hospital / Lab", report.lab],
              ["Referring doctor", report.doctor.replace(/^Ref\.\s*/, "")],
              ["Report date", `${report.day} ${report.month.charAt(0) + report.month.slice(1).toLowerCase()} ${report.year}`],
              ["Sample collected", `${report.day} ${report.month.charAt(0) + report.month.slice(1).toLowerCase()}  ·  7:30 AM`],
              ["Lab reference", "SRL/PUN/25/004821"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between px-4 py-3">
                <span className="text-[13px] text-muted-foreground">{k}</span>
                <span className="text-[13px] font-semibold text-right">{v}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Vitals */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Vitals at time of test</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Weight", value: "58", unit: "kg" },
              { label: "BMI", value: "20.3", unit: "" },
              { label: "BP", value: "118/76", unit: "" },
            ].map((v) => (
              <div key={v.label} className="rounded-2xl border border-border/40 bg-card p-3">
                <div className="w-6 h-6 rounded-md border border-border/60 flex items-center justify-center mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
                </div>
                <p className="text-[18px] font-bold leading-none">
                  {v.value}
                  {v.unit && <span className="text-[11px] font-medium text-muted-foreground ml-0.5">{v.unit}</span>}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">{v.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Results table */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Results</p>
          <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40">
              <span>Parameter</span>
              <span>Result</span>
              <span>Normal Range</span>
            </div>
            {DEMO_RESULTS.map((r) => (
              <div
                key={r.parameter}
                className="grid grid-cols-[1.4fr_1fr_1fr] px-4 py-3 border-b border-border/40 last:border-b-0"
                style={r.flag ? { background: "#FFF9E5" } : undefined}
              >
                <div>
                  <p className={`text-[13px] font-semibold ${r.flag ? "text-[#B45309]" : ""}`}>{r.parameter}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight">{r.sub}</p>
                </div>
                <div>
                  <p className="text-[13px] font-semibold">{r.result}</p>
                  <p className="text-[11px] text-muted-foreground">{r.unit}</p>
                </div>
                <p className="text-[12px] text-muted-foreground self-center">{r.range}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Prescribed Medicines */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Prescribed Medicines</p>
          <div className="flex gap-3 overflow-x-auto -mx-5 px-5 scrollbar-none">
            {[0, 1, 2].map((i) => (
              <div key={i} className="min-w-[170px] rounded-2xl border border-border/40 bg-card p-3">
                <div className="relative rounded-xl bg-muted/40 aspect-[4/3] flex items-center justify-center">
                  <span className="absolute top-2 right-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-background border border-border/60">1x</span>
                  <span className="text-3xl">💊</span>
                </div>
                <div className="mt-2 flex items-start gap-2">
                  <div className="w-8 h-8 rounded-md bg-muted/40 flex items-center justify-center text-lg">💊</div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold leading-tight">Thyrox 50 Tablet</p>
                    <p className="text-[11px] text-muted-foreground">~ Before food</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="w-7 h-7 rounded-md flex items-center justify-center text-[13px]" style={{ background: "#60A5FA", color: "white" }}>☀︎</span>
                  <span className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-semibold text-muted-foreground border border-border/60">L</span>
                  <span className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-semibold text-muted-foreground border border-border/60">D</span>
                  <span className="w-7 h-7 rounded-md flex items-center justify-center text-[13px] text-muted-foreground border border-border/60">☾</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Attachments */}
        <section>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Attachments</p>
          <div className="space-y-2">
            {report.files.map((fi) => (
              <div key={fi.name} className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card p-3">
                {fi.type === "pdf" ? (
                  <div className="w-10 h-10 rounded-lg bg-[#F66B9A]/15 text-[#F66B9A] text-[10px] font-bold flex items-center justify-center">PDF</div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-[#60A5FA]/15 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-[#60A5FA]" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate">{fi.name}</p>
                  <p className="text-[11px] text-muted-foreground">{fi.type === "pdf" ? "24.4 MB" : "1.7 MB"}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground -rotate-45" />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky footer */}
      <div className="absolute bottom-0 inset-x-0 px-5 pt-4 pb-6 bg-gradient-to-t from-background via-background to-background/0 flex gap-3">
        <button
          className="flex-1 h-12 rounded-full text-white font-semibold text-[15px] flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #6B1E3A, #2A1A1F)" }}
        >
          <span className="text-base">✦</span> Ask AI
        </button>
        <button className="flex-1 h-12 rounded-full border border-border font-semibold text-[15px]">
          Share
        </button>
      </div>
    </div>
  );
}
