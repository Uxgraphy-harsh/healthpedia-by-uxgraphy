import { useState } from "react";
import { Search, X, FileText, Pill, Activity, StickyNote, User, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { SearchableEntityType } from "@/types/health";

interface SearchItem {
  id: string;
  entityType: SearchableEntityType;
  title: string;
  subtitle?: string;
  date?: string;
}

const searchIndex: SearchItem[] = [
  { id: "rep1", entityType: "report", title: "Complete Blood Count", subtitle: "Lab Report", date: "Mar 2, 2026" },
  { id: "rep2", entityType: "report", title: "Dr. Sharma — Endocrinology", subtitle: "Prescription", date: "Feb 28, 2026" },
  { id: "rep3", entityType: "report", title: "Thyroid Panel", subtitle: "Lab Report", date: "Jan 15, 2026" },
  { id: "med1", entityType: "medication", title: "Metformin 500mg", subtitle: "Blood Sugar Control" },
  { id: "med2", entityType: "medication", title: "Atorvastatin 10mg", subtitle: "Cholesterol Management" },
  { id: "sym1", entityType: "symptom", title: "Fatigue", subtitle: "Severity: 6/10", date: "Mar 9, 2026" },
  { id: "sym2", entityType: "symptom", title: "Headache", subtitle: "Severity: 4/10", date: "Mar 8, 2026" },
  { id: "doc1", entityType: "doctor", title: "Dr. Sharma", subtitle: "Endocrinology" },
  { id: "doc2", entityType: "doctor", title: "Dr. Mehta", subtitle: "Cardiology" },
];

const entityIcons: Record<SearchableEntityType, React.ElementType> = {
  report: FileText,
  medication: Pill,
  symptom: Activity,
  note: StickyNote,
  doctor: User,
  tracker: Activity,
};

const entityColors: Record<SearchableEntityType, string> = {
  report: "bg-primary/10 text-primary",
  medication: "bg-accent/10 text-accent-foreground",
  symptom: "bg-health-watch/10 text-health-watch",
  note: "bg-muted text-muted-foreground",
  doctor: "bg-secondary/10 text-secondary",
  tracker: "bg-health-good/10 text-health-good",
};

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");

  const results = query.trim().length > 0
    ? searchIndex.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md"
        >
          <div className="mobile-container flex flex-col h-full">
            {/* Search Bar */}
            <div className="px-5 pt-6 pb-3 flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 glass-card p-2 pr-3">
                <Search className="w-4 h-4 text-muted-foreground ml-2" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search reports, medications, symptoms..."
                  className="flex-1 bg-transparent text-sm py-2 outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <button onClick={onClose} className="text-sm font-medium text-primary">
                Cancel
              </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-5 space-y-2">
              {query.trim().length > 0 && results.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-sm">No results found for "{query}"</p>
                </div>
              )}

              {results.map((item, i) => {
                const Icon = entityIcons[item.entityType];
                const colorClass = entityColors[item.entityType];
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="glass-card p-3 w-full flex items-center gap-3 text-left"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {item.subtitle}
                        {item.date && ` · ${item.date}`}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </motion.button>
                );
              })}

              {query.trim().length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">Search across your health data</p>
                  <p className="text-xs text-muted-foreground mt-1">Reports, medications, symptoms, doctors & more</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
