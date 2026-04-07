import type { DesignPreset, DesignedSlide } from "@/lib/slide-design";

type Props = {
  slide: DesignedSlide;
  preset: DesignPreset;
};

const presetClasses: Record<DesignPreset, { frame: string; accent: string; muted: string }> = {
  "bold-red": {
    frame: "bg-zinc-950 border-red-400/60",
    accent: "text-red-400",
    muted: "text-zinc-300"
  },
  "clean-dark": {
    frame: "bg-[#11151f] border-cyan-300/40",
    accent: "text-cyan-300",
    muted: "text-slate-300"
  },
  "mono-grid": {
    frame: "bg-black border-white/70",
    accent: "text-white",
    muted: "text-zinc-200"
  }
};

const textSizeClass = {
  sm: "text-xl leading-7",
  md: "text-2xl leading-8",
  lg: "text-3xl leading-9"
};

export function SlideCanvas({ slide, preset }: Props) {
  const c = presetClasses[preset];

  return (
    <article className="space-y-2">
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>{slide.kicker}</span>
        <span>{slide.role}</span>
      </div>

      <div className={`relative aspect-[4/5] w-full overflow-hidden rounded-2xl border p-6 ${c.frame}`}>
        {slide.accent === "line" && <div className="absolute left-6 top-6 h-1 w-24 rounded-full bg-current text-red-400" />}

        {slide.accent === "block" && (
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        )}

        <div className={`relative z-10 flex h-full flex-col ${slide.alignment === "center" ? "items-center text-center" : "items-start text-left"}`}>
          <p className={`mb-4 text-xs uppercase tracking-[0.16em] ${c.accent}`}>{slide.role}</p>

          {slide.accent === "badge" && (
            <span className={`mb-4 rounded-full border border-current/40 px-3 py-1 text-[10px] uppercase tracking-wider ${c.accent}`}>
              Instagram carousel
            </span>
          )}

          <p className={`font-semibold ${textSizeClass[slide.textSize]} ${c.muted}`}>{slide.text}</p>

          <div className="mt-auto pt-4 text-[11px] uppercase tracking-[0.18em] text-white/35">aida ai template</div>
        </div>
      </div>
    </article>
  );
}
