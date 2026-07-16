import { Plus, ShieldCheck } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import AppLockGate from "@/components/AppLockGate";
import { getMiniApp } from "@/data/miniApps";

const policies = [
  {
    id: "i1",
    provider: "HDFC Ergo",
    plan: "Optima Restore Family",
    coverage: "₹10L",
    renewal: "12 Aug 2026",
    members: 4,
  },
  {
    id: "i2",
    provider: "Star Health",
    plan: "Senior Citizen Red Carpet",
    coverage: "₹5L",
    renewal: "3 Nov 2026",
    members: 1,
  },
];

export default function Insurance() {
  const app = getMiniApp("insurance")!;
  return (
    <AppLockGate appId="insurance">
      <MiniAppShell
        appId="insurance"
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
          {policies.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl p-4 text-white"
              style={{ background: "linear-gradient(135deg,#22C55E,#065F46)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] uppercase tracking-widest opacity-80">{p.provider}</p>
                <ShieldCheck className="w-4 h-4 opacity-80" />
              </div>
              <p className="font-bold text-lg leading-tight">{p.plan}</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-[11px]">
                <div>
                  <p className="opacity-70">Cover</p>
                  <p className="font-semibold text-sm">{p.coverage}</p>
                </div>
                <div>
                  <p className="opacity-70">Members</p>
                  <p className="font-semibold text-sm">{p.members}</p>
                </div>
                <div>
                  <p className="opacity-70">Renews</p>
                  <p className="font-semibold text-sm">{p.renewal}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mt-6 mb-2">
          Recent claims
        </h3>
        <div className="bg-card rounded-2xl p-4 border border-border/40 text-center text-xs text-muted-foreground">
          No claims filed yet.
        </div>
      </MiniAppShell>
    </AppLockGate>
  );
}
