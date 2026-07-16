import { useState } from "react";
import { Search, Upload, X } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import AppLockGate from "@/components/AppLockGate";
import { getMiniApp } from "@/data/miniApps";

type TabKey = "reports" | "symptoms" | "prescriptions";

interface VaultFolder {
  id: string;
  name: string;
  updated: string;
  files: number;
  emoji: string;
  tab: TabKey;
}

const initialFolders: VaultFolder[] = [
  { id: "f1", name: "Thyroid", updated: "14 Jan 2025", files: 6, emoji: "🦋", tab: "reports" },
  { id: "f2", name: "Diabetes", updated: "14 Jan 2025", files: 4, emoji: "🩸", tab: "reports" },
  { id: "f3", name: "Cardiovascular", updated: "2 Nov 2024", files: 3, emoji: "❤️", tab: "reports" },
  { id: "f4", name: "General", updated: "2 Nov 2024", files: 8, emoji: "🗂️", tab: "reports" },
  { id: "s1", name: "Headaches", updated: "20 Feb 2025", files: 5, emoji: "🤕", tab: "symptoms" },
  { id: "s2", name: "Fatigue", updated: "10 Feb 2025", files: 3, emoji: "😮‍💨", tab: "symptoms" },
  { id: "p1", name: "Metformin", updated: "5 Mar 2025", files: 2, emoji: "💊", tab: "prescriptions" },
  { id: "p2", name: "Thyronorm", updated: "12 Jan 2025", files: 4, emoji: "🧴", tab: "prescriptions" },
];

const TABS: { key: TabKey; label: string; emoji: string }[] = [
  { key: "reports", label: "Reports", emoji: "🗂️" },
  { key: "symptoms", label: "Symptoms", emoji: "🥺" },
  { key: "prescriptions", label: "Prescriptions", emoji: "💊" },
];

export default function Vault() {
  const app = getMiniApp("vault")!;
  const [tab, setTab] = useState<TabKey>("reports");
  const [query, setQuery] = useState("");
  const [folders, setFolders] = useState(initialFolders);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");

  const filtered = folders
    .filter((f) => f.tab === tab)
    .filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));

  const createFolder = () => {
    if (!newName.trim()) return;
    setFolders((prev) => [
      {
        id: `n${Date.now()}`,
        name: newName.trim(),
        updated: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        files: 0,
        emoji: tab === "prescriptions" ? "💊" : tab === "symptoms" ? "🩺" : "📁",
        tab,
      },
      ...prev,
    ]);
    setNewName("");
    setShowAdd(false);
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
      >
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search report name, symptom, note…"
            className="w-full rounded-full border border-border/50 bg-muted/40 pl-11 pr-10 py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted flex items-center justify-center"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-border/50 mb-5">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative pb-2.5 text-sm font-semibold flex items-center gap-1.5 ${
                  active ? "text-[#60A5FA]" : "text-muted-foreground"
                }`}
              >
                <span className="text-base leading-none">{t.emoji}</span>
                {t.label}
                {active && (
                  <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#60A5FA] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Folder grid */}
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((f) => (
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

        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-10">
            No {tab} yet. Tap upload to add.
          </p>
        )}

        {/* Floating upload pill (pink tinted like reference) */}
        {!showAdd && (
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
              <h3 className="text-lg font-bold mb-1">New {TABS.find((t) => t.key === tab)?.label.toLowerCase()} folder</h3>
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
      </MiniAppShell>
    </AppLockGate>
  );
}
