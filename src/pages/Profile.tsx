import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Calendar, Ruler, Weight, Heart, CreditCard, Fingerprint,
  Shield, Phone, Users, Dna, Mail, ChevronRight, ChevronDown,
  LogOut, Edit2, Plus, Trash2
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04 },
});

// Calculate age from birthdate
function getAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

interface Contact {
  name: string;
  relation: string;
  phone: string;
}

interface GeneticRecord {
  member: string;
  condition: string;
}

export default function Profile() {
  const [expandedSection, setExpandedSection] = useState<string | null>("personal");

  // Mock data
  const birthDate = new Date(1992, 4, 15);
  const age = getAge(birthDate);

  const [contacts] = useState<Contact[]>([
    { name: "John Johnson", relation: "Spouse", phone: "+91 98765 43210" },
    { name: "Dr. Mehta", relation: "Primary Doctor", phone: "+91 99887 65432" },
  ]);

  const [guardians] = useState<Contact[]>([
    { name: "Robert Johnson", relation: "Father", phone: "+91 91234 56789" },
  ]);

  const [geneticRecords] = useState<GeneticRecord[]>([
    { member: "Mother", condition: "Type 2 Diabetes" },
    { member: "Father", condition: "Hypertension" },
    { member: "Grandmother (Maternal)", condition: "Thyroid" },
  ]);

  const [dailySummaryEnabled, setDailySummaryEnabled] = useState(false);

  const toggle = (section: string) =>
    setExpandedSection(expandedSection === section ? null : section);

  const SectionHeader = ({
    icon: Icon, label, section, badge
  }: { icon: any; label: string; section: string; badge?: string }) => (
    <button
      onClick={() => toggle(section)}
      className="glass-card p-4 w-full flex items-center gap-3 text-left"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        {badge && <p className="text-[10px] text-muted-foreground">{badge}</p>}
      </div>
      <motion.div animate={{ rotate: expandedSection === section ? 180 : 0 }} transition={{ duration: 0.2 }}>
        <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
      </motion.div>
    </button>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-semibold text-foreground">{value}</span>
    </div>
  );

  return (
    <div className="mobile-container pb-28">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-bold font-serif">Profile</h1>
        <p className="text-xs text-muted-foreground">Manage your health identity</p>
      </div>

      <div className="px-5 space-y-3 mt-3">
        {/* Avatar Card */}
        <motion.div {...fadeIn(0)} className="glass-card-elevated p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-base">Sarah Johnson</h2>
            <p className="text-xs text-muted-foreground">sarah.j@gmail.com</p>
            <p className="text-[10px] text-primary font-medium mt-1">Profile Complete</p>
          </div>
          <button className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Edit2 className="w-4 h-4 text-primary" />
          </button>
        </motion.div>

        {/* 1. Personal Information */}
        <motion.div {...fadeIn(1)} className="space-y-0.5">
          <SectionHeader icon={User} label="Personal Information" section="personal" badge="Age updates automatically" />
          {expandedSection === "personal" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2 mt-1">
              <InfoRow label="Age" value={`${age} years`} />
              <InfoRow label="Date of Birth" value={birthDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} />
              <InfoRow label="Gender" value="Female" />
              <InfoRow label="Height" value="165 cm" />
              <InfoRow label="Weight" value="62 kg" />
              <InfoRow label="Blood Group" value="B+" />
            </motion.div>
          )}
        </motion.div>

        {/* 2. ABHA ID */}
        <motion.div {...fadeIn(2)} className="space-y-0.5">
          <SectionHeader icon={CreditCard} label="ABHA ID" section="abha" badge="Linked" />
          {expandedSection === "abha" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2 mt-1">
              <InfoRow label="ABHA Number" value="91-4829-6371-8294" />
              <InfoRow label="ABHA Address" value="sarah.johnson@abdm" />
              <InfoRow label="Status" value="✅ Verified" />
            </motion.div>
          )}
        </motion.div>

        {/* 3. Unique ID */}
        <motion.div {...fadeIn(3)} className="space-y-0.5">
          <SectionHeader icon={Fingerprint} label="Unique ID" section="uid" badge="App identifier" />
          {expandedSection === "uid" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2 mt-1">
              <InfoRow label="Healthpedia ID" value="HP-2024-8A3F-K91Z" />
              <InfoRow label="Created" value="March 15, 2024" />
              <div className="pt-2 pb-1">
                <p className="text-[10px] text-muted-foreground">Use this ID to share your health profile with healthcare providers securely.</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* 4. Insurance */}
        <motion.div {...fadeIn(4)} className="space-y-0.5">
          <SectionHeader icon={Shield} label="Insurance" section="insurance" badge="1 active policy" />
          {expandedSection === "insurance" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2 mt-1">
              <InfoRow label="Provider" value="Star Health" />
              <InfoRow label="Policy No." value="SH-2024-738291" />
              <InfoRow label="Sum Insured" value="₹10,00,000" />
              <InfoRow label="Valid Till" value="Dec 2025" />
              <InfoRow label="Type" value="Family Floater" />
              <button className="w-full mt-2 mb-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold">
                <Plus className="w-3.5 h-3.5" /> Add Another Policy
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* 5. Important Contacts */}
        <motion.div {...fadeIn(5)} className="space-y-0.5">
          <SectionHeader icon={Phone} label="Important Contacts" section="contacts" badge={`${contacts.length} contacts`} />
          {expandedSection === "contacts" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2 mt-1">
              {contacts.map((c, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">{c.relation} · {c.phone}</p>
                  </div>
                </div>
              ))}
              <button className="w-full mt-2 mb-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold">
                <Plus className="w-3.5 h-3.5" /> Add Contact
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* 6. Guardians */}
        <motion.div {...fadeIn(6)} className="space-y-0.5">
          <SectionHeader icon={Users} label="Guardians" section="guardians" badge={`${guardians.length} guardian`} />
          {expandedSection === "guardians" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2 mt-1">
              {guardians.map((g, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold">{g.name}</p>
                    <p className="text-[10px] text-muted-foreground">{g.relation} · {g.phone}</p>
                  </div>
                </div>
              ))}
              <button className="w-full mt-2 mb-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold">
                <Plus className="w-3.5 h-3.5" /> Add Guardian
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* 7. Genetic / Family Medical History */}
        <motion.div {...fadeIn(7)} className="space-y-0.5">
          <SectionHeader icon={Dna} label="Family Medical History" section="genetics" badge={`${geneticRecords.length} records`} />
          {expandedSection === "genetics" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2 mt-1">
              <p className="text-[10px] text-muted-foreground py-1.5">Hereditary conditions help AI provide better health insights.</p>
              {geneticRecords.map((r, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-health-alert/10 flex items-center justify-center">
                    <Heart className="w-3.5 h-3.5 text-health-alert" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold">{r.condition}</p>
                    <p className="text-[10px] text-muted-foreground">{r.member}</p>
                  </div>
                </div>
              ))}
              <button className="w-full mt-2 mb-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold">
                <Plus className="w-3.5 h-3.5" /> Add Family Record
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* 8. Daily AI Summary to Email */}
        <motion.div {...fadeIn(8)} className="space-y-0.5">
          <div className="glass-card p-4 w-full flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Daily AI Summary</p>
              <p className="text-[10px] text-muted-foreground">Receive a daily health summary to your inbox</p>
            </div>
            <Switch checked={dailySummaryEnabled} onCheckedChange={setDailySummaryEnabled} />
          </div>
          {dailySummaryEnabled && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-3 mt-1">
              <InfoRow label="Send to" value="sarah.j@gmail.com" />
              <InfoRow label="Time" value="7:00 AM daily" />
              <p className="text-[10px] text-muted-foreground pt-2">Includes vitals, medication reminders, symptom trends, and AI health tips.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Logout */}
        <motion.div {...fadeIn(9)}>
          <button className="w-full glass-card p-4 flex items-center gap-4 text-health-alert mt-2">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-semibold">Log Out</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
