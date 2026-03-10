import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Smartphone, CreditCard, Heart, Pill, Shield, LogOut, ChevronRight } from "lucide-react";

const sections = [
  { icon: User, label: "Personal Info", desc: "Name, age, gender, contact" },
  { icon: Smartphone, label: "Connected Devices", desc: "Google Fit, Apple Health" },
  { icon: CreditCard, label: "ABHA ID", desc: "Link your health ID" },
  { icon: Heart, label: "Medical Conditions", desc: "Diabetes, Thyroid" },
  { icon: Pill, label: "Medications", desc: "Metformin 500mg" },
  { icon: Shield, label: "Privacy Settings", desc: "Data sharing, export" },
];

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="mobile-container pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl glass-card flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold font-serif">Profile</h1>
      </div>

      <div className="px-5 space-y-5">
        {/* Avatar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-elevated p-5 flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-base">Sarah Johnson</h2>
            <p className="text-xs text-muted-foreground">sarah.j@gmail.com</p>
            <p className="text-[10px] text-primary font-medium mt-1">Health Profile Complete</p>
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-2">
          {sections.map((s, i) => (
            <motion.button
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4 w-full flex items-center gap-4 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{s.label}</p>
                <p className="text-[10px] text-muted-foreground">{s.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </motion.button>
          ))}
        </div>

        {/* Logout */}
        <button className="w-full glass-card p-4 flex items-center gap-4 text-health-alert">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-semibold">Log Out</span>
        </button>
      </div>
    </div>
  );
}
