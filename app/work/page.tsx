import type { Metadata } from "next";
import Link from "next/link";
import { NextRequest } from "next/server";
import { ArrowLeft } from "lucide-react";
import { GET as getPinterestPins } from "../api/pinterest/pins/route";
import { PinterestProjects, type PinResponse } from "../components/pinterest-projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Design Portfolio | UI/UX, Graphic & Print Projects",
  description:
    "Explore Rizwan Khan's selected design projects, from social media campaigns and visual communication to UI/UX concepts and print-ready design. View the original work on Pinterest.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Selected Design Work | Rizwan Khan",
    description:
      "A portfolio of social media, UI/UX, graphic and print design projects by Rizwan Khan.",
    url: "https://creativerizz.in/work",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default async function WorkPage() {
  let initialData: PinResponse = {
    configured: false,
    pins: [],
    message: "Pinterest projects are temporarily unavailable.",
  };

  try {
    const response = await getPinterestPins(
      new NextRequest("https://creativerizz.in/api/pinterest/pins")
    );
    if (response.ok) {
      initialData = (await response.json()) as PinResponse;
    }
  } catch (error) {
    console.error("Server-rendered Pinterest portfolio load failed:", error);
  }

  return (
    <main className="site-shell">
      <div className="reference-site pinterest-all-work-page">
        <header className="pinterest-all-work-header">
          <Link href="/" className="pinterest-back-home"><ArrowLeft size={16} /> Back to portfolio</Link>
          <p>/ COMPLETE WORK SHOWCASE</p>
          <h1>Selected <em>work.</em></h1>
          <span>Explore selected social media, UI/UX and printed design work by Rizwan Khan.</span>
        </header>
        <section className="reference-work pinterest-all-work-section" aria-label="Design portfolio projects">
          <PinterestProjects fullPage initialData={initialData} />
        </section>
      </div>
    </main>
  );
}
