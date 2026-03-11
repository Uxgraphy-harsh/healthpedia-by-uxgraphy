import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Camera, FileText, Sparkles, ChevronRight, ChevronLeft, FolderOpen,
  Download, Shield, X, Search, Image, Trash2, Edit3, ZoomIn, ZoomOut,
  Filter, Calendar, Tag as TagIcon, Plus, Eye
} from "lucide-react";
import FloatingActionButton from "@/components/FloatingActionButton";
import GlobalSearch from "@/components/GlobalSearch";
import PageHeader from "@/components/PageHeader";
import { TagList } from "@/components/TagBadge";
import { PrivacyBanner, SecureBadge } from "@/components/PrivacyBadge";
import { sampleReports, sampleTags } from "@/data/sampleData";
import type { Report, Tag } from "@/types/health";

// ─── Constants ──────────────────────────────────────────────────────────────────

const categoryConfig: Record<string, { label: string; icon: React.ElementType }> = {
  lab_report: { label: "Blood Tests", icon: FileText },
  imaging: { label: "Scans & Imaging", icon: Eye },
  prescription: { label: "Prescriptions", icon: FileText },
  doctor_notes: { label: "Doctor Notes", icon: Edit3 },
  other: { label: "Other Documents", icon: FolderOpen },
};

const filterCategories = [
  { key: "all", label: "All" },
  ...Object.entries(categoryConfig).map(([key, { label }]) => ({ key, label })),
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatShortDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

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

export default function Records() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Upload form
  const [uploadForm, setUploadForm] = useState({ title: "", category: "lab_report", date: "", note: "" });
  const [uploadTags, setUploadTags] = useState<string[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Edit form
  const [editForm, setEditForm] = useState({ title: "", category: "", note: "" });
  const [editTags, setEditTags] = useState<string[]>([]);

  const toggleTag = (set: React.Dispatch<React.SetStateAction<string[]>>) => (id: string) => {
    set((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
  };

  // Filtering & search
  const filtered = sampleReports.filter((r) => {
    const matchesCategory = activeCategory === "all" || r.type === activeCategory;
    const matchesSearch = !searchQuery || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.label.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const recentReports = sampleReports.slice(0, 3);

  const categoryCounts = Object.keys(categoryConfig).reduce((acc, key) => {
    acc[key] = sampleReports.filter((r) => r.type === key).length;
    return acc;
  }, {} as Record<string, number>);

  const fabActions = [
    { icon: Upload, label: "Upload File", onClick: () => { setShowUploadForm(true); } },
    { icon: Camera, label: "Take Photo", onClick: () => cameraInputRef.current?.click() },
    { icon: Image, label: "Upload Image", onClick: () => imageInputRef.current?.click() },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setUploadForm({ ...uploadForm, title: file.name.replace(/\.[^/.]+$/, "") });
      setShowUploadForm(true);
    }
  };

  const openReportDetail = (report: Report) => {
    setSelectedReport(report);
    setEditForm({ title: report.title, category: report.type, note: "" });
    setEditTags(report.tags.map((t) => t.id));
    setZoom(1);
    setIsEditing(false);
  };

  // ─── Report Detail View ───────────────────────────────────────────────────
  if (selectedReport) {
    return (
      <div className="mobile-container pb-24">
        <div className="px-5 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setSelectedReport(null)} className="flex items-center gap-2 text-sm text-muted-foreground">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsEditing(!isEditing)} className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          </div>

          {/* Document Preview */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-elevated overflow-hidden mb-4">
            <div className="bg-muted/30 h-64 flex items-center justify-center relative">
              <div style={{ transform: `scale(${zoom})` }} className="transition-transform">
                <FileText className="w-16 h-16 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground mt-2 text-center">Document Preview</p>
              </div>
              {/* Zoom controls */}
              <div className="absolute bottom-3 right-3 flex gap-1">
                <button onClick={() => setZoom(Math.max(0.5, zoom - 0.25))} className="w-8 h-8 rounded-lg bg-card/80 backdrop-blur-sm flex items-center justify-center border border-border/50">
                  <ZoomOut className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button onClick={() => setZoom(Math.min(3, zoom + 0.25))} className="w-8 h-8 rounded-lg bg-card/80 backdrop-blur-sm flex items-center justify-center border border-border/50">
                  <ZoomIn className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Metadata / Edit */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 space-y-4">
            {isEditing ? (
              <>
                <h3 className="text-sm font-semibold font-serif">Edit Report Details</h3>
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none"
                  placeholder="Report title"
                />
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none"
                >
                  {Object.entries(categoryConfig).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <textarea
                  value={editForm.note}
                  onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                  placeholder="Notes (optional)"
                  rows={2}
                  className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none resize-none"
                />
                <TagSelector selectedTags={editTags} onToggle={toggleTag(setEditTags)} />
                <div className="flex gap-2">
                  <button className="btn-primary-gradient flex-1 text-sm py-3">Save Changes</button>
                  <button onClick={() => setIsEditing(false)} className="glass-card flex-1 text-sm py-3 font-semibold">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold font-serif">{selectedReport.title}</h2>
                  <SecureBadge />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full capitalize">
                    {selectedReport.type.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDate(selectedReport.date)}</span>
                </div>

                {/* Highlights */}
                {selectedReport.highlights.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Key Findings</p>
                    {selectedReport.highlights.map((h) => (
                      <div key={h.name} className="flex justify-between items-center text-xs bg-muted/30 rounded-xl px-3 py-2.5">
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
                )}

                <TagList tags={selectedReport.tags} />
              </>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── Main List View ───────────────────────────────────────────────────────
  return (
    <div className="mobile-container pb-24">
      <PageHeader
        title="Health Records"
        subtitle="Your medical documents vault"
        icon={FileText}
        onSearch={() => setSearchOpen(true)}
      />

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFileSelect} />
      <input ref={cameraInputRef} type="file" className="hidden" accept="image/*" capture="environment" onChange={handleFileSelect} />
      <input ref={imageInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />

      <div className="px-5 space-y-5 mt-2">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search reports, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              showFilters ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Filter chips */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {filterCategories.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setActiveCategory(c.key)}
                    className={`shrink-0 px-3.5 py-2 rounded-full text-[11px] font-medium transition-all ${
                      activeCategory === c.key ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Form */}
        <AnimatePresence>
          {showUploadForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="glass-card-elevated p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm font-serif">Upload Report</h3>
                  <button onClick={() => { setShowUploadForm(false); setUploadFile(null); }}>
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* File selection area */}
                {!uploadFile ? (
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center space-y-3">
                    <Upload className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                    <p className="text-xs text-muted-foreground">Choose how to upload</p>
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => fileInputRef.current?.click()} className="text-[11px] px-3 py-2 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-1.5">
                        <Upload className="w-3 h-3" /> File
                      </button>
                      <button onClick={() => cameraInputRef.current?.click()} className="text-[11px] px-3 py-2 rounded-xl bg-muted/60 text-muted-foreground font-medium flex items-center gap-1.5">
                        <Camera className="w-3 h-3" /> Camera
                      </button>
                      <button onClick={() => imageInputRef.current?.click()} className="text-[11px] px-3 py-2 rounded-xl bg-muted/60 text-muted-foreground font-medium flex items-center gap-1.5">
                        <Image className="w-3 h-3" /> Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{uploadFile.name}</p>
                      <p className="text-[10px] text-muted-foreground">{(uploadFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button onClick={() => setUploadFile(null)}>
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                )}

                <input
                  placeholder="Report title"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none"
                />

                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none"
                >
                  {Object.entries(categoryConfig).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>

                <input
                  type="date"
                  value={uploadForm.date}
                  onChange={(e) => setUploadForm({ ...uploadForm, date: e.target.value })}
                  className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none"
                />

                <textarea
                  placeholder="Notes (optional)"
                  value={uploadForm.note}
                  onChange={(e) => setUploadForm({ ...uploadForm, note: e.target.value })}
                  rows={2}
                  className="w-full bg-muted/50 px-4 py-3 text-sm rounded-xl outline-none resize-none"
                />

                <TagSelector selectedTags={uploadTags} onToggle={toggleTag(setUploadTags)} />

                <button className="btn-primary-gradient w-full text-sm py-3">Upload Report</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Reports */}
        {!searchQuery && activeCategory === "all" && (
          <>
            <div>
              <h2 className="text-sm font-semibold font-serif mb-3">Recent Reports</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {recentReports.map((report, i) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => openReportDetail(report)}
                    className="glass-card p-3.5 min-w-[160px] max-w-[180px] shrink-0 cursor-pointer active:scale-[0.97] transition-transform"
                  >
                    <div className="w-full h-20 rounded-lg bg-muted/30 flex items-center justify-center mb-2.5">
                      <FileText className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                    <h3 className="text-xs font-semibold line-clamp-1">{report.title}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{formatShortDate(report.date)}</p>
                    <span className="text-[9px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1.5 inline-block capitalize">
                      {report.type.replace(/_/g, " ")}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h2 className="text-sm font-semibold font-serif mb-3">Categories</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.entries(categoryConfig).map(([key, { label, icon: Icon }], i) => (
                  <motion.button
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => { setActiveCategory(key); setShowFilters(true); }}
                    className="glass-card p-4 text-left active:scale-[0.97] transition-transform"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-lg font-bold text-foreground">{categoryCounts[key] || 0}</span>
                    </div>
                    <p className="text-xs font-medium">{label}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* All / Filtered Reports */}
        <div>
          <h2 className="text-sm font-semibold font-serif mb-3">
            {searchQuery ? "Search Results" : activeCategory !== "all" ? categoryConfig[activeCategory]?.label || "Reports" : "All Reports"}
            <span className="text-muted-foreground font-normal ml-1.5">({filtered.length})</span>
          </h2>

          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 px-6">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">No medical reports yet</p>
              <p className="text-xs text-muted-foreground mb-6">Start building your health records.</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button onClick={() => setShowUploadForm(true)} className="glass-card px-4 py-2 text-xs font-medium text-primary flex items-center gap-1.5">
                  <Upload className="w-3 h-3" /> Upload your first report
                </button>
                <button onClick={() => cameraInputRef.current?.click()} className="glass-card px-4 py-2 text-xs font-medium text-primary flex items-center gap-1.5">
                  <Camera className="w-3 h-3" /> Take a photo
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filtered.map((record, i) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => openReportDetail(record)}
                  className="glass-card p-4 cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-muted-foreground/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm truncate pr-2">{record.title}</h3>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">
                          {record.type.replace(/_/g, " ")}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{formatDate(record.date)}</span>
                      </div>

                      {/* Quick highlights preview */}
                      {record.highlights.length > 0 && (
                        <div className="flex gap-3 mb-2">
                          {record.highlights.slice(0, 2).map((h) => (
                            <span key={h.name} className="text-[10px] text-muted-foreground">
                              {h.name}: <span className={`font-semibold ${h.flag === "high" ? "text-health-alert" : h.flag === "low" ? "text-health-watch" : "text-foreground"}`}>{h.value}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      <TagList tags={record.tags} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <FloatingActionButton actions={fabActions} />
    </div>
  );
}
