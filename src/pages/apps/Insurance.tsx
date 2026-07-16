import { useState } from "react";
import { Plus, Heart, Activity, ShieldCheck, Car, Copy, ArrowUpRight, Check } from "lucide-react";
import { AppFrame, type EmbeddedProps } from "./_embedded";

type Status = "Active" | "Expiring" | "Expired";

interface Policy {
  id: string;
  category: string;
  categoryColor: string; // tailwind text color class
  iconBg: string; // gradient bg
  Icon: React.ElementType;
  iconColor: string;
  name: string;
  policyNo: string;
  status: Status;
  fields: { label: string; value: string }[];
  file: { name: string; size: string };
}

const policies: Policy[] = [
  {
    id: "i1",
    category: "Health Insurance",
    categoryColor: "text-emerald-600",
    iconBg: "linear-gradient(135deg,#DCFCE7,#A7F3D0)",
    Icon: Heart,
    iconColor: "text-emerald-600",
    name: "Star Health Complete",
    policyNo: "SH-2024-738291",
    status: "Expiring",
    fields: [
      { label: "Cover", value: "₹10,00,000" },
      { label: "Premium", value: "₹12,400/yr" },
      { label: "Expires", value: "Dec '25" },
    ],
    file: { name: "SH-2024-738291.pdf", size: "4.1 MB" },
  },
  {
    id: "i2",
    category: "Life Insurance",
    categoryColor: "text-rose-500",
    iconBg: "linear-gradient(135deg,#FFE4E6,#FECDD3)",
    Icon: Activity,
    iconColor: "text-rose-500",
    name: "LIC Jeevan Anand",
    policyNo: "LIC-776421-20",
    status: "Active",
    fields: [
      { label: "Cover", value: "₹50,00,000" },
      { label: "Premium", value: "₹28,000/yr" },
      { label: "Matures", value: "2045" },
    ],
    file: { name: "LIC-776421-20.pdf", size: "4.1 MB" },
  },
  {
    id: "i3",
    category: "Term Insurance",
    categoryColor: "text-purple-500",
    iconBg: "linear-gradient(135deg,#EDE9FE,#DDD6FE)",
    Icon: ShieldCheck,
    iconColor: "text-purple-500",
    name: "HDFC Click 2 Protect",
    policyNo: "HDFC-TRM-20240089",
    status: "Active",
    fields: [
      { label: "Cover", value: "₹1 Cr" },
      { label: "Premium", value: "₹9,800/yr" },
      { label: "Expires", value: "2054" },
    ],
    file: { name: "HDFC-TRM-20240089.pdf", size: "4.1 MB" },
  },
  {
    id: "i4",
    category: "Vehicle Insurance",
    categoryColor: "text-amber-500",
    iconBg: "linear-gradient(135deg,#FEF3C7,#FDE68A)",
    Icon: Car,
    iconColor: "text-amber-600",
    name: "Bajaj Allianz Comprehensive",
    policyNo: "BAJ-2024-MH12AB1234",
    status: "Active",
    fields: [
      { label: "Vehicle", value: "Honda City" },
      { label: "IDV", value: "₹8,20,000" },
      { label: "Expires", value: "Mar '26" },
    ],
    file: { name: "BAJ-2024-MH12AB1234.pdf", size: "4.1 MB" },
  },
];

const statusStyles: Record<Status, string> = {
  Active: "bg-emerald-50 text-emerald-600",
  Expiring: "bg-orange-50 text-orange-500",
  Expired: "bg-rose-50 text-rose-500",
};

export default function Insurance({ embedded }: EmbeddedProps = {}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyPolicy = (id: string, no: string) => {
    navigator.clipboard?.writeText(no);
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
  };

  return (
    <AppFrame appId="insurance" embedded={embedded}>
      <div className="space-y-4">
        {policies.map((p) => {
          const Icon = p.Icon;
          return (
            <div
              key={p.id}
              className="rounded-2xl border border-border/60 bg-card overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start gap-3 p-4">
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: p.iconBg }}
                >
                  <Icon className={`h-6 w-6 ${p.iconColor}`} strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] font-medium ${p.categoryColor}`}>{p.category}</p>
                  <p className="text-[15px] font-bold leading-snug text-foreground">{p.name}</p>
                  <button
                    onClick={() => copyPolicy(p.id, p.policyNo)}
                    className="mt-0.5 inline-flex items-center gap-1.5 text-[12px] text-blue-600 hover:underline"
                  >
                    <span className="underline underline-offset-2">Policy: {p.policyNo}</span>
                    {copied === p.id ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyles[p.status]}`}
                >
                  {p.status}
                </span>
              </div>

              {/* Fields row */}
              <div className="grid grid-cols-3 border-t border-border/60">
                {p.fields.map((f, i) => (
                  <div
                    key={f.label}
                    className={`px-4 py-3 ${i < 2 ? "border-r border-border/60" : ""}`}
                  >
                    <p className="text-[13px] font-semibold text-foreground leading-tight">{f.value}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{f.label}</p>
                  </div>
                ))}
              </div>

              {/* File row */}
              <button className="w-full flex items-center gap-3 px-4 py-3 border-t border-border/60 text-left hover:bg-muted/30 transition">
                <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-red-500">PDF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{p.file.name}</p>
                  <p className="text-[11px] text-muted-foreground">{p.file.size}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating Add policy button */}
      <button
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg"
        style={{ background: "#171717" }}
      >
        <Plus className="h-5 w-5" strokeWidth={2.5} />
        <span className="font-semibold">Add policy</span>
      </button>
    </AppFrame>
  );
}
