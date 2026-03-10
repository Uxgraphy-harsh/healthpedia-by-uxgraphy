import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Camera, FileText, Sparkles, ChevronRight, FolderOpen,
  Pill, Clock, Sun, Moon, Sunrise, Download, Share2, Image, Plus,
  Shield, ArrowLeft
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const categories = ["All", "Lab Reports", "Prescriptions", "Imaging", "Doctor Notes"];

const sampleRecords = [
  {
    id: 1,
    type: "Lab Reports",
    title: "Complete Blood Count",
    date: "Mar 2, 2026",
    highlights: [
      { name: "HbA1c", value: "6.8%", range: "4.0-5.6%", flag: "high" as const },
      { name: "Fasting Glucose", value: "118 mg/dL", range: "70-100 mg/dL", flag: "high" as const },
      { name: "Cholesterol", value: "185 mg/dL", range: "<200 mg/dL", flag: "normal" as const },
    ],
  },
  {
    id: 2,
    type: "Prescriptions",
    title: "Dr. Sharma — Endocrinology",
    date: "Feb 28, 2026",
    highlights: [
      { name: "Metformin", value: "500mg", range: "Twice daily", flag: "normal" as const },
    ],
  },
  {
    id: 3,
    type: "Lab Reports",
    title: "Thyroid Panel",
    date: "Jan 15, 2026",
    highlights: [
      { name: "TSH", value: "3.2 mIU/L", range: "0.4-4.0 mIU/L", flag: "normal" as const },
      { name: "Free T4", value: "1.1 ng/dL", range: "0.8-1.8 ng/dL", flag: "normal" as const },
    ],
  },
];

const medicines = [
  {
    id: 1,
    name: "Metformin 500mg",
    purpose: "Blood Sugar Control",
    routine: [
      { time: "Morning", icon: Sunrise, dose: "1 tablet", withFood: true },
      { time: "Night", icon: Moon, dose: "1 tablet", withFood: true },
    ],
    prescribedBy: "Dr. Sharma",
    startDate: "Feb 28, 2026",
    active: true,
  },
  {
    id: 2,
    name: "Atorvastatin 10mg",
    purpose: "Cholesterol Management",
    routine: [
      { time: "Night", icon: Moon, dose: "1 tablet", withFood: false },
    ],
    prescribedBy: "Dr. Mehta",
    startDate: "Jan 10, 2026",
    active: true,
  },
  {
    id: 3,
    name: "Vitamin D3 60K IU",
    purpose: "Vitamin Deficiency",
    routine: [
      { time: "Morning", icon: Sun, dose: "1 sachet (weekly)", withFood: true },
    ],
    prescribedBy: "Dr. Sharma",
    startDate: "Mar 1, 2026",
    active: true,
  },
];

function RoutineIcon({ time }: { time: string }) {
  if (time === "Morning") return <Sunrise className="w-3.5 h-3.5 text-amber-500" />;
  if (time === "Night") return <Moon className="w-3.5 h-3.5 text-indigo-400" />;
  return <Sun className="w-3.5 h-3.5 text-orange-400" />;
}

