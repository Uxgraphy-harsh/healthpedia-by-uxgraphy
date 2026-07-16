import { Plus, Dna } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import AppLockGate from "@/components/AppLockGate";
import { getMiniApp } from "@/data/miniApps";

const records = [
  { member: "Mother", condition: "Type 2 Diabetes", age: "diagnosed 45" },
  { member: "Father", condition: "Hypertension", age: "diagnosed 50" },
  { member: "Maternal grandma", condition: "Thyroid", age: "diagnosed 38" },
  { member: "Paternal grandpa", condition: "Cardiac (bypass)", age: "62" },
];

export default function FamilyHistory() {
  const app = getMiniApp("family")!;
  return (
    <AppLockGate appId="family">
      <MiniAppShell
        appId="family"
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
        <div className="rounded-2xl bg-[#0EA5E9]/8 border border-[#0EA5E9]/20 p-4 mb-4">
          <p className="text-[11px] text-foreground/70">
            Genetic risk profile is generated from these records to alert you early.
          </p>
        </div>

        <div className="space-y-2">
          {records.map((r, i) => (
            <div key={i} className="bg-card rounded-2xl p-4 border border-border/40 flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#0EA5E9]/12 flex items-center justify-center">
                <Dna className="w-5 h-5 text-[#0EA5E9]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{r.condition}</p>
                <p className="text-[11px] text-muted-foreground">{r.member} · {r.age}</p>
              </div>
            </div>
          ))}
        </div>
      </MiniAppShell>
    </AppLockGate>
  );
}
