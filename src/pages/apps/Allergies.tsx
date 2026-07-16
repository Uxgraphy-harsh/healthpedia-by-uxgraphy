import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AppFrame, type EmbeddedProps } from "./_embedded";


type Severity = "Mild" | "Moderate" | "Severe";
type AllergyType = "Drug" | "Food" | "Environmental" | "Other";

type Allergy = {
  name: string;
  description: string;
  severity: Severity;
  type: AllergyType;
};

const seedGroups: { category: string; items: Allergy[] }[] = [
  {
    category: "Drug & Medication",
    items: [
      {
        name: "Penicillin",
        description: "Causes anaphylaxis — immediate throat swelling and difficulty breathing",
        severity: "Severe",
        type: "Drug",
      },
      {
        name: "Sulfa drugs",
        description: "Causes skin rash and itching within hours of ingestion",
        severity: "Moderate",
        type: "Drug",
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
        type: "Food",
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
        type: "Environmental",
      },
    ],
  },
];

const severityStyles: Record<Severity, string> = {
  Severe: "bg-[#FEE2E2] text-[#DC2626]",
  Moderate: "bg-[#FFEDD5] text-[#EA580C]",
  Mild: "bg-[#DCFCE7] text-[#16A34A]",
};

const severityActive: Record<Severity, string> = {
  Mild: "bg-[#DCFCE7] text-[#16A34A]",
  Moderate: "bg-[#FFEDD5] text-[#EA580C]",
  Severe: "bg-[#FEE2E2] text-[#DC2626]",
};

const typeToCategory: Record<AllergyType, string> = {
  Drug: "Drug & Medication",
  Food: "Food",
  Environmental: "Environmental",
  Other: "Other",
};

export default function Allergies({ embedded }: EmbeddedProps = {}) {
  const [groups, setGroups] = useState(seedGroups);
  const [sheetOpen, setSheetOpen] = useState(false);

  const addAllergy = (a: Allergy) => {
    setGroups((prev) => {
      const catName = typeToCategory[a.type];
      const idx = prev.findIndex((g) => g.category === catName);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], items: [...next[idx].items, a] };
        return next;
      }
      return [...prev, { category: catName, items: [a] }];
    });
  };

  const removeAllergy = (cat: string, name: string) => {
    setGroups((prev) =>
      prev
        .map((g) =>
          g.category === cat ? { ...g, items: g.items.filter((i) => i.name !== name) } : g
        )
        .filter((g) => g.items.length > 0)
    );
  };

  return (
    <MiniAppShell
      appId="allergies"
      name={app.name}
      tagline={app.tagline}
      icon={app.icon}
      bg={app.bg}
      fg={app.fg}
      bottomActions={[]}
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
                    onClick={() => removeAllergy(g.category, a.name)}
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
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg"
        style={{ background: "#171717" }}
      >
        <Plus className="h-5 w-5" strokeWidth={2.5} />
        <span className="font-semibold">Add allergy</span>
      </button>

      <AddAllergySheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSave={(a) => {
          addAllergy(a);
          setSheetOpen(false);
        }}
        existingNames={groups.flatMap((g) => g.items.map((i) => i.name))}
      />
    </MiniAppShell>
  );
}

function AddAllergySheet({
  open,
  onOpenChange,
  onSave,
  existingNames,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSave: (a: Allergy) => void;
  existingNames: string[];
}) {
  const [name, setName] = useState("");
  const [reaction, setReaction] = useState("");
  const [type, setType] = useState<AllergyType | null>(null);
  const [severity, setSeverity] = useState<Severity>("Mild");

  const canSave = name.trim().length > 0 && type !== null;

  const reset = () => {
    setName("");
    setReaction("");
    setType(null);
    setSeverity("Mild");
  };

  const suggestions = name.trim().length
    ? existingNames.filter(
        (n) => n.toLowerCase().includes(name.trim().toLowerCase()) && n.toLowerCase() !== name.trim().toLowerCase()
      ).slice(0, 4)
    : [];

  const types: AllergyType[] = ["Drug", "Food", "Environmental", "Other"];
  const severities: Severity[] = ["Mild", "Moderate", "Severe"];

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <SheetContent
        side="bottom"
        className="p-0 rounded-t-3xl border-0 max-h-[92vh] overflow-hidden flex flex-col"
      >
        {/* Grabber */}
        <div className="pt-2 pb-1 flex justify-center">
          <div className="h-1.5 w-10 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="grid grid-cols-3 items-center px-5 py-3">
          <button
            onClick={() => onOpenChange(false)}
            className="text-[15px] text-[#3B82F6] font-normal justify-self-start"
          >
            Cancel
          </button>
          <h2 className="text-[17px] font-semibold text-center">Add allergy</h2>
          <div />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-5">
          {/* Name */}
          <div className="rounded-2xl border border-border/60 px-4 py-3">
            <label className="text-[13px] text-muted-foreground">
              Allergy name<span className="text-[#DC2626]">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type to add or search existing symptom..."
              className="w-full bg-transparent outline-none text-[15px] mt-0.5 placeholder:text-muted-foreground"
              maxLength={80}
            />
            {suggestions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setName(s)}
                    className="text-[12px] px-2 py-1 rounded-full bg-muted text-foreground/80"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reaction */}
          <div className="rounded-2xl border border-border/60 px-4 py-3">
            <label className="text-[13px] text-muted-foreground">Reaction</label>
            <textarea
              value={reaction}
              onChange={(e) => setReaction(e.target.value)}
              placeholder="Describe what happens"
              rows={3}
              className="w-full bg-transparent outline-none text-[15px] mt-0.5 placeholder:text-muted-foreground resize-none"
              maxLength={300}
            />
          </div>

          {/* Type */}
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase mb-2 px-1">
              Type<span className="text-[#DC2626]">*</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => {
                const active = type === t;
                return (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-5 py-2 rounded-full text-[14px] transition-colors border ${
                      active
                        ? "bg-[#60A5FA] text-white border-[#60A5FA]"
                        : "bg-transparent text-foreground border-border/60"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity segmented */}
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase mb-2 px-1">
              Severity
            </p>
            <div className="rounded-full border border-border/60 p-1 flex items-center relative">
              {severities.map((s) => {
                const active = severity === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSeverity(s)}
                    className={`flex-1 py-2 rounded-full text-[15px] font-medium transition-colors ${
                      active ? severityActive[s] : "text-muted-foreground"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pt-3 pb-6 border-t border-border/40">
          <button
            disabled={!canSave}
            onClick={() =>
              canSave &&
              onSave({
                name: name.trim(),
                description: reaction.trim(),
                type: type!,
                severity,
              })
            }
            className="w-full rounded-full py-4 text-white text-[16px] font-semibold disabled:opacity-40"
            style={{ background: "#0A0A0A" }}
          >
            Save Allergy
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
