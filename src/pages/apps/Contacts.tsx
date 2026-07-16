import { useState } from "react";
import { Plus, Phone, QrCode, Share2, X, Users, AlertTriangle, MapPin, Ambulance, Shield, Building2, Flame, ChevronDown, UserPlus, BookUser, Check } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";

// ---------- personal saved contacts ----------
type SavedContact = { id: string; name: string; role: string; phone: string };

const initialContacts: SavedContact[] = [
  { id: "c1", name: "Dr. Sharma", role: "Primary Doctor", phone: "+91 99887 65432" },
  { id: "c2", name: "Dr. Mehta", role: "Cardiologist", phone: "+91 91234 56789" },
  { id: "c3", name: "John Johnson", role: "Spouse · Emergency", phone: "+91 98765 43210" },
  { id: "c4", name: "Apollo Ambulance", role: "Emergency", phone: "102" },
];


// ---------- location-based emergency numbers ----------
type EmergencyNumber = {
  id: string;
  label: string;
  number: string;
  icon: typeof Ambulance;
  tint: string;
};

type EmergencyRegion = {
  country: string;
  city: string;
  flag: string;
  numbers: EmergencyNumber[];
  hospitals: { id: string; name: string; distance: string; phone: string }[];
};

const regions: Record<string, EmergencyRegion> = {
  in: {
    country: "India",
    city: "Bengaluru",
    flag: "🇮🇳",
    numbers: [
      { id: "n1", label: "Ambulance",        number: "102", icon: Ambulance,    tint: "#EF4444" },
      { id: "n2", label: "Police",           number: "100", icon: Shield,       tint: "#3B82F6" },
      { id: "n3", label: "Fire",             number: "101", icon: Flame,        tint: "#F97316" },
      { id: "n4", label: "All-in-one",       number: "112", icon: AlertTriangle,tint: "#DC2626" },
      { id: "n5", label: "Women helpline",   number: "1091",icon: Phone,        tint: "#EC4899" },
      { id: "n6", label: "Disaster mgmt.",   number: "108", icon: AlertTriangle,tint: "#8B5CF6" },
    ],
    hospitals: [
      { id: "h1", name: "Manipal Hospital, Old Airport Rd", distance: "2.3 km", phone: "+91 80 2502 4444" },
      { id: "h2", name: "Apollo Hospital, Bannerghatta",    distance: "4.1 km", phone: "+91 80 2630 4050" },
      { id: "h3", name: "Fortis Hospital, Cunningham Rd",   distance: "5.6 km", phone: "+91 80 6621 4444" },
    ],
  },
  us: {
    country: "United States",
    city: "San Francisco",
    flag: "🇺🇸",
    numbers: [
      { id: "n1", label: "All emergencies",  number: "911", icon: AlertTriangle,tint: "#DC2626" },
      { id: "n2", label: "Poison control",   number: "1-800-222-1222", icon: Ambulance, tint: "#EF4444" },
      { id: "n3", label: "Suicide & crisis", number: "988", icon: Phone,        tint: "#8B5CF6" },
      { id: "n4", label: "Non-emergency PD", number: "311", icon: Shield,       tint: "#3B82F6" },
    ],
    hospitals: [
      { id: "h1", name: "UCSF Medical Center",     distance: "1.8 mi", phone: "+1 415-476-1000" },
      { id: "h2", name: "SF General Hospital",     distance: "2.4 mi", phone: "+1 628-206-8000" },
      { id: "h3", name: "CPMC Van Ness Campus",    distance: "3.0 mi", phone: "+1 415-600-6000" },
    ],
  },
  uk: {
    country: "United Kingdom",
    city: "London",
    flag: "🇬🇧",
    numbers: [
      { id: "n1", label: "All emergencies",  number: "999", icon: AlertTriangle,tint: "#DC2626" },
      { id: "n2", label: "EU emergency",     number: "112", icon: AlertTriangle,tint: "#EF4444" },
      { id: "n3", label: "NHS non-emergency",number: "111", icon: Phone,        tint: "#0EA5E9" },
      { id: "n4", label: "Police non-emerg.",number: "101", icon: Shield,       tint: "#3B82F6" },
    ],
    hospitals: [
      { id: "h1", name: "St Thomas' Hospital",  distance: "1.2 mi", phone: "+44 20 7188 7188" },
      { id: "h2", name: "Guy's Hospital",       distance: "1.7 mi", phone: "+44 20 7188 7188" },
      { id: "h3", name: "UCL Hospital",         distance: "2.5 mi", phone: "+44 20 3456 7890" },
    ],
  },
};

function FakeQR({ label }: { label: string }) {
  return (
    <div className="w-56 h-56 rounded-2xl bg-foreground p-3 mx-auto">
      <div
        className="w-full h-full rounded-lg"
        style={{
          background: "conic-gradient(#fff 25%, #000 25% 50%, #fff 50% 75%, #000 75%)",
          backgroundSize: "18px 18px",
        }}
      />
      <p className="text-center text-[10px] text-background mt-2 truncate">{label}</p>
    </div>
  );
}

