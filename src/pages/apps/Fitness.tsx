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
      {/* Sync status */}
      <div className="flex items-center gap-2 px-1 mb-4">
        <span className="h-2 w-2 rounded-full bg-[#4ADE80]" />
        <p className="text-[13px] text-foreground/70">Synced 4 mins ago</p>
      </div>

      {/* Vitals grid */}
      <div className="grid grid-cols-2 gap-3">
        {vitals.map((v) => {
          const statusColor =
            v.status === "Normal" ? "#4ADE80" : v.status === "Above Goal" ? "#F87171" : "#FB923C";
          return (
            <div
              key={v.key}
              className="rounded-2xl border border-border/60 bg-card p-4"
            >
              <div className="flex items-start justify-between">
                <v.icon weight="duotone" size={24} style={{ color: v.color }} />
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{ color: statusColor, background: `${statusColor}14` }}
                >
                  {v.status}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-[24px] font-bold leading-none text-foreground">{v.value}</span>
                {v.unit && <span className="text-[12px] text-foreground/55">{v.unit}</span>}
              </div>
              <p className="mt-1 text-[12px] text-foreground/65">{v.label}</p>
            </div>
          );
        })}
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
