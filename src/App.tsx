import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card";
import "./index.css";

/* ── tiny hash router ─────────────────────────────────────── */
function useHashRoute() {
  const read = () => {
    const hash = window.location.hash.replace(/^#\/?/, "");
    return hash.split("/").filter(Boolean);
  };
  const [parts, setParts] = useState<string[]>(read);
  useEffect(() => {
    const onChange = () => setParts(read());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return parts;
}

function useScrollTop(parts: string[]) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [parts.join("/")]);
}

const meta = {
  code: "OC2.101 Arts 1 (H1)",
  institute: "IIIT Hyderabad",
  subtitle: "Imagination · Aesthetic Sensibility · Art as Knowledge",
  coordinator: "Saroja T K",
  credits: "2-0-0-2",
  syllabus: "https://intranet.iiit.ac.in/offices/static/files/Courses-Syllabus_M26-V3.pdf.pdf",
  offerings: "https://intranet.iiit.ac.in/offices/static/files/CourseOfferings-M26-V7.pdf",
  academic: "https://intranet.iiit.ac.in/offices/default/offices_x?office=Academic+Office",
};

/* ══════════════════════════════════════════════════════════════
   COURSE DATA — from the IIIT-H intranet syllabus (V3, pp.28-30)
   Students choose ONE unit and work in it all semester.
   ══════════════════════════════════════════════════════════════ */

interface Unit {
  id: string;
  unit: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  description: string;
  keyConcepts: string[];
  detail: string;
  works: ArtItem[];
}

interface ArtItem {
  title: string;
  medium: string;
  when: string;
  where: string;
  note: string;
}

const units: Unit[] = [
  {
    id: "music",
    unit: "Unit 1",
    title: "Raga & Rhythm",
    subtitle: "Music",
    icon: "♪",
    gradient: "linear-gradient(135deg, #b8860b, #d4a574)",
    description:
      "Understanding the nuances of sound and timing — the basic concepts of any system of music in the world. Students learn songs, melodic exercises, and rhythmic exercises with a focus on Indian music concepts.",
    keyConcepts: ["Raga", "Tala", "Melodic exercises", "Rhythmic patterns"],
    detail:
      "The unique concepts of Indian music — raga and tala — are introduced to realise the depth of this system and its connections to various branches of study. Through demonstrations, audio, and videos of acclaimed artists, students develop artistic sensibilities, creativity, and discipline.",
    works: [
      { title: "Raag Yaman — alaap", medium: "Vocal", when: "2024", where: "Studio", note: "Opening alaap exploring the vadi-samvadi of Yaman." },
      { title: "Tala practice", medium: "Rhythm", when: "2024", where: "Studio", note: "Counting and clapping cycles of jhaptal and rupak." },
      { title: "Student composition", medium: "Composition", when: "2023", where: "Studio", note: "A short original melody set to a chosen tala." },
    ],
  },
  {
    id: "painting",
    unit: "Unit 2",
    title: "Painting",
    subtitle: "Drawing & Colour",
    icon: "✎",
    gradient: "linear-gradient(135deg, #2d5a27, #6b8f3c)",
    description:
      "Expressing ideas and feelings through lines and colours. Basic drawing and painting skills are taught in class, with tasks including storytelling, creating logos, symbols, and portraiture.",
    keyConcepts: ["Drawing", "Colour theory", "Storytelling", "Portraiture", "Visual thinking"],
    detail:
      "Students understand different ways of visual thinking through hands-on tasks. The focus is not on technical perfection but on developing the ability to communicate visually and express personal perspectives.",
    works: [
      { title: "Visual story — street", medium: "Mixed media", when: "2024", where: "Studio", note: "A narrative built from observations of street life." },
      { title: "Logo — club", medium: "Ink", when: "2024", where: "Studio", note: "Symbol design for a campus club identity." },
      { title: "Portrait — charcoal", medium: "Charcoal", when: "2023", where: "Studio", note: "Tonality study from a live model." },
    ],
  },
  {
    id: "dance",
    unit: "Unit 3",
    title: "Dance",
    subtitle: "Movement & Expression",
    icon: "❦",
    gradient: "linear-gradient(135deg, #8e44ad, #c39bd3)",
    description:
      "The significance of dance and the training involved in performing dance movements — basic stretches and fundamental movements of various Indian dance forms.",
    keyConcepts: ["Indian dance forms", "Basic stretches", "Movement composition", "Cultural significance"],
    detail:
      "Students learn about various dance forms of India and their significance in the past and present. They compose movements and create their individual units of movement. Evaluation is based on participation, not dancing skill.",
    works: [
      { title: "Adavu — aramandi", medium: "Bharatanatyam", when: "2024", where: "Studio", note: "Foundation footwork and posture of the first adavu." },
      { title: "60s phrase", medium: "Composition", when: "2024", where: "Studio", note: "A 60-second movement phrase built from taught units." },
      { title: "Folk note", medium: "Study", when: "2023", where: "Studio", note: "Notes and gestures drawn from a regional folk form." },
    ],
  },
  {
    id: "sculpture",
    unit: "Unit 4",
    title: "Sculpture",
    subtitle: "3D Form & Clay",
    icon: "◉",
    gradient: "linear-gradient(135deg, #2c3e50, #4ca1af)",
    description:
      "Understanding three-dimensional form and creativity. Clay modelling for self-expression and connecting to nature through the texture of clay.",
    keyConcepts: ["Clay modelling", "3D form", "Natural materials", "Texture"],
    detail:
      "Students get a personal experience of the texture of clay — an important part of understanding nature. They learn how to use different materials to make art, developing self-expression and creativity through hands-on sculptural work.",
    works: [
      { title: "Pinch pot", medium: "Clay", when: "2024", where: "Studio", note: "First encounter with form from a single ball of clay." },
      { title: "Coil vessel", medium: "Clay", when: "2024", where: "Studio", note: "Building height and rhythm with coiled walls." },
      { title: "Texture — leaves", medium: "Relief", when: "2023", where: "Studio", note: "Pressing natural textures into a clay slab." },
    ],
  },
  {
    id: "collage",
    unit: "Unit 5",
    title: "Collage",
    subtitle: "Mixed Media & Commentary",
    icon: "◫",
    gradient: "linear-gradient(135deg, #d35400, #e67e22)",
    description:
      "Assembling images from magazines, newspapers, photographs, maps, and diagrams by cutting, pasting, painting, or drawing to create unique compositions.",
    keyConcepts: ["Mixed media", "Visual commentary", "Selection & composition", "Social themes"],
    detail:
      "Artists have manipulated mass-produced images to comment on body images, beauty standards, gender stereotypes, consumerism, and racism. Students learn to express ideas through selection, deduction, and addition — equipping them with visual tools to explore this medium.",
    works: [
      { title: "Consumer — cut & paste", medium: "Collage", when: "2024", where: "Studio", note: "Deconstructing advertisements into a new statement." },
      { title: "Gender — maps", medium: "Collage", when: "2024", where: "Studio", note: "Re-mapping place through gendered imagery." },
      { title: "City — newspaper", medium: "Collage", when: "2023", where: "Studio", note: "Building an urban texture from newsprint." },
    ],
  },
];

const courseOutcomes = [
  { code: "CO-1", text: "Understand and appreciate art in a deeper sense, and realise the importance of art" },
  { code: "CO-2", text: "Enhance imagination and aesthetic sensibility" },
  { code: "CO-3", text: "Impart humanities and artistic skills" },
  { code: "CO-4", text: "Understand art as a system of knowledge" },
  { code: "CO-5", text: "Understand the effectiveness of informed art practice" },
];

/* ── dark mode ────────────────────────────────────────────── */
const DarkModeCtx = createContext({ dark: false, toggle: () => {} });

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}

