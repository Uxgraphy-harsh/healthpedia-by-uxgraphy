import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";
import {
  Wallet, BarChart3, List, Plus, ArrowUpRight, ArrowDownRight,
  Stethoscope, Pill, FlaskConical, ShieldCheck, HeartPulse, Hospital,
  Sparkles, Trash2, X,
} from "lucide-react";

const TEAL = "#0EA5A5";
const DEEP = "#0B4B4B";
const RED = "#DC2626";
const GREEN = "#16A34A";

interface Category {
  id: string;
  label: string;
  icon: typeof Pill;
  color: string;
}

const CATEGORIES: Category[] = [
  { id: "doctor",     label: "Doctor",     icon: Stethoscope,  color: "#60A5FA" },
  { id: "medicine",   label: "Medicine",   icon: Pill,         color: "#F66B9A" },
  { id: "tests",      label: "Tests",      icon: FlaskConical, color: "#8B5CF6" },
  { id: "insurance",  label: "Insurance",  icon: ShieldCheck,  color: "#22C55E" },
  { id: "hospital",   label: "Hospital",   icon: Hospital,     color: "#EF4E3B" },
  { id: "wellness",   label: "Wellness",   icon: HeartPulse,   color: "#F59E0B" },
  { id: "other",      label: "Other",      icon: Sparkles,     color: "#737373" },
];
const catById = (id: string) => CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[6];

interface Expense {
  id: string;
  title: string;
  amount: number;
  categoryId: string;
  date: string; // ISO yyyy-mm-dd
  note?: string;
}

const LS_EXPENSES = "budget.expenses.v1";
const LS_BUDGET   = "budget.monthly.v1";

const currency = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const todayISO = () => new Date().toISOString().slice(0, 10);
const monthKey = (d: string) => d.slice(0, 7); // yyyy-mm

const SEED: Expense[] = [
  { id: "s1", title: "General physician visit", amount: 800,  categoryId: "doctor",    date: todayISO() },
  { id: "s2", title: "Vitamin D supplements",   amount: 450,  categoryId: "medicine",  date: todayISO() },
  { id: "s3", title: "Blood test — CBC",        amount: 620,  categoryId: "tests",     date: todayISO() },
];

type View = "overview" | "expenses" | "analytics";

export default function Budget() {
  const app = getMiniApp("budget")!;
  const [view, setView] = useState<View>("overview");
  const [addOpen, setAddOpen] = useState(false);

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const raw = localStorage.getItem(LS_EXPENSES);
      if (raw) return JSON.parse(raw) as Expense[];
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
    () => expenses.filter((e) => monthKey(e.date) === thisMonth),
    [expenses, thisMonth]
  );
  const monthTotal = monthExpenses.reduce((a, b) => a + b.amount, 0);

  // last month for delta
  const [ly, lm] = (() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1);
    return [d.getFullYear(), d.getMonth() + 1];
  })();
  const lastMonthKey = `${ly}-${String(lm).padStart(2, "0")}`;
  const lastMonthTotal = expenses
    .filter((e) => monthKey(e.date) === lastMonthKey)
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
          monthTotal={monthTotal}
          budget={monthlyBudget}
          setBudget={setMonthlyBudget}
          deltaPct={deltaPct}
          expenses={monthExpenses}
        />
      )}
      {view === "expenses" && (
        <ExpensesList expenses={expenses} onRemove={removeExpense} />
      )}
      {view === "analytics" && (
        <Analytics expenses={expenses} />
      )}

      <AddExpenseSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(e) => { addExpense(e); setAddOpen(false); }}
      />
    </MiniAppShell>
  );
}

/* ---------------- Overview ---------------- */

