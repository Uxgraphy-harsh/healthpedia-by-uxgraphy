import {
  FolderOpen, ShieldCheck, Users, CalendarCheck, Baby, Droplets,
  Activity, AlertTriangle, Contact, Stethoscope, BellRing, Pill,
  StickyNote, Leaf, ShoppingBag, Wallet, Cigarette, type LucideIcon
} from "lucide-react";


export interface MiniApp {
  id: string;
  name: string;
  tagline: string;
  path: string;
  icon: LucideIcon;
  // Tailwind color tokens for the tile
  bg: string;      // background
  fg: string;      // icon/text color
  category: "records" | "care" | "tracking" | "people" | "utility";
  lockable?: boolean;
}

export const miniApps: MiniApp[] = [
  { id: "vault",         name: "Vault",          tagline: "Records & files",       path: "/apps/vault",         icon: FolderOpen,     bg: "bg-[#F66B9A]/12",  fg: "text-[#F66B9A]",  category: "records", lockable: true },
  { id: "prescriptions", name: "Prescriptions",  tagline: "Rx & doctors",          path: "/apps/prescriptions", icon: Pill,           bg: "bg-[#60A5FA]/12",  fg: "text-[#60A5FA]",  category: "records", lockable: true },
  { id: "appointments",  name: "Appointments",   tagline: "Visits & follow-ups",   path: "/apps/appointments",  icon: CalendarCheck,  bg: "bg-[#8B5CF6]/12",  fg: "text-[#8B5CF6]",  category: "care" },
  { id: "reminders",     name: "Reminders",      tagline: "Meds & tasks",          path: "/reminders",          icon: BellRing,       bg: "bg-[#F59E0B]/12",  fg: "text-[#F59E0B]",  category: "care" },
  { id: "symptoms",      name: "Symptoms",       tagline: "Track how you feel",    path: "/apps/symptoms",      icon: Stethoscope,    bg: "bg-[#EF4444]/12",  fg: "text-[#EF4444]",  category: "tracking" },
  { id: "cycle",         name: "Period Tracker", tagline: "Cycle tracking",        path: "/apps/cycle",         icon: Droplets,       bg: "bg-[#EC4899]/12",  fg: "text-[#EC4899]",  category: "tracking", lockable: true },
  { id: "fitness",       name: "Fitness",        tagline: "Devices & activity",    path: "/apps/fitness",       icon: Activity,       bg: "bg-[#10B981]/12",  fg: "text-[#10B981]",  category: "tracking" },
  { id: "allergies",     name: "Allergies",      tagline: "Triggers & reactions",  path: "/apps/allergies",     icon: AlertTriangle,  bg: "bg-[#F97316]/12",  fg: "text-[#F97316]",  category: "tracking" },
  { id: "family",        name: "Family History", tagline: "Genetic & hereditary",  path: "/apps/family",        icon: Users,          bg: "bg-[#0EA5E9]/12",  fg: "text-[#0EA5E9]",  category: "people",  lockable: true },
  { id: "childcare",     name: "Childcare",      tagline: "Kids' profiles",        path: "/apps/childcare",     icon: Baby,           bg: "bg-[#FB923C]/12",  fg: "text-[#FB923C]",  category: "people" },
  { id: "contacts",      name: "Contacts",       tagline: "Guardians & doctors",   path: "/apps/contacts",      icon: Contact,        bg: "bg-[#14B8A6]/12",  fg: "text-[#14B8A6]",  category: "people" },
  { id: "insurance",     name: "Insurance",      tagline: "Policies & claims",     path: "/apps/insurance",     icon: ShieldCheck,    bg: "bg-[#22C55E]/12",  fg: "text-[#22C55E]",  category: "utility", lockable: true },
  { id: "notes",         name: "Notes",          tagline: "Tag anything with @",   path: "/apps/notes",         icon: StickyNote,     bg: "bg-[#EAB308]/12",  fg: "text-[#EAB308]",  category: "utility" },
  { id: "impact",        name: "Impact",         tagline: "Environmental tracker", path: "/apps/impact",        icon: Leaf,           bg: "bg-[#2F7D5B]/12",  fg: "text-[#2F7D5B]",  category: "tracking" },
  { id: "shop",          name: "Shop",           tagline: "Period & wellness care",path: "/apps/shop",          icon: ShoppingBag,    bg: "bg-[#EF4E3B]/12",  fg: "text-[#EF4E3B]",  category: "utility" },
  { id: "budget",        name: "Expenses",  tagline: "Expenses & analytics",  path: "/apps/budget",        icon: Wallet,         bg: "bg-[#0EA5A5]/12",  fg: "text-[#0EA5A5]",  category: "utility", lockable: true },
  { id: "habits",        name: "Habits",         tagline: "Alcohol, tobacco & more",path: "/apps/habits",       icon: Cigarette,      bg: "bg-[#7C3AED]/12",  fg: "text-[#7C3AED]",  category: "tracking", lockable: true },

];

export const getMiniApp = (id: string) => miniApps.find((a) => a.id === id);
