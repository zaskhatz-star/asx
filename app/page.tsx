"use client";

import { useMemo, useState } from "react";
import { SlideCanvas } from "@/components/slide-canvas";
import { designSlides, type DesignPreset, type TextInterpretation } from "@/lib/slide-design";

type Idea = {
  id: string;
  title: string;
  angle: string;
  essence: string;
  why_it_works: string;
};

type Step = "start" | "ideas" | "carousel";

const formats = ["ошибка", "миф / правда", "разбор", "подборка", "история"];
const themes = [
  "почему не получается",
  "как сделать правильно",
  "ошибки новичков",
  "что работает сейчас",
  "личный опыт / кейс"
];

export default function HomePage() {
  const [step, setStep] = useState<Step>("start");
  const [loading, setLoading] = useState(false);

  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("идеи");
  const [format, setFormat] = useState(formats[0]);
  const [theme, setTheme] = useState(themes[0]);

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [slides, setSlides] = useState<string[]>([]);
  const [stories, setStories] = useState<string[]>([]);
  const [preset, setPreset] = useState<DesignPreset>("bold-red");
  const [interpretation, setInterpretation] = useState<TextInterpretation>("balanced");
  const [error, setError] = useState("");

  const canGenerate = useMemo(() => niche.trim() && audience.trim() && goal.trim(), [niche, audience, goal]);
  const designedSlides = useMemo(() => designSlides(slides, interpretation), [slides, interpretation]);

  async function generateIdeas() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, audience, goal, format, theme, style: "живой, уверенный" })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка генерации идей");

      setIdeas(data.ideas);
      setStep("ideas");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Что-то пошло не так");
    } finally {
      setLoading(false);
    }
  }

  async function chooseIdea(idea: Idea) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка генерации карусели");

      setSelectedIdea(idea);
      setSlides(data.slides);
      setStories([]);
      setStep("carousel");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Что-то пошло не так");
    } finally {
      setLoading(false);
    }
  }

  async function adaptStories() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/adapt-stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка адаптации сторис");

      setStories(data.stories);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Что-то пошло не так");
    } finally {
      setLoading(false);
    }
  }

  function copyAll() {
    const payload = [
      ...slides.map((s, i) => `Слайд ${i + 1}: ${s}`),
      stories.length ? "\n--- Сторис ---" : "",
      ...stories.map((s, i) => `Сторис ${i + 1}: ${s}`)
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(payload);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-10">
      <section className="mb-6">
        <h1 className="text-3xl font-bold md:text-4xl">Создай карусель за 2 минуты</h1>
        <p className="mt-2 text-white/70">Рабочая среда: идеи → тексты → автолейауты с разными интерпретациями.</p>
      </section>

      {step === "start" && (
        <section className="card space-y-4">
          <input className="input" placeholder="Чем ты занимаешься?" value={niche} onChange={(e) => setNiche(e.target.value)} />
          <input className="input" placeholder="Кто твоя аудитория?" value={audience} onChange={(e) => setAudience(e.target.value)} />
          <select className="input" value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="идеи">Идеи</option>
            <option value="карусель">Карусель</option>
            <option value="сторис-адаптация">Сторис-адаптацию</option>
          </select>

          <div className="grid gap-3 md:grid-cols-2">
            <select className="input" value={format} onChange={(e) => setFormat(e.target.value)}>
              {formats.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
            <select className="input" value={theme} onChange={(e) => setTheme(e.target.value)}>
              {themes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <button className="btn-primary" disabled={!canGenerate || loading} onClick={generateIdeas}>
            {loading ? "Генерирую..." : "Сгенерировать"}
          </button>
        </section>
      )}

      {step === "ideas" && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button className="btn-ghost" onClick={() => setStep("start")}>Назад</button>
            <button className="btn-ghost" onClick={generateIdeas}>Сгенерировать еще</button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {ideas.map((idea) => (
              <article key={idea.id} className="card">
                <h3 className="text-xl font-semibold">{idea.title}</h3>
                <p className="mt-2 text-sm text-white/80">{idea.essence}</p>
                <p className="mt-2 text-xs text-white/60">Угол: {idea.angle}</p>
                <p className="mt-2 text-xs text-white/60">Почему зайдет: {idea.why_it_works}</p>
                <button className="btn-primary mt-4" onClick={() => chooseIdea(idea)}>
                  Выбрать
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {step === "carousel" && (
        <section className="grid gap-4 lg:grid-cols-[300px_1fr]">
          <aside className="card h-fit space-y-4 lg:sticky lg:top-4">
            <h2 className="text-lg font-semibold">Дизайн-среда</h2>
            {selectedIdea && <p className="text-xs text-white/65">Идея: {selectedIdea.title}</p>}

            <label className="space-y-1 text-sm">
              <span className="text-white/75">Шаблон</span>
              <select className="input" value={preset} onChange={(e) => setPreset(e.target.value as DesignPreset)}>
                <option value="bold-red">Bold Red</option>
                <option value="clean-dark">Clean Dark</option>
                <option value="mono-grid">Mono Grid</option>
              </select>
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-white/75">Интерпретация текста</span>
              <select className="input" value={interpretation} onChange={(e) => setInterpretation(e.target.value as TextInterpretation)}>
                <option value="compact">Меньше текста</option>
                <option value="balanced">Баланс</option>
                <option value="expanded">Больше текста</option>
              </select>
            </label>

            <div className="space-y-2">
              <button className="btn-primary w-full" onClick={copyAll}>Скопировать тексты</button>
              <button className="btn-ghost w-full" onClick={() => selectedIdea && chooseIdea(selectedIdea)}>Переделать</button>
              <button className="btn-ghost w-full" onClick={adaptStories}>Адаптировать в сторис</button>
            </div>
          </aside>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {designedSlides.map((slide) => (
                <SlideCanvas key={slide.index} slide={slide} preset={preset} />
              ))}
            </div>

            {stories.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-semibold">Сторис-адаптация</h3>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {stories.map((story, index) => (
                    <div key={index} className="rounded-lg border border-white/10 p-3">
                      <p className="text-xs uppercase text-accent">Сторис {index + 1}</p>
                      <p>{story}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </main>
  );
}
