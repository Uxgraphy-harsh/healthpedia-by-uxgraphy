import type { LucideIcon } from "lucide-react";

export interface MiniAppAction {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  primary?: boolean;
  active?: boolean;
  badge?: number;
}


interface Props {
  actions: MiniAppAction[];
  accent: string; // tailwind text-color class of the mini app
}

// Map common accent text classes to matching soft background tints
const ACCENT_BG: Record<string, string> = {
  "text-[#F66B9A]": "bg-[#F66B9A]/15",
  "text-[#60A5FA]": "bg-[#60A5FA]/15",
  "text-[#FB3661]": "bg-[#FB3661]/15",
  "text-primary": "bg-primary/15",
};

export default function MiniAppBottomBar({ actions, accent }: Props) {
  const activeBg = ACCENT_BG[accent] ?? "bg-foreground/10";

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 pb-safe">
      <div className="mx-auto max-w-md px-4">
        <div className="flex items-center justify-around rounded-full bg-card/95 px-3 py-2 backdrop-blur-xl border border-border/40">
          {actions.map((a, i) => {
            const isActive = a.active || a.primary;
            return (
              <button
                key={i}
                onClick={a.onClick}
                aria-label={a.label}
                className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                  isActive ? activeBg : ""
                }`}
              >
                <a.icon
                  className={`h-5 w-5 ${
                    isActive ? accent : "text-muted-foreground"
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.75}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
