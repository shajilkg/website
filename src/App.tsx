import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card";
import "./index.css";

/* ── hash router + scroll ─────────────────────────────────── */
function useHashRoute() {
  const read = () => window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const [parts, setParts] = useState<string[]>(() => (typeof window !== "undefined" ? read() : []));
  useEffect(() => {
    const onChange = () => setParts(read());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return parts;
}
function useScrollTop(dep: string) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [dep]);
}

const meta = {
  code: "OC2.101 Arts 1 (H1)",
  institute: "IIIT Hyderabad",
  subtitle: "Imagination · Art · Knowledge",
  coordinator: "Saroja T K",
  credits: "2-0-0-2",
  syllabus: "https://intranet.iiit.ac.in/offices/static/files/Courses-Syllabus_M26-V3.pdf.pdf",
  offerings: "https://intranet.iiit.ac.in/offices/static/files/CourseOfferings-M26-V7.pdf",
  academic: "https://intranet.iiit.ac.in/offices/default/offices_x?office=Academic+Office",
};

interface Unit {
  id: string;
  unit: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  description: string;
  verbatim: string;
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
    icon: "fi fi-rr-music",
    gradient: "linear-gradient(135deg, #b8860b, #d4a574)",
    description: "Learn how sound and timing work in music. You'll practice songs, tunes, and beats, with a focus on Indian music.",
    verbatim: "This course emphasizes understanding the nuances of sound and timing, the basic concepts of any system of music in the world. The students are made to learn different songs, melodic exercises, and rhythmic exercises with a focus on concepts of Indian music and are exposed to the logical elements of the art form in general. The unique concepts of Indian music, raga and tala are introduced to them to make them realize the depth of this system of music and its connections to various branches of study. The introduction of these elements through personal demonstrations, presentation of audio, and videos of acclaimed artists, intends to attract their attention towards the artistic sensibilities, creativity, and discipline in life.",
    keyConcepts: ["Raga", "Tala", "Tune practice", "Rhythm practice"],
    detail: "You'll learn about raga (tune patterns) and tala (time cycles) and how they link to other subjects. Through live demos, recordings, and videos of great artists, you'll build creativity and focus.",
    works: [
      { title: "Raag Yaman — alaap", medium: "Vocal", when: "2024", where: "Studio", note: "Opening tune exploring the main notes of Yaman." },
      { title: "Tala practice", medium: "Rhythm", when: "2024", where: "Studio", note: "Counting and clapping common time cycles." },
      { title: "Student composition", medium: "Composition", when: "2023", where: "Studio", note: "A short original tune set to a chosen beat." },
    ],
  },
  {
    id: "painting",
    unit: "Unit 2",
    title: "Painting",
    subtitle: "Drawing and Color",
    icon: "fi fi-rr-palette",
    gradient: "linear-gradient(135deg, #2d5a27, #6b8f3c)",
    description: "Use lines and colors to share ideas and feelings. You'll learn basic drawing and painting by telling stories, making logos, symbols, and portraits.",
    verbatim: "The course's primary focus is to help students express their ideas and feelings through lines and colors. For this basic drawing and painting skills will be taught to the students in the class. The students will also be given different tasks like oral and visual storytelling, creating logos, symbols, and portraiture. Through these tasks, the student will understand different ways of visual thinking.",
    keyConcepts: ["Drawing", "Color", "Storytelling", "Portraits", "Visual thinking"],
    detail: "You'll try different ways of seeing and thinking with your hands. The goal is not perfect technique, but learning to show your ideas clearly.",
    works: [
      { title: "Visual story — street", medium: "Mixed media", when: "2024", where: "Studio", note: "A story built from watching street life." },
      { title: "Logo — club", medium: "Ink", when: "2024", where: "Studio", note: "Simple symbol for a campus club." },
      { title: "Portrait — charcoal", medium: "Charcoal", when: "2023", where: "Studio", note: "Shading study from a live model." },
    ],
  },
  {
    id: "dance",
    unit: "Unit 3",
    title: "Dance",
    subtitle: "Movement",
    icon: "fi fi-rr-ballet-dance",
    gradient: "linear-gradient(135deg, #8e44ad, #c39bd3)",
    description: "Learn why dance matters and how to train your body for it. You'll practice simple stretches and basic steps from Indian dance forms.",
    verbatim: "The course informs the students about the significance of dance, and the training involved to perform the dance movements. The course instructs about basic stretches and fundamental movements of the dance of various Indian dance forms. The knowledge about various dance forms of India and the significance of the dance forms in the past and present is discussed. The course helps the students to compose movements and dance their individual units of movements they create out of the instructions and assistance received. In the course, the emphasis point on evaluation is not based on the dancing skills of the students but on their participation in the session in progress.",
    keyConcepts: ["Indian dance", "Stretches", "Making phrases", "Culture"],
    detail: "You'll learn about different Indian dance forms and why they matter. You'll make your own short steps and phrases. You are graded on taking part, not on skill.",
    works: [
      { title: "Adavu — aramandi", medium: "Bharatanatyam", when: "2024", where: "Studio", note: "Basic footwork and stance." },
      { title: "60s phrase", medium: "Composition", when: "2024", where: "Studio", note: "A 60-second phrase built from taught steps." },
      { title: "Folk note", medium: "Study", when: "2023", where: "Studio", note: "Steps drawn from a local folk dance." },
    ],
  },
  {
    id: "sculpture",
    unit: "Unit 4",
    title: "Sculpture",
    subtitle: "Clay and Form",
    icon: "fi fi-rr-sculpture",
    gradient: "linear-gradient(135deg, #2c3e50, #4ca1af)",
    description: "Learn about 3D shape by making things with clay. Use your hands to express ideas and feel the material.",
    verbatim: "The course deals with understanding three-dimensional form and creativity. Clay modelling is a great activity that helps students develop in many ways, like self-expression and creativity. In this course, students are taught to make sculptures out of clay. Through this, I try to connect them to nature. The students get a personal experience of the texture of clay, which is an important part of understanding nature. In this course, they will learn how to use different materials to make art.",
    keyConcepts: ["Clay", "3D form", "Natural materials", "Texture"],
    detail: "You'll get to know clay by touch — a simple way to connect with natural material. You'll try different tools to make forms and find your own style.",
    works: [
      { title: "Pinch pot", medium: "Clay", when: "2024", where: "Studio", note: "First form made from one ball of clay." },
      { title: "Coil vessel", medium: "Clay", when: "2024", where: "Studio", note: "Building height with rolled coils." },
      { title: "Texture — leaves", medium: "Relief", when: "2023", where: "Studio", note: "Pressing leaf patterns into clay." },
    ],
  },
  {
    id: "collage",
    unit: "Unit 5",
    title: "Collage",
    subtitle: "Cut and Paste",
    icon: "fi fi-rr-layers",
    gradient: "linear-gradient(135deg, #d35400, #e67e22)",
    description: "Make new images by cutting and joining bits from magazines, papers, photos, and maps. You can also draw or paint on them.",
    verbatim: "Collage is not just a compilation of photos that we create to share on social media. It's an art form where one assembles images from a magazine or newspapers or photographic images, maps, diagrams by cutting pasting or painting or drawing over it to create a unique composition. Artists have manipulated mass produced images to comment on or question body images and narrow beauty standards, gender stereotypes, consumerism, racism and much more. The aim of this course is to equip students with visual tools to explore the possibility this medium offers through a set of exercises. Students will learn to express their ideas or imagination through the process of selection and deduction and addition.",
    keyConcepts: ["Cut and paste", "Visual notes", "Choosing and arranging", "Social topics"],
    detail: "Artists use cut photos to talk about beauty, gender, buying habits, and fairness. You'll learn to pick, remove, and add images to say what you mean.",
    works: [
      { title: "Consumer — cut & paste", medium: "Collage", when: "2024", where: "Studio", note: "Turning ads into a new message." },
      { title: "Gender — maps", medium: "Collage", when: "2024", where: "Studio", note: "Using maps to talk about gender and place." },
      { title: "City — newspaper", medium: "Collage", when: "2023", where: "Studio", note: "Building a city texture from newspaper." },
    ],
  },
];