export default function Contacts() {
  const app = getMiniApp("contacts")!;
  const [tab, setTab] = useState<"contacts" | "emergency">("contacts");
  const [qrFor, setQrFor] = useState<null | "all" | string>(null);
  const [regionKey, setRegionKey] = useState<keyof typeof regions>("in");
  const [showRegion, setShowRegion] = useState(false);
  const region = regions[regionKey];

  const label = qrFor === "all"
    ? "All my contacts"
    : contacts.find((c) => c.id === qrFor)?.name || "";

  return (
    <MiniAppShell
      appId="contacts"
      name={app.name}
      tagline={app.tagline}
      icon={app.icon}
      bg={app.bg}
      fg={app.fg}
      bottomActions={[
        { icon: Users,          label: "Contacts",  active: tab === "contacts",  onClick: () => setTab("contacts") },
        { icon: AlertTriangle,  label: "Emergency", active: tab === "emergency", onClick: () => setTab("emergency") },
      ]}
    >
      {tab === "contacts" && (
        <>
          <button
            onClick={() => setQrFor("all")}
            className="w-full bg-gradient-to-r from-[#14B8A6] to-[#0EA5E9] rounded-2xl p-4 text-white flex items-center gap-3 mb-4"
          >
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold">Share all contacts</p>
              <p className="text-[11px] opacity-80">One QR — all emergency contacts</p>
            </div>
            <Share2 className="w-4 h-4" />
          </button>

          <div className="space-y-2">
            {contacts.map((c) => (
              <div key={c.id} className="bg-card rounded-2xl p-4 border border-border/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#14B8A6]/12 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-[#14B8A6]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{c.role} · {c.phone}</p>
                </div>
                <button
                  onClick={() => setQrFor(c.id)}
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
                >
                  <QrCode className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>

          {/* Floating Add contact button */}
          <button
            className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg"
            style={{ background: "#171717" }}
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
            <span className="font-semibold">Add contact</span>
          </button>
        </>
      )}

      {tab === "emergency" && (
        <>
          {/* location chip */}
          <button
            onClick={() => setShowRegion(true)}
            className="w-full bg-card rounded-2xl p-3 border border-border/40 flex items-center gap-3 mb-4"
          >
            <div className="w-10 h-10 rounded-full bg-[#EF4444]/12 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[#EF4444]" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[11px] text-muted-foreground">Showing emergency numbers for</p>
              <p className="text-sm font-semibold truncate">{region.flag} {region.city}, {region.country}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* emergency numbers grid */}
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-1">Emergency numbers</p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {region.numbers.map((n) => {
              const Icon = n.icon;
              return (
                <a
                  key={n.id}
                  href={`tel:${n.number.replace(/\s+/g, "")}`}
                  className="bg-card rounded-2xl p-3 border border-border/40 flex flex-col gap-2 active:scale-[0.98] transition-transform"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${n.tint}1A` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: n.tint }} />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">{n.label}</p>
                    <p className="text-lg font-bold tracking-tight">{n.number}</p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* nearby hospitals */}
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-1">Nearby hospitals</p>
          <div className="space-y-2">
            {region.hospitals.map((h) => (
              <div key={h.id} className="bg-card rounded-2xl p-4 border border-border/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3B82F6]/12 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#3B82F6]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{h.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{h.distance} away · {h.phone}</p>
                </div>
                <a
                  href={`tel:${h.phone.replace(/\s+/g, "")}`}
                  className="w-9 h-9 rounded-full bg-[#EF4444] flex items-center justify-center"
                  aria-label={`Call ${h.name}`}
                >
                  <Phone className="w-4 h-4 text-white" />
                </a>
              </div>
            ))}
          </div>

          {/* region picker */}
          {showRegion && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={() => setShowRegion(false)}>
              <div className="w-full bg-background rounded-t-3xl p-5 pb-8" onClick={(e) => e.stopPropagation()}>
                <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
                <p className="text-sm font-semibold mb-3">Choose location</p>
                <div className="space-y-1">
                  {(Object.keys(regions) as (keyof typeof regions)[]).map((k) => {
                    const r = regions[k];
                    const active = k === regionKey;
                    return (
                      <button
                        key={k}
                        onClick={() => { setRegionKey(k); setShowRegion(false); }}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl ${active ? "bg-[#EF4444]/10" : "hover:bg-muted"}`}
                      >
                        <span className="text-xl">{r.flag}</span>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-semibold">{r.country}</p>
                          <p className="text-[11px] text-muted-foreground">{r.city}</p>
                        </div>
                        {active && <div className="w-2 h-2 rounded-full bg-[#EF4444]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {qrFor && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-6"
          onClick={() => setQrFor(null)}
        >
          <div className="bg-background rounded-3xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold">Scan to share</p>
              <button onClick={() => setQrFor(null)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <FakeQR label={label} />
            <p className="text-center text-[11px] text-muted-foreground mt-4">{label}</p>
          </div>
        </div>
      )}
    </MiniAppShell>
  );
}
