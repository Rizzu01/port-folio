import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PinterestProjects } from "../components/pinterest-projects";

export const metadata: Metadata = {
  title: "Selected Design Work | UI/UX, Graphic & Print Design",
  description:
    "Browse selected design work by Rizwan Khan, including social media campaigns, UI/UX concepts and printed design projects. Explore the portfolio and view original Pins.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Selected Design Work | Rizwan Khan",
    description:
      "Social media, UI/UX and print design projects from Rizwan Khan's portfolio.",
    url: "https://creativerizz.in/work",
    type: "website",
  },
};

export default function WorkPage() {
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
          <PinterestProjects fullPage />
        </section>
      </div>
    </main>
  );
}
