import type { LucideIcon } from "lucide-react";

export interface MiniAppAction {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  primary?: boolean;
  active?: boolean;
}

interface Props {
  actions: MiniAppAction[];
  accent: string; // tailwind text-color class of the mini app
}

export default function MiniAppBottomBar({ actions, accent }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-md">
        <div className="bg-card/95 backdrop-blur-xl border-t border-border/40 pb-safe">
          <div className="flex items-stretch justify-around px-2 pt-2 pb-2">
            {actions.map((a, i) => {
              if (a.primary) {
                return (
                  <button
                    key={i}
                    onClick={a.onClick}
                    className="relative flex flex-col items-center px-3"
                  >
                    <div className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#F66B9A] shadow-lg shadow-[#F66B9A]/40">
                      <a.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="h-6" />
                    <span className="text-[10px] font-semibold text-[#F66B9A]">{a.label}</span>
                  </button>
                );
              }
              return (
                <button
                  key={i}
                  onClick={a.onClick}
                  className="flex flex-1 flex-col items-center gap-1 px-2 py-1"
                >
                  <a.icon
                    className={`h-5 w-5 ${a.active ? accent : "text-muted-foreground"}`}
                  />
                  <span
                    className={`text-[10px] font-medium ${
                      a.active ? accent : "text-muted-foreground"
                    }`}
                  >
                    {a.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
