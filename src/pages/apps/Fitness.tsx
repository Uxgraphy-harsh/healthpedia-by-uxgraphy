import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";
import { Check, Plus, Smartphone } from "lucide-react";

const devices = [
  { name: "Apple Watch Series 9", connected: true, syncedAgo: "2 min ago" },
  { name: "Google Fit", connected: true, syncedAgo: "5 min ago" },
  { name: "Fitbit Charge 6", connected: false, syncedAgo: "" },
  { name: "Oura Ring", connected: false, syncedAgo: "" },
];

export default function Fitness() {
  const app = getMiniApp("fitness")!;
  return (
    <MiniAppShell
      appId="fitness"
      name={app.name}
      tagline={app.tagline}
      icon={app.icon}
      bg={app.bg}
      fg={app.fg}
    >
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { l: "Steps", v: "6,240" },
          { l: "Active", v: "42m" },
          { l: "Kcal", v: "1,847" },
        ].map((s) => (
          <div key={s.l} className="bg-card rounded-2xl p-3 text-center border border-border/40">
            <p className="text-lg font-bold">{s.v}</p>
            <p className="text-[10px] text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
        Devices & apps
      </h3>
      <div className="space-y-2">
        {devices.map((d) => (
          <div key={d.name} className="bg-card rounded-2xl p-3.5 flex items-center gap-3 border border-border/40">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/12 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-[#10B981]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{d.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {d.connected ? `Syncing · ${d.syncedAgo}` : "Not connected"}
              </p>
            </div>
            {d.connected ? (
              <Check className="w-4 h-4 text-[#22C55E]" />
            ) : (
              <button className="text-[11px] font-semibold text-[#F66B9A]">Connect</button>
            )}
          </div>
        ))}
        <button className="w-full mt-2 py-3 rounded-2xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add device
        </button>
      </div>
    </MiniAppShell>
  );
}
