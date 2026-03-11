import { motion } from "framer-motion";
import { Pill, Activity, Ruler, FileText, Calendar, StickyNote, Check, Clock } from "lucide-react";
import type { HealthEvent, HealthEventType } from "@/types/health";

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

interface HealthTimelineProps {
  events: HealthEvent[];
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function groupByDate(events: HealthEvent[]): Record<string, HealthEvent[]> {
  const groups: Record<string, HealthEvent[]> = {};
  for (const event of events) {
    const dateKey = new Date(event.timestamp).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
    });
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(event);
  }
  return groups;
}

export default function HealthTimeline({ events }: HealthTimelineProps) {
  const grouped = groupByDate(events);

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([date, dayEvents]) => (
        <div key={date}>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{date}</h3>
          </div>
          <div className="space-y-2 relative">
            {/* Timeline line */}
            <div className="absolute left-[18px] top-2 bottom-2 w-px bg-border/50" />

            {dayEvents.map((event, i) => {
              const Icon = eventIcons[event.type];
              const colorClass = eventColors[event.type];
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 relative"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 z-10 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 glass-card p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{event.title}</p>
                      <span className="text-[10px] text-muted-foreground">{formatTime(event.timestamp)}</span>
                    </div>
                    {event.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                    )}
                    {event.tags.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {event.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                          >
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
    </div>
  );
}
