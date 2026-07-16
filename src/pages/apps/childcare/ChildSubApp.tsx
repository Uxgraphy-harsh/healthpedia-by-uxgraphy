import { ArrowLeft, Plus, Search } from "lucide-react";

export type ChildAppId =
  | "prescriptions"
  | "symptoms"
  | "allergies"
  | "insurance"
  | "notes"
  | "vault";

interface Kid {
  id: string;
  name: string;
  initials: string;
  color: string;
  ageDetail: string;
}

interface Props {
  kid: Kid;
  appId: ChildAppId;
  onBack: () => void;
}

const APP_META: Record<ChildAppId, { title: string; emoji: string; bg: string; fab: string }> = {
  prescriptions: { title: "Prescriptions", emoji: "💊", bg: "bg-[#FEE2E2]", fab: "Add prescription" },
  symptoms:      { title: "Symptoms",      emoji: "🌡️", bg: "bg-[#FED7AA]", fab: "Log symptom" },
  allergies:     { title: "Allergies",     emoji: "🥜", bg: "bg-[#FCE7F3]", fab: "Add allergy" },
  insurance:     { title: "Insurance",     emoji: "🛡️", bg: "bg-[#DBEAFE]", fab: "Add policy" },
  notes:         { title: "Notes",         emoji: "📝", bg: "bg-[#E9D5FF]", fab: "New note" },
  vault:         { title: "Vault",         emoji: "🗂️", bg: "bg-[#E0E7FF]", fab: "Upload report" },
};

// ---------- Child-specific mock content ----------
const prescriptions = [
  { id: "1", title: "Amoxicillin syrup", doctor: "Dr. Meera Rao · Pediatrician", meds: 1, dose: "5 ml · Twice a day", dates: "Nov 12 - Nov 19", status: "Ongoing" },
  { id: "2", title: "Vitamin D drops",  doctor: "Dr. Meera Rao · Pediatrician", meds: 1, dose: "2 drops · Daily",   dates: "Ongoing since Sep 3", status: "Ongoing" },
  { id: "3", title: "Paracetamol susp.", doctor: "Dr. Arjun Shah · GP",         meds: 1, dose: "2.5 ml · SOS",       dates: "Oct 4 - Oct 6", status: "Completed" },
];

const symptoms = [
  { id: "1", name: "Fever", severity: "Moderate", logs: 3, last: "2 days ago", color: "#F59E0B" },
  { id: "2", name: "Runny nose", severity: "Mild", logs: 5, last: "Today", color: "#60A5FA" },
  { id: "3", name: "Diaper rash", severity: "Mild", logs: 2, last: "1 week ago", color: "#F472B6" },
];

const allergies = [
  { id: "1", name: "Peanuts", category: "Food", severity: "Severe", color: "#EF4444" },
  { id: "2", name: "Dust mites", category: "Environmental", severity: "Mild", color: "#F59E0B" },
  { id: "3", name: "Amoxicillin", category: "Medicine", severity: "Moderate", color: "#F97316" },
];

const policies = [
  { id: "1", provider: "Star Health · Junior", number: "SH-JR-8842-11", cover: "₹5,00,000", valid: "Valid till Mar 2027" },
];

const notes = [
  { id: "1", title: "Pediatric checkup notes", body: "Weight 12.4 kg, height 89 cm. Doctor suggested iron-rich food.", date: "Nov 10" },
  { id: "2", title: "Sleep pattern", body: "Waking twice at night, feed then sleeps within 15 mins.", date: "Nov 6" },
];

const vaultFolders = [
  { id: "1", emoji: "🩺", name: "Pediatric visits", count: 6, bg: "bg-[#FEE2E2]" },
  { id: "2", emoji: "💉", name: "Vaccination cards", count: 4, bg: "bg-[#DBEAFE]" },
  { id: "3", emoji: "🧪", name: "Lab reports", count: 2, bg: "bg-[#DCFCE7]" },
  { id: "4", emoji: "📄", name: "Birth records", count: 1, bg: "bg-[#FEF3C7]" },
];

