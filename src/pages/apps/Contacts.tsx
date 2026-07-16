import { useState } from "react";
import { Plus, Phone, QrCode, Share2, X } from "lucide-react";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";

const contacts = [
  { id: "c1", name: "Dr. Sharma", role: "Primary Doctor", phone: "+91 99887 65432" },
  { id: "c2", name: "Dr. Mehta", role: "Cardiologist", phone: "+91 91234 56789" },
  { id: "c3", name: "John Johnson", role: "Spouse · Emergency", phone: "+91 98765 43210" },
  { id: "c4", name: "Apollo Ambulance", role: "Emergency", phone: "102" },
];

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
  const [qrFor, setQrFor] = useState<null | "all" | string>(null);
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
    >

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

      {/* Floating Add contact button */}
      <button
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-white shadow-lg"
        style={{ background: "#171717" }}
      >
        <Plus className="h-5 w-5" strokeWidth={2.5} />
        <span className="font-semibold">Add contact</span>
      </button>

    </MiniAppShell>
  );
}
