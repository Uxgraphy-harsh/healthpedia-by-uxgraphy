import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronLeft, ChevronRight, Check, X, Bell, Clock, Filter } from "lucide-react";
import { WarningCircle, CheckCircle } from "@phosphor-icons/react";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";

// ─── Types ──────────────────────────────────────────────────────────────────────

type ReminderCategory = "Appointment" | "Medicine" | "Report collection" | "Food" | "General reminder";

interface ReminderItem {
  id: number;
  title: string;
  date?: string; // e.g. "Tomorrow", "Wed, 26"
  time?: string; // e.g. "11:30 AM", "8:30 AM"
  repeat?: string; // e.g. "Everyday"
  note?: string;
  category: ReminderCategory;
  status: "pending" | "completed" | "missed";
}

// ─── Sample Data ────────────────────────────────────────────────────────────────

const sampleReminders: ReminderItem[] = [
  { id: 1, title: "Dr. Meena Sharma - Apollo Clinic Pune", date: "Tomorrow", time: "11:30 AM", category: "Appointment", status: "pending" },
  { id: 2, title: "Eltroxin 50mcg", repeat: "Everyday", note: "After Dinner", category: "Medicine", status: "pending" },
  { id: 3, title: "Collect TSH Report - SRL Diagnostics...", date: "Wed, 26", time: "After 5 PM", category: "Report collection", status: "pending" },
  { id: 4, title: "Have breakfast", repeat: "Everyday", time: "8:30 AM", category: "Food", status: "pending" },
];

const historyReminders: ReminderItem[] = [
  { id: 101, title: "Eltroxin 50mcg", repeat: "Everyday", note: "After Dinner", category: "Medicine", status: "completed" },
  { id: 102, title: "Eltroxin 50mcg", repeat: "Everyday", note: "After Dinner", category: "Medicine", status: "missed" },
  { id: 103, title: "Eltroxin 50mcg", repeat: "Everyday", note: "After Dinner", category: "Medicine", status: "completed" },
  { id: 104, title: "Eltroxin 50mcg", repeat: "Everyday", note: "After Dinner", category: "Medicine", status: "completed" },
  { id: 105, title: "Eltroxin 50mcg", repeat: "Everyday", note: "After Dinner", category: "Medicine", status: "completed" },
];

