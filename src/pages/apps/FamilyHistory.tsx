import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import MiniAppShell from "@/components/MiniAppShell";
import AppLockGate from "@/components/AppLockGate";
import { getMiniApp } from "@/data/miniApps";

type Condition = { name: string; diagnosed: string };
type Member = {
  id: string;
  name: string;
  relation: string;
  age: number;
  hpid: string;
  avatar: string;
  active: boolean;
  conditions: Condition[];
};

const initialMembers: Member[] = [
  {
    id: "1",
    name: "Sujoy Sahu",
    relation: "Father",
    age: 79,
    hpid: "#8836477253",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Sujoy&backgroundColor=fce7f3",
    active: true,
    conditions: [
      { name: "Hypertension", diagnosed: "early 50s" },
      { name: "Type 2 Diabetes", diagnosed: "age 48" },
    ],
  },
  {
    id: "2",
    name: "Miska Sahu",
    relation: "Mother",
    age: 79,
    hpid: "#9354677563",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Miska&backgroundColor=fef9c3",
    active: true,
    conditions: [{ name: "Hypothyroidism", diagnosed: "late 40s" }],
  },
];

type Draft = { name: string; date: string };

function AddRecordSheet({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (
    hpid: string,
    relation: string,
    birthday: string,
    gender: string,
    conds: Draft[]
  ) => void;
}) {
  const [hpid, setHpid] = useState("");
  const [relation, setRelation] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [conds, setConds] = useState<Draft[]>([{ name: "", date: "" }]);

  const update = (i: number, key: keyof Draft, val: string) =>
    setConds((prev) => prev.map((c, idx) => (idx === i ? { ...c, [key]: val } : c)));

  const canSave =
    hpid.trim().length > 0 &&
    relation.trim().length > 0 &&
    gender.trim().length > 0 &&
    conds.every((c) => c.name.trim().length > 0);

  const handleSave = () => {
    if (!canSave) return;
    onSave(hpid.trim(), relation.trim(), birthday.trim(), gender.trim(), conds);
    setHpid("");
    setRelation("");
    setBirthday("");
    setGender("");
    setConds([{ name: "", date: "" }]);
    onClose();
  };



  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-[90] mx-auto w-full max-w-md rounded-t-3xl bg-background shadow-2xl max-h-[92dvh] flex flex-col"
          >
            <div className="pt-2 pb-1 flex justify-center">
              <div className="h-1 w-10 rounded-full bg-muted" />
            </div>
            <div className="grid grid-cols-3 items-center px-5 py-2">
              <button
                onClick={onClose}
                className="text-[15px] font-medium text-[#60A5FA] text-left"
              >
                Cancel
              </button>
              <h2 className="text-[16px] font-bold text-center">Add a Medical Record</h2>
              <div />
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {/* Healthpedia ID */}
              <div className="rounded-2xl border border-border/70 px-4 py-3">
                <label className="text-[12px] text-muted-foreground">
                  Healthpedia ID<span className="text-[#F66B9A]">*</span>
                </label>
                <input
                  value={hpid}
                  onChange={(e) => setHpid(e.target.value)}
                  placeholder="#000000000000"
                  className="w-full bg-transparent outline-none text-[15px] placeholder:text-muted-foreground/60"
                />
              </div>

              <div className="rounded-2xl border border-border/70 px-4 py-3">
                <label className="text-[12px] text-muted-foreground">
                  Relation<span className="text-[#F66B9A]">*</span>
                </label>
                <input
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  placeholder="e.g. Father, Mother, Sister"
                  className="w-full bg-transparent outline-none text-[15px] placeholder:text-muted-foreground/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border/70 px-4 py-3">
                  <label className="text-[12px] text-muted-foreground">Birthday</label>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full bg-transparent outline-none text-[15px] placeholder:text-muted-foreground/60"
                  />
                </div>
                <div className="rounded-2xl border border-border/70 px-4 py-3">
                  <label className="text-[12px] text-muted-foreground">
                    Gender<span className="text-[#F66B9A]">*</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-transparent outline-none text-[15px] appearance-none"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {conds.map((c, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                      Condition {i + 1}
                      <span className="text-[#F66B9A]">*</span>
                    </p>
                    {conds.length > 1 && (
                      <button
                        onClick={() => setConds((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-[13px] font-medium text-[#60A5FA]"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="rounded-2xl border border-border/70 px-4 py-3">
                    <label className="text-[12px] text-muted-foreground">
                      Condition name<span className="text-[#F66B9A]">*</span>
                    </label>
                    <input
                      value={c.name}
                      onChange={(e) => update(i, "name", e.target.value)}
                      placeholder="e.g. Hypothyroidism"
                      className="w-full bg-transparent outline-none text-[15px] placeholder:text-muted-foreground/60"
                    />
                  </div>
                  <div className="rounded-2xl border border-border/70 px-4 py-3">
                    <label className="text-[12px] text-muted-foreground">Diagnosis date</label>
                    <input
                      value={c.date}
                      onChange={(e) => update(i, "date", e.target.value)}
                      placeholder="00/00/0000"
                      className="w-full bg-transparent outline-none text-[15px] placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-4 border-t border-border/60 flex items-center gap-3 pb-6">
              <button
                onClick={() => setConds((prev) => [...prev, { name: "", date: "" }])}
                className="flex-1 h-12 rounded-full border border-[#F66B9A]/60 text-[#F66B9A] font-semibold flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Add More
              </button>
              <button
                onClick={handleSave}
                disabled={!canSave}
                className="flex-1 h-12 rounded-full bg-black text-white font-semibold disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function FamilyHistory() {
  const app = getMiniApp("family")!;
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [sheetOpen, setSheetOpen] = useState(false);

  const removeCondition = (mid: string, name: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === mid ? { ...m, conditions: m.conditions.filter((c) => c.name !== name) } : m
      )
    );
  };

  const handleSaveRecord = (
    hpid: string,
    relation: string,
    birthday: string,
    gender: string,
    conds: Draft[]
  ) => {
    const cleanHpid = hpid.startsWith("#") ? hpid : `#${hpid}`;
    const newConds: Condition[] = conds
      .filter((c) => c.name.trim().length > 0)
      .map((c) => ({ name: c.name.trim(), diagnosed: c.date.trim() || "—" }));

    const age = birthday
      ? Math.max(0, new Date().getFullYear() - new Date(birthday).getFullYear())
      : 0;

    setMembers((prev) => {
      const existing = prev.find((m) => m.hpid === cleanHpid);
      if (existing) {
        return prev.map((m) =>
          m.id === existing.id
            ? { ...m, relation, age: age || m.age, conditions: [...m.conditions, ...newConds] }
            : m
        );
      }
      return [
        ...prev,
        {
          id: Date.now().toString(),
          name: cleanHpid,
          relation,
          age,
          hpid: cleanHpid,
          avatar: "",
          active: false,
          conditions: newConds,
        },
      ];
    });
    void gender;
  };

  return (
    <AppLockGate appId="family">
      <MiniAppShell
        appId="family"
        name={app.name}
        tagline={app.tagline}
        icon={app.icon}
        bg={app.bg}
        fg={app.fg}
        bottomActions={[]}
      >
        <div className="space-y-4 pb-32">
          {members.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-border/60 bg-card overflow-hidden"
            >
              <div className="flex items-start gap-3 p-4">
                <div className="flex-1 min-w-0">

                  <p className="text-[12px] text-muted-foreground">
                    {m.relation} · {m.age} Years
                  </p>
                  <p className="text-[16px] font-bold leading-tight truncate">{m.name}</p>

                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => setSheetOpen(true)}
                    className="text-[13px] font-medium text-[#60A5FA]"
                  >
                    Edit
                  </button>
                  {m.active && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                      Active Today
                    </span>
                  )}
                </div>
              </div>

              {m.conditions.length > 0 && (
                <div className="border-t border-border/60">
                  {m.conditions.map((c, i) => (
                    <div
                      key={c.name}
                      className={`flex items-center justify-between px-4 py-3 ${
                        i > 0 ? "border-t border-border/60" : ""
                      }`}
                    >
                      <div>
                        <p className="text-[15px] font-semibold">{c.name}</p>
                        <p className="text-[12px] text-muted-foreground">
                          Diagnosed · {c.diagnosed}
                        </p>
                      </div>
                      <button
                        onClick={() => removeCondition(m.id, c.name)}
                        className="p-1.5 text-muted-foreground hover:text-foreground"
                        aria-label={`Delete ${c.name}`}
                      >
                        <Trash2 className="w-[18px] h-[18px]" strokeWidth={1.75} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => setSheetOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg"
          style={{ background: "#171717" }}
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
          <span className="font-semibold">Add member</span>
        </button>

        <AddRecordSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          onSave={handleSaveRecord}
        />
      </MiniAppShell>
    </AppLockGate>
  );
}
