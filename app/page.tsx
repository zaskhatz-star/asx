"use client";

import { useMemo, useState } from "react";

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
  const [error, setError] = useState("");

  const canGenerate = useMemo(() => niche.trim() && audience.trim() && goal.trim(), [niche, audience, goal]);

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
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10">
      <section className="mb-6">
        <h1 className="text-3xl font-bold md:text-4xl">Создай карусель за 2 минуты</h1>
        <p className="mt-2 text-white/70">Без воды. Без банальщины. С готовой структурой.</p>
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
        <section className="space-y-4">
          <div className="card">
            <h2 className="text-2xl font-semibold">Карусель</h2>
            {selectedIdea && <p className="mt-2 text-white/70">Идея: {selectedIdea.title}</p>}
            <div className="mt-4 space-y-3">
              {slides.map((slide, index) => (
                <div key={index} className="rounded-xl border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-wide text-accent">Слайд {index + 1}</p>
                  <p className="mt-1">{slide}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn-primary" onClick={copyAll}>Скопировать</button>
              <button className="btn-ghost" onClick={() => selectedIdea && chooseIdea(selectedIdea)}>Переделать</button>
              <button className="btn-ghost" onClick={adaptStories}>Адаптировать в сторис</button>
            </div>
          </div>

          {stories.length > 0 && (
            <div className="card">
              <h3 className="text-xl font-semibold">Сторис-адаптация</h3>
              <div className="mt-3 space-y-2">
                {stories.map((story, index) => (
                  <div key={index} className="rounded-lg border border-white/10 p-3">
                    <p className="text-xs uppercase text-accent">Сторис {index + 1}</p>
                    <p>{story}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </main>
  );
}
