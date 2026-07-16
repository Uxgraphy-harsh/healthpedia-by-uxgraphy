import { Baby } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";

const kids = [
  { name: "Aarav", age: "6 yrs", nextVaccine: "MMR booster · Apr 12", initials: "A", color: "bg-[#FB923C]" },
  { name: "Zara", age: "3 yrs", nextVaccine: "DTP booster · May 4", initials: "Z", color: "bg-[#EC4899]" },
];

export default function Childcare() {
  const app = getMiniApp("childcare")!;
  return (
    <MiniAppShell
      appId="childcare"
      name={app.name}
      tagline={app.tagline}
      icon={app.icon}
      bg={app.bg}
      fg={app.fg}
    >
      <div className="space-y-3">
        {kids.map((k) => (
          <div key={k.name} className="bg-card rounded-2xl p-4 border border-border/40 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${k.color} text-white text-xl font-bold flex items-center justify-center`}>
              {k.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{k.name}</p>
              <p className="text-[11px] text-muted-foreground">{k.age}</p>
              <p className="text-[11px] text-[#FB923C] font-medium mt-1">Next: {k.nextVaccine}</p>
            </div>
          </div>
        ))}
        <button className="w-full py-3 rounded-2xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
          <Baby className="w-4 h-4" /> Add child profile
        </button>
      </div>
    </MiniAppShell>
  );
}
