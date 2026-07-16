import { useMemo, useState } from "react";
import { Plus, Minus, User, Building2, Calendar, Pill, Search as SearchIcon, X, ArrowLeft, ChevronRight, Sparkles, FileText, Sun, Moon, Upload } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import AppLockGate from "@/components/AppLockGate";
import { getMiniApp } from "@/data/miniApps";

interface Medicine {
  id: string;
  name: string;
  qty: string;
  timing: "Before food" | "After food";
  schedule: { morning: boolean; afternoon: boolean; evening: boolean; night: boolean };
  images: string[]; // placeholders
}

interface LinkedFile {
  id: string;
  name: string;
  size: string;
}

interface RelatedReport {
  id: string;
  date: string; // "14 JAN 2025"
  files: string;
  lab: string;
  doctor: string;
}

interface Rx {
  id: string;
  title: string;
  doctor: string;
  specialty: string;
  hospital: string;
  date: string;
  dateLong: string; // "14 JAN, 2025"
  items: number;
  tags: string[];
  reportDate: string;
  sampleCollected: string;
  labReference: string;
  medicines: Medicine[];
  linkedFiles: LinkedFile[];
  related: RelatedReport[];
}

const sampleMeds: Medicine[] = [
  {
    id: "m1",
    name: "Thyrox 50 Tablet",
    qty: "1x",
    timing: "Before food",
    schedule: { morning: true, afternoon: false, evening: false, night: false },
    images: ["", ""],
  },
  {
    id: "m2",
    name: "Thyrox 50 Tablet",
    qty: "1x",
    timing: "Before food",
    schedule: { morning: true, afternoon: false, evening: false, night: false },
    images: ["", ""],
  },
  {
    id: "m3",
    name: "Thyrox 50 Tablet",
    qty: "1x",
    timing: "Before food",
    schedule: { morning: true, afternoon: false, evening: false, night: false },
    images: ["", ""],
  },
];

const initialRx: Rx[] = [
  {
    id: "p1",
    title: "Metformin 500mg + Vitamin D3",
    doctor: "Dr. Sharma",
    specialty: "Endocrinology",
    hospital: "SRL Diagnostics, Baner",
    date: "28 Feb 2026",
    dateLong: "14 JAN, 2025",
    items: 3,
    tags: ["Diabetes"],
    reportDate: "14 Jan 2025",
    sampleCollected: "14 Jan  •  7:30 AM",
    labReference: "SRL/PUN/25/004821",
    medicines: sampleMeds,
    linkedFiles: [{ id: "f1", name: "Thyroid_Jan25.pdf", size: "24.4 MB" }],
    related: [
      { id: "r1", date: "14 JAN 2025", files: "3 files  •  PDF + 2 photos", lab: "SRL Diagnostics, Baner", doctor: "Ref. Dr. Meena Sharma" },
      { id: "r2", date: "14 JAN 2025", files: "3 files  •  PDF + 2 photos", lab: "SRL Diagnostics, Baner", doctor: "Ref. Dr. Meena Sharma" },
    ],
  },
  {
    id: "p2",
    title: "Atorvastatin 10mg",
    doctor: "Dr. Mehta",
    specialty: "Cardiology",
    hospital: "Fortis",
    date: "10 Jan 2026",
    dateLong: "10 JAN, 2026",
    items: 2,
    tags: ["Cardio"],
    reportDate: "10 Jan 2026",
    sampleCollected: "10 Jan  •  8:15 AM",
    labReference: "FOR/PUN/26/000128",
    medicines: sampleMeds.slice(0, 2),
    linkedFiles: [{ id: "f2", name: "Cardio_Jan26.pdf", size: "12.1 MB" }],
    related: [],
  },
];

function ScheduleIcon({ label, active }: { label: string; active: boolean }) {
  const base = "w-9 h-9 rounded-lg flex items-center justify-center text-[13px] font-semibold";
  if (label === "M") {
    return (
      <div className={base} style={{ background: active ? "#DCEBFF" : "transparent" }}>
        <Sun className="w-5 h-5" style={{ color: active ? "#60A5FA" : "#C4C4C4" }} strokeWidth={2.5} />
      </div>
    );
  }
  if (label === "N") {
    return (
      <div className={base}>
        <Moon className="w-5 h-5" style={{ color: active ? "#60A5FA" : "#C4C4C4" }} strokeWidth={2.5} />
      </div>
    );
  }
  return (
    <div className={base} style={{ color: active ? "#60A5FA" : "#C4C4C4" }}>
      {label}
    </div>
  );
}

