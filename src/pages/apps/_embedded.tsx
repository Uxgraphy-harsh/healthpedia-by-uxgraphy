import { ReactNode } from "react";
import MiniAppShell from "@/components/MiniAppShell";
import AppLockGate from "@/components/AppLockGate";
import { getMiniApp } from "@/data/miniApps";

export interface EmbeddedProps {
  embedded?: boolean;
  scopeLabel?: string;
}

/**
 * AppFrame wraps a mini-app's inner content with the standard MiniAppShell
 * + AppLockGate when rendered as a top-level route. When `embedded` is true
 * (e.g. rendered inside the Childcare overlay), the wrappers are skipped so
 * the host provides its own top/bottom chrome.
 */
export function AppFrame({
  appId,
  embedded,
  lock = true,
  children,
}: {
  appId: string;
  embedded?: boolean;
  lock?: boolean;
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
    >
      {children}
    </MiniAppShell>
  );
  return lock ? <AppLockGate appId={appId}>{shell}</AppLockGate> : shell;
}
