import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Lock, LockOpen, Shield } from "lucide-react";
import { useAppLock } from "@/contexts/AppLockContext";
import { miniApps } from "@/data/miniApps";
import { Switch } from "@/components/ui/switch";

export default function AppLockSettings() {
  const navigate = useNavigate();
  const { hasPin, setPin, clearPin, lockedApps, toggleAppLock, lockAllNow } = useAppLock();
  const [entering, setEntering] = useState(false);
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [err, setErr] = useState("");

  const submitNewPin = () => {
    if (!/^\d{4}$/.test(p1)) return setErr("PIN must be 4 digits");
    if (p1 !== p2) return setErr("PINs don't match");
    setPin(p1);
    setEntering(false);
    setP1(""); setP2(""); setErr("");
  };

  const lockable = miniApps.filter((a) => a.lockable);

  return (
    <div className="mobile-container pb-20 min-h-[100dvh]">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">App lock</h1>
          <p className="text-[11px] text-muted-foreground">Protect sensitive mini apps with a PIN</p>
        </div>
      </div>

      <div className="px-5 space-y-4">
        <div className="rounded-2xl bg-card border border-border/40 p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#F66B9A]/12 flex items-center justify-center">
            {hasPin ? <Lock className="w-5 h-5 text-[#F66B9A]" /> : <LockOpen className="w-5 h-5 text-muted-foreground" />}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{hasPin ? "PIN is set" : "No PIN set"}</p>
            <p className="text-[11px] text-muted-foreground">
              {hasPin ? "Locked apps ask for this PIN when opened" : "Add a 4-digit PIN to enable app locking"}
            </p>
          </div>
          {hasPin ? (
            <button onClick={() => { if (confirm("Remove PIN? All apps will be unlocked.")) clearPin(); }} className="text-[11px] font-semibold text-[#EF4444]">Remove</button>
          ) : (
            <button onClick={() => setEntering(true)} className="text-[11px] font-semibold text-[#F66B9A]">Set PIN</button>
          )}
        </div>

        {entering && (
          <div className="rounded-2xl bg-muted/40 p-4 space-y-2">
            <input value={p1} onChange={(e) => setP1(e.target.value.replace(/\D/g, "").slice(0, 4))} type="password" inputMode="numeric" placeholder="New 4-digit PIN" className="w-full rounded-xl bg-background p-3 text-sm outline-none" />
            <input value={p2} onChange={(e) => setP2(e.target.value.replace(/\D/g, "").slice(0, 4))} type="password" inputMode="numeric" placeholder="Confirm PIN" className="w-full rounded-xl bg-background p-3 text-sm outline-none" />
            {err && <p className="text-[11px] text-[#EF4444]">{err}</p>}
            <button onClick={submitNewPin} className="w-full py-2.5 rounded-xl bg-[#F66B9A] text-white text-sm font-semibold">Save PIN</button>
          </div>
        )}

        {hasPin && (
          <>
            <button onClick={lockAllNow} className="w-full py-3 rounded-2xl bg-muted text-sm font-semibold flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" /> Lock all now
            </button>

            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground pt-2">
              Lockable apps
            </h3>
            <div className="space-y-2">
              {lockable.map((a) => (
                <div key={a.id} className="bg-card rounded-2xl p-3.5 flex items-center gap-3 border border-border/40">
                  <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center`}>
                    <a.icon className={`w-4 h-4 ${a.fg}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{a.name}</p>
                    <p className="text-[11px] text-muted-foreground">{a.tagline}</p>
                  </div>
                  <Switch checked={lockedApps.includes(a.id)} onCheckedChange={() => toggleAppLock(a.id)} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
