export type DesignPreset = "bold-red" | "clean-dark" | "mono-grid";
export type TextInterpretation = "compact" | "balanced" | "expanded";

export interface DesignedSlide {
  index: number;
  role: string;
  text: string;
  kicker: string;
  alignment: "left" | "center";
  textSize: "sm" | "md" | "lg";
  accent: "line" | "badge" | "block";
}

const roleLabels: Record<number, string> = {
  0: "Хук",
  1: "Проблема",
  2: "Усиление",
  3: "Объяснение",
  4: "Решение",
  5: "CTA"
};

function compactText(text: string): string {
  if (text.length <= 90) return text;
  return `${text.slice(0, 88).trim()}…`;
}

function expandedText(text: string): string {
  if (text.length >= 120) return text;
  if (text.endsWith(".")) return `${text} Добавь конкретный пример прямо на этом слайде.`;
  return `${text}. Добавь конкретный пример прямо на этом слайде.`;
}

function applyInterpretation(text: string, interpretation: TextInterpretation): string {
  if (interpretation === "compact") return compactText(text);
  if (interpretation === "expanded") return expandedText(text);
  return text;
}

function chooseTextSize(text: string): "sm" | "md" | "lg" {
  if (text.length > 160) return "sm";
  if (text.length > 105) return "md";
  return "lg";
}

export function designSlides(slides: string[], interpretation: TextInterpretation): DesignedSlide[] {
  return slides.map((rawText, index) => {
    const text = applyInterpretation(rawText, interpretation);
    return {
      index: index + 1,
      role: roleLabels[index] ?? `Слайд ${index + 1}`,
      text,
      kicker: `Слайд ${index + 1}`,
      alignment: index % 2 === 0 ? "left" : "center",
      textSize: chooseTextSize(text),
      accent: index % 3 === 0 ? "block" : index % 3 === 1 ? "line" : "badge"
    };
  });
}
