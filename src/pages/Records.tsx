import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Camera, FileText, Sparkles, ChevronRight, FolderOpen } from "lucide-react";

const categories = ["All", "Lab Reports", "Prescriptions", "Imaging", "Doctor Notes"];

const sampleRecords = [
  {
    id: 1,
    type: "Lab Reports",
    title: "Complete Blood Count",
    date: "Mar 2, 2026",
    highlights: [
      { name: "HbA1c", value: "6.8%", range: "4.0-5.6%", flag: "high" },
      { name: "Fasting Glucose", value: "118 mg/dL", range: "70-100 mg/dL", flag: "high" },
      { name: "Cholesterol", value: "185 mg/dL", range: "<200 mg/dL", flag: "normal" },
    ],
  },
  {
    id: 2,
    type: "Prescriptions",
    title: "Dr. Sharma — Endocrinology",
    date: "Feb 28, 2026",
    highlights: [
      { name: "Metformin", value: "500mg", range: "Twice daily", flag: "normal" },
    ],
  },
  {
    id: 3,
    type: "Lab Reports",
    title: "Thyroid Panel",
    date: "Jan 15, 2026",
    highlights: [
      { name: "TSH", value: "3.2 mIU/L", range: "0.4-4.0 mIU/L", flag: "normal" },
      { name: "Free T4", value: "1.1 ng/dL", range: "0.8-1.8 ng/dL", flag: "normal" },
    ],
  },
];

export default function Records() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? sampleRecords : sampleRecords.filter((r) => r.type === activeCategory);

  return (
    <div className="mobile-container pb-24">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-bold font-serif mb-4">Your Medical Records</h1>

        {/* Upload Actions */}
        <div className="flex gap-2 mb-5">
          <button className="btn-primary-gradient flex-1 text-xs py-3 flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" /> Upload Report
          </button>
          <button className="glass-card flex-1 text-xs py-3 flex items-center justify-center gap-2 font-semibold">
            <FileText className="w-4 h-4 text-primary" /> Import via ABHA
          </button>
        </div>

        {/* Upload Options */}
        <div className="flex gap-2 mb-5">
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

        {/* AI Feature */}
        <div className="glass-card p-3 flex items-center gap-3 mb-5 border-l-4 border-accent">
          <Sparkles className="w-5 h-5 text-accent shrink-0" />
          <p className="text-xs text-muted-foreground">AI will automatically organize and extract key data from your reports.</p>
        </div>

        {/* Category Filter */}
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
    </div>
  );
}
