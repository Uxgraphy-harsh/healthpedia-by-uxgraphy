import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Heart, Footprints, Moon, Flame, TrendingUp, TrendingDown,
  MessageCircle, Activity, Upload, Bell, User, Clock
} from "lucide-react";
import HealthTimeline from "@/components/HealthTimeline";
import { sampleEvents } from "@/data/sampleData";

const metrics = [
  { icon: Footprints, label: "Steps", value: "8,432", trend: "up", change: "+12%" },
  { icon: Heart, label: "Heart Rate", value: "72 bpm", trend: "stable", change: "Normal" },
  { icon: Moon, label: "Sleep", value: "7h 23m", trend: "down", change: "-8%" },
  { icon: Flame, label: "Calories", value: "1,847", trend: "up", change: "+5%" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  // Show only today's events
  const todayEvents = sampleEvents.filter((e) => {
    const eventDate = new Date(e.timestamp).toDateString();
    return eventDate === new Date().toDateString() || sampleEvents.indexOf(e) < 4;
  }).slice(0, 4);

  return (
    <div className="mobile-container pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">Good Morning</p>
          <h1 className="text-xl font-bold font-serif">Your Health Dashboard</h1>
        </div>
        <button onClick={() => navigate("/profile")} className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
          <User className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      <div className="px-5 space-y-5 mt-4">
        {/* Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-elevated p-5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 gradient-accent opacity-10 rounded-full -translate-y-8 translate-x-8" />
          <p className="text-xs font-medium text-muted-foreground mb-1">Health Status</p>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-bold font-serif health-status-good">Stable</span>
            <span className="px-2.5 py-1 rounded-full bg-health-good/10 text-health-good text-xs font-semibold">Good</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Sleep", val: "Good", color: "text-health-good" },
              { label: "Activity", val: "Moderate", color: "text-health-watch" },
              { label: "Heart Rate", val: "Normal", color: "text-health-good" },
              { label: "Meds", val: "On Track", color: "text-health-good" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
                <p className={`text-xs font-semibold ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div>
          <h2 className="text-sm font-semibold mb-3 font-sans">Today's Metrics</h2>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <m.icon className="w-5 h-5 text-primary" />
                  {m.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-health-good" />
                  ) : m.trend === "down" ? (
                    <TrendingDown className="w-4 h-4 text-health-alert" />
                  ) : null}
                </div>
                <p className="text-lg font-bold">{m.value}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className={`text-[10px] font-medium ${m.trend === "up" ? "text-health-good" : m.trend === "down" ? "text-health-alert" : "text-muted-foreground"}`}>
                    {m.change}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sleep Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-4">
          <h3 className="text-sm font-semibold mb-3">Sleep Trend — Last 7 Days</h3>
          <div className="flex items-end gap-2 h-20">
            {[6.5, 7.2, 5.8, 7.5, 8.0, 7.3, 7.4].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-lg gradient-primary opacity-70"
                  style={{ height: `${(h / 8.5) * 100}%` }}
                />
                <span className="text-[9px] text-muted-foreground">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity (Timeline Preview) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold font-sans">Recent Activity</h2>
            <button onClick={() => navigate("/track")} className="text-xs text-primary font-medium flex items-center gap-1">
              View All <Clock className="w-3 h-3" />
            </button>
          </div>
          <HealthTimeline events={todayEvents} />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold mb-3 font-sans">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: MessageCircle, label: "Ask AI", path: "/chat" },
              { icon: Activity, label: "Log Symptom", path: "/track" },
              { icon: Upload, label: "Upload", path: "/records" },
              { icon: Bell, label: "Reminder", path: "/reminders" },
            ].map((a, i) => (
              <motion.button
                key={a.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                onClick={() => navigate(a.path)}
                className="glass-card p-3 flex flex-col items-center gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <a.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">{a.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
