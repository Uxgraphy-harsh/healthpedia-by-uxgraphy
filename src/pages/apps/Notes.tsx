import { useState } from "react";
import { Plus, AtSign, X } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp, miniApps } from "@/data/miniApps";

interface Note {
  id: string;
  content: string;
  createdAt: string;
  refs: { appId: string; label: string }[];
}

const initial: Note[] = [
  {
    id: "n1",
    content: "Nausea started 2 hours after taking Metformin — noting per doctor's advice.",
    createdAt: "Today · 9:30 AM",
    refs: [
      { appId: "prescriptions", label: "Metformin 500mg" },
      { appId: "symptoms", label: "Nausea" },
    ],
  },
  {
    id: "n2",
    content: "Dr. Sharma advised increasing water to 3L/day.",
    createdAt: "Yesterday",
    refs: [{ appId: "appointments", label: "Dr. Sharma · Mar 10" }],
  },
];

function tagColor(appId: string) {
  const a = miniApps.find((x) => x.id === appId);
  return { bg: a?.bg ?? "bg-muted", fg: a?.fg ?? "text-muted-foreground", name: a?.name ?? appId };
}

export default function Notes() {
  const app = getMiniApp("notes")!;
  const [notes, setNotes] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [text, setText] = useState("");
  const [pickingRef, setPickingRef] = useState(false);
  const [refs, setRefs] = useState<Note["refs"]>([]);

  const save = () => {
    if (!text.trim()) return;
    setNotes((prev) => [
      { id: `n${Date.now()}`, content: text.trim(), createdAt: "Just now", refs },
      ...prev,
    ]);
    setText("");
    setRefs([]);
    setShowAdd(false);
  };

  return (
    <MiniAppShell
      appId="notes"
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
      <div className="space-y-2.5">
        {notes.map((n) => (
          <div key={n.id} className="bg-card rounded-2xl p-4 border border-border/40">
            <p className="text-sm leading-relaxed">{n.content}</p>
            {n.refs.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {n.refs.map((r, i) => {
                  const c = tagColor(r.appId);
                  return (
                    <span
                      key={i}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.fg} inline-flex items-center gap-1`}
                    >
                      <AtSign className="w-2.5 h-2.5" />
                      {c.name}: {r.label}
                    </span>
                  );
                })}
              </div>
            )}
            <p className="text-[10px] text-muted-foreground mt-2">{n.createdAt}</p>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => setShowAdd(false)}>
          <div
            className="w-full max-w-md mx-auto bg-background rounded-t-3xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-4" />
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold">New note</p>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write anything… tap @ to tag an app entry"
              rows={4}
              className="w-full rounded-2xl bg-muted p-3 text-sm resize-none outline-none"
            />

            {refs.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {refs.map((r, i) => {
                  const c = tagColor(r.appId);
                  return (
                    <span key={i} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.fg} flex items-center gap-1`}>
                      @{c.name}: {r.label}
                      <button onClick={() => setRefs((p) => p.filter((_, j) => j !== i))}>
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => setPickingRef((p) => !p)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-xs font-medium"
              >
                <AtSign className="w-3.5 h-3.5" /> Tag app entry
              </button>
              <button
                onClick={save}
                disabled={!text.trim()}
                className="ml-auto px-4 py-2 rounded-full bg-[#F66B9A] text-white text-xs font-semibold disabled:opacity-40"
              >
                Save note
              </button>
            </div>

            {pickingRef && (
              <div className="mt-3 rounded-2xl border border-border/40 bg-card p-2 max-h-56 overflow-y-auto">
                {miniApps.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      const label = prompt(`Which ${a.name} entry?`);
                      if (label) setRefs((p) => [...p, { appId: a.id, label }]);
                      setPickingRef(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted text-left"
                  >
                    <div className={`w-7 h-7 rounded-lg ${a.bg} flex items-center justify-center`}>
                      <a.icon className={`w-3.5 h-3.5 ${a.fg}`} />
                    </div>
                    <span className="text-xs font-medium">{a.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </MiniAppShell>
  );
}
