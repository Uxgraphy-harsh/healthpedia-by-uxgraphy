import { Plus, Trash2 } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";

type Severity = "Severe" | "Moderate" | "Mild";

type Allergy = {
  name: string;
  description: string;
  severity: Severity;
};

const groups: { category: string; items: Allergy[] }[] = [
  {
    category: "Drug & Medication",
    items: [
      {
        name: "Penicillin",
        description: "Causes anaphylaxis — immediate throat swelling and difficulty breathing",
        severity: "Severe",
      },
      {
        name: "Sulfa drugs",
        description: "Causes skin rash and itching within hours of ingestion",
        severity: "Moderate",
      },
    ],
  },
  {
    category: "Food",
    items: [
      {
        name: "Shellfish",
        description: "Mild nausea and digestive discomfort",
        severity: "Mild",
      },
    ],
  },
  {
    category: "Environmental",
    items: [
      {
        name: "Dust mites",
        description: "Sneezing, watery eyes, nasal congestion — worsens at night",
        severity: "Mild",
      },
    ],
  },
];

const severityStyles: Record<Severity, string> = {
  Severe: "bg-[#FEE2E2] text-[#DC2626]",
  Moderate: "bg-[#FFEDD5] text-[#EA580C]",
  Mild: "bg-[#DCFCE7] text-[#16A34A]",
};

export default function Allergies() {
  const app = getMiniApp("allergies")!;
  return (
    <MiniAppShell
      appId="allergies"
      name={app.name}
      tagline={app.tagline}
      icon={app.icon}
      bg={app.bg}
      fg={app.fg}
    >
      <div className="space-y-6 pb-32">
        {groups.map((g) => (
          <div key={g.category} className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase px-1">
              {g.category}
            </p>
            <div className="space-y-3">
              {g.items.map((a) => (
                <div
                  key={a.name}
                  className="bg-card rounded-2xl p-4 border border-border/60 flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[17px] leading-tight text-foreground">
                      {a.name}
                    </p>
                    <p className="text-[14px] text-muted-foreground mt-1 leading-snug">
                      {a.description}
                    </p>
                    <span
                      className={`inline-block mt-3 text-[13px] font-medium px-3 py-1 rounded-full ${severityStyles[a.severity]}`}
                    >
                      {a.severity}
                    </span>
                  </div>
                  <button
                    aria-label={`Delete ${a.name}`}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    <Trash2 className="w-5 h-5" strokeWidth={1.75} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add allergy button */}
      <button
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg"
        style={{ background: "#171717" }}
      >
        <Plus className="h-5 w-5" strokeWidth={2.5} />
        <span className="font-semibold">Add allergy</span>
      </button>
    </MiniAppShell>
  );
}
