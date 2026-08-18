import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { Tabs } from "./components/Tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card";
import { Button } from "./components/ui/button";
import "./index.css";

/* ── types ────────────────────────────────────────────────── */
interface ArtItem {
  title: string;
  color: string;
  date: string;
  location: string;
  motivation: string;
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

/* ── lightbox ─────────────────────────────────────────────── */
function Lightbox({ item, onClose }: { item: ArtItem; onClose: () => void }) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <div
      className="lightbox-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="lightbox-panel relative bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 size-8 rounded-full bg-black/50 text-white flex items-center justify-center text-lg hover:bg-black/70 transition-colors"
          aria-label="Close"
        >
          ×
        </button>

        {/* image */}
        <div
          className="aspect-[4/3] rounded-t-xl flex items-center justify-center text-lg font-medium text-white/80"
          style={{ background: item.color }}
        >
          {item.title}
        </div>

        {/* details */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold">{item.title}</h2>
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
          <div>
            <span className="text-muted-foreground text-sm">Motivation</span>
            <p className="text-sm mt-1 leading-relaxed">{item.motivation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── image grid (reusable) ────────────────────────────────── */
function ArtGrid({ items }: { items: ArtItem[] }) {
  const [selected, setSelected] = useState<ArtItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <button
            key={item.title}
            onClick={() => setSelected(item)}
            className="text-left space-y-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <div
              className="aspect-[4/3] rounded-lg flex items-center justify-center text-sm font-medium text-white/80 transition-transform duration-200 group-hover:scale-[1.03] group-active:scale-[0.98]"
              style={{ background: item.color }}
            >
              {item.title}
            </div>
            <p className="text-xs text-muted-foreground text-center">{item.title}</p>
          </button>
        ))}
      </div>
      {selected && <Lightbox item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

/* ── tab content ──────────────────────────────────────────── */
const Blog = () => (
  <div className="space-y-5">
    {[
      {
        title: "New Clay Series Finished",
        date: "Aug 12, 2026",
        desc: "Exploring organic forms in stoneware. Twelve pieces, each thrown then altered by hand — no two alike.",
        color: "hsl(30, 35%, 50%)",
      },
      {
        title: "Studio Update — Summer",
        date: "Jul 28, 2026",
        desc: "New kiln arrived last week. First bisque firing went smoothly. Adjusting the schedule for a slower cool to reduce thermal shock.",
        color: "hsl(200, 30%, 45%)",
      },
      {
        title: "Exhibition at Lakewood Gallery",
        date: "Jun 5, 2026",
        desc: "Three pieces selected for the summer group show. Opening night was packed — great conversations about material and process.",
        color: "hsl(150, 25%, 40%)",
      },
    ].map((post) => (
      <Card key={post.title} className="overflow-hidden">
        <div
          className="aspect-[3/1] w-full"
          style={{ background: post.color }}
        />
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{post.title}</CardTitle>
          <CardDescription>{post.date}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{post.desc}</p>
        </CardContent>
      </Card>
    ))}
  </div>
);

const ArtDisplay = () => (
  <ArtGrid
    items={[
      { title: "Untitled #1", color: "hsl(45, 45%, 55%)", date: "Mar 2026", location: "Home studio", motivation: "First experiment with warm earth tones. Wanted to see how ochre reads against a matte surface." },
      { title: "Untitled #2", color: "hsl(90, 45%, 55%)", date: "Apr 2026", location: "Home studio", motivation: "Exploring growth patterns in nature — spirals, branching, things that repeat without copying themselves." },
      { title: "Untitled #3", color: "hsl(135, 45%, 55%)", date: "May 2026", location: "Lakewood Gallery", motivation: "Commissioned for the spring group show. Tried to balance restraint with expression." },
      { title: "Untitled #4", color: "hsl(180, 45%, 55%)", date: "Jun 2026", location: "Home studio", motivation: "Water study — capturing movement in stillness. The glaze pools where the form dips." },
      { title: "Untitled #5", color: "hsl(225, 45%, 55%)", date: "Jul 2026", location: "Workshop", motivation: "Playing with negative space. The holes are the point — what you see through matters as much as the surface." },
      { title: "Untitled #6", color: "hsl(270, 45%, 55%)", date: "Aug 2026", location: "Home studio", motivation: "Late summer palette — cooler tones creeping in. A shift from the warmth of the earlier pieces." },
    ]}
  />
);

const Sculpture = () => (
  <ArtGrid
    items={[
      { title: "Vessel I", color: "hsl(210, 30%, 40%)", date: "Feb 2026", location: "Home studio", motivation: "Exploring organic forms in stoneware with ash glaze. The glaze reacts differently every firing — that unpredictability is the point." },
      { title: "Drift", color: "hsl(210, 35%, 45%)", date: "Apr 2026", location: "Foundry visit", motivation: "Bronze cast — capturing the feeling of things carried by water. Worked with a local foundry for the first time." },
      { title: "Core Sample", color: "hsl(210, 25%, 35%)", date: "Jun 2026", location: "Home studio", motivation: "Reclaimed wood and epoxy — layers as memory. Each ring is a decision, each pour a moment frozen." },
    ]}
  />
);

const Posters = () => (
  <ArtGrid
    items={[
      { title: "Winter Exhibition", color: "hsl(20, 50%, 45%)", date: "Jan 2026", location: "Lakewood Gallery", motivation: "Promotional poster for the winter exhibition. Minimal typography, let the ceramics speak." },
      { title: "Hand-Building Workshop", color: "hsl(100, 50%, 45%)", date: "Mar 2026", location: "Community center", motivation: "Flyer for the hand-building weekend workshop. Warm colors to match the hands-on vibe." },
      { title: "Open Studio Day", color: "hsl(180, 50%, 45%)", date: "May 2026", location: "Home studio", motivation: "Open studio invitation — clean, bold, no clutter. Let people know where to find us." },
      { title: "Annual Showcase", color: "hsl(260, 50%, 45%)", date: "Jul 2026", location: "City arts council", motivation: "Annual showcase poster — geometric clay motifs. The repeated forms echo the process of throwing." },
    ]}
  />
);

const Classes = () => (
  <div className="space-y-4">
    {[
      { name: "Wheel Throwing Basics", schedule: "Saturdays 10am–12pm", spots: 4, desc: "Learn centering, pulling walls, and basic forms. All materials included." },
      { name: "Hand-Building Workshop", schedule: "Wednesdays 6–8pm", spots: 6, desc: "Pinch, coil, and slab techniques. No wheel needed — just your hands and curiosity." },
      { name: "Advanced Glazing", schedule: "Sundays 2–5pm", spots: 2, desc: "Surface decoration, layering glazes, and kiln chemistry. Bring your own bisqueware." },
    ].map((c) => (
      <Card key={c.name}>
        <CardHeader>
          <CardTitle className="text-lg">{c.name}</CardTitle>
          <CardDescription>{c.schedule}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{c.desc}</p>
          <Button size="sm" className="shrink-0 ml-4">
            Sign Up
          </Button>
        </CardContent>
      </Card>
    ))}
  </div>
);

const About = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>About the Lab</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p className="leading-relaxed">
          A small ceramics and mixed-media studio focused on exploration over perfection.
          Founded in 2024, the lab is part workspace, part classroom — a place where
          process matters more than product.
        </p>
        <p className="leading-relaxed">
          We offer open workshops, occasional exhibitions, and classes for all levels.
          No fancy gallery politics — just good work made with care.
        </p>
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
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Art Lab</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Ceramics · Mixed Media · Workshops</p>
          </div>
          <DarkToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Tabs tabs={tabs} />
      </main>

      <footer className="border-t border-border mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 Art Lab. Made with clay and code.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
            <a href="#" className="hover:text-foreground transition-colors">Newsletter</a>
            <a href="mailto:hello@artlab.studio" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
    </DarkModeCtx.Provider>
  );
}

/* ── dark toggle button ───────────────────────────────────── */
function DarkToggle() {
  const { toggle } = useContext(DarkModeCtx);
  return (
    <button
      onClick={toggle}
      className="size-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      aria-label="Toggle dark mode"
    >
      <SunIcon />
    </button>
  );
}

/* inline sun/moon icons — no lucide dependency needed for two icons */
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

export default App;
