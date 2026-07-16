import { useState } from "react";
import { Upload } from "lucide-react";
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
      </MiniAppShell>
    </AppLockGate>
  );
}
