import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, X, Activity, Ruler, StickyNote, Pill, Clock, ChevronLeft,
  Sun, Moon, Sunrise, TrendingUp, TrendingDown, Minus, Tag as TagIcon,
  Heart, Droplets, Weight, Brain, Zap, Smile, Thermometer, BedDouble
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FloatingActionButton from "@/components/FloatingActionButton";
import GlobalSearch from "@/components/GlobalSearch";
import PageHeader from "@/components/PageHeader";
import HealthTimeline from "@/components/HealthTimeline";
import { TagList } from "@/components/TagBadge";
import { sampleSymptoms, sampleTrackers, sampleMedications, sampleEvents, sampleNotes, sampleTags } from "@/data/sampleData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ─── Helpers ────────────────────────────────────────────────────────────────────

const severityColor = (s: number) => {
  if (s <= 3) return "bg-health-good/20 text-health-good";
  if (s <= 6) return "bg-health-watch/20 text-health-watch";
  return "bg-health-alert/20 text-health-alert";
};
const severityLabel = (s: number) => (s <= 3 ? "Low" : s <= 6 ? "Medium" : "High");

const commonSymptoms = ["Headache", "Fatigue", "Dizziness", "Nausea", "Pain", "Fever", "Cough", "Insomnia"];

const measurementTypes = [
  { key: "blood_sugar", label: "Blood Sugar", unit: "mg/dL", icon: Droplets },
  { key: "blood_pressure", label: "Blood Pressure", unit: "mmHg", icon: Heart },
  { key: "weight", label: "Weight", unit: "kg", icon: Weight },
  { key: "heart_rate", label: "Heart Rate", unit: "bpm", icon: Heart },
  { key: "sleep", label: "Sleep Duration", unit: "hrs", icon: BedDouble },
  { key: "mood", label: "Mood", unit: "/10", icon: Smile },
  { key: "energy", label: "Energy Level", unit: "/10", icon: Zap },
  { key: "temperature", label: "Temperature", unit: "°F", icon: Thermometer },
];

const noteCategories = ["General health note", "Side effect", "Allergy reaction", "Stressful event", "Doctor advice"];

