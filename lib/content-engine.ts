export type FormatType = "ошибка" | "миф / правда" | "разбор" | "подборка" | "история";
export type ThemeType =
  | "почему не получается"
  | "как сделать правильно"
  | "ошибки новичков"
  | "что работает сейчас"
  | "личный опыт / кейс";

export interface IdeaInput {
  niche: string;
  audience: string;
  goal: string;
  format?: FormatType;
  theme?: ThemeType;
  style?: string;
}

export interface Idea {
  id: string;
  title: string;
  angle: string;
  essence: string;
  why_it_works: string;
}

const fallbackFormats: FormatType[] = ["ошибка", "миф / правда", "разбор", "подборка", "история"];
const fallbackThemes: ThemeType[] = [
  "почему не получается",
  "как сделать правильно",
  "ошибки новичков",
  "что работает сейчас",
  "личный опыт / кейс"
];

const hooks = [
  "Почему ты делаешь всё правильно, но результата нет",
  "Тихая ошибка, из-за которой контент сливает клиентов",
  "Красиво — не значит эффективно",
  "То, что ты считаешь стратегией, убивает охваты",
  "Что у тебя не так, если посты есть, а продаж нет"
];

const angles = [
  "контраст между красивым контентом и слабым смыслом",
  "конфликт между охватами и заявками",
  "разрыв между ожиданием автора и восприятием аудитории",
  "переоценка инструментов вместо работы с месседжем",
  "ошибка в подаче, а не в экспертности"
];

export function generateIdeas(input: IdeaInput): Idea[] {
  const format = input.format ?? fallbackFormats[0];
  const theme = input.theme ?? fallbackThemes[0];

  return Array.from({ length: 5 }).map((_, i) => {
    const hook = hooks[i % hooks.length];
    const angle = angles[i % angles.length];

    return {
      id: `idea_${i + 1}`,
      title: `${hook} в нише «${input.niche}»`,
      angle: `${format}: ${angle}`,
      essence: `Для аудитории «${input.audience}» показываем тему «${theme}» через конкретный разбор без абстракций.`,
      why_it_works:
        "Бьет в знакомую боль, вызывает внутренний спор и дает читателю четкий следующий шаг вместо общих советов."
    };
  });
}

export function generateCarousel(idea: Idea): string[] {
  return [
    `${idea.title}. Сохрани, если узнал(а) себя.`,
    "Проблема не в том, что ты мало делаешь. Проблема — в слабом фокусе сообщения.",
    "Из-за этого люди читают, соглашаются и уходят. Без действия, заявки и диалога.",
    `Разбор: ${idea.angle}. Контент должен вести к решению, а не просто выглядеть умно.`,
    "Решение: один пост = одна боль + одна мысль + один конкретный следующий шаг.",
    "Хочешь шаблон под свою нишу? Напиши «карусель» в директ — отправлю структуру."
  ];
}

export function adaptToStories(slides: string[]): string[] {
  return [
    slides[0] ?? "Сторис 1: зацепка",
    slides[1] ?? "Сторис 2: боль",
    slides[3] ?? "Сторис 3: мысль",
    slides[4] ?? "Сторис 4: решение",
    "Ответь «+» в директ, и я отправлю готовый шаблон под твою тему."
  ];
}