/* ── lightbox with keyboard nav ───────────────────────────── */
function Lightbox({ items, index, onClose }: { items: ArtItem[]; index: number; onClose: () => void }) {
  const [i, setI] = useState(index);
  const item = items[i] ?? items[0]!;

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
      role="dialog"
      aria-modal="true"
    >
      <div
        className="lightbox-panel relative bg-card text-card-foreground rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 size-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center text-lg hover:bg-black/60 transition-colors"
          aria-label="Close"
        >
          ×
        </button>
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

        <div className="aspect-[16/10] rounded-t-2xl flex flex-col items-center justify-center gap-2 text-white relative">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #5b3a2e, #c45a2a)" }} />
          <span className="relative text-4xl font-display font-light">✦</span>
          <span className="relative text-sm font-medium tracking-wide uppercase">{item.title}</span>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-display font-semibold tracking-tight">{item.title}</h2>
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full shrink-0">
              {i + 1} / {items.length}
            </span>
          </div>

          <p className="text-sm text-primary font-medium">{item.medium}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">When</span>
              <p className="font-medium mt-0.5">{item.when}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Where</span>
              <p className="font-medium mt-0.5">{item.where}</p>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <span className="text-muted-foreground text-sm">Note</span>
            <p className="text-sm mt-1.5 leading-relaxed">{item.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── art grid with lightbox ───────────────────────────────── */
function ArtGrid({ items }: { items: ArtItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        {items.map((item, i) => (
          <button
            key={item.title}
            onClick={() => setOpenIndex(i)}
            className="text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
          >
            <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
              <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105" style={{ background: "linear-gradient(135deg, #5b3a2e, #c45a2a)" }} />
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110">✦</span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end p-3">
                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  View →
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 px-1 line-clamp-2">{item.title}</p>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5 px-1">{item.when} · {item.medium}</p>
          </button>
        ))}
      </div>
      {openIndex !== null && <Lightbox items={items} index={openIndex} onClose={() => setOpenIndex(null)} />}
    </>
  );
}

/* ── tab content ──────────────────────────────────────────── */
const Overview = () => (
  <div className="space-y-6">
    <Card className="overflow-hidden">
      <div className="aspect-[3/1] relative flex items-center justify-center">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #5b3a2e, #c45a2a, #8e44ad)" }} />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative text-center text-white px-4">
          <p className="text-xs tracking-widest uppercase opacity-80">{meta.institute}</p>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold mt-1">{meta.code}</h2>
          <p className="text-sm opacity-80 mt-1">Institute Elective · {meta.credits} · Coordinator: {meta.coordinator}</p>
        </div>
      </div>
      <CardContent className="pt-6 space-y-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          The course is on imagination, aesthetic sensibility, goodness in life, and improving humanities skills.
          It does not focus on creating artists — the end form is secondary, while the means to achieve is primary.
          Students choose one art unit at the start of the semester and work exclusively in that discipline.
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-base font-display">Course Outcomes</CardTitle>
        <CardDescription>What the course is designed to develop</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {courseOutcomes.map((co) => (
            <div key={co.code} className="flex gap-3 items-start">
              <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded shrink-0 mt-0.5">{co.code}</span>
              <p className="text-sm text-muted-foreground">{co.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-base font-display">Assessment</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>
          2-credit course. Semester evaluations are based on the{" "}
          <strong className="text-foreground">participation of students in the sessions</strong>.
        </p>
      </CardContent>
    </Card>
  </div>
);

const Units = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Choose one unit for the semester — you'll work exclusively in that discipline.</p>
    {units.map((u) => (
      <Card key={u.id} className="overflow-hidden">
        <div className="flex">
          <div className="w-2 shrink-0" style={{ background: u.gradient }} />
          <div className="flex-1 p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg">{u.icon}</span>
              <div>
                <CardTitle className="text-sm font-display">{u.title}</CardTitle>
                <CardDescription>{u.subtitle} · {u.unit}</CardDescription>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{u.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {u.keyConcepts.map((k) => (
                <span key={k} className="text-[10px] bg-muted px-2 py-0.5 rounded-full">{k}</span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

const UnitDetail = ({ unit }: { unit: Unit }) => (
  <div className="space-y-6">
    <Card className="overflow-hidden">
      <div className="aspect-[3/1] relative flex items-center justify-center">
        <div className="absolute inset-0" style={{ background: unit.gradient }} />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative text-center text-white px-4">
          <span className="text-4xl block">{unit.icon}</span>
          <h2 className="text-xl sm:text-2xl font-display font-semibold mt-2">{unit.title}</h2>
          <p className="text-sm opacity-80 mt-1">{unit.subtitle} · {unit.unit}</p>
        </div>
      </div>
      <CardContent className="pt-6 space-y-5">
        <p className="text-sm leading-relaxed">{unit.description}</p>
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Key Concepts</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {unit.keyConcepts.map((k) => (
              <span key={k} className="text-xs bg-muted px-2.5 py-1 rounded-full">{k}</span>
            ))}
          </div>
        </div>
        <div className="border-t border-border pt-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{unit.detail}</p>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-base font-display">{unit.title} — Gallery</CardTitle>
        <CardDescription>Works from this unit · click any piece for details</CardDescription>
      </CardHeader>
      <CardContent>
        <ArtGrid items={unit.works} />
      </CardContent>
    </Card>
  </div>
);

const Gallery = () => (
  <div className="space-y-8">
    <p className="text-sm text-muted-foreground">Selected works from each unit. Click any piece for details.</p>
    {units.map((u) => (
      <div key={u.id} className="space-y-3">
        <div className="flex items-center gap-2">
          <span>{u.icon}</span>
          <h3 className="text-sm font-display font-semibold">{u.title}</h3>
          <span className="text-xs text-muted-foreground">· {u.unit}</span>
        </div>
        <ArtGrid items={u.works} />
      </div>
    ))}
  </div>
);

const Resources = () => (
  <div className="space-y-4">
    <Card>
      <CardHeader><CardTitle className="text-base font-display">Recommended Reading</CardTitle></CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        <p>• <em>The Art of Indian Culture</em> — Brijendra Kumar</p>
        <p>• <em>Indian Music</em> — P. Sambamurthy</p>
        <p>• <em>History of Indian Art</em> — Parul Dave Mukherji</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle className="text-base font-display">Materials</CardTitle></CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        <p>• Drawing notebook (A4), pencils (HB–6B), eraser, sharpener</p>
        <p>• Watercolour set, brushes (round + flat), mixing palette</p>
        <p>• Air-dry clay (provided in studio), modelling tools</p>
        <p>• Old magazines/newspapers for collage work</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle className="text-base font-display">Useful Links</CardTitle></CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        <p>• <a href={meta.academic} className="text-primary hover:underline" target="_blank" rel="noreferrer">IIIT-H Academic Office</a></p>
        <p>• <a href={meta.syllabus} className="text-primary hover:underline" target="_blank" rel="noreferrer">Monsoon 2026 Syllabus (PDF)</a></p>
        <p>• <a href={meta.offerings} className="text-primary hover:underline" target="_blank" rel="noreferrer">Course Offerings (PDF)</a></p>
      </CardContent>
    </Card>
  </div>
);

/* ── routes ───────────────────────────────────────────────── */
const routes = [
  { id: "overview", label: "Overview", page: <Overview /> },
  { id: "units", label: "Units", page: <Units /> },
  ...units.map((u) => ({ id: u.id, label: u.title, page: <UnitDetail unit={u} /> })),
  { id: "gallery", label: "Gallery", page: <Gallery /> },
  { id: "resources", label: "Resources", page: <Resources /> },
];

function resolve(parts: string[]) {
  const id = parts[0] ?? "overview";
  return routes.find((r) => r.id === id) ?? routes[0]!;
}

/* ── app ──────────────────────────────────────────────────── */
export function App() {
  const { dark, toggle } = useDarkMode();
  const parts = useHashRoute();
  const active = resolve(parts);
  useScrollTop(parts);

  return (
    <DarkModeCtx.Provider value={{ dark, toggle }}>
      <div className="min-h-screen bg-background text-foreground">
        <header className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(197,90,42,0.12), rgba(255,248,239,0), rgba(142,68,173,0.10))" }} />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">{meta.institute}</p>
              <h1 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight">
                <a href="#/" className="hover:opacity-80 transition-opacity">{meta.code}</a>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">{meta.subtitle}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">{meta.credits}</span>
                <span className="text-[10px] font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Coordinator: {meta.coordinator}</span>
                <a
                  href={meta.syllabus}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-mono text-primary hover:underline underline-offset-2 px-2 py-0.5"
                >
                  Syllabus ↗
                </a>
              </div>
            </div>
            <DarkToggle />
          </div>
        </header>

        <Nav activeId={active.id} />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div key={active.id} className="animate-[slide-up_0.35s_ease-out]">
            {active.page}
          </div>
        </main>

        <footer className="border-t border-border mt-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
              <div className="space-y-2">
                <h3 className="font-display font-semibold text-sm">{meta.code}</h3>
                <p className="text-xs text-muted-foreground">Faculty Coordinator: {meta.coordinator}</p>
                <p className="text-xs text-muted-foreground">Five units · choose one for the semester</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-semibold text-sm">Contact</h3>
                <p className="text-xs text-muted-foreground">{meta.institute}, Gachibowli</p>
                <p className="text-xs text-muted-foreground">
                  <a href="https://intranet.iiit.ac.in" className="text-primary hover:underline" target="_blank" rel="noreferrer">intranet.iiit.ac.in</a>
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground pt-4 border-t border-border">
              <p>© 2026 {meta.institute}. {meta.code} · Unofficial creative site.</p>
              <div className="flex gap-4">
                <a href="https://iiit.ac.in" className="hover:text-foreground transition-colors" target="_blank" rel="noreferrer">IIIT-H</a>
                <a href="https://intranet.iiit.ac.in" className="hover:text-foreground transition-colors" target="_blank" rel="noreferrer">Intranet</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </DarkModeCtx.Provider>
  );
}

export default App;

/* ── nav ──────────────────────────────────────────────────── */
function Nav({ activeId }: { activeId: string }) {
  return (
    <div className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-[12px] supports-[backdrop-filter]:bg-background/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex gap-1.5 overflow-x-auto scrollbar-none sm:flex-wrap">
        {routes.map((r) => {
          const isActive = activeId === r.id;
          return (
            <a
              key={r.id}
              href={`#/${r.id}`}
              aria-current={isActive ? "page" : undefined}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap shrink-0 transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {r.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ── dark toggle ──────────────────────────────────────────── */
function DarkToggle() {
  const { dark, toggle } = useContext(DarkModeCtx);
  return (
    <button
      onClick={toggle}
      className="size-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
