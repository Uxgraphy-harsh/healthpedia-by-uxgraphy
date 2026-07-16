import { useState } from "react";
import {
  Plus,
  Heart,
  Activity,
  ShieldCheck,
  Car,
  Copy,
  ArrowUpRight,
  Check,
  Upload,
  Plane,
  Grip,
  ChevronDown,
} from "lucide-react";
import { AppFrame, type EmbeddedProps } from "./_embedded";

type Status = "Active" | "Expiring" | "Expired";

interface Policy {
  id: string;
  category: string;
  categoryColor: string;
  iconBg: string;
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

// ---------- Add Policy Sheet ----------

const insuranceTypes = [
  { id: "health", label: "Health", Icon: Heart },
  { id: "life", label: "Life", Icon: Activity },
  { id: "term", label: "Term", Icon: ShieldCheck },
  { id: "vehicle", label: "Vehicle", Icon: Car },
  { id: "travel", label: "Travel", Icon: Plane },
  { id: "other", label: "Other", Icon: Grip },
];

function AddPolicySheet({ onClose }: { onClose: () => void }) {
  const [provider, setProvider] = useState("");
  const [policyName, setPolicyName] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [purchasedOn, setPurchasedOn] = useState("");
  const [expiresOn, setExpiresOn] = useState("");
  const [sumInsured, setSumInsured] = useState("");
  const [premium, setPremium] = useState("");
  const [frequency, setFrequency] = useState("Annually");
  const [nominee, setNominee] = useState("");
  const [notes, setNotes] = useState("");
  const [type, setType] = useState<string>("health");

  const canSave =
    provider.trim() !== "" && policyNumber.trim() !== "" && expiresOn.trim() !== "";

  const inputCls =
    "w-full rounded-2xl border border-border/60 bg-white px-4 pt-5 pb-2 text-[15px] text-black outline-none focus:border-black/40 placeholder:text-muted-foreground/70";
  const labelCls =
    "absolute left-4 top-2 text-[11px] font-medium text-muted-foreground";

  return (
    <div className="fixed inset-0 z-[90] bg-black/40 flex items-end" onClick={onClose}>
      <div
        className="w-full max-w-md mx-auto bg-[#FAFAFA] rounded-t-3xl flex flex-col max-h-[95dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-black/15 mx-auto my-3 shrink-0" />

        {/* Header */}
        <div className="flex items-center px-5 pb-3 shrink-0">
          <button
            onClick={onClose}
            className="text-[15px] font-medium text-[#60A5FA] w-20 text-left"
          >
            Cancel
          </button>
          <h3 className="flex-1 text-center text-[17px] font-bold text-black">
            Add an Insurance Policy
          </h3>
          <div className="w-20" />
        </div>

        {/* Body */}
        <div className="px-5 pb-4 flex-1 overflow-y-auto">
          {/* AI upload card */}
          <button
            className="w-full rounded-2xl border border-dashed border-border p-6 mb-5 text-center"
            style={{
              background:
                "linear-gradient(135deg,#EEF2FF 0%,#FFFFFF 45%,#FEF3F2 100%)",
            }}
          >
            <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-white flex items-center justify-center border border-border/60">
              <Upload className="w-5 h-5 text-rose-500" strokeWidth={2.2} />
            </div>
            <p className="text-[15px] font-bold text-black leading-snug">
              Upload file for AI to
              <br />
              automatically fetch details
            </p>
            <p className="text-[12px] text-muted-foreground mt-1">
              Max upto 2 mb per file upload
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              {["PDF", "JPG", "PNG"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full bg-black/10 text-[11px] font-medium text-black/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </button>

          {/* Form fields */}
          <div className="space-y-3">
            <FloatingField
              label="Insurance provider"
              required
              value={provider}
              onChange={setProvider}
              placeholder="e.g. Healthpedia Future Secure"
            />
            <FloatingField
              label="Policy Name"
              value={policyName}
              onChange={setPolicyName}
              placeholder="e.g. Healthpedia Future Secure"
            />
            <FloatingField
              label="Policy Number"
              required
              value={policyNumber}
              onChange={setPolicyNumber}
              placeholder="0000000000"
            />

            <div className="grid grid-cols-2 gap-3">
              <FloatingField
                label="Purchased on"
                value={purchasedOn}
                onChange={setPurchasedOn}
                placeholder="00/00/0000"
              />
              <FloatingField
                label="Expires on"
                required
                value={expiresOn}
                onChange={setExpiresOn}
                placeholder="00/00/0000"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FloatingField
                label="Sum Insured"
                value={sumInsured}
                onChange={setSumInsured}
                placeholder="₹10,00,000"
              />
              <FloatingField
                label="Premium"
                value={premium}
                onChange={setPremium}
                placeholder="₹12,400/yr"
              />
            </div>

            {/* Frequency select */}
            <div className="relative">
              <span className={labelCls}>Premium Frequency</span>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className={`${inputCls} appearance-none font-semibold pr-10`}
              >
                <option>Annually</option>
                <option>Half-yearly</option>
                <option>Quarterly</option>
                <option>Monthly</option>
                <option>One-time</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            <FloatingField
              label="Nominee"
              value={nominee}
              onChange={setNominee}
              placeholder="Full name of nominee"
            />

            {/* Notes */}
            <div className="relative">
              <span className={labelCls}>Notes</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional details, claims history, etc."
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>

          {/* Insurance type */}
          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Insurance Type
            </p>
            <div className="grid grid-cols-2 gap-3">
              {insuranceTypes.map((t) => {
                const active = type === t.id;
                const Icon = t.Icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`flex items-center justify-center gap-2 h-12 rounded-2xl border text-[15px] font-medium transition-colors ${
                      active
                        ? "border-transparent text-white"
                        : "border-border/60 bg-white text-black/70"
                    }`}
                    style={active ? { background: "#60A5FA" } : undefined}
                  >
                    <Icon
                      className="w-4 h-4"
                      strokeWidth={2}
                      fill={active && t.id === "health" ? "white" : "none"}
                    />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="px-5 pb-6 pt-2 shrink-0">
          <button
            disabled={!canSave}
            onClick={onClose}
            className="w-full h-14 rounded-full text-white text-[17px] font-semibold transition-colors"
            style={{ background: canSave ? "#171717" : "#B8B8BE" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function FloatingField({
  label,
  required,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-2 text-[11px] font-medium text-muted-foreground">
        {label}
        {required && <span className="text-[#E5484D]">*</span>}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border/60 bg-white px-4 pt-5 pb-2 text-[15px] text-black outline-none focus:border-black/40 placeholder:text-muted-foreground/70"
      />
    </div>
  );
}

// ---------- Main ----------

export default function Insurance({ embedded }: EmbeddedProps = {}) {
  const [copied, setCopied] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

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
              <div className="flex items-start gap-3 p-4">
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: p.iconBg }}
                >
                  <Icon className={`h-6 w-6 ${p.iconColor}`} strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] font-medium ${p.categoryColor}`}>
                    {p.category}
                  </p>
                  <p className="text-[15px] font-bold leading-snug text-foreground">
                    {p.name}
                  </p>
                  <button
                    onClick={() => copyPolicy(p.id, p.policyNo)}
                    className="mt-0.5 inline-flex items-center gap-1.5 text-[12px] text-blue-600 hover:underline"
                  >
                    <span className="underline underline-offset-2">
                      Policy: {p.policyNo}
                    </span>
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

              <div className="grid grid-cols-3 border-t border-border/60">
                {p.fields.map((f, i) => (
                  <div
                    key={f.label}
                    className={`px-4 py-3 ${i < 2 ? "border-r border-border/60" : ""}`}
                  >
                    <p className="text-[13px] font-semibold text-foreground leading-tight">
                      {f.value}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{f.label}</p>
                  </div>
                ))}
              </div>

              <button className="w-full flex items-center gap-3 px-4 py-3 border-t border-border/60 text-left hover:bg-muted/30 transition">
                <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-red-500">PDF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">
                    {p.file.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{p.file.size}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            </div>
          );
        })}
      </div>

      {!showAdd && (
        <button
          onClick={() => setShowAdd(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg"
          style={{ background: "#171717" }}
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
          <span className="font-semibold">Add policy</span>
        </button>
      )}

      {showAdd && <AddPolicySheet onClose={() => setShowAdd(false)} />}
    </AppFrame>
  );
}
