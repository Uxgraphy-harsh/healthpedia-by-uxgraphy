import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AppFrame, type EmbeddedProps } from "./_embedded";

type Frequency = "Never" | "Occasionally" | "Weekly" | "Daily";
type HabitType = "Alcohol" | "Tobacco" | "Smoking" | "Drugs" | "Caffeine" | "Other";

type Habit = {
  name: string;
  type: HabitType;
  frequency: Frequency;
  quantity?: string;
  notes?: string;
  since?: string;
};

const seed: Habit[] = [
  {
    name: "Cigarettes",
    type: "Smoking",
    frequency: "Daily",
    quantity: "5 per day",
    notes: "Trying to cut down — mostly after meals",
    since: "2019",
  },
  {
    name: "Beer / Wine",
    type: "Alcohol",
    frequency: "Weekly",
    quantity: "2–3 drinks",
    notes: "Weekends only",
  },
  {
    name: "Coffee",
    type: "Caffeine",
    frequency: "Daily",
    quantity: "2 cups",
  },
];

const freqStyles: Record<Frequency, string> = {
  Never: "bg-[#DCFCE7] text-[#16A34A]",
  Occasionally: "bg-[#DBEAFE] text-[#2563EB]",
  Weekly: "bg-[#FFEDD5] text-[#EA580C]",
  Daily: "bg-[#FEE2E2] text-[#DC2626]",
};

const typeToCategory: Record<HabitType, string> = {
  Alcohol: "Alcohol",
  Tobacco: "Tobacco",
  Smoking: "Smoking",
  Drugs: "Drugs & Substances",
  Caffeine: "Caffeine",
  Other: "Other",
};

export default function Habits({ embedded }: EmbeddedProps = {}) {
  const [habits, setHabits] = useState<Habit[]>(seed);
  const [sheetOpen, setSheetOpen] = useState(false);

  const grouped = habits.reduce<Record<string, Habit[]>>((acc, h) => {
    const cat = typeToCategory[h.type];
    (acc[cat] ??= []).push(h);
    return acc;
  }, {});

  const addHabit = (h: Habit) => setHabits((prev) => [...prev, h]);
  const removeHabit = (name: string) =>
    setHabits((prev) => prev.filter((h) => h.name !== name));

  return (
    <AppFrame appId="habits" embedded={embedded}>
      <div className="space-y-6 pb-32">
        {Object.keys(grouped).length === 0 && (
          <div className="mt-16 text-center text-sm text-muted-foreground">
            No habits logged yet.
          </div>
        )}
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase px-1">
              {cat}
            </p>
            <div className="space-y-3">
              {items.map((h) => (
                <div
                  key={h.name}
                  className="bg-card rounded-2xl p-4 border border-border/60 flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-[17px] leading-tight text-foreground">
                        {h.name}
                      </p>
                      <span
                        className={`text-[12px] font-medium px-2.5 py-0.5 rounded-full ${freqStyles[h.frequency]}`}
                      >
                        {h.frequency}
                      </span>
                    </div>
                    {h.quantity && (
                      <p className="text-[14px] text-foreground/80 mt-1 leading-snug">
                        {h.quantity}
                      </p>
                    )}
                    {h.notes && (
                      <p className="text-[13px] text-muted-foreground mt-1 leading-snug">
                        {h.notes}
                      </p>
                    )}
                    {h.since && (
                      <p className="text-[12px] text-muted-foreground mt-2">
                        Since {h.since}
                      </p>
                    )}
                  </div>
                  <button
                    aria-label={`Delete ${h.name}`}
                    onClick={() => removeHabit(h.name)}
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

      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg"
        style={{ background: "#171717" }}
      >
        <Plus className="h-5 w-5" strokeWidth={2.5} />
        <span className="font-semibold">Add habit</span>
      </button>

      <AddHabitSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSave={(h) => {
          addHabit(h);
          setSheetOpen(false);
        }}
      />
    </AppFrame>
  );
}

function AddHabitSheet({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSave: (h: Habit) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<HabitType | null>(null);
  const [frequency, setFrequency] = useState<Frequency>("Occasionally");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [since, setSince] = useState("");

  const canSave = name.trim().length > 0 && type !== null;

  const reset = () => {
    setName("");
    setType(null);
    setFrequency("Occasionally");
    setQuantity("");
    setNotes("");
    setSince("");
  };

  const types: HabitType[] = ["Alcohol", "Tobacco", "Smoking", "Drugs", "Caffeine", "Other"];
  const freqs: Frequency[] = ["Never", "Occasionally", "Weekly", "Daily"];

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
        <div className="pt-2 pb-1 flex justify-center">
          <div className="h-1.5 w-10 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="grid grid-cols-3 items-center px-5 py-3">
          <button
            onClick={() => onOpenChange(false)}
            className="text-[15px] text-[#3B82F6] font-normal justify-self-start"
          >
            Cancel
          </button>
          <h2 className="text-[17px] font-semibold text-center">Add habit</h2>
          <div />
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-5">
          <div className="rounded-2xl border border-border/60 px-4 py-3">
            <label className="text-[13px] text-muted-foreground">
              Habit name<span className="text-[#DC2626]">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cigarettes, Beer, Cannabis"
              className="w-full bg-transparent outline-none text-[15px] mt-0.5 placeholder:text-muted-foreground"
              maxLength={80}
            />
          </div>

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

          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase mb-2 px-1">
              Frequency
            </p>
            <div className="rounded-full border border-border/60 p-1 flex items-center">
              {freqs.map((f) => {
                const active = frequency === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={`flex-1 py-2 rounded-full text-[13px] font-medium transition-colors ${
                      active ? freqStyles[f] : "text-muted-foreground"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 px-4 py-3">
            <label className="text-[13px] text-muted-foreground">Quantity / amount</label>
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 5 cigarettes per day"
              className="w-full bg-transparent outline-none text-[15px] mt-0.5 placeholder:text-muted-foreground"
              maxLength={80}
            />
          </div>

          <div className="rounded-2xl border border-border/60 px-4 py-3">
            <label className="text-[13px] text-muted-foreground">Since (year)</label>
            <input
              value={since}
              onChange={(e) => setSince(e.target.value)}
              placeholder="e.g. 2019"
              className="w-full bg-transparent outline-none text-[15px] mt-0.5 placeholder:text-muted-foreground"
              maxLength={10}
            />
          </div>

          <div className="rounded-2xl border border-border/60 px-4 py-3">
            <label className="text-[13px] text-muted-foreground">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Context, triggers, goals..."
              rows={3}
              className="w-full bg-transparent outline-none text-[15px] mt-0.5 placeholder:text-muted-foreground resize-none"
              maxLength={300}
            />
          </div>
        </div>

        <div className="px-5 pt-3 pb-6 border-t border-border/40">
          <button
            disabled={!canSave}
            onClick={() =>
              canSave &&
              onSave({
                name: name.trim(),
                type: type!,
                frequency,
                quantity: quantity.trim() || undefined,
                notes: notes.trim() || undefined,
                since: since.trim() || undefined,
              })
            }
            className="w-full rounded-full py-4 text-white text-[16px] font-semibold disabled:opacity-40"
            style={{ background: "#0A0A0A" }}
          >
            Save habit
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
