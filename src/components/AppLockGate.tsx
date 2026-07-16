import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, X } from "lucide-react";
import { useAppLock } from "@/contexts/AppLockContext";
import { getMiniApp } from "@/data/miniApps";

interface Props {
  appId: string;
  children: ReactNode;
}

export default function AppLockGate({ appId, children }: Props) {
  const { isAppLocked, unlockApp, hasPin } = useAppLock();
  const navigate = useNavigate();
  const [entered, setEntered] = useState("");
  const [error, setError] = useState(false);

  const app = getMiniApp(appId);

  if (!hasPin || !isAppLocked(appId)) return <>{children}</>;

  const submit = () => {
    if (entered.length !== 4) return;
    if (unlockApp(appId, entered)) {
      setEntered("");
      setError(false);
    } else {
      setError(true);
      setEntered("");
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-8">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 w-10 h-10 rounded-full bg-muted flex items-center justify-center"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="w-16 h-16 rounded-2xl bg-[#F66B9A]/12 flex items-center justify-center mb-5">
        <Lock className="w-7 h-7 text-[#F66B9A]" />
      </div>
      <h2 className="text-2xl font-bold mb-1">{app?.name ?? "App"} is locked</h2>
      <p className="text-sm text-muted-foreground mb-8">Enter your 4-digit PIN to continue</p>

      <div className={`flex gap-3 mb-6 ${error ? "animate-shake" : ""}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 ${
              entered.length > i ? "bg-[#F66B9A] border-[#F66B9A]" : "border-muted-foreground/40"
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-[260px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            onClick={() => entered.length < 4 && setEntered(entered + n)}
            className="h-14 rounded-2xl bg-muted text-xl font-semibold active:bg-muted/60"
          >
            {n}
          </button>
        ))}
        <div />
        <button
          onClick={() => entered.length < 4 && setEntered(entered + "0")}
          className="h-14 rounded-2xl bg-muted text-xl font-semibold active:bg-muted/60"
        >
          0
        </button>
        <button
          onClick={() => setEntered(entered.slice(0, -1))}
          className="h-14 rounded-2xl text-sm font-medium text-muted-foreground"
        >
          Delete
        </button>
      </div>

      <button
        onClick={submit}
        disabled={entered.length !== 4}
        className="mt-6 w-full max-w-[260px] py-3 rounded-2xl bg-[#F66B9A] text-white font-semibold disabled:opacity-40"
      >
        Unlock
      </button>
    </div>
  );
}
