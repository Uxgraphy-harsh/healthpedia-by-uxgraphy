import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload, Camera, FileText, Sparkles, ChevronRight, FolderOpen,
  Download, Shield
} from "lucide-react";
import FloatingActionButton from "@/components/FloatingActionButton";
import GlobalSearch from "@/components/GlobalSearch";
import PageHeader from "@/components/PageHeader";
import { TagList } from "@/components/TagBadge";
import { PrivacyBanner, SecureBadge } from "@/components/PrivacyBadge";
import { sampleReports } from "@/data/sampleData";

const categoryLabels: Record<string, string> = {
  all: "All",
  lab_report: "Lab Reports",
  prescription: "Prescriptions",
  imaging: "Imaging",
  doctor_notes: "Doctor Notes",
};

const categories = Object.keys(categoryLabels);

export default function Records() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchOpen, setSearchOpen] = useState(false);

  const filtered = activeCategory === "all"
    ? sampleReports
    : sampleReports.filter((r) => r.type === activeCategory);

  const fabActions = [
    { icon: Upload, label: "Upload Report", onClick: () => {} },
    { icon: Camera, label: "Scan with Camera", onClick: () => {} },
    { icon: FileText, label: "Manual Entry", onClick: () => {} },
  ];

  return (
    <div className="mobile-container pb-24">
      <PageHeader
        title="Health Records"
        subtitle="Your medical documents & reports"
        icon={FileText}
        onSearch={() => setSearchOpen(true)}
      />

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="px-5 space-y-4 mt-2">
        {/* Privacy */}
        <PrivacyBanner />

        {/* Upload Actions */}
        <div className="flex gap-2">
          <button className="btn-primary-gradient flex-1 text-xs py-3 flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" /> Upload Report
          </button>
          <button className="glass-card flex-1 text-xs py-3 flex items-center justify-center gap-2 font-semibold">
            <FileText className="w-4 h-4 text-primary" /> Import via ABHA
          </button>
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
              {categoryLabels[c]}
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
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">
                      {record.type.replace(/_/g, " ")}
                    </span>
                    <SecureBadge />
                  </div>
                  <h3 className="font-semibold text-sm mt-1.5">{record.title}</h3>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(record.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                {record.highlights.map((h) => (
                  <div key={h.name} className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{h.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${h.flag === "high" ? "text-health-alert" : h.flag === "low" ? "text-health-watch" : "text-foreground"}`}>
                        {h.value}
                      </span>
                      <span className="text-[10px] text-muted-foreground">({h.range})</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                <div className="flex gap-2">
                  <button className="text-[10px] font-medium text-primary flex items-center gap-1">
                    <FileText className="w-3 h-3" /> View Summary
                  </button>
                  <button className="text-[10px] font-medium text-primary flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Ask AI
                  </button>
                </div>
                <TagList tags={record.tags} />
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

      <FloatingActionButton actions={fabActions} />
    </div>
  );
}
