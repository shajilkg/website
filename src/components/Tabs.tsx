import { useState, useRef, useEffect } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const btn = bar.querySelector(`[data-active="true"]`) as HTMLElement | null;
    btn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  const activeTab = tabs.find((t) => t.id === active);

  return (
    <div className="w-full">
      {/* Pill atelier nav — tactile, warm */}
      <div className="sticky top-0 z-30 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 bg-background/80 backdrop-blur-[12px] supports-[backdrop-filter]:bg-background/70 border-b border-border/50 sm:border-0 sm:bg-transparent sm:backdrop-blur-none sm:py-0 sm:static">
        <div
          ref={barRef}
          className="flex gap-1.5 overflow-x-auto scrollbar-none sm:flex-wrap sm:overflow-visible p-1.5 rounded-full bg-muted/70 border border-border/60 w-fit max-w-full mx-auto sm:mx-0 shadow-sm"
        >
          {tabs.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                data-active={isActive}
                onClick={() => setActive(tab.id)}
                className={`relative px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap shrink-0 transition-all duration-200 ${
                  isActive
                    ? "bg-background text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* content with soft reveal */}
      <div key={active} className="pt-6 sm:pt-8 animate-[slide-up_0.35s_ease-out]">
        {activeTab?.content}
      </div>
    </div>
  );
}
