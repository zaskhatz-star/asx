import { NextResponse } from "next/server";
import { generateCarousel, type Idea } from "@/lib/content-engine";

export async function POST(req: Request) {
  const body = (await req.json()) as { idea: Idea };

  if (!body?.idea?.title) {
    return NextResponse.json({ error: "Нужна выбранная идея." }, { status: 400 });
  }

  const slides = generateCarousel(body.idea);
  return NextResponse.json({ slides });
}
