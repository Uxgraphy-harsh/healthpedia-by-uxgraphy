import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Activity, Ruler, StickyNote, Upload, Pill, Calendar } from "lucide-react";

export interface FABAction {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

interface FloatingActionButtonProps {
  actions: FABAction[];
}

export default function FloatingActionButton({ actions }: FloatingActionButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-5 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col gap-2 mb-2"
          >
            {actions.map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  action.onClick();
                  setOpen(false);
                }}
                className="flex items-center gap-3 self-end"
              >
                <span className="glass-card-elevated px-3 py-1.5 text-xs font-medium whitespace-nowrap">
                  {action.label}
                </span>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <action.icon className="w-4 h-4 text-primary" />
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrim */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[-1]"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg transition-transform"
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus className="w-6 h-6 text-primary-foreground" />
        </motion.div>
      </button>
    </div>
  );
}
