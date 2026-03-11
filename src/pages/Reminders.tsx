import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, X, Pill, Apple, Calendar, Settings, Bell, Check, Clock,
  ChevronLeft, ChevronRight, Trash2, Edit3, History, AlarmClock,
  Stethoscope, Activity, Timer, RotateCcw
} from "lucide-react";
import FloatingActionButton from "@/components/FloatingActionButton";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface Reminder {
  id: number;
  title: string;
  times: string[];
  category: string;
  repeat: string;
  note: string;
  status: "upcoming" | "completed" | "missed" | "snoozed";
  completedAt?: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────────

const categoryConfig: Record<string, { icon: typeof Pill; color: string }> = {
  Medication: { icon: Pill, color: "text-primary bg-primary/10" },
  Food: { icon: Apple, color: "text-health-watch bg-health-watch/10" },
  Appointment: { icon: Calendar, color: "text-accent bg-accent/10" },
  "Health Check": { icon: Stethoscope, color: "text-health-good bg-health-good/10" },
  Custom: { icon: Settings, color: "text-muted-foreground bg-muted/50" },
};

const categories = ["All", ...Object.keys(categoryConfig)];

const snoozeOptions = [
  { label: "5 min", minutes: 5 },
  { label: "10 min", minutes: 10 },
  { label: "30 min", minutes: 30 },
  { label: "1 hour", minutes: 60 },
];

const repeatOptions = ["Daily", "Weekly", "Monthly", "Custom"];

const initialReminders: Reminder[] = [
  { id: 1, title: "Take Metformin", times: ["08:00"], category: "Medication", repeat: "Daily", note: "500mg with food", status: "upcoming" },
  { id: 2, title: "Blood Pressure Check", times: ["09:00"], category: "Health Check", repeat: "Daily", note: "", status: "completed", completedAt: "2026-03-11T09:05:00" },
  { id: 3, title: "Dr. Sharma Appointment", times: ["14:30"], category: "Appointment", repeat: "Once", note: "Endocrinology follow-up", status: "upcoming" },
  { id: 4, title: "Eat Low-GI Snack", times: ["16:00"], category: "Food", repeat: "Daily", note: "", status: "upcoming" },
  { id: 5, title: "Evening Walk", times: ["18:00"], category: "Custom", repeat: "Daily", note: "30 minutes minimum", status: "upcoming" },
  { id: 6, title: "Take Atorvastatin", times: ["21:00"], category: "Medication", repeat: "Daily", note: "10mg before bed", status: "upcoming" },
  { id: 7, title: "Morning Metformin (Yesterday)", times: ["08:00"], category: "Medication", repeat: "Daily", note: "", status: "missed", completedAt: "2026-03-10T08:00:00" },
];

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function statusBadge(status: string) {
  switch (status) {
    case "completed": return "bg-health-good/15 text-health-good";
    case "missed": return "bg-health-alert/15 text-health-alert";
    case "snoozed": return "bg-health-watch/15 text-health-watch";
    default: return "bg-primary/10 text-primary";
  }
}

// ─── Creation Flow Steps ────────────────────────────────────────────────────────

function CreationFlow({ onClose, onSave }: { onClose: () => void; onSave: (r: Omit<Reminder, "id" | "status">) => void }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Medication");
  const [times, setTimes] = useState(["08:00"]);
  const [repeat, setRepeat] = useState("Daily");
  const [note, setNote] = useState("");

  const totalSteps = 5;
  const canProceed = step === 1 ? title.trim().length > 0 : true;

  const addTime = () => setTimes([...times, "12:00"]);
  const removeTime = (i: number) => setTimes(times.filter((_, idx) => idx !== i));
  const updateTime = (i: number, v: string) => setTimes(times.map((t, idx) => (idx === i ? v : t)));

  const handleSave = () => {
    onSave({ title, category, times, repeat, note });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
      <div className="glass-card-elevated p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm font-serif">New Reminder</h3>
            <p className="text-[10px] text-muted-foreground">Step {step} of {totalSteps}</p>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        {/* Progress */}
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        {/* Step 1: Title */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            <p className="text-xs font-medium">What would you like to be reminded about?</p>
            <input
              placeholder="e.g., Take Metformin, Drink Water..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none"
              autoFocus
            />
            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-1.5">
              {["Take Metformin", "Drink Water", "Blood Sugar Check", "Doctor Visit", "Evening Walk"].map((s) => (
                <button
                  key={s}
                  onClick={() => setTitle(s)}
                  className={`text-[10px] px-3 py-1.5 rounded-full font-medium transition-all ${
                    title === s ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Category */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            <p className="text-xs font-medium">What type of reminder is this?</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(categoryConfig).map(([key, { icon: Icon, color }]) => (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className={`p-3 rounded-xl text-left transition-all flex items-center gap-2.5 ${
                    category === key ? "bg-primary text-primary-foreground" : "bg-muted/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{key}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Time */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            <p className="text-xs font-medium">When should we remind you?</p>
            {times.map((t, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="time"
                  value={t}
                  onChange={(e) => updateTime(i, e.target.value)}
                  className="flex-1 bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none"
                />
                {times.length > 1 && (
                  <button onClick={() => removeTime(i)} className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                )}
              </div>
            ))}
            <button onClick={addTime} className="text-xs text-primary font-medium flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add another time
            </button>
          </motion.div>
        )}

        {/* Step 4: Repeat */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            <p className="text-xs font-medium">How often should this repeat?</p>
            <div className="grid grid-cols-2 gap-2">
              {repeatOptions.map((r) => (
                <button
                  key={r}
                  onClick={() => setRepeat(r)}
                  className={`p-3 rounded-xl text-xs font-medium transition-all ${
                    repeat === r ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 5: Note */}
        {step === 5 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            <p className="text-xs font-medium">Any additional details? (Optional)</p>
            <textarea
              placeholder="e.g., Take with food, bring reports..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none resize-none"
            />

            {/* Summary */}
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Summary</p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Title</span><span className="font-medium">{title}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{category}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Time(s)</span><span className="font-medium">{times.map(formatTime).join(", ")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Repeat</span><span className="font-medium">{repeat}</span></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex gap-2">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="glass-card flex-1 text-sm py-3 font-semibold flex items-center justify-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed}
              className="btn-primary-gradient flex-1 text-sm py-3 disabled:opacity-40"
            >
              Next
            </button>
          ) : (
            <button onClick={handleSave} className="btn-primary-gradient flex-1 text-sm py-3">
              Create Reminder
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Snooze Sheet ───────────────────────────────────────────────────────────────

function SnoozeSheet({ onClose, onSnooze }: { onClose: () => void; onSnooze: (minutes: number) => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} className="relative w-full max-w-md bg-card rounded-t-3xl p-5 pb-8 space-y-4 border-t border-border/50">
        <div className="w-10 h-1 rounded-full bg-muted mx-auto" />
        <div className="flex items-center gap-2">
          <AlarmClock className="w-5 h-5 text-health-watch" />
          <h3 className="font-semibold text-sm font-serif">Snooze Reminder</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {snoozeOptions.map((opt) => (
            <button
              key={opt.minutes}
              onClick={() => onSnooze(opt.minutes)}
              className="bg-muted/50 rounded-xl p-3 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all"
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-full text-sm text-muted-foreground py-2">Cancel</button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function Reminders() {
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [activeView, setActiveView] = useState<"active" | "history">("active");
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [snoozeTarget, setSnoozeTarget] = useState<number | null>(null);

  const activeReminders = reminders.filter((r) => r.status === "upcoming" || r.status === "snoozed");
  const historyReminders = reminders.filter((r) => r.status === "completed" || r.status === "missed");

  const displayList = activeView === "active" ? activeReminders : historyReminders;
  const filtered = activeCategory === "All" ? displayList : displayList.filter((r) => r.category === activeCategory);

  const toggleDone = (id: number) => {
    setReminders(reminders.map((r) =>
      r.id === id
        ? { ...r, status: r.status === "completed" ? "upcoming" : "completed", completedAt: new Date().toISOString() }
        : r
    ));
  };

  const handleSnooze = (id: number, minutes: number) => {
    setReminders(reminders.map((r) =>
      r.id === id ? { ...r, status: "snoozed" as const } : r
    ));
    setSnoozeTarget(null);
  };

  const handleDelete = (id: number) => {
    setReminders(reminders.filter((r) => r.id !== id));
    setEditingReminder(null);
  };

  const handleCreate = (data: Omit<Reminder, "id" | "status">) => {
    const newReminder: Reminder = {
      ...data,
      id: Date.now(),
      status: "upcoming",
    };
    setReminders([newReminder, ...reminders]);
  };

  const upcomingCount = activeReminders.length;
  const completedToday = historyReminders.filter((r) => r.status === "completed").length;
  const missedToday = historyReminders.filter((r) => r.status === "missed").length;

  const fabActions = [
    { icon: Plus, label: "Add Reminder", onClick: () => setShowForm(true) },
  ];

  // ─── Detail / Edit View ───────────────────────────────────────────────────
  if (editingReminder) {
    const config = categoryConfig[editingReminder.category] || categoryConfig.Custom;
    const Icon = config.icon;

    return (
      <div className="mobile-container pb-24">
        <div className="px-5 pt-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setEditingReminder(null)} className="flex items-center gap-2 text-sm text-muted-foreground">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={() => handleDelete(editingReminder.id)} className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-elevated p-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold font-serif">{editingReminder.title}</h2>
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${statusBadge(editingReminder.status)}`}>
                  {editingReminder.status}
                </span>
              </div>
            </div>

            <div className="space-y-3 bg-muted/30 rounded-xl p-4">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-3 h-3" /> Time(s)</span>
                <span className="font-medium">{editingReminder.times.map(formatTime).join(", ")}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5"><RotateCcw className="w-3 h-3" /> Repeat</span>
                <span className="font-medium">{editingReminder.repeat}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5"><Bell className="w-3 h-3" /> Category</span>
                <span className="font-medium">{editingReminder.category}</span>
              </div>
            </div>

            {editingReminder.note && (
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Note</p>
                <p className="text-sm text-foreground">{editingReminder.note}</p>
              </div>
            )}

            {editingReminder.status === "upcoming" && (
              <div className="flex gap-2">
                <button onClick={() => toggleDone(editingReminder.id)} className="btn-primary-gradient flex-1 text-sm py-3 flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Mark Done
                </button>
                <button onClick={() => setSnoozeTarget(editingReminder.id)} className="glass-card flex-1 text-sm py-3 font-semibold flex items-center justify-center gap-2">
                  <AlarmClock className="w-4 h-4 text-health-watch" /> Snooze
                </button>
              </div>
            )}

            {editingReminder.completedAt && (
              <p className="text-[10px] text-muted-foreground text-center">
                {editingReminder.status === "completed" ? "Completed" : "Missed"} at{" "}
                {new Date(editingReminder.completedAt).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
              </p>
            )}
          </motion.div>
        </div>

        <AnimatePresence>
          {snoozeTarget && <SnoozeSheet onClose={() => setSnoozeTarget(null)} onSnooze={(m) => handleSnooze(snoozeTarget, m)} />}
        </AnimatePresence>
      </div>
    );
  }

  // ─── Main List View ───────────────────────────────────────────────────────
  return (
    <div className="mobile-container pb-24">
      <div className="px-5 pt-6 pb-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl font-bold font-serif">Reminders</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Stay on track with your health routine</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-2 mb-4">
          <div className="glass-card flex-1 p-3 text-center">
            <p className="text-lg font-bold text-primary">{upcomingCount}</p>
            <p className="text-[10px] text-muted-foreground">Upcoming</p>
          </div>
          <div className="glass-card flex-1 p-3 text-center">
            <p className="text-lg font-bold text-health-good">{completedToday}</p>
            <p className="text-[10px] text-muted-foreground">Completed</p>
          </div>
          <div className="glass-card flex-1 p-3 text-center">
            <p className="text-lg font-bold text-health-alert">{missedToday}</p>
            <p className="text-[10px] text-muted-foreground">Missed</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 bg-muted/50 rounded-xl p-1 mb-3">
          <button
            onClick={() => setActiveView("active")}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeView === "active" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
            }`}
          >
            <Bell className="w-3.5 h-3.5" /> Active
          </button>
          <button
            onClick={() => setActiveView("history")}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeView === "history" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
            }`}
          >
            <History className="w-3.5 h-3.5" /> History
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-[11px] font-medium transition-all ${
                activeCategory === c ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-3 mt-2">
        {/* Creation Flow */}
        <AnimatePresence>
          {showForm && <CreationFlow onClose={() => setShowForm(false)} onSave={handleCreate} />}
        </AnimatePresence>

        {/* Reminder List */}
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 px-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm font-medium mb-1">
              {activeView === "history" ? "No reminder history yet" : "No reminders yet"}
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              {activeView === "history"
                ? "Completed and missed reminders will appear here."
                : "Create your first reminder to stay consistent with your health routine."}
            </p>
            {activeView === "active" && (
              <button onClick={() => setShowForm(true)} className="btn-primary-gradient text-sm px-6 py-3">
                Create Reminder
              </button>
            )}
          </motion.div>
        ) : (
          filtered.map((r, i) => {
            const config = categoryConfig[r.category] || categoryConfig.Custom;
            const Icon = config.icon;
            const isCompleted = r.status === "completed";
            const isMissed = r.status === "missed";
            const isSnoozed = r.status === "snoozed";

            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform ${
                  isCompleted ? "opacity-60" : ""
                }`}
                onClick={() => setEditingReminder(r)}
              >
                {/* Done toggle */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleDone(r.id); }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    isCompleted ? "border-health-good bg-health-good/20" : isMissed ? "border-health-alert bg-health-alert/10" : "border-border"
                  }`}
                >
                  {isCompleted && <Check className="w-4 h-4 text-health-good" />}
                  {isMissed && <X className="w-3 h-3 text-health-alert" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-semibold truncate ${isCompleted ? "line-through" : ""}`}>{r.title}</p>
                    {isSnoozed && (
                      <span className="text-[9px] font-medium bg-health-watch/15 text-health-watch px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Timer className="w-2.5 h-2.5" /> Snoozed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{r.times.map(formatTime).join(", ")}</span>
                    <span>•</span>
                    <span>{r.repeat}</span>
                    {r.completedAt && activeView === "history" && (
                      <>
                        <span>•</span>
                        <span>
                          {new Date(r.completedAt).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!isCompleted && !isMissed && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSnoozeTarget(r.id); }}
                      className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center"
                    >
                      <AlarmClock className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  )}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${config.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <FloatingActionButton actions={fabActions} />

      {/* Snooze Sheet */}
      <AnimatePresence>
        {snoozeTarget && <SnoozeSheet onClose={() => setSnoozeTarget(null)} onSnooze={(m) => handleSnooze(snoozeTarget, m)} />}
      </AnimatePresence>
    </div>
  );
}
