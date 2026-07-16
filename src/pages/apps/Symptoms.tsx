import { useState } from "react";
import { Plus } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";
import { sampleSymptoms } from "@/data/sampleData";

export default function Symptoms() {
  const app = getMiniApp("symptoms")!;
  const [symptoms] = useState(sampleSymptoms);

  return (
    <MiniAppShell
      appId="symptoms"
      name={app.name}
      tagline={app.tagline}
      icon={app.icon}
      bg={app.bg}
      fg={app.fg}
    >
      <div className="space-y-2">
        {symptoms.map((s) => (
          <div key={s.id} className="bg-card rounded-2xl p-4 border border-border/40">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-sm">{s.name}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                s.severity >= 7 ? "bg-[#EF4444]/12 text-[#EF4444]"
                : s.severity >= 4 ? "bg-[#F59E0B]/12 text-[#F59E0B]"
                : "bg-[#22C55E]/12 text-[#22C55E]"
              }`}>
                {s.severity}/10
              </span>
            </div>
            {s.notes && <p className="text-[11px] text-muted-foreground mb-1.5">{s.notes}</p>}
            <p className="text-[10px] text-muted-foreground">
              {new Date(s.loggedAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
            </p>
          </div>
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
