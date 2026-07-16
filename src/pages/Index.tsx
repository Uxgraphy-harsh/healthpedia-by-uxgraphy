import { useState } from "react";
import OnboardingFlow from "@/components/OnboardingFlow";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Index() {
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem("healthpedia_onboarded") === "true");
  const navigate = useNavigate();

  useEffect(() => {
    if (onboarded) {
      navigate("/home", { replace: true });
    }
  }, [onboarded, navigate]);

  if (onboarded) return null;

  return (
    <OnboardingFlow
      onComplete={() => {
        localStorage.setItem("healthpedia_onboarded", "true");
        setOnboarded(true);
      }}
    />
  );
}
