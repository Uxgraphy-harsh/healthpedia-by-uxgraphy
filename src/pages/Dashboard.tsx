import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Heart, Footprints, Moon, ChevronRight, Plus, Check,
  Pencil, Upload, TrendingUp
} from "lucide-react";

// ─── Data ───────────────────────────────────────────────────────────────────────

const healthScore = {
  score: 74,
  change: "+3 from last week",
  syncedAgo: "Synced 4 mins ago",
};

const vitals = [
  { icon: Heart, label: "Heart Rate", value: "72", unit: "bpm", status: "Normal", statusColor: "text-health-good", iconBg: "bg-health-alert/20", iconColor: "text-health-alert" },
  { icon: Footprints, label: "Steps", value: "6,240", unit: "", status: "Below Goal", statusColor: "text-health-watch", iconBg: "bg-health-watch/20", iconColor: "text-health-watch" },
  { icon: Moon, label: "Sleep", value: "7", valueSuffix: "hr", value2: "23", value2Suffix: "min", unit: "", status: "Below Goal", statusColor: "text-health-watch", iconBg: "bg-secondary/20", iconColor: "text-secondary" },
];

const remindersData = [
  {
    id: "r1",
    title: "Dr. Meena Sharma – Apollo Clinic Pune",
    subtitle: "Tomorrow • 11:30 AM",
    badge: "Appointment",
    badgeColor: "bg-secondary/10 text-secondary",
    borderColor: "border-l-secondary",
    done: false,
  },
  {
    id: "r2",
    title: "Collect TSH Report – SRL Diagnostics…",
    subtitle: "Wed, 26 • After 5 PM",
    badge: "Report collection",
    badgeColor: "bg-health-alert/10 text-health-alert",
    borderColor: "border-l-health-alert",
    done: false,
  },
  {
    id: "r3",
    title: "Eltroxin 50mcg",
    subtitle: "Daily • After Dinner",
    badge: "Medicine",
    badgeColor: "bg-health-good/10 text-health-good",
    borderColor: "border-l-health-good",
    done: true,
  },
];

