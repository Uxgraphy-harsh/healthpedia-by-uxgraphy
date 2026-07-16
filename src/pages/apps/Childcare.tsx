import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Baby, ArrowLeft, ChevronDown, X as XIcon, Camera, Calendar } from "lucide-react";
import { DotsNine } from "@phosphor-icons/react";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";
import ChildSubApp, { type ChildAppId } from "@/pages/apps/childcare/ChildSubApp";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";


interface Kid {
  id: string;
  name: string;
  age: string;
  ageDetail: string;
  nextVaccine: string;
  initials: string;
  color: string;
  dob: string;
  bloodGroup: string;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const avatarColors = [
  { bg: "bg-[#FB923C]", label: "Orange" },
  { bg: "bg-[#EC4899]", label: "Pink" },
  { bg: "bg-[#60A5FA]", label: "Blue" },
  { bg: "bg-[#34D399]", label: "Green" },
  { bg: "bg-[#A78BFA]", label: "Purple" },
  { bg: "bg-[#FBBF24]", label: "Yellow" },
];

const initialKids: Kid[] = [
  { id: "aarav", name: "Aarav", age: "6 yrs", ageDetail: "26 months 9 days", nextVaccine: "MMR booster · Apr 12", initials: "A", color: "bg-[#FB923C]", dob: "2018-05-12", bloodGroup: "B+" },
  { id: "zara", name: "Zara", age: "3 yrs", ageDetail: "12 months 4 days", nextVaccine: "DTP booster · May 4", initials: "Z", color: "bg-[#EC4899]", dob: "2021-08-03", bloodGroup: "O+" },
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

function ChildDetail({ kid, onBack }: { kid: Kid; onBack: () => void }) {
  const [tab, setTab] = useState<"schedule" | "linked">("schedule");
  const [linkedOpen, setLinkedOpen] = useState(false);
  const [activeApp, setActiveApp] = useState<ChildAppId | null>(null);


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
                    onClick={() => { setLinkedOpen(false); setActiveApp(a.id as ChildAppId); }}
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

      {/* Child-scoped mini app */}
      <AnimatePresence>
        {activeApp && (
          <ChildSubApp kid={kid} appId={activeApp} onBack={() => setActiveApp(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}


function AddChildSheet({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (k: Kid) => void }) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [colorIdx, setColorIdx] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setDob("");
    setBloodGroup("");
    setColorIdx(0);
    setPhotoUrl(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = () => {
    if (!name.trim() || !dob) return;
    const initials = name.trim().split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    const birth = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    if (months < 0) { years--; months += 12; }
    const age = years > 0 ? `${years} yrs` : `${months} mo`;
    onAdd({
      id: Math.random().toString(36).slice(2, 9),
      name: name.trim(),
      age,
      ageDetail: `${years} years ${months} months`,
      nextVaccine: "Schedule pending",
      initials: photoUrl ? "" : initials,
      color: avatarColors[colorIdx].bg,
      dob,
      bloodGroup,
    });
    handleClose();
  };

  const canSave = name.trim().length > 0 && dob.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/40"
            onClick={handleClose}
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-[90] mx-auto w-full max-w-md rounded-t-3xl bg-background shadow-2xl p-5 pb-8"
          >
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-muted" />
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">Add child profile</h2>
              <button onClick={handleClose} className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center">
                <XIcon className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Photo */}
              <div className="flex justify-center">
                <button
                  onClick={() => fileRef.current?.click()}
                  className={`relative w-24 h-24 rounded-full ${avatarColors[colorIdx].bg} text-white text-2xl font-bold flex items-center justify-center ring-4 ring-white shadow-lg overflow-hidden`}
                >
                  {photoUrl ? (
                    <img src={photoUrl} alt="child" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-7 h-7" />
                  )}
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow border border-border/40">
                    <Camera className="w-3.5 h-3.5 text-foreground" />
                  </div>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPhotoUrl(URL.createObjectURL(file));
                  }}
                />
              </div>

              {/* Color picker */}
              <div className="flex justify-center gap-2">
                {avatarColors.map((c, i) => (
                  <button
                    key={c.label}
                    onClick={() => setColorIdx(i)}
                    className={`w-8 h-8 rounded-full ${c.bg} ring-2 ${i === colorIdx ? "ring-foreground ring-offset-2" : "ring-transparent"}`}
                    aria-label={c.label}
                  />
                ))}
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium">Child name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="h-12 rounded-xl bg-muted/40 border-border/60"
                />
              </div>

              {/* DOB */}
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium">Date of birth</Label>
                <div className="relative">
                  <Input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="h-12 rounded-xl bg-muted/40 border-border/60 pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Blood group */}
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium">Blood group</Label>
                <div className="flex flex-wrap gap-2">
                  {bloodGroups.map((bg) => (
                    <button
                      key={bg}
                      onClick={() => setBloodGroup(bg)}
                      className={`px-3.5 py-2 rounded-full text-[13px] font-medium border transition-colors ${
                        bloodGroup === bg
                          ? "bg-[#F66B9A] text-white border-[#F66B9A]"
                          : "bg-card border-border/60 text-foreground"
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={!canSave}
              className="mt-7 w-full h-12 rounded-2xl text-white font-semibold disabled:opacity-50"
              style={{ background: "#F66B9A" }}
            >
              Save profile
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Childcare() {
  const app = getMiniApp("childcare")!;
  const [kids, setKids] = useState<Kid[]>(initialKids);
  const [openKid, setOpenKid] = useState<Kid | null>(null);
  const [addOpen, setAddOpen] = useState(false);

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
              key={k.id}
              onClick={() => setOpenKid(k)}
              className="w-full text-left bg-card rounded-2xl p-4 border border-border/40 flex items-center gap-4"
            >
              <div className={`w-14 h-14 rounded-2xl ${k.color} text-white text-xl font-bold flex items-center justify-center overflow-hidden`}>
                {k.initials || <Baby className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{k.name}</p>
                <p className="text-[11px] text-muted-foreground">{k.age} · {k.bloodGroup}</p>
                <p className="text-[11px] text-[#FB923C] font-medium mt-1">Next: {k.nextVaccine}</p>
              </div>
            </button>
          ))}
          <button
            onClick={() => setAddOpen(true)}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"
          >
            <Baby className="w-4 h-4" /> Add child profile
          </button>
        </div>
      </MiniAppShell>

      <AnimatePresence>
        {openKid && <ChildDetail kid={openKid} onBack={() => setOpenKid(null)} />}
      </AnimatePresence>

      <AddChildSheet open={addOpen} onClose={() => setAddOpen(false)} onAdd={(k) => setKids((prev) => [...prev, k])} />
    </>
  );
}
