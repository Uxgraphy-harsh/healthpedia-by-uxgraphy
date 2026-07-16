import { useState } from "react";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";
import { ShoppingBag, Search, SlidersHorizontal, Heart, Tag } from "lucide-react";

const CORAL = "#EF4E3B";
const DEEP = "#5B0A0A";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  original?: number;
  variant?: string;
  emoji: string;
}

const PRODUCTS: Product[] = [
  { id: "cup-lm", name: "Menstrual Cup", category: "Cups", price: 1699, original: 1899, variant: "Light / Medium flow", emoji: "🩸" },
  { id: "cup-hf", name: "Menstrual Cup", category: "Cups", price: 1699, original: 1899, variant: "Heavy flow", emoji: "🩸" },
  { id: "cup-bundle", name: "Cup Duo Bundle", category: "Bundles", price: 2999, original: 3600, variant: "Light + Heavy", emoji: "🎁" },
  { id: "wash", name: "pH Balanced Wash", category: "Care", price: 349, variant: "100 ml", emoji: "🧴" },
  { id: "wipes", name: "Sanitising Wipes", category: "Care", price: 199, variant: "Pack of 10", emoji: "🧻" },
  { id: "pouch", name: "Travel Pouch", category: "Accessories", price: 249, variant: "Cotton, waterproof", emoji: "👜" },
];

const CATEGORIES = ["All", "Cups", "Bundles", "Care", "Accessories"];

export default function Shop() {
  const app = getMiniApp("shop")!;
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<Record<string, number>>({});

  const filtered = category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <MiniAppShell
      appId="shop"
      name={app.name}
      tagline={app.tagline}
      icon={app.icon}
      bg={app.bg}
      fg={app.fg}
      bottomActions={[
        { icon: ShoppingBag, label: "Shop", active: true },
        { icon: Tag, label: "Offers" },
        { icon: Heart, label: "Wishlist" },
        { icon: ShoppingBag, label: `Cart${cartCount ? ` (${cartCount})` : ""}`, primary: true, onClick: () => {} },
      ]}
    >
      {/* Promo banner */}
      <div
        className="mt-2 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium text-white"
        style={{ background: DEEP }}
      >
        ✨ Extra 10% off with code <span className="font-bold tracking-widest">PERIODPOWER</span> ✨
      </div>

      <h2 className="mt-5 text-2xl font-bold text-neutral-900">Shop all</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Sustainable period care, designed by engineers and scientists.
      </p>

      {/* Search + filter */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-neutral-200 px-3 py-2.5">
          <Search className="h-4 w-4 text-neutral-500" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            placeholder="Search products"
          />
        </div>
        <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200">
          <SlidersHorizontal className="h-4 w-4 text-neutral-700" />
        </button>
      </div>

      {/* Category chips */}
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: category === c ? DEEP : "transparent",
              color: category === c ? "#fff" : "#333",
              borderColor: category === c ? DEEP : "#E5E5E5",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs uppercase tracking-widest text-neutral-500">
        {filtered.length} products
      </p>

      {/* Product grid */}
      <div className="mt-3 grid grid-cols-2 gap-3 pb-4">
        {filtered.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div
              className="flex aspect-square items-center justify-center text-5xl"
              style={{ background: "#FBEEE1" }}
            >
              {p.emoji}
            </div>
            <div className="p-3">
              <p className="text-[13px] font-semibold text-neutral-900">{p.name}</p>
              {p.variant && (
                <p className="mt-0.5 text-[11px] text-neutral-500">{p.variant}</p>
              )}
              <div className="mt-2 flex items-baseline gap-1.5">
                {p.original && (
                  <span className="text-[11px] text-neutral-400 line-through">₹{p.original}</span>
                )}
                <span className="text-sm font-bold" style={{ color: DEEP }}>
                  ₹{p.price}
                </span>
              </div>
              <button
                onClick={() => setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }))}
                className="mt-2.5 w-full rounded-lg py-1.5 text-[12px] font-semibold text-white"
                style={{ background: CORAL }}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </MiniAppShell>
  );
}
