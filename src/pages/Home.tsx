import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BellRing, ChevronRight } from "lucide-react";
import { miniApps } from "@/data/miniApps";
import { useAppLock } from "@/contexts/AppLockContext";
import { Lock } from "lucide-react";
import askAiFlower from "@/assets/ask-ai-flower.svg";

const todayReminders = [
  { id: "r1", title: "Metformin 500mg", time: "8:00 AM", tag: "Medication" },
  { id: "r2", title: "Dr. Sharma – Follow up", time: "2:30 PM", tag: "Appointment" },
];

const aiSuggestions = [
  "Summarise my last blood report",
  "What's due today?",
  "Log a headache — severity 5",
  "Show my thyroid trend",
];

export default function Home() {
  const navigate = useNavigate();
  const { lockedApps, hasPin } = useAppLock();

  const featured = miniApps.slice(0, 8);
  const rest = miniApps.slice(8);

  return (
    <div className="mobile-container pb-28 min-h-[100dvh]">
      {/* ─── HEADER ─── */}
      <div className="px-5 pt-6 pb-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Good morning
          </p>
          <h1 className="text-2xl font-bold leading-tight">Sarah</h1>
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
        >
          <img src={askAiFlower} alt="" className="w-6 h-6" />
        </button>
      </div>

      {/* ─── AI PROMPT (hero) ─── */}
      <div className="px-5">
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate("/chat")}
          className="w-full text-left rounded-3xl p-5 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, hsl(340 100% 82%) 0%, hsl(340 100% 76%) 55%, hsl(210 95% 78%) 100%)",
            boxShadow: "0 20px 40px -20px hsl(340 100% 60% / 0.45)",
          }}
        >
          <img
            src={askAiFlower}
            alt=""
            className="absolute -right-6 -bottom-6 w-40 h-40 opacity-30"
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-white/90">
                Ask AI
              </span>
            </div>
            <p className="text-lg font-semibold text-white leading-snug mb-5">
              What would you like to do with your health today?
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-white/80">Type or tap a suggestion</span>
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-[#F66B9A]" />
              </div>
            </div>
          </div>
        </motion.button>

        {/* AI suggestions */}
        <div className="flex gap-2 overflow-x-auto mt-3 -mx-5 px-5 pb-1">
          {aiSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => navigate("/chat")}
              className="shrink-0 rounded-full border border-border/60 bg-card px-3.5 py-1.5 text-xs font-medium text-foreground/80"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ─── TODAY ─── */}
      <section className="px-5 mt-6">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Today
          </h2>
          <button
            onClick={() => navigate("/reminders")}
            className="text-xs text-muted-foreground font-medium flex items-center gap-0.5"
          >
            View all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-2">
          {todayReminders.map((r) => (
            <div
              key={r.id}
              className="bg-card rounded-2xl p-3.5 flex items-center gap-3 border border-border/40"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/12 flex items-center justify-center">
                <BellRing className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{r.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {r.time} • {r.tag}
                </p>
              </div>
              <button className="w-7 h-7 rounded-full border-2 border-border" />
            </div>
          ))}
        </div>
      </section>

      {/* ─── MINI APPS ─── */}
      <section className="px-5 mt-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Mini apps
          </h2>
          <button
            onClick={() => navigate("/apps")}
            className="text-xs text-muted-foreground font-medium flex items-center gap-0.5"
          >
            All apps <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {featured.map((app) => {
            const locked = hasPin && lockedApps.includes(app.id);
            return (
              <button
                key={app.id}
                onClick={() => navigate(app.path)}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className={`w-full aspect-square rounded-2xl ${app.bg} flex items-center justify-center relative`}
                >
                  <app.icon className={`w-6 h-6 ${app.fg}`} />
                  {locked && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-background flex items-center justify-center">
                      <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-medium text-center leading-tight">
                  {app.name}
                </span>
              </button>
            );
          })}
        </div>

        {rest.length > 0 && (
          <button
            onClick={() => navigate("/apps")}
            className="w-full mt-4 py-3 rounded-2xl bg-muted/60 text-sm font-medium text-muted-foreground"
          >
            + {rest.length} more apps
          </button>
        )}
      </section>
    </div>
  );
}
