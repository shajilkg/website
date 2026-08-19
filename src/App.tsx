import { useState, useEffect, useCallback, createContext, useContext } from "react";
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
        <button onClick={onClose} className="absolute top-4 right-4 z-10 size-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center text-lg hover:bg-black/60 transition-colors" aria-label="Close">×</button>
        <button onClick={prev} className="absolute left-3 top-1/3 z-10 size-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors" aria-label="Previous">‹</button>
        <button onClick={next} className="absolute right-3 top-1/3 z-10 size-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors" aria-label="Next">›</button>
        <div className="aspect-[16/10] rounded-t-2xl flex items-center justify-center text-xl font-medium text-white/80" style={{ background: item.gradient }}>{item.title}</div>
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-bold">{item.title}</h2>
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full shrink-0">{i + 1} / {items.length}</span>
          </div>
          {item.medium && <p className="text-sm text-primary font-medium">{item.medium}</p>}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">When</span><p className="font-medium mt-0.5">{item.date}</p></div>
            <div><span className="text-muted-foreground">Where</span><p className="font-medium mt-0.5">{item.location}</p></div>
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

/* ── art grid ─────────────────────────────────────────────── */
function ArtGrid({ items }: { items: ArtItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        {items.map((item, i) => (
          <button key={item.title} onClick={() => setOpenIndex(i)} className="text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <div className="relative overflow-hidden rounded-xl">
              <div className="aspect-[4/3] flex items-center justify-center text-sm font-medium text-white/80 transition-transform duration-300 group-hover:scale-105" style={{ background: item.gradient }}>{item.title}</div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end p-3">
                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">View Details →</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 px-1">{item.title}</p>
          </button>
        ))}
      </div>
      {openIndex !== null && <Lightbox items={items} index={openIndex} onClose={() => setOpenIndex(null)} />}
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

/* ══════════════════════════════════════════════════════════════
   COURSE DATA — from IIIT-H intranet syllabus
   Arts Course | Monsoon 2026 | Faculty: Saroja T K
   Students choose ONE track and work in it all semester.
   ══════════════════════════════════════════════════════════════ */

const tracks = [
  {
    id: "music",
    title: "Raga & Rhythm",
    subtitle: "Music",
    icon: "♪",
    gradient: "linear-gradient(135deg, #b8860b, #d4a574)",
    description: "Understanding the nuances of sound and timing — the basic concepts of any system of music in the world. Students learn different songs, melodic exercises, and rhythmic exercises with a focus on Indian music concepts.",
    keyConcepts: ["Raga", "Tala", "Melodic exercises", "Rhythmic patterns"],
    detail: "The unique concepts of Indian music — raga and tala — are introduced to realize the depth of this system and its connections to various branches of study. Through personal demonstrations, audio, and videos of acclaimed artists, students develop artistic sensibilities, creativity, and discipline.",
  },
  {
    id: "painting",
    title: "Painting",
    subtitle: "Drawing & Color",
    icon: "✎",
    gradient: "linear-gradient(135deg, #2d5a27, #6b8f3c)",
    description: "Expressing ideas and feelings through lines and colors. Basic drawing and painting skills taught in class, with tasks including oral and visual storytelling, creating logos, symbols, and portraiture.",
    keyConcepts: ["Drawing", "Color theory", "Storytelling", "Portraiture", "Visual thinking"],
    detail: "Students understand different ways of visual thinking through hands-on tasks. The focus is not on technical perfection but on developing the ability to communicate visually and express personal perspectives.",
  },
  {
    id: "dance",
    title: "Dance",
    subtitle: "Movement & Expression",
    icon: "❦",
    gradient: "linear-gradient(135deg, #8e44ad, #c39bd3)",
    description: "The significance of dance and the training involved to perform dance movements. Basic stretches and fundamental movements of various Indian dance forms.",
    keyConcepts: ["Indian dance forms", "Basic stretches", "Movement composition", "Cultural significance"],
    detail: "Students learn about various dance forms of India and their significance in the past and present. They compose movements and create their individual units of movement. Evaluation is based on participation, not dancing skills.",
  },
  {
    id: "sculpture",
    title: "Sculpture",
    subtitle: "3D Form & Clay",
    icon: "◉",
    gradient: "linear-gradient(135deg, #2c3e50, #4ca1af)",
    description: "Understanding three-dimensional form and creativity. Clay modelling for self-expression and connecting to nature through the texture of clay.",
    keyConcepts: ["Clay modelling", "3D form", "Natural materials", "Texture"],
    detail: "Students get a personal experience of the texture of clay — an important part of understanding nature. They learn how to use different materials to make art, developing self-expression and creativity through hands-on sculptural work.",
  },
  {
    id: "collage",
    title: "Collage",
    subtitle: "Mixed Media & Commentary",
    icon: "◫",
    gradient: "linear-gradient(135deg, #d35400, #e67e22)",
    description: "Assembling images from magazines, newspapers, photographs, maps, and diagrams by cutting, pasting, painting, or drawing to create unique compositions.",
    keyConcepts: ["Mixed media", "Visual commentary", "Selection & composition", "Social themes"],
    detail: "Artists have manipulated mass-produced images to comment on body images, beauty standards, gender stereotypes, consumerism, and racism. Students learn to express ideas through the process of selection, deduction, and addition — equipping them with visual tools to explore this medium.",
  },
];

const courseOutcomes = [
  { code: "CO-1", text: "Understand and appreciate art in a deeper sense, and realize the importance of Art" },
  { code: "CO-2", text: "Enhance imagination and aesthetic sensibility" },
  { code: "CO-3", text: "Impart humanities and artistic skills" },
  { code: "CO-4", text: "Understand Art as a system of knowledge" },
  { code: "CO-5", text: "Understand the effectiveness of informed Art practice" },
];

/* ── tab content ──────────────────────────────────────────── */
const Overview = () => (
  <div className="space-y-6">
    {/* course hero */}
    <Card className="overflow-hidden">
        <div className="aspect-[3/1] bg-gradient-to-r from-amber-900 via-rose-800 to-purple-900 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative text-center text-white">
          <p className="text-xs tracking-widest uppercase opacity-70">IIIT Hyderabad</p>
          <h2 className="text-2xl sm:text-3xl font-bold mt-1">Arts Course</h2>
        </div>
      </div>
      <CardContent className="pt-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div><span className="text-muted-foreground">Faculty</span><p className="font-medium mt-0.5">Saroja T K (Coordinator)</p></div>
          <div><span className="text-muted-foreground">Institute Elective</span><p className="font-medium mt-0.5">Open to all programmes</p></div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The course is on imagination, aesthetic sensibility, goodness in life, and improving humanities skills.
          It does not focus on creating artists — the end form is secondary, while the means to achieve is primary.
          Students choose one art track at the start of the semester and work exclusively in that discipline.
        </p>
      </CardContent>
    </Card>

    {/* COs */}
    <Card>
      <CardHeader><CardTitle className="text-base">Course Outcomes</CardTitle></CardHeader>
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

    {/* assessment */}
    <Card>
      <CardHeader><CardTitle className="text-base">Assessment</CardTitle></CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>2-credit course. Semester evaluations are based on the <strong className="text-foreground">participation of students in the sessions</strong>.</p>
      </CardContent>
    </Card>
  </div>
);

const TrackDetail = ({ track }: { track: typeof tracks[number] }) => (
  <div className="space-y-6">
    <Card className="overflow-hidden">
      <div className="aspect-[3/1] flex items-center justify-center relative" style={{ background: track.gradient }}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative text-center text-white">
          <span className="text-4xl">{track.icon}</span>
          <h2 className="text-xl sm:text-2xl font-bold mt-2">{track.title}</h2>
          <p className="text-sm opacity-80 mt-1">{track.subtitle}</p>
        </div>
      </div>
      <CardContent className="pt-6 space-y-4">
        <p className="text-sm leading-relaxed">{track.description}</p>
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Key Concepts</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {track.keyConcepts.map((k) => (
              <span key={k} className="text-xs bg-muted px-2.5 py-1 rounded-full">{k}</span>
            ))}
          </div>
        </div>
        <div className="border-t border-border pt-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{track.detail}</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const Tracks = () => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Choose one track for the semester. You'll work exclusively in that discipline.</p>
    {tracks.map((t) => (
      <Card key={t.id} className="overflow-hidden">
        <div className="flex">
          <div className="w-2 shrink-0" style={{ background: t.gradient }} />
          <div className="flex-1 p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg">{t.icon}</span>
              <div>
                <CardTitle className="text-sm">{t.title}</CardTitle>
                <CardDescription>{t.subtitle}</CardDescription>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {t.keyConcepts.map((k) => (
                <span key={k} className="text-[10px] bg-muted px-2 py-0.5 rounded-full">{k}</span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

const Gallery = () => (
  <div className="space-y-6">
    <p className="text-sm text-muted-foreground">Student work from each track. Click any piece for details.</p>
    {tracks.map((t) => (
      <div key={t.id} className="space-y-3">
        <div className="flex items-center gap-2">
          <span>{t.icon}</span>
          <h3 className="text-sm font-medium">{t.title}</h3>
        </div>
        <ArtGrid
          items={[
            { title: `${t.title} — Study I`, gradient: t.gradient, date: "Week 3", location: "Studio", motivation: `Exploring the fundamentals of ${t.subtitle.toLowerCase()} through guided exercises.`, medium: "Mixed media" },
            { title: `${t.title} — Study II`, gradient: t.gradient.replace("135deg", "225deg"), date: "Week 7", location: "Studio", motivation: `Developing personal expression within ${t.subtitle.toLowerCase()} — moving beyond technique to intent.`, medium: "Studio work" },
          ]}
        />
      </div>
    ))}
  </div>
);

const Resources = () => (
  <div className="space-y-4">
    <Card>
      <CardHeader><CardTitle className="text-base">Recommended Reading</CardTitle></CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        <p>• <em>The Art of Indian Culture</em> — Brijendra Kumar</p>
        <p>• <em>Indian Music</em> — P. Sambamurthy</p>
        <p>• <em>History of Indian Art</em> — Parul Dave Mukherji</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle className="text-base">Materials Needed</CardTitle></CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        <p>• Drawing notebook (A4), pencils (HB–6B), eraser, sharpener</p>
        <p>• Watercolor set, brushes (round + flat), mixing palette</p>
        <p>• Air-dry clay (provided in studio), modelling tools</p>
        <p>• Old magazines/newspapers for collage work</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle className="text-base">Useful Links</CardTitle></CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        <p>• <a href="https://intranet.iiit.ac.in/offices/default/offices_x?office=Academic+Office" className="text-primary hover:underline" target="_blank">IIIT-H Academic Office</a></p>
        <p>• <a href="https://intranet.iiit.ac.in/offices/static/files/Courses-Syllabus_M26-V3.pdf.pdf" className="text-primary hover:underline" target="_blank">Monsoon 2026 Syllabus (PDF)</a></p>
        <p>• <a href="https://intranet.iiit.ac.in/offices/static/files/CourseOfferings-M26-V7.pdf" className="text-primary hover:underline" target="_blank">Course Offerings (PDF)</a></p>
      </CardContent>
    </Card>
  </div>
);

/* ── app ──────────────────────────────────────────────────── */
const tabs = [
  { id: "overview", label: "Overview", content: <Overview /> },
  { id: "tracks", label: "Tracks", content: <Tracks /> },
  { id: "music", label: "Music", content: <TrackDetail track={tracks[0]} /> },
  { id: "painting", label: "Painting", content: <TrackDetail track={tracks[1]} /> },
  { id: "dance", label: "Dance", content: <TrackDetail track={tracks[2]} /> },
  { id: "sculpture", label: "Sculpture", content: <TrackDetail track={tracks[3]} /> },
  { id: "collage", label: "Collage", content: <TrackDetail track={tracks[4]} /> },
  { id: "gallery", label: "Gallery", content: <Gallery /> },
  { id: "resources", label: "Resources", content: <Resources /> },
];

export function App() {
  const { toggle } = useDarkMode();

  return (
    <DarkModeCtx.Provider value={{ toggle }}>
    <div className="min-h-screen bg-background text-foreground">
      {/* hero */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-purple-900/10" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex items-end justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">IIIT Hyderabad</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Arts Course</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Imagination · Aesthetic Sensibility · Art as Knowledge</p>
          </div>
          <DarkToggle />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Tabs tabs={tabs} />
      </main>

      <footer className="border-t border-border mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Arts Course</h3>
              <p className="text-xs text-muted-foreground">Faculty Coordinator: Saroja T K</p>
              <p className="text-xs text-muted-foreground">Indranil Chakrabarty · Saurabh Todariya</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Contact</h3>
              <p className="text-xs text-muted-foreground">IIIT Hyderabad, Gachibowli</p>
              <p className="text-xs text-muted-foreground"><a href="https://intranet.iiit.ac.in" className="text-primary hover:underline" target="_blank">intranet.iiit.ac.in</a></p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground pt-4 border-t border-border">
            <p>© 2026 IIIT Hyderabad. Arts Course.</p>
            <div className="flex gap-4">
              <a href="https://iiit.ac.in" className="hover:text-foreground transition-colors" target="_blank">IIIT-H</a>
              <a href="https://intranet.iiit.ac.in" className="hover:text-foreground transition-colors" target="_blank">Intranet</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </DarkModeCtx.Provider>
  );
}

export default App;

/* ── dark toggle ──────────────────────────────────────────── */
function DarkToggle() {
  const { toggle } = useContext(DarkModeCtx);
  return (
    <button onClick={toggle} className="size-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Toggle dark mode">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    </button>
  );
}
