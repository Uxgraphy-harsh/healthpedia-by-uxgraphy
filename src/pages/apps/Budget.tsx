import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";
import {
  Wallet, BarChart3, List, Plus, ArrowUpRight, ArrowDownRight,
  Stethoscope, Pill, FlaskConical, ShieldCheck, HeartPulse, Hospital,
  Sparkles, Trash2, X, Delete, Check, Calendar as CalendarIcon,
  Settings2, ChevronDown,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";



const TEAL = "#0EA5A5";
const DEEP = "#0B4B4B";

/* ---------------- Categories ---------------- */

interface Category {
  id: string;
  label: string;
  emoji?: string;              // for custom user categories
  icon?: typeof Pill;          // for built-ins
  color: string;
  builtin?: boolean;
}

const BUILTIN: Category[] = [
  { id: "doctor",    label: "Doctor",    icon: Stethoscope,  color: "#60A5FA", builtin: true },
  { id: "medicine",  label: "Medicine",  icon: Pill,         color: "#F66B9A", builtin: true },
  { id: "tests",     label: "Tests",     icon: FlaskConical, color: "#8B5CF6", builtin: true },
  { id: "insurance", label: "Insurance", icon: ShieldCheck,  color: "#22C55E", builtin: true },
  { id: "hospital",  label: "Hospital",  icon: Hospital,     color: "#EF4E3B", builtin: true },
  { id: "wellness",  label: "Wellness",  icon: HeartPulse,   color: "#F59E0B", builtin: true },
  { id: "other",     label: "Other",     icon: Sparkles,     color: "#737373", builtin: true },
];

const SUGGESTED: { emoji: string; label: string; color: string }[] = [
  { emoji: "🧘",  label: "Therapy",     color: "#8B5CF6" },
  { emoji: "🦷",  label: "Dental",      color: "#0EA5E9" },
  { emoji: "👓",  label: "Eye Care",    color: "#14B8A6" },
  { emoji: "🥗",  label: "Nutrition",   color: "#22C55E" },
  { emoji: "💪",  label: "Gym",         color: "#F97316" },
  { emoji: "🧴",  label: "Skincare",    color: "#EC4899" },
  { emoji: "🩺",  label: "Checkup",     color: "#60A5FA" },
  { emoji: "🧠",  label: "Mental",      color: "#A855F7" },
  { emoji: "🚑",  label: "Emergency",   color: "#EF4444" },
  { emoji: "💊",  label: "Vitamins",    color: "#F59E0B" },
];

const PALETTE = ["#60A5FA", "#F66B9A", "#8B5CF6", "#22C55E", "#EF4E3B", "#F59E0B", "#0EA5A5", "#EC4899", "#A855F7", "#14B8A6"];

const LS_CATS = "budget.customCats.v1";

function useCategories() {
  const [custom, setCustom] = useState<Category[]>(() => {
    try {
      const raw = localStorage.getItem(LS_CATS);
      if (raw) return JSON.parse(raw) as Category[];
    } catch { /* noop */ }
    return [];
  });
  useEffect(() => { localStorage.setItem(LS_CATS, JSON.stringify(custom)); }, [custom]);
  const all = useMemo(() => [...BUILTIN, ...custom], [custom]);
  const byId = (id: string) => all.find((c) => c.id === id) ?? BUILTIN[6];
  const add = (c: Omit<Category, "id" | "builtin">) =>
    setCustom((prev) => [...prev, { ...c, id: `c-${Date.now()}` }]);
  const remove = (id: string) =>
    setCustom((prev) => prev.filter((c) => c.id !== id));
  return { all, custom, byId, add, remove };
}

/* ---------------- Expense state ---------------- */

type TxType = "expense" | "income";

interface Expense {
  id: string;
  title?: string;
  amount: number;              // stored in paise-less rupees (integer or decimal)
  categoryId: string;
  date: string;                // ISO yyyy-mm-dd
  note?: string;
  type: TxType;
}

const LS_EXPENSES = "budget.expenses.v1";
const LS_BUDGET   = "budget.monthly.v1";

const currency = (n: number) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
const todayISO = () => new Date().toISOString().slice(0, 10);
const monthKey = (d: string) => d.slice(0, 7);

const SEED: Expense[] = [
  { id: "s1", title: "General physician visit", amount: 800, categoryId: "doctor",   date: todayISO(), type: "expense" },
  { id: "s2", title: "Vitamin D supplements",   amount: 450, categoryId: "medicine", date: todayISO(), type: "expense" },
  { id: "s3", title: "Blood test — CBC",        amount: 620, categoryId: "tests",    date: todayISO(), type: "expense" },
];

type View = "overview" | "expenses" | "analytics";

/* ---------------- Main ---------------- */

export default function Budget() {
  const app = getMiniApp("budget")!;
  const cats = useCategories();
  const [view, setView] = useState<View>("overview");
  const [addOpen, setAddOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const raw = localStorage.getItem(LS_EXPENSES);
      if (raw) {
        const parsed = JSON.parse(raw) as Expense[];
        return parsed.map((e) => ({ type: "expense", ...e }));
      }
    } catch { /* noop */ }
    return SEED;
  });
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    const raw = localStorage.getItem(LS_BUDGET);
    return raw ? Number(raw) : 5000;
  });

  useEffect(() => { localStorage.setItem(LS_EXPENSES, JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem(LS_BUDGET, String(monthlyBudget)); }, [monthlyBudget]);

  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthExpenses = useMemo(
    () => expenses.filter((e) => monthKey(e.date) === thisMonth && e.type === "expense"),
    [expenses, thisMonth]
  );
  const monthTotal = monthExpenses.reduce((a, b) => a + b.amount, 0);

  const [ly, lm] = (() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1);
    return [d.getFullYear(), d.getMonth() + 1];
  })();
  const lastMonthKey = `${ly}-${String(lm).padStart(2, "0")}`;
  const lastMonthTotal = expenses
    .filter((e) => monthKey(e.date) === lastMonthKey && e.type === "expense")
    .reduce((a, b) => a + b.amount, 0);
  const deltaPct = lastMonthTotal
    ? Math.round(((monthTotal - lastMonthTotal) / lastMonthTotal) * 100)
    : 0;

  const addExpense = (e: Omit<Expense, "id">) =>
    setExpenses((prev) => [{ ...e, id: `e-${Date.now()}` }, ...prev]);
  const removeExpense = (id: string) =>
    setExpenses((prev) => prev.filter((x) => x.id !== id));

  return (
    <MiniAppShell
      appId="budget"
      name={app.name}
      tagline={app.tagline}
      icon={app.icon}
      bg={app.bg}
      fg={app.fg}
      bottomActions={[
        { icon: Wallet,    label: "Overview",  active: view === "overview",  onClick: () => setView("overview") },
        { icon: List,      label: "Expenses",  active: view === "expenses",  onClick: () => setView("expenses"),
          badge: monthExpenses.length },
        { icon: Plus,      label: "Add",       primary: true, onClick: () => setAddOpen(true) },
        { icon: BarChart3, label: "Analytics", active: view === "analytics", onClick: () => setView("analytics") },
      ]}
    >
      {view === "overview" && (
        <Overview
          expenses={expenses}
          resolveCat={cats.byId}
          categories={cats.all}
          onRemove={removeExpense}
        />
      )}

      {view === "expenses" && (
        <ExpensesList
          expenses={expenses}
          onRemove={removeExpense}
          resolveCat={cats.byId}
          categories={cats.all}
        />
      )}
      {view === "analytics" && (
        <Analytics expenses={expenses.filter((e) => e.type === "expense")} resolveCat={cats.byId} />
      )}

      <AddExpenseFullScreen
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(e) => { addExpense(e); setAddOpen(false); }}
        categories={cats.all}
        onManageCategories={() => setCatsOpen(true)}
      />

      <CategoriesSheet
        open={catsOpen}
        onClose={() => setCatsOpen(false)}
        categories={cats.all}
        customCategories={cats.custom}
        onAdd={cats.add}
        onRemove={cats.remove}
      />
    </MiniAppShell>
  );
}

