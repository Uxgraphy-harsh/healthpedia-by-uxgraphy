import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Footprints, Heart, Moon, Flame, TrendingUp, TrendingDown,
  MessageCircle, Activity, Upload, Bell, User, Clock, Check,
  Droplets, Weight, Smile, Zap, Ruler, FileText, Pill,
  ChevronRight, Calendar, AlertCircle
} from "lucide-react";
import HealthTimeline from "@/components/HealthTimeline";
import { sampleEvents, sampleReminders } from "@/data/sampleData";

// ─── Greeting ───────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// ─── Health Metric Cards ────────────────────────────────────────────────────────

const healthMetrics = [
  { icon: Footprints, label: "Steps", value: "8,432", unit: "", trend: "up" as const, change: "+12%", color: "text-primary" },
  { icon: Heart, label: "Heart Rate", value: "72", unit: "bpm", trend: "stable" as const, change: "Normal", color: "text-health-alert" },
  { icon: Moon, label: "Sleep", value: "7h 23m", unit: "", trend: "down" as const, change: "-8%", color: "text-secondary" },
  { icon: Flame, label: "Calories", value: "1,847", unit: "kcal", trend: "up" as const, change: "+5%", color: "text-health-watch" },
  { icon: Droplets, label: "Blood Sugar", value: "118", unit: "mg/dL", trend: "up" as const, change: "Pre-meal", color: "text-accent-foreground" },
  { icon: Weight, label: "Weight", value: "62", unit: "kg", trend: "stable" as const, change: "Stable", color: "text-health-good" },
];

// ─── Quick Trackers ─────────────────────────────────────────────────────────────

const quickTrackers = [
  { icon: Droplets, label: "Blood Sugar", color: "bg-accent/10 text-accent-foreground" },
  { icon: Heart, label: "Blood Pressure", color: "bg-health-alert/10 text-health-alert" },
  { icon: Weight, label: "Weight", color: "bg-health-good/10 text-health-good" },
  { icon: Smile, label: "Mood", color: "bg-health-watch/10 text-health-watch" },
  { icon: Activity, label: "Symptom", color: "bg-primary/10 text-primary" },
  { icon: Zap, label: "Energy", color: "bg-secondary/10 text-secondary" },
];

// ─── Quick Actions ──────────────────────────────────────────────────────────────

const quickActions = [
  { icon: Upload, label: "Upload Report", path: "/records" },
  { icon: Bell, label: "Add Reminder", path: "/reminders" },
  { icon: Activity, label: "Log Symptom", path: "/track" },
  { icon: FileText, label: "View Records", path: "/records" },
];

// ─── Reminder category icons ────────────────────────────────────────────────────

const categoryIcons: Record<string, typeof Pill> = {
  medication: Pill,
  appointment: Calendar,
  measurement: Ruler,
  food: Flame,
  custom: Bell,
};

// ─── Component ──────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const userName = "Sarah";

  // Reminders state
  const [reminders, setReminders] = useState(
    sampleReminders.map((r) => ({
      ...r,
      displayTime: formatTime(r.time),
      status: r.done ? ("completed" as const) : isPast(r.time) ? ("missed" as const) : ("upcoming" as const),
    }))
  );

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, done: !r.done, status: !r.done ? "completed" as const : "upcoming" as const } : r
      )
    );
  };

  // Recent events (limit to 4)
  const recentEvents = sampleEvents.slice(0, 4);

  return (
    <div className="mobile-container pb-24">
      {/* ─── GREETING ─── */}
      <div className="px-5 pt-6 pb-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-serif">{getGreeting()}, {userName}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{getFormattedDate()}</p>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-sm"
          >
            <User className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </div>

      <div className="space-y-5 mt-4">
        {/* ─── HEALTH SUMMARY CARDS ─── */}
        <div className="px-5">
          <h2 className="text-sm font-semibold mb-3 font-sans">Health Summary</h2>
        </div>
        <div className="pl-5">
          <div className="flex gap-3 overflow-x-auto pb-1 pr-5 scrollbar-hide">
            {healthMetrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="shrink-0 glass-card p-4 w-[140px]"
              >
                <div className="flex items-center justify-between mb-2">
                  <m.icon className={`w-4.5 h-4.5 ${m.color}`} />
                  {m.trend === "up" ? (
                    <TrendingUp className="w-3.5 h-3.5 text-health-good" />
                  ) : m.trend === "down" ? (
                    <TrendingDown className="w-3.5 h-3.5 text-health-alert" />
                  ) : null}
                </div>
                <p className="text-lg font-bold leading-tight">
                  {m.value}
                  {m.unit && <span className="text-[10px] font-normal text-muted-foreground ml-1">{m.unit}</span>}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                  <p className={`text-[9px] font-medium ${
                    m.trend === "up" ? "text-health-good" :
                    m.trend === "down" ? "text-health-alert" :
                    "text-muted-foreground"
                  }`}>
                    {m.change}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── TODAY'S REMINDERS ─── */}
        <div className="px-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold font-sans">Today's Reminders</h2>
            <button onClick={() => navigate("/reminders")} className="text-[10px] text-primary font-medium flex items-center gap-0.5">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {reminders.slice(0, 4).map((r, i) => {
              const Icon = categoryIcons[r.category] || Bell;
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`glass-card p-3.5 flex items-center gap-3 ${r.status === "completed" ? "opacity-60" : ""}`}
                >
                  <button
                    onClick={() => toggleReminder(r.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                      r.status === "completed"
                        ? "border-health-good bg-health-good/10"
                        : r.status === "missed"
                        ? "border-health-alert bg-health-alert/10"
                        : "border-border"
                    }`}
                  >
                    {r.status === "completed" && <Check className="w-4 h-4 text-health-good" />}
                    {r.status === "missed" && <AlertCircle className="w-3.5 h-3.5 text-health-alert" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${r.status === "completed" ? "line-through" : ""}`}>
                      {r.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">{r.displayTime}</span>
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                        r.status === "completed" ? "bg-health-good/10 text-health-good" :
                        r.status === "missed" ? "bg-health-alert/10 text-health-alert" :
                        "bg-primary/10 text-primary"
                      }`}>
                        {r.status === "completed" ? "Done" : r.status === "missed" ? "Missed" : "Upcoming"}
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ─── QUICK TRACKERS ─── */}
        <div className="px-5">
          <h2 className="text-sm font-semibold mb-3 font-sans">Quick Log</h2>
          <div className="grid grid-cols-3 gap-2">
            {quickTrackers.map((t, i) => (
              <motion.button
                key={t.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.04 }}
                onClick={() => navigate("/track")}
                className="glass-card p-3 flex flex-col items-center gap-2"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.color}`}>
                  <t.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">{t.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ─── RECENT ACTIVITY ─── */}
        <div className="px-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold font-sans">Recent Activity</h2>
            <button onClick={() => navigate("/track")} className="text-[10px] text-primary font-medium flex items-center gap-0.5">
              Full Timeline <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <HealthTimeline events={recentEvents} />
        </div>

        {/* ─── QUICK ACTIONS ─── */}
        <div className="px-5">
          <h2 className="text-sm font-semibold mb-3 font-sans">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((a, i) => (
              <motion.button
                key={a.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                onClick={() => navigate(a.path)}
                className="glass-card p-3 flex flex-col items-center gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <a.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground text-center leading-tight">{a.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function isPast(time: string): boolean {
  const [h, m] = time.split(":").map(Number);
  const now = new Date();
  return now.getHours() > h || (now.getHours() === h && now.getMinutes() > m);
}