export default function Vault() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? sampleRecords : sampleRecords.filter((r) => r.type === activeCategory);

  return (
    <div className="mobile-container pb-24">
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold font-serif">Health Vault</h1>
        </div>

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="w-full bg-muted/60 backdrop-blur-sm">
            <TabsTrigger value="reports" className="flex-1 text-xs gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Reports
            </TabsTrigger>
            <TabsTrigger value="medicines" className="flex-1 text-xs gap-1.5">
              <Pill className="w-3.5 h-3.5" /> Medicines
            </TabsTrigger>
          </TabsList>

          {/* ─── REPORTS TAB ─── */}
          <TabsContent value="reports" className="mt-4 space-y-4">
            {/* Upload Actions */}
            <div className="flex gap-2">
              <button className="btn-primary-gradient flex-1 text-xs py-3 flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" /> Upload Report
              </button>
              <button className="glass-card flex-1 text-xs py-3 flex items-center justify-center gap-2 font-semibold">
                <FileText className="w-4 h-4 text-primary" /> Import via ABHA
              </button>
            </div>

            <div className="flex gap-2">
              {[
                { icon: Camera, label: "Camera Scan" },
                { icon: Upload, label: "File Upload" },
                { icon: FileText, label: "Manual Entry" },
              ].map((opt) => (
                <button key={opt.label} className="glass-card flex-1 py-3 flex flex-col items-center gap-1.5">
                  <opt.icon className="w-4 h-4 text-primary" />
                  <span className="text-[10px] text-muted-foreground font-medium">{opt.label}</span>
                </button>
              ))}
            </div>

            <div className="glass-card p-3 flex items-center gap-3 border-l-4 border-accent">
              <Sparkles className="w-5 h-5 text-accent shrink-0" />
              <p className="text-xs text-muted-foreground">AI will automatically organize and extract key data from your reports.</p>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
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

            {/* Records List */}
            <div className="space-y-3">
              {filtered.map((record, i) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{record.type}</span>
                      <h3 className="font-semibold text-sm mt-1.5">{record.title}</h3>
                      <p className="text-[10px] text-muted-foreground">{record.date}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    {record.highlights.map((h) => (
                      <div key={h.name} className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">{h.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${h.flag === "high" ? "text-health-alert" : "text-foreground"}`}>
                            {h.value}
                          </span>
                          <span className="text-[10px] text-muted-foreground">({h.range})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                    <button className="text-[10px] font-medium text-primary flex items-center gap-1">
                      <FileText className="w-3 h-3" /> View Summary
                    </button>
                    <button className="text-[10px] font-medium text-primary flex items-center gap-1 ml-auto">
                      <Sparkles className="w-3 h-3" /> Ask AI
                    </button>
                  </div>
                </motion.div>
              ))}

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <FolderOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">No records in this category.</p>
                  <p className="text-xs text-muted-foreground mt-1">Upload your first report and let AI organize it.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ─── MEDICINES TAB ─── */}
          <TabsContent value="medicines" className="mt-4 space-y-4">
            {/* Add Medicine + Export */}
            <div className="flex gap-2">
              <button className="btn-primary-gradient flex-1 text-xs py-3 flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Medicine
              </button>
              <button className="glass-card flex-1 text-xs py-3 flex items-center justify-center gap-2 font-semibold">
                <Download className="w-4 h-4 text-primary" /> Export Prescription
              </button>
            </div>

            <div className="glass-card p-3 flex items-center gap-3 border-l-4 border-accent">
              <Sparkles className="w-5 h-5 text-accent shrink-0" />
              <p className="text-xs text-muted-foreground">Show this list at any medical shop — no paper prescription needed.</p>
            </div>

            {/* Active Medicines */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active Medicines ({medicines.filter(m => m.active).length})
              </p>

              {medicines.map((med, i) => (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Pill className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{med.name}</h3>
                          <p className="text-[10px] text-muted-foreground">{med.purpose}</p>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-health-good bg-health-good/10 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>

                  {/* Routine */}
                  <div className="bg-muted/40 rounded-xl p-3 mt-3 space-y-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Daily Routine
                    </p>
                    {med.routine.map((r, ri) => (
                      <div key={ri} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <RoutineIcon time={r.time} />
                          <span className="font-medium">{r.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span>{r.dose}</span>
                          {r.withFood && (
                            <span className="text-[9px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full font-medium">
                              with food
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                    <p className="text-[10px] text-muted-foreground">
                      By {med.prescribedBy} · Since {med.startDate}
                    </p>
                    <div className="flex gap-2">
                      <button className="text-[10px] font-medium text-primary flex items-center gap-1">
                        <Image className="w-3 h-3" /> Photo
                      </button>
                      <button className="text-[10px] font-medium text-primary flex items-center gap-1">
                        <Share2 className="w-3 h-3" /> Share
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Export Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-4 border border-primary/20 bg-primary/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">Export Prescription Card</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Generate a printable card with all your active medicines — perfect for pharmacy visits.
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
