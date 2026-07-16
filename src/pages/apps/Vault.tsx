import { useState } from "react";
import { Upload, Search as SearchIcon, FolderOpen, X } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import AppLockGate from "@/components/AppLockGate";
import { getMiniApp } from "@/data/miniApps";

interface VaultFolder {
  id: string;
  name: string;
  updated: string;
  files: number;
  emoji: string;
}

const initialFolders: VaultFolder[] = [
  { id: "f1", name: "Thyroid", updated: "14 Jan 2025", files: 6, emoji: "🦋" },
  { id: "f2", name: "Diabetes", updated: "14 Jan 2025", files: 4, emoji: "🩸" },
  { id: "f3", name: "Cardiovascular", updated: "2 Nov 2024", files: 3, emoji: "❤️" },
  { id: "f4", name: "General", updated: "2 Nov 2024", files: 8, emoji: "🗂️" },
  { id: "p1", name: "Metformin", updated: "5 Mar 2025", files: 2, emoji: "💊" },
  { id: "p2", name: "Thyronorm", updated: "12 Jan 2025", files: 4, emoji: "🧴" },
];

export default function Vault() {
  const app = getMiniApp("vault")!;
  const [folders, setFolders] = useState(initialFolders);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

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
          { icon: Plus, label: "New", primary: true, onClick: () => setShowAdd(true) },
          { icon: SearchIcon, label: "Search", onClick: () => setShowSearch(true) },
        ]}
      >
        {/* Folder grid */}
        <div className="grid grid-cols-2 gap-3">
          {folders.map((f) => (
            <button
              key={f.id}
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
