import { useEffect, useRef, useState } from "react";

interface WheelPickerProps {
  items: (string | number)[];
  value: string | number;
  onChange: (v: string | number) => void;
  width?: string;
}

const ITEM_H = 56;
const VISIBLE = 5;

export default function WheelPicker({ items, value, onChange, width = "auto" }: WheelPickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(items.indexOf(value));
  const scrollTimer = useRef<number | null>(null);

  // scroll to initial value
  useEffect(() => {
    const idx = items.indexOf(value);
    if (ref.current && idx >= 0) {
      ref.current.scrollTo({ top: idx * ITEM_H, behavior: "auto" });
      setSelected(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = () => {
    if (!ref.current) return;
    const idx = Math.round(ref.current.scrollTop / ITEM_H);
    if (idx !== selected && idx >= 0 && idx < items.length) {
      setSelected(idx);
    }
    if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(() => {
      if (!ref.current) return;
      const finalIdx = Math.round(ref.current.scrollTop / ITEM_H);
      ref.current.scrollTo({ top: finalIdx * ITEM_H, behavior: "smooth" });
      const clamped = Math.max(0, Math.min(items.length - 1, finalIdx));
      onChange(items[clamped]);
    }, 120);
  };

  const pad = ITEM_H * Math.floor(VISIBLE / 2);

  return (
    <div className="relative" style={{ width, height: ITEM_H * VISIBLE }}>
      {/* selection pill */}
      <div
        className="pointer-events-none absolute inset-x-0 rounded-full"
        style={{
          top: pad,
          height: ITEM_H,
          background: "#FBEEE1",
        }}
      />
      <div
        ref={ref}
        onScroll={handleScroll}
        className="relative h-full overflow-y-auto no-scrollbar snap-y snap-mandatory"
        style={{ scrollBehavior: "smooth" }}
      >
        <div style={{ height: pad }} />
        {items.map((item, i) => {
          const dist = Math.abs(i - selected);
          const isSel = dist === 0;
          const opacity = isSel ? 1 : dist === 1 ? 0.45 : dist === 2 ? 0.2 : 0.1;
          return (
            <div
              key={String(item) + i}
              className="snap-center flex items-center justify-center font-semibold"
              style={{
                height: ITEM_H,
                fontSize: isSel ? 26 : 22,
                color: isSel ? "#EF4E3B" : "#111",
                opacity,
                transition: "font-size 0.15s, color 0.15s, opacity 0.15s",
              }}
            >
              {item}
            </div>
          );
        })}
        <div style={{ height: pad }} />
      </div>
    </div>
  );
}
