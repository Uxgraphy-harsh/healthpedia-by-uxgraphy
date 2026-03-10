import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, X } from "lucide-react";

interface SymptomLog {
  id: number;
  name: string;
  severity: number;
  date: string;
  notes: string;
}

const sampleLogs: SymptomLog[] = [
  { id: 1, name: "Fatigue", severity: 6, date: "2 days ago", notes: "Felt tired after lunch" },
  { id: 2, name: "Headache", severity: 4, date: "3 days ago", notes: "Mild, went away after rest" },
  { id: 3, name: "Dizziness", severity: 3, date: "5 days ago", notes: "Brief episode in morning" },
  { id: 4, name: "Fatigue", severity: 7, date: "6 days ago", notes: "All day, low energy" },
];

const severityColor = (s: number) => {
  if (s <= 3) return "bg-health-good/20 text-health-good";
  if (s <= 6) return "bg-health-watch/20 text-health-watch";
  return "bg-health-alert/20 text-health-alert";
};

const severityLabel = (s: number) => (s <= 3 ? "Low" : s <= 6 ? "Medium" : "High");

export default function Symptoms() {
  const [showForm, setShowForm] = useState(false);
  const [logs] = useState(sampleLogs);
  const [form, setForm] = useState({ name: "", severity: 5, notes: "" });

  return (
    <div className="mobile-container pb-24">
      <div className="px-5 pt-6 pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold font-serif">Symptoms</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center"
          >
            {showForm ? <X className="w-5 h-5 text-primary-foreground" /> : <Plus className="w-5 h-5 text-primary-foreground" />}
          </button>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card-elevated p-5 space-y-4">
                <h3 className="font-semibold text-sm">Log a Symptom</h3>
                <input
                  placeholder="Symptom name (e.g., Fatigue)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none"
                />
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-muted-foreground">Severity</span>
                    <span className="font-semibold">{form.severity}/10 — {severityLabel(form.severity)}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={form.severity}
                    onChange={(e) => setForm({ ...form, severity: Number(e.target.value) })}
                    className="w-full accent-primary"
                  />
                </div>
                <textarea
                  placeholder="Notes (optional)"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none resize-none"
                />
                <button className="btn-primary-gradient w-full text-sm py-3">Save Symptom</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Insight */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 flex items-start gap-3 border-l-4 border-primary">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold mb-0.5">AI Insight</p>
            <p className="text-xs text-muted-foreground">You logged fatigue 4 times this week. This could be related to your reduced sleep pattern. Consider discussing with your doctor.</p>
          </div>
        </motion.div>

        {/* Timeline */}
        <div>
          <h2 className="text-sm font-semibold mb-3">Recent Logs</h2>
          <div className="space-y-3">
            {logs.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{log.name}</h3>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${severityColor(log.severity)}`}>
                    {severityLabel(log.severity)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{log.notes}</p>
                <p className="text-[10px] text-muted-foreground mt-2">{log.date}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {logs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No symptoms logged yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Start tracking symptoms to understand patterns.</p>
          </div>
        )}
      </div>
    </div>
  );
}
