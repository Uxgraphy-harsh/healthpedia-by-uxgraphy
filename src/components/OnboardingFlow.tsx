import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Plus, Smartphone, ChevronRight, Bell,
  Heart, Droplets, Moon, Zap, Smile, GlassWater, Weight,
  Search, Check, X, Calendar,
  Camera, MapPin, Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import splashScreen from "@/assets/splash-screen.svg";
import onboardingSlide1 from "@/assets/onboarding-slide-1.png";
import onboardingSlide2Bg from "@/assets/onboarding-slide-2-bg.png";
import onboardingCardSymptoms from "@/assets/onboarding-card-symptoms.svg";
import onboardingCardDoctor from "@/assets/onboarding-card-doctor.svg";
import onboardingIphoneOnly from "@/assets/onboarding-iphone-only.png";
import onboardingNotificationFloat from "@/assets/onboarding-notification-float.svg";
import onboardingFlowerWatermark from "@/assets/onboarding-flower-watermark.png";
import onboardingFlowerDark from "@/assets/onboarding-flower-dark.png";
import googleFitIcon from "@/assets/google-fit-icon.png";
import appleHealthIcon from "@/assets/apple-health-icon.png";
import LoadingScreen from "@/components/LoadingScreen";

const slideBadges = [
  [
    { label: "Reminders", icon: Calendar, position: "top-[8%] right-[5%]" },
    { label: "Reports", icon: Heart, position: "top-[35%] left-[2%]" },
    { label: "Notifications", icon: Bell, position: "bottom-[15%] right-[3%]" },
  ],
  [],
  [],
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

const TOTAL_ONBOARDING_STEPS = 4; // basic=1, conditions=2, trackers=3, permissions=4

const allConditions = [
  "Diabetes", "Hypertension", "Thyroid Disorder", "Asthma",
  "Heart Disease", "Migraine", "PCOS", "Arthritis",
  "Anxiety", "Depression", "Anemia",
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

const permissionItems = [
  {
    id: "camera",
    icon: Camera,
    title: "Check contacts access",
    desc: "Add family & caregivers to your health circle for shared tracking and alerts.",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Check notification access",
    desc: "Get timely medication reminders, health alerts & appointment updates.",
  },
  {
    id: "location",
    icon: MapPin,
    title: "Check location access",
    desc: "Find nearby pharmacies, hospitals & health services when needed.",
  },
];

export default function OnboardingFlow({ onComplete }: OnboardingProps) {
  const { signInWithGoogle, user } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [step, setStep] = useState(0); // 0 = welcome slider, 1-4 = onboarding steps
  const [slideIndex, setSlideIndex] = useState(0);

  // Splash screen
  useEffect(() => {
    const timer1 = setTimeout(() => setSplashFading(true), 1500);
    const timer2 = setTimeout(() => setShowSplash(false), 2300);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  // Preload images
  useEffect(() => {
    [onboardingSlide1, onboardingSlide2Bg, onboardingCardSymptoms, onboardingCardDoctor, onboardingIphoneOnly, onboardingNotificationFloat, onboardingFlowerWatermark].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    if (step !== 0) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % onboardingSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [step]);

  // Swipe gesture
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) setSlideIndex((prev) => Math.min(prev + 1, onboardingSlides.length - 1));
    else if (diff < -50) setSlideIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Profile state
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.full_name || "",
    dob: "",
    gender: "",
    height: "",
    weight: "",
  });

  // Conditions
  const [conditionSearch, setConditionSearch] = useState("");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [customCondition, setCustomCondition] = useState("");

  // Trackers
  const [selectedTrackers, setSelectedTrackers] = useState<string[]>([]);

  // Permissions
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    camera: false,
    notifications: false,
    location: false,
  });

  const next = () => {
    if (step < TOTAL_ONBOARDING_STEPS) setStep(step + 1);
    else onComplete();
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const toggleCondition = (c: string) => {
    if (c === "None") { setSelectedConditions(["None"]); return; }
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

  const togglePermission = (id: string) =>
    setPermissions((prev) => ({ ...prev, [id]: !prev[id] }));

  const filteredConditions = conditionSearch
    ? allConditions.filter((c) => c.toLowerCase().includes(conditionSearch.toLowerCase()))
    : allConditions;

  const progressPercent = (step / TOTAL_ONBOARDING_STEPS) * 100;

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
        <img src={splashScreen} alt="Healthpedia" className="w-full h-full object-cover" />
      </motion.div>
    );
  }

  return (
    <div className="mobile-container flex flex-col min-h-screen overflow-hidden" style={{ background: step === 0 ? 'hsl(var(--background))' : '#49001E' }}>
      {/* ─── STEP 0: WELCOME SLIDER ─── */}
      {step === 0 && (
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <img
            src={onboardingFlowerWatermark}
            alt=""
            className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[160%] max-w-none pointer-events-none z-0"
          />
          <div className="flex-1 relative flex items-center justify-center px-6 pt-6 z-[1]" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
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

            <div className="relative w-full" style={{ maxWidth: slideIndex === 2 ? 'none' : '300px' }}>
              {/* Slide 0 */}
              <motion.div
                animate={{ opacity: slideIndex === 0 ? 1 : 0, x: slideIndex === 0 ? 0 : -60 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-xl relative"
                style={{ pointerEvents: slideIndex === 0 ? "auto" : "none", position: slideIndex === 0 ? "relative" : "absolute", top: 0, left: 0, right: 0 }}
              >
                <img src={onboardingSlide1} alt={onboardingSlides[0].title} className="absolute inset-0 w-full h-full object-cover" />
              </motion.div>

              {/* Slide 1 */}
              <motion.div
                animate={{ opacity: slideIndex === 1 ? 1 : 0, x: slideIndex === 1 ? 0 : slideIndex > 1 ? -60 : 60 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative w-full"
                style={{ pointerEvents: slideIndex === 1 ? "auto" : "none", position: slideIndex === 1 ? "relative" : "absolute", top: 0, left: 0, right: 0 }}
              >
                <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                  <img src={onboardingSlide2Bg} alt="Flower background" className="w-full h-full object-cover" />
                </div>
                <motion.img
                  src={onboardingCardSymptoms} alt="Symptom log card"
                  animate={{ opacity: slideIndex === 1 ? 1 : 0, y: slideIndex === 1 ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: slideIndex === 1 ? 0.3 : 0 }}
                  className="absolute top-[-8%] left-[0%] w-[65%] drop-shadow-xl"
                />
                <motion.img
                  src={onboardingCardDoctor} alt="Doctor availability card"
                  animate={{ opacity: slideIndex === 1 ? 1 : 0, y: slideIndex === 1 ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: slideIndex === 1 ? 0.5 : 0 }}
                  className="absolute bottom-[-8%] right-[0%] w-[68%] drop-shadow-xl"
                />
              </motion.div>

              {/* Slide 2 */}
              <motion.div
                animate={{ opacity: slideIndex === 2 ? 1 : 0, x: slideIndex === 2 ? 0 : 60 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative w-full"
                style={{ pointerEvents: slideIndex === 2 ? "auto" : "none", position: slideIndex === 2 ? "relative" : "absolute", top: 0, left: 0, right: 0 }}
              >
                <div className="relative w-full overflow-hidden" style={{ maxHeight: '380px' }}>
                  <img src={onboardingIphoneOnly} alt="iPhone" className="w-[68%] mx-auto scale-[1.35] origin-top drop-shadow-2xl" />
                  <div className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none" style={{ background: 'linear-gradient(to bottom, hsl(40 33% 96% / 0), hsl(40 33% 96% / 1))' }} />
                </div>
                <div className="absolute bottom-[22%] inset-x-0 flex justify-center z-10 pointer-events-none">
                  <motion.img
                    src={onboardingNotificationFloat} alt="Medication reminder notification"
                    animate={{ opacity: slideIndex === 2 ? 1 : 0, y: slideIndex === 2 ? 0 : 20 }}
                    transition={{ duration: 0.5, delay: slideIndex === 2 ? 0.4 : 0 }}
                    className="w-[88%] max-w-[340px] drop-shadow-xl"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="px-6 pb-8 pt-4">
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
                className="w-full py-4 rounded-full border border-white/20 text-foreground font-semibold text-base backdrop-blur-lg bg-white/20 shadow-lg flex items-center justify-center"
              >
                Explore as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ONBOARDING STEPS 1-4 (Dark Maroon Theme) ─── */}
      {step > 0 && (
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Flower watermark - spans full screen including behind CTA */}
          <img
            src={onboardingFlowerDark}
            alt=""
            className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 w-[200%] max-w-none pointer-events-none z-0"
          />
          {/* Progress bar */}
          <div className="px-4 pt-12 pb-2 relative z-[1]">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: '#F66B9A' }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
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
              className="flex-1 flex flex-col px-6 py-4 overflow-y-auto overflow-x-hidden relative z-[1]"
            >
              {/* ─── STEP 1: BASIC DETAILS ─── */}
              {step === 1 && (
                <div className="flex-1 flex flex-col relative">
                  <h2 className="text-4xl font-serif text-white leading-tight mb-8">Please enter<br />basic details</h2>
                  <div className="space-y-4 flex-1 relative z-10">
                    <input
                      placeholder="Name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-5 py-4 text-sm rounded-lg bg-white/10 text-white placeholder:text-white/40 outline-none border border-white/15 focus:border-[#F66B9A]/50 transition-colors"
                    />
                    <div className="relative">
                      <input
                        type="date"
                        value={profile.dob}
                        onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                        placeholder="Date of Birth"
                        className="w-full px-5 py-4 text-sm rounded-lg bg-white/10 text-white outline-none border border-white/15 focus:border-[#F66B9A]/50 transition-colors [&:not(:valid)]:text-white/40 [color-scheme:dark]"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={profile.gender}
                        onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                        className="w-full px-5 py-4 text-sm rounded-lg bg-white/10 text-white outline-none border border-white/15 focus:border-[#F66B9A]/50 transition-colors appearance-none"
                      >
                        <option value="" disabled className="text-gray-900">Gender</option>
                        <option value="Male" className="text-gray-900">Male</option>
                        <option value="Female" className="text-gray-900">Female</option>
                        <option value="Other" className="text-gray-900">Other</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 rotate-90" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Height (cm)"
                        value={profile.height}
                        onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                        className="w-full px-5 py-4 text-sm rounded-lg bg-white/10 text-white placeholder:text-white/40 outline-none border border-white/15 focus:border-[#F66B9A]/50 transition-colors"
                      />
                      <input
                        type="number"
                        placeholder="Weight (kg)"
                        value={profile.weight}
                        onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                        className="w-full px-5 py-4 text-sm rounded-lg bg-white/10 text-white placeholder:text-white/40 outline-none border border-white/15 focus:border-[#F66B9A]/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ─── STEP 2: HEALTH CONDITIONS ─── */}
              {step === 2 && (
                <div className="flex-1 flex flex-col">
                  <h2 className="text-4xl font-serif text-white leading-tight mb-8">Select health<br />conditions</h2>

                  <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-2xl bg-white/10 border border-white/10">
                    <Search className="w-4 h-4 text-white/40" />
                    <input
                      placeholder="Search conditions..."
                      value={conditionSearch}
                      onChange={(e) => setConditionSearch(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {filteredConditions.map((c) => (
                      <button
                        key={c}
                        onClick={() => toggleCondition(c)}
                        className={`px-4 py-2.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
                          selectedConditions.includes(c)
                            ? "bg-[#F66B9A] text-[#49001E] border-[#F66B9A]"
                            : "bg-white/10 text-white/70 border-white/10"
                        }`}
                      >
                        {selectedConditions.includes(c) && <Check className="w-3 h-3" />}
                        {c}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        const custom = prompt("Enter custom condition:");
                        if (custom?.trim()) {
                          setSelectedConditions((prev) => [...prev, custom.trim()]);
                        }
                      }}
                      className="px-4 py-2.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border border-dashed border-white/30 bg-white/5 text-white/70"
                    >
                      <Plus className="w-3 h-3" />
                      Custom
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 3: HEALTH TRACKERS ─── */}
              {step === 3 && (
                <div className="flex-1 flex flex-col">
                  <h2 className="text-4xl font-serif text-white leading-tight mb-8">Connect health<br />trackers</h2>
                  <div className="space-y-4">
                    {[
                      { id: "google_fit", name: "Google Fit", icon: googleFitIcon },
                      { id: "apple_health", name: "Apple health", icon: appleHealthIcon },
                    ].map((tracker) => {
                      const connected = selectedTrackers.includes(tracker.id);
                      return (
                        <motion.button
                          key={tracker.id}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleTracker(tracker.id)}
                          className="w-full p-5 rounded-2xl flex items-center gap-4 text-left transition-all border bg-white/10 border-white/10"
                        >
                          <img src={tracker.icon} alt={tracker.name} className="w-10 h-10 rounded-xl shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-base text-white">{tracker.name}</p>
                            <p className="text-xs mt-0.5">
                              {connected ? (
                                <>
                                  <span className="text-green-400">Connected</span>
                                  <span className="text-white/40">  •  Syncing...</span>
                                </>
                              ) : (
                                <span className="text-white/40">Not connected</span>
                              )}
                            </p>
                          </div>
                          
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ─── STEP 4: PERMISSIONS ─── */}
              {step === 4 && (
                <div className="flex-1 flex flex-col">
                  <h2 className="text-4xl font-serif text-white leading-tight mb-8">Last Step!</h2>

                  <div className="space-y-4 flex-1">
                    {permissionItems.map((item, idx) => {
                      const Icon = item.icon;
                      const enabled = permissions[item.id];
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => togglePermission(item.id)}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="w-full px-5 py-6 rounded-2xl bg-white/20 border border-white/10 flex items-start gap-4 text-left"
                        >
                          <Icon className="w-6 h-6 text-white shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[15px] text-white leading-snug">{item.title}</p>
                            <p className="text-white/50 text-xs mt-1.5 leading-relaxed">{item.desc}</p>
                          </div>
                          <div className={`w-[44px] h-[26px] rounded-full flex items-center px-[2px] transition-colors shrink-0 mt-0.5 ${
                            enabled ? "bg-[#60A5FA]" : "bg-white/20"
                          }`}>
                            <motion.div
                              className="w-[22px] h-[22px] rounded-full bg-white shadow-sm"
                              animate={{ x: enabled ? 18 : 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom CTA for steps 1-4 */}
          <div className="px-6 pb-8 relative z-[1]">
            <div className="flex items-center gap-3">
              <button
                onClick={back}
                className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center shrink-0"
              >
                <ChevronRight className="w-5 h-5 text-white rotate-180" />
              </button>
              <button
                onClick={step === TOTAL_ONBOARDING_STEPS ? onComplete : next}
                disabled={step === 1 && (!profile.name.trim() || !profile.dob)}
                className="flex-1 py-4 rounded-full font-semibold text-base transition-all disabled:opacity-40"
                style={{ background: '#F66B9A', color: '#49001E' }}
              >
                {step === TOTAL_ONBOARDING_STEPS ? "Get Started" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
