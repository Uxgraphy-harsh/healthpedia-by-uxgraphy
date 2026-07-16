import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock } from "lucide-react";
import { miniApps } from "@/data/miniApps";
import { useAppLock } from "@/contexts/AppLockContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AppLauncher({ open, onClose }: Props) {
  const navigate = useNavigate();
  const { hasPin, lockedApps } = useAppLock();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[70] mx-auto w-full max-w-md rounded-t-3xl bg-background p-5 pb-8 shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted" />

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold leading-tight">Mini apps</h2>
                <p className="text-[11px] text-muted-foreground">
                  {miniApps.length} apps · your health workspace
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid max-h-[65vh] grid-cols-4 gap-x-3 gap-y-5 overflow-y-auto">
              {miniApps.map((app) => {
                const locked = hasPin && lockedApps.includes(app.id);
                return (
                  <button
                    key={app.id}
                    onClick={() => {
                      onClose();
                      navigate(app.path);
                    }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div
                      className={`relative flex aspect-square w-full items-center justify-center rounded-2xl ${app.bg}`}
                    >
                      <app.icon className={`h-6 w-6 ${app.fg}`} />
                      {locked && (
                        <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-background">
                          <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <span className="text-center text-[10px] font-medium leading-tight">
                      {app.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
