import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type SeoRequest = {
  category?: unknown;
  title?: unknown;
  description?: unknown;
  focusKeyword?: unknown;
  pinUrl?: unknown;
};

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI is not configured. Add GROQ_API_KEY to Vercel environment variables and redeploy." }, { status: 503 });
  }

  let body: SeoRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const category = clean(body.category, 60);
  const title = clean(body.title, 120);
  const description = clean(body.description, 1000);
  const focusKeyword = clean(body.focusKeyword, 100);
  const pinUrl = clean(body.pinUrl, 300);

  if (!category || !title) {
    return NextResponse.json({ error: "Project category and title are required." }, { status: 400 });
  }

  const systemPrompt = [
    "You are an expert SEO copywriter for CreativeRizz, a professional graphic and UI/UX design portfolio.",
    "Create accurate, natural, search-friendly metadata for one portfolio project.",
    "Do not keyword-stuff, invent clients, brands, campaign results, tools, deliverables or project details.",
    "Keep the title descriptive and compelling, ideally 45–65 characters when natural, and never exceed 120 characters.",
    "Write a useful description around 120–300 characters when the available facts allow it; never exceed 1000 characters.",
    "Write concise, accessible image alt text that describes the design shown only to the extent supported by the supplied context; never exceed 300 characters.",
    "Use the focus keyword naturally when provided. Do not force it if it does not fit.",
    "Return only a valid JSON object with exactly these string keys: title, description, altText.",
  ].join(" ");

  const userPrompt = [
    `Portfolio category: ${category}`,
    `Current project title: ${title}`,
    `Current project description: ${description || "Not provided"}`,
    `Focus keyword: ${focusKeyword || "Choose a relevant phrase based only on the supplied information"}`,
    `Pinterest project URL: ${pinUrl || "Not provided"}`,
    "Create improved SEO metadata. Keep the wording specific to this design portfolio item, not generic marketing copy.",
  ].join("\n");

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.35,
        max_completion_tokens: 700,
        response_format: { type: "json_object" },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      console.error("Groq SEO generation failed:", response.status, await response.text().catch(() => ""));
      return NextResponse.json({ error: "AI could not generate suggestions right now. Please try again." }, { status: 502 });
    }

    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    if (typeof content !== "string") throw new Error("AI returned an empty response.");

    const parsed = JSON.parse(content) as { title?: unknown; description?: unknown; altText?: unknown };
    const generated = {
      title: clean(parsed.title, 120),
      description: clean(parsed.description, 1000),
      altText: clean(parsed.altText, 300),
    };
    if (!generated.title || !generated.description || !generated.altText) {
      throw new Error("AI returned incomplete SEO metadata.");
    }

    return NextResponse.json(generated, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin SEO generation error:", error);
    return NextResponse.json({ error: "SEO suggestions could not be generated. Please try again." }, { status: 502 });
  }
}
