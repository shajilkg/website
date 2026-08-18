import { useState, useEffect, useCallback, createContext, useContext, useMemo } from "react";
import { Tabs } from "./components/Tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card";
import { Button } from "./components/ui/button";
import "./index.css";

/* ── types ────────────────────────────────────────────────── */
interface ArtItem {
  title: string;
  gradient: string;
  date: string;
  location: string;
  motivation: string;
  medium?: string;
}

/* ── dark mode ────────────────────────────────────────────── */
const DarkModeCtx = createContext({ toggle: () => {} });

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}

/* ── lightbox with nav ────────────────────────────────────── */
function Lightbox({ items, index, onClose }: { items: ArtItem[]; index: number; onClose: () => void }) {
  const [i, setI] = useState(index);
  const item = items[i];

  const prev = useCallback(() => setI((n) => (n - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setI((n) => (n + 1) % items.length), [items.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <div
      className="lightbox-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="lightbox-panel relative bg-background rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 size-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center text-lg hover:bg-black/60 transition-colors"
          aria-label="Close"
        >
          ×
        </button>

        {/* nav arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/3 z-10 size-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/3 z-10 size-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          aria-label="Next"
        >
          ›
        </button>

        {/* image */}
        <div
          className="aspect-[16/10] rounded-t-2xl flex items-center justify-center text-xl font-medium text-white/80"
          style={{ background: item.gradient }}
        >
          {item.title}
        </div>

        {/* details */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-bold">{item.title}</h2>
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full shrink-0">
              {i + 1} / {items.length}
            </span>
          </div>

          {item.medium && (
            <p className="text-sm text-primary font-medium">{item.medium}</p>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">When</span>
              <p className="font-medium mt-0.5">{item.date}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Where</span>
              <p className="font-medium mt-0.5">{item.location}</p>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <span className="text-muted-foreground text-sm">Motivation</span>
            <p className="text-sm mt-1.5 leading-relaxed">{item.motivation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── art grid with staggered layout ───────────────────────── */
function ArtGrid({ items, columns = 3 }: { items: ArtItem[]; columns?: number }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const gridClass = columns === 2
    ? "grid-cols-1 sm:grid-cols-2"
    : "grid-cols-2 md:grid-cols-3";

  return (
    <>
      <div className={`grid ${gridClass} gap-4 sm:gap-5`}>
        {items.map((item, i) => (
          <button
            key={item.title}
            onClick={() => setOpenIndex(i)}
            className="text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
          >
            <div className="relative overflow-hidden rounded-xl">
              <div
                className="aspect-[4/3] flex items-center justify-center text-sm font-medium text-white/80 transition-transform duration-300 group-hover:scale-105"
                style={{ background: item.gradient }}
              >
                {item.title}
              </div>
              {/* overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end p-3">
                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  View Details →
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 px-1">{item.title}</p>
          </button>
        ))}
      </div>
      {openIndex !== null && (
        <Lightbox items={items} index={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  );
}

/* ── decorative divider ───────────────────────────────────── */
function Divider() {
  return (
    <div className="flex items-center gap-3 my-8">
      <div className="flex-1 h-px bg-border" />
      <div className="flex gap-1">
        <div className="size-1.5 rounded-full bg-muted-foreground/30" />
        <div className="size-1.5 rounded-full bg-muted-foreground/20" />
        <div className="size-1.5 rounded-full bg-muted-foreground/10" />
      </div>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

/* ── stats row ────────────────────────────────────────────── */
function Stats() {
  const stats = [
    { value: "147", label: "Pieces Made" },
    { value: "12", label: "Exhibitions" },
    { value: "89", label: "Students Taught" },
  ];
  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      {stats.map((s) => (
        <div key={s.label}>
          <p className="text-2xl font-bold tracking-tight">{s.value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ── tab content ──────────────────────────────────────────── */
const Blog = () => (
  <div className="space-y-6">
    {/* featured post */}
    <Card className="overflow-hidden group cursor-pointer">
      <div className="aspect-[2/1] bg-gradient-to-br from-amber-700 via-orange-600 to-rose-700 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <span className="text-white/80 text-lg font-medium">Featured Image</span>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">Featured</span>
          <CardDescription>Aug 12, 2026</CardDescription>
        </div>
        <CardTitle className="text-xl">New Clay Series — "Groundwork"</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Twelve pieces exploring the tension between control and accident. Each vessel thrown on the wheel, then
          altered by hand — pinched, cut, reassembled. No two alike. The ash glaze reacts differently in every
          firing, which is exactly the point.
        </p>
      </CardContent>
    </Card>

    {/* recent posts */}
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { title: "Studio Update — Summer", date: "Jul 28, 2026", desc: "New kiln arrived. First bisque firing went smoothly.", color: "from-sky-600 to-blue-700" },
        { title: "Exhibition at Lakewood", date: "Jun 5, 2026", desc: "Three pieces in the summer group show. Great conversations.", color: "from-emerald-600 to-teal-700" },
        { title: "Workshop Recap", date: "May 18, 2026", desc: "Hand-building weekend — 8 students, 24 pinch pots.", color: "from-purple-600 to-violet-700" },
        { title: "Glaze Chemistry Notes", date: "Apr 30, 2026", desc: "Documenting the ash glaze ratios that actually worked.", color: "from-rose-600 to-pink-700" },
      ].map((post) => (
        <Card key={post.title} className="overflow-hidden group cursor-pointer">
          <div className={`aspect-[3/1] bg-gradient-to-br ${post.color} flex items-center justify-center relative`}>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription>{post.date}</CardDescription>
            <CardTitle className="text-base">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{post.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const ArtDisplay = () => (
  <>
    <Stats />
    <Divider />
    <ArtGrid
      items={[
        { title: "Untitled #1", gradient: "linear-gradient(135deg, #b8860b, #d4a574)", date: "Mar 2026", location: "Home studio", motivation: "First experiment with warm earth tones. Wanted to see how ochre reads against a matte surface.", medium: "Stoneware, matte glaze" },
        { title: "Untitled #2", gradient: "linear-gradient(135deg, #2d5a27, #6b8f3c)", date: "Apr 2026", location: "Home studio", motivation: "Exploring growth patterns in nature — spirals, branching, things that repeat without copying themselves.", medium: "Porcelain, celadon" },
        { title: "Untitled #3", gradient: "linear-gradient(135deg, #1a6b4a, #4ecdc4)", date: "May 2026", location: "Lakewood Gallery", motivation: "Commissioned for the spring group show. Tried to balance restraint with expression.", medium: "Mixed media on canvas" },
        { title: "Untitled #4", gradient: "linear-gradient(135deg, #0e4d6e, #3498db)", date: "Jun 2026", location: "Home studio", motivation: "Water study — capturing movement in stillness. The glaze pools where the form dips.", medium: "Stoneware, blue slip" },
        { title: "Untitled #5", gradient: "linear-gradient(135deg, #4a2d7a, #9b59b6)", date: "Jul 2026", location: "Workshop", motivation: "Playing with negative space. The holes are the point — what you see through matters as much as the surface.", medium: "Raku fired clay" },
        { title: "Untitled #6", gradient: "linear-gradient(135deg, #8e44ad, #c39bd3)", date: "Aug 2026", location: "Home studio", motivation: "Late summer palette — cooler tones creeping in. A shift from the warmth of the earlier pieces.", medium: "Stoneware, ash glaze" },
      ]}
    />
  </>
);

const Sculpture = () => (
  <ArtGrid
    items={[
      { title: "Vessel I", gradient: "linear-gradient(135deg, #2c3e50, #4ca1af)", date: "Feb 2026", location: "Home studio", motivation: "Exploring organic forms in stoneware with ash glaze. The glaze reacts differently every firing — that unpredictability is the point.", medium: "Stoneware, ash glaze" },
      { title: "Drift", gradient: "linear-gradient(135deg, #34495e, #5d8a8a)", date: "Apr 2026", location: "Foundry visit", motivation: "Bronze cast — capturing the feeling of things carried by water. Worked with a local foundry for the first time.", medium: "Bronze, lost-wax cast" },
      { title: "Core Sample", gradient: "linear-gradient(135deg, #1c2833, #515a5a)", date: "Jun 2026", location: "Home studio", motivation: "Reclaimed wood and epoxy — layers as memory. Each ring is a decision, each pour a moment frozen.", medium: "Reclaimed wood, epoxy resin" },
    ]}
    columns={2}
  />
);

const Posters = () => (
  <ArtGrid
    items={[
      { title: "Winter Exhibition", gradient: "linear-gradient(135deg, #d35400, #e67e22)", date: "Jan 2026", location: "Lakewood Gallery", motivation: "Promotional poster for the winter exhibition. Minimal typography, let the ceramics speak.", medium: "Screen print on cotton" },
      { title: "Hand-Building Workshop", gradient: "linear-gradient(135deg, #27ae60, #82e0aa)", date: "Mar 2026", location: "Community center", motivation: "Flyer for the hand-building weekend workshop. Warm colors to match the hands-on vibe.", medium: "Digital print" },
      { title: "Open Studio Day", gradient: "linear-gradient(135deg, #16a085, #76d7c4)", date: "May 2026", location: "Home studio", motivation: "Open studio invitation — clean, bold, no clutter. Let people know where to find us.", medium: "Risograph" },
      { title: "Annual Showcase", gradient: "linear-gradient(135deg, #8e44ad, #d2b4de)", date: "Jul 2026", location: "City arts council", motivation: "Annual showcase poster — geometric clay motifs. The repeated forms echo the process of throwing.", medium: "Letterpress" },
    ]}
  />
);

const Classes = () => (
  <div className="space-y-6">
    <div className="grid sm:grid-cols-3 gap-4">
      {[
        { name: "Wheel Throwing", schedule: "Saturdays 10am–12pm", spots: 4, price: "$45", desc: "Centering, pulling walls, and basic forms.", gradient: "from-amber-500 to-orange-600", level: "Beginner" },
        { name: "Hand-Building", schedule: "Wednesdays 6–8pm", spots: 6, price: "$35", desc: "Pinch, coil, and slab techniques.", gradient: "from-teal-500 to-cyan-600", level: "All Levels" },
        { name: "Advanced Glazing", schedule: "Sundays 2–5pm", spots: 2, price: "$60", desc: "Surface decoration and kiln chemistry.", gradient: "from-violet-500 to-purple-600", level: "Advanced" },
      ].map((c) => (
        <Card key={c.name} className="overflow-hidden relative group">
          <div className={`h-2 bg-gradient-to-r ${c.gradient}`} />
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{c.name}</CardTitle>
              <span className="text-lg font-bold">{c.price}</span>
            </div>
            <div className="flex items-center gap-2">
              <CardDescription>{c.schedule}</CardDescription>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{c.level}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{c.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{c.spots} spots left</span>
              <Button size="sm" className="transition-transform group-hover:scale-105">Sign Up</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* FAQ-style notes */}
    <Card>
      <CardHeader>
        <CardTitle className="text-base">What to bring</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-1">
        <p>All materials and tools provided. Wear clothes you don't mind getting clay on.</p>
        <p>First class is a trial — if you love it, sign up for the full session.</p>
      </CardContent>
    </Card>
  </div>
);

const About = () => (
  <div className="space-y-6">
    {/* hero card */}
    <Card className="overflow-hidden">
      <div className="aspect-[3/1] bg-gradient-to-r from-stone-700 via-amber-800 to-stone-600 flex items-center justify-center">
        <span className="text-white/60 text-sm font-medium tracking-widest uppercase">Est. 2024</span>
      </div>
      <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
        <p className="leading-relaxed text-base text-foreground">
          A small ceramics and mixed-media studio focused on exploration over perfection.
        </p>
        <p className="leading-relaxed">
          Founded in 2024, the lab is part workspace, part classroom — a place where
          process matters more than product. We believe the best work happens when
          you stop trying to make something "good" and start paying attention to
          what the material wants to do.
        </p>
        <p className="leading-relaxed">
          Open workshops, occasional exhibitions, and classes for all levels.
          No fancy gallery politics — just good work made with care.
        </p>
      </CardContent>
    </Card>

    <Stats />

    {/* timeline */}
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border">
          {[
            { year: "2024", event: "Lab founded in a garage. First kiln acquired." },
            { year: "2025", event: "Moved to Clay Street. First workshop series." },
            { year: "2026", event: "Lakewood Gallery exhibition. Expanded class offerings." },
          ].map((t) => (
            <div key={t.year} className="flex gap-4 relative">
              <div className="size-4 rounded-full border-2 border-primary bg-background shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{t.year}</p>
                <p className="text-sm text-muted-foreground">{t.event}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <div className="grid sm:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Studio Hours</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>Tue–Fri: 10am – 6pm</p>
          <p>Sat: 10am – 4pm</p>
          <p>Sun–Mon: Closed</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Find Us</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>142 Clay Street, Unit B</p>
          <p>Portland, OR 97201</p>
          <p className="text-foreground font-medium">hello@artlab.studio</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

/* ── app ──────────────────────────────────────────────────── */
const tabs = [
  { id: "blog", label: "Blog", content: <Blog /> },
  { id: "art", label: "Art Display", content: <ArtDisplay /> },
  { id: "sculpture", label: "Sculpture", content: <Sculpture /> },
  { id: "posters", label: "Posters", content: <Posters /> },
  { id: "classes", label: "Classes", content: <Classes /> },
  { id: "about", label: "About", content: <About /> },
];

export function App() {
  const { toggle } = useDarkMode();

  return (
    <DarkModeCtx.Provider value={{ toggle }}>
    <div className="min-h-screen bg-background text-foreground">
      {/* hero */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-rose-900/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex items-end justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Art Lab</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Ceramics · Mixed Media · Workshops</p>
          </div>
          <DarkToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Tabs tabs={tabs} />
      </main>

      <footer className="border-t border-border mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* newsletter */}
          <div className="max-w-md">
            <h3 className="font-semibold text-sm">Stay in the loop</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-3">New work, upcoming shows, workshop dates. No spam.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="sm">Subscribe</Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground pt-4 border-t border-border">
            <p>© 2026 Art Lab. Made with clay and code.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
              <a href="mailto:hello@artlab.studio" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </DarkModeCtx.Provider>
  );
}

export default App;

/* ── dark toggle button ───────────────────────────────────── */
function DarkToggle() {
  const { toggle } = useContext(DarkModeCtx);
  return (
    <button
      onClick={toggle}
      className="size-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      aria-label="Toggle dark mode"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    </button>
  );
}
