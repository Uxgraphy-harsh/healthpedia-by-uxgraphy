import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Plus, Trash2, Smartphone, ChevronRight, Bell,
  Heart, Droplets, Moon, Zap, Smile, GlassWater, Weight,
  Thermometer, Search, Check, X, Calendar, FileText, BellRing,
  ClipboardList, Stethoscope, Clock, Pill
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import healthpediaFlower from "@/assets/healthpedia-flower.svg";
import splashScreen from "@/assets/splash-screen.svg";
import onboardingSlide1 from "@/assets/onboarding-slide-1.png";
import onboardingSlide2Bg from "@/assets/onboarding-slide-2-bg.png";
import onboardingCardSymptoms from "@/assets/onboarding-card-symptoms.svg";
import onboardingCardDoctor from "@/assets/onboarding-card-doctor.svg";
import onboardingIphoneBody from "@/assets/onboarding-iphone-body.svg";
import onboardingNotificationFloat from "@/assets/onboarding-notification-float.svg";

const slideBadges = [
  [
    { label: "Reminders", icon: Calendar, position: "top-[8%] right-[2%]" },
    { label: "Reports", icon: Heart, position: "top-[35%] -left-[4%]" },
    { label: "Notifications", icon: Bell, position: "bottom-[15%] right-[1%]" },
  ],
  [], // Slide 2 has no pill badges — uses UI card overlays instead
  [], // Slide 3 has no pill badges — uses floating notification on iPhone
];