const courseOutcomes = [
  { code: "CO-1", verbatim: "Understands and appreciate art in a deeper sense, and realize the importance of Art", plain: "Understand art better and see why it matters" },
  { code: "CO-2", verbatim: "Enhances Imagination and aesthetic sensibility", plain: "Grow your imagination and eye for beauty" },
  { code: "CO-3", verbatim: "Imparts humanities and artistic skills", plain: "Build skills in people and culture through art" },
  { code: "CO-4", verbatim: "Understands Art as a system of knowledge", plain: "See art as a way to learn and know" },
  { code: "CO-5", verbatim: "Understands the effectiveness of informed Art practice", plain: "Learn how careful, informed practice helps you do better" },
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

/* ── lightbox ─────────────────────────────────────────────── */
function Lightbox({
  items,
  index,
  onClose,
  gradient,
}: {
  items: ArtItem[];
  index: number;
  onClose: () => void;
  gradient?: string;
}) {
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
    <div className="lightbox-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-8" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lightbox-panel relative bg-card text-card-foreground rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 size-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center text-lg hover:bg-black/60 transition-colors" aria-label="Close">×</button>
        <button onClick={prev} className="absolute left-3 top-1/3 z-10 size-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors" aria-label="Previous">‹</button>
        <button onClick={next} className="absolute right-3 top-1/3 z-10 size-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors" aria-label="Next">›</button>
        <div className="aspect-[16/10] rounded-t-2xl flex flex-col items-center justify-center gap-2 text-white relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: gradient ?? "linear-gradient(135deg, #5b3a2e, #c45a2a)" }} />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, white, transparent 60%)" }} />
          <span className="relative text-4xl font-display font-light">✦</span>
          <span className="relative text-sm font-medium tracking-wide uppercase">{item.title}</span>
        </div>
        <div className="p-6 sm:p-8 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-display font-semibold tracking-tight">{item.title}</h2>
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full shrink-0">{i + 1} / {items.length}</span>
          </div>
          <p className="text-sm text-primary font-medium">{item.medium}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">When</span><p className="font-medium mt-0.5">{item.when}</p></div>
            <div><span className="text-muted-foreground">Where</span><p className="font-medium mt-0.5">{item.where}</p></div>
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

function ArtGrid({ items, gradient }: { items: ArtItem[]; gradient?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const g = gradient ?? "linear-gradient(135deg, #5b3a2e, #c45a2a)";
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        {items.map((item, i) => (
          <button key={item.title} onClick={() => setOpenIndex(i)} className="text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <div className="relative overflow-hidden rounded-xl aspect-[4/3] border border-border/40 duotone-hover">
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]" style={{ background: g }} />
              <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E")` }} />
              <div className="absolute inset-0 halftone text-white pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110 drop-shadow">✦</span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end p-3">
                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">View →</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 px-1 line-clamp-2">{item.title}</p>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5 px-1">{item.when} · {item.medium}</p>
          </button>
        ))}
      </div>
      {openIndex !== null && <Lightbox items={items} index={openIndex} onClose={() => setOpenIndex(null)} gradient={g} />}
    </>
  );
}

/* ── Hall-inspired extras ─────────────────────────────────── */
function DuotonePlate({ gradient, label, folio, caption }: { gradient: string; label: string; folio: string; caption: string }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card">
      <div className="aspect-[4/3] relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: gradient }} />
        <div className="absolute inset-0 opacity-[0.14] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        <div className="absolute inset-0 halftone text-white" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: "radial-gradient(380px 220px at 30% 20%, rgba(255,255,255,0.22), transparent 60%)" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/90 text-2xl font-display tracking-widest">— {label} —</span>
        </div>
        <span className="absolute top-2 left-2 text-[10px] font-mono bg-black/25 text-white backdrop-blur px-1.5 py-0.5 rounded-full border border-white/15">{folio}</span>
      </div>
      <div className="px-3 py-2 flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">{caption}</span>
        <span className="text-[10px] text-muted-foreground">85 lpi</span>
      </div>
    </div>
  );
}

function KaresansuiGarden() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const prongs = useRef(3);
  const [tool, setTool] = useState<3 | 5 | 1>(3);
  useEffect(() => { prongs.current = tool === 1 ? 1 : tool; }, [tool]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    // sand base #E8DCC8
    ctx.fillStyle = "#E8DCC8";
    ctx.fillRect(0, 0, rect.width, rect.height);
    // subtle grain
    ctx.fillStyle = "rgba(90,58,46,0.06)";
    for (let i = 0; i < 420; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      ctx.fillRect(x, y, 1, 1);
    }
    // pre-raked faint lines
    ctx.strokeStyle = "rgba(90,58,46,0.07)";
    ctx.lineWidth = 1;
    for (let y = 24; y < rect.height; y += 18) {
      ctx.beginPath();
      ctx.moveTo(8, y);
      ctx.lineTo(rect.width - 8, y + (Math.random() - 0.5) * 4);
      ctx.stroke();
    }
  }, []);

  const getPos = (e: React.PointerEvent) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const drawRake = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const perp = angle + Math.PI / 2;
    const count = prongs.current;
    const spacing = count === 5 ? 4 : 6;
    const offs = count === 1 ? [0] : count === 3 ? [-spacing, 0, spacing] : [-spacing * 2, -spacing, 0, spacing, spacing * 2];
    ctx.strokeStyle = tool === 1 ? "rgba(232,220,200,0.95)" : "rgba(90,58,46,0.18)";
    ctx.lineWidth = tool === 1 ? 10 : 1;
    ctx.lineCap = "round";
    offs.forEach((o) => {
      const ox = Math.cos(perp) * o;
      const oy = Math.sin(perp) * o;
      ctx.beginPath();
      ctx.moveTo(from.x + ox, from.y + oy);
      ctx.lineTo(to.x + ox, to.y + oy);
      ctx.stroke();
    });
    // ripple-like faint second pass for 5-prong
    if (count === 5) {
      ctx.strokeStyle = "rgba(90,58,46,0.08)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      offs.forEach((o) => {
        const ox = Math.cos(perp) * o;
        const oy = Math.sin(perp) * o;
        ctx.beginPath();
        ctx.moveTo(from.x + ox, from.y + oy);
        ctx.lineTo(to.x + ox, to.y + oy);
        ctx.stroke();
      });
      ctx.setLineDash([]);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    last.current = getPos(e);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !last.current) return;
    const cur = getPos(e);
    drawRake(last.current, cur);
    last.current = cur;
  };
  const onPointerUp = () => {
    isDragging.current = false;
    last.current = null;
  };
  const clear = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const r = c.getBoundingClientRect();
    ctx.clearRect(0, 0, r.width, r.height);
    ctx.fillStyle = "#E8DCC8";
    ctx.fillRect(0, 0, r.width, r.height);
    ctx.fillStyle = "rgba(90,58,46,0.06)";
    for (let i = 0; i < 420; i++) ctx.fillRect(Math.random() * r.width, Math.random() * r.height, 1, 1);
  };

  return (
    <div className="space-y-2">
      <div className="relative rounded-xl overflow-hidden border-[7px] border-[#8b6b4a]/80 shadow-[0_8px_24px_rgba(0,0,0,0.12)] bg-[#E8DCC8]">
        <canvas ref={canvasRef} className="w-full h-[260px] sm:h-[300px] block cursor-crosshair touch-none" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} />
        {/* stone with ripple */}
        <div className="absolute left-[18%] top-[28%] select-none pointer-events-none">
          <div className="absolute -inset-6 rounded-[52%_48%_55%_45%/45%_55%_48%_52%] border border-stone-800/10" />
          <div className="absolute -inset-10 rounded-[58%_42%_50%_50%/50%_48%_52%_50%] border border-stone-800/[0.07]" />
          <div className="absolute -inset-14 rounded-[45%_55%_48%_52%/52%_45%_55%_48%] border border-stone-800/[0.05]" />
          <div className="size-[68px] rounded-[60%_40%_55%_45%/45%_55%_40%_60%] shadow-[inset_0_2px_6px_rgba(255,255,255,0.5),0_3px_10px_rgba(0,0,0,0.18)] border border-stone-700/20" style={{ background: "radial-gradient(ellipse at 32% 28%, #6b5a4a 0%, #3e352c 42%, #1c1917 100%)" }} />
        </div>
        <div className="absolute right-[22%] bottom-[22%] select-none pointer-events-none">
          <div className="absolute -inset-5 rounded-[60%_40%_50%_50%/50%_50%_40%_60%] border border-stone-800/10" />
          <div className="size-10 rounded-[55%_45%_48%_52%/48%_52%_45%_55%] shadow-[inset_0_1px_4px_rgba(255,255,255,0.45),0_2px_8px_rgba(0,0,0,0.16)] border border-stone-700/20" style={{ background: "radial-gradient(ellipse at 30% 30%, #5a4d3f, #252018)" }} />
        </div>
        <div className="absolute left-2 bottom-2 text-[10px] font-mono bg-[#fdf8ef]/85 backdrop-blur px-2 py-1 rounded-full border">Drag to rake</div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button onClick={() => setTool(3)} className={`px-3 py-1.5 rounded-full border text-xs font-medium transition ${tool === 3 ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"}`}>Rake — 3</button>
        <button onClick={() => setTool(5)} className={`px-3 py-1.5 rounded-full border text-xs font-medium transition ${tool === 5 ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"}`}>Rake — 5</button>
        <button onClick={() => setTool(1)} className={`px-3 py-1.5 rounded-full border text-xs font-medium transition ${tool === 1 ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"}`}>Broom</button>
        <button onClick={clear} className="ml-auto px-3 py-1.5 rounded-full border bg-card hover:bg-muted text-xs">Reset</button>
      </div>
    </div>
  );
}

