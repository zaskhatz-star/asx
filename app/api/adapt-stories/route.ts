import { NextResponse } from "next/server";
import { adaptToStories } from "@/lib/content-engine";

export async function POST(req: Request) {
  const body = (await req.json()) as { slides: string[] };

  if (!Array.isArray(body?.slides) || body.slides.length === 0) {
    return NextResponse.json({ error: "Сначала сгенерируй карусель." }, { status: 400 });
  }

  const stories = adaptToStories(body.slides);
  return NextResponse.json({ stories });
}
