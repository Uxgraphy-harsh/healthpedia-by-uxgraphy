import { useState, useMemo } from "react";
import { Plus, ChevronRight } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";
import { sampleSymptoms } from "@/data/sampleData";

type Aggregated = {
  name: string;
  count: number;
  lastLoggedAt: string;
  status: "Passed" | "Ongoing";
};

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

export default function Symptoms() {
  const app = getMiniApp("symptoms")!;
  const [symptoms] = useState(sampleSymptoms);

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
    <MiniAppShell
      appId="symptoms"
      name={app.name}
      tagline={app.tagline}
      icon={app.icon}
      bg={app.bg}
      fg={app.fg}
    >
      <div className="space-y-3">
        {aggregated.map((s) => (
          <button
            key={s.name}
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
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg"
        style={{ background: "#171717" }}
      >
        <Plus className="h-5 w-5" strokeWidth={2.5} />
        <span className="font-semibold">Log symptom</span>
      </button>
    </MiniAppShell>
  );
}
