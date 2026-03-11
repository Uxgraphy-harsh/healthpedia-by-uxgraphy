import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Calendar, Heart, CreditCard, Fingerprint,
  Shield, Phone, Users, Dna, Mail, ChevronDown, ChevronRight,
  LogOut, Edit2, Plus, Smartphone, Check, Lock, Settings,
  Globe, Bell, Pill, Activity, Moon, Sun, Volume2, Vibrate,
  Clock, HelpCircle, MessageSquare, AlertTriangle, Info,
  FileText, Trash2, X, Stethoscope, ChevronLeft
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface Contact { name: string; relation: string; phone: string; }
interface GeneticRecord { member: string; condition: string; }
interface HealthEntry { name: string; status: string; statusColor: string; }

// ─── Helpers ────────────────────────────────────────────────────────────────────

function getAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

function calculateCompletion(data: Record<string, boolean>): number {
  const vals = Object.values(data);
  return Math.round((vals.filter(Boolean).length / vals.length) * 100);
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, label, section, badge, expanded, onToggle }: {
  icon: any; label: string; section: string; badge?: string; expanded: boolean; onToggle: () => void;
}) {
  return (
    <button onClick={onToggle} className="glass-card p-4 w-full flex items-center gap-3 text-left">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        {badge && <p className="text-[10px] text-muted-foreground">{badge}</p>}
      </div>
      <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
        <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
      </motion.div>
    </button>
  );
}

function InfoRow({ label, value, editable }: { label: string; value: string; editable?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-foreground">{value}</span>
        {editable && <Edit2 className="w-3 h-3 text-muted-foreground" />}
      </div>
    </div>
  );
}

function SettingToggle({ icon: Icon, label, description, checked, onChange, iconColor }: {
  icon: any; label: string; description: string; checked: boolean; onChange: (v: boolean) => void; iconColor?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/30 last:border-0">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconColor || "bg-primary/10"}`}>
        <Icon className={`w-4 h-4 ${iconColor ? "text-primary-foreground" : "text-primary"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold">{label}</p>
        <p className="text-[10px] text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function ActionRow({ icon: Icon, label, onClick, danger }: {
  icon: any; label: string; onClick: () => void; danger?: boolean;
}) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 py-3 border-b border-border/30 last:border-0 w-full text-left">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${danger ? "bg-destructive/10" : "bg-muted/50"}`}>
        <Icon className={`w-4 h-4 ${danger ? "text-destructive" : "text-muted-foreground"}`} />
      </div>
      <span className={`text-xs font-medium flex-1 ${danger ? "text-destructive" : ""}`}>{label}</span>
      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
    </button>
  );
}