const filterTabs = ["All", "Appointments", "Medicines", "Reports", "Food", "General"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const categoryColors: Record<ReminderCategory, string> = {
  Appointment: "bg-blue-50 text-blue-600 border-blue-100",
  Medicine: "bg-orange-50 text-orange-600 border-orange-100",
  "Report collection": "bg-green-50 text-green-600 border-green-100",
  Food: "bg-green-50 text-green-600 border-green-100",
  "General reminder": "bg-gray-50 text-gray-500 border-gray-200",
};

function getTodayLabel() {
  const d = new Date();
  return `TODAY  •  ${d.getDate()} ${d.toLocaleString("en-US", { month: "short" }).toUpperCase()}`;
}

// ─── Dashed Circle Icon ─────────────────────────────────────────────────────────

function DashedCircle() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="15" stroke="#E87C4F" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ─── Reminder Card ──────────────────────────────────────────────────────────────

function ReminderCard({ item, isHistory, onToggle }: { item: ReminderItem; isHistory?: boolean; onToggle?: (id: number) => void }) {
  const metaLine = [item.repeat || item.date, item.time].filter(Boolean).join(" • ");

  return (
    <div className={`bg-white rounded-2xl p-4 flex items-start gap-3 ${isHistory ? "opacity-70" : ""}`}>
      {/* Status icon */}
      <button
        className="pt-1 shrink-0"
        onClick={() => onToggle?.(item.id)}
        disabled={isHistory}
      >
        {item.status === "completed" ? (
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="15" stroke="#3B82F6" strokeWidth="2" fill="#DBEAFE" />
            <path d="M12 18l4 4 8-8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        ) : item.status === "missed" ? (
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="15" stroke="#C2410C" strokeWidth="2" fill="#FED7AA" />
            <path d="M18 13v6" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />
            <circle cx="18" cy="23" r="1.2" fill="#C2410C" />
          </svg>
        ) : (
          <DashedCircle />
        )}
      </button>

      <div className="flex-1 min-w-0">
        {/* Meta line */}
        <p className="text-xs text-muted-foreground mb-0.5">{metaLine}</p>
        {/* Title */}
        <p className={`text-[15px] font-semibold leading-snug truncate ${isHistory ? "text-muted-foreground" : "text-foreground"}`}>
          {item.title}
        </p>
        {/* Note */}
        {item.note && !isHistory && (
          <p className="text-xs text-muted-foreground mt-0.5">Note: {item.note}</p>
        )}
        {/* Category badge */}
        <span className={`inline-block mt-2 text-[11px] font-medium px-3 py-1 rounded-full border ${categoryColors[item.category]}`}>
          {item.category}
        </span>
      </div>
    </div>
  );
}

// ─── Add Reminder Bottom Sheet ──────────────────────────────────────────────────

function AddReminderSheet({ onClose, onSave }: { onClose: () => void; onSave: (r: ReminderItem) => void }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");
  const [repeat, setRepeat] = useState("Everyday");
  const [category, setCategory] = useState<ReminderCategory>("Medicine");
  const [description, setDescription] = useState("");
  const [showRepeatPicker, setShowRepeatPicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(["Sunday"]);

  const typeOptions: ReminderCategory[] = ["Appointment", "Medicine", "Report collection", "Food", "General reminder"];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: Date.now(),
      title,
      date: date || undefined,
      time: time ? `${time} ${ampm}` : undefined,
      repeat: repeat || undefined,
      note: description || undefined,
      category,
      status: "pending",
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
    >
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full max-w-md bg-white rounded-t-3xl overflow-hidden"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        <AnimatePresence mode="wait">
          {showRepeatPicker ? (
            <motion.div
              key="repeat"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="px-5 pb-8"
            >
              {/* Repeat header */}
              <div className="flex items-center justify-between py-3">
                <button onClick={() => setShowRepeatPicker(false)} className="text-blue-500 text-sm font-medium">
                  Back
                </button>
                <h3 className="text-base font-semibold">Repeat</h3>
                <div className="w-10" />
              </div>

              {/* Day list */}
              <div className="mt-4">
                {dayNames.map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className="w-full flex items-center justify-between py-4 border-b border-gray-100"
                  >
                    <span className="text-[15px]">{day}</span>
                    {selectedDays.includes(day) ? (
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="px-5 pb-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between py-3">
                <button onClick={onClose} className="text-blue-500 text-sm font-medium">
                  Cancel
                </button>
                <h3 className="text-base font-semibold">Add reminder</h3>
                <div className="w-14" />
              </div>

              {/* Form */}
              <div className="mt-4 space-y-4">
                {/* REMINDER section */}
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Reminder</p>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <label className="text-xs text-muted-foreground">
                      Title<span className="text-red-500">*</span>
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Thyroid Medicine"
                      className="w-full bg-transparent text-sm mt-1 outline-none"
                    />
                  </div>
                </div>

                {/* Date & Time row */}
                <div className="flex gap-3">
                  <div className="flex-1 bg-gray-50 rounded-xl p-3">
                    <label className="text-xs text-muted-foreground">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-transparent text-sm mt-1 outline-none"
                    />
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-3">
                    <label className="text-xs text-muted-foreground">Time</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="flex-1 bg-transparent text-sm outline-none"
                      />
                      <div className="flex text-xs font-medium">
                        <button
                          onClick={() => setAmpm("AM")}
                          className={ampm === "AM" ? "text-foreground" : "text-muted-foreground/40"}
                        >
                          AM
                        </button>
                        <span className="mx-1 text-muted-foreground/30">/</span>
                        <button
                          onClick={() => setAmpm("PM")}
                          className={ampm === "PM" ? "text-foreground" : "text-muted-foreground/40"}
                        >
                          PM
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Repeat */}
                <button
                  onClick={() => setShowRepeatPicker(true)}
                  className="w-full bg-gray-50 rounded-xl p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs text-muted-foreground">Repeat</p>
                    <p className="text-sm mt-0.5">{repeat}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* TYPE section */}
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Type<span className="text-red-500">*</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {typeOptions.map((t) => (
                      <button
                        key={t}
                        onClick={() => setCategory(t)}
                        className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-all ${
                          category === t
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white text-foreground border-gray-200"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ADDITIONAL INFORMATION */}
                <div>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Additional Information</p>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <label className="text-xs text-muted-foreground">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Write or paste a link"
                      rows={3}
                      className="w-full bg-transparent text-sm mt-1 outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={!title.trim()}
                className="w-full mt-6 bg-black text-white py-4 rounded-2xl text-base font-semibold disabled:opacity-40"
              >
                Save Reminder
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function Reminders() {
  const [activeTab, setActiveTab] = useState("All");
  const [showHistory, setShowHistory] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [reminders, setReminders] = useState<ReminderItem[]>(sampleReminders);
  const [history] = useState<ReminderItem[]>(historyReminders);

  const todayLabel = getTodayLabel();

  const filterReminders = (list: ReminderItem[]) => {
    if (activeTab === "All") return list;
    const map: Record<string, ReminderCategory[]> = {
      Appointments: ["Appointment"],
      Medicines: ["Medicine"],
      Reports: ["Report collection"],
      Food: ["Food"],
      General: ["General reminder"],
    };
    const cats = map[activeTab] || [];
    return list.filter((r) => cats.includes(r.category));
  };

  const handleAddReminder = (r: ReminderItem) => {
    setReminders((prev) => [...prev, r]);
  };

  const handleToggle = (id: number) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === "completed" ? "pending" as const : "completed" as const } : r
      )
    );
  };

  const app = getMiniApp("reminders")!;
  const bottomActions = [
    { icon: Bell, label: "Today", active: !showHistory, onClick: () => setShowHistory(false) },
    { icon: Clock, label: "History", active: showHistory, onClick: () => setShowHistory(true) },
    { icon: Filter, label: "Filter" },
  ];

  // ─── History View ─────────────────────────────────────────────────────────
  if (showHistory) {
    const filtered = filterReminders(history);
    return (
      <MiniAppShell
        appId="reminders"
        name="Reminders History"
        tagline={app.tagline}
        icon={app.icon}
        bg={app.bg}
        fg={app.fg}
        bottomActions={bottomActions}
      >
        {/* Tabs */}
        <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="shrink-0 relative px-1 pb-2"
            >
              <span className={`text-[15px] font-medium whitespace-nowrap ${activeTab === tab ? "text-blue-500" : "text-muted-foreground"}`}>
                {tab}
              </span>
              {activeTab === tab && (
                <motion.div layoutId="historyTabIndicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Date section */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-3">{todayLabel}</p>
          <div className="space-y-3">
            {filtered.map((r) => (
              <ReminderCard key={r.id} item={r} isHistory />
            ))}
          </div>

          <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-3 mt-8">{todayLabel}</p>
          <div className="space-y-3">
            {filtered.map((r) => (
              <ReminderCard key={`dup-${r.id}`} item={{ ...r, status: "completed" }} isHistory />
            ))}
          </div>
        </div>
      </MiniAppShell>
    );
  }


  // ─── Main List View ───────────────────────────────────────────────────────
  const filtered = filterReminders(reminders);

  return (
    <MiniAppShell
      appId="reminders"
      name={app.name}
      tagline={app.tagline}
      icon={app.icon}
      bg={app.bg}
      fg={app.fg}
      bottomActions={bottomActions}
    >
      {/* Category tabs */}
      <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="shrink-0 relative px-1 pb-2"
          >
            <span className={`text-[15px] font-medium whitespace-nowrap ${activeTab === tab ? "text-blue-500" : "text-muted-foreground"}`}>
              {tab}
            </span>
            {activeTab === tab && (
              <motion.div layoutId="mainTabIndicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Date section */}
      <div className="mt-2">
        <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-3">{todayLabel}</p>
        <div className="space-y-3">
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <ReminderCard item={r} onToggle={handleToggle} />
            </motion.div>
          ))}
        </div>

        {/* Second date group */}
        <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-3 mt-8">{todayLabel}</p>
        <div className="space-y-3">
          {filtered.slice(0, 2).map((r, i) => (
            <motion.div
              key={`g2-${r.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <ReminderCard item={r} onToggle={handleToggle} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Add reminder button */}
      {!showAddSheet && (
        <button
          onClick={() => setShowAddSheet(true)}
          className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg"
          style={{ background: "#171717" }}
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
          <span className="font-semibold">Add reminder</span>
        </button>
      )}

      {/* Add Sheet */}
      <AnimatePresence>
        {showAddSheet && (
          <AddReminderSheet onClose={() => setShowAddSheet(false)} onSave={handleAddReminder} />
        )}
      </AnimatePresence>
    </MiniAppShell>

  );
}

