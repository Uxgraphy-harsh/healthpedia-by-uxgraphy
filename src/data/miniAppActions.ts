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
    A(Filter, "Filter"),
  ],
  vault: [
    A(FolderOpen, "Files", { active: true }),
    A(Plus, "New", { primary: true }),
    A(Search, "Search"),
  ],
  prescriptions: [
    A(Pill, "All", { active: true }),
    A(User, "Doctors"),
    A(Plus, "Add", { primary: true }),
    A(Search, "Search"),
  ],
  appointments: [
    A(Calendar, "Upcoming", { active: true }),
    A(Clock, "Past"),
    A(Plus, "Book", { primary: true }),
    A(MapPin, "Nearby"),
  ],
  symptoms: [
    A(Stethoscope, "Log", { active: true }),
    A(TrendingUp, "Trends"),
    A(Clock, "History"),
  ],
  cycle: [
    A(Calendar, "Calendar", { active: true }),
    A(TrendingUp, "Insights"),
    A(Droplets, "Log", { primary: true }),
    A(Settings2, "Settings"),
  ],
  fitness: [
    A(Activity, "Today", { active: true }),
    A(Smartphone, "Devices"),
    A(Goal, "Goals"),
    A(TrendingUp, "Trends"),
  ],
  allergies: [
    A(AlertTriangle, "All", { active: true }),
    A(Bell, "Alerts"),
    A(Phone, "SOS"),
  ],
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
  notes: [
    A(StickyNote, "All", { active: true }),
    A(Filter, "Filter"),
    A(Search, "Search"),
  ],
};
