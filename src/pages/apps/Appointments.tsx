import { useMemo, useRef, useState } from "react";
import {
  Plus,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  X,
  ArrowLeft,
  Search as SearchIcon,
  Repeat,
  FileText,
  Paperclip,
  Link2,
  Check,
  Pill,
  StickyNote,
  Activity,
  ShieldAlert,
  Bell,
  Users,
  Baby,
  Heart,
  Wallet,
  ShoppingBag,
  Building2,
  Sparkles,
  Trash2,
} from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";

// ---------- Types ----------
type RepeatOpt = "none" | "daily" | "weekly" | "monthly";

interface LinkedItem {
  id: string;
  module: string;
  moduleLabel: string;
  title: string;
  subtitle?: string;
}

interface AttachedFile {
  id: string;
  name: string;
  size: string;
}

interface LocationPick {
  name: string;
  address: string;
}

interface Appt {
  id: string;
  title: string;
  location: LocationPick | null;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
  repeat: RepeatOpt;
  note: string;
  files: AttachedFile[];
  links: LinkedItem[];
  status: "upcoming" | "done";
}

// ---------- Mock data for pickers ----------
const LOCATION_SUGGESTIONS: LocationPick[] = [
  { name: "Apollo Clinic", address: "Baner Rd, Pune" },
  { name: "Fortis Hospital", address: "Kalyani Nagar, Pune" },
  { name: "Ruby Hall Clinic", address: "Sassoon Rd, Pune" },
  { name: "Sahyadri Hospital", address: "Kothrud, Pune" },
  { name: "Jehangir Hospital", address: "Sassoon Rd, Pune" },
];

const LINKABLE: LinkedItem[] = [
  { id: "v1", module: "vault", moduleLabel: "Vault", title: "Thyroid Panel · Jan 2025", subtitle: "PDF · 1.2 MB" },
  { id: "v2", module: "vault", moduleLabel: "Vault", title: "CBC Report · Dec 2024", subtitle: "PDF · 890 KB" },
  { id: "p1", module: "prescriptions", moduleLabel: "Prescriptions", title: "Dr. Meena — Endocrinology", subtitle: "3 medicines" },
  { id: "n1", module: "notes", moduleLabel: "Notes", title: "Questions for the doctor", subtitle: "5 bullets" },
  { id: "s1", module: "symptoms", moduleLabel: "Symptoms", title: "Fatigue · past 7 days", subtitle: "Logged 4 times" },
  { id: "a1", module: "allergies", moduleLabel: "Allergies", title: "Penicillin", subtitle: "Severe" },
  { id: "r1", module: "reminders", moduleLabel: "Reminders", title: "Take Thyrox 30 min before", subtitle: "Daily · 7:00 AM" },
  { id: "c1", module: "contacts", moduleLabel: "Contacts", title: "Dr. Meena Sharma", subtitle: "Endocrinologist" },
  { id: "i1", module: "insurance", moduleLabel: "Insurance", title: "Star Health · Family Floater", subtitle: "Valid till Aug 2027" },
  { id: "f1", module: "family", moduleLabel: "Family history", subtitle: "Diabetes · Mother", title: "Diabetes" },
];

const MODULE_ICON: Record<string, typeof Pill> = {
  vault: FileText,
  prescriptions: Pill,
  notes: StickyNote,
  symptoms: Activity,
  allergies: ShieldAlert,
  reminders: Bell,
  contacts: Users,
  insurance: Building2,
  family: Heart,
  childcare: Baby,
  cycle: Sparkles,
  budget: Wallet,
  shop: ShoppingBag,
};

