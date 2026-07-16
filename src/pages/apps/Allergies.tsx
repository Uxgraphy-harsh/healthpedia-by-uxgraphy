import { Plus, AlertTriangle } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";

const allergies = [
  { name: "Peanuts", severity: "Severe", reaction: "Anaphylaxis", color: "bg-[#EF4444]" },
  { name: "Pollen", severity: "Mild", reaction: "Sneezing, itchy eyes", color: "bg-[#F59E0B]" },
  { name: "Penicillin", severity: "Moderate", reaction: "Rash", color: "bg-[#F97316]" },
];

export default function Allergies() {
  const app = getMiniApp("allergies")!;
  return (
    <MiniAppShell
      appId="allergies"
      name={app.name}
      tagline={app.tagline}
      icon={app.icon}
      bg={app.bg}
      fg={app.fg}
      action={
        <button className="w-10 h-10 rounded-full bg-[#F66B9A] text-white flex items-center justify-center shrink-0">
          <Plus className="w-5 h-5" />
        </button>
      }
    >
      <div className="space-y-2">
        {allergies.map((a) => (
          <div key={a.name} className="bg-card rounded-2xl p-4 border border-border/40 flex items-start gap-3">
            <div className={`w-11 h-11 rounded-xl ${a.color}/12 flex items-center justify-center shrink-0`}>
              <AlertTriangle className={`w-5 h-5 ${a.color.replace("bg-", "text-")}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{a.name}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.color} text-white`}>
                  {a.severity}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">{a.reaction}</p>
            </div>
          </div>
        ))}
      </div>
    </MiniAppShell>
  );
}