const familyMembers = [
  { id: "f1", name: "Dad", age: 72, image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=200&h=200&fit=crop&crop=face" },
  { id: "f2", name: "Brother", age: 72, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
];

const watchlistData = [
  { name: "TSH (Thyroid)", date: "14 Jan 2025", value: "6.2", unit: "mIU/L", status: "Above range", statusColor: "text-health-alert" },
  { name: "Fasting Blood Sugar", date: "14 Jan 2025", value: "98", unit: "mg/dL", status: "Normal", statusColor: "text-health-good" },
  { name: "Blood Pressure", date: "14 Jan 2025", value: "122/80", unit: "", status: "Normal", statusColor: "text-health-good" },
  { name: "Total Cholesterol", date: "2 Nov 2024", value: "194", unit: "mg/dL", status: "Normal", statusColor: "text-health-good" },
  { name: "HbA1c", date: "2 Nov 2024", value: "5.4", unit: "%", status: "Normal", statusColor: "text-health-good" },
];

// ─── Component ──────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState(remindersData);

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r))
    );
  };

  return (
    <div className="mobile-container pb-24">
      {/* ─── DARK HEADER ─── */}
      <div className="bg-[#2C0011] text-white px-5 pt-6 pb-8 rounded-b-[2rem]">
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-medium tracking-widest uppercase opacity-70">Today's Summary</p>
          <button className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Pencil className="w-3 h-3" />
            <span className="text-[11px] font-medium">Customise</span>
          </button>
        </div>

        {/* Health Score */}
        <div className="mb-3">
          <h1 className="text-6xl font-bold font-serif leading-none">{healthScore.score}</h1>
          <p className="text-sm opacity-80 mt-1">Health score</p>
        </div>

        {/* Change pill */}
        <div className="inline-flex items-center gap-1.5 bg-health-good/20 text-health-good rounded-full px-3 py-1 mb-4">
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{healthScore.change}</span>
        </div>

        {/* Synced */}
        <div className="flex items-center gap-1.5 mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-health-good" />
          <span className="text-[11px] opacity-60">{healthScore.syncedAgo}</span>
        </div>

        {/* Vital cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {vitals.map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5"
            >
              <div className={`w-8 h-8 rounded-xl ${v.iconBg} flex items-center justify-center mb-3`}>
                <v.icon className={`w-4 h-4 ${v.iconColor}`} />
              </div>
              <div className="mb-1">
                {v.value2 ? (
                  <p className="text-xl font-bold leading-tight">
                    {v.value}<span className="text-xs font-normal opacity-60">{v.valueSuffix} </span>
                    {v.value2}<span className="text-xs font-normal opacity-60">{v.value2Suffix}</span>
                  </p>
                ) : (
                  <p className="text-xl font-bold leading-tight">
                    {v.value}
                    {v.unit && <span className="text-xs font-normal opacity-60 ml-0.5">{v.unit}</span>}
                  </p>
                )}
              </div>
              <p className="text-[10px] opacity-60 mb-1.5">{v.label}</p>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                v.status === "Normal" 
                  ? "bg-health-good/20 text-health-good" 
                  : "bg-health-watch/20 text-health-watch"
              }`}>
                {v.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── WHITE CONTENT AREA ─── */}
      <div className="px-5 mt-6 space-y-7">

        {/* ─── REMINDERS ─── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold font-sans uppercase tracking-wide text-muted-foreground">Reminders</h2>
            <button onClick={() => navigate("/reminders")} className="text-xs text-muted-foreground font-medium flex items-center gap-0.5">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {reminders.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-card rounded-2xl p-4 border-l-[3px] ${r.borderColor} ${r.done ? "opacity-50" : ""}`}
              >
                <div className="flex items-start gap-3">
                  {r.done ? (
                    <button
                      onClick={() => toggleReminder(r.id)}
                      className="w-6 h-6 rounded-full bg-health-good/10 flex items-center justify-center mt-0.5 shrink-0"
                    >
                      <Check className="w-3.5 h-3.5 text-health-good" />
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleReminder(r.id)}
                      className="w-6 h-6 rounded-full border-2 border-border mt-0.5 shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold leading-tight ${r.done ? "line-through text-muted-foreground" : ""}`}>
                      {r.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">{r.subtitle}</p>
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1.5 ${r.badgeColor}`}>
                      {r.badge}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add reminder button */}
          <button
            onClick={() => navigate("/reminders")}
            className="w-full flex items-center justify-center gap-2 mt-3 py-3 rounded-2xl border-2 border-dashed border-primary/30 text-primary font-semibold text-sm"
          >
            <Plus className="w-4 h-4" />
            Add a reminder
          </button>
        </section>

        {/* ─── FAMILY ─── */}
        <section>
          <h2 className="text-sm font-bold font-sans uppercase tracking-wide text-muted-foreground mb-3">Family</h2>
          <div className="flex gap-3 items-start">
            {familyMembers.map((member) => (
              <div key={member.id} className="flex flex-col items-center">
                <div className="w-[100px] h-[100px] rounded-2xl overflow-hidden mb-2">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">{member.name}</span>
                  <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-1.5 py-0.5 rounded-md">{member.age}</span>
                </div>
              </div>
            ))}
            {/* Add member */}
            <button className="flex flex-col items-center justify-center w-[100px]">
              <div className="w-[100px] h-[100px] rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center mb-2">
                <Plus className="w-6 h-6 text-primary/50" />
              </div>
              <span className="text-xs font-medium text-primary">Add a member</span>
            </button>
          </div>
        </section>

        {/* ─── WATCHLIST ─── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold font-sans uppercase tracking-wide text-muted-foreground">Watchlist</h2>
            <button className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5">
              <Pencil className="w-3 h-3 text-muted-foreground" />
              <span className="text-[11px] font-medium text-muted-foreground">Customise</span>
            </button>
          </div>

          <div className="bg-card rounded-2xl overflow-hidden divide-y divide-border/50">
            {watchlistData.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">
                    {item.value}
                    {item.unit && <span className="text-[10px] font-normal text-muted-foreground ml-1">{item.unit}</span>}
                  </p>
                  <p className={`text-[11px] font-medium ${item.statusColor}`}>{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── UPLOAD CTA ─── */}
        <section className="pb-2">
          <div className="bg-health-good/10 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Upload your latest report</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Some values are over 60 days old</p>
            </div>
            <button
              onClick={() => navigate("/records")}
              className="bg-health-good text-white font-semibold text-sm px-4 py-2 rounded-xl"
            >
              Upload
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
