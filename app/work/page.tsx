import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PinterestProjects } from "../components/pinterest-projects";

export default function WorkPage() {
  return (
    <main className="site-shell">
      <div className="reference-site pinterest-all-work-page">
        <header className="pinterest-all-work-header">
          <Link href="/" className="pinterest-back-home"><ArrowLeft size={16} /> Back to portfolio</Link>
          <p>/ COMPLETE WORK SHOWCASE</p>
          <h1>Selected <em>work.</em></h1>
          <span>Designs and creative projects from Pinterest.</span>
        </header>
        <section className="reference-work pinterest-all-work-section">
          <PinterestProjects fullPage />
        </section>
      </div>
    </main>
  );
}
