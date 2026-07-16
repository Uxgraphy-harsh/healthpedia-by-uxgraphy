import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import AppLockGate from "@/components/AppLockGate";
import { getMiniApp } from "@/data/miniApps";

type Condition = { name: string; diagnosed: string };
type Member = {
  id: string;
  name: string;
  relation: string;
  age: number;
  hpid: string;
  avatar: string;
  active: boolean;
  conditions: Condition[];
};

const initialMembers: Member[] = [
  {
    id: "1",
    name: "Sujoy Sahu",
    relation: "Father",
    age: 79,
    hpid: "#8836477253",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Sujoy&backgroundColor=fce7f3",
    active: true,
    conditions: [
      { name: "Hypertension", diagnosed: "early 50s" },
      { name: "Type 2 Diabetes", diagnosed: "age 48" },
    ],
  },
  {
    id: "2",
    name: "Miska Sahu",
    relation: "Mother",
    age: 79,
    hpid: "#9354677563",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Miska&backgroundColor=fef9c3",
    active: true,
    conditions: [{ name: "Hypothyroidism", diagnosed: "late 40s" }],
  },
];

export default function FamilyHistory() {
  const app = getMiniApp("family")!;
  const [members, setMembers] = useState<Member[]>(initialMembers);

  const removeCondition = (mid: string, name: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === mid ? { ...m, conditions: m.conditions.filter((c) => c.name !== name) } : m
      )
    );
  };

  return (
    <AppLockGate appId="family">
      <MiniAppShell
        appId="family"
        name={app.name}
        tagline={app.tagline}
        icon={app.icon}
        bg={app.bg}
        fg={app.fg}
        bottomActions={[]}
      >
        <div className="space-y-4 pb-32">
          {members.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-border/60 bg-card overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start gap-3 p-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-muted flex-shrink-0 ring-1 ring-border/40">
                  <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-muted-foreground">
                    {m.relation} · {m.age} Years
                  </p>
                  <p className="text-[16px] font-bold leading-tight truncate">{m.name}</p>
                  <p className="text-[12px] text-[#F66B9A] underline underline-offset-2 mt-0.5">
                    HPID: {m.hpid}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button className="text-[13px] font-medium text-[#60A5FA]">Edit</button>
                  {m.active && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                      Active Today
                    </span>
                  )}
                </div>
              </div>

              {/* Conditions */}
              {m.conditions.length > 0 && (
                <div className="border-t border-border/60">
                  {m.conditions.map((c, i) => (
                    <div
                      key={c.name}
                      className={`flex items-center justify-between px-4 py-3 ${
                        i > 0 ? "border-t border-border/60" : ""
                      }`}
                    >
                      <div>
                        <p className="text-[15px] font-semibold">{c.name}</p>
                        <p className="text-[12px] text-muted-foreground">
                          Diagnosed · {c.diagnosed}
                        </p>
                      </div>
                      <button
                        onClick={() => removeCondition(m.id, c.name)}
                        className="p-1.5 text-muted-foreground hover:text-foreground"
                        aria-label={`Delete ${c.name}`}
                      >
                        <Trash2 className="w-[18px] h-[18px]" strokeWidth={1.75} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Floating Add member button */}
        <button
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg"
          style={{ background: "#171717" }}
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
          <span className="font-semibold">Add member</span>
        </button>
      </MiniAppShell>
    </AppLockGate>
  );
}