const onboardingSlides = [
  {
    image: onboardingSlide1,
    title: "Track and manage your loved one's health with AI",
  },
  {
    image: "custom-slide-2",
    title: "Record symptoms for your next appointment",
  },
  {
    image: "custom-slide-3",
    title: "Timely reminders for those you love.",
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

const slideVariants = {
  enter: { x: 100, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
};

const TOTAL_STEPS = 8; // splash(auto) + welcome slider, basic, conditions, meds, trackers, integrations, notifications, done

const allConditions = [
  "Diabetes", "Hypertension", "Thyroid Disorder", "Asthma",
  "Heart Disease", "Migraine", "PCOS", "Arthritis",
  "Anxiety", "Depression", "Anemia", "None",
];

const trackerOptions = [
  { id: "blood_sugar", label: "Blood Sugar", icon: Droplets },
  { id: "blood_pressure", label: "Blood Pressure", icon: Heart },
  { id: "weight", label: "Weight", icon: Weight },
  { id: "sleep", label: "Sleep", icon: Moon },
  { id: "heart_rate", label: "Heart Rate", icon: Activity },
  { id: "mood", label: "Mood", icon: Smile },
  { id: "energy", label: "Energy Level", icon: Zap },
  { id: "water", label: "Water Intake", icon: GlassWater },
];

export default function OnboardingFlow({ onComplete }: OnboardingProps) {
  const { signInWithGoogle, user } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [step, setStep] = useState(0); // 0 = welcome slider, 1-7 = onboarding steps
  const [slideIndex, setSlideIndex] = useState(0);

  // Splash screen: show for 2s, then fade/blur out
  useEffect(() => {
    const timer1 = setTimeout(() => setSplashFading(true), 1500);
    const timer2 = setTimeout(() => setShowSplash(false), 2300);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  // Step 1: Basic Profile
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.full_name || "",
    dob: "",
    gender: "",
    height: "",
    weight: "",
  });

  // Step 2: Conditions
  const [conditionSearch, setConditionSearch] = useState("");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [customCondition, setCustomCondition] = useState("");

  // Step 3: Medications
  const [medications, setMedications] = useState([{ name: "", dosage: "", frequency: "Daily", conditionLink: "" }]);
  const [skipMeds, setSkipMeds] = useState(false);

  // Step 4: Trackers
  const [selectedTrackers, setSelectedTrackers] = useState<string[]>(["blood_sugar", "weight"]);

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else onComplete();
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const toggleCondition = (c: string) => {
    if (c === "None") {
      setSelectedConditions(["None"]);
      return;
    }
    setSelectedConditions((prev) =>
      prev.filter((x) => x !== "None").includes(c)
        ? prev.filter((x) => x !== c)
        : [...prev.filter((x) => x !== "None"), c]
    );
  };

  const addCustomCondition = () => {
    if (customCondition.trim() && !selectedConditions.includes(customCondition.trim())) {
      setSelectedConditions((prev) => [...prev.filter((x) => x !== "None"), customCondition.trim()]);
      setCustomCondition("");
    }
  };

  const toggleTracker = (id: string) =>
    setSelectedTrackers((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const filteredConditions = conditionSearch
    ? allConditions.filter((c) => c.toLowerCase().includes(conditionSearch.toLowerCase()))
    : allConditions;

  const progressPercent = ((step) / (TOTAL_STEPS - 1)) * 100;

  // ─── SPLASH SCREEN ───
  if (showSplash) {
    return (
      <motion.div
        className="fixed inset-0 z-50 bg-background"
        initial={{ opacity: 1 }}
        animate={{
          opacity: splashFading ? 0 : 1,
          filter: splashFading ? "blur(12px)" : "blur(0px)",
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <img
          src={splashScreen}
          alt="Healthpedia"
          className="w-full h-full object-cover"
        />
      </motion.div>
    );
  }

  return (
    <div className="mobile-container flex flex-col min-h-screen bg-background">
      {/* ─── STEP 0: WELCOME SLIDER ─── */}
       {step === 0 && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Illustration area - takes up most of the screen */}
          <div className="flex-1 relative flex items-center justify-center px-6 pt-6">
            {/* Floating pill badges - only for slides 0 and 2 */}
            {slideBadges[slideIndex]?.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`badges-${slideIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-10 pointer-events-none"
                >
                  {slideBadges[slideIndex].map((badge, i) => {
                    const Icon = badge.icon;
                    return (
                      <motion.div
                        key={badge.label}
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                        className={`absolute ${badge.position} flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border/50 shadow-lg`}
                        style={{ boxShadow: "0 4px 20px -4px hsl(340 100% 80% / 0.15)" }}
                      >
                        <Icon className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-foreground">{badge.label}</span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Main illustration - same max-w for all slides */}
            <div className="relative w-full max-w-[300px]">
              <AnimatePresence mode="wait">
                {slideIndex === 1 ? (
                  <motion.div
                    key="slide-2-custom"
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="relative w-full"
                  >
                    {/* Flower background image */}
                    <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                      <img
                        src={onboardingSlide2Bg}
                        alt="Flower background"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Symptom card overlay - upper left */}
                    <motion.img
                      src={onboardingCardSymptoms}
                      alt="Symptom log card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="absolute top-[-8%] left-[0%] w-[65%] drop-shadow-xl"
                    />
                    {/* Doctor card overlay - lower right */}
                    <motion.img
                      src={onboardingCardDoctor}
                      alt="Doctor availability card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="absolute bottom-[-8%] right-[0%] w-[68%] drop-shadow-xl"
                    />
                  </motion.div>
                ) : slideIndex === 2 ? (
                  <motion.div
                    key="slide-3-custom"
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="relative w-full"
                  >
                    {/* Inner container: clips only the iPhone from the bottom */}
                    <div className="relative w-full overflow-hidden" style={{ maxHeight: '380px' }}>
                      <img
                        src={onboardingIphoneBody}
                        alt="iPhone"
                        className="w-full scale-110 origin-top"
                      />
                      {/* Bottom gradient fade to background */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none"
                        style={{
                          background: 'linear-gradient(to bottom, hsl(40 33% 96% / 0), hsl(40 33% 96% / 1))',
                        }}
                      />
                    </div>
                    {/* Floating notification - outside clip container */}
                    <motion.img
                      src={onboardingNotificationFloat}
                      alt="Medication reminder notification"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="absolute bottom-[25%] left-[-5%] w-[100%] drop-shadow-xl z-10"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={slideIndex}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-xl relative"
                  >
                    <img
                      src={onboardingSlides[slideIndex].image}
                      alt={onboardingSlides[slideIndex].title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom section: title, dots, CTAs */}
          <div className="px-6 pb-8 pt-4">
            {/* Title text */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={slideIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="text-3xl font-serif font-normal text-foreground text-center leading-snug max-w-[300px] mx-auto"
              >
                {onboardingSlides[slideIndex].title}
              </motion.h1>
            </AnimatePresence>

            {/* Dot indicators */}
            <div className="flex gap-2 mt-5 justify-center">
              {onboardingSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === slideIndex ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-6 space-y-3">
              <button
                onClick={signInWithGoogle}
                className="w-full py-4 rounded-full bg-foreground text-background font-semibold text-base flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </button>
              <button
                onClick={next}
                className="w-full py-4 rounded-full border border-border/50 text-foreground font-semibold text-base backdrop-blur-md bg-card/70"
              >
                Explore as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress (steps 1-6) */}
      {step > 0 && step < TOTAL_STEPS - 1 && (
        <div className="px-6 pt-6 pb-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-medium text-muted-foreground">Step {step} of {TOTAL_STEPS - 2}</p>
            <p className="text-[10px] font-medium text-primary">{Math.round(progressPercent)}%</p>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-primary rounded-full"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {step > 0 && (
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

          {/* ─── STEP 1: BASIC PROFILE ─── */}
          {step === 1 && (
            <div className="flex-1 flex flex-col">
              <h2 className="text-2xl font-bold font-serif mb-2 text-center">Basic Profile</h2>
              <p className="text-muted-foreground text-center text-sm mb-6">Tell us about yourself</p>
              <div className="space-y-4 flex-1">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Name</label>
                  <input
                    placeholder="Sarah Johnson"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full glass-card px-4 py-3 text-sm rounded-xl bg-card outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Date of Birth</label>
                  <input
                    type="date"
                    value={profile.dob}
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                    className="w-full glass-card px-4 py-3 text-sm rounded-xl bg-card outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Gender</label>
                  <div className="flex gap-2">
                    {["Male", "Female", "Other"].map((g) => (
                      <button
                        key={g}
                        onClick={() => setProfile({ ...profile, gender: g })}
                        className={`flex-1 py-3 rounded-xl text-xs font-medium transition-all ${
                          profile.gender === g ? "gradient-primary text-primary-foreground" : "glass-card"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Height (cm)</label>
                    <input
                      type="number"
                      placeholder="165"
                      value={profile.height}
                      onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                      className="w-full glass-card px-4 py-3 text-sm rounded-xl bg-card outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Weight (kg)</label>
                    <input
                      type="number"
                      placeholder="62"
                      value={profile.weight}
                      onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                      className="w-full glass-card px-4 py-3 text-sm rounded-xl bg-card outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 2: HEALTH CONDITIONS ─── */}
          {step === 2 && (
            <div className="flex-1 flex flex-col">
              <h2 className="text-2xl font-bold font-serif mb-2 text-center">Health Conditions</h2>
              <p className="text-muted-foreground text-center text-sm mb-4">Select any known conditions</p>

              <div className="glass-card flex items-center gap-2 px-3 py-2 mb-4">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  placeholder="Search conditions..."
                  value={conditionSearch}
                  onChange={(e) => setConditionSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {filteredConditions.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleCondition(c)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                      selectedConditions.includes(c)
                        ? "gradient-primary text-primary-foreground"
                        : "glass-card text-foreground"
                    }`}
                  >
                    {selectedConditions.includes(c) && <Check className="w-3 h-3" />}
                    {c}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  placeholder="Add custom condition"
                  value={customCondition}
                  onChange={(e) => setCustomCondition(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomCondition()}
                  className="flex-1 glass-card px-4 py-2.5 text-sm rounded-xl bg-card outline-none"
                />
                <button onClick={addCustomCondition} className="px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-medium">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {selectedConditions.length > 0 && !selectedConditions.includes("None") && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Selected ({selectedConditions.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedConditions.map((c) => (
                      <span key={c} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                        {c}
                        <button onClick={() => toggleCondition(c)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── STEP 3: MEDICATIONS ─── */}
          {step === 3 && (
            <div className="flex-1 flex flex-col">
              <h2 className="text-2xl font-bold font-serif mb-2 text-center">Current Medications</h2>
              <p className="text-muted-foreground text-center text-sm mb-6">Optional — you can add these later</p>

              {!skipMeds ? (
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
                      {selectedConditions.length > 0 && !selectedConditions.includes("None") && (
                        <select
                          value={m.conditionLink}
                          onChange={(e) => {
                            const updated = [...medications];
                            updated[i].conditionLink = e.target.value;
                            setMedications(updated);
                          }}
                          className="w-full bg-muted/50 px-3 py-2.5 text-sm rounded-xl outline-none"
                        >
                          <option value="">Link to condition (optional)</option>
                          {selectedConditions.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setMedications([...medications, { name: "", dosage: "", frequency: "Daily", conditionLink: "" }])}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Medication
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <p className="text-muted-foreground text-sm">No medications added.</p>
                  <p className="text-xs text-muted-foreground mt-1">You can add them later from the Track tab.</p>
                  <button onClick={() => setSkipMeds(false)} className="mt-4 text-sm text-primary font-medium">Add medications</button>
                </div>
              )}
            </div>
          )}

          {/* ─── STEP 4: HEALTH TRACKERS ─── */}
          {step === 4 && (
            <div className="flex-1 flex flex-col">
              <h2 className="text-2xl font-bold font-serif mb-2 text-center">Health Trackers</h2>
              <p className="text-muted-foreground text-center text-sm mb-6">Choose what you want to track</p>
              <div className="grid grid-cols-2 gap-3 flex-1">
                {trackerOptions.map((t) => {
                  const selected = selectedTrackers.includes(t.id);
                  return (
                    <motion.button
                      key={t.id}
                      onClick={() => toggleTracker(t.id)}
                      whileTap={{ scale: 0.97 }}
                      className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                        selected ? "glass-card-elevated border-2 border-primary/30" : "glass-card"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selected ? "gradient-primary" : "bg-muted/60"
                      }`}>
                        <t.icon className={`w-5 h-5 ${selected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      </div>
                      <span className={`text-xs font-medium ${selected ? "text-foreground" : "text-muted-foreground"}`}>
                        {t.label}
                      </span>
                      {selected && <Check className="w-4 h-4 text-primary" />}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── STEP 5: INTEGRATIONS ─── */}
          {step === 5 && (
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-2xl font-bold font-serif mb-3 text-center">Health Integrations</h2>
              <p className="text-muted-foreground text-center text-sm mb-8">
                Connect external health sources to get automatic data imports.
              </p>
              <div className="space-y-4">
                {[
                  { name: "Google Fit", desc: "Steps, heart rate, workouts", color: "bg-health-good" },
                  { name: "Apple Health", desc: "Sleep, vitals, activity", color: "bg-health-alert" },
                ].map((d, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-5 w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl ${d.color} flex items-center justify-center`}>
                        <Smartphone className="w-5 h-5 text-primary-foreground" />
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

          {/* ─── STEP 6: NOTIFICATIONS ─── */}
          {step === 6 && (
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8">
                <Bell className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold font-serif mb-3">Stay On Track</h2>
              <p className="text-muted-foreground text-sm max-w-xs mb-8 leading-relaxed">
                Notifications help remind you about medications, health logs, and appointments. We'll only send what matters.
              </p>
              <button
                onClick={() => {
                  if ("Notification" in window) {
                    Notification.requestPermission();
                  }
                  next();
                }}
                className="btn-primary-gradient w-full text-sm"
              >
                Enable Notifications
              </button>
              <button onClick={next} className="mt-4 text-sm text-muted-foreground underline">
                Not now
              </button>
            </div>
          )}

          {/* ─── STEP 7: DONE ─── */}
          {step === 7 && (
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mb-8 shadow-lg">
                <Check className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold font-serif mb-3">Your Health Profile is Ready</h2>
              <p className="text-muted-foreground text-sm max-w-xs mb-8 leading-relaxed">
                You can now chat with the AI assistant, upload reports, and track your health daily.
              </p>
              <div className="glass-card p-4 w-full mb-6 space-y-3">
                {[
                  { icon: "💬", label: "Chat with your health assistant" },
                  { icon: "📋", label: "Upload and organize reports" },
                  { icon: "📊", label: "Track symptoms and measurements" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 text-left">
                    <span className="text-lg">{item.icon}</span>
                    <p className="text-sm text-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      )}

      {/* Bottom CTA */}
      {step > 0 && step < 7 && step !== 5 && step !== 6 && (
        <div className="px-6 pb-8 space-y-2">
          {step === 3 && !skipMeds && (
            <button onClick={() => { setSkipMeds(true); next(); }} className="w-full text-sm text-muted-foreground text-center mb-2 underline">
              Skip for now
            </button>
          )}
          <button onClick={next} className="btn-primary-gradient w-full text-base">
            Continue
          </button>
          {step > 1 && (
            <button onClick={back} className="w-full text-sm text-muted-foreground text-center">
              Back
            </button>
          )}
        </div>
      )}

      {step === 7 && (
        <div className="px-6 pb-8">
          <button onClick={onComplete} className="btn-primary-gradient w-full text-base">
            Start Using Healthpedia
          </button>
        </div>
      )}
    </div>
  );
}
