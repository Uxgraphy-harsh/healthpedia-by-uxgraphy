import { Shield, Lock } from "lucide-react";

export function PrivacyBanner() {
  return (
    <div className="glass-card p-3 flex items-center gap-3 border-l-4 border-health-good">
      <Shield className="w-5 h-5 text-health-good shrink-0" />
      <p className="text-[10px] text-muted-foreground">
        Your health data is encrypted and stored securely on your device. We never share your information without your consent.
      </p>
    </div>
  );
}

export function SecureBadge() {
  return (
    <div className="flex items-center gap-1 text-[9px] text-health-good font-medium">
      <Lock className="w-3 h-3" />
      <span>Encrypted</span>
    </div>
  );
}
