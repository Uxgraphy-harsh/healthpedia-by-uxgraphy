import { useState } from "react";
import { Plus, Calendar, MapPin, Check, BellRing, Clock } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";

interface Appt {
  id: string;
  doctor: string;
  specialty: string;
  place: string;
  date: string;
  time: string;
  status: "upcoming" | "done";
  reminderCreated: boolean;
}

const initial: Appt[] = [
  { id: "a1", doctor: "Dr. Meena Sharma", specialty: "Endocrinology", place: "Apollo Clinic, Pune", date: "Tomorrow", time: "11:30 AM", status: "upcoming", reminderCreated: true },
  { id: "a2", doctor: "Dr. Mehta", specialty: "Cardiology", place: "Fortis", date: "Mar 28", time: "4:00 PM", status: "upcoming", reminderCreated: true },
  { id: "a3", doctor: "Dr. Iyer", specialty: "Dermatology", place: "Skin Clinic", date: "Feb 12", time: "10:00 AM", status: "done", reminderCreated: false },
];

export default function Appointments() {
  const app = getMiniApp("appointments")!;
  const [appts] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <MiniAppShell
      appId="appointments"
      name={app.name}
      tagline={app.tagline}
      icon={app.icon}
      bg={app.bg}
      fg={app.fg}
      bottomActions={[
        { icon: Calendar, label: "Upcoming", active: true },
        { icon: Clock, label: "Past" },
        { icon: MapPin, label: "Nearby" },
      ]}
    >

      <div className="rounded-2xl bg-[#8B5CF6]/8 border border-[#8B5CF6]/20 p-3 mb-4 flex items-center gap-3">
        <BellRing className="w-4 h-4 text-[#8B5CF6] shrink-0" />
        <p className="text-[11px] text-foreground/70">
          Reminders are auto-created for every scheduled appointment.
        </p>
      </div>

      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Upcoming</h3>
      <div className="space-y-2 mb-6">
        {appts.filter((a) => a.status === "upcoming").map((a) => (
          <div key={a.id} className="bg-card rounded-2xl p-4 border-l-[3px] border-[#8B5CF6]">
            <p className="font-semibold text-sm">{a.doctor}</p>
            <p className="text-[11px] text-muted-foreground mb-2">{a.specialty}</p>
            <div className="space-y-1 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {a.date} · {a.time}</div>
              <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {a.place}</div>
            </div>
            {a.reminderCreated && (
              <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-medium text-[#22C55E]">
                <Check className="w-3 h-3" /> Reminder set
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Past</h3>
      <div className="space-y-2">
        {appts.filter((a) => a.status === "done").map((a) => (
          <div key={a.id} className="bg-card rounded-2xl p-3.5 border border-border/40 opacity-70">
            <p className="text-sm font-semibold">{a.doctor}</p>
            <p className="text-[11px] text-muted-foreground">{a.date} · {a.specialty}</p>
          </div>
        ))}
      </div>

      {/* Floating Book appointment button */}
      {!showAdd && (
        <button
          onClick={() => setShowAdd(true)}
          className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg"
          style={{ background: "#171717" }}
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
          <span className="font-semibold">Book appointment</span>
        </button>
      )}

      {showAdd && (
        <div
          className="fixed inset-0 z-[90] bg-black/40 flex items-end"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="w-full max-w-md mx-auto bg-background rounded-t-3xl flex flex-col max-h-[92dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-muted mx-auto my-3 shrink-0" />
            <div className="flex items-center px-5 pb-4 shrink-0">
              <button
                onClick={() => setShowAdd(false)}
                className="text-sm font-medium text-[#60A5FA] w-16 text-left"
              >
                Cancel
              </button>
              <h3 className="flex-1 text-center text-[17px] font-bold">Book appointment</h3>
              <div className="w-16" />
            </div>
            <div className="px-5 pb-8 text-sm text-muted-foreground">
              Choose a doctor, date and time to book.
            </div>
          </div>
        </div>
      )}
    </MiniAppShell>
  );
}

