import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Lock, LockOpen, type LucideIcon } from "lucide-react";
import { useAppLock } from "@/contexts/AppLockContext";
import MiniAppBottomBar, { type MiniAppAction } from "@/components/MiniAppBottomBar";

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

  return (
    <div className={`mobile-container ${bottomActions ? "pb-28" : "pb-10"} min-h-[100dvh]`}>
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className={`w-11 h-11 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${fg}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold leading-tight truncate">{name}</h1>
          {tagline && <p className="text-[11px] text-muted-foreground truncate">{tagline}</p>}
        </div>
        {hasPin && (
          <button
            onClick={() => toggleAppLock(appId)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0"
            title={isLocked ? "Remove PIN lock" : "Add PIN lock"}
          >
            {isLocked
              ? <Lock className="w-4 h-4 text-[#F66B9A]" />
              : <LockOpen className="w-4 h-4 text-muted-foreground" />}
          </button>
        )}
        {action}
      </div>

      <div className="px-5">{children}</div>

      {bottomActions && <MiniAppBottomBar actions={bottomActions} accent={fg} />}
    </div>
  );
}
