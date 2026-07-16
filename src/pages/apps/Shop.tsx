import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MiniAppShell from "@/components/MiniAppShell";
import { getMiniApp } from "@/data/miniApps";
import {
  ShoppingBag, ShoppingCart, Search, SlidersHorizontal, Tag, ClipboardList,
  ArrowLeft, Minus, Plus, ChevronDown, Truck, HelpCircle,
  CheckCircle2, Copy, ExternalLink, Circle,
} from "lucide-react";

const CORAL = "#EF4E3B";
const DEEP = "#5B0A0A";
const OK = "#16A34A";
const ERR = "#DC2626";

interface Product {
  id: string; name: string; category: string; price: number;
  original?: number; variant?: string; emoji: string;
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

interface Address {
  id: string; label: string; isDefault?: boolean;
  firstName: string; lastName: string; phone: string;
  address: string; city: string; state: string; pincode: string;
}

type OrderStatus = "verifying" | "shipped" | "delivered" | "rejected";
interface Order {
  id: string; createdAt: number; status: OrderStatus;
  items: { p: Product; qty: number }[]; total: number;
  address: Address; deliverFrom: string; deliverTo: string;
  rejectReason?: string; deliveredOn?: string;
}

type View =
  | "shop" | "cart" | "addresses" | "addAddress" | "summary"
  | "orders" | "orderDetail" | "help";

const seedAddress: Address = {
  id: "a-home", label: "Home", isDefault: true,
  firstName: "Rajesh", lastName: "Patel", phone: "+91 9876543210",
  address: "A-123, Sunrise Apartments, Near City Mall", city: "Mumbai", state: "Maharashtra", pincode: "400001",
};

const daysFromNow = (n: number) => {
  const d = new Date(Date.now() + n * 86400000);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const PRICE_MIN = 0;
const PRICE_MAX = 3000;

export default function Shop() {
  const app = getMiniApp("shop")!;
  const [view, setView] = useState<View>("shop");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [addresses, setAddresses] = useState<Address[]>([seedAddress]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(seedAddress.id);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [ordersTab, setOrdersTab] = useState<"current" | "history">("current");
  const [trackSheet, setTrackSheet] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Filters
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [fCats, setFCats] = useState<string[]>([]);
  const [fPrice, setFPrice] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [fSort, setFSort] = useState<"low" | "high" | null>(null);
  const activeFilterCount =
    fCats.length +
    (fPrice[0] !== PRICE_MIN || fPrice[1] !== PRICE_MAX ? 1 : 0) +
    (fSort ? 1 : 0);

  const visibleProducts = useMemo(() => {
    let list = category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);
    if (fCats.length) list = list.filter((p) => fCats.includes(p.category));
    list = list.filter((p) => p.price >= fPrice[0] && p.price <= fPrice[1]);
    if (fSort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (fSort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [category, fCats, fPrice, fSort]);

  const cartItems = useMemo(
    () => Object.entries(cart).map(([id, qty]) => ({ p: PRODUCTS.find((x) => x.id === id)!, qty })).filter((x) => x.p),
    [cart]
  );
  const cartCount = cartItems.reduce((a, b) => a + b.qty, 0);
  const cartTotal = cartItems.reduce((a, b) => a + b.p.price * b.qty, 0);
  const currentOrders = orders.filter((o) => o.status === "verifying" || o.status === "shipped");
  const historyOrders = orders.filter((o) => o.status === "delivered" || o.status === "rejected");
  const activeOrder = orders.find((o) => o.id === activeOrderId) ?? null;

  const inc = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const dec = (id: string) => setCart((c) => {
    const n = (c[id] ?? 0) - 1;
    const next = { ...c };
    if (n <= 0) delete next[id]; else next[id] = n;
    return next;
  });

  const placeOrder = () => {
    const addr = addresses.find((a) => a.id === selectedAddressId)!;
    const id = `ORD-2025-${String(orders.length + 1).padStart(3, "0")}`;
    const order: Order = {
      id, createdAt: Date.now(), status: "verifying",
      items: cartItems.map((x) => ({ ...x })), total: cartTotal,
      address: addr, deliverFrom: daysFromNow(3), deliverTo: daysFromNow(8),
    };
    setOrders((o) => [order, ...o]);
    setCart({});
    setActiveOrderId(id);
    setView("orderDetail");
  };

  // Bottom bar tabs
  const bottomActions = [
    { icon: ShoppingBag, label: "Shop", active: view === "shop", onClick: () => setView("shop") },
    { icon: ClipboardList, label: "Orders", active: view === "orders" || view === "orderDetail" || view === "help",
      onClick: () => setView("orders") },
    { icon: Tag, label: "Offers", onClick: () => {} },
    { icon: ShoppingBag, label: `Cart${cartCount ? ` (${cartCount})` : ""}`,
      primary: view === "cart" || view === "addresses" || view === "addAddress" || view === "summary",
      onClick: () => setView("cart") },
  ];

  return (
    <MiniAppShell
      appId="shop" name={app.name} tagline={app.tagline}
      icon={app.icon} bg={app.bg} fg={app.fg}
      bottomActions={bottomActions}
    >
      {view === "shop" && (
        <ShopView
          category={category} setCategory={setCategory}
          products={visibleProducts}
          cart={cart} onInc={inc} onDec={dec}
          onOpenFilters={() => setFiltersOpen(true)}
          filterCount={activeFilterCount}
        />
      )}

      {view === "cart" && (
        <CartView
          items={cartItems} total={cartTotal} inc={inc} dec={dec}
          onBrowse={() => setView("shop")}
          onCheckout={() => setView("addresses")}
        />
      )}

      {view === "addresses" && (
        <AddressesView
          addresses={addresses} selectedId={selectedAddressId}
          onSelect={setSelectedAddressId}
          onAdd={() => setView("addAddress")}
          onBack={() => setView("cart")}
          onContinue={() => setView("summary")}
        />
      )}

      {view === "addAddress" && (
        <AddAddressView
          onBack={() => setView("addresses")}
          onSave={(a) => {
            const id = `a-${Date.now()}`;
            const next: Address = { ...a, id };
            setAddresses((arr) => {
              const updated = a.isDefault ? arr.map((x) => ({ ...x, isDefault: false })) : arr;
              return [...updated, next];
            });
            setSelectedAddressId(id);
            setView("addresses");
          }}
        />
      )}

      {view === "summary" && (
        <SummaryView
          items={cartItems} total={cartTotal}
          address={addresses.find((a) => a.id === selectedAddressId)!}
          onBack={() => setView("addresses")}
          onPlace={placeOrder}
        />
      )}

      {view === "orders" && (
        <OrdersView
          tab={ordersTab} setTab={setOrdersTab}
          current={currentOrders} history={historyOrders}
          onBrowse={() => setView("shop")}
          onOpen={(id) => { setActiveOrderId(id); setView("orderDetail"); }}
        />
      )}

      {view === "orderDetail" && activeOrder && (
        <OrderDetailView
          order={activeOrder}
          onBack={() => setView("orders")}
          onTrack={() => setTrackSheet(true)}
          onHelp={() => setView("help")}
        />
      )}

      {view === "help" && (
        <HelpView onBack={() => setView("orderDetail")} />
      )}

      {/* Floating View Cart bar */}
      <AnimatePresence>
        {cartCount > 0 && view === "shop" && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed inset-x-0 bottom-24 z-40 pb-safe"
          >
            <div className="mx-auto max-w-md px-6">
              <button
                onClick={() => setView("cart")}
                className="flex w-full items-center justify-between rounded-full px-5 py-3.5 text-white shadow-lg"
                style={{ background: "#111" }}
              >
                <ShoppingBag className="h-5 w-5" />
                <div className="text-center">
                  <p className="text-sm font-semibold leading-tight">View Cart</p>
                  <p className="text-[11px] text-white/70 leading-tight">₹{cartTotal} total</p>
                </div>
                <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full px-1.5 text-xs font-bold text-white" style={{ background: CORAL }}>
                  {cartCount}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Track order bottom sheet */}
      <AnimatePresence>
        {trackSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setTrackSheet(false); setCodeCopied(false); }}
              className="fixed inset-0 z-[80] bg-black/40"
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-x-0 bottom-0 z-[90] mx-auto w-full max-w-md rounded-t-3xl bg-white p-5 pb-8 shadow-2xl"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-200" />
              <h2 className="text-lg font-bold text-neutral-900">Track Order</h2>
              <div className="mt-4 space-y-3">
                <div className={`flex items-center gap-3 rounded-xl border p-3 ${codeCopied ? "border-emerald-500 bg-emerald-50/40" : "border-neutral-200"}`}>
                  {codeCopied
                    ? <CheckCircle2 className="h-5 w-5" style={{ color: OK }} />
                    : <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold" style={{ background: "#FFE9D5", color: CORAL }}>1</span>}
                  <span className="text-sm font-medium text-neutral-800">
                    {codeCopied ? "Code Copied Successfully!" : "Copy Code"}
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold" style={{ background: "#FFE9D5", color: CORAL }}>2</span>
                  <span className="text-sm text-neutral-800">Open Tracking link &amp; paste code to track your order.</span>
                </div>
              </div>
              {!codeCopied ? (
                <button
                  onClick={() => { navigator.clipboard?.writeText(activeOrder?.id ?? ""); setCodeCopied(true); }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white"
                  style={{ background: "#111" }}
                >
                  <Copy className="h-4 w-4" /> Copy Code &amp; Continue
                </button>
              ) : (
                <button
                  onClick={() => { setTrackSheet(false); setCodeCopied(false); }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white"
                  style={{ background: "#111" }}
                >
                  Open Tracking Link <ExternalLink className="h-4 w-4" />
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <FiltersSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        cats={fCats}
        setCats={setFCats}
        price={fPrice}
        setPrice={setFPrice}
        sort={fSort}
        setSort={setFSort}
      />
    </MiniAppShell>
  );
}

/* ---------------- Shop grid ---------------- */
function ShopView({ category, setCategory, products, cart, onInc, onDec, onOpenFilters, filterCount }: {
  category: string; setCategory: (c: string) => void; products: Product[];
  cart: Record<string, number>; onInc: (id: string) => void; onDec: (id: string) => void;
  onOpenFilters: () => void; filterCount: number;
}) {
  return (
    <>
      <div className="mt-2 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium text-white" style={{ background: DEEP }}>
        ✨ Extra 10% off with code <span className="font-bold tracking-widest">PERIODPOWER</span> ✨
      </div>
      <h2 className="mt-5 text-2xl font-bold text-neutral-900">Shop all</h2>
      <p className="mt-1 text-sm text-neutral-600">Sustainable period care, designed by engineers and scientists.</p>
      <div className="mt-4 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-neutral-200 px-3 py-2.5">
          <Search className="h-4 w-4 text-neutral-500" />
          <input className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400" placeholder="Search products" />
        </div>
        <button
          onClick={onOpenFilters}
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200"
        >
          <SlidersHorizontal className="h-4 w-4 text-neutral-700" />
          {filterCount > 0 && (
            <span
              className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
              style={{ background: CORAL }}
            >
              {filterCount}
            </span>
          )}
        </button>
      </div>
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className="shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: category === c ? DEEP : "transparent",
              color: category === c ? "#fff" : "#333",
              borderColor: category === c ? DEEP : "#E5E5E5",
            }}>{c}</button>
        ))}
      </div>
      <p className="mt-3 text-xs uppercase tracking-widest text-neutral-500">{products.length} products</p>
      <div className="mt-3 grid grid-cols-2 gap-3 pb-4">
        {products.map((p) => {
          const qty = cart[p.id] ?? 0;
          return (
            <div key={p.id} className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              <div className="relative flex aspect-square items-center justify-center text-5xl" style={{ background: "#FBEEE1" }}>
                {p.emoji}
                <div className="absolute right-2 top-2">
                  {qty === 0 ? (
                    <button
                      onClick={() => onInc(p.id)}
                      aria-label={`Add ${p.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm ring-1 ring-black/5"
                      style={{ background: "#FFE9D5" }}
                    >
                      <Plus className="h-4 w-4" style={{ color: CORAL }} strokeWidth={2.5} />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-white shadow-md" style={{ background: CORAL }}>
                      <button onClick={() => onDec(p.id)} aria-label="Decrease"><Minus className="h-4 w-4" strokeWidth={2.5} /></button>
                      <span className="min-w-[14px] text-center text-sm font-bold">{qty}</span>
                      <button onClick={() => onInc(p.id)} aria-label="Increase"><Plus className="h-4 w-4" strokeWidth={2.5} /></button>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-3">
                <p className="text-[13px] font-semibold text-neutral-900">{p.name}</p>
                {p.variant && <p className="mt-0.5 text-[11px] text-neutral-500">{p.variant}</p>}
                <div className="mt-2 flex items-baseline gap-1.5">
                  {p.original && <span className="text-[11px] text-neutral-400 line-through">₹{p.original}</span>}
                  <span className="text-sm font-bold" style={{ color: DEEP }}>₹{p.price}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}


/* ---------------- Cart ---------------- */
function CartView({ items, total, inc, dec, onBrowse, onCheckout }: {
  items: { p: Product; qty: number }[]; total: number;
  inc: (id: string) => void; dec: (id: string) => void;
  onBrowse: () => void; onCheckout: () => void;
}) {
  if (items.length === 0) {
    return (
      <>
        <div className="mt-2 flex items-center justify-between border-b border-neutral-200 pb-4">
          <h2 className="text-2xl font-bold text-neutral-900">Cart</h2>
          <div className="flex items-center gap-1.5 rounded-full border border-amber-200 px-3 py-1" style={{ background: "linear-gradient(90deg,#FFF4D6,#FFE7B0)" }}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px]" style={{ background: "#F5B23B", color: "#fff" }}>₹</span>
            <span className="text-sm font-bold text-neutral-900">80,000</span>
          </div>
        </div>
        <div className="mt-5 flex flex-col items-center rounded-2xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white px-6 py-12 text-center">
          <ShoppingCart className="h-14 w-14" strokeWidth={2.25} style={{ color: CORAL }} />
          <p className="mt-6 text-xl font-bold text-neutral-900">Your cart is empty</p>
          <p className="mt-2 text-sm text-neutral-500">Add products to get started</p>
          <button onClick={onBrowse} className="mt-6 w-full rounded-2xl py-4 text-sm font-semibold text-white" style={{ background: "#1A1A1A" }}>
            Browse Product
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="pb-24">
      <div className="mt-3 space-y-3">
        {items.map(({ p, qty }) => (
          <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl text-3xl" style={{ background: "#FBEEE1" }}>{p.emoji}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-neutral-900">{p.name}</p>
              <p className="mt-0.5 text-sm font-bold" style={{ color: DEEP }}>₹{p.price}</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-white" style={{ background: CORAL }}>
              <button onClick={() => dec(p.id)} aria-label="decrease"><Minus className="h-4 w-4" /></button>
              <span className="min-w-[16px] text-center text-sm font-bold">{qty}</span>
              <button onClick={() => inc(p.id)} aria-label="increase"><Plus className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 space-y-2 rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between text-sm"><span className="text-neutral-600">Total items</span><span className="font-semibold">{items.reduce((a, b) => a + b.qty, 0)}</span></div>
        <div className="flex items-center justify-between text-sm"><span className="text-neutral-600">Total cart value</span><span className="font-bold" style={{ color: DEEP }}>₹{total}</span></div>
      </div>
      <button onClick={onCheckout} className="mt-5 w-full rounded-xl py-3.5 text-sm font-semibold text-white" style={{ background: "#111" }}>Continue to checkout</button>
    </div>
  );
}

/* ---------------- Addresses ---------------- */
function AddressesView({ addresses, selectedId, onSelect, onAdd, onBack, onContinue }: {
  addresses: Address[]; selectedId: string; onSelect: (id: string) => void;
  onAdd: () => void; onBack: () => void; onContinue: () => void;
}) {
  return (
    <div className="pb-24">
      <SubHeader title="Add shipping" onBack={onBack} />
      <div className="mt-4 space-y-3">
        {addresses.map((a) => {
          const sel = a.id === selectedId;
          return (
            <button key={a.id} onClick={() => onSelect(a.id)}
              className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left ${sel ? "border-[color:var(--coral)]" : "border-neutral-200"}`}
              style={sel ? { borderColor: CORAL } : undefined}>
              <span className="mt-0.5">
                {sel
                  ? <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: CORAL }}><span className="h-2 w-2 rounded-full bg-white" /></span>
                  : <Circle className="h-5 w-5 text-neutral-300" />}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-neutral-900">{a.label}</p>
                  {a.isDefault && <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600">Default</span>}
                </div>
                <p className="mt-1 text-sm text-neutral-600">{a.address}, {a.city}, {a.state} - {a.pincode}</p>
                <p className="mt-1 text-sm text-neutral-600">Phone: {a.phone}</p>
              </div>
            </button>
          );
        })}
        <button onClick={onAdd} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 py-4 text-sm font-medium text-neutral-700">
          <Plus className="h-4 w-4" /> Add new address
        </button>
      </div>
      <button onClick={onContinue} className="mt-6 w-full rounded-xl py-3.5 text-sm font-semibold text-white" style={{ background: "#111" }}>Select &amp; continue</button>
    </div>
  );
}

function AddAddressView({ onBack, onSave }: { onBack: () => void; onSave: (a: Omit<Address, "id">) => void }) {
  const [f, setF] = useState<Omit<Address, "id">>({
    label: "Home", firstName: "", lastName: "", phone: "+91 ",
    address: "", city: "", state: "", pincode: "", isDefault: true,
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));
  const valid = f.firstName && f.lastName && f.phone && f.address && f.city && f.state && f.pincode;
  return (
    <div className="pb-24">
      <SubHeader title="Add New Address" onBack={onBack} />
      <div className="mt-4 space-y-3">
        <Field label="First Name" value={f.firstName} onChange={(v) => set("firstName", v)} />
        <Field label="Last Name" value={f.lastName} onChange={(v) => set("lastName", v)} />
        <Field label="Mobile Number" value={f.phone} onChange={(v) => set("phone", v)} />
        <Field label="Full Address" value={f.address} onChange={(v) => set("address", v)} placeholder="Enter your full address here..." />
        <Field label="State" value={f.state} onChange={(v) => set("state", v)} chevron />
        <Field label="City" value={f.city} onChange={(v) => set("city", v)} chevron />
        <Field label="Pincode" value={f.pincode} onChange={(v) => set("pincode", v)} />
        <label className="mt-2 flex items-center gap-2 text-sm text-neutral-800">
          <input type="checkbox" checked={!!f.isDefault} onChange={(e) => set("isDefault", e.target.checked)}
            className="h-4 w-4 accent-[color:var(--coral)]" style={{ accentColor: CORAL }} />
          Set as default address
        </label>
      </div>
      <button disabled={!valid} onClick={() => onSave(f)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white disabled:opacity-40"
        style={{ background: "#111" }}>
        <Plus className="h-4 w-4" /> Add New Address
      </button>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, chevron }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; chevron?: boolean;
}) {
  return (
    <div className="relative rounded-xl border border-neutral-200 px-3 pt-2 pb-1.5">
      <label className="text-[11px] text-neutral-500">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="block w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400" />
      {chevron && <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />}
    </div>
  );
}

/* ---------------- Summary ---------------- */
function SummaryView({ items, total, address, onBack, onPlace }: {
  items: { p: Product; qty: number }[]; total: number; address: Address;
  onBack: () => void; onPlace: () => void;
}) {
  return (
    <div className="pb-24">
      <SubHeader title="Order Summary" onBack={onBack} />
      <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <p className="text-sm font-bold text-neutral-900">Delivery Details</p>
        <p className="mt-2 text-sm text-neutral-700"><span className="font-semibold">{address.label}</span> • {address.address}, {address.city}, {address.state} - {address.pincode}</p>
        <p className="mt-1 text-sm text-neutral-700"><span className="font-semibold">Phone</span> • {address.phone}</p>
        <div className="mt-3 space-y-3 border-t border-neutral-100 pt-3">
          {items.map(({ p, qty }) => (
            <div key={p.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-900">{p.name}</p>
                <p className="text-sm font-bold" style={{ color: DEEP }}>₹{p.price}</p>
                <p className="text-xs text-neutral-500">Qty: {qty}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl" style={{ background: "#FBEEE1" }}>{p.emoji}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <p className="text-sm font-bold text-neutral-900">Summary</p>
        <div className="mt-2 flex items-center justify-between text-sm"><span className="text-neutral-600">Total items</span><span className="font-semibold">{items.reduce((a, b) => a + b.qty, 0)}</span></div>
        <div className="mt-1 flex items-center justify-between text-sm"><span className="text-neutral-600">Total cart value</span><span className="font-bold" style={{ color: DEEP }}>₹{total}</span></div>
      </div>
      <button onClick={onPlace} className="mt-6 w-full rounded-xl py-3.5 text-sm font-semibold text-white" style={{ background: CORAL }}>Place Order</button>
    </div>
  );
}

/* ---------------- Orders list ---------------- */
function OrdersView({ tab, setTab, current, history, onBrowse, onOpen }: {
  tab: "current" | "history"; setTab: (t: "current" | "history") => void;
  current: Order[]; history: Order[]; onBrowse: () => void; onOpen: (id: string) => void;
}) {
  const active = tab === "current" ? current : history;
  return (
    <div className="pb-24">
      <div className="mt-2 flex gap-6 border-b border-neutral-200">
        {(["current", "history"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="relative -mb-px pb-2 text-sm font-semibold"
            style={{ color: tab === t ? DEEP : "#737373" }}>
            {t === "current" ? "Current Orders" : "Order History"}
            {tab === t && <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-full" style={{ background: CORAL }} />}
            {t === "current" && current.length > 0 && (
              <span className="ml-2 rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold text-neutral-700">{current.length}</span>
            )}
          </button>
        ))}
      </div>
      {active.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-8">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "#FFE9D5" }}>
            <ShoppingBag className="h-7 w-7" style={{ color: CORAL }} />
          </div>
          <p className="text-lg font-bold text-neutral-900">{tab === "current" ? "No Current Orders" : "No Orders Yet"}</p>
          <p className="mt-1 text-sm text-neutral-500">Add products to get started</p>
          <button onClick={onBrowse} className="mt-5 w-full rounded-xl py-3 text-sm font-semibold text-white" style={{ background: "#111" }}>Browse Product</button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {active.map((o) => {
            const itemCount = o.items.reduce((a, b) => a + b.qty, 0);
            return (
              <button
                key={o.id}
                onClick={() => onOpen(o.id)}
                className="block w-full rounded-2xl border border-neutral-200 bg-white p-4 text-left"
              >
                {tab === "current" ? (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl" style={{ background: "#FBEEE1" }}>
                        {o.items[0]?.p.emoji}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold leading-snug text-neutral-900">
                          {o.status === "verifying" ? "Your order request is being verified." : "Your order is on the way & should arrive soon."}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {itemCount} item{itemCount !== 1 ? "s" : ""}
                          {o.status === "shipped" && `, delivers between ${o.deliverFrom} - ${o.deliverTo}`}
                        </p>
                      </div>
                      <ChevronDown className="mt-1 h-4 w-4 -rotate-90 text-neutral-400" />
                    </div>
                    <ProgressBar status={o.status} className="mt-3" />
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl" style={{ background: "#FBEEE1" }}>
                      {o.items[0]?.p.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-neutral-900">#{o.id}</p>
                      <p className="mt-0.5 text-sm font-semibold" style={{ color: DEEP }}>₹{o.total}</p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {itemCount} items,{" "}
                        <span style={{ color: o.status === "delivered" ? OK : ERR }} className="font-semibold">
                          {o.status === "delivered" ? `delivered ${o.deliveredOn ?? ""}` : "rejected"}
                        </span>
                        {o.deliveredOn && ` ${o.deliveredOn}`}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 -rotate-90 text-neutral-400" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

      )}
    </div>
  );
}

/* ---------------- Order Detail ---------------- */
function OrderDetailView({ order, onBack, onTrack, onHelp }: {
  order: Order; onBack: () => void; onTrack: () => void; onHelp: () => void;
}) {
  const rejected = order.status === "rejected";
  const delivered = order.status === "delivered";
  const shipped = order.status === "shipped";
  const verifying = order.status === "verifying";
  const topBorder = rejected ? ERR : delivered ? OK : "#E5E5E5";
  return (
    <div className="pb-32">
      <SubHeader title={`Order #${order.id}`} onBack={onBack} />
      <div className="mt-4 rounded-2xl border bg-white p-4" style={{ borderColor: topBorder, borderWidth: rejected || delivered ? 1.5 : 1 }}>
        {rejected ? (
          <>
            <p className="text-lg font-bold" style={{ color: ERR }}>Rejected</p>
            <p className="mt-1 text-sm" style={{ color: ERR }}>{order.rejectReason ?? "Address is incorrect. Please recheck the address and place the order again."}</p>
          </>
        ) : delivered ? (
          <>
            <p className="text-lg font-bold text-neutral-900">Hope you&apos;re enjoying your reward.</p>
            <p className="mt-1 text-sm font-semibold" style={{ color: OK }}>Delivered {order.deliveredOn ?? "Tue"}</p>
          </>
        ) : (
          <>
            <p className="text-lg font-bold text-neutral-900">
              {verifying ? "Your order request is being verified." : "Your order is on the way & should arrive soon."}
            </p>
            <p className="mt-1 text-sm font-semibold" style={{ color: CORAL }}>
              {verifying ? "Waiting for verification" : `Delivers between ${order.deliverFrom} - ${order.deliverTo}`}
            </p>
          </>
        )}
        <ProgressBar status={order.status} className="mt-4" />
      </div>


      <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <p className="text-sm font-bold text-neutral-900">Delivery Details</p>
        <p className="mt-2 text-sm text-neutral-700"><span className="font-semibold">{order.address.label}</span> • {order.address.address}, {order.address.city}, {order.address.state} - {order.address.pincode}</p>
        <p className="mt-1 text-sm text-neutral-700"><span className="font-semibold">Phone</span> • {order.address.phone}</p>
        <div className="mt-3 space-y-3 border-t border-neutral-100 pt-3">
          {order.items.map(({ p, qty }) => (
            <div key={p.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-900">{p.name}</p>
                <p className="text-sm font-bold" style={{ color: DEEP }}>₹{p.price}</p>
                <p className="text-xs text-neutral-500">Qty: {qty}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl" style={{ background: "#FBEEE1" }}>{p.emoji}</div>
            </div>
          ))}
        </div>
      </div>

      {shipped && (
        <button onClick={onTrack} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold" style={{ background: "#FFE9D5", color: DEEP }}>
          <Truck className="h-4 w-4" /> Track order
        </button>
      )}
      {(delivered || rejected) && (
        <button onClick={onHelp} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold" style={{ background: "#FFE9D5", color: DEEP }}>
          <HelpCircle className="h-4 w-4" /> Help &amp; Support
        </button>
      )}
    </div>
  );
}

function ProgressBar({ status, className }: { status: OrderStatus; className?: string }) {
  const pct = status === "verifying" ? 15 : status === "shipped" ? 55 : status === "delivered" ? 100 : 10;
  const color = status === "delivered" ? OK : status === "rejected" ? ERR : CORAL;
  return (
    <div className={className}>
      <div className="h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-neutral-600">
        <span>Verification</span><span>Shipped</span><span>Delivered</span>
      </div>
    </div>
  );
}

/* ---------------- Help ---------------- */
const FAQS = [
  { q: "How do I track my order?", a: "You'll get a tracking link once your order ships. You can also use the Track order button on your order detail page." },
  { q: "What is the return policy?", a: "Unopened products can be returned within 7 days of delivery. Contact support to initiate a return." },
  { q: "How long does delivery take?", a: "Standard delivery takes 3–8 business days depending on your pincode." },
  { q: "Can I change my delivery address?", a: "You can change the address until the order enters the Shipped stage." },
];

function HelpView({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<"faq" | "tickets">("faq");
  const [open, setOpen] = useState<number | null>(1);
  return (
    <div className="pb-24">
      <SubHeader title="Help & Support" onBack={onBack} />
      <div className="mt-3 flex gap-6 border-b border-neutral-200">
        {(["faq", "tickets"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="relative -mb-px pb-2 text-sm font-semibold" style={{ color: tab === t ? DEEP : "#737373" }}>
            {t === "faq" ? "FAQs" : "Tickets"}
            {tab === t && <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-full" style={{ background: CORAL }} />}
          </button>
        ))}
      </div>
      {tab === "faq" ? (
        <>
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-neutral-100 px-3 py-2.5">
            <Search className="h-4 w-4 text-neutral-500" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500" placeholder="Search for your query..." />
          </div>
          <p className="mt-4 flex items-center gap-2 text-base font-bold text-neutral-900">
            <span className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: "#FFE9D5", color: CORAL }}>💬</span>
            FAQs
          </p>
          <div className="mt-3 space-y-1">
            {FAQS.map((f, i) => (
              <div key={i} className="border-b border-neutral-100 py-3">
                <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between text-left">
                  <span className="text-sm font-semibold text-neutral-900">{f.q}</span>
                  <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform ${open === i ? "rotate-180" : ""}`} />
                </button>
                {open === i && <p className="mt-2 text-sm text-neutral-600">{f.a}</p>}
              </div>
            ))}
          </div>
          <button className="mt-6 w-full rounded-xl py-3.5 text-sm font-semibold text-white" style={{ background: "#111" }}>Contact Support</button>
        </>
      ) : (
        <p className="mt-6 text-center text-sm text-neutral-500">No tickets yet.</p>
      )}
    </div>
  );
}

/* ---------------- Shared sub-header ---------------- */
function SubHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="mt-2 flex items-center gap-3">
      <button onClick={onBack} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "#111" }}>
        <ArrowLeft className="h-4 w-4 text-white" />
      </button>
      <p className="text-xl font-bold text-neutral-900">{title}</p>
    </div>
  );
}

/* ---------------- Filters bottom sheet ---------------- */
const FILTER_CATS = ["Cups", "Bundles", "Care", "Accessories"];

function FiltersSheet({
  open, onClose, cats, setCats, price, setPrice, sort, setSort,
}: {
  open: boolean; onClose: () => void;
  cats: string[]; setCats: (v: string[]) => void;
  price: [number, number]; setPrice: (v: [number, number]) => void;
  sort: "low" | "high" | null; setSort: (v: "low" | "high" | null) => void;
}) {
  const toggleCat = (c: string) =>
    setCats(cats.includes(c) ? cats.filter((x) => x !== c) : [...cats, c]);

  const activeCount =
    cats.length +
    (price[0] !== PRICE_MIN || price[1] !== PRICE_MAX ? 1 : 0) +
    (sort ? 1 : 0);

  const clearAll = () => {
    setCats([]);
    setPrice([PRICE_MIN, PRICE_MAX]);
    setSort(null);
  };

  const pct = (v: number) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white pb-6"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
          >
            <div className="flex justify-center pt-3">
              <div className="h-1.5 w-10 rounded-full bg-neutral-300" />
            </div>

            <div className="flex items-center justify-between px-5 pt-4">
              <h3 className="text-xl font-bold text-neutral-900">Filters</h3>
              {activeCount > 0 && (
                <button onClick={clearAll} className="text-sm font-semibold" style={{ color: CORAL }}>
                  Clear all filters ({activeCount})
                </button>
              )}
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-5 pt-6">
              {/* Categories */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Categories</p>
                {cats.length > 0 && (
                  <button onClick={() => setCats([])} className="text-xs font-semibold" style={{ color: CORAL }}>
                    Clear filter
                  </button>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {FILTER_CATS.map((c) => {
                  const active = cats.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleCat(c)}
                      className="flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors"
                      style={{
                        background: active ? "#FFE9D5" : "transparent",
                        borderColor: active ? CORAL : "#E5E5E5",
                        color: active ? "#111" : "#333",
                      }}
                    >
                      {c}
                      {active && <span style={{ color: CORAL }}>×</span>}
                    </button>
                  );
                })}
              </div>

              {/* Price range */}
              <div className="mt-7 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Price range</p>
                {(price[0] !== PRICE_MIN || price[1] !== PRICE_MAX) && (
                  <button
                    onClick={() => setPrice([PRICE_MIN, PRICE_MAX])}
                    className="text-xs font-semibold"
                    style={{ color: CORAL }}
                  >
                    Clear filter
                  </button>
                )}
              </div>
              <div className="mt-6 px-1">
                <div className="relative h-1.5 rounded-full bg-neutral-200">
                  <div
                    className="absolute h-1.5 rounded-full"
                    style={{
                      left: `${pct(price[0])}%`,
                      right: `${100 - pct(price[1])}%`,
                      background: CORAL,
                    }}
                  />
                  <input
                    type="range"
                    min={PRICE_MIN} max={PRICE_MAX} step={50} value={price[0]}
                    onChange={(e) => {
                      const v = Math.min(Number(e.target.value), price[1] - 50);
                      setPrice([v, price[1]]);
                    }}
                    className="range-thumb absolute inset-0 h-1.5 w-full appearance-none bg-transparent"
                    style={{ pointerEvents: "none" }}
                  />
                  <input
                    type="range"
                    min={PRICE_MIN} max={PRICE_MAX} step={50} value={price[1]}
                    onChange={(e) => {
                      const v = Math.max(Number(e.target.value), price[0] + 50);
                      setPrice([price[0], v]);
                    }}
                    className="range-thumb absolute inset-0 h-1.5 w-full appearance-none bg-transparent"
                    style={{ pointerEvents: "none" }}
                  />
                  <style>{`
                    .range-thumb { -webkit-appearance: none; }
                    .range-thumb::-webkit-slider-thumb {
                      -webkit-appearance: none; pointer-events: auto;
                      height: 22px; width: 22px; border-radius: 9999px;
                      background: ${CORAL}; border: 3px solid #fff;
                      box-shadow: 0 1px 4px rgba(0,0,0,0.25); cursor: pointer;
                    }
                    .range-thumb::-moz-range-thumb {
                      pointer-events: auto;
                      height: 22px; width: 22px; border-radius: 9999px;
                      background: ${CORAL}; border: 3px solid #fff;
                      box-shadow: 0 1px 4px rgba(0,0,0,0.25); cursor: pointer;
                    }
                  `}</style>
                </div>
                <div className="mt-4 flex justify-between text-sm text-neutral-700">
                  <span>₹{price[0]}</span>
                  <span>₹{price[1]}</span>
                </div>
              </div>

              {/* Sort by */}
              <div className="mt-7 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Sort by</p>
                {sort && (
                  <button onClick={() => setSort(null)} className="text-xs font-semibold" style={{ color: CORAL }}>
                    Clear filter
                  </button>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { id: "low", label: "Price: Low to high" },
                  { id: "high", label: "Price: High to low" },
                ].map((o) => {
                  const active = sort === (o.id as "low" | "high");
                  return (
                    <button
                      key={o.id}
                      onClick={() => setSort(active ? null : (o.id as "low" | "high"))}
                      className="rounded-full border px-3.5 py-1.5 text-sm transition-colors"
                      style={{
                        background: active ? "#FFE9D5" : "transparent",
                        borderColor: active ? CORAL : "#E5E5E5",
                        color: "#111",
                      }}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-5 pt-6">
              <button
                onClick={onClose}
                className="w-full rounded-2xl py-4 text-base font-semibold text-white"
                style={{ background: "#1A1A1A" }}
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
