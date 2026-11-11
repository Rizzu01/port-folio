import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type SeoRequest = {
  category?: unknown;
  title?: unknown;
  description?: unknown;
  pinUrl?: unknown;
  imageUrl?: unknown;
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
  const pinUrl = clean(body.pinUrl, 300);
  const imageUrl = clean(body.imageUrl, 2000);

  if (!category || !imageUrl) {
    return NextResponse.json({ error: "Project category and image are required." }, { status: 400 });
  }
  let image: URL;
  try {
    image = new URL(imageUrl);
    const host = image.hostname.toLowerCase();
    const trustedImageHost = host === "pinimg.com" || host.endsWith(".pinimg.com") || host === "pinterest.com" || host.endsWith(".pinterest.com");
    if (image.protocol !== "https:" || image.username || image.password || !trustedImageHost) throw new Error("Unsupported image host");
  } catch {
    return NextResponse.json({ error: "A valid Pinterest image URL is required." }, { status: 400 });
  }

  const systemPrompt = [
    "You are an expert portfolio SEO writer for CreativeRizz, a designer's personal design portfolio.",
    "Create accurate, natural, search-friendly portfolio metadata that showcases the designer's skills and creative execution, based primarily on the actual image analysis.",
    "Describe the specific visible objects, layout, typography, colors, subject and design style where relevant. Do not guess unreadable text.",
    "Do not keyword-stuff, invent clients, brands, campaign results, tools, deliverables or project details.",
    "Write a portfolio-focused title naming the design discipline or visual concept where supported. Avoid sales headlines and product-marketing titles. Ideally 45–65 characters; max 120.",
    "Write a portfolio description around 120–300 characters explaining the design work showcased and highlighting visible design skills and decisions. Do not sell the depicted product, promote the company, add calls to action, claim business results, or write product marketing copy. Never exceed 1000 characters.",
    "Write concise accessible alt text describing the actual visual design and its key visible elements, not promotional copy; max 300 characters.",
    "Return only a valid JSON object with exactly these string keys: title, description, altText.",
  ].join(" ");

  const makeUserPrompt = (imageAnalysis: string) => [
    `Portfolio category: ${category}`,
    `Current project title (may be missing): ${title || "Not provided"}`,
    `Current project description: ${description || "Not provided"}`,
    `Pinterest project URL (reference only): ${pinUrl || "Not provided"}`,
    `Image analysis (primary source): ${imageAnalysis}`,
    "Write for people searching for a designer's portfolio and design skills. The goal is to showcase the creator's visual design ability, not market the product or company shown. Make every field specific to the supplied image; avoid generic filler.",
  ].join("\n");

  try {
    // Download the Pinterest CDN image first; some CDN URLs reject direct provider fetches.
    const imageResponse = await fetch(image.href, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; CreativeRizzPortfolioBot/1.0)",
        "Referer": "https://www.pinterest.com/",
        "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!imageResponse.ok) {
      console.error("Pinterest image download failed:", imageResponse.status, image.hostname);
      return NextResponse.json({ error: "Could not load this Pinterest image. Please refresh the board and try again." }, { status: 502 });
    }
    const contentType = (imageResponse.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    if (!contentType.startsWith("image/") || contentType === "image/svg+xml") {
      return NextResponse.json({ error: "The selected Pinterest URL did not return a supported image." }, { status: 502 });
    }
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    if (!imageBuffer.length || imageBuffer.length > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "The selected image is empty or too large to analyse (15 MB maximum)." }, { status: 413 });
    }
    const imageDataUrl = "data:" + contentType + ";base64," + imageBuffer.toString("base64");

    const visionResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen/qwen3.8-27b",
        messages: [{ role: "user", content: [
          { type: "text", text: "Examine this portfolio design image carefully. Report only visible details: subject, objects, layout, typography or legible words, colors, visual style, and type of design. Be specific and factual. Do not invent a brand, client, text or context. If you cannot see the image, say IMAGE_NOT_VISIBLE." },
          { type: "image_url", image_url: { url: imageDataUrl } }
        ] }],
        temperature: 0.2,
        max_completion_tokens: 700
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(30000)
    });
    if (!visionResponse.ok) {
      console.error("Groq image analysis failed:", visionResponse.status, await visionResponse.text().catch(() => ""));
      return NextResponse.json({ error: "AI could not analyse this Pinterest image. Please try again." }, { status: 502 });
    }
    const visionPayload = await visionResponse.json();
    const imageAnalysis = visionPayload.choices?.[0]?.message?.content;
    if (typeof imageAnalysis !== "string" || !imageAnalysis.trim() || imageAnalysis.includes("IMAGE_NOT_VISIBLE")) {
      return NextResponse.json({ error: "AI could not see the selected image." }, { status: 502 });
    }
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: makeUserPrompt(imageAnalysis) },
        ],
        temperature: 0.35,
        max_completion_tokens: 700,

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

    const jsonText = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const jsonStart = jsonText.indexOf("{");
    const jsonEnd = jsonText.lastIndexOf("}");
    if (jsonStart < 0 || jsonEnd <= jsonStart) throw new Error("AI response did not contain JSON.");
    const parsed = JSON.parse(jsonText.slice(jsonStart, jsonEnd + 1)) as { title?: unknown; description?: unknown; altText?: unknown };
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
