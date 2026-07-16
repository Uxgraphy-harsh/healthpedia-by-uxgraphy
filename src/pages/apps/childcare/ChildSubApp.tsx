import { ArrowLeft, Search } from "lucide-react";
import Prescriptions from "../Prescriptions";
import Symptoms from "../Symptoms";
import Allergies from "../Allergies";
import Insurance from "../Insurance";
import Notes from "../Notes";
import Vault from "../Vault";

export type ChildAppId =
  | "prescriptions"
  | "symptoms"
  | "allergies"
  | "insurance"
  | "notes"
  | "vault";

interface Kid {
  id: string;
  name: string;
  initials: string;
  color: string;
  ageDetail: string;
}

interface Props {
  kid: Kid;
  appId: ChildAppId;
  onBack: () => void;
}

const APP_META: Record<ChildAppId, { title: string; emoji: string; bg: string }> = {
  prescriptions: { title: "Prescriptions", emoji: "💊", bg: "bg-[#FEE2E2]" },
  symptoms:      { title: "Symptoms",      emoji: "🌡️", bg: "bg-[#FED7AA]" },
  allergies:     { title: "Allergies",     emoji: "🥜", bg: "bg-[#FCE7F3]" },
  insurance:     { title: "Insurance",     emoji: "🛡️", bg: "bg-[#DBEAFE]" },
  notes:         { title: "Notes",         emoji: "📝", bg: "bg-[#E9D5FF]" },
  vault:         { title: "Vault",         emoji: "🗂️", bg: "bg-[#E0E7FF]" },
};

export default function ChildSubApp({ kid, appId, onBack }: Props) {
  const meta = APP_META[appId];
  const showSearch = appId === "vault";

  // Each mount is fresh — data is scoped to this child by component instance.
  // Search UX for non-vault apps is intentionally hidden per product spec.
  const renderApp = () => {
    switch (appId) {
      case "prescriptions": return <Prescriptions embedded scopeLabel={kid.name} />;
      case "symptoms":      return <Symptoms embedded scopeLabel={kid.name} />;
      case "allergies":     return <Allergies embedded scopeLabel={kid.name} />;
      case "insurance":     return <Insurance embedded scopeLabel={kid.name} />;
      case "notes":         return <Notes embedded scopeLabel={kid.name} />;
      case "vault":         return <Vault embedded scopeLabel={kid.name} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[75] bg-[#F5F5F7] flex flex-col">
      {/* header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border border-border/60 flex items-center justify-center shadow-sm"
          aria-label="Back to child"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full ${kid.color} text-white text-[10px] font-bold flex items-center justify-center`}>
            {kid.initials}
          </div>
          <span className="text-[13px] font-semibold">{kid.name}</span>
        </div>
        {showSearch ? (
          <button className="w-9 h-9 rounded-full bg-white border border-border/60 flex items-center justify-center shadow-sm" aria-label="Search">
            <Search className="w-4 h-4 text-muted-foreground" />
          </button>
        ) : (
          <div className="w-9 h-9" />
        )}
      </div>

      {/* title */}
      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <div className={`w-11 h-11 rounded-2xl ${meta.bg} flex items-center justify-center text-xl`}>{meta.emoji}</div>
        <div className="min-w-0">
          <h1 className="text-[22px] font-bold leading-tight truncate">{meta.title}</h1>
          <p className="text-[11px] text-muted-foreground">For {kid.name} · {kid.ageDetail}</p>
        </div>
      </div>

      {/* content — reuses the exact main mini-app component in embedded mode */}
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        {renderApp()}
      </div>
    </div>
  );
}
