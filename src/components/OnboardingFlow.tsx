import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, FileText, MessageCircle, Smartphone, ChevronRight, Plus, Trash2 } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

const conditions = ["Diabetes", "Thyroid", "Hypertension", "PCOS", "Heart Conditions", "Other"];

const slideVariants = {
  enter: { x: 100, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
};

export default function OnboardingFlow({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ age: "", gender: "", height: "", weight: "" });
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState([{ name: "", dosage: "", frequency: "Daily" }]);

  const next = () => {
    if (step < 5) setStep(step + 1);
    else onComplete();
  };

  const toggleCondition = (c: string) =>
    setSelectedConditions((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background">
      {/* Progress */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "gradient-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex-1 flex flex-col px-6 py-4"
        >
          {step === 0 && (
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mb-8 shadow-lg">
                <Activity className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold mb-4 font-serif">
                Your Health.
                <br />
                Understood in Context.
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed max-w-xs">
                Healthpedia connects your reports, medications, symptoms, and habits into one intelligent health memory.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-2xl font-bold font-serif mb-8 text-center">What Healthpedia Does</h2>
              <div className="space-y-4">
                {[
                  { icon: FileText, title: "Organize Medical Records", desc: "All your reports in one place, auto-organized by AI." },
                  { icon: Activity, title: "Understand Your Health Trends", desc: "Track patterns across vitals, symptoms, and habits." },
                  { icon: MessageCircle, title: "Ask Questions Anytime", desc: "Get context-aware answers from your health data." },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="glass-card p-5 flex items-start gap-4"
                  >
                    <div className="w-11 h-11 rounded-xl gradient-accent flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold font-sans text-sm mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-xs">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-2xl font-bold font-serif mb-3 text-center">Connect Your Devices</h2>
              <p className="text-muted-foreground text-center text-sm mb-8">
                Sync health metrics so the AI can give you better insights.
              </p>
              <div className="space-y-4">
                {[
                  { name: "Google Fit", desc: "Steps, heart rate, workouts" },
                  { name: "Apple Health", desc: "Sleep, vitals, activity" },
                ].map((d, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-5 w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{d.name}</p>
                        <p className="text-muted-foreground text-xs">{d.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                ))}
              </div>
              <button onClick={next} className="text-sm text-muted-foreground mt-6 text-center underline">
                Skip for now
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 flex flex-col">
              <h2 className="text-2xl font-bold font-serif mb-6 text-center">Health Profile</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: "Age", key: "age", placeholder: "28", type: "number" },
                  { label: "Gender", key: "gender", placeholder: "Female" },
                  { label: "Height (cm)", key: "height", placeholder: "165", type: "number" },
                  { label: "Weight (kg)", key: "weight", placeholder: "60", type: "number" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{f.label}</label>
                    <input
                      type={f.type || "text"}
                      placeholder={f.placeholder}
                      value={(profile as any)[f.key]}
                      onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                      className="w-full glass-card px-4 py-3 text-sm rounded-xl bg-card outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm font-semibold mb-3">Do you manage any chronic conditions?</p>
              <div className="flex flex-wrap gap-2">
                {conditions.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleCondition(c)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      selectedConditions.includes(c)
                        ? "gradient-primary text-primary-foreground"
                        : "glass-card text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex-1 flex flex-col">
              <h2 className="text-2xl font-bold font-serif mb-2 text-center">Current Medications</h2>
              <p className="text-muted-foreground text-center text-sm mb-6">Optional — you can add later</p>
              <div className="space-y-3 flex-1">
                {medications.map((m, i) => (
                  <div key={i} className="glass-card p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-muted-foreground">Medication {i + 1}</span>
                      {medications.length > 1 && (
                        <button onClick={() => setMedications(medications.filter((_, j) => j !== i))}>
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                    <input
                      placeholder="Medicine name"
                      value={m.name}
                      onChange={(e) => {
                        const updated = [...medications];
                        updated[i].name = e.target.value;
                        setMedications(updated);
                      }}
                      className="w-full bg-muted/50 px-3 py-2.5 text-sm rounded-xl outline-none"
                    />
                    <div className="flex gap-2">
                      <input
                        placeholder="Dosage"
                        value={m.dosage}
                        onChange={(e) => {
                          const updated = [...medications];
                          updated[i].dosage = e.target.value;
                          setMedications(updated);
                        }}
                        className="flex-1 bg-muted/50 px-3 py-2.5 text-sm rounded-xl outline-none"
                      />
                      <select
                        value={m.frequency}
                        onChange={(e) => {
                          const updated = [...medications];
                          updated[i].frequency = e.target.value;
                          setMedications(updated);
                        }}
                        className="bg-muted/50 px-3 py-2.5 text-sm rounded-xl outline-none"
                      >
                        <option>Daily</option>
                        <option>Twice Daily</option>
                        <option>Weekly</option>
                        <option>As Needed</option>
                      </select>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setMedications([...medications, { name: "", dosage: "", frequency: "Daily" }])}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Medication
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mb-8 shadow-lg">
                <Activity className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold font-serif mb-3">You're All Set!</h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-xs">
                Sign in to save your health profile and access your personalized companion.
              </p>
              <button
                onClick={onComplete}
                className="glass-card-elevated w-full py-4 flex items-center justify-center gap-3 rounded-2xl font-semibold text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom CTA */}
      {step !== 5 && step !== 2 && (
        <div className="px-6 pb-8">
          <button onClick={next} className="btn-primary-gradient w-full text-base">
            {step === 0 ? "Get Started" : "Continue"}
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="px-6 pb-8">
          <button onClick={next} className="btn-primary-gradient w-full text-base">
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
