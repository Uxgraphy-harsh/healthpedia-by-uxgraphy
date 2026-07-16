import { useNavigate } from "react-router-dom";
import { ChevronLeft, Lock } from "lucide-react";
import { miniApps, type MiniApp } from "@/data/miniApps";
import { useAppLock } from "@/contexts/AppLockContext";

const categoryLabels: Record<MiniApp["category"], string> = {
  records: "Records",
  care: "Care & schedule",
  tracking: "Tracking",
  people: "People",
  utility: "Utility",
};

export default function Apps() {
  const navigate = useNavigate();
  const { hasPin, lockedApps } = useAppLock();

  const grouped = miniApps.reduce<Record<string, MiniApp[]>>((acc, app) => {
    (acc[app.category] ??= []).push(app);
    return acc;
  }, {});

  return (
    <div className="mobile-container pb-28 min-h-[100dvh]">
      <div className="px-5 pt-6 pb-2 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">All apps</h1>
          <p className="text-[11px] text-muted-foreground">
            {miniApps.length} mini apps · long-press to lock
          </p>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-6">
        {(Object.keys(grouped) as MiniApp["category"][]).map((cat) => (
          <section key={cat}>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              {categoryLabels[cat]}
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {grouped[cat].map((app) => {
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
          </section>
        ))}
      </div>
    </div>
  );
}