// ---------- Renderers ----------
function Prescriptions({ kid }: { kid: Kid }) {
  return (
    <div className="space-y-3">
      {prescriptions.map((p) => (
        <div key={p.id} className="bg-card rounded-2xl p-4 border-2 border-dashed border-border/60">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[15px] font-bold leading-tight">{p.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{p.doctor}</p>
            </div>
            <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.status === "Ongoing" ? "bg-[#DCFCE7] text-emerald-700" : "bg-muted text-muted-foreground"}`}>
              {p.status}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="px-2 py-0.5 rounded-full bg-muted/60">{p.meds} med</span>
            <span>{p.dose}</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">{p.dates}</p>
        </div>
      ))}
      <p className="text-center text-[11px] text-muted-foreground pt-2">Prescriptions for {kid.name} only</p>
    </div>
  );
}

function Symptoms() {
  return (
    <div className="space-y-3">
      {symptoms.map((s) => (
        <div key={s.id} className="bg-card rounded-2xl p-4 border border-border/40 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg" style={{ background: `${s.color}22` }}>🌡️</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[14px]">{s.name}</p>
            <p className="text-[11px] text-muted-foreground">{s.logs} logs · Last {s.last}</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-1 rounded-full text-white" style={{ background: s.color }}>{s.severity}</span>
        </div>
      ))}
    </div>
  );
}

function Allergies() {
  return (
    <div className="space-y-3">
      {allergies.map((a) => (
        <div key={a.id} className="bg-card rounded-2xl p-4 border border-border/40 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg" style={{ background: `${a.color}22` }}>⚠️</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[14px]">{a.name}</p>
            <p className="text-[11px] text-muted-foreground">{a.category}</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-1 rounded-full text-white" style={{ background: a.color }}>{a.severity}</span>
        </div>
      ))}
    </div>
  );
}

function Insurance({ kid }: { kid: Kid }) {
  return (
    <div className="space-y-3">
      {policies.map((p) => (
        <div key={p.id} className="rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg,#1e3a8a,#3b82f6)" }}>
          <p className="text-[11px] uppercase tracking-wide opacity-80">Pediatric Cover</p>
          <p className="text-[15px] font-bold mt-1">{p.provider}</p>
          <p className="text-[11px] opacity-90 mt-1">{p.number}</p>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] opacity-80">Sum insured</p>
              <p className="text-[18px] font-bold">{p.cover}</p>
            </div>
            <p className="text-[11px] opacity-80">{p.valid}</p>
          </div>
        </div>
      ))}
      <p className="text-center text-[11px] text-muted-foreground pt-2">Policies covering {kid.name}</p>
    </div>
  );
}

function Notes() {
  return (
    <div className="space-y-3">
      {notes.map((n) => (
        <div key={n.id} className="bg-card rounded-2xl p-4 border border-border/40">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-[14px] leading-tight">{n.title}</p>
            <span className="text-[10px] text-muted-foreground shrink-0">{n.date}</span>
          </div>
          <p className="text-[12px] text-muted-foreground mt-1">{n.body}</p>
        </div>
      ))}
    </div>
  );
}

function Vault() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {vaultFolders.map((f) => (
        <div key={f.id} className={`${f.bg} rounded-2xl p-4 aspect-square flex flex-col justify-between`}>
          <div className="text-3xl">{f.emoji}</div>
          <div>
            <p className="text-[13px] font-semibold leading-tight">{f.name}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{f.count} files</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ChildSubApp({ kid, appId, onBack }: Props) {
  const meta = APP_META[appId];

  return (
    <div className="fixed inset-0 z-[75] bg-[#F5F5F7] flex flex-col">
      {/* header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border border-border/60 flex items-center justify-center shadow-sm"
          aria-label="Back to child"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full ${kid.color} text-white text-[10px] font-bold flex items-center justify-center`}>
            {kid.initials}
          </div>
          <span className="text-[13px] font-semibold">{kid.name}</span>
        </div>
        <button className="w-9 h-9 rounded-full bg-white border border-border/60 flex items-center justify-center shadow-sm" aria-label="Search">
          <Search className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* title */}
      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <div className={`w-11 h-11 rounded-2xl ${meta.bg} flex items-center justify-center text-xl`}>{meta.emoji}</div>
        <div className="min-w-0">
          <h1 className="text-[22px] font-bold leading-tight truncate">{meta.title}</h1>
          <p className="text-[11px] text-muted-foreground">For {kid.name} · {kid.ageDetail}</p>
        </div>
      </div>

      {/* content */}
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        {appId === "prescriptions" && <Prescriptions kid={kid} />}
        {appId === "symptoms" && <Symptoms />}
        {appId === "allergies" && <Allergies />}
        {appId === "insurance" && <Insurance kid={kid} />}
        {appId === "notes" && <Notes />}
        {appId === "vault" && <Vault />}
      </div>

      {/* FAB */}
      <button
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg"
        style={{ background: "#111" }}
      >
        <Plus className="w-4 h-4" />
        <span className="text-[13px] font-semibold">{meta.fab}</span>
      </button>
    </div>
  );
}
