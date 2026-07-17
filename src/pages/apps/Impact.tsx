import { useState } from "react";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";
import { Leaf, TrendingUp, Users, Award, Plus } from "lucide-react";

const GREEN = "#2F7D5B";
const CTA = "#EF4E3B";

export default function Impact() {
  const app = getMiniApp("impact")!;
  const [tab, setTab] = useState<"mine" | "community">("mine");

  // Mock stats
  const cyclesLogged = 4;
  const padsAverted = cyclesLogged * 20;
  const moneySaved = padsAverted * 5; // rupees
  const plasticGrams = padsAverted * 4;

  return (
    <MiniAppShell
      appId="impact"
      name={app.name}
      tagline={app.tagline}
      icon={app.icon}
      bg={app.bg}
      fg={app.fg}
      bottomActions={[
        { icon: Leaf, label: "My Impact", active: tab === "mine", onClick: () => setTab("mine") },
        { icon: Users, label: "Community", active: tab === "community", onClick: () => setTab("community") },
        { icon: Award, label: "Badges" },
      ]}
    >
      <h2 className="mt-2 text-2xl font-bold text-neutral-900">Environmental Impact</h2>

      {/* Segmented tabs */}
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-neutral-100 p-1">
        <button
          onClick={() => setTab("mine")}
          className={`rounded-xl py-3 text-sm font-semibold transition-colors ${
            tab === "mine" ? "bg-white shadow-sm" : "text-neutral-500"
          }`}
          style={{ color: tab === "mine" ? GREEN : undefined }}
        >
          My Impact
        </button>
        <button
          onClick={() => setTab("community")}
          className={`rounded-xl py-3 text-sm font-semibold transition-colors ${
            tab === "community" ? "bg-white shadow-sm" : "text-neutral-500"
          }`}
          style={{ color: tab === "community" ? GREEN : undefined }}
        >
          Community Impact
        </button>
      </div>

      {tab === "mine" && (
        <div className="mt-5 space-y-4">
          <div
            className="rounded-3xl p-5 text-white"
            style={{ background: `linear-gradient(135deg, ${GREEN}, #4CAF7D)` }}
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80">
              <Leaf className="h-4 w-4" /> Since you joined
            </div>
            <p className="mt-4 text-5xl font-bold">{padsAverted}</p>
            <p className="mt-1 text-sm opacity-90">Disposable pads averted</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Money saved" value={`₹${moneySaved}`} />
            <StatCard label="Plastic avoided" value={`${plasticGrams}g`} />
            <StatCard label="Cycles logged" value={String(cyclesLogged)} />
            <StatCard label="Trees equiv." value={`${(padsAverted / 100).toFixed(1)}`} />
          </div>

          <div className="rounded-2xl border border-neutral-200 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
              <TrendingUp className="h-4 w-4" style={{ color: GREEN }} /> Did you know?
            </div>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              The average person throws away over 10,000 plastic pads and tampons over their lifetime.
              Switching to reusables can prevent hundreds of kilograms of plastic waste.
            </p>
          </div>
        </div>
      )}

      {tab === "community" && (
        <div className="mt-5 space-y-4">
          <div
            className="rounded-3xl p-5 text-white"
            style={{ background: `linear-gradient(135deg, #1B4332, ${GREEN})` }}
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80">
              <Users className="h-4 w-4" /> Together we've averted
            </div>
            <p className="mt-4 text-5xl font-bold">2.4M</p>
            <p className="mt-1 text-sm opacity-90">Disposable pads and tampons</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Members" value="48K" />
            <StatCard label="Countries" value="26" />
            <StatCard label="Plastic saved" value="9.6t" />
            <StatCard label="Trees equiv." value="24K" />
          </div>
        </div>
      )}
    </MiniAppShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-4">
      <p className="text-xs uppercase tracking-widest text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-neutral-900">{value}</p>
    </div>
  );
}
