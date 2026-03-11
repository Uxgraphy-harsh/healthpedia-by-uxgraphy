import { useLocation, useNavigate } from "react-router-dom";
import { MessageCircle, LayoutDashboard, Activity, FileText, User } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { path: "/chat", icon: MessageCircle, label: "Chat" },
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/track", icon: Activity, label: "Track" },
  { path: "/records", icon: FileText, label: "Records" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto bg-card/90 backdrop-blur-xl border-t border-border/50 px-2 pb-safe">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => {
            const active = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center gap-0.5 px-3 py-2 relative"
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-0.5 w-8 h-1 rounded-full gradient-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.icon
                  className={`w-5 h-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                />
                <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
