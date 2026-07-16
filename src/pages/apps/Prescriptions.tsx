import { useMemo, useState } from "react";
import { Plus, User, Building2, Calendar, Pill, Search as SearchIcon, X, ArrowLeft } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import AppLockGate from "@/components/AppLockGate";
import { getMiniApp } from "@/data/miniApps";

interface Rx {
  id: string;
  title: string;
  doctor: string;
  hospital: string;
  date: string;
  tags: string[];
}

const initialRx: Rx[] = [
  {
    id: "p1",
    title: "Metformin 500mg + Vitamin D3",
    doctor: "Dr. Sharma",
    hospital: "Apollo Clinic",
    date: "28 Feb 2026",
    tags: ["Diabetes"],
  },
  {
    id: "p2",
    title: "Atorvastatin 10mg",
    doctor: "Dr. Mehta",
    hospital: "Fortis",
    date: "10 Jan 2026",
    tags: ["Cardio"],
  },
];

export default function Prescriptions() {
  const app = getMiniApp("prescriptions")!;
  const [rx] = useState<Rx[]>(initialRx);
  const [showAdd, setShowAdd] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

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
            <div key={r.id} className="bg-card rounded-2xl p-4 border border-border/40">
              <p className="font-semibold text-sm mb-2">{r.title}</p>
              <div className="space-y-1 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5"><User className="w-3 h-3" /> {r.doctor}</div>
                <div className="flex items-center gap-1.5"><Building2 className="w-3 h-3" /> {r.hospital}</div>
                <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {r.date}</div>
              </div>
              <div className="flex gap-1.5 mt-3">
                {r.tags.map((t) => (
                  <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#60A5FA]/10 text-[#60A5FA]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Floating Add prescription button */}
        {!showAdd && !showSearch && (
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
                    <div key={r.id} className="bg-card rounded-2xl p-4 border border-border/40">
                      <p className="font-semibold text-sm mb-2">{r.title}</p>
                      <div className="space-y-1 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1.5"><User className="w-3 h-3" /> {r.doctor}</div>
                        <div className="flex items-center gap-1.5"><Building2 className="w-3 h-3" /> {r.hospital}</div>
                        <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {r.date}</div>
                      </div>
                    </div>
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