function PrescriptionDetail({ rx, onClose }: { rx: Rx; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[85] bg-[#F5F5F7] flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 bg-[#F5F5F7]">
        <div className="flex items-start gap-3">
          <button
            onClick={onClose}
            className="h-9 w-9 -ml-2 flex items-center justify-center rounded-full"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0 pt-0.5">
            <h1 className="text-[22px] font-bold leading-tight text-black">{rx.hospital}</h1>
            <p className="text-[13px] text-muted-foreground mt-1">{rx.dateLong}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {/* Prescribed Medicines */}
        <div className="px-5 pt-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Prescribed medicines
          </p>
        </div>
        <div className="pl-5 pb-5">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pr-5">
            {rx.medicines.map((m) => (
              <div
                key={m.id}
                className="shrink-0 w-[210px] bg-white rounded-2xl p-3 border border-black/5"
              >
                {/* Main image */}
                <div className="relative w-full aspect-square rounded-xl bg-[#F5F5F7] flex items-center justify-center overflow-hidden">
                  <Pill className="w-14 h-14 text-muted-foreground/40" />
                  <span className="absolute top-2 right-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/90 border border-black/5">
                    {m.qty}
                  </span>
                </div>
                {/* Thumbs */}
                <div className="flex gap-2 mt-2">
                  {m.images.map((_, i) => (
                    <div key={i} className="w-11 h-11 rounded-lg bg-[#F5F5F7] border border-black/5 flex items-center justify-center">
                      <Pill className="w-5 h-5 text-muted-foreground/40" />
                    </div>
                  ))}
                </div>
                <p className="mt-3 font-semibold text-[15px] text-black">{m.name}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">~ {m.timing}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ScheduleIcon label="M" active={m.schedule.morning} />
                  <ScheduleIcon label="L" active={m.schedule.afternoon} />
                  <ScheduleIcon label="D" active={m.schedule.evening} />
                  <ScheduleIcon label="N" active={m.schedule.night} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prescription Details */}
        <div className="px-5 pt-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Prescription details
          </p>
          <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5">
            {[
              ["Hospital / Lab", rx.hospital],
              ["Referring doctor", rx.doctor],
              ["Report date", rx.reportDate],
              ["Sample collected", rx.sampleCollected],
              ["Lab reference", rx.labReference],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between px-4 py-3.5">
                <span className="text-[14px] text-muted-foreground">{k}</span>
                <span className="text-[14px] font-medium text-black text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Linked Files */}
        <div className="px-5 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Linked files
          </p>
          <div className="space-y-3">
            {rx.linkedFiles.map((f) => (
              <button
                key={f.id}
                className="w-full bg-white rounded-2xl px-4 py-3.5 border border-black/5 flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FDECEC] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#E5484D]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] text-black truncate">{f.name}</p>
                  <p className="text-[12px] text-muted-foreground">{f.size}</p>
                </div>
                <ArrowLeft className="w-4 h-4 -rotate-[135deg] text-muted-foreground" />
              </button>
            ))}

            {rx.related.map((rel) => (
              <button
                key={rel.id}
                className="w-full bg-white rounded-2xl px-3 py-3 border border-black/5 flex items-center gap-3 text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-[#1a1330] text-white flex flex-col items-center justify-center leading-none">
                  <span className="text-[15px] font-bold">{rel.date.split(" ")[0]}</span>
                  <span className="text-[10px] font-semibold mt-0.5">{rel.date.split(" ")[1]}</span>
                  <span className="text-[9px] mt-0.5 opacity-80">{rel.date.split(" ")[2]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-muted-foreground">{rel.files}</p>
                  <p className="font-semibold text-[14px] text-black truncate mt-0.5">{rel.lab}</p>
                  <p className="text-[12px] text-muted-foreground truncate">{rel.doctor}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-3 bg-gradient-to-t from-[#F5F5F7] via-[#F5F5F7]/95 to-transparent">
        <div className="flex items-center gap-3">
          <button
            className="flex-1 h-14 rounded-full flex items-center justify-center gap-2 text-white font-semibold"
            style={{ background: "linear-gradient(135deg, #4A1D3A 0%, #7A2A4E 100%)" }}
          >
            <Sparkles className="w-5 h-5" />
            Ask AI
          </button>
          <button className="flex-1 h-14 rounded-full flex items-center justify-center font-semibold bg-white border border-black/10 text-black">
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

interface MedPhoto {
  name: string;
  size: string;
}

type WhenKey = "breakfast" | "lunch" | "dinner" | "bedtime";
type FoodInstr = "empty" | "before" | "after" | "with";

interface DraftMed {
  id: string;
  name: string;
  pills: number;
  note: string;
  when: Record<WhenKey, boolean>;
  food: FoodInstr | null;
  photos: MedPhoto[];
}

function timingLabel(m: DraftMed): string {
  switch (m.food) {
    case "empty": return "Empty stomach";
    case "before": return "Before food";
    case "after": return "After food";
    case "with": return "With food";
    default: return "Anytime";
  }
}


interface DetailsDraft {
  doctor: string;
  hospital: string;
  date: string;
  speciality: string;
}

function DetailsSubSheet({
  initial,
  onClose,
  onSave,
}: {
  initial: DetailsDraft;
  onClose: () => void;
  onSave: (v: DetailsDraft) => void;
}) {
  const [doctor, setDoctor] = useState(initial.doctor);
  const [hospital, setHospital] = useState(initial.hospital);
  const [date, setDate] = useState(initial.date);
  const [speciality, setSpeciality] = useState(initial.speciality || "Endocrinology");

  const sampleAttachments = [
    { id: "a1", name: "Thyroid_Jan25.pdf", size: "24.4 MB" },
  ];
  const relatedReports = [
    { id: "r1", d: "14", m: "JAN", y: "2025", files: "3 files  •  PDF + 2 photos", lab: "SRL Diagnostics, Baner", doctor: "Ref. Dr. Meena Sharma" },
    { id: "r2", d: "14", m: "JAN", y: "2025", files: "3 files  •  PDF + 2 photos", lab: "SRL Diagnostics, Baner", doctor: "Ref. Dr. Meena Sharma" },
  ];

  return (
    <div className="fixed inset-0 z-[95] bg-black/40 flex items-end" onClick={onClose}>
      <div
        className="w-full max-w-md mx-auto bg-white rounded-t-3xl flex flex-col max-h-[95dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-black/15 mx-auto my-3 shrink-0" />
        <div className="flex items-center px-5 pb-4 shrink-0">
          <button onClick={onClose} className="text-[15px] font-medium text-[#60A5FA] w-20 text-left">
            Back
          </button>
          <h3 className="flex-1 text-center text-[17px] font-bold text-black">Prescription details</h3>
          <button
            onClick={() => { onSave({ doctor, hospital, date, speciality }); onClose(); }}
            className="text-[15px] font-semibold text-[#60A5FA] w-20 text-right"
          >
            Save
          </button>
        </div>

        <div className="px-5 pb-10 space-y-6 overflow-y-auto flex-1">
          {/* Upload dropzone */}
          <button
            className="w-full rounded-2xl border-2 border-dashed border-black/15 py-7 px-5 flex flex-col items-center justify-center text-center"
            style={{
              background:
                "linear-gradient(135deg, #DCE7FF 0%, #FFFFFF 35%, #F5E1F0 70%, #FFE9C2 100%)",
            }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2">
              <Upload className="w-6 h-6 text-[#E5484D]" strokeWidth={2.2} />
            </div>
            <p className="text-[16px] font-bold text-black leading-snug">
              Upload file for AI to<br />automatically fetch details
            </p>
            <p className="text-[12px] text-muted-foreground mt-1">Max upto 2 mb per file upload</p>
            <div className="flex gap-2 mt-3">
              {["PDF", "JPG", "PNG"].map((t) => (
                <span key={t} className="px-3 py-1 rounded-lg bg-black/5 text-[12px] font-semibold text-black/60">
                  {t}
                </span>
              ))}
            </div>
          </button>

          {/* Prescription details fields */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Prescription details
            </p>
            <div className="space-y-3">
              {[
                { label: "Doctor", req: true, value: doctor, set: setDoctor, placeholder: "Type to add or search existing symptom…" },
                { label: "Hospital / Lab", req: true, value: hospital, set: setHospital, placeholder: "Type to add or search existing symptom…" },
                { label: "Date", req: false, value: date, set: setDate, placeholder: "00/00/0000" },
                { label: "Speciality", req: false, value: speciality, set: setSpeciality, placeholder: "e.g. Endocrinology" },
              ].map((f) => (
                <div key={f.label} className="rounded-2xl border border-black/10 px-4 py-2.5">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    {f.label}
                    {f.req && <span className="text-[#E5484D]">*</span>}
                  </p>
                  <input
                    value={f.value}
                    onChange={(e) => f.set(e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full bg-transparent outline-none text-[15px] text-black placeholder:text-black/30 mt-0.5"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Attachments
            </p>
            <div className="space-y-3">
              {sampleAttachments.map((a) => (
                <button
                  key={a.id}
                  className="w-full flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3 text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#FDECEC] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#E5484D]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[14px] text-black truncate">{a.name}</p>
                    <p className="text-[12px] text-muted-foreground">{a.size}</p>
                  </div>
                  <ArrowLeft className="w-4 h-4 -rotate-[135deg] text-muted-foreground shrink-0" />
                </button>
              ))}

              {relatedReports.map((rel) => (
                <button
                  key={rel.id}
                  className="w-full flex items-center gap-3 rounded-2xl border border-black/10 px-3 py-3 text-left"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#1a1330] text-white flex flex-col items-center justify-center leading-none shrink-0">
                    <span className="text-[15px] font-bold">{rel.d}</span>
                    <span className="text-[10px] font-semibold mt-0.5">{rel.m}</span>
                    <span className="text-[9px] mt-0.5 opacity-80">{rel.y}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-muted-foreground">{rel.files}</p>
                    <p className="font-semibold text-[14px] text-black truncate mt-0.5">{rel.lab}</p>
                    <p className="text-[12px] text-muted-foreground truncate">{rel.doctor}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function MedicinesSubSheet({
  meds,
  onClose,
  onSave,
}: {
  meds: DraftMed[];
  onClose: () => void;
  onSave: (m: DraftMed[]) => void;
}) {
  const [list, setList] = useState<DraftMed[]>(meds);
  const [editing, setEditing] = useState<DraftMed | null>(null);

  const addNew = () => {
    setEditing({
      id: Math.random().toString(36).slice(2),
      name: "",
      pills: 1,
      note: "",
      when: { breakfast: false, lunch: false, dinner: false, bedtime: false },
      food: null,
      photos: [],
    });
  };

  const commitEdit = (m: DraftMed) => {
    setList((prev) => {
      const i = prev.findIndex((x) => x.id === m.id);
      if (i === -1) return [...prev, m];
      const copy = [...prev];
      copy[i] = m;
      return copy;
    });
    setEditing(null);
  };

  const close = () => { onSave(list); onClose(); };

  return (
    <div className="fixed inset-0 z-[95] bg-black/40 flex items-end" onClick={close}>
      <div
        className="w-full max-w-md mx-auto bg-white rounded-t-3xl flex flex-col max-h-[92dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-black/15 mx-auto my-3 shrink-0" />
        <div className="flex items-center px-5 pb-4 shrink-0">
          <button onClick={close} className="text-[15px] font-medium text-[#60A5FA] w-20 text-left">
            Back
          </button>
          <h3 className="flex-1 text-center text-[17px] font-bold text-black">Medicines</h3>
          <div className="w-20" />
        </div>

        <div className="px-5 pb-6 overflow-y-auto flex-1">
          <p className="text-[12px] font-semibold tracking-wide text-muted-foreground mb-3">MEDICINES</p>

          {list.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {list.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setEditing(m)}
                  className="text-left bg-white rounded-2xl border border-black/10 p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                >
                  <div className="relative rounded-xl bg-[#F5F5F7] aspect-square flex items-center justify-center overflow-hidden">
                    <Pill className="w-10 h-10 text-[#7A2A4E]" />
                    <span className="absolute top-2 right-2 text-[11px] font-semibold text-black bg-white/95 border border-black/10 rounded-full px-2 py-0.5">
                      {m.pills}x
                    </span>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    <div className="w-8 h-8 rounded-md border border-black/60 bg-[#F5F5F7] flex items-center justify-center">
                      <Pill className="w-3.5 h-3.5 text-[#7A2A4E]" />
                    </div>
                    <div className="w-8 h-8 rounded-md border border-black/10 bg-[#F5F5F7] flex items-center justify-center">
                      <Pill className="w-3.5 h-3.5 text-[#7A2A4E]" />
                    </div>
                  </div>
                  <p className="mt-2 font-bold text-[15px] text-black truncate">{m.name || "Untitled"}</p>
                  <p className="text-[12px] text-muted-foreground">~ {timingLabel(m)}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <MiniWhenIcon active={m.when.breakfast} icon="sun" letter="B" />
                    <MiniWhenIcon active={m.when.lunch} letter="L" />
                    <MiniWhenIcon active={m.when.dinner} letter="D" />
                    <MiniWhenIcon active={m.when.bedtime} icon="moon" letter="N" />
                  </div>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={addNew}
            className="w-full mt-5 rounded-full border border-[#F66B9A] py-3.5 flex items-center justify-center gap-2 text-[15px] font-semibold text-[#F66B9A]"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Add More
          </button>
        </div>

        {editing && (
          <MedicineForm
            initial={editing}
            onClose={() => setEditing(null)}
            onDone={commitEdit}
          />
        )}
      </div>
    </div>
  );
}

function MiniWhenIcon({ active, icon, letter }: { active: boolean; icon?: "sun" | "moon"; letter: string }) {
  const cls = "w-7 h-7 rounded-md flex items-center justify-center text-[13px] font-semibold";
  if (active) {
    return (
      <div className={cls} style={{ background: "#60A5FA", color: "#fff" }}>
        {icon === "sun" ? <Sun className="w-3.5 h-3.5" /> : icon === "moon" ? <Moon className="w-3.5 h-3.5" /> : letter}
      </div>
    );
  }
  return (
    <div className={cls} style={{ color: "#B8B8BE" }}>
      {icon === "sun" ? <Sun className="w-4 h-4" /> : icon === "moon" ? <Moon className="w-4 h-4" /> : letter}
    </div>
  );
}

function MedicineForm({
  initial,
  onClose,
  onDone,
}: {
  initial: DraftMed;
  onClose: () => void;
  onDone: (m: DraftMed) => void;
}) {
  const [m, setM] = useState<DraftMed>(initial);
  const canAdd = m.name.trim().length > 0;

  const whenOptions: { key: WhenKey; label: string; icon: "sun" | "moon" | null; letter: string }[] = [
    { key: "breakfast", label: "Breakfast", icon: "sun", letter: "B" },
    { key: "lunch", label: "Lunch", icon: null, letter: "L" },
    { key: "dinner", label: "Dinner", icon: null, letter: "D" },
    { key: "bedtime", label: "Before Bed", icon: "moon", letter: "N" },
  ];

  const foodOptions: { key: FoodInstr; label: string }[] = [
    { key: "empty", label: "Empty stomach" },
    { key: "before", label: "Before meal" },
    { key: "after", label: "After meal" },
    { key: "with", label: "With meal" },
  ];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const mapped: MedPhoto[] = files.map((f) => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
    }));
    setM({ ...m, photos: [...m.photos, ...mapped] });
    e.target.value = "";
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-end" onClick={onClose}>
      <div
        className="w-full max-w-md mx-auto bg-white rounded-t-3xl flex flex-col max-h-[94dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-black/15 mx-auto my-3 shrink-0" />
        <div className="flex items-center px-5 pb-4 shrink-0">
          <button onClick={onClose} className="text-[15px] font-medium text-[#60A5FA] w-20 text-left">
            Back
          </button>
          <h3 className="flex-1 text-center text-[17px] font-bold text-black">Medicines</h3>
          <div className="w-20" />
        </div>

        <div className="px-5 pb-4 space-y-3 overflow-y-auto flex-1">
          {/* Name */}
          <div className="rounded-2xl border border-black/10 px-4 py-3">
            <p className="text-[12px] text-muted-foreground">
              Medicine name<span className="text-[#E5484D]">*</span>
            </p>
            <input
              autoFocus
              value={m.name}
              onChange={(e) => setM({ ...m, name: e.target.value })}
              placeholder="e.g. Thyrox 50, metformin 500mg, etc..."
              className="w-full bg-transparent outline-none text-[15px] text-black placeholder:text-black/30 mt-1"
            />
          </div>

          {/* Pills stepper */}
          <div className="rounded-2xl border border-black/10 px-4 py-3 flex items-center">
            <div className="flex-1">
              <p className="text-[12px] text-muted-foreground">Number of Pills / Unit</p>
              <p className="text-[17px] text-black mt-0.5">{m.pills}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setM({ ...m, pills: Math.max(1, m.pills - 1) })}
                className="w-9 h-9 rounded-lg border border-black/15 flex items-center justify-center text-black"
                aria-label="Decrease"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setM({ ...m, pills: m.pills + 1 })}
                className="w-9 h-9 rounded-lg border border-black/15 flex items-center justify-center text-black"
                aria-label="Increase"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Note */}
          <div className="rounded-2xl border border-black/10 px-4 py-3">
            <p className="text-[12px] text-muted-foreground">Note</p>
            <textarea
              value={m.note}
              onChange={(e) => setM({ ...m, note: e.target.value })}
              placeholder="e.g. Take with warm water, etc..."
              rows={2}
              className="w-full bg-transparent outline-none text-[15px] text-black placeholder:text-black/30 mt-1 resize-none"
            />
          </div>

          {/* When to take */}
          <div className="pt-2">
            <p className="text-[12px] font-semibold tracking-wide text-muted-foreground mb-2">WHEN TO TAKE</p>
            <div className="grid grid-cols-2 gap-2.5">
              {whenOptions.map((opt) => {
                const active = m.when[opt.key];
                return (
                  <button
                    key={opt.key}
                    onClick={() => setM({ ...m, when: { ...m.when, [opt.key]: !active } })}
                    className="h-12 rounded-xl flex items-center justify-center gap-2 text-[15px] font-semibold transition-colors"
                    style={{
                      background: active ? "#60A5FA" : "#fff",
                      color: active ? "#fff" : "#171717",
                      border: active ? "1px solid #60A5FA" : "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    {opt.icon === "sun" ? <Sun className="w-4 h-4" /> : opt.icon === "moon" ? <Moon className="w-4 h-4" /> : <span className="w-4 text-center">{opt.letter}</span>}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Food instruction */}
          <div className="pt-2">
            <p className="text-[12px] font-semibold tracking-wide text-muted-foreground mb-2">FOOD INSTRUCTION</p>
            <div className="flex flex-wrap gap-2">
              {foodOptions.map((opt) => {
                const active = m.food === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setM({ ...m, food: active ? null : opt.key })}
                    className="px-3.5 h-9 rounded-full text-[13px] font-semibold transition-colors"
                    style={{
                      background: active ? "#60A5FA" : "#fff",
                      color: active ? "#fff" : "#171717",
                      border: active ? "1px solid #60A5FA" : "1px solid rgba(0,0,0,0.12)",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Medicine photos */}
          <div className="pt-2">
            <p className="text-[12px] font-semibold tracking-wide text-muted-foreground mb-2">MEDICINE PHOTOS</p>
            <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-black/15 py-6 px-4 text-center">
              <input type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={handleUpload} />
              <Upload className="w-5 h-5 mx-auto text-[#F66B9A]" />
              <p className="mt-2 text-[15px] font-bold text-black">Tap to upload</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">Max upto 2 mb per file upload</p>
              <div className="flex justify-center gap-2 mt-3">
                {["PDF", "JPG", "PNG"].map((t) => (
                  <span key={t} className="text-[11px] font-semibold text-[#7A7A80] bg-[#EDEDF0] rounded-md px-2 py-0.5">
                    {t}
                  </span>
                ))}
              </div>
            </label>
            {m.photos.length > 0 && (
              <div className="mt-3 space-y-2">
                {m.photos.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-black/10 px-3 py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#DCEBFF] flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[#60A5FA]" />
                    </div>
                    <p className="flex-1 text-[14px] text-black truncate">{p.name}</p>
                    <span className="text-[12px] text-muted-foreground">{p.size}</span>
                    <button
                      onClick={() => setM({ ...m, photos: m.photos.filter((_, j) => j !== i) })}
                      className="text-muted-foreground"
                      aria-label="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add footer */}
        <div className="px-5 pt-2 pb-6 shrink-0">
          <button
            disabled={!canAdd}
            onClick={() => canAdd && onDone(m)}
            className="w-full h-14 rounded-full text-white text-[17px] font-semibold transition-colors"
            style={{ background: canAdd ? "#171717" : "#B8B8BE" }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}


function AddPrescriptionSheet({ onClose }: { onClose: () => void }) {
  const [details, setDetails] = useState<DetailsDraft>({ doctor: "", hospital: "", date: "", speciality: "" });
  const [meds, setMeds] = useState<DraftMed[]>([]);
  const [openDetails, setOpenDetails] = useState(false);
  const [openMeds, setOpenMeds] = useState(false);

  const detailsFilled = details.hospital.trim() !== "" || details.doctor.trim() !== "" || details.date.trim() !== "";
  const canSave = detailsFilled && meds.length > 0;

  return (
    <div className="fixed inset-0 z-[90] bg-black/40 flex items-end" onClick={onClose}>
      <div
        className="w-full max-w-md mx-auto bg-white rounded-t-3xl flex flex-col max-h-[92dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-black/15 mx-auto my-3 shrink-0" />

        {/* Header */}
        <div className="flex items-center px-5 pb-4 shrink-0">
          <button onClick={onClose} className="text-[15px] font-medium text-[#60A5FA] w-20 text-left">
            Back
          </button>
          <h3 className="flex-1 text-center text-[17px] font-bold text-black">Prescription details</h3>
          <div className="w-20" />
        </div>

        <div className="px-5 pb-6 flex-1 overflow-y-auto">
          {/* Validation notice */}
          {!canSave && (
            <p className="text-[15px] leading-snug text-[#E5484D] mb-5">
              Prescription details and adding at least medicine 1 is required to add new prescription.
            </p>
          )}

          {/* Rows */}
          <div className="space-y-3">
            <button
              onClick={() => setOpenDetails(true)}
              className="w-full flex items-center gap-3 bg-[#F1F1F3] rounded-2xl px-3 py-3 text-left"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "#E5484D" }}
              >
                <FileText className="w-6 h-6 text-white" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[17px] font-bold text-black">
                  Prescription Details<span className="text-[#E5484D] font-bold">*</span>
                </p>
                {detailsFilled && (
                  <p className="text-[12px] text-muted-foreground truncate mt-0.5">
                    {[details.hospital, details.doctor, details.date].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </button>

            <button
              onClick={() => setOpenMeds(true)}
              className="w-full flex items-center gap-3 bg-[#F1F1F3] rounded-2xl px-3 py-3 text-left"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)" }}
              >
                <Pill className="w-6 h-6 text-white" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[17px] font-bold text-black">Medicines</p>
              </div>
              <span className="text-[15px] font-semibold text-black bg-white/70 border border-black/5 rounded-lg px-2.5 py-0.5">
                {meds.length}
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </button>
          </div>
        </div>

        {/* Done button */}
        <div className="px-5 pb-6 pt-2 shrink-0">
          <button
            disabled={!canSave}
            onClick={onClose}
            className="w-full h-14 rounded-full text-white text-[17px] font-semibold transition-colors"
            style={{ background: canSave ? "#171717" : "#B8B8BE" }}
          >
            Done
          </button>
        </div>
      </div>

      {openDetails && (
        <DetailsSubSheet
          initial={details}
          onClose={() => setOpenDetails(false)}
          onSave={setDetails}
        />
      )}
      {openMeds && (
        <MedicinesSubSheet
          meds={meds}
          onClose={() => setOpenMeds(false)}
          onSave={setMeds}
        />
      )}
    </div>
  );
}

export default function Prescriptions() {
  const app = getMiniApp("prescriptions")!;
  const [rx] = useState<Rx[]>(initialRx);
  const [showAdd, setShowAdd] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as Rx[];
    return rx.filter((r) =>
      [r.title, r.doctor, r.hospital, ...r.tags].join(" ").toLowerCase().includes(q)
    );
  }, [query, rx]);

  const commitSearch = (q: string) => {
    const s = q.trim();
    if (!s) return;
    setRecent((prev) => [s, ...prev.filter((x) => x !== s)].slice(0, 8));
  };

  const openRx = rx.find((r) => r.id === openId) || null;

  return (
    <AppLockGate appId="prescriptions">
      <MiniAppShell
        appId="prescriptions"
        name={app.name}
        tagline={app.tagline}
        icon={app.icon}
        bg={app.bg}
        fg={app.fg}
        bottomActions={[
          { icon: Pill, label: "All", active: true },
          { icon: User, label: "Doctors" },
          { icon: SearchIcon, label: "Search", onClick: () => setShowSearch(true) },
        ]}
      >
        <div className="space-y-3">
          {rx.map((r) => (
            <button
              key={r.id}
              onClick={() => setOpenId(r.id)}
              className="w-full text-left bg-card rounded-2xl px-4 py-3.5 border border-border/60 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-muted-foreground">{r.date}</p>
                <p className="font-semibold text-[15px] mt-0.5 truncate">
                  {r.doctor} — {r.specialty}
                </p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{r.items} items</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>


        {/* Floating Add prescription button */}
        {!showAdd && !showSearch && !openRx && (
          <button
            onClick={() => setShowAdd(true)}
            className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg"
            style={{ background: "#171717" }}
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
            <span className="font-semibold">Add prescription</span>
          </button>
        )}

        {/* Add prescription bottom sheet */}
        {showAdd && (
          <AddPrescriptionSheet onClose={() => setShowAdd(false)} />
        )}

        {/* Detail overlay */}
        {openRx && <PrescriptionDetail rx={openRx} onClose={() => setOpenId(null)} />}

        {/* Fullscreen search overlay */}
        {showSearch && (
          <div className="fixed inset-0 z-[80] bg-background flex flex-col">
            <div className="px-4 pt-4 pb-3 flex items-center gap-3">
              <button
                onClick={() => { setShowSearch(false); setQuery(""); }}
                className="h-10 w-10 flex items-center justify-center rounded-full"
                aria-label="Close search"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 flex items-center gap-2 rounded-full bg-muted/60 px-4 py-2.5">
                <SearchIcon className="w-4 h-4 text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && commitSearch(query)}
                  placeholder="Find prescriptions"
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                />
                {query && (
                  <button onClick={() => setQuery("")}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-6">
              {query.trim() === "" ? (
                recent.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Recent</p>
                    <div className="flex flex-wrap gap-2">
                      {recent.map((r) => (
                        <button
                          key={r}
                          onClick={() => setQuery(r)}
                          className="px-3 py-1.5 rounded-full border border-border/60 text-xs"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              ) : results.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground pt-16">
                  No matching prescriptions.
                </p>
              ) : (
                <div className="space-y-3">
                  {results.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => { setShowSearch(false); setOpenId(r.id); }}
                      className="w-full text-left bg-card rounded-2xl px-4 py-3.5 border border-border/60 flex items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-muted-foreground">{r.date}</p>
                        <p className="font-semibold text-[15px] mt-0.5 truncate">
                          {r.doctor} — {r.specialty}
                        </p>
                        <p className="text-[12px] text-muted-foreground mt-0.5">{r.items} items</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </MiniAppShell>
    </AppLockGate>
  );
}
