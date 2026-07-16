import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Baby, ArrowLeft, ChevronDown, X as XIcon } from "lucide-react";
import { DotsNine } from "@phosphor-icons/react";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";
import { useNavigate } from "react-router-dom";

const kids = [
  { id: "aarav", name: "Aarav", age: "6 yrs", ageDetail: "26 months 9 days", nextVaccine: "MMR booster · Apr 12", initials: "A", color: "bg-[#FB923C]" },
  { id: "zara", name: "Zara", age: "3 yrs", ageDetail: "12 months 4 days", nextVaccine: "DTP booster · May 4", initials: "Z", color: "bg-[#EC4899]" },
];

type Entry = {
  id: string;
  type: "diaper" | "solids" | "formula" | "nursing" | "wokeup" | "night";
  title: string;
  subtitle?: string;
  detail?: string;
  time: string;
  emoji: string;
  accent: string;
};

const scheduleEntries: Entry[] = [
  { id: "1", type: "diaper", title: "Diaper change", subtitle: "Mixed • 1 oz", time: "8:47 AM", emoji: "🧷", accent: "#F9A8D4" },
  { id: "2", type: "solids", title: "Solids", subtitle: "2 oz", time: "8:46 AM", emoji: "🥣", accent: "#86EFAC" },
  { id: "3", type: "formula", title: "Formula", subtitle: "1 oz", detail: "Rock him.", time: "8:40 AM", emoji: "🍼", accent: "#86EFAC" },
  { id: "4", type: "nursing", title: "Nursing", subtitle: "03m 54s", detail: "01:57 Left / 01:58 Right", time: "8:37 AM - 8:43 AM", emoji: "🤱", accent: "#86EFAC" },
  { id: "5", type: "wokeup", title: "Woke up", time: "8:08 AM", emoji: "🌅", accent: "#FCD34D" },
];

const nightEntry: Entry = {
  id: "6", type: "night", title: "Night waking", subtitle: "33m 00s", detail: "Rosemary…", time: "1:26 AM - 1:59 AM", emoji: "🌧️", accent: "#FDBA74",
};

const linkedApps = [
  { id: "prescriptions", label: "Prescriptions", emoji: "💊", bg: "bg-[#FEE2E2]" },
  { id: "symptoms", label: "Symptoms", emoji: "🌡️", bg: "bg-[#FED7AA]" },
  { id: "allergies", label: "Allergies", emoji: "🥜", bg: "bg-[#FCE7F3]" },
  { id: "insurance", label: "Insurance", emoji: "🛡️", bg: "bg-[#DBEAFE]" },
  { id: "notes", label: "Notes", emoji: "📝", bg: "bg-[#E9D5FF]" },
  { id: "vault", label: "Vault", emoji: "🗂️", bg: "bg-[#E0E7FF]" },
];