function Overview({ monthTotal, budget, setBudget, deltaPct, expenses }: {
  monthTotal: number; budget: number; setBudget: (n: number) => void;
  deltaPct: number; expenses: Expense[];
}) {
  const pct = Math.min(100, budget ? Math.round((monthTotal / budget) * 100) : 0);
  const remaining = Math.max(0, budget - monthTotal);
  const over = monthTotal > budget;

  const byCat = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((e) => map.set(e.categoryId, (map.get(e.categoryId) ?? 0) + e.amount));
    return [...map.entries()]
      .map(([id, total]) => ({ cat: catById(id), total }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(budget));
  useEffect(() => setDraft(String(budget)), [budget]);

  return (
    <div className="pb-24">
      <h2 className="mt-2 text-2xl font-bold text-neutral-900">This month</h2>
      <p className="mt-1 text-sm text-neutral-500">
        {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
      </p>

      {/* Hero card */}
      <div
        className="mt-4 overflow-hidden rounded-3xl p-5 text-white"
        style={{ background: `linear-gradient(135deg, ${DEEP}, ${TEAL})` }}
      >
        <p className="text-xs uppercase tracking-widest opacity-80">Total spent</p>
        <p className="mt-2 text-5xl font-bold tracking-tight">{currency(monthTotal)}</p>

        <div className="mt-4 flex items-center gap-2 text-xs">
          {deltaPct === 0 ? (
            <span className="opacity-80">No change vs last month</span>
          ) : deltaPct > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1">
              <ArrowUpRight className="h-3 w-3" /> {deltaPct}% vs last month
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1">
              <ArrowDownRight className="h-3 w-3" /> {Math.abs(deltaPct)}% vs last month
            </span>
          )}
        </div>

        {/* progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs opacity-90">
            <span>{pct}% of budget</span>
            <span>{currency(budget)}</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, background: over ? "#FCA5A5" : "#FFFFFF" }}
            />
          </div>
          <p className="mt-2 text-xs opacity-90">
            {over
              ? `Over budget by ${currency(monthTotal - budget)}`
              : `${currency(remaining)} left this month`}
          </p>
        </div>
      </div>

      {/* Budget row */}
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500">Monthly budget</p>
          {editing ? (
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-semibold text-neutral-900">₹</span>
              <input
                autoFocus
                type="number"
                min={0}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-28 rounded-lg border border-neutral-200 px-2 py-1 text-base font-semibold outline-none focus:border-[color:var(--teal)]"
                style={{ ["--teal" as any]: TEAL }}
              />
            </div>
          ) : (
            <p className="mt-1 text-lg font-bold text-neutral-900">{currency(budget)}</p>
          )}
        </div>
        {editing ? (
          <button
            onClick={() => { setBudget(Math.max(0, Number(draft) || 0)); setEditing(false); }}
            className="rounded-full px-4 py-2 text-xs font-semibold text-white"
            style={{ background: TEAL }}
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700"
          >
            Edit
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mt-5">
        <p className="text-sm font-semibold text-neutral-900">By category</p>
        {byCat.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
            No expenses this month yet. Tap + to add one.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {byCat.map(({ cat, total }) => {
              const p = monthTotal ? Math.round((total / monthTotal) * 100) : 0;
              const Icon = cat.icon;
              return (
                <div key={cat.id} className="rounded-2xl border border-neutral-200 bg-white p-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{ background: `${cat.color}22`, color: cat.color }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-neutral-900">{cat.label}</p>
                        <p className="text-sm font-bold text-neutral-900">{currency(total)}</p>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                        <div className="h-full rounded-full" style={{ width: `${p}%`, background: cat.color }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Expenses list ---------------- */

function ExpensesList({ expenses, onRemove }: {
  expenses: Expense[]; onRemove: (id: string) => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, Expense[]>();
    [...expenses]
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .forEach((e) => {
        const list = map.get(e.date) ?? [];
        list.push(e);
        map.set(e.date, list);
      });
    return [...map.entries()];
  }, [expenses]);

  if (expenses.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-neutral-200 p-10 text-center">
        <Wallet className="h-10 w-10" style={{ color: TEAL }} />
        <p className="mt-4 text-lg font-bold text-neutral-900">No expenses yet</p>
        <p className="mt-1 text-sm text-neutral-500">Tap the + button to log your first one.</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <h2 className="mt-2 text-2xl font-bold text-neutral-900">All expenses</h2>
      <div className="mt-4 space-y-5">
        {grouped.map(([date, list]) => (
          <div key={date}>
            <p className="mb-2 text-xs uppercase tracking-widest text-neutral-500">
              {new Date(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
            </p>
            <div className="space-y-2">
              {list.map((e) => {
                const cat = catById(e.categoryId);
                const Icon = cat.icon;
                return (
                  <div key={e.id} className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: `${cat.color}22`, color: cat.color }}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-neutral-900">{e.title}</p>
                      <p className="text-xs text-neutral-500">{cat.label}</p>
                    </div>
                    <p className="text-sm font-bold text-neutral-900">{currency(e.amount)}</p>
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

/* ---------------- Analytics ---------------- */

function Analytics({ expenses }: { expenses: Expense[] }) {
  // Last 6 months totals
  const months = useMemo(() => {
    const out: { key: string; label: string; total: number }[] = [];
    const d = new Date();
    d.setDate(1);
    for (let i = 5; i >= 0; i--) {
      const md = new Date(d.getFullYear(), d.getMonth() - i, 1);
      const key = `${md.getFullYear()}-${String(md.getMonth() + 1).padStart(2, "0")}`;
      const total = expenses
        .filter((e) => monthKey(e.date) === key)
        .reduce((a, b) => a + b.amount, 0);
      out.push({ key, label: md.toLocaleDateString("en-IN", { month: "short" }), total });
    }
    return out;
  }, [expenses]);
  const max = Math.max(1, ...months.map((m) => m.total));

  // All-time by category
  const byCat = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((e) => map.set(e.categoryId, (map.get(e.categoryId) ?? 0) + e.amount));
    const arr = [...map.entries()].map(([id, total]) => ({ cat: catById(id), total }));
    const sum = arr.reduce((a, b) => a + b.total, 0) || 1;
    return arr
      .map((x) => ({ ...x, pct: Math.round((x.total / sum) * 100) }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  const total = byCat.reduce((a, b) => a + b.total, 0);
  const avgMonth = Math.round(months.reduce((a, b) => a + b.total, 0) / 6);

  return (
    <div className="pb-24">
      <h2 className="mt-2 text-2xl font-bold text-neutral-900">Analytics</h2>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatCard label="6-month total"  value={currency(total)} />
        <StatCard label="Monthly average" value={currency(avgMonth)} />
      </div>

      {/* Bar chart */}
      <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4">
        <p className="text-sm font-semibold text-neutral-900">Last 6 months</p>
        <div className="mt-4 flex h-40 items-end gap-2">
          {months.map((m) => {
            const h = Math.round((m.total / max) * 100);
            return (
              <div key={m.key} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{ height: `${h}%`, background: `linear-gradient(180deg, ${TEAL}, ${DEEP})` }}
                    title={currency(m.total)}
                  />
                </div>
                <p className="text-[10px] font-medium text-neutral-500">{m.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <p className="text-sm font-semibold text-neutral-900">Category breakdown</p>
        {byCat.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">Add expenses to see the split.</p>
        ) : (
          <>
            {/* Stacked bar */}
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

/* ---------------- Add expense bottom sheet ---------------- */

function AddExpenseSheet({ open, onClose, onSave }: {
  open: boolean; onClose: () => void; onSave: (e: Omit<Expense, "id">) => void;
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string>("doctor");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(""); setAmount(""); setCategoryId("doctor"); setDate(todayISO()); setNote("");
    }
  }, [open]);

  const valid = title.trim().length > 0 && Number(amount) > 0;
  const handleSave = () => {
    if (!valid) return;
    onSave({
      title: title.trim().slice(0, 80),
      amount: Math.round(Number(amount)),
      categoryId,
      date,
      note: note.trim().slice(0, 200) || undefined,
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/40"
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[90] mx-auto max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-200" />
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900">Add expense</h2>
              <button onClick={onClose} aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-neutral-200 p-4">
              <label className="text-[11px] uppercase tracking-widest text-neutral-500">Amount</label>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-neutral-500">₹</span>
                <input
                  autoFocus
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, "").slice(0, 8))}
                  placeholder="0"
                  className="w-full bg-transparent text-3xl font-bold text-neutral-900 outline-none placeholder:text-neutral-300"
                />
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-neutral-200 px-4 py-3">
              <label className="text-[11px] uppercase tracking-widest text-neutral-500">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 80))}
                placeholder="e.g. Cardiologist consultation"
                className="mt-0.5 block w-full bg-transparent text-sm font-medium text-neutral-900 outline-none placeholder:text-neutral-400"
              />
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">Category</p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const sel = categoryId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCategoryId(c.id)}
                    className="flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 transition-colors"
                    style={{
                      borderColor: sel ? c.color : "#E5E5E5",
                      background: sel ? `${c.color}18` : "transparent",
                    }}
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{ background: `${c.color}22`, color: c.color }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] font-medium text-neutral-800">{c.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="rounded-2xl border border-neutral-200 px-4 py-3">
                <label className="text-[11px] uppercase tracking-widest text-neutral-500">Date</label>
                <input
                  type="date"
                  value={date}
                  max={todayISO()}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-0.5 block w-full bg-transparent text-sm font-medium text-neutral-900 outline-none"
                />
              </div>
              <div className="rounded-2xl border border-neutral-200 px-4 py-3">
                <label className="text-[11px] uppercase tracking-widest text-neutral-500">Note (optional)</label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 200))}
                  placeholder="Add a small note"
                  className="mt-0.5 block w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!valid}
              className="mt-6 w-full rounded-xl py-3.5 text-sm font-semibold text-white disabled:opacity-40"
              style={{ background: TEAL }}
            >
              Save expense
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
