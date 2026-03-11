import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pill, Activity, Ruler, FileText, Calendar, StickyNote, Check, Clock,
  Search, ChevronLeft, X, Filter, ArrowUp
} from "lucide-react";
import type { HealthEvent, HealthEventType } from "@/types/health";
import { TagList } from "@/components/TagBadge";
import { sampleEvents, sampleSymptoms, sampleTrackers, sampleMedications, sampleReports, sampleNotes } from "@/data/sampleData";
import { useNavigate } from "react-router-dom";

// ─── Expand sample events with more data ────────────────────────────────────────

const allEvents: HealthEvent[] = [
  ...sampleEvents,
  // Add note events from sampleNotes
  ...sampleNotes.map((n, i) => ({
    id: `note-ev-${i}`,
    type: "note_added" as HealthEventType,
    timestamp: n.createdAt,
    title: "Health note added",
    description: n.content.slice(0, 80) + (n.content.length > 80 ? "..." : ""),
    tags: n.tags,
    linkedEntityId: n.id,
    linkedEntityType: "note",
  })),
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

// ─── Config ─────────────────────────────────────────────────────────────────────

const eventIcons: Record<HealthEventType, React.ElementType> = {
  medication_taken: Pill,
  symptom_logged: Activity,
  measurement_recorded: Ruler,
  report_uploaded: FileText,
  appointment: Calendar,
  note_added: StickyNote,
  allergy_added: Activity,
  reminder_completed: Check,
};

const eventColors: Record<HealthEventType, string> = {
  medication_taken: "bg-primary/10 text-primary",
  symptom_logged: "bg-health-watch/10 text-health-watch",
  measurement_recorded: "bg-accent/10 text-accent-foreground",
  report_uploaded: "bg-secondary/10 text-secondary",
  appointment: "bg-health-good/10 text-health-good",
  note_added: "bg-muted text-muted-foreground",
  allergy_added: "bg-health-alert/10 text-health-alert",
  reminder_completed: "bg-health-good/10 text-health-good",
};

const eventTypeLabels: Record<HealthEventType, string> = {
  medication_taken: "Medication",
  symptom_logged: "Symptom",
  measurement_recorded: "Measurement",
  report_uploaded: "Report",
  appointment: "Appointment",
  note_added: "Note",
  allergy_added: "Allergy",
  reminder_completed: "Reminder",
};

const filterTypes: { key: HealthEventType; label: string; icon: React.ElementType }[] = [
  { key: "symptom_logged", label: "Symptoms", icon: Activity },
  { key: "measurement_recorded", label: "Measurements", icon: Ruler },
  { key: "medication_taken", label: "Medications", icon: Pill },
  { key: "report_uploaded", label: "Reports", icon: FileText },
  { key: "note_added", label: "Notes", icon: StickyNote },
  { key: "appointment", label: "Appointments", icon: Calendar },
  { key: "reminder_completed", label: "Reminders", icon: Check },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function formatDateHeader(timestamp: string) {
  const d = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}

function groupByDate(events: HealthEvent[]): [string, HealthEvent[]][] {
  const groups: Record<string, HealthEvent[]> = {};
  for (const event of events) {
    const dateKey = new Date(event.timestamp).toDateString();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(event);
  }
  return Object.entries(groups).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function Timeline() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<HealthEventType>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<HealthEvent | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);

  const toggleFilter = (type: HealthEventType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  // Filter & search
  const filteredEvents = allEvents.filter((e) => {
    if (activeFilters.size > 0 && !activeFilters.has(e.type)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.tags.some((t) => t.label.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const grouped = groupByDate(visibleEvents);
  const hasMore = visibleCount < filteredEvents.length;

  // Event type counts
  const typeCounts = allEvents.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // ─── Detail View ──────────────────────────────────────────────────────────
  if (selectedEvent) {
    const Icon = eventIcons[selectedEvent.type];
    const colorClass = eventColors[selectedEvent.type];

    return (
      <div className="mobile-container pb-24">
        <div className="px-5 pt-6">
          <button onClick={() => setSelectedEvent(null)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <ChevronLeft className="w-4 h-4" /> Back to Timeline
          </button>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-elevated p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1 inline-block ${colorClass}`}>
                  {eventTypeLabels[selectedEvent.type]}
                </span>
                <h2 className="text-lg font-semibold font-serif">{selectedEvent.title}</h2>
              </div>
            </div>

            {selectedEvent.description && (
              <p className="text-sm text-foreground leading-relaxed">{selectedEvent.description}</p>
            )}

            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-3 h-3" /> Time</span>
                <span className="font-medium">{formatTime(selectedEvent.timestamp)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Date</span>
                <span className="font-medium">
                  {new Date(selectedEvent.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              {selectedEvent.linkedEntityType && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5"><FileText className="w-3 h-3" /> Source</span>
                  <span className="font-medium capitalize">{selectedEvent.linkedEntityType}</span>
                </div>
              )}
            </div>

            {selectedEvent.notes && (
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Notes</p>
                <p className="text-sm text-foreground">{selectedEvent.notes}</p>
              </div>
            )}

            {selectedEvent.tags.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tags</p>
                <TagList tags={selectedEvent.tags} />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── Main Timeline View ───────────────────────────────────────────────────
  return (
    <div className="mobile-container pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-xl font-bold font-serif">Health Timeline</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Your complete health activity history</p>
          </div>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              showSearch ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
            }`}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <AnimatePresence>
          {showSearch && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Search events, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-muted/50 pl-9 pr-9 py-2.5 text-sm rounded-xl outline-none"
                  autoFocus
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide mt-3">
          {filterTypes.map(({ key, label, icon: FIcon }) => {
            const isActive = activeFilters.has(key);
            const count = typeCounts[key] || 0;
            if (count === 0) return null;
            return (
              <button
                key={key}
                onClick={() => toggleFilter(key)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all flex items-center gap-1 ${
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
                }`}
              >
                <FIcon className="w-3 h-3" />
                {label}
                <span className={`text-[9px] ${isActive ? "opacity-80" : "opacity-60"}`}>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="px-5 mt-2">
        {filteredEvents.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 px-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            {searchQuery || activeFilters.size > 0 ? (
              <>
                <p className="text-sm font-medium mb-1">No matching events</p>
                <p className="text-xs text-muted-foreground mb-4">Try adjusting your search or filters.</p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveFilters(new Set()); }}
                  className="text-xs text-primary font-medium"
                >
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-medium mb-1">Your health timeline will appear here</p>
                <p className="text-xs text-muted-foreground mb-6">Start tracking to build your health history.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={() => navigate("/track")} className="glass-card px-4 py-2 text-xs font-medium text-primary">
                    Log a symptom
                  </button>
                  <button onClick={() => navigate("/track")} className="glass-card px-4 py-2 text-xs font-medium text-primary">
                    Record a measurement
                  </button>
                  <button onClick={() => navigate("/records")} className="glass-card px-4 py-2 text-xs font-medium text-primary">
                    Upload a report
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <div className="space-y-6">
            {grouped.map(([dateStr, dayEvents]) => (
              <div key={dateStr}>
                {/* Date header */}
                <div className="flex items-center gap-2 mb-3 sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-1 -mx-1 px-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {formatDateHeader(dayEvents[0].timestamp)}
                  </h3>
                  <div className="flex-1 h-px bg-border/50" />
                  <span className="text-[10px] text-muted-foreground">{dayEvents.length} events</span>
                </div>

                {/* Events */}
                <div className="space-y-2 relative ml-1">
                  {/* Vertical line */}
                  <div className="absolute left-[17px] top-2 bottom-2 w-px bg-border/40" />

                  {dayEvents.map((event, i) => {
                    const Icon = eventIcons[event.type];
                    const colorClass = eventColors[event.type];
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => setSelectedEvent(event)}
                        className="flex items-start gap-3 relative cursor-pointer group"
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 z-10 transition-transform group-active:scale-90 ${colorClass}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 glass-card p-3 group-active:scale-[0.98] transition-transform">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">{event.title}</p>
                              {event.description && (
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{event.description}</p>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                              {formatTime(event.timestamp)}
                            </span>
                          </div>
                          {event.tags.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {event.tags.map((tag) => (
                                <span key={tag.id} className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                  {tag.label}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Load more */}
            {hasMore && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setVisibleCount((c) => c + 20)}
                className="w-full glass-card p-3 text-sm text-primary font-medium text-center flex items-center justify-center gap-2"
              >
                <ArrowUp className="w-4 h-4 rotate-180" />
                Load older events ({filteredEvents.length - visibleCount} remaining)
              </motion.button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