function ChildDetail({ kid, onBack }: { kid: typeof kids[0]; onBack: () => void }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"schedule" | "linked">("schedule");
  const [linkedOpen, setLinkedOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-[70] bg-[#F5F5F7] flex flex-col">
      {/* header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className={`w-11 h-11 rounded-full ${kid.color} text-white text-base font-bold flex items-center justify-center ring-2 ring-white shadow`}>
          {kid.initials}
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1 text-[15px] font-semibold justify-center">
            November 24 <ChevronDown className="w-4 h-4" />
          </div>
          <p className="text-[11px] text-muted-foreground">{kid.ageDetail}</p>
        </div>
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-white border border-border/60 flex items-center justify-center">
          <XIcon className="w-4 h-4" />
        </button>
      </div>

      {/* day strip */}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground">
          {["S","M","T","W","T","F","S"].map((d, i) => (
            <div key={i} className={i === 1 ? "text-[#60A5FA] font-semibold" : ""}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[14px] mt-1">
          {[23,24,25,26,27,28,29].map((n) => (
            <div key={n} className={n === 24 ? "text-[#60A5FA] font-bold" : n < 24 ? "text-foreground" : "text-muted-foreground/50"}>
              {n}
            </div>
          ))}
        </div>
      </div>

      {/* schedule list */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-2">
        {scheduleEntries.map((e) => (
          <div
            key={e.id}
            className="relative bg-card rounded-2xl px-4 py-3 border border-border/40 flex items-start gap-3 overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: e.accent }} />
            <div className="text-xl leading-none pt-0.5">{e.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[14px] leading-tight">{e.title}</p>
              {e.subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{e.subtitle}</p>}
              {e.detail && <p className="text-[11px] text-muted-foreground">{e.detail}</p>}
            </div>
            <span className="text-[12px] text-muted-foreground shrink-0">{e.time}</span>
          </div>
        ))}

        <div className="flex items-center justify-center gap-2 py-3 text-[12px] text-muted-foreground">
          <span>🌙</span> End of 06h 09m sleep session
        </div>

        <div className="relative bg-card rounded-2xl px-4 py-3 border border-border/40 flex items-start gap-3 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: nightEntry.accent }} />
          <div className="text-xl leading-none pt-0.5">{nightEntry.emoji}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[14px] leading-tight">{nightEntry.title}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{nightEntry.subtitle}</p>
            <p className="text-[11px] text-muted-foreground">{nightEntry.detail}</p>
          </div>
          <span className="text-[12px] text-muted-foreground shrink-0">{nightEntry.time}</span>
        </div>

        <div className="flex items-center justify-center gap-2 py-3 text-[12px] text-muted-foreground">
          <span>🌙</span> End of 02h 21m sleep session
        </div>
      </div>

      {/* bottom bar: back + two icons pill + add */}
      <div className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-center gap-3 px-6 pb-6 pt-3 pointer-events-none">
        <button
          onClick={onBack}
          className="pointer-events-auto w-11 h-11 rounded-full bg-white border border-border/60 flex items-center justify-center shadow"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="pointer-events-auto flex items-center gap-1 bg-white border border-border/60 rounded-full px-2 py-1.5 shadow">
          <button
            onClick={() => setLinkedOpen(true)}
            className={`w-9 h-9 rounded-full flex items-center justify-center ${tab === "linked" ? "bg-[#EEF2FF] text-[#60A5FA]" : "text-foreground/70"}`}
            aria-label="Linked apps"
          >
            <DotsNine size={18} weight="bold" />
          </button>
          <button
            onClick={() => setTab("schedule")}
            className={`w-9 h-9 rounded-full flex items-center justify-center ${tab === "schedule" ? "bg-[#EEF2FF] text-[#60A5FA]" : "text-foreground/70"}`}
            aria-label="Baby schedule"
          >
            📅
          </button>
        </div>
        <button
          className="pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
          style={{ background: "#60A5FA" }}
          aria-label="Add entry"
        >
          <span className="text-2xl leading-none -mt-0.5">+</span>
        </button>
      </div>

      {/* Linked apps bottom sheet */}
      <AnimatePresence>
        {linkedOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-black/40"
              onClick={() => setLinkedOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-x-0 bottom-0 z-[90] mx-auto w-full max-w-md rounded-t-3xl bg-background shadow-2xl p-5 pb-8"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted" />
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold">Linked records for {kid.name}</h2>
                <button onClick={() => setLinkedOpen(false)} className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center">
                  <XIcon className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {linkedApps.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => { setLinkedOpen(false); navigate(`/app/${a.id}`); }}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card p-3"
                  >
                    <div className={`w-11 h-11 rounded-2xl ${a.bg} flex items-center justify-center text-xl`}>{a.emoji}</div>
                    <span className="text-[12px] font-medium">{a.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Childcare() {
  const app = getMiniApp("childcare")!;
  const [openKid, setOpenKid] = useState<typeof kids[0] | null>(null);

  return (
    <>
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
            <button
              key={k.name}
              onClick={() => setOpenKid(k)}
              className="w-full text-left bg-card rounded-2xl p-4 border border-border/40 flex items-center gap-4"
            >
              <div className={`w-14 h-14 rounded-2xl ${k.color} text-white text-xl font-bold flex items-center justify-center`}>
                {k.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{k.name}</p>
                <p className="text-[11px] text-muted-foreground">{k.age}</p>
                <p className="text-[11px] text-[#FB923C] font-medium mt-1">Next: {k.nextVaccine}</p>
              </div>
            </button>
          ))}
          <button className="w-full py-3 rounded-2xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
            <Baby className="w-4 h-4" /> Add child profile
          </button>
        </div>
      </MiniAppShell>

      <AnimatePresence>
        {openKid && <ChildDetail kid={openKid} onBack={() => setOpenKid(null)} />}
      </AnimatePresence>
    </>
  );
}
