import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, LockOpen, type LucideIcon } from "lucide-react";
import {
  ClockCounterClockwise,
  Gear,
  Bell,
  UserCircle,
  DotsNine,
  X as XIcon,
} from "@phosphor-icons/react";
import { useAppLock } from "@/contexts/AppLockContext";
import MiniAppBottomBar, { type MiniAppAction } from "@/components/MiniAppBottomBar";
import { defaultBottomActions } from "@/data/miniAppActions";
import AppLauncher from "@/components/AppLauncher";
import askAiFlower from "@/assets/ask-ai-flower.svg";


interface Props {
  appId: string;
  name: string;
  tagline?: string;
  icon: LucideIcon;
  bg: string;
  fg: string;
  children: ReactNode;
  action?: ReactNode;
  bottomActions?: MiniAppAction[];
}

export default function MiniAppShell({
  appId, name, tagline, icon: Icon, bg, fg, children, action, bottomActions,
}: Props) {
  const navigate = useNavigate();
  const { hasPin, lockedApps, toggleAppLock } = useAppLock();
  const isLocked = lockedApps.includes(appId);
  const bar = bottomActions ?? defaultBottomActions[appId];

  const [showLauncher, setShowLauncher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className={`mobile-container ${bar ? "pb-28" : "pb-10"} min-h-[100dvh]`}>
      <header className="relative z-10 flex items-center justify-between px-4 pb-3 pt-4">
        <div
          className="flex items-center gap-1 rounded-full border p-1 backdrop-blur-xl"
          style={{
            background: "hsl(var(--card) / 0.55)",
            borderColor: "hsl(var(--border) / 0.55)",
            boxShadow: "inset 0 1px 0 hsl(var(--card) / 0.75)",
          }}
        >
          <button
            onClick={() => setShowLauncher(true)}
            className={`flex h-9 w-9 items-center justify-center rounded-full ${bg}`}
            aria-label="Switch mini app"
          >
            <Icon className={`h-5 w-5 ${fg}`} />
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/50"
            aria-label="Ask AI"
          >
            <img src={askAiFlower} alt="" className="h-5 w-5" />
          </button>
        </div>

        <div
          className="flex items-center gap-1 rounded-full border p-1 backdrop-blur-xl"
          style={{
            background: "hsl(var(--card) / 0.55)",
            borderColor: "hsl(var(--border) / 0.55)",
            boxShadow: "inset 0 1px 0 hsl(var(--card) / 0.75)",
          }}
        >
          <button
            onClick={() => navigate("/chat")}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/50"
            aria-label="Chat history"
          >
            <ClockCounterClockwise size={19} weight="regular" className="text-foreground/80" />
          </button>


          <button
            onClick={() => setShowNotifications(true)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/50"
            aria-label="Notifications"
          >
            <Bell size={19} weight="regular" className="text-foreground/80" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#F66B9A]" />
          </button>
          {hasPin && (
            <button
              onClick={() => toggleAppLock(appId)}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/50"
              aria-label={isLocked ? "Remove PIN lock" : "Add PIN lock"}
            >
              {isLocked
                ? <Lock className="h-4 w-4 text-[#F66B9A]" />
                : <LockOpen className="h-4 w-4 text-foreground/70" />}
            </button>
          )}
          <button
            onClick={() => navigate("/settings/app-lock")}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/50"
            aria-label="Settings"
          >
            <Gear size={19} weight="regular" className="text-foreground/80" />
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/50"
            aria-label="Profile"
          >
            <UserCircle size={22} weight="fill" className="text-[#60A5FA]" />
          </button>
        </div>
      </header>

      <div className="px-5 pt-1 pb-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-tight truncate">{name}</h1>
          {tagline && <p className="text-[12px] text-muted-foreground truncate">{tagline}</p>}
        </div>
        {action}
      </div>

      <div className="px-5">{children}</div>

      {bar && <MiniAppBottomBar actions={bar} accent={fg} />}

      <AppLauncher open={showLauncher} onClose={() => setShowLauncher(false)} />

      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/40"
              onClick={() => setShowNotifications(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-x-0 bottom-0 z-[70] mx-auto w-full max-w-md rounded-t-3xl bg-background p-5 pb-8 shadow-2xl"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted" />
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold">Notifications</h2>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60"
                >
                  <XIcon size={16} className="text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">You're all caught up.</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
