import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import WheelPicker from "@/components/onboarding/WheelPicker";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const TOTAL_STEPS = 6;

const GRADIENT = "linear-gradient(90deg, #F43F5E 0%, #F97316 100%)";
const CTA_BG = "#EF4E3B";
const SELECTED = "#EF4E3B";
const PILL_BG = "#FBEEE1";

export default function CycleOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // step 0 — DOB
  const [dobMonth, setDobMonth] = useState<string>("Jul");
  const [dobYear, setDobYear] = useState<number>(1997);

  // step 1 — last period
  const [lpDay, setLpDay] = useState<number>(1);
  const [lpMonth, setLpMonth] = useState<string>("Jul");
  const [lpYear, setLpYear] = useState<number>(2026);

  // step 2 — period duration
  const [periodDays, setPeriodDays] = useState<number>(5);
  // step 3 — cycle length
  const [cycleDays, setCycleDays] = useState<number>(28);
  // step 4 — contraceptives
  const [contraceptives, setContraceptives] = useState<"yes" | "no" | null>("no");
  // step 5 — pregnancy
  const [pregnancy, setPregnancy] = useState<"yes" | "no" | "pregnant" | null>("no");

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = 1940; y <= 2026; y++) arr.push(y);
    return arr;
  }, []);
  const daysInMonth = useMemo(() => {
    const arr: number[] = [];
    for (let d = 1; d <= 31; d++) arr.push(d);
    return arr;
  }, []);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const canNext = () => {
    if (step === 4) return contraceptives !== null;
    if (step === 5) return pregnancy !== null;
    return true;
  };

  const handleBack = () => {
    if (step === 0) navigate("/apps/cycle");
    else setStep((s) => s - 1);
  };

  const handleNext = () => {
    if (step === TOTAL_STEPS - 1) {
      localStorage.setItem(
        "cycle_onboarding",
        JSON.stringify({
          dob: `${dobMonth} ${dobYear}`,
          lastPeriod: `${lpDay} ${lpMonth} ${lpYear}`,
          periodDays,
          cycleDays,
          contraceptives,
          pregnancy,
          completedAt: new Date().toISOString(),
        })
      );
      navigate("/apps/cycle", { replace: true });
      return;
    }
    setStep((s) => s + 1);
  };

  const ctaLabel = step >= 4 ? "Confirm" : "Next";

  return (
    <div className="fixed inset-0 z-50 mx-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-white">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-5 pt-14 pb-6">
        <button onClick={handleBack} aria-label="Back" className="shrink-0">
          <ArrowLeft className="h-6 w-6 text-neutral-800" strokeWidth={2.2} />
        </button>
        <div className="relative h-1.5 flex-1 rounded-full bg-neutral-200 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300"
            style={{ width: `${progress}%`, background: GRADIENT }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6">
        {step === 0 && (
          <StepScaffold
            title="When were you born?"
            subtitle="Knowing your age helps us provide personalised insights."
          >
            <div className="mt-10 flex justify-center gap-6">
              <WheelPicker items={MONTHS} value={dobMonth} onChange={(v) => setDobMonth(v as string)} width="120px" />
              <WheelPicker items={years} value={dobYear} onChange={(v) => setDobYear(v as number)} width="120px" />
            </div>
          </StepScaffold>
        )}

        {step === 1 && (
          <StepScaffold
            title="When was the first day of your last period?"
            subtitle="Not sure? Give us your best guess."
          >
            <div className="mt-10 flex justify-center gap-4">
              <WheelPicker items={daysInMonth} value={lpDay} onChange={(v) => setLpDay(v as number)} width="70px" />
              <WheelPicker items={MONTHS} value={lpMonth} onChange={(v) => setLpMonth(v as string)} width="90px" />
              <WheelPicker items={years} value={lpYear} onChange={(v) => setLpYear(v as number)} width="90px" />
            </div>
          </StepScaffold>
        )}

        {step === 2 && (
          <StepScaffold
            title="How many days does your period typically last?"
            subtitle="Include every day with period flow, including spotting."
          >
            <NumberStrip
              values={[3, 4, 5, 6, 7]}
              value={periodDays}
              onChange={setPeriodDays}
              unit="DAYS"
            />
          </StepScaffold>
        )}

        {step === 3 && (
          <StepScaffold
            title="How many days is your average menstrual cycle?"
            subtitle="Your menstrual cycle starts on the first day of your period and ends the day before your next period. An average menstrual cycle is 28 days."
          >
            <NumberStrip
              values={[26, 27, 28, 29, 30]}
              value={cycleDays}
              onChange={setCycleDays}
              unit="DAYS"
            />
          </StepScaffold>
        )}

        {step === 4 && (
          <StepScaffold
            title="Do you use long-term contraceptives?"
            subtitle="Long-term contraceptives like birth control pills, IUDs, hormonal implants, and injections impact your menstrual cycle."
          >
            <div className="mt-6 space-y-3">
              <OptionCard
                label="Yes, I'm on long-term contraceptives"
                selected={contraceptives === "yes"}
                onClick={() => setContraceptives("yes")}
              />
              <OptionCard
                label="No, I'm not on long-term contraceptives"
                selected={contraceptives === "no"}
                onClick={() => setContraceptives("no")}
              />
            </div>
          </StepScaffold>
        )}

        {step === 5 && (
          <StepScaffold
            title="Are you trying to get pregnant?"
            subtitle="Please note, this period tracker is meant for you to record menstrual cycles. It is not intended to help with fertility."
          >
            <div className="mt-6 space-y-3">
              <OptionCard label="Yes" selected={pregnancy === "yes"} onClick={() => setPregnancy("yes")} />
              <OptionCard label="No" selected={pregnancy === "no"} onClick={() => setPregnancy("no")} />
              <OptionCard
                label="I am pregnant"
                selected={pregnancy === "pregnant"}
                onClick={() => setPregnancy("pregnant")}
              />
            </div>
          </StepScaffold>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 pt-2">
        {step === 0 && (
          <p className="mb-4 px-2 text-center text-[13px] leading-snug text-neutral-500">
            Review our <span style={{ color: SELECTED }} className="font-semibold">Terms and Conditions</span> to learn
            about the minimum age requirement. You can change your answer on your profile any time.
          </p>
        )}
        {step > 1 && (
          <p className="mb-4 px-2 text-center text-[13px] leading-snug text-neutral-500">
            You can change your answer on your profile any time.
          </p>
        )}
        <button
          onClick={handleNext}
          disabled={!canNext()}
          className="w-full rounded-2xl py-4 text-[15px] font-semibold text-white transition-opacity disabled:opacity-40"
          style={{ background: CTA_BG }}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

function StepScaffold({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-[28px] font-bold leading-[1.15] text-neutral-900">{title}</h1>
      <p className="mt-3 text-[16px] leading-snug text-neutral-800">{subtitle}</p>
      {children}
    </div>
  );
}

function NumberStrip({
  values,
  value,
  onChange,
  unit,
}: {
  values: number[];
  value: number;
  onChange: (v: number) => void;
  unit?: string;
}) {
  return (
    <div className="mt-14 flex items-center justify-center gap-4">
      {values.map((v, i) => {
        const dist = Math.abs(values.indexOf(value) - i);
        const isSel = v === value;
        const size = isSel ? 46 : dist === 1 ? 40 : 34;
        const opacity = isSel ? 1 : dist === 1 ? 0.6 : 0.25;
        return (
          <button
            key={v}
            onClick={() => onChange(v)}
            className="relative flex flex-col items-center justify-center"
            style={{ width: 68, height: 120 }}
          >
            {isSel && (
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: PILL_BG }}
              />
            )}
            <span
              className="relative font-bold"
              style={{ fontSize: size, color: isSel ? SELECTED : "#111", opacity }}
            >
              {v}
            </span>
            {isSel && unit && (
              <span className="relative mt-2 text-[12px] font-bold tracking-widest text-neutral-800">
                {unit}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function OptionCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border px-5 py-5 text-left text-[15px] font-medium transition-all"
      style={{
        borderColor: selected ? SELECTED : "#E5E5E5",
        background: selected ? PILL_BG : "#fff",
        color: selected ? SELECTED : "#111",
        fontWeight: selected ? 600 : 500,
      }}
    >
      {label}
    </button>
  );
}
