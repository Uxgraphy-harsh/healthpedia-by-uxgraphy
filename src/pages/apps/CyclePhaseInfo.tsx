import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type Phase = "menstrual" | "follicular" | "ovular" | "luteal";

const BURGUNDY = "#5B0A0A";
const WINE = "#7A1F1F";
const RUST = "#A0522D";
const OCHRE = "#B8860B";

const PHASE_COLORS: Record<Phase, string> = {
  menstrual: BURGUNDY,
  follicular: WINE,
  ovular: RUST,
  luteal: OCHRE,
};
const PHASE_LABEL: Record<Phase, string> = {
  menstrual: "Menstrual Phase",
  follicular: "Follicular Phase",
  ovular: "Ovular Phase",
  luteal: "Luteal Phase",
};

const PHASE_COPY: Record<Phase, string[]> = {
  menstrual: [
    "The menstrual phase begins on the first day of your period. The lining of the uterus sheds through the vagina if pregnancy hasn't occurred.",
    "This phase typically lasts 3 to 7 days. Hormone levels are at their lowest, which may leave you feeling tired or low on energy.",
  ],
  follicular: [
    "The follicular phase starts on the first day of your period and ends with ovulation. The body prepares to release an egg as follicles in the ovaries mature.",
    "Oestrogen levels rise during this phase, often bringing higher energy, better mood, and improved focus.",
  ],
  ovular: [
    "The ovular phase is when a mature egg is released from the ovary. This is the most fertile window of your cycle.",
    "This phase lasts around 24 hours. Oestrogen peaks and you may notice increased energy, confidence, and libido.",
  ],
  luteal: [
    "The luteal phase occurs if the egg is not fertilised. The egg begins to dissolve and the lining of the uterus stops growing, as it is no longer required.",
    "This phase lasts approximately two weeks. Oestrogen levels fall, which may lead you to experience lower energy levels.",
  ],
};

function PhaseGlyph({ phase }: { phase: Phase }) {
  const cream = "#FBEEE1";
  if (phase === "luteal")
    return (
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
        <path d="M20 14A8 8 0 019 4a8 8 0 1011 10z" fill={cream} />
      </svg>
    );
  if (phase === "menstrual")
    return (
      <svg width="64" height="64" viewBox="0 0 24 24" fill={cream}>
        <path d="M12 2s7 8 7 13a7 7 0 11-14 0c0-5 7-13 7-13z" />
      </svg>
    );
  if (phase === "follicular")
    return (
      <svg width="68" height="68" viewBox="0 0 24 24" fill={cream}>
        <circle cx="12" cy="6" r="3" />
        <circle cx="12" cy="18" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="12" r="3" />
        <circle cx="12" cy="12" r="2" fill={WINE} />
      </svg>
    );
  return (
    <svg width="68" height="68" viewBox="0 0 24 24" fill={cream}>
      <path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />
    </svg>
  );
}

export default function CyclePhaseInfo() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const phase = (params.get("phase") as Phase) || "luteal";
  const color = PHASE_COLORS[phase];
  const label = PHASE_LABEL[phase];
  const copy = PHASE_COPY[phase];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-md px-5 pt-6 pb-10">
        {/* Header */}
        <div className="relative flex items-center justify-center py-2">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="absolute left-0 flex h-10 w-10 items-center justify-center text-neutral-800"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-neutral-900">{label}</h1>
        </div>

        {/* Phase circle */}
        <div className="mt-6 flex justify-center">
          <div
            className="flex h-40 w-40 items-center justify-center rounded-full"
            style={{ background: color }}
          >
            <PhaseGlyph phase={phase} />
          </div>
        </div>

        {/* Callout */}
        <div
          className="mt-8 rounded-2xl px-6 py-6 text-center"
          style={{ background: `${color}18` }}
        >
          <p className="text-xl font-bold" style={{ color }}>
            You are in your {phase} phase
          </p>
          <div className="mt-2 flex items-center justify-center gap-2 text-base text-neutral-800">
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ background: color }}
            >
              i
            </span>
            <span>What does this mean?</span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 space-y-5 px-1 text-[17px] leading-[1.55] text-neutral-900">
          {copy.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
