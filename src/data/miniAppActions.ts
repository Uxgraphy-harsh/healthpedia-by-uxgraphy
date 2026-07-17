import {
  Plus, Upload, Search, Filter, TrendingUp, Clock, Calendar, MapPin,
  User, Pill, Stethoscope, Droplets, Activity, Smartphone, Goal,
  AlertTriangle, Phone, Users, Dna, Info, Baby, Syringe, QrCode,
  ShieldCheck, FileText, CreditCard, StickyNote, FolderOpen, Bell,
  Settings2, Share2, type LucideIcon,
} from "lucide-react";
import type { MiniAppAction } from "@/components/MiniAppBottomBar";

const A = (icon: LucideIcon, label: string, opts: Partial<MiniAppAction> = {}): MiniAppAction => ({
  icon, label, ...opts,
});

export const defaultBottomActions: Record<string, MiniAppAction[]> = {
  reminders: [
    A(Bell, "Today", { active: true }),
    A(Clock, "History"),
  ],
  vault: [
    A(FolderOpen, "Files", { active: true }),
    A(Search, "Search"),
  ],
  prescriptions: [
    A(Pill, "All", { active: true }),
    A(User, "Doctors"),
    A(Search, "Search"),
  ],
  appointments: [],
  symptoms: [],
  cycle: [
    A(Calendar, "Calendar", { active: true }),
    A(TrendingUp, "Insights"),
    A(Droplets, "Log", { primary: true }),
    A(Settings2, "Settings"),
  ],
  fitness: [],
  allergies: [],
  family: [
    A(Users, "Members", { active: true }),
    A(Dna, "Risk"),
    A(Info, "About"),
  ],
  childcare: [],

  contacts: [
    A(User, "All", { active: true }),
    A(QrCode, "Share QR"),
    A(Phone, "SOS"),
  ],
  insurance: [],
  notes: [],
};
