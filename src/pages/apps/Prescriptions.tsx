import { Plus, User, Building2, Calendar } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import AppLockGate from "@/components/AppLockGate";
import { getMiniApp } from "@/data/miniApps";

const rx = [
  {
    id: "p1",
    title: "Metformin 500mg + Vitamin D3",
    doctor: "Dr. Sharma",
    hospital: "Apollo Clinic",
    date: "28 Feb 2026",
    tags: ["Diabetes"],
  },
  {
    id: "p2",
    title: "Atorvastatin 10mg",
    doctor: "Dr. Mehta",
    hospital: "Fortis",
    date: "10 Jan 2026",
    tags: ["Cardio"],
  },
];

export default function Prescriptions() {
  const app = getMiniApp("prescriptions")!;
  return (
    <AppLockGate appId="prescriptions">
      <MiniAppShell
        appId="prescriptions"
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
        <div className="space-y-3">
          {rx.map((r) => (
            <div key={r.id} className="bg-card rounded-2xl p-4 border border-border/40">
              <p className="font-semibold text-sm mb-2">{r.title}</p>
              <div className="space-y-1 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5"><User className="w-3 h-3" /> {r.doctor}</div>
                <div className="flex items-center gap-1.5"><Building2 className="w-3 h-3" /> {r.hospital}</div>
                <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {r.date}</div>
              </div>
              <div className="flex gap-1.5 mt-3">
                {r.tags.map((t) => (
                  <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#60A5FA]/10 text-[#60A5FA]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </MiniAppShell>
    </AppLockGate>
  );
}
