import { useState } from "react";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";
import { HeartStraight, Sneaker, Moon, Fire, ArrowUp } from "@phosphor-icons/react";

type Vital = {
  key: string;
  icon: typeof HeartStraight;
  color: string;
  value: string;
  unit: string;
  label: string;
  status: "Normal" | "Below Goal" | "Above Goal";
};

const vitals: Vital[] = [
  { key: "hr", icon: HeartStraight, color: "#F87171", value: "72", unit: "bpm", label: "Heart Rate", status: "Normal" },
  { key: "steps", icon: Sneaker, color: "#60A5FA", value: "6,240", unit: "", label: "Steps", status: "Below Goal" },
  { key: "sleep", icon: Moon, color: "#A78BFA", value: "7", unit: "hr 23min", label: "Sleep", status: "Below Goal" },
  { key: "kcal", icon: Fire, color: "#FB923C", value: "1,847", unit: "kcal", label: "Calories", status: "Below Goal" },
];

type Device = {
  name: string;
  sub: string;
  subColor: string;
  connected: boolean;
  logo: JSX.Element;
};

const initialDevices: Device[] = [
  {
    name: "Google Fit",
    sub: "Connected · Syncing…",
    subColor: "#16A34A",
    connected: true,
    logo: (
      <svg viewBox="0 0 24 24" className="w-7 h-7">
        <path fill="#4285F4" d="M12 22s-8-5.2-8-11a5 5 0 019-3l-1.4 3.4L14 14l-2 8z" />
        <path fill="#0F172A" d="M12 22s8-5.2 8-11a5 5 0 00-9-3l1.4 3.4L10 14l2 8z" opacity=".85" />
      </svg>
    ),
  },
  {
    name: "Apple Health",
    sub: "Not Connected",
    subColor: "#94A3B8",
    connected: false,
    logo: (
      <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center">
        <HeartStraight weight="fill" className="w-4 h-4 text-[#EF4444]" />
      </div>
    ),
  },
  {
    name: "Samsung Health App",
    sub: "Not Connected",
    subColor: "#94A3B8",
    connected: false,
    logo: (
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#22C55E] flex items-center justify-center text-white text-sm font-bold">
        S
      </div>
    ),
  },
];

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-pressed={on}
      className={`relative h-8 w-[52px] rounded-full transition-colors duration-200 ${
        on ? "bg-[#60A5FA]" : "bg-[#E5E7EB]"
      }`}
    >
      <span
        className={`absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-200 ${
          on ? "left-[calc(100%-2px)] -translate-x-full" : "left-0.5"
        }`}
      />
    </button>
  );
}

export default function Fitness() {
  const app = getMiniApp("fitness")!;
  const [devices, setDevices] = useState(initialDevices);

  const toggle = (i: number) =>
    setDevices((d) =>
      d.map((x, idx) =>
        idx === i
          ? {
              ...x,
              connected: !x.connected,
              sub: !x.connected ? "Connected · Syncing…" : "Not Connected",
              subColor: !x.connected ? "#16A34A" : "#94A3B8",
            }
          : x
      )
    );

  return (
    <MiniAppShell
      appId="fitness"
      name={app.name}
      tagline={app.tagline}
      icon={app.icon}
      bg={app.bg}
      fg={app.fg}
    >
      {/* Health hero */}
      <div
        className="relative overflow-hidden rounded-3xl p-5 text-white"
        style={{
          background:
            "radial-gradient(120% 100% at 100% 0%, #4A1830 0%, #2A0E1C 55%, #1A0812 100%)",
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[56px] font-bold leading-none tracking-tight">74</p>
            <p className="mt-2 text-sm text-white/85">Health score</p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
              <ArrowUp size={14} weight="bold" className="text-[#4ADE80]" />
              <span className="text-[12px] font-medium text-[#4ADE80]">+3 from last week</span>
            </div>
          </div>
        </div>

        <div className="my-5 h-px bg-white/10" />

        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
          <p className="text-[12px] text-white/70">Synced 4 mins ago</p>
        </div>

        {/* Vitals horizontal scroller */}
        <div className="-mx-5 mt-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-5 pb-1">
            {vitals.map((v) => {
              const statusColor =
                v.status === "Normal" ? "#4ADE80" : v.status === "Above Goal" ? "#F87171" : "#FB923C";
              return (
                <div
                  key={v.key}
                  className="min-w-[150px] rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur"
                >
                  <v.icon weight="duotone" size={26} style={{ color: v.color }} />
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-[26px] font-bold leading-none">{v.value}</span>
                    {v.unit && <span className="text-[13px] text-white/60">{v.unit}</span>}
                  </div>
                  <p className="mt-1 text-[12px] text-white/75">{v.label}</p>
                  <span
                    className="mt-3 inline-block rounded-full px-2.5 py-1 text-[11px] font-medium"
                    style={{ color: statusColor, background: `${statusColor}1A` }}
                  >
                    {v.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Devices & Apps */}
      <div className="mt-6">
        <h3 className="text-[13px] font-semibold text-foreground/80 mb-3 px-1">Devices & Apps</h3>
        <div className="space-y-2.5">
          {devices.map((d, i) => (
            <div
              key={d.name}
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5"
            >
              <div className="flex h-11 w-11 items-center justify-center">{d.logo}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-foreground truncate">{d.name}</p>
                <p className="text-[12px]" style={{ color: d.subColor }}>
                  {d.sub}
                </p>
              </div>
              <Toggle on={d.connected} onChange={() => toggle(i)} />
            </div>
          ))}
        </div>
      </div>
    </MiniAppShell>
  );
}
