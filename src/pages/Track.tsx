import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Sparkles, X, Activity, Ruler, StickyNote, Pill, Clock,
  Sun, Moon, Sunrise, ChevronDown, Search
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FloatingActionButton from "@/components/FloatingActionButton";
import GlobalSearch from "@/components/GlobalSearch";
import PageHeader from "@/components/PageHeader";
import HealthTimeline from "@/components/HealthTimeline";
import { TagList } from "@/components/TagBadge";
import { sampleSymptoms, sampleTrackers, sampleMedications, sampleEvents, sampleReminders } from "@/data/sampleData";

const severityColor = (s: number) => {
  if (s <= 3) return "bg-health-good/20 text-health-good";
  if (s <= 6) return "bg-health-watch/20 text-health-watch";
  return "bg-health-alert/20 text-health-alert";
};

const severityLabel = (s: number) => (s <= 3 ? "Low" : s <= 6 ? "Medium" : "High");

function RoutineIcon({ time }: { time: string }) {
  if (time === "morning") return <Sunrise className="w-3.5 h-3.5 text-health-watch" />;
  if (time === "night") return <Moon className="w-3.5 h-3.5 text-primary" />;
  return <Sun className="w-3.5 h-3.5 text-health-watch" />;
}

export default function Track() {
  const [showSymptomForm, setShowSymptomForm] = useState(false);
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [symptomForm, setSymptomForm] = useState({ name: "", severity: 5, notes: "" });

  const fabActions = [
    { icon: Activity, label: "Log Symptom", onClick: () => setShowSymptomForm(true) },
    { icon: Ruler, label: "Record Measurement", onClick: () => setShowMeasurementForm(true) },
    { icon: StickyNote, label: "Add Note", onClick: () => {} },
  ];

  return (
    <div className="mobile-container pb-24">
      <PageHeader
        title="Health Tracking"
        subtitle="Log symptoms, measurements & more"
        icon={Activity}
        onSearch={() => setSearchOpen(true)}
      />

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="px-5 mt-2">
        <Tabs defaultValue="symptoms" className="w-full">
          <TabsList className="w-full bg-muted/60 backdrop-blur-sm">
            <TabsTrigger value="symptoms" className="flex-1 text-xs gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Symptoms
            </TabsTrigger>
            <TabsTrigger value="measurements" className="flex-1 text-xs gap-1.5">
              <Ruler className="w-3.5 h-3.5" /> Measurements
            </TabsTrigger>
            <TabsTrigger value="medicines" className="flex-1 text-xs gap-1.5">
              <Pill className="w-3.5 h-3.5" /> Medicines
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1 text-xs gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Timeline
            </TabsTrigger>
          </TabsList>

          {/* ─── SYMPTOMS TAB ─── */}
          <TabsContent value="symptoms" className="mt-4 space-y-4">
            {/* Symptom Form */}
            <AnimatePresence>
              {showSymptomForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="glass-card-elevated p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">Log a Symptom</h3>
                      <button onClick={() => setShowSymptomForm(false)}>
                        <X className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                    <input
                      placeholder="Symptom name (e.g., Fatigue)"
                      value={symptomForm.name}
                      onChange={(e) => setSymptomForm({ ...symptomForm, name: e.target.value })}
                      className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none"
                    />
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-muted-foreground">Severity</span>
                        <span className="font-semibold">{symptomForm.severity}/10 — {severityLabel(symptomForm.severity)}</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={symptomForm.severity}
                        onChange={(e) => setSymptomForm({ ...symptomForm, severity: Number(e.target.value) })}
                        className="w-full accent-primary"
                      />
                    </div>
                    <textarea
                      placeholder="Notes (optional)"
                      value={symptomForm.notes}
                      onChange={(e) => setSymptomForm({ ...symptomForm, notes: e.target.value })}
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
                <p className="text-xs text-muted-foreground">You logged fatigue 4 times this week. This could be related to your reduced sleep pattern.</p>
              </div>
            </motion.div>

            {/* Symptom Logs */}
            <div>
              <h2 className="text-sm font-semibold mb-3 font-sans">Recent Logs</h2>
              <div className="space-y-3">
                {sampleSymptoms.map((log, i) => (
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
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(log.loggedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                      <TagList tags={log.tags} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ─── MEASUREMENTS TAB ─── */}
          <TabsContent value="measurements" className="mt-4 space-y-4">
            <AnimatePresence>
              {showMeasurementForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="glass-card-elevated p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">Record Measurement</h3>
                      <button onClick={() => setShowMeasurementForm(false)}>
                        <X className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                    <select className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none">
                      <option>Blood Sugar</option>
                      <option>Blood Pressure</option>
                      <option>Weight</option>
                      <option>Temperature</option>
                      <option>SpO2</option>
                    </select>
                    <div className="flex gap-3">
                      <input placeholder="Value" type="number" className="flex-1 bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none" />
                      <input placeholder="Unit" defaultValue="mg/dL" className="w-24 bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none" />
                    </div>
                    <textarea placeholder="Notes (optional)" rows={2} className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none resize-none" />
                    <button className="btn-primary-gradient w-full text-sm py-3">Save Measurement</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <h2 className="text-sm font-semibold mb-3 font-sans">Recent Measurements</h2>
              <div className="space-y-3">
                {sampleTrackers.map((tracker, i) => (
                  <motion.div
                    key={tracker.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card p-4"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm capitalize">{tracker.measurementType.replace(/_/g, " ")}</h3>
                      <span className="text-lg font-bold text-foreground">{tracker.value} <span className="text-xs font-normal text-muted-foreground">{tracker.unit}</span></span>
                    </div>
                    {tracker.notes && <p className="text-xs text-muted-foreground">{tracker.notes}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(tracker.recordedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <TagList tags={tracker.tags} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ─── MEDICINES TAB ─── */}
          <TabsContent value="medicines" className="mt-4 space-y-4">
            <div className="glass-card p-3 flex items-center gap-3 border-l-4 border-accent">
              <Sparkles className="w-5 h-5 text-accent shrink-0" />
              <p className="text-xs text-muted-foreground">Medications are tracked here. Use Records to store prescriptions.</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active Medicines ({sampleMedications.filter(m => m.active).length})
              </p>
              {sampleMedications.map((med, i) => (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Pill className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{med.name}</h3>
                        <p className="text-[10px] text-muted-foreground">{med.purpose}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-health-good bg-health-good/10 px-2 py-0.5 rounded-full">Active</span>
                  </div>

                  <div className="bg-muted/40 rounded-xl p-3 mt-3 space-y-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Daily Routine
                    </p>
                    {med.routine.map((r, ri) => (
                      <div key={ri} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <RoutineIcon time={r.time} />
                          <span className="font-medium capitalize">{r.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span>{r.dose}</span>
                          {r.withFood && (
                            <span className="text-[9px] bg-accent/10 text-accent-foreground px-1.5 py-0.5 rounded-full font-medium">
                              with food
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                    <p className="text-[10px] text-muted-foreground">By {med.prescribedBy} · Since {med.startDate}</p>
                    <TagList tags={med.tags} />
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ─── TIMELINE TAB ─── */}
          <TabsContent value="timeline" className="mt-4">
            <HealthTimeline events={sampleEvents} />
          </TabsContent>
        </Tabs>
      </div>

      <FloatingActionButton actions={fabActions} />
    </div>
  );
}
