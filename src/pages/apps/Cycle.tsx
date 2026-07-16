import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MiniAppShell from "@/components/MiniAppShell";
import AppLockGate from "@/components/AppLockGate";
import { getMiniApp } from "@/data/miniApps";
import { Droplets } from "lucide-react";

const cycleDay = 14;
const cycleLength = 28;

export default function Cycle() {
  const app = getMiniApp("cycle")!;
  const pct = (cycleDay / cycleLength) * 100;
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("cycle_onboarding")) {
      navigate("/apps/cycle/onboarding", { replace: true });
    }
  }, [navigate]);

  return (
    <AppLockGate appId="cycle">
      <MiniAppShell
        appId="cycle"
        name={app.name}
        tagline={app.tagline}
        icon={app.icon}
        bg={app.bg}
        fg={app.fg}
      >
        <div className="bg-gradient-to-br from-[#EC4899] to-[#F66B9A] rounded-3xl p-6 text-white text-center mb-5">
          <p className="text-[11px] uppercase tracking-widest opacity-80">Cycle day</p>
          <p className="text-6xl font-bold my-2">{cycleDay}</p>
          <p className="text-sm opacity-90">Ovulation window · Fertile</p>
          <div className="w-full h-1.5 bg-white/20 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: "Next period", value: "in 14 days" },
            { label: "Cycle length", value: `${cycleLength} days` },
            { label: "Last period", value: "14 days ago" },
            { label: "Avg. length", value: "5 days" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-2xl p-3.5 border border-border/40">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="text-sm font-bold mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        <button className="w-full py-3 rounded-2xl bg-[#EC4899] text-white font-semibold flex items-center justify-center gap-2">
          <Droplets className="w-4 h-4" /> Log today
        </button>
      </MiniAppShell>
    </AppLockGate>
  );
}
