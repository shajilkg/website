import { Tabs } from "./components/Tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card";
import "./index.css";

/* ── placeholder images (colored boxes) ───────────────────── */
const img = (label: string, color: string) => (
  <div
    className="aspect-[4/3] rounded-lg flex items-center justify-center text-sm font-medium text-white/80"
    style={{ background: color }}
  >
    {label}
  </div>
);

/* ── tab content ──────────────────────────────────────────── */
const Blog = () => (
  <div className="space-y-4">
    {[
      { title: "New Clay Series Finished", date: "Aug 12, 2026", desc: "Exploring organic forms in stoneware." },
      { title: "Studio Update — Summer", date: "Jul 28, 2026", desc: "New kiln arrived, firing schedule adjusted." },
      { title: "Exhibition at Lakewood Gallery", date: "Jun 5, 2026", desc: "Group show — 3 pieces selected." },
    ].map((post) => (
      <Card key={post.title}>
        <CardHeader>
          <CardTitle className="text-lg">{post.title}</CardTitle>
          <CardDescription>{post.date}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{post.desc}</p>
        </CardContent>
      </Card>
    ))}
  </div>
);

const ArtDisplay = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {[1, 2, 3, 4, 5, 6].map((n) => (
      <div key={n} className="space-y-2">
        {img(`Art ${n}`, `hsl(${n * 45}, 45%, 55%)`)}
        <p className="text-xs text-muted-foreground text-center">Untitled #{n}</p>
      </div>
    ))}
  </div>
);

const Sculpture = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {[
      { title: "Vessel I", material: "Stoneware, ash glaze" },
      { title: "Drift", material: "Bronze cast" },
      { title: "Core Sample", material: "Reclaimed wood, epoxy" },
    ].map((s) => (
      <Card key={s.title}>
        <div className="p-4">{img(s.title, "hsl(210, 30%, 40%)")}</div>
        <CardHeader>
          <CardTitle className="text-base">{s.title}</CardTitle>
          <CardDescription>{s.material}</CardDescription>
        </CardHeader>
      </Card>
    ))}
  </div>
);

const Posters = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {["Exhibition A", "Workshop B", "Open Studio", "Annual Show"].map((p, i) => (
      <div key={p} className="space-y-2">
        {img(p, `hsl(${i * 80 + 20}, 50%, 45%)`)}
        <p className="text-xs text-muted-foreground text-center">{p}</p>
      </div>
    ))}
  </div>
);

const Classes = () => (
  <div className="space-y-4">
    {[
      { name: "Wheel Throwing Basics", schedule: "Saturdays 10am–12pm", spots: 4 },
      { name: "Hand-Building Workshop", schedule: "Wednesdays 6–8pm", spots: 6 },
      { name: "Advanced Glazing", schedule: "Sundays 2–5pm", spots: 2 },
    ].map((c) => (
      <Card key={c.name}>
        <CardHeader>
          <CardTitle className="text-lg">{c.name}</CardTitle>
          <CardDescription>{c.schedule}</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-sm text-muted-foreground">{c.spots} spots left</span>
        </CardContent>
      </Card>
    ))}
  </div>
);

const About = () => (
  <Card>
    <CardHeader>
      <CardTitle>About the Lab</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm text-muted-foreground">
      <p>
        A small ceramics and mixed-media studio focused on exploration.
        Open workshops, occasional exhibitions, and classes for all levels.
      </p>
      <p>
        Contact: <span className="text-foreground">hello@artlab.studio</span>
      </p>
    </CardContent>
  </Card>
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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold tracking-tight">Art Lab</h1>
          <p className="text-sm text-muted-foreground mt-1">Ceramics · Mixed Media · Workshops</p>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Tabs tabs={tabs} />
      </main>
    </div>
  );
}

export default App;
