import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Pill, Apple, Calendar, Settings, Bell, Check } from "lucide-react";

const categoryIcons: Record<string, typeof Pill> = {
  Medicines: Pill,
  Food: Apple,
  Appointments: Calendar,
  Custom: Settings,
};

const sampleReminders = [
  { id: 1, title: "Metformin", time: "8:00 AM", category: "Medicines", repeat: "Daily", done: false },
  { id: 2, title: "Blood Pressure Check", time: "9:00 AM", category: "Custom", repeat: "Daily", done: true },
  { id: 3, title: "Dr. Sharma Appointment", time: "2:30 PM", category: "Appointments", repeat: "Once", done: false },
  { id: 4, title: "Eat Low-GI Snack", time: "4:00 PM", category: "Food", repeat: "Daily", done: false },
  { id: 5, title: "Evening Walk", time: "6:00 PM", category: "Custom", repeat: "Daily", done: false },
];

const categories = ["All", "Medicines", "Food", "Appointments", "Custom"];

export default function Reminders() {
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [reminders, setReminders] = useState(sampleReminders);

  const filtered = activeCategory === "All" ? reminders : reminders.filter((r) => r.category === activeCategory);

  const toggleDone = (id: number) =>
    setReminders(reminders.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));

  return (
    <div className="mobile-container pb-24">
      <div className="px-5 pt-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold font-serif">Health Reminders</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center"
          >
            {showForm ? <X className="w-5 h-5 text-primary-foreground" /> : <Plus className="w-5 h-5 text-primary-foreground" />}
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeCategory === c ? "gradient-primary text-primary-foreground" : "glass-card"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-3">
        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card-elevated p-5 space-y-3">
                <h3 className="font-semibold text-sm">Add Reminder</h3>
                <input placeholder="Title" className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none" />
                <input type="time" className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none" />
                <select className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Custom</option>
                </select>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" defaultChecked className="accent-primary" /> Notification
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" className="accent-primary" /> Alarm
                  </label>
                </div>
                <button className="btn-primary-gradient w-full text-sm py-3">Save Reminder</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.map((r, i) => {
          const Icon = categoryIcons[r.category] || Bell;
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`glass-card p-4 flex items-center gap-4 ${r.done ? "opacity-60" : ""}`}
            >
              <button
                onClick={() => toggleDone(r.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                  r.done ? "border-health-good bg-health-good/20" : "border-border"
                }`}
              >
                {r.done && <Check className="w-4 h-4 text-health-good" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${r.done ? "line-through" : ""}`}>{r.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-foreground">{r.time}</span>
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <span className="text-[10px] text-muted-foreground">{r.repeat}</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No reminders yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Add reminders to stay consistent with medications.</p>
          </div>
        )}
      </div>
    </div>
  );
}