function CollageBoard() {
  const [redString, setRedString] = useState(false);
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setRedString((v) => !v)} className={`text-xs font-mono px-3 py-1.5 rounded-full border transition ${redString ? "bg-red-600 text-white border-red-600" : "bg-card hover:bg-muted"}`}>Connections {redString ? "on" : "off"}</button>
      </div>
      <div className="relative rounded-xl border bg-[#fdf8ef] p-4 sm:p-6 overflow-hidden" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`, backgroundSize: "18px 18px" }}>
        <div className="absolute inset-0 opacity-[0.06] mix-blend-multiply pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent 0 6px, rgba(0,0,0,0.08) 7px)` }} />
        {redString && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 360" preserveAspectRatio="none">
            <path d="M 110 90 Q 200 60 310 110 T 520 95" stroke="#dc2626" strokeWidth="1.2" fill="none" strokeDasharray="6 4" opacity="0.9" />
            <path d="M 140 210 Q 260 190 320 230 T 480 210" stroke="#dc2626" strokeWidth="1.2" fill="none" strokeDasharray="6 4" opacity="0.9" />
            <path d="M 90 250 Q 180 140 310 110" stroke="#dc2626" strokeWidth="1" fill="none" opacity="0.35" />
          </svg>
        )}
        <div className="grid sm:grid-cols-3 gap-4 relative">
          {[
            { rot: "-1.6deg", tape: "12px", title: "Consumer", grad: "linear-gradient(135deg,#f4a6b8,#7eb8e6)" },
            { rot: "1.2deg", tape: "18px", title: "Gender — maps", grad: "linear-gradient(135deg,#f7d06b,#e67e22)" },
            { rot: "-0.8deg", tape: "8px", title: "City — newspaper", grad: "linear-gradient(135deg,#9bbf8a,#2d5a27)" },
          ].map((c) => (
            <div key={c.title} className="group relative torn bg-white border shadow-[0_4px_14px_rgba(0,0,0,0.08)] p-3 pt-6 transition-transform duration-300 hover:-translate-y-1 hover:rotate-[0deg] hover:shadow-[0_10px_24px_rgba(0,0,0,0.14)]" style={{ rotate: c.rot }}>
              <span className="washi absolute -top-2 left-1/2 -translate-x-1/2 h-5 w-20 -rotate-2" style={{ top: c.tape }} aria-hidden />
              <div className="aspect-[4/3] rounded-lg overflow-hidden relative border">
                <div className="absolute inset-0" style={{ background: c.grad }} />
                <div className="absolute inset-0 halftone text-white" />
                <div className="absolute inset-0 flex items-center justify-center text-white/90 font-display text-sm">✂ {c.title}</div>
              </div>
              <p className="text-xs font-medium mt-2">{c.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DancerTrace() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="h-[180px] relative bg-[#fdf8ef] dark:bg-sidebar overflow-hidden">
        <div className="absolute bottom-10 left-0 right-0 h-px bg-border" />
        <div className="absolute bottom-10 left-0 right-0 h-[28px] opacity-30" style={{ background: "repeating-linear-gradient(90deg, transparent 0 14px, oklch(0.88 0.02 75) 15px)" }} />
        <svg viewBox="0 0 600 180" className="absolute inset-0 w-full h-full">
          <path d="M 40 120 Q 80 90 120 110 T 200 80 Q 230 55 260 85 T 340 70 Q 380 45 420 75 T 500 60 Q 540 35 570 65" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/70" strokeDasharray="1200" strokeDashoffset="1200" style={{ animation: "draw 4.2s ease-in-out infinite alternate" }} />
          <g className="text-primary">
            <circle cx="120" cy="110" r="2.5" fill="currentColor" opacity="0.9" />
            <circle cx="260" cy="85" r="2.5" fill="currentColor" opacity="0.9" />
            <circle cx="420" cy="75" r="2.5" fill="currentColor" opacity="0.9" />
          </g>
        </svg>
      </div>
    </div>
  );
}

/* ── page components ──────────────────────────────────────── */
const Overview = () => (
  <div className="space-y-8">
    <Card className="overflow-hidden">
      <div className="aspect-[3/1] relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #5b3a2e, #c45a2a, #8e44ad)" }} />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative text-center text-white px-4">
          <p className="text-xs tracking-widest uppercase opacity-80">{meta.institute}</p>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold mt-1">{meta.code}</h1>
          <p className="text-sm opacity-80 mt-1">College elective · {meta.credits} · Teacher: {meta.coordinator}</p>
        </div>
      </div>
      <CardContent className="pt-6 space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          This course helps you use your imagination, notice beauty, and think about life. You don't need to become an artist. How you work matters more than the final piece. At the start you pick one studio — music, painting, dance, sculpture, or collage — and stay with it all semester.
        </p>
        <div className="flex flex-wrap gap-2">
          <a href="#ateliers" onClick={(e) => { e.preventDefault(); document.getElementById("ateliers")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="text-xs font-medium bg-primary text-primary-foreground px-3.5 py-2 rounded-full hover:bg-primary/90 transition">Explore studios →</a>
          <a href={meta.syllabus} target="_blank" rel="noreferrer" className="text-xs font-medium border bg-background px-3.5 py-2 rounded-full hover:bg-muted transition">Syllabus ↗</a>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="text-base font-display">How we teach</CardTitle><CardDescription>Official text + plain English</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Official syllabus</span>
          <p className="text-sm leading-relaxed mt-2">The course is on Imagination, aesthetic sensibility, goodness in life and improving humanities skill. This is achieved by offering training on artistic skills and Art Education. The course does not focus on creating artists out of the students which would be intense, but the course is designed on the thought that the end form is secondary, while the means to achieve is primary. The course introduces the students to the thought and the process of Art creation and Art appreciation. The course explains the confluence of art and other popular knowledge systems.</p>
        </div>
        <div className="bg-muted/40 rounded-xl p-4 border">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">In plain English</span>
          <p className="text-sm leading-relaxed mt-2">You'll learn by doing — trying art skills, not just listening. Making matters more than the final piece. You'll see how making and looking at art links to other ways of thinking.</p>
        </div>
      </CardContent>
    </Card>

    <div id="ateliers" className="scroll-mt-24">
      <UnitsPortal />
    </div>

    <Card>
      <CardHeader><CardTitle className="text-base font-display">What you'll learn</CardTitle><CardDescription>Skills you'll build</CardDescription></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courseOutcomes.map((co) => (
            <div key={co.code} className="flex gap-3 items-start">
              <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded shrink-0 mt-1">{co.code}</span>
              <div className="space-y-1.5 flex-1">
                <p className="text-sm leading-relaxed">{co.verbatim}</p>
                <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-2.5 py-1.5 border">In plain English: {co.plain}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="text-base font-display">How you're graded</CardTitle></CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Official syllabus</span>
          <p className="leading-relaxed mt-2">It is a 2-credit course. The semester evaluations are based on the participation of students in the sessions.</p>
        </div>
        <div className="bg-muted/40 rounded-xl p-4 border">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">In plain English</span>
          <p className="leading-relaxed mt-2">You're graded on <strong className="text-foreground">taking part in class</strong>, not on being the best artist.</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const UnitsPortal = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-display font-semibold tracking-tight">Studios</h2>
      <p className="text-sm text-muted-foreground mt-1">Five studios · pick one for the semester.</p>
    </div>
    <div className="grid sm:grid-cols-2 gap-5">
      {units.map((u) => (
        <Card key={u.id} className="overflow-hidden group hover:shadow-md transition-shadow p-0 gap-0 flex flex-col torn">
          <a href={`#/${u.id}`} className="block">
            <div className="h-32 relative flex items-center justify-center overflow-hidden duotone-hover" style={{ background: u.gradient }}>
              <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
              <div className="absolute inset-0 halftone text-white" />
              <i className={`${u.icon} relative text-4xl text-white drop-shadow-sm transition-transform duration-300 group-hover:scale-110`}></i>
              <span className="washi absolute -top-1 right-6 h-4 w-14 rotate-2 hidden sm:flex" aria-hidden />
            </div>
          </a>
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-center gap-2">
              <a href={`#/${u.id}`} className="font-display font-semibold text-sm hover:text-primary transition-colors">{u.title}</a>
              <span className="text-xs text-muted-foreground">· {u.subtitle}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mt-2 line-clamp-3">{u.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {u.keyConcepts.slice(0, 3).map((k) => (
                <span key={k} className="text-[10px] bg-muted px-2 py-0.5 rounded-full">{k}</span>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">{u.works.length} works</span>
              <a href={`#/${u.id}`} className="text-xs font-medium text-primary hover:underline">Open studio →</a>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const UnitDetail = ({ unit, allUnits }: { unit: Unit; allUnits: Unit[] }) => {
  const idx = allUnits.findIndex((u) => u.id === unit.id);
  const prev = idx > 0 ? allUnits[idx - 1] : null;
  const next = idx < allUnits.length - 1 ? allUnits[idx + 1] : null;
  return (
    <div className="space-y-6">
      {/* studio hero */}
      <div className="overflow-hidden rounded-2xl border shadow-sm">
        <div className="relative h-[320px] sm:h-[400px] flex flex-col items-center justify-center text-white p-6 sm:p-8 text-center overflow-hidden" style={{ background: unit.gradient }}>
          <div className="absolute inset-0 bg-black/[0.06]" />
          <div className="absolute -top-12 -right-12 text-[160px] leading-none opacity-[0.07] select-none rotate-6 flex items-center justify-center"><i className={unit.icon}></i></div>
          <div className="absolute -bottom-8 -left-8 text-[140px] leading-none opacity-[0.07] select-none -rotate-6 flex items-center justify-center"><i className={unit.icon}></i></div>
          <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(circle at 35% 20%, white, transparent 50%), radial-gradient(circle at 80% 80%, white, transparent 45%)" }} />
          {/* unit-specific extras */}
          {unit.id === "music" && (
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 pointer-events-none">
              <svg viewBox="0 0 600 64" className="w-full h-full" preserveAspectRatio="none">
                <path d="M 0 32 Q 80 8 160 32 T 320 32 Q 400 56 480 32 T 600 32" fill="none" stroke="white" strokeWidth="1.2" opacity="0.9" />
                <path d="M 0 36 Q 80 12 160 36 T 320 36 Q 400 60 480 36 T 600 36" fill="none" stroke="white" strokeWidth="0.7" opacity="0.5" />
              </svg>
            </div>
          )}
          {unit.id === "painting" && <div className="absolute inset-0 halftone text-white opacity-20 pointer-events-none" />}
          {unit.id === "collage" && <span className="washi absolute top-3 left-1/2 -translate-x-1/2 h-6 w-28 rotate-1 pointer-events-none" aria-hidden />}
          <span className="relative text-[11px] font-mono tracking-[0.18em] uppercase bg-white/15 backdrop-blur border border-white/15 px-3 py-1.5 rounded-full">{unit.subtitle}</span>
          <i className={`${unit.icon} relative text-5xl sm:text-6xl mt-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]`}></i>
          <h1 className="relative text-3xl sm:text-[2.05rem] font-display font-semibold tracking-tight mt-3 text-balance">{unit.title}</h1>
          <p className="relative text-sm opacity-[0.9] mt-2 max-w-[52ch] leading-relaxed text-pretty">{unit.description}</p>
          <div className="relative flex items-center gap-2 mt-5">
            <a href="#works" className="text-xs font-semibold bg-white text-zinc-900 px-4 py-2 rounded-full hover:bg-white/90 transition shadow-sm">View works ↓</a>
            <a href="#/overview" onClick={(e) => { e.preventDefault(); window.location.hash = "#/overview"; setTimeout(() => document.getElementById("ateliers")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80); }} className="text-xs font-medium bg-white/10 backdrop-blur border border-white/20 px-4 py-2 rounded-full hover:bg-white/15 transition">All studios</a>
          </div>
        </div>
        <div className="bg-card px-5 sm:px-6 py-4 flex flex-wrap gap-5 text-xs border-t">
          <div><span className="text-muted-foreground">Studio</span><p className="font-medium mt-0.5 flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: unit.gradient }} />{unit.subtitle}</p></div>
          <div><span className="text-muted-foreground">Studio</span><p className="font-medium mt-0.5">{unit.works.length} works</p></div>
          <div><span className="text-muted-foreground">Focus</span><p className="font-medium mt-0.5">{unit.keyConcepts.slice(0, 2).join(" · ")}</p></div>
          <div className="ml-auto hidden sm:block"><span className="text-muted-foreground">Navigate</span><p className="font-medium mt-0.5 flex gap-1">{prev && <a href={`#/${prev.id}`} className="hover:text-primary transition">← {prev.title}</a>}{prev && next && <span className="text-muted-foreground">·</span>}{next && <a href={`#/${next.id}`} className="hover:text-primary transition">{next.title} →</a>}</p></div>
        </div>
      </div>

      {unit.id === "dance" && <DancerTrace />}
      {unit.id === "sculpture" && <KaresansuiGarden />}
      {unit.id === "collage" && <CollageBoard />}

      <Card>
        <CardContent className="pt-6 space-y-5">
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">From the official syllabus</span>
            <p className="text-sm leading-relaxed mt-2">{unit.verbatim}</p>
          </div>
          <div className="bg-muted/40 rounded-xl p-4 border">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">In plain English</span>
            <p className="text-sm leading-relaxed mt-2">{unit.description} {unit.detail}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Main ideas</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {unit.keyConcepts.map((k) => (
                <span key={k} className="text-xs bg-muted px-2.5 py-1 rounded-full">{k}</span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card id="works" className="scroll-mt-20">
        <CardHeader>
          <CardTitle className="text-base font-display flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: unit.gradient }} />{unit.title} — Gallery</CardTitle>
          <CardDescription>Works from this studio · click to see details</CardDescription>
        </CardHeader>
        <CardContent>
          <ArtGrid items={unit.works} gradient={unit.gradient} />
        </CardContent>
      </Card>
    </div>
  );
};

const Resources = () => (
  <div className="space-y-4">
    <Card>
      <CardHeader><CardTitle className="text-base font-display">Books to read</CardTitle></CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        <p>• <em>The Art of Indian Culture</em> — Brijendra Kumar</p>
        <p>• <em>Indian Music</em> — P. Sambamurthy</p>
        <p>• <em>History of Indian Art</em> — Parul Dave Mukherji</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle className="text-base font-display">What to bring</CardTitle></CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        <p>• Drawing notebook (A4), pencils (HB–6B), eraser, sharpener</p>
        <p>• Watercolor set, brushes (round + flat), mixing palette</p>
        <p>• Air-dry clay (given in studio), modeling tools</p>
        <p>• Old magazines and newspapers for collage</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle className="text-base font-display">Helpful links</CardTitle></CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        <p>• <a href={meta.academic} className="text-primary hover:underline" target="_blank" rel="noreferrer">IIIT-H Academic Office</a></p>
        <p>• <a href={meta.syllabus} className="text-primary hover:underline" target="_blank" rel="noreferrer">Monsoon 2026 Syllabus (PDF)</a></p>
        <p>• <a href={meta.offerings} className="text-primary hover:underline" target="_blank" rel="noreferrer">Course Offerings (PDF)</a></p>
      </CardContent>
    </Card>
  </div>
);

/* ── routes ───────────────────────────────────────────────── */
const routes: { id: string; label: string; page: React.ReactNode }[] = [
  { id: "overview", label: "Overview", page: <Overview /> },
  ...units.map((u) => ({ id: u.id, label: u.title, page: <UnitDetail unit={u} allUnits={units} /> })),
  { id: "resources", label: "Resources", page: <Resources /> },
];
function resolve(parts: string[]) {
  const id = parts[0] ?? "overview";
  return routes.find((r) => r.id === id) ?? routes[0]!;
}

/* ── sidebar ──────────────────────────────────────────────── */
function SidebarContent({ activeId, onNavigate }: { activeId: string; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-border">
        <a href="#/overview" onClick={onNavigate} className="flex items-center gap-3 group">
          <span className="size-9 rounded-xl flex items-center justify-center text-white text-sm shadow-sm" style={{ background: "linear-gradient(135deg, #5b3a2e, #c45a2a)" }}><i className="fi fi-rr-diamond"></i></span>
          <div>
            <p className="font-display font-semibold text-[15px] leading-none tracking-tight group-hover:text-primary transition-colors">Arts</p>
            <p className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">OC2.101 · IIIT-H</p>
          </div>
        </a>
        <p className="text-xs text-muted-foreground leading-relaxed mt-3">Five studios · pick one for the semester.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        <nav className="space-y-1">
          <p className="text-[10px] font-mono tracking-[0.14em] uppercase text-muted-foreground px-2 mb-1">Studio</p>
          {[
            { id: "overview", label: "Overview", desc: "Course · Studios", icon: "fi fi-rr-overview" },
            { id: "resources", label: "Resources", desc: "Books and links", icon: "fi fi-rr-book-open-cover" },
          ].map((it) => {
            const active = activeId === it.id;
            return (
              <a key={it.id} href={`#/${it.id}`} onClick={onNavigate} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${active ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}>
                <span className={`size-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${active ? "bg-white/15 text-white" : "bg-muted text-muted-foreground"}`}><i className={it.icon}></i></span>
                <span className="flex-1 min-w-0">
                  <span className="font-medium leading-none block">{it.label}</span>
                  <span className={`text-[11px] leading-none ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{it.desc}</span>
                </span>
              </a>
            );
          })}
        </nav>

        <nav className="space-y-1">
          <p className="text-[10px] font-mono tracking-[0.14em] uppercase text-muted-foreground px-2 mb-1">Studios · 5</p>
          {units.map((u) => {
            const active = activeId === u.id;
            return (
              <a key={u.id} href={`#/${u.id}`} onClick={onNavigate} className={`group flex items-center gap-3 px-2 py-2.5 rounded-xl border transition ${active ? "bg-card border-border shadow-sm" : "border-transparent hover:bg-card hover:border-border/60 hover:shadow-sm"}`}>
                <span className="size-9 rounded-xl flex items-center justify-center text-white text-base shrink-0 shadow-sm" style={{ background: u.gradient }}><i className={u.icon}></i></span>
                <span className="flex-1 min-w-0">
                  <span className="text-sm font-medium leading-none block truncate">{u.title}</span>
                  <span className="text-[11px] text-muted-foreground truncate block">{u.subtitle}</span>
                </span>
                <span className={`size-6 rounded-full flex items-center justify-center text-[11px] shrink-0 transition ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`}>→</span>
              </a>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-border space-y-2">
        <a href={meta.syllabus} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition px-2 py-1.5 rounded-lg hover:bg-muted">
          <span className="size-6 rounded-full border flex items-center justify-center text-[11px]">↗</span> Syllabus PDF
        </a>
        <p className="text-[10px] font-mono text-muted-foreground px-2">© 2026 IIIT-H</p>
      </div>
    </div>
  );
}

/* ── app shell ────────────────────────────────────────────── */
export function App() {
  const { dark, toggle } = useDarkMode();
  const parts = useHashRoute();
  const active = resolve(parts);
  useScrollTop(parts.join("/"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const unit = units.find((u) => u.id === active.id) ?? null;
  useEffect(() => { setMobileOpen(false); }, [parts.join("/")]);
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);
  return (
    <DarkModeCtx.Provider value={{ dark, toggle }}>
      <div className="min-h-screen bg-background text-foreground flex">
        <aside className="hidden lg:flex w-[300px] shrink-0 flex-col border-r bg-sidebar sticky top-0 h-screen overflow-hidden">
          <SidebarContent activeId={active.id} />
        </aside>
        {mobileOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden />
            <aside className="fixed inset-y-0 left-0 w-[300px] max-w-[85vw] bg-sidebar border-r z-50 lg:hidden flex flex-col overflow-hidden shadow-2xl">
              <SidebarContent activeId={active.id} onNavigate={() => setMobileOpen(false)} />
            </aside>
          </>
        )}
        <div className="flex-1 min-w-0 flex flex-col">
          <header className="sticky top-0 z-20 h-14 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70 flex items-center justify-between px-4 sm:px-6 gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setMobileOpen((o) => !o)} className="lg:hidden size-8 rounded-lg border bg-card flex items-center justify-center hover:bg-muted transition shrink-0" aria-label="Open navigation">
                <span className="flex flex-col gap-1">
                  <span className="block w-4 h-0.5 bg-foreground rounded" />
                  <span className="block w-4 h-0.5 bg-foreground rounded" />
                  <span className="block w-4 h-0.5 bg-foreground rounded" />
                </span>
              </button>
              <nav className="hidden sm:flex items-center gap-2 text-sm min-w-0">
                <a href="#/overview" className="text-muted-foreground hover:text-foreground transition">Arts</a>
                <span className="text-muted-foreground/40">/</span>
                {unit ? (
                  <>
                    <a href="#/overview" onClick={(e) => { e.preventDefault(); window.location.hash = "#/overview"; setTimeout(() => document.getElementById("ateliers")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80); }} className="text-muted-foreground hover:text-foreground transition">Studios</a>
                    <span className="text-muted-foreground/40">/</span>
                    <span className="font-medium flex items-center gap-1.5 truncate"><span className="size-5 rounded-full flex items-center justify-center text-white text-[10px] shrink-0" style={{ background: unit.gradient }}><i className={unit.icon}></i></span>{unit.title}</span>
                  </>
                ) : (
                  <span className="font-medium truncate">{active.label}</span>
                )}
              </nav>
              <span className="sm:hidden text-sm font-medium truncate">{unit ? unit.title : active.label}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline text-[10px] font-mono text-muted-foreground bg-muted px-2 py-1 rounded-full">{meta.code}</span>
              <DarkToggle />
            </div>
          </header>
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="max-w-3xl mx-auto w-full">
              <div key={active.id} className="animate-[slide-up_0.35s_ease-out]">
                {active.page}
              </div>
            </div>
          </main>
          <footer className="border-t border-border mt-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                <div className="space-y-1.5">
                  <h3 className="font-display font-semibold text-sm">{meta.code}</h3>
                  <p className="text-xs text-muted-foreground">Teacher: {meta.coordinator}</p>
                  <p className="text-xs text-muted-foreground">Five studios · pick one for the semester</p>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display font-semibold text-sm">Contact</h3>
                  <p className="text-xs text-muted-foreground">{meta.institute}, Gachibowli</p>
                  <p className="text-xs text-muted-foreground"><a href="https://intranet.iiit.ac.in" className="text-primary hover:underline" target="_blank" rel="noreferrer">intranet.iiit.ac.in</a></p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground pt-4 border-t border-border">
                <p>© 2026 {meta.institute}. {meta.code} · Unofficial</p>
                <div className="flex gap-4">
                  <a href="https://iiit.ac.in" className="hover:text-foreground transition-colors" target="_blank" rel="noreferrer">IIIT-H</a>
                  <a href="https://intranet.iiit.ac.in" className="hover:text-foreground transition-colors" target="_blank" rel="noreferrer">Intranet</a>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground/60 text-center">Icons by <a href="https://www.flaticon.com/uicons" className="underline hover:text-foreground" target="_blank" rel="noreferrer">Flaticon</a></p>
            </div>
          </footer>
        </div>
      </div>
    </DarkModeCtx.Provider>
  );
}
export default App;

function DarkToggle() {
  const { dark, toggle } = useContext(DarkModeCtx);
  return (
    <button onClick={toggle} className="size-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
      {dark ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
      )}
    </button>
  );
}
