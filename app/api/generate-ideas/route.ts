import { NextResponse } from "next/server";
import { generateIdeas, type IdeaInput } from "@/lib/content-engine";

export async function POST(req: Request) {
  const body = (await req.json()) as IdeaInput;

  if (!body?.niche || !body?.audience || !body?.goal) {
    return NextResponse.json({ error: "Заполни нишу, аудиторию и цель." }, { status: 400 });
  }

  const ideas = generateIdeas(body);
  return NextResponse.json({ ideas });
}