function RoutineIcon({ time }: { time: string }) {
  if (time === "morning") return <Sunrise className="w-3.5 h-3.5 text-health-watch" />;
  if (time === "night") return <Moon className="w-3.5 h-3.5 text-primary" />;
  return <Sun className="w-3.5 h-3.5 text-health-watch" />;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

// ─── Chart Data Generation ──────────────────────────────────────────────────────

function generateChartData(type: string, range: "daily" | "weekly" | "monthly") {
  const points = range === "daily" ? 7 : range === "weekly" ? 4 : 6;
  const labels = range === "daily"
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : range === "weekly"
      ? ["Week 1", "Week 2", "Week 3", "Week 4"]
      : ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

  const baseValues: Record<string, number> = { blood_sugar: 110, blood_pressure: 120, weight: 62, heart_rate: 72, temperature: 98.2 };
  const base = baseValues[type] || 100;
  const variance = type === "weight" ? 1 : type === "temperature" ? 0.5 : 8;

  return labels.slice(0, points).map((label) => ({
    label,
    value: Math.round((base + (Math.random() - 0.5) * variance * 2) * 10) / 10,
  }));
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function EmptyState({ message, suggestions }: {
  message: string;
  suggestions: { label: string; onClick: () => void }[];
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 px-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Activity className="w-8 h-8 text-primary" />
      </div>
      <p className="text-sm font-medium text-foreground mb-1">{message}</p>
      <p className="text-xs text-muted-foreground mb-6">Start building your health history.</p>
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <button key={s.label} onClick={s.onClick} className="glass-card px-4 py-2 text-xs font-medium text-primary">
            {s.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function TagSelector({ selectedTags, onToggle }: { selectedTags: string[]; onToggle: (id: string) => void }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
        <TagIcon className="w-3 h-3" /> Tags (optional)
      </p>
      <div className="flex flex-wrap gap-1.5">
        {sampleTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onToggle(tag.id)}
            className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-all ${
              selectedTags.includes(tag.id)
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 text-muted-foreground"
            }`}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function Track() {
  const [activeTab, setActiveTab] = useState("symptoms");
  const [searchOpen, setSearchOpen] = useState(false);

  // Form visibility
  const [showSymptomForm, setShowSymptomForm] = useState(false);
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [showMedForm, setShowMedForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

  // Symptom form
  const [symptomForm, setSymptomForm] = useState({ name: "", severity: 5, notes: "" });
  const [symptomTags, setSymptomTags] = useState<string[]>([]);

  // Measurement form
  const [measurementType, setMeasurementType] = useState("blood_sugar");
  const [measurementValue, setMeasurementValue] = useState("");
  const [measurementNote, setMeasurementNote] = useState("");
  const [measurementTags, setMeasurementTags] = useState<string[]>([]);

  // Medication form
  const [medForm, setMedForm] = useState({ name: "", dosage: "", note: "" });
  const [medTags, setMedTags] = useState<string[]>([]);

  // Note form
  const [noteForm, setNoteForm] = useState({ category: "General health note", title: "", description: "" });
  const [noteTags, setNoteTags] = useState<string[]>([]);

  // Graph
  const [chartRange, setChartRange] = useState<"daily" | "weekly" | "monthly">("daily");
  const [chartType, setChartType] = useState("blood_sugar");

  // Detail view
  const [detailItem, setDetailItem] = useState<any>(null);
  const [detailType, setDetailType] = useState<string>("");

  const toggleTag = (set: React.Dispatch<React.SetStateAction<string[]>>) => (id: string) => {
    set((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
  };

  const selectedMeasurement = measurementTypes.find((m) => m.key === measurementType)!;
  const chartData = generateChartData(chartType, chartRange);

  const fabActions = [
    { icon: Activity, label: "Log Symptom", onClick: () => { setActiveTab("symptoms"); setShowSymptomForm(true); } },
    { icon: Ruler, label: "Record Measurement", onClick: () => { setActiveTab("measurements"); setShowMeasurementForm(true); } },
    { icon: Pill, label: "Add Medication Log", onClick: () => { setActiveTab("medications"); setShowMedForm(true); } },
    { icon: StickyNote, label: "Add Health Note", onClick: () => { setActiveTab("notes"); setShowNoteForm(true); } },
  ];

  // ─── Detail Overlay ─────────────────────────────────────────────────────────
  if (detailItem) {
    return (
      <div className="mobile-container pb-24">
        <div className="px-5 pt-6">
          <button onClick={() => setDetailItem(null)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-elevated p-5 space-y-4">
            {detailType === "symptom" && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold font-serif">{detailItem.name}</h2>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${severityColor(detailItem.severity)}`}>
                    {severityLabel(detailItem.severity)} ({detailItem.severity}/10)
                  </span>
                </div>
                {detailItem.notes && <p className="text-sm text-muted-foreground">{detailItem.notes}</p>}
                <p className="text-xs text-muted-foreground">{formatDate(detailItem.loggedAt)}</p>
                <TagList tags={detailItem.tags} />
              </>
            )}
            {detailType === "measurement" && (
              <>
                <h2 className="text-lg font-semibold font-serif capitalize">{detailItem.measurementType.replace(/_/g, " ")}</h2>
                <p className="text-3xl font-bold">{detailItem.value} <span className="text-sm font-normal text-muted-foreground">{detailItem.unit}</span></p>
                {detailItem.notes && <p className="text-sm text-muted-foreground">{detailItem.notes}</p>}
                <p className="text-xs text-muted-foreground">{formatDate(detailItem.recordedAt)}</p>
                <TagList tags={detailItem.tags} />
              </>
            )}
            {detailType === "medication" && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Pill className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold font-serif">{detailItem.name}</h2>
                    <p className="text-xs text-muted-foreground">{detailItem.purpose}</p>
                  </div>
                </div>
                <div className="bg-muted/40 rounded-xl p-3 space-y-2">
                  {detailItem.routine.map((r: any, ri: number) => (
                    <div key={ri} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <RoutineIcon time={r.time} />
                        <span className="font-medium capitalize">{r.time}</span>
                      </div>
                      <span className="text-muted-foreground">{r.dose} {r.withFood ? "· with food" : ""}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">By {detailItem.prescribedBy} · Since {detailItem.startDate}</p>
                <TagList tags={detailItem.tags} />
              </>
            )}
            {detailType === "note" && (
              <>
                <h2 className="text-lg font-semibold font-serif">Health Note</h2>
                <p className="text-sm text-foreground leading-relaxed">{detailItem.content}</p>
                <p className="text-xs text-muted-foreground">{formatDate(detailItem.createdAt)}</p>
                <TagList tags={detailItem.tags} />
              </>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-muted/60 backdrop-blur-sm">
            <TabsTrigger value="symptoms" className="flex-1 text-[10px] gap-1">
              <Activity className="w-3.5 h-3.5" /> Symptoms
            </TabsTrigger>
            <TabsTrigger value="measurements" className="flex-1 text-[10px] gap-1">
              <Ruler className="w-3.5 h-3.5" /> Measures
            </TabsTrigger>
            <TabsTrigger value="medications" className="flex-1 text-[10px] gap-1">
              <Pill className="w-3.5 h-3.5" /> Meds
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex-1 text-[10px] gap-1">
              <StickyNote className="w-3.5 h-3.5" /> Notes
            </TabsTrigger>
          </TabsList>

          {/* ═══════════════════════════ SYMPTOMS ═══════════════════════════ */}
          <TabsContent value="symptoms" className="mt-4 space-y-4">
            <AnimatePresence>
              {showSymptomForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="glass-card-elevated p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm font-serif">Log a Symptom</h3>
                      <button onClick={() => setShowSymptomForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
                    </div>

                    {/* Quick symptom suggestions */}
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Common symptoms</p>
                      <div className="flex flex-wrap gap-1.5">
                        {commonSymptoms.map((s) => (
                          <button
                            key={s}
                            onClick={() => setSymptomForm({ ...symptomForm, name: s })}
                            className={`text-[11px] px-3 py-1.5 rounded-full font-medium transition-all ${
                              symptomForm.name === s ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      placeholder="Or type a custom symptom..."
                      value={symptomForm.name}
                      onChange={(e) => setSymptomForm({ ...symptomForm, name: e.target.value })}
                      className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none"
                    />

                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-muted-foreground">Severity</span>
                        <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${severityColor(symptomForm.severity)}`}>
                          {symptomForm.severity}/10 — {severityLabel(symptomForm.severity)}
                        </span>
                      </div>
                      <input
                        type="range" min={0} max={10}
                        value={symptomForm.severity}
                        onChange={(e) => setSymptomForm({ ...symptomForm, severity: Number(e.target.value) })}
                        className="w-full accent-primary"
                      />
                      <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
                        <span>None</span><span>Severe</span>
                      </div>
                    </div>

                    <textarea
                      placeholder="Notes (optional)"
                      value={symptomForm.notes}
                      onChange={(e) => setSymptomForm({ ...symptomForm, notes: e.target.value })}
                      rows={2}
                      className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none resize-none"
                    />

                    <TagSelector selectedTags={symptomTags} onToggle={toggleTag(setSymptomTags)} />

                    <button className="btn-primary-gradient w-full text-sm py-3">Save Symptom</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!showSymptomForm && (
              <button onClick={() => setShowSymptomForm(true)} className="glass-card p-3 w-full flex items-center gap-3 text-sm text-primary font-medium">
                <Plus className="w-4 h-4" /> Log a new symptom
              </button>
            )}

            {sampleSymptoms.length === 0 ? (
              <EmptyState message="No symptoms logged yet" suggestions={[{ label: "Log your first symptom", onClick: () => setShowSymptomForm(true) }]} />
            ) : (
              <div>
                <h2 className="text-sm font-semibold mb-3 font-serif">History</h2>
                <div className="space-y-3">
                  {sampleSymptoms.map((log, i) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => { setDetailItem(log); setDetailType("symptom"); }}
                      className="glass-card p-4 cursor-pointer active:scale-[0.98] transition-transform"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="font-semibold text-sm">{log.name}</h3>
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${severityColor(log.severity)}`}>
                          {severityLabel(log.severity)}
                        </span>
                      </div>
                      {log.notes && <p className="text-xs text-muted-foreground line-clamp-1">{log.notes}</p>}
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-[10px] text-muted-foreground">{formatDate(log.loggedAt)}</p>
                        <TagList tags={log.tags} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* ═══════════════════════════ MEASUREMENTS ═══════════════════════════ */}
          <TabsContent value="measurements" className="mt-4 space-y-4">
            <AnimatePresence>
              {showMeasurementForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="glass-card-elevated p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm font-serif">Record Measurement</h3>
                      <button onClick={() => setShowMeasurementForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
                    </div>

                    {/* Measurement type grid */}
                    <div className="grid grid-cols-4 gap-2">
                      {measurementTypes.map((m) => {
                        const Icon = m.icon;
                        return (
                          <button
                            key={m.key}
                            onClick={() => setMeasurementType(m.key)}
                            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-[10px] font-medium transition-all ${
                              measurementType === m.key
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/50 text-muted-foreground"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {m.label.split(" ")[0]}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-3">
                      <input
                        placeholder="Value"
                        type="number"
                        value={measurementValue}
                        onChange={(e) => setMeasurementValue(e.target.value)}
                        className="flex-1 bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none"
                      />
                      <div className="w-20 bg-muted/50 px-3 py-3 text-sm rounded-xl flex items-center justify-center text-muted-foreground">
                        {selectedMeasurement.unit}
                      </div>
                    </div>

                    <textarea
                      placeholder="Notes (optional)"
                      value={measurementNote}
                      onChange={(e) => setMeasurementNote(e.target.value)}
                      rows={2}
                      className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none resize-none"
                    />

                    <TagSelector selectedTags={measurementTags} onToggle={toggleTag(setMeasurementTags)} />

                    <button className="btn-primary-gradient w-full text-sm py-3">Save Measurement</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!showMeasurementForm && (
              <button onClick={() => setShowMeasurementForm(true)} className="glass-card p-3 w-full flex items-center gap-3 text-sm text-primary font-medium">
                <Plus className="w-4 h-4" /> Record a measurement
              </button>
            )}

            {/* Graph View */}
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold font-serif">Trends</h3>
                <div className="flex gap-1">
                  {(["daily", "weekly", "monthly"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setChartRange(r)}
                      className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-all ${
                        chartRange === r ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart type selector */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {measurementTypes.slice(0, 5).map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setChartType(m.key)}
                    className={`text-[10px] px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                      chartType === m.key ? "bg-secondary text-secondary-foreground" : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" width={40} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* History */}
            {sampleTrackers.length === 0 ? (
              <EmptyState message="No measurements yet" suggestions={[{ label: "Record your first measurement", onClick: () => setShowMeasurementForm(true) }]} />
            ) : (
              <div>
                <h2 className="text-sm font-semibold mb-3 font-serif">History</h2>
                <div className="space-y-3">
                  {sampleTrackers.map((tracker, i) => (
                    <motion.div
                      key={tracker.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => { setDetailItem(tracker); setDetailType("measurement"); }}
                      className="glass-card p-4 cursor-pointer active:scale-[0.98] transition-transform"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm capitalize">{tracker.measurementType.replace(/_/g, " ")}</h3>
                        <span className="text-lg font-bold">
                          {tracker.value} <span className="text-xs font-normal text-muted-foreground">{tracker.unit}</span>
                        </span>
                      </div>
                      {tracker.notes && <p className="text-xs text-muted-foreground">{tracker.notes}</p>}
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-[10px] text-muted-foreground">{formatDate(tracker.recordedAt)}</p>
                        <TagList tags={tracker.tags} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* ═══════════════════════════ MEDICATIONS ═══════════════════════════ */}
          <TabsContent value="medications" className="mt-4 space-y-4">
            <AnimatePresence>
              {showMedForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="glass-card-elevated p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm font-serif">Log Medication Taken</h3>
                      <button onClick={() => setShowMedForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
                    </div>

                    {/* Quick select from existing meds */}
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Your medications</p>
                      <div className="flex flex-wrap gap-1.5">
                        {sampleMedications.filter((m) => m.active).map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setMedForm({ ...medForm, name: m.name, dosage: m.dosage })}
                            className={`text-[11px] px-3 py-1.5 rounded-full font-medium transition-all ${
                              medForm.name === m.name ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground"
                            }`}
                          >
                            {m.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      placeholder="Medication name"
                      value={medForm.name}
                      onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                      className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none"
                    />
                    <input
                      placeholder="Dosage (e.g., 500mg)"
                      value={medForm.dosage}
                      onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })}
                      className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none"
                    />
                    <textarea
                      placeholder="Notes (optional)"
                      value={medForm.note}
                      onChange={(e) => setMedForm({ ...medForm, note: e.target.value })}
                      rows={2}
                      className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none resize-none"
                    />

                    <TagSelector selectedTags={medTags} onToggle={toggleTag(setMedTags)} />

                    <button className="btn-primary-gradient w-full text-sm py-3">Save Log</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!showMedForm && (
              <button onClick={() => setShowMedForm(true)} className="glass-card p-3 w-full flex items-center gap-3 text-sm text-primary font-medium">
                <Plus className="w-4 h-4" /> Log medication taken
              </button>
            )}

            {/* Active medications list */}
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Active Medications ({sampleMedications.filter((m) => m.active).length})
              </p>
              <div className="space-y-3">
                {sampleMedications.map((med, i) => (
                  <motion.div
                    key={med.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => { setDetailItem(med); setDetailType("medication"); }}
                    className="glass-card p-4 cursor-pointer active:scale-[0.98] transition-transform"
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

                    <div className="bg-muted/40 rounded-xl p-3 space-y-1.5">
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

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                      <p className="text-[10px] text-muted-foreground">By {med.prescribedBy} · Since {med.startDate}</p>
                      <TagList tags={med.tags} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ═══════════════════════════ NOTES ═══════════════════════════ */}
          <TabsContent value="notes" className="mt-4 space-y-4">
            <AnimatePresence>
              {showNoteForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="glass-card-elevated p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm font-serif">Add Health Note</h3>
                      <button onClick={() => setShowNoteForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
                    </div>

                    {/* Category selector */}
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Category</p>
                      <div className="flex flex-wrap gap-1.5">
                        {noteCategories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setNoteForm({ ...noteForm, category: cat })}
                            className={`text-[10px] px-3 py-1.5 rounded-full font-medium transition-all ${
                              noteForm.category === cat ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      placeholder="Note title (optional)"
                      value={noteForm.title}
                      onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                      className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none"
                    />
                    <textarea
                      placeholder="Describe your health observation..."
                      value={noteForm.description}
                      onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
                      rows={4}
                      className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none resize-none"
                    />

                    <TagSelector selectedTags={noteTags} onToggle={toggleTag(setNoteTags)} />

                    <button className="btn-primary-gradient w-full text-sm py-3">Save Note</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!showNoteForm && (
              <button onClick={() => setShowNoteForm(true)} className="glass-card p-3 w-full flex items-center gap-3 text-sm text-primary font-medium">
                <Plus className="w-4 h-4" /> Add a health note
              </button>
            )}

            {sampleNotes.length === 0 ? (
              <EmptyState message="No health notes yet" suggestions={[{ label: "Add your first note", onClick: () => setShowNoteForm(true) }]} />
            ) : (
              <div>
                <h2 className="text-sm font-semibold mb-3 font-serif">History</h2>
                <div className="space-y-3">
                  {sampleNotes.map((note, i) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => { setDetailItem(note); setDetailType("note"); }}
                      className="glass-card p-4 cursor-pointer active:scale-[0.98] transition-transform"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                          <StickyNote className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground line-clamp-2 leading-relaxed">{note.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-[10px] text-muted-foreground">{formatDate(note.createdAt)}</p>
                            <TagList tags={note.tags} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <FloatingActionButton actions={fabActions} />
    </div>
  );
}
