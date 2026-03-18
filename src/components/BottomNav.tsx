import { useLocation, useNavigate } from "react-router-dom";
import { Stack, Heartbeat, FolderOpen, UserCircle } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import healthpediaFlower from "@/assets/healthpedia-flower.svg";

const tabs = [
  { path: "/dashboard", icon: Stack, label: "Summary" },
  { path: "/track", icon: HeartBeat, label: "Track" },
  { path: "/chat", icon: null, label: "Ask AI", isCenter: true },
  { path: "/records", icon: FolderOpen, label: "Records" },
  { path: "/profile", icon: UserCircle, label: "Profile" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto relative">
        {/* Background bar */}
        <div className="bg-card/90 backdrop-blur-xl border-t border-border/30 px-2 pb-safe">
          <div className="flex justify-around items-end py-2">
            {tabs.map((tab) => {
              const active = location.pathname === tab.path;

              if (tab.isCenter) {
                return (
                  <button
                    key={tab.path}
                    onClick={() => navigate(tab.path)}
                    className="flex flex-col items-center gap-1 px-3 relative -mt-5"
                  >
                    {/* Elevated flower icon */}
                    <motion.div
                      whileTap={{ scale: 0.92 }}
                      className="w-14 h-14 rounded-full flex items-center justify-center -mb-1"
                    >
                      <img
                        src={healthpediaFlower}
                        alt="Ask AI"
                        className="w-12 h-12"
                        style={{
                          filter: active ? "none" : "grayscale(0.3) opacity(0.7)",
                        }}
                      />
                    </motion.div>
                    <span
                      className={`text-[10px] font-semibold ${
                        active ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className="flex flex-col items-center gap-1 px-3 py-2 relative"
                >
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -top-0.5 w-8 h-[2px] rounded-full bg-foreground"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {tab.icon && (
                    <tab.icon
                      size={24}
                      weight={active ? "fill" : "regular"}
                      className={`transition-colors ${
                        active ? "text-foreground" : "text-muted-foreground"
                      }`}
                    />
                  )}
                  <span
                    className={`text-[10px] font-medium ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {tab.label}
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
