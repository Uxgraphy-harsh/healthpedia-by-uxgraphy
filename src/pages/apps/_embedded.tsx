import { ReactNode } from "react";
import MiniAppShell from "@/components/MiniAppShell";
import AppLockGate from "@/components/AppLockGate";
import type { MiniAppAction } from "@/components/MiniAppBottomBar";
import { getMiniApp } from "@/data/miniApps";

export interface EmbeddedProps {
  embedded?: boolean;
  scopeLabel?: string;
}

export function AppFrame({
  appId,
  embedded,
  lock = true,
  bottomActions,
  children,
}: {
  appId: string;
  embedded?: boolean;
  lock?: boolean;
  bottomActions?: MiniAppAction[];
  children: ReactNode;
}) {
  if (embedded) return <>{children}</>;
  const app = getMiniApp(appId);
  if (!app) return <>{children}</>;
  const shell = (
    <MiniAppShell
      appId={appId}
      name={app.name}
      tagline={app.tagline}
      icon={app.icon}
      bg={app.bg}
      fg={app.fg}
      bottomActions={bottomActions}
    >
      {children}
    </MiniAppShell>
  );
  return lock ? <AppLockGate appId={appId}>{shell}</AppLockGate> : shell;
}

