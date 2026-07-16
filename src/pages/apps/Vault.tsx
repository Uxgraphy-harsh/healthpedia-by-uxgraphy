import { useState } from "react";
import { FolderOpen, Folder, Plus, FileText, Image as ImageIcon, ChevronRight, Upload, StickyNote } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import AppLockGate from "@/components/AppLockGate";
import { getMiniApp } from "@/data/miniApps";

type FolderType = "health" | "general";
interface VaultFolder {
  id: string;
  name: string;
  type: FolderType;
  items: number;
  updated: string;
}

const initialFolders: VaultFolder[] = [
  { id: "f1", name: "Blood Reports", type: "health", items: 12, updated: "2 days ago" },
  { id: "f2", name: "Prescriptions", type: "health", items: 8, updated: "1 week ago" },
  { id: "f3", name: "Insurance Docs", type: "general", items: 5, updated: "3 days ago" },
  { id: "f4", name: "Sarah — Personal", type: "general", items: 14, updated: "Yesterday" },
];

export default function Vault() {
  const app = getMiniApp("vault")!;
  const [tab, setTab] = useState<"all" | FolderType>("all");
  const [folders, setFolders] = useState(initialFolders);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = tab === "all" ? folders : folders.filter((f) => f.type === tab);

  const addFolder = (type: FolderType) => {
    const name = prompt(`New ${type === "health" ? "health records" : "general"} folder name`);
    if (!name) return;
    setFolders((prev) => [
      { id: `f${Date.now()}`, name, type, items: 0, updated: "Just now" },
      ...prev,
    ]);
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
        action={
          <button
            onClick={() => setShowAdd(true)}
            className="w-10 h-10 rounded-full bg-[#F66B9A] text-white flex items-center justify-center shrink-0"
          >
            <Plus className="w-5 h-5" />
          </button>
        }
      >
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(["all", "health", "general"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                tab === t
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {t === "all" ? "All" : t === "health" ? "Health records" : "General"}
            </button>
          ))}
        </div>

        {/* Quick upload strip */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <button className="rounded-2xl bg-muted/60 p-3 flex flex-col items-center gap-1">
            <Upload className="w-4 h-4 text-muted-foreground" />
            <span className="text-[10px] font-medium">Upload</span>
          </button>
          <button className="rounded-2xl bg-muted/60 p-3 flex flex-col items-center gap-1">
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-[10px] font-medium">Scan</span>
          </button>
          <button className="rounded-2xl bg-muted/60 p-3 flex flex-col items-center gap-1">
            <StickyNote className="w-4 h-4 text-muted-foreground" />
            <span className="text-[10px] font-medium">Note</span>
          </button>
        </div>

        {/* Folders */}
        <div className="space-y-2">
          {filtered.map((f) => {
            const Icon = f.type === "health" ? FolderOpen : Folder;
            return (
              <button
                key={f.id}
                className="w-full bg-card rounded-2xl p-4 flex items-center gap-3 border border-border/40 text-left"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    f.type === "health" ? "bg-[#F66B9A]/12" : "bg-[#60A5FA]/12"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      f.type === "health" ? "text-[#F66B9A]" : "text-[#60A5FA]"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{f.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {f.items} items · {f.updated}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>

        {/* Recent files */}
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mt-6 mb-2">
          Recent files
        </h3>
        <div className="space-y-2">
          {[
            { name: "HbA1c report — Mar 2026.pdf", type: "PDF" },
            { name: "Metformin prescription.jpg", type: "IMG" },
          ].map((file) => (
            <div
              key={file.name}
              className="bg-card rounded-2xl p-3.5 flex items-center gap-3 border border-border/40"
            >
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="flex-1 text-sm font-medium truncate">{file.name}</p>
              <span className="text-[9px] font-bold text-muted-foreground">{file.type}</span>
            </div>
          ))}
        </div>

        {/* Add folder sheet */}
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
              <h3 className="text-lg font-bold mb-4">Create folder</h3>
              <button
                onClick={() => addFolder("health")}
                className="w-full bg-[#F66B9A]/10 rounded-2xl p-4 flex items-center gap-3 mb-2 text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-[#F66B9A]/20 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-[#F66B9A]" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Health records folder</p>
                  <p className="text-[11px] text-muted-foreground">
                    Auto-tags labs, prescriptions, imaging
                  </p>
                </div>
              </button>
              <button
                onClick={() => addFolder("general")}
                className="w-full bg-[#60A5FA]/10 rounded-2xl p-4 flex items-center gap-3 text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-[#60A5FA]/20 flex items-center justify-center">
                  <Folder className="w-5 h-5 text-[#60A5FA]" />
                </div>
                <div>
                  <p className="text-sm font-semibold">General folder</p>
                  <p className="text-[11px] text-muted-foreground">
                    Any files, notes, nested folders
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}
      </MiniAppShell>
    </AppLockGate>
  );
}