/* ---------------- Category chip renderer ---------------- */

function CatGlyph({ cat, className, style }: { cat: Category; className?: string; style?: React.CSSProperties }) {
  if (cat.emoji) {
    return <span className={className} style={style}>{cat.emoji}</span>;
  }
  const Icon = cat.icon ?? Sparkles;
  return <Icon className={className} style={style} />;
}

/* ---------------- Overview (recent + history + category filters) ---------------- */

function Overview({
  expenses, resolveCat, categories, onRemove,
}: {
  expenses: Expense[];
  resolveCat: (id: string) => Category;
  categories: Category[];
  onRemove: (id: string) => void;
}) {
  const [filter, setFilter] = useState<string>("all");

  const activeCats = useMemo(() => {
    const set = new Set(expenses.map((e) => e.categoryId));
    return categories.filter((c) => set.has(c.id));
  }, [expenses, categories]);

  const filtered = useMemo(
    () => (filter === "all" ? expenses : expenses.filter((e) => e.categoryId === filter)),
    [expenses, filter]
  );

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [filtered]
  );

  const recent = sorted.slice(0, 3);
  const history = sorted.slice(3);

  const grouped = useMemo(() => {
    const map = new Map<string, Expense[]>();
    history.forEach((e) => {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    });
    return [...map.entries()];
  }, [history]);

  return (
    <div className="pb-24">
      <h2 className="mt-2 text-2xl font-bold text-neutral-900">Transactions</h2>
      <p className="mt-1 text-sm text-neutral-500">
        {expenses.length} {expenses.length === 1 ? "entry" : "entries"} logged
      </p>

      {/* Category filters */}
      <div className="mt-4 -mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2">
          <FilterChip label="All" active={filter === "all"} color={TEAL} onClick={() => setFilter("all")} />
          {activeCats.map((c) => (
            <FilterChip key={c.id} label={c.label} active={filter === c.id} color={c.color}
              onClick={() => setFilter(c.id)} />
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-neutral-200 p-10 text-center">
          <Wallet className="h-10 w-10" style={{ color: TEAL }} />
          <p className="mt-4 text-lg font-bold text-neutral-900">No transactions yet</p>
          <p className="mt-1 text-sm text-neutral-500">Tap the + button to log your first one.</p>
        </div>
      ) : (
        <>
          {/* Recent transactions */}
          <div className="mt-5">
            <p className="text-sm font-semibold text-neutral-900">Recent transactions</p>
            <div className="mt-3 space-y-2">
              {recent.map((e) => (
                <TxRow key={e.id} e={e} cat={resolveCat(e.categoryId)} onRemove={onRemove} />
              ))}
            </div>
          </div>

          {/* History */}
          {grouped.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-neutral-900">History</p>
              <div className="mt-3 space-y-5">
                {grouped.map(([date, list]) => (
                  <div key={date}>
                    <p className="mb-2 text-xs uppercase tracking-widest text-neutral-500">
                      {new Date(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                    </p>
                    <div className="space-y-2">
                      {list.map((e) => (
                        <TxRow key={e.id} e={e} cat={resolveCat(e.categoryId)} onRemove={onRemove} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TxRow({ e, cat, onRemove }: { e: Expense; cat: Category; onRemove: (id: string) => void }) {
  const isIncome = e.type === "income";
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
        style={{ background: `${cat.color}22`, color: cat.color }}>
        <CatGlyph cat={cat} className="h-4 w-4" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold text-neutral-900">{e.title || cat.label}</p>
        <p className="text-xs text-neutral-500">{cat.label}{e.note ? ` · ${e.note}` : ""}</p>
      </div>
      <p className="text-sm font-bold" style={{ color: isIncome ? "#16A34A" : "#0A0A0A" }}>
        {isIncome ? "+" : ""}{currency(e.amount)}
      </p>
      <button onClick={() => onRemove(e.id)} aria-label="Delete"
        className="ml-1 rounded-full p-1.5 text-neutral-400 hover:text-red-500">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}


/* ---------------- Expenses list ---------------- */

function ExpensesList({
  expenses, onRemove, resolveCat, categories,
}: {
  expenses: Expense[]; onRemove: (id: string) => void;
  resolveCat: (id: string) => Category;
  categories: Category[];
}) {
  const [filter, setFilter] = useState<string>("all");

  const activeCats = useMemo(() => {
    const set = new Set(expenses.map((e) => e.categoryId));
    return categories.filter((c) => set.has(c.id));
  }, [expenses, categories]);

  const filtered = useMemo(
    () => (filter === "all" ? expenses : expenses.filter((e) => e.categoryId === filter)),
    [expenses, filter]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Expense[]>();
    [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1)).forEach((e) => {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    });
    return [...map.entries()];
  }, [filtered]);

  if (expenses.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-neutral-200 p-10 text-center">
        <Wallet className="h-10 w-10" style={{ color: TEAL }} />
        <p className="mt-4 text-lg font-bold text-neutral-900">No expenses yet</p>
        <p className="mt-1 text-sm text-neutral-500">Tap the + button to log your first one.</p>
      </div>
    );
  }

  const filterTotal = filtered.reduce((a, b) => a + (b.type === "expense" ? b.amount : -b.amount), 0);

  return (
    <div className="pb-24">
      <h2 className="mt-2 text-2xl font-bold text-neutral-900">All transactions</h2>
      <p className="mt-1 text-sm text-neutral-500">
        {filtered.length} {filtered.length === 1 ? "entry" : "entries"} · Net {currency(filterTotal)}
      </p>

      <div className="mt-3 -mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2">
          <FilterChip label="All" active={filter === "all"} color={TEAL} onClick={() => setFilter("all")} />
          {activeCats.map((c) => (
            <FilterChip key={c.id} label={c.label} active={filter === c.id} color={c.color}
              onClick={() => setFilter(c.id)} />
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-5">
        {grouped.map(([date, list]) => (
          <div key={date}>
            <p className="mb-2 text-xs uppercase tracking-widest text-neutral-500">
              {new Date(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
            </p>
            <div className="space-y-2">
              {list.map((e) => {
                const cat = resolveCat(e.categoryId);
                const isIncome = e.type === "income";
                return (
                  <div key={e.id} className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                      style={{ background: `${cat.color}22`, color: cat.color }}>
                      <CatGlyph cat={cat} className="h-4 w-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-neutral-900">{e.title || cat.label}</p>
                      <p className="text-xs text-neutral-500">{cat.label}{e.note ? ` · ${e.note}` : ""}</p>
                    </div>
                    <p className="text-sm font-bold" style={{ color: isIncome ? "#16A34A" : "#0A0A0A" }}>
                      {isIncome ? "+" : ""}{currency(e.amount)}
                    </p>
                    <button onClick={() => onRemove(e.id)} aria-label="Delete"
                      className="ml-1 rounded-full p-1.5 text-neutral-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterChip({ label, active, color, onClick }: {
  label: string; active: boolean; color: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className="whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors"
      style={{
        borderColor: active ? color : "#E5E5E5",
        background: active ? `${color}18` : "#FFFFFF",
        color: active ? color : "#525252",
      }}>
      {label}
    </button>
  );
}

/* ---------------- Analytics ---------------- */

function Analytics({ expenses, resolveCat }: { expenses: Expense[]; resolveCat: (id: string) => Category }) {
  const months = useMemo(() => {
    const out: { key: string; label: string; total: number }[] = [];
    const d = new Date(); d.setDate(1);
    for (let i = 5; i >= 0; i--) {
      const md = new Date(d.getFullYear(), d.getMonth() - i, 1);
      const key = `${md.getFullYear()}-${String(md.getMonth() + 1).padStart(2, "0")}`;
      const total = expenses.filter((e) => monthKey(e.date) === key).reduce((a, b) => a + b.amount, 0);
      out.push({ key, label: md.toLocaleDateString("en-IN", { month: "short" }), total });
    }
    return out;
  }, [expenses]);
  const max = Math.max(1, ...months.map((m) => m.total));

  const byCat = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((e) => map.set(e.categoryId, (map.get(e.categoryId) ?? 0) + e.amount));
    const arr = [...map.entries()].map(([id, total]) => ({ cat: resolveCat(id), total }));
    const sum = arr.reduce((a, b) => a + b.total, 0) || 1;
    return arr.map((x) => ({ ...x, pct: Math.round((x.total / sum) * 100) })).sort((a, b) => b.total - a.total);
  }, [expenses, resolveCat]);

  const total = byCat.reduce((a, b) => a + b.total, 0);
  const avgMonth = Math.round(months.reduce((a, b) => a + b.total, 0) / 6);

  return (
    <div className="pb-24">
      <h2 className="mt-2 text-2xl font-bold text-neutral-900">Analytics</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatCard label="6-month total" value={currency(total)} />
        <StatCard label="Monthly average" value={currency(avgMonth)} />
      </div>

      <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4">
        <p className="text-sm font-semibold text-neutral-900">Last 6 months</p>
        <div className="mt-4 flex h-40 items-end gap-2">
          {months.map((m) => {
            const h = Math.round((m.total / max) * 100);
            return (
              <div key={m.key} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end">
                  <div className="w-full rounded-t-lg transition-all"
                    style={{ height: `${h}%`, background: `linear-gradient(180deg, ${TEAL}, ${DEEP})` }} />
                </div>
                <p className="text-[10px] font-medium text-neutral-500">{m.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <p className="text-sm font-semibold text-neutral-900">Category breakdown</p>
        {byCat.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">Add expenses to see the split.</p>
        ) : (
          <>
            <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-neutral-100">
              {byCat.map(({ cat, pct }) => (
                <div key={cat.id} style={{ width: `${pct}%`, background: cat.color }} />
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {byCat.map(({ cat, total, pct }) => (
                <div key={cat.id} className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: cat.color }} />
                  <p className="flex-1 text-sm text-neutral-800">{cat.label}</p>
                  <p className="text-sm font-semibold text-neutral-900">{currency(total)}</p>
                  <p className="w-10 text-right text-xs text-neutral-500">{pct}%</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-xs uppercase tracking-widest text-neutral-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-neutral-900">{value}</p>
    </div>
  );
}

/* ---------------- Add expense — fullscreen keypad ---------------- */

function AddExpenseFullScreen({
  open, onClose, onSave, categories, onManageCategories,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (e: Omit<Expense, "id">) => void;
  categories: Category[];
  onManageCategories: () => void;
}) {
  const [type, setType] = useState<TxType>("expense");
  const [amount, setAmount] = useState("0");   // string with optional single dot
  const [date, setDate]     = useState(todayISO());
  const [note, setNote]     = useState("");
  const [categoryId, setCategoryId] = useState<string>("doctor");
  const [noteOpen, setNoteOpen] = useState(false);
  const [catPickerOpen, setCatPickerOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const noteInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setType("expense"); setAmount("0"); setDate(todayISO());
      setNote(""); setCategoryId("doctor");
      setNoteOpen(false); setCatPickerOpen(false); setDatePickerOpen(false);
    }
  }, [open]);

  const press = (k: string) => {
    setAmount((prev) => {
      if (k === "back") return prev.length <= 1 ? "0" : prev.slice(0, -1);
      if (k === ".")    return prev.includes(".") ? prev : prev + ".";
      if (prev === "0") return k;
      // limit to 2 decimals
      if (prev.includes(".") && prev.split(".")[1].length >= 2) return prev;
      if (prev.replace(".", "").length >= 9) return prev;
      return prev + k;
    });
  };

  const numeric = Number(amount) || 0;
  const valid = numeric > 0;
  const cat = categories.find((c) => c.id === categoryId) ?? categories[0];

  const submit = () => {
    if (!valid) return;
    onSave({
      type,
      amount: Math.round(numeric * 100) / 100,
      categoryId,
      date,
      note: note.trim() || undefined,
      title: note.trim() || undefined,
    });
  };

  const dateLabel = (() => {
    const d = new Date(date);
    if (date === todayISO()) return `Today, ${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  })();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="fixed inset-0 z-[90] flex flex-col bg-white">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 pt-4">
            <button onClick={onClose} aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
              <X className="h-4 w-4" />
            </button>
            <div className="rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-semibold text-neutral-900">
              Add expense
            </div>
            <div className="h-9 w-9" />
          </div>


          {/* Amount */}
          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-neutral-300">₹</span>
              <span className="text-6xl font-bold tracking-tight text-neutral-900">
                {formatAmountDisplay(amount)}
              </span>
              <button onClick={() => press("back")} aria-label="Backspace"
                className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                <Delete className="h-4 w-4" />
              </button>
            </div>

            {noteOpen ? (
              <input
                ref={noteInputRef}
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 60))}
                onBlur={() => { if (!note) setNoteOpen(false); }}
                placeholder="Add a note"
                className="mt-6 w-64 rounded-full border border-neutral-200 bg-white px-4 py-2 text-center text-sm font-semibold uppercase tracking-widest text-neutral-800 outline-none"
              />
            ) : (
              <button onClick={() => { setNoteOpen(true); setTimeout(() => noteInputRef.current?.focus(), 40); }}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-500">
                <span className="inline-block">≡</span> {note || "Add Note"}
              </button>
            )}
          </div>

          {/* Date + Category pills */}
          <div className="px-4">
            <div className="flex items-center gap-2">
              <button onClick={() => setDatePickerOpen(true)}
                className="flex flex-1 items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-3 text-sm font-semibold text-neutral-900">
                <CalendarIcon className="h-4 w-4 text-neutral-500" /> {dateLabel}
              </button>
              <button onClick={() => setCatPickerOpen(true)}
                className="flex flex-1 items-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold"
                style={{
                  borderColor: `${cat.color}55`,
                  background: `${cat.color}12`,
                  color: cat.color,
                }}>
                <span className="text-base"><CatGlyph cat={cat} className="h-4 w-4" /></span>
                <span className="truncate">{cat.label}</span>
              </button>
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 px-4 py-4">
            {["1","2","3","4","5","6","7","8","9",".","0"].map((k) => (
              <button key={k} onClick={() => press(k)}
                className="rounded-2xl bg-neutral-100 py-4 text-2xl font-semibold text-neutral-900 active:bg-neutral-200">
                {k}
              </button>
            ))}
            <button onClick={submit} disabled={!valid}
              className="flex items-center justify-center rounded-2xl py-4 text-white transition-opacity disabled:opacity-40"
              style={{ background: valid ? "#171717" : "#525252" }}>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                <Check className="h-5 w-5 text-neutral-900" />
              </span>
            </button>
          </div>

          {/* Date sheet — iOS-style calendar */}
          <AnimatePresence>
            {datePickerOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setDatePickerOpen(false)}
                  className="absolute inset-0 z-[95] bg-black/30" />
                <motion.div
                  initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  className="absolute inset-x-3 bottom-3 z-[96] rounded-3xl bg-white p-3 shadow-2xl"
                >
                  <Calendar
                    mode="single"
                    selected={new Date(date)}
                    onSelect={(d) => {
                      if (d) {
                        const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
                          .toISOString().slice(0, 10);
                        setDate(iso);
                        setDatePickerOpen(false);
                      }
                    }}
                    disabled={(d) => d > new Date()}
                    initialFocus
                    className="pointer-events-auto w-full rounded-2xl p-2"
                    classNames={{
                      months: "flex flex-col w-full",
                      month: "space-y-3 w-full",
                      table: "w-full border-collapse",
                      head_row: "grid grid-cols-7 w-full",
                      head_cell: "text-muted-foreground font-normal text-[0.75rem] text-center",
                      row: "grid grid-cols-7 w-full mt-1",
                      cell: "aspect-square w-full text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent/40 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-full w-full p-0 font-normal rounded-lg hover:bg-neutral-100 aria-selected:opacity-100",
                      day_selected: "bg-[#F66B9A] text-white hover:bg-[#F66B9A] hover:text-white focus:bg-[#F66B9A] focus:text-white",
                      day_today: "bg-neutral-100 text-neutral-900",
                    }}
                  />

                </motion.div>
              </>
            )}
          </AnimatePresence>


          {/* Category picker — right-anchored floating stack */}
          <AnimatePresence>
            {catPickerOpen && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-10"
                onClick={() => setCatPickerOpen(false)}
              >
                <div
                  className="absolute right-3 flex max-h-[70vh] flex-col items-end gap-2 overflow-y-auto pr-1"
                  style={{ top: "18%" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.button
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    onClick={() => { setCatPickerOpen(false); onManageCategories(); }}
                    className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm"
                  >
                    <Settings2 className="h-4 w-4" /> Edit
                  </motion.button>
                  {categories.map((c, i) => {
                    const sel = c.id === categoryId;
                    return (
                      <motion.button
                        key={c.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.02 * (i + 1) }}
                        onClick={() => { setCategoryId(c.id); setCatPickerOpen(false); }}
                        className="flex items-center gap-2 rounded-2xl border bg-white px-4 py-2.5 text-sm font-semibold shadow-sm"
                        style={{
                          borderColor: sel ? c.color : "#E5E5E5",
                          color: sel ? c.color : "#171717",
                          background: sel ? `${c.color}12` : "#fff",
                        }}
                      >
                        <CatGlyph cat={c} className="h-4 w-4" />
                        <span>{c.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

function formatAmountDisplay(raw: string) {
  if (raw === "0" || raw === "") return "0";
  if (raw.endsWith(".")) return raw;
  const [i, d] = raw.split(".");
  const withComma = Number(i).toLocaleString("en-IN");
  return d !== undefined ? `${withComma}.${d}` : withComma;
}

function TypeTab({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
      style={{
        background: active ? "#FFFFFF" : "transparent",
        color: active ? "#0A0A0A" : "#737373",
        boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
      }}>
      {children}
    </button>
  );
}

/* ---------------- Reusable simple bottom sheet ---------------- */

function SimpleSheet({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 z-[95] bg-black/40" />
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="absolute inset-x-0 bottom-0 z-[96] max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 shadow-2xl">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-200" />
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900">{title}</h3>
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Categories management sheet ---------------- */

function CategoriesSheet({
  open, onClose, categories, customCategories, onAdd, onRemove,
}: {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  customCategories: Category[];
  onAdd: (c: Omit<Category, "id" | "builtin">) => void;
  onRemove: (id: string) => void;
}) {
  const [label, setLabel] = useState("");
  const [emoji, setEmoji] = useState("🩺");
  const [color, setColor] = useState(PALETTE[0]);

  useEffect(() => {
    if (open) { setLabel(""); setEmoji("🩺"); setColor(PALETTE[0]); }
  }, [open]);

  const canAdd = label.trim().length > 0;
  const submit = () => {
    if (!canAdd) return;
    onAdd({ label: label.trim().slice(0, 24), emoji, color });
    setLabel("");
  };

  const suggestedFiltered = SUGGESTED.filter(
    (s) => !categories.some((c) => c.label.toLowerCase() === s.label.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-[100] bg-black/40" />
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[101] mx-auto max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 shadow-2xl">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-200" />
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900">Categories</h2>
              <button onClick={onClose} aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Add new */}
            <div className="mt-5 rounded-2xl border border-neutral-200 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">Add category</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value.slice(0, 2) || "🩺")}
                  className="h-11 w-14 rounded-xl border border-neutral-200 text-center text-xl outline-none"
                  aria-label="Emoji"
                />
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value.slice(0, 24))}
                  placeholder="Category name (e.g. Physio)"
                  className="h-11 flex-1 rounded-xl border border-neutral-200 px-3 text-sm font-medium outline-none"
                />
                <button onClick={submit} disabled={!canAdd}
                  className="h-11 rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-40"
                  style={{ background: TEAL }}>
                  Add
                </button>
              </div>
              <div className="mt-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">Color</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PALETTE.map((p) => (
                    <button key={p} onClick={() => setColor(p)}
                      aria-label={`Color ${p}`}
                      className="h-7 w-7 rounded-full ring-2 ring-offset-2"
                      style={{ background: p, boxShadow: color === p ? `0 0 0 2px ${p}` : "none", ["--tw-ring-color" as any]: color === p ? p : "transparent" }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Existing */}
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-widest text-neutral-500">Your categories</p>
            <div className="mt-2 divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-white">
              {categories.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
                    style={{ background: `${c.color}22`, color: c.color }}>
                    <CatGlyph cat={c} className="h-4 w-4" />
                  </span>
                  <p className="flex-1 text-sm font-semibold text-neutral-900">{c.label}</p>
                  {c.builtin ? (
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Built-in</span>
                  ) : (
                    <button onClick={() => onRemove(c.id)}
                      className="rounded-full bg-red-50 p-2 text-red-500"
                      aria-label={`Delete ${c.label}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Suggested */}
            {suggestedFiltered.length > 0 && (
              <>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-widest text-neutral-500">Suggested</p>
                <div className="mt-2 divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-white">
                  {suggestedFiltered.map((s) => (
                    <div key={s.label} className="flex items-center gap-3 p-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
                        style={{ background: `${s.color}22` }}>
                        {s.emoji}
                      </span>
                      <p className="flex-1 text-sm font-semibold text-neutral-900">{s.label}</p>
                      <button onClick={() => onAdd({ label: s.label, emoji: s.emoji, color: s.color })}
                        className="rounded-full border border-neutral-200 p-2 text-neutral-700"
                        aria-label={`Add ${s.label}`}>
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