function HealthEntryList({ items, emptyMessage, onAdd, addLabel }: {
  items: HealthEntry[]; emptyMessage: string; onAdd: () => void; addLabel: string;
}) {
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-3 mt-1">
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">{emptyMessage}</p>
      ) : (
        items.map((item) => (
          <div key={item.name} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
            <span className="text-xs font-semibold">{item.name}</span>
            <span className={`text-[10px] ${item.statusColor} px-2 py-0.5 rounded-full font-medium`}>{item.status}</span>
          </div>
        ))
      )}
      <button onClick={onAdd} className="w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold">
        <Plus className="w-3.5 h-3.5" /> {addLabel}
      </button>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function Profile() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Health integrations
  const [connectedServices, setConnectedServices] = useState({
    googleFit: true,
    appleHealth: true,
    samsungHealth: false,
    googleCalendar: false,
  });

  // Reminder settings
  const [reminderSettings, setReminderSettings] = useState({
    sound: true,
    vibration: true,
    defaultSnooze: "10",
    showOnLockScreen: true,
  });

  // App preferences
  const [appPrefs, setAppPrefs] = useState({
    darkMode: false,
    units: "Metric",
    language: "English",
    tempUnit: "Celsius",
  });

  // Notification preferences
  const [notifPrefs, setNotifPrefs] = useState({
    dailySummary: false,
    reminderNotifs: true,
    reportAlerts: true,
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

  const conditions: HealthEntry[] = [
    { name: "Diabetes", status: "Active", statusColor: "text-health-watch bg-health-watch/10" },
    { name: "Thyroid Disorder", status: "Monitoring", statusColor: "text-primary bg-primary/10" },
  ];

  const medications: HealthEntry[] = [
    { name: "Metformin 500mg", status: "Active", statusColor: "text-health-good bg-health-good/10" },
    { name: "Atorvastatin 10mg", status: "Active", statusColor: "text-health-good bg-health-good/10" },
    { name: "Vitamin D3 60K IU", status: "Active", statusColor: "text-health-good bg-health-good/10" },
  ];

  const allergies: HealthEntry[] = [];

  const doctors: HealthEntry[] = [
    { name: "Dr. Sharma — Endocrinology", status: "Primary", statusColor: "text-primary bg-primary/10" },
    { name: "Dr. Mehta — Cardiology", status: "Specialist", statusColor: "text-secondary bg-secondary/10" },
  ];

  const completion = calculateCompletion({
    basicProfile: true,
    conditions: conditions.length > 0,
    medications: medications.length > 0,
    allergies: allergies.length > 0,
    doctors: doctors.length > 0,
    insurance: true,
    contacts: contacts.length > 0,
    integrations: Object.values(connectedServices).some(Boolean),
  });

  const incompleteSuggestions = [
    ...(allergies.length === 0 ? [{ label: "Add allergies", icon: Activity }] : []),
    ...(doctors.length === 0 ? [{ label: "Add doctors", icon: Stethoscope }] : []),
  ];

  const toggle = (section: string) =>
    setExpandedSection(expandedSection === section ? null : section);

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem("healthpedia_onboarded");
    navigate("/", { replace: true });
  };

  const integrationServices = [
    { key: "googleFit" as const, name: "Google Fit", desc: "Import fitness & wellness data", color: "bg-health-good" },
    { key: "appleHealth" as const, name: "Apple Health", desc: "Import vitals, activity & sleep", color: "bg-health-alert" },
    { key: "samsungHealth" as const, name: "Samsung Health", desc: "Sync steps, heart rate & more", color: "bg-secondary" },
    { key: "googleCalendar" as const, name: "Google Calendar", desc: "Sync appointments & reminders", color: "bg-primary/80" },
  ];

  return (
    <div className="mobile-container pb-28">
      <PageHeader title="Profile" subtitle="Manage your health identity" icon={User} />

      <div className="px-5 space-y-3 mt-3">
        {/* ─── PROFILE HEADER ─── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-elevated p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shrink-0">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="" className="w-16 h-16 rounded-2xl object-cover" />
            ) : (
              <User className="w-8 h-8 text-primary-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base">{user?.user_metadata?.full_name || "Sarah Johnson"}</h2>
            <p className="text-xs text-muted-foreground truncate">{user?.email || "sarah.j@gmail.com"}</p>
          </div>
          <button className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Edit2 className="w-4 h-4 text-primary" />
          </button>
        </motion.div>

        {/* Profile Completion */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold">Health Profile Completion</p>
            <span className="text-xs font-bold text-primary">{completion}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
            <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${completion}%` }} />
          </div>
          {incompleteSuggestions.length > 0 && (
            <div className="space-y-2">
              {incompleteSuggestions.map((s) => (
                <button key={s.label} className="flex items-center gap-2 w-full text-left">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <s.icon className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-xs text-primary font-medium flex-1">{s.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ═══════════════════════ ACCOUNT ═══════════════════════ */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pt-2">Account</p>

        <SectionHeader icon={User} label="Personal Information" section="personal" badge={`${age} years · Female`} expanded={expandedSection === "personal"} onToggle={() => toggle("personal")} />
        {expandedSection === "personal" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2">
            <InfoRow label="Name" value={user?.user_metadata?.full_name || "Sarah Johnson"} editable />
            <InfoRow label="Email" value={user?.email || "sarah.j@gmail.com"} />
            <InfoRow label="Age" value={`${age} years`} />
            <InfoRow label="Date of Birth" value={birthDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} editable />
            <InfoRow label="Gender" value="Female" editable />
            <InfoRow label="Height" value="165 cm" editable />
            <InfoRow label="Weight" value="62 kg" editable />
            <InfoRow label="Blood Group" value="B+" editable />
          </motion.div>
        )}

        <SectionHeader icon={CreditCard} label="ABHA ID" section="abha" badge="Linked & Verified" expanded={expandedSection === "abha"} onToggle={() => toggle("abha")} />
        {expandedSection === "abha" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2">
            <InfoRow label="ABHA Number" value="91-4829-6371-8294" />
            <InfoRow label="ABHA Address" value="sarah.johnson@abdm" />
            <InfoRow label="Status" value="✅ Verified" />
          </motion.div>
        )}

        {/* ═══════════════════════ HEALTH PROFILE ═══════════════════════ */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pt-2">Health Profile</p>

        <SectionHeader icon={Heart} label="Conditions" section="conditions" badge={`${conditions.length} active`} expanded={expandedSection === "conditions"} onToggle={() => toggle("conditions")} />
        {expandedSection === "conditions" && (
          <HealthEntryList items={conditions} emptyMessage="No conditions recorded." onAdd={() => {}} addLabel="Add Condition" />
        )}

        <SectionHeader icon={Pill} label="Medications" section="medications" badge={`${medications.length} active`} expanded={expandedSection === "medications"} onToggle={() => toggle("medications")} />
        {expandedSection === "medications" && (
          <HealthEntryList items={medications} emptyMessage="No medications recorded." onAdd={() => {}} addLabel="Add Medication" />
        )}

        <SectionHeader icon={Activity} label="Allergies" section="allergies" badge={allergies.length > 0 ? `${allergies.length} recorded` : "None added"} expanded={expandedSection === "allergies"} onToggle={() => toggle("allergies")} />
        {expandedSection === "allergies" && (
          <HealthEntryList items={allergies} emptyMessage="No allergies recorded yet." onAdd={() => {}} addLabel="Add Allergy" />
        )}

        <SectionHeader icon={Stethoscope} label="Doctors" section="doctors" badge={`${doctors.length} doctors`} expanded={expandedSection === "doctors"} onToggle={() => toggle("doctors")} />
        {expandedSection === "doctors" && (
          <HealthEntryList items={doctors} emptyMessage="No doctors added." onAdd={() => {}} addLabel="Add Doctor" />
        )}

        <SectionHeader icon={Dna} label="Family Medical History" section="genetics" badge={`${geneticRecords.length} records`} expanded={expandedSection === "genetics"} onToggle={() => toggle("genetics")} />
        {expandedSection === "genetics" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2">
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

        <SectionHeader icon={Phone} label="Contacts & Guardians" section="contacts" badge={`${contacts.length + guardians.length} people`} expanded={expandedSection === "contacts"} onToggle={() => toggle("contacts")} />
        {expandedSection === "contacts" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2">
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

        <SectionHeader icon={Shield} label="Insurance" section="insurance" badge="1 active policy" expanded={expandedSection === "insurance"} onToggle={() => toggle("insurance")} />
        {expandedSection === "insurance" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2">
            <InfoRow label="Provider" value="Star Health" />
            <InfoRow label="Policy No." value="SH-2024-738291" />
            <InfoRow label="Sum Insured" value="₹10,00,000" />
            <InfoRow label="Valid Till" value="Dec 2025" />
            <button className="w-full mt-2 mb-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold">
              <Plus className="w-3.5 h-3.5" /> Add Another Policy
            </button>
          </motion.div>
        )}

        {/* ═══════════════════════ HEALTH INTEGRATIONS ═══════════════════════ */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pt-2">Health Integrations</p>

        <SectionHeader icon={Smartphone} label="Connected Services" section="services" badge={`${Object.values(connectedServices).filter(Boolean).length} connected`} expanded={expandedSection === "services"} onToggle={() => toggle("services")} />
        {expandedSection === "services" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-2">
            {integrationServices.map((service) => (
              <div key={service.key} className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
                <div className={`w-8 h-8 rounded-lg ${service.color} flex items-center justify-center`}>
                  <Heart className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">{service.name}</p>
                  <p className="text-[10px] text-muted-foreground">{service.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  {connectedServices[service.key] && (
                    <span className="text-[9px] font-semibold text-health-good flex items-center gap-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                  <Switch
                    checked={connectedServices[service.key]}
                    onCheckedChange={(checked) => setConnectedServices((prev) => ({ ...prev, [service.key]: checked }))}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ═══════════════════════ REMINDER SETTINGS ═══════════════════════ */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pt-2">Reminder Settings</p>

        <SectionHeader icon={Bell} label="Reminder Preferences" section="reminders" badge="Sound, vibration, snooze" expanded={expandedSection === "reminders"} onToggle={() => toggle("reminders")} />
        {expandedSection === "reminders" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-1">
            <SettingToggle icon={Volume2} label="Notification Sound" description="Play sound for reminders" checked={reminderSettings.sound} onChange={(v) => setReminderSettings({ ...reminderSettings, sound: v })} />
            <SettingToggle icon={Vibrate} label="Vibration" description="Vibrate on reminder alerts" checked={reminderSettings.vibration} onChange={(v) => setReminderSettings({ ...reminderSettings, vibration: v })} />
            <SettingToggle icon={Lock} label="Show on Lock Screen" description="Display reminders on lock screen" checked={reminderSettings.showOnLockScreen} onChange={(v) => setReminderSettings({ ...reminderSettings, showOnLockScreen: v })} />
            <div className="flex items-center justify-between py-3 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold">Default Snooze</p>
                  <p className="text-[10px] text-muted-foreground">Time before re-alerting</p>
                </div>
              </div>
              <select
                value={reminderSettings.defaultSnooze}
                onChange={(e) => setReminderSettings({ ...reminderSettings, defaultSnooze: e.target.value })}
                className="bg-muted/50 px-3 py-1.5 text-xs rounded-lg outline-none"
              >
                <option value="5">5 min</option>
                <option value="10">10 min</option>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════ APP PREFERENCES ═══════════════════════ */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pt-2">App Preferences</p>

        <SectionHeader icon={Settings} label="General Settings" section="appSettings" badge="Language, units, theme" expanded={expandedSection === "appSettings"} onToggle={() => toggle("appSettings")} />
        {expandedSection === "appSettings" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-1">
            <SettingToggle icon={Moon} label="Dark Mode" description="Switch to dark theme" checked={appPrefs.darkMode} onChange={(v) => setAppPrefs({ ...appPrefs, darkMode: v })} />
            <div className="flex items-center justify-between py-3 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold">Language</p>
                  <p className="text-[10px] text-muted-foreground">App display language</p>
                </div>
              </div>
              <select
                value={appPrefs.language}
                onChange={(e) => setAppPrefs({ ...appPrefs, language: e.target.value })}
                className="bg-muted/50 px-3 py-1.5 text-xs rounded-lg outline-none"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Telugu</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold">Units</p>
                  <p className="text-[10px] text-muted-foreground">Weight, height measurement</p>
                </div>
              </div>
              <select
                value={appPrefs.units}
                onChange={(e) => setAppPrefs({ ...appPrefs, units: e.target.value })}
                className="bg-muted/50 px-3 py-1.5 text-xs rounded-lg outline-none"
              >
                <option>Metric</option>
                <option>Imperial</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sun className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold">Temperature</p>
                  <p className="text-[10px] text-muted-foreground">Temperature unit</p>
                </div>
              </div>
              <select
                value={appPrefs.tempUnit}
                onChange={(e) => setAppPrefs({ ...appPrefs, tempUnit: e.target.value })}
                className="bg-muted/50 px-3 py-1.5 text-xs rounded-lg outline-none"
              >
                <option>Celsius</option>
                <option>Fahrenheit</option>
              </select>
            </div>
          </motion.div>
        )}

        <SectionHeader icon={Mail} label="Notifications" section="notifications" badge="Email & push settings" expanded={expandedSection === "notifications"} onToggle={() => toggle("notifications")} />
        {expandedSection === "notifications" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-1">
            <SettingToggle icon={Mail} label="Daily AI Summary" description="Receive daily health digest via email" checked={notifPrefs.dailySummary} onChange={(v) => setNotifPrefs({ ...notifPrefs, dailySummary: v })} />
            <SettingToggle icon={Bell} label="Reminder Notifications" description="Push notifications for reminders" checked={notifPrefs.reminderNotifs} onChange={(v) => setNotifPrefs({ ...notifPrefs, reminderNotifs: v })} />
            <SettingToggle icon={FileText} label="Report Alerts" description="Alerts when reports are processed" checked={notifPrefs.reportAlerts} onChange={(v) => setNotifPrefs({ ...notifPrefs, reportAlerts: v })} />
          </motion.div>
        )}

        {/* ═══════════════════════ PRIVACY & SECURITY ═══════════════════════ */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pt-2">Privacy & Security</p>

        <SectionHeader icon={Lock} label="Data & Privacy" section="privacy" badge="Your data is secure" expanded={expandedSection === "privacy"} onToggle={() => toggle("privacy")} />
        {expandedSection === "privacy" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card px-4 py-3 space-y-3">
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
            <div className="flex items-start gap-3">
              <Fingerprint className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold">Data Stored Locally & Encrypted</p>
                <p className="text-[10px] text-muted-foreground">Your health data is stored securely with encryption standards.</p>
              </div>
            </div>
            <div className="pt-2 border-t border-border/30">
              <ActionRow icon={Trash2} label="Delete My Account & Data" onClick={() => {}} danger />
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════ SUPPORT ═══════════════════════ */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pt-2">Support</p>

        <div className="glass-card px-4 py-1">
          <ActionRow icon={MessageSquare} label="Send Feedback" onClick={() => {}} />
          <ActionRow icon={AlertTriangle} label="Report a Problem" onClick={() => {}} />
          <ActionRow icon={HelpCircle} label="Help Center" onClick={() => {}} />
        </div>

        {/* ═══════════════════════ ABOUT ═══════════════════════ */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pt-2">About</p>

        <div className="glass-card px-4 py-1">
          <InfoRow label="App Version" value="1.0.0" />
          <ActionRow icon={FileText} label="Terms of Service" onClick={() => {}} />
          <ActionRow icon={Shield} label="Privacy Policy" onClick={() => {}} />
        </div>

        {/* ═══════════════════════ SIGN OUT ═══════════════════════ */}
        <button onClick={handleSignOut} className="w-full glass-card p-4 flex items-center gap-4 text-health-alert mt-2">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