const REPEAT_OPTIONS: { key: RepeatOpt; label: string }[] = [
  { key: "none", label: "Never" },
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

const repeatLabel = (r: RepeatOpt) => REPEAT_OPTIONS.find((o) => o.key === r)?.label ?? "Never";

// ---------- Formatting helpers ----------
function formatWhen(dateISO: string, time: string): string {
  if (!dateISO) return "";
  const d = new Date(`${dateISO}T${time || "00:00"}`);
  if (Number.isNaN(d.getTime())) return "";
  const day = d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const t = time
    ? d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : "";
  return t ? `${day} at ${t}` : day;
}

// ============================================================
// Main page
// ============================================================
export default function Appointments() {
  const app = getMiniApp("appointments")!;
  const [appts, setAppts] = useState<Appt[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  const upcoming = appts.filter((a) => a.status === "upcoming");
  const past = appts.filter((a) => a.status === "done");

  const handleSave = (a: Appt) => {
    setAppts((prev) => [a, ...prev]);
    setShowAdd(false);
  };

  return (
    <MiniAppShell
      appId="appointments"
      name={app.name}
      tagline={app.tagline}
      icon={app.icon}
      bg={app.bg}
      fg={app.fg}
      bottomActions={[
        { icon: Calendar, label: "Upcoming", active: true },
        { icon: Clock, label: "Past" },
        { icon: MapPin, label: "Nearby" },
      ]}
    >
      {/* Upcoming */}
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-[22px] font-bold text-black">Upcoming</h2>
        {upcoming.length > 0 && (
          <span className="text-[11px] font-semibold text-white bg-[#8B5CF6] rounded-full w-5 h-5 flex items-center justify-center">
            {upcoming.length}
          </span>
        )}
      </div>

      {upcoming.length === 0 ? (
        <EmptyStateCard
          title="No upcoming appointments"
          subtitle="Your upcoming appointments will appear when you book"
          ctaLabel="Book appointment"
          onCta={() => setShowAdd(true)}
        />
      ) : (
        <div className="space-y-3 mb-8">
          {upcoming.map((a) => <ApptCard key={a.id} a={a} />)}
        </div>
      )}

      {/* Past */}
      <div className="flex items-center gap-2 mt-8 mb-3">
        <h2 className="text-[22px] font-bold text-black">Past</h2>
        {past.length > 0 && (
          <span className="text-[11px] font-semibold text-muted-foreground border border-black/15 rounded-full w-5 h-5 flex items-center justify-center">
            {past.length}
          </span>
        )}
      </div>

      {past.length === 0 ? (
        <p className="text-[14px] text-muted-foreground">You have no past activity</p>
      ) : (
        <div className="space-y-2">
          {past.map((a) => (
            <div key={a.id} className="rounded-2xl border border-black/10 p-3.5 bg-white opacity-80">
              <p className="text-[14px] font-semibold text-black">{a.title}</p>
              <p className="text-[12px] text-muted-foreground">{formatWhen(a.date, a.time)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Floating action */}
      {!showAdd && (
        <button
          onClick={() => setShowAdd(true)}
          className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg"
          style={{ background: "#171717" }}
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
          <span className="font-semibold">Book appointment</span>
        </button>
      )}

      {showAdd && (
        <BookAppointmentSheet
          onClose={() => setShowAdd(false)}
          onSave={handleSave}
        />
      )}
    </MiniAppShell>
  );
}

// ============================================================
// Sub-components
// ============================================================
function EmptyStateCard({
  title, subtitle, ctaLabel, onCta,
}: { title: string; subtitle: string; ctaLabel: string; onCta: () => void }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white px-6 py-12 flex flex-col items-center text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "linear-gradient(160deg, #EDE9FE 0%, #C4B5FD 60%, #8B5CF6 100%)" }}
      >
        <Calendar className="w-6 h-6 text-white" strokeWidth={2.2} />
      </div>
      <h2 className="text-[18px] font-bold text-black">{title}</h2>
      <p className="text-[13px] text-muted-foreground mt-2 max-w-[280px]">{subtitle}</p>
      <button
        onClick={onCta}
        className="mt-6 rounded-full border border-black/15 px-5 h-10 text-[13px] font-semibold text-black"
      >
        {ctaLabel}
      </button>
    </div>
  );
}

function ApptCard({ a }: { a: Appt }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(160deg, #EDE9FE 0%, #8B5CF6 100%)" }}
          >
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold text-black truncate">{a.title}</p>
            <p className="text-[12px] text-muted-foreground truncate">
              {formatWhen(a.date, a.time)}
            </p>
            {a.location && (
              <p className="text-[12px] text-muted-foreground truncate mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {a.location.name}
              </p>
            )}
          </div>
        </div>
        {(a.files.length > 0 || a.links.length > 0 || a.repeat !== "none") && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {a.repeat !== "none" && (
              <Chip icon={Repeat} label={repeatLabel(a.repeat)} />
            )}
            {a.files.length > 0 && (
              <Chip icon={Paperclip} label={`${a.files.length} file${a.files.length > 1 ? "s" : ""}`} />
            )}
            {a.links.length > 0 && (
              <Chip icon={Link2} label={`${a.links.length} linked`} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ icon: Icon, label }: { icon: typeof Calendar; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-black bg-[#F1F1F3] rounded-full px-2.5 py-1">
      <Icon className="w-3 h-3" /> {label}
    </span>
  );
}

// ============================================================
// Book appointment bottom sheet
// ============================================================
function BookAppointmentSheet({
  onClose, onSave,
}: { onClose: () => void; onSave: (a: Appt) => void }) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState<LocationPick | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [repeat, setRepeat] = useState<RepeatOpt>("none");
  const [note, setNote] = useState("");
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [links, setLinks] = useState<LinkedItem[]>([]);

  const [openLocation, setOpenLocation] = useState(false);
  const [openRepeat, setOpenRepeat] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSave = title.trim().length > 0 && !!date;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []);
    const mapped: AttachedFile[] = list.map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
    }));
    setFiles((prev) => [...prev, ...mapped]);
    e.target.value = "";
  };

  const commitSave = () => {
    if (!canSave) return;
    onSave({
      id: Math.random().toString(36).slice(2),
      title: title.trim(),
      location,
      date,
      time,
      repeat,
      note: note.trim(),
      files,
      links,
      status: "upcoming",
    });
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/40 flex items-end" onClick={onClose}>
      <div
        className="w-full max-w-md mx-auto bg-white rounded-t-3xl flex flex-col max-h-[94dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-black/15 mx-auto my-3 shrink-0" />
        <div className="flex items-center px-5 pb-4 shrink-0">
          <button onClick={onClose} className="text-[15px] font-medium text-[#60A5FA] w-20 text-left">
            Cancel
          </button>
          <h3 className="flex-1 text-center text-[17px] font-bold text-black">Book appointment</h3>
          <div className="w-20" />
        </div>

        <div className="px-5 pb-4 space-y-3 overflow-y-auto flex-1">
          {/* Title */}
          <div className="rounded-2xl border border-black/10 px-4 py-3">
            <p className="text-[12px] text-muted-foreground">
              Appointment name<span className="text-[#E5484D]">*</span>
            </p>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Endocrinology follow-up"
              className="w-full bg-transparent outline-none text-[15px] text-black placeholder:text-black/30 mt-1"
            />
          </div>

          {/* Location */}
          <button
            onClick={() => setOpenLocation(true)}
            className="w-full flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-muted-foreground">Location</p>
              <p className="text-[15px] text-black truncate">
                {location ? location.name : <span className="text-black/30">Search hospital or clinic</span>}
              </p>
              {location && (
                <p className="text-[12px] text-muted-foreground truncate">{location.address}</p>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          </button>

          {/* Date & time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-black/10 px-4 py-3">
              <p className="text-[12px] text-muted-foreground">Date<span className="text-[#E5484D]">*</span></p>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent outline-none text-[15px] text-black mt-1"
              />
            </div>
            <div className="rounded-2xl border border-black/10 px-4 py-3">
              <p className="text-[12px] text-muted-foreground">Time</p>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-transparent outline-none text-[15px] text-black mt-1"
              />
            </div>
          </div>

          {/* Repeat */}
          <button
            onClick={() => setOpenRepeat(true)}
            className="w-full flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-[#DCEBFF] flex items-center justify-center shrink-0">
              <Repeat className="w-5 h-5 text-[#60A5FA]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-muted-foreground">Repeat</p>
              <p className="text-[15px] text-black">{repeatLabel(repeat)}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          </button>

          {/* Note */}
          <div className="rounded-2xl border border-black/10 px-4 py-3">
            <p className="text-[12px] text-muted-foreground">Note</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Questions to ask, symptoms to mention…"
              rows={3}
              className="w-full bg-transparent outline-none text-[15px] text-black placeholder:text-black/30 mt-1 resize-none"
            />
          </div>

          {/* Attachments */}
          <div className="pt-2">
            <p className="text-[12px] font-semibold tracking-wide text-muted-foreground mb-2">DOCUMENTS &amp; PHOTOS</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-2xl border-2 border-dashed border-black/15 py-5 flex items-center justify-center gap-2 text-[14px] font-semibold text-black"
            >
              <Paperclip className="w-4 h-4" />
              Attach files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f) => (
                  <div key={f.id} className="flex items-center gap-3 rounded-xl border border-black/10 px-3 py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#DCEBFF] flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[#60A5FA]" />
                    </div>
                    <p className="flex-1 text-[14px] text-black truncate">{f.name}</p>
                    <span className="text-[12px] text-muted-foreground">{f.size}</span>
                    <button
                      onClick={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}
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

          {/* Link from other modules */}
          <div className="pt-2 pb-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] font-semibold tracking-wide text-muted-foreground">LINK FROM YOUR APPS</p>
              <button
                onClick={() => setOpenLink(true)}
                className="text-[12px] font-semibold text-[#60A5FA] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {links.length === 0 ? (
              <button
                onClick={() => setOpenLink(true)}
                className="w-full rounded-2xl border-2 border-dashed border-black/15 py-5 flex flex-col items-center gap-1 text-black"
              >
                <Link2 className="w-4 h-4" />
                <span className="text-[14px] font-semibold">Link a report, note, symptom…</span>
                <span className="text-[11px] text-muted-foreground">Pull anything from any mini-app</span>
              </button>
            ) : (
              <div className="space-y-2">
                {links.map((l) => {
                  const Icon = MODULE_ICON[l.module] ?? FileText;
                  return (
                    <div key={l.id} className="flex items-center gap-3 rounded-xl border border-black/10 px-3 py-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#F1F1F3] flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#8B5CF6]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-black truncate">{l.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {l.moduleLabel}{l.subtitle ? ` · ${l.subtitle}` : ""}
                        </p>
                      </div>
                      <button
                        onClick={() => setLinks((prev) => prev.filter((x) => x.id !== l.id))}
                        className="text-muted-foreground"
                        aria-label="Remove link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="px-5 pt-2 pb-6 shrink-0">
          <button
            disabled={!canSave}
            onClick={commitSave}
            className="w-full h-14 rounded-full text-white text-[17px] font-semibold transition-colors"
            style={{ background: canSave ? "#171717" : "#B8B8BE" }}
          >
            Book appointment
          </button>
        </div>

        {openLocation && (
          <LocationPickerSheet
            initial={location}
            onClose={() => setOpenLocation(false)}
            onSave={(v) => { setLocation(v); setOpenLocation(false); }}
          />
        )}
        {openRepeat && (
          <RepeatPickerSheet
            value={repeat}
            onClose={() => setOpenRepeat(false)}
            onSave={(v) => { setRepeat(v); setOpenRepeat(false); }}
          />
        )}
        {openLink && (
          <LinkPickerSheet
            existing={links.map((l) => l.id)}
            onClose={() => setOpenLink(false)}
            onSave={(picked) => { setLinks((prev) => [...prev, ...picked]); setOpenLink(false); }}
          />
        )}
      </div>
    </div>
  );
}

// ---------- Location picker ----------
function LocationPickerSheet({
  initial, onClose, onSave,
}: { initial: LocationPick | null; onClose: () => void; onSave: (v: LocationPick) => void }) {
  const [q, setQ] = useState(initial?.name ?? "");
  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return LOCATION_SUGGESTIONS;
    return LOCATION_SUGGESTIONS.filter((l) =>
      l.name.toLowerCase().includes(query) || l.address.toLowerCase().includes(query),
    );
  }, [q]);

  return (
    <div className="fixed inset-0 z-[95] bg-black/40 flex items-end" onClick={onClose}>
      <div
        className="w-full max-w-md mx-auto bg-white rounded-t-3xl flex flex-col max-h-[92dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-black/15 mx-auto my-3 shrink-0" />
        <div className="flex items-center px-5 pb-3 shrink-0">
          <button onClick={onClose} className="text-[15px] font-medium text-[#60A5FA] w-20 text-left flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h3 className="flex-1 text-center text-[17px] font-bold text-black">Location</h3>
          <div className="w-20" />
        </div>
        <div className="px-5 pb-3 shrink-0">
          <div className="flex items-center gap-2 rounded-2xl bg-[#F1F1F3] px-4 h-11">
            <SearchIcon className="w-4 h-4 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search hospital, clinic, address…"
              className="flex-1 bg-transparent outline-none text-[15px] text-black placeholder:text-black/40"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Clear">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
        <div className="px-5 pb-6 overflow-y-auto flex-1">
          {q.trim() && (
            <button
              onClick={() => onSave({ name: q.trim(), address: "Custom location" })}
              className="w-full flex items-center gap-3 py-3 border-b border-black/5 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
                <Plus className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-black truncate">Use "{q.trim()}"</p>
                <p className="text-[11px] text-muted-foreground">Add as custom location</p>
              </div>
            </button>
          )}
          {results.map((r) => (
            <button
              key={r.name}
              onClick={() => onSave(r)}
              className="w-full flex items-center gap-3 py-3 border-b border-black/5 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F1F1F3] flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-black truncate">{r.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{r.address}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
          {results.length === 0 && !q.trim() && (
            <p className="text-center text-[13px] text-muted-foreground py-8">No results</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Repeat picker ----------
function RepeatPickerSheet({
  value, onClose, onSave,
}: { value: RepeatOpt; onClose: () => void; onSave: (v: RepeatOpt) => void }) {
  return (
    <div className="fixed inset-0 z-[95] bg-black/40 flex items-end" onClick={onClose}>
      <div className="w-full max-w-md mx-auto bg-white rounded-t-3xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full bg-black/15 mx-auto my-3 shrink-0" />
        <div className="flex items-center px-5 pb-3 shrink-0">
          <button onClick={onClose} className="text-[15px] font-medium text-[#60A5FA] w-20 text-left">Cancel</button>
          <h3 className="flex-1 text-center text-[17px] font-bold text-black">Repeat</h3>
          <div className="w-20" />
        </div>
        <div className="px-5 pb-6">
          {REPEAT_OPTIONS.map((opt) => {
            const active = opt.key === value;
            return (
              <button
                key={opt.key}
                onClick={() => onSave(opt.key)}
                className="w-full flex items-center py-3.5 border-b border-black/5 text-left"
              >
                <span className="flex-1 text-[15px] text-black">{opt.label}</span>
                {active && <Check className="w-5 h-5 text-[#8B5CF6]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------- Link from other apps picker ----------
function LinkPickerSheet({
  existing, onClose, onSave,
}: { existing: string[]; onClose: () => void; onSave: (picked: LinkedItem[]) => void }) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return LINKABLE.filter((l) => !existing.includes(l.id) && (
      !query
      || l.title.toLowerCase().includes(query)
      || l.moduleLabel.toLowerCase().includes(query)
      || (l.subtitle ?? "").toLowerCase().includes(query)
    ));
  }, [q, existing]);

  const grouped = useMemo(() => {
    const map = new Map<string, LinkedItem[]>();
    filtered.forEach((l) => {
      if (!map.has(l.moduleLabel)) map.set(l.moduleLabel, []);
      map.get(l.moduleLabel)!.push(l);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const commit = () => {
    onSave(LINKABLE.filter((l) => selected.has(l.id)));
  };

  return (
    <div className="fixed inset-0 z-[95] bg-black/40 flex items-end" onClick={onClose}>
      <div
        className="w-full max-w-md mx-auto bg-white rounded-t-3xl flex flex-col max-h-[92dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-black/15 mx-auto my-3 shrink-0" />
        <div className="flex items-center px-5 pb-3 shrink-0">
          <button onClick={onClose} className="text-[15px] font-medium text-[#60A5FA] w-20 text-left">Cancel</button>
          <h3 className="flex-1 text-center text-[17px] font-bold text-black">Link items</h3>
          <button
            onClick={commit}
            disabled={selected.size === 0}
            className="text-[15px] font-semibold text-[#60A5FA] w-20 text-right disabled:opacity-40"
          >
            Add ({selected.size})
          </button>
        </div>
        <div className="px-5 pb-3 shrink-0">
          <div className="flex items-center gap-2 rounded-2xl bg-[#F1F1F3] px-4 h-11">
            <SearchIcon className="w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search reports, notes, symptoms…"
              className="flex-1 bg-transparent outline-none text-[15px] text-black placeholder:text-black/40"
            />
          </div>
        </div>
        <div className="px-5 pb-8 overflow-y-auto flex-1">
          {grouped.length === 0 ? (
            <p className="text-center text-[13px] text-muted-foreground py-8">Nothing to link</p>
          ) : grouped.map(([label, items]) => (
            <div key={label} className="mb-4">
              <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-1.5 mt-2">{label}</p>
              <div className="space-y-1.5">
                {items.map((l) => {
                  const Icon = MODULE_ICON[l.module] ?? FileText;
                  const isSel = selected.has(l.id);
                  return (
                    <button
                      key={l.id}
                      onClick={() => toggle(l.id)}
                      className="w-full flex items-center gap-3 rounded-2xl border border-black/10 px-3 py-2.5 text-left"
                      style={{ background: isSel ? "#EDE9FE" : "#fff", borderColor: isSel ? "#8B5CF6" : "rgba(0,0,0,0.1)" }}
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#F1F1F3] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#8B5CF6]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-black truncate">{l.title}</p>
                        {l.subtitle && (
                          <p className="text-[11px] text-muted-foreground truncate">{l.subtitle}</p>
                        )}
                      </div>
                      <div
                        className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0"
                        style={{
                          background: isSel ? "#8B5CF6" : "transparent",
                          borderColor: isSel ? "#8B5CF6" : "rgba(0,0,0,0.2)",
                        }}
                      >
                        {isSel && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
