import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const PIN_KEY = "healthpedia_app_pin";
const LOCKED_APPS_KEY = "healthpedia_locked_apps";
const UNLOCKED_SESSION_KEY = "healthpedia_unlocked_session";

interface AppLockContextType {
  pin: string | null;
  hasPin: boolean;
  lockedApps: string[];
  unlockedThisSession: Set<string>;
  setPin: (pin: string) => void;
  clearPin: () => void;
  toggleAppLock: (appId: string) => void;
  isAppLocked: (appId: string) => boolean;
  unlockApp: (appId: string, enteredPin: string) => boolean;
  lockAllNow: () => void;
}

const AppLockContext = createContext<AppLockContextType | undefined>(undefined);

export function AppLockProvider({ children }: { children: ReactNode }) {
  const [pin, setPinState] = useState<string | null>(() => localStorage.getItem(PIN_KEY));
  const [lockedApps, setLockedApps] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(LOCKED_APPS_KEY) || "[]"); }
    catch { return []; }
  });
  const [unlockedThisSession, setUnlocked] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(sessionStorage.getItem(UNLOCKED_SESSION_KEY) || "[]")); }
    catch { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem(LOCKED_APPS_KEY, JSON.stringify(lockedApps));
  }, [lockedApps]);

  useEffect(() => {
    sessionStorage.setItem(UNLOCKED_SESSION_KEY, JSON.stringify([...unlockedThisSession]));
  }, [unlockedThisSession]);

  const setPin = (p: string) => {
    localStorage.setItem(PIN_KEY, p);
    setPinState(p);
  };

  const clearPin = () => {
    localStorage.removeItem(PIN_KEY);
    setPinState(null);
    setLockedApps([]);
  };

  const toggleAppLock = (appId: string) => {
    setLockedApps((prev) =>
      prev.includes(appId) ? prev.filter((a) => a !== appId) : [...prev, appId]
    );
  };

  const isAppLocked = (appId: string) =>
    !!pin && lockedApps.includes(appId) && !unlockedThisSession.has(appId);

  const unlockApp = (appId: string, enteredPin: string) => {
    if (enteredPin === pin) {
      setUnlocked((prev) => new Set(prev).add(appId));
      return true;
    }
    return false;
  };

  const lockAllNow = () => {
    setUnlocked(new Set());
    sessionStorage.removeItem(UNLOCKED_SESSION_KEY);
  };

  return (
    <AppLockContext.Provider
      value={{
        pin, hasPin: !!pin, lockedApps, unlockedThisSession,
        setPin, clearPin, toggleAppLock, isAppLocked, unlockApp, lockAllNow,
      }}
    >
      {children}
    </AppLockContext.Provider>
  );
}

export function useAppLock() {
  const ctx = useContext(AppLockContext);
  if (!ctx) throw new Error("useAppLock must be used inside AppLockProvider");
  return ctx;
}
