import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Calendar, Heart, CreditCard, Fingerprint,
  Shield, Phone, Users, Dna, Mail, ChevronDown, ChevronRight,
  LogOut, Edit2, Plus, Smartphone, Check, Lock, Settings,
  Globe, Bell, Pill, Activity
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import PageHeader from "@/components/PageHeader";
import { PrivacyBanner } from "@/components/PrivacyBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04 },
});

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

// Profile completion calculation
function calculateCompletion(data: {
  hasConditions: boolean;
  hasMedications: boolean;
  hasAllergies: boolean;
  hasDoctors: boolean;
  hasInsurance: boolean;
  hasContacts: boolean;
  hasIntegrations: boolean;
  hasReports: boolean;
}): number {
  const checks = [
    true, // basic profile always filled after onboarding
    data.hasConditions,
    data.hasMedications,
    data.hasAllergies,
    data.hasDoctors,
    data.hasInsurance,
    data.hasContacts,
    data.hasIntegrations,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default function Profile() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [connectedServices, setConnectedServices] = useState({
    googleCalendar: false,
    appleHealth: true,
    samsungHealth: false,
    googleFit: true,
  });

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

  const completion = calculateCompletion({
    hasConditions: true,
    hasMedications: true,
    hasAllergies: false,
    hasDoctors: true,
    hasInsurance: true,
    hasContacts: true,
    hasIntegrations: Object.values(connectedServices).some(Boolean),
    hasReports: false,
  });

  const completionSuggestions = [
    { label: "Add allergies", done: false, icon: Activity },
    { label: "Upload first report", done: false, icon: CreditCard },
    { label: "Add medications", done: true, icon: Pill },
    { label: "Add health conditions", done: true, icon: Heart },
    { label: "Connect health data", done: true, icon: Smartphone },
  ];

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

  const InfoRow = ({ label, value, editable }: { label: string; value: string; editable?: boolean }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-foreground">{value}</span>
        {editable && <Edit2 className="w-3 h-3 text-muted-foreground" />}
      </div>
    </div>
  );

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem("healthpedia_onboarded");
    navigate("/", { replace: true });
  };

  return (
    <div className="mobile-container pb-28">
      <PageHeader title="Profile" subtitle="Manage your health identity" icon={User} />

      <div className="px-5 space-y-3 mt-3">
        {/* Avatar Card */}
        <motion.div {...fadeIn(0)} className="glass-card-elevated p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="" className="w-16 h-16 rounded-2xl object-cover" />
            ) : (
              <User className="w-8 h-8 text-primary-foreground" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-base">{user?.user_metadata?.full_name || "Sarah Johnson"}</h2>
            <p className="text-xs text-muted-foreground">{user?.email || "sarah.j@gmail.com"}</p>
          </div>
          <button className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Edit2 className="w-4 h-4 text-primary" />
          </button>
        </motion.div>

        {/* Profile Completion */}
        <motion.div {...fadeIn(0.5)} className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold">Health Profile</p>
            <span className="text-xs font-bold text-primary">{completion}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
            <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${completion}%` }} />
          </div>
          <div className="space-y-2">
            {completionSuggestions.filter(s => !s.done).map((s) => (
              <button key={s.label} className="flex items-center gap-2 w-full text-left">
                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-3 h-3 text-primary" />
                </div>
                <span className="text-xs text-primary font-medium flex-1">{s.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* ─── ACCOUNT SECTION ─── */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pt-2">Account</p>

        <motion.div {...fadeIn(1)} className="space-y-0.5">
          <SectionHeader icon={User} label="Personal Information" section="personal" badge="Age updates automatically" />
          {expandedSection === "personal" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2 mt-1">
              <InfoRow label="Age" value={`${age} years`} />
              <InfoRow label="Date of Birth" value={birthDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} editable />
              <InfoRow label="Gender" value="Female" editable />
              <InfoRow label="Height" value="165 cm" editable />
              <InfoRow label="Weight" value="62 kg" editable />
              <InfoRow label="Blood Group" value="B+" editable />
            </motion.div>
          )}
        </motion.div>

        <motion.div {...fadeIn(1.5)} className="space-y-0.5">
          <SectionHeader icon={CreditCard} label="ABHA ID" section="abha" badge="Linked" />
          {expandedSection === "abha" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2 mt-1">
              <InfoRow label="ABHA Number" value="91-4829-6371-8294" />
              <InfoRow label="ABHA Address" value="sarah.johnson@abdm" />
              <InfoRow label="Status" value="✅ Verified" />
            </motion.div>
          )}
        </motion.div>

        <motion.div {...fadeIn(2)} className="space-y-0.5">
          <SectionHeader icon={Fingerprint} label="Unique ID" section="uid" badge="App identifier" />
          {expandedSection === "uid" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2 mt-1">
              <InfoRow label="Healthpedia ID" value="HP-2024-8A3F-K91Z" />
              <InfoRow label="Created" value="March 15, 2024" />
            </motion.div>
          )}
        </motion.div>

        {/* ─── HEALTH PROFILE SECTION ─── */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pt-2">Health Profile</p>

        <motion.div {...fadeIn(3)} className="space-y-0.5">
          <SectionHeader icon={Heart} label="Conditions" section="conditions" badge="Diabetes, Thyroid" />
          {expandedSection === "conditions" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-3 mt-1">
              {["Diabetes", "Thyroid Disorder"].map((c) => (
                <div key={c} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <span className="text-xs font-semibold">{c}</span>
                  <span className="text-[10px] text-health-watch bg-health-watch/10 px-2 py-0.5 rounded-full font-medium">Active</span>
                </div>
              ))}
              <button className="w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold">
                <Plus className="w-3.5 h-3.5" /> Add Condition
              </button>
            </motion.div>
          )}
        </motion.div>

        <motion.div {...fadeIn(3.5)} className="space-y-0.5">
          <SectionHeader icon={Pill} label="Medications" section="medications" badge="3 active" />
          {expandedSection === "medications" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-3 mt-1">
              {["Metformin 500mg", "Atorvastatin 10mg", "Vitamin D3"].map((m) => (
                <div key={m} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <span className="text-xs font-semibold">{m}</span>
                  <span className="text-[10px] text-health-good bg-health-good/10 px-2 py-0.5 rounded-full font-medium">Active</span>
                </div>
              ))}
              <button className="w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold">
                <Plus className="w-3.5 h-3.5" /> Add Medication
              </button>
            </motion.div>
          )}
        </motion.div>

        <motion.div {...fadeIn(4)} className="space-y-0.5">
          <SectionHeader icon={Activity} label="Allergies" section="allergies" badge="None added" />
          {expandedSection === "allergies" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-3 mt-1">
              <p className="text-xs text-muted-foreground py-2">No allergies recorded yet.</p>
              <button className="w-full mt-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold">
                <Plus className="w-3.5 h-3.5" /> Add Allergy
              </button>
            </motion.div>
          )}
        </motion.div>

        <motion.div {...fadeIn(4.5)} className="space-y-0.5">
          <SectionHeader icon={Dna} label="Family Medical History" section="genetics" badge={`${geneticRecords.length} records`} />
          {expandedSection === "genetics" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2 mt-1">
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

        <motion.div {...fadeIn(5)} className="space-y-0.5">
          <SectionHeader icon={Phone} label="Contacts & Guardians" section="contacts" badge={`${contacts.length + guardians.length} people`} />
          {expandedSection === "contacts" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2 mt-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider py-1">Contacts</p>
              {contacts.map((c, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border/30">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">{c.relation} · {c.phone}</p>
                  </div>
                </div>
              ))}
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider py-1 mt-2">Guardians</p>
              {guardians.map((g, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
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
                <Plus className="w-3.5 h-3.5" /> Add Contact / Guardian
              </button>
            </motion.div>
          )}
        </motion.div>

        <motion.div {...fadeIn(5.5)} className="space-y-0.5">
          <SectionHeader icon={Shield} label="Insurance" section="insurance" badge="1 active policy" />
          {expandedSection === "insurance" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2 mt-1">
              <InfoRow label="Provider" value="Star Health" />
              <InfoRow label="Policy No." value="SH-2024-738291" />
              <InfoRow label="Sum Insured" value="₹10,00,000" />
              <InfoRow label="Valid Till" value="Dec 2025" />
              <button className="w-full mt-2 mb-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold">
                <Plus className="w-3.5 h-3.5" /> Add Another Policy
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* ─── INTEGRATIONS SECTION ─── */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pt-2">Health Integrations</p>

        <motion.div {...fadeIn(6)} className="space-y-0.5">
          <SectionHeader icon={Smartphone} label="Connected Services" section="services" badge={`${Object.values(connectedServices).filter(Boolean).length} connected`} />
          {expandedSection === "services" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2 mt-1 space-y-1">
              {([
                { key: "googleCalendar" as const, name: "Google Calendar", desc: "Sync appointments & reminders", color: "bg-primary/80" },
                { key: "appleHealth" as const, name: "Apple Health", desc: "Import vitals, activity & sleep", color: "bg-health-alert" },
                { key: "samsungHealth" as const, name: "Samsung Health", desc: "Sync steps, heart rate & more", color: "bg-secondary" },
                { key: "googleFit" as const, name: "Google Fit", desc: "Import fitness & wellness data", color: "bg-health-good" },
              ]).map((service) => (
                <div key={service.key} className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
                  <div className={`w-8 h-8 rounded-lg ${service.color} flex items-center justify-center`}>
                    {service.key === "googleCalendar" ? <Calendar className="w-4 h-4 text-primary-foreground" /> :
                     service.key === "samsungHealth" ? <Smartphone className="w-4 h-4 text-primary-foreground" /> :
                     <Heart className="w-4 h-4 text-primary-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">{service.name}</p>
                    <p className="text-[10px] text-muted-foreground">{service.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {connectedServices[service.key] && (
                      <span className="text-[9px] font-semibold health-status-good flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Connected
                      </span>
                    )}
                    <Switch
                      checked={connectedServices[service.key]}
                      onCheckedChange={(checked) =>
                        setConnectedServices((prev) => ({ ...prev, [service.key]: checked }))
                      }
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* ─── PREFERENCES SECTION ─── */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pt-2">Preferences</p>

        <motion.div {...fadeIn(7)}>
          <div className="glass-card p-4 w-full flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Daily AI Summary</p>
              <p className="text-[10px] text-muted-foreground">Receive daily health summary via email</p>
            </div>
            <Switch checked={dailySummaryEnabled} onCheckedChange={setDailySummaryEnabled} />
          </div>
        </motion.div>

        <motion.div {...fadeIn(7.5)} className="space-y-0.5">
          <SectionHeader icon={Settings} label="App Settings" section="settings" badge="Units, language" />
          {expandedSection === "settings" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2 mt-1">
              <InfoRow label="Units" value="Metric (kg, cm)" editable />
              <InfoRow label="Language" value="English" editable />
              <InfoRow label="Notifications" value="Enabled" editable />
            </motion.div>
          )}
        </motion.div>

        {/* Privacy */}
        <motion.div {...fadeIn(8)} className="space-y-0.5">
          <SectionHeader icon={Lock} label="Data & Privacy" section="privacy" badge="Your data is secure" />
          {expandedSection === "privacy" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-3 mt-1 space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-health-good shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold">End-to-End Encryption</p>
                  <p className="text-[10px] text-muted-foreground">All health data is encrypted at rest and in transit.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-4 h-4 text-health-good shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold">No Data Sharing</p>
                  <p className="text-[10px] text-muted-foreground">We never share your health information with third parties.</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Logout */}
        <motion.div {...fadeIn(9)}>
          <button onClick={handleSignOut} className="w-full glass-card p-4 flex items-center gap-4 text-health-alert mt-2">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
