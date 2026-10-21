import Link from "next/link";

type ServicePageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  services: string[];
  process: { title: string; detail: string }[];
  workNote: string;
  keywords: string[];
};

export default function ServiceLanding({
  eyebrow,
  title,
  intro,
  services,
  process,
  workNote,
  keywords,
}: ServicePageProps) {
  return (
    <main style={{ minHeight: "100vh", background: "#f0f3ff", color: "#111110", padding: "28px 20px 72px", fontFamily: "'DM Sans', Arial, sans-serif" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, padding: "12px 0 56px" }}>
          <Link href="/" style={{ fontWeight: 700, letterSpacing: "-.04em", fontSize: 20 }}>CreativeRizz<span style={{ color: "#6a6d8f" }}>.</span></Link>
          <nav aria-label="Main navigation" style={{ display: "flex", gap: 18, flexWrap: "wrap", fontSize: 14 }}>
            <Link href="/#work">Work</Link>
            <Link href="/#experience">Experience</Link>
            <Link href="/#contact">Contact</Link>
          </nav>
        </header>
        <article style={{ background: "#fbfaf7", border: "1px solid #fff", borderRadius: 24, padding: "clamp(28px, 6vw, 76px)", boxShadow: "0 12px 40px #495cbe12" }}>
          <p style={{ textTransform: "uppercase", letterSpacing: ".16em", fontSize: 12, color: "#62637a", fontWeight: 700 }}>{eyebrow}</p>
          <h1 style={{ fontSize: "clamp(40px, 7vw, 76px)", lineHeight: 1.02, letterSpacing: "-.055em", maxWidth: 850, margin: "20px 0 24px" }}>{title}</h1>
          <p style={{ fontSize: "clamp(17px, 2vw, 21px)", lineHeight: 1.7, maxWidth: 780, color: "#41414a" }}>{intro}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "32px 0 56px" }}>
            <Link href="/#contact" style={{ background: "#111110", color: "#fff", padding: "14px 20px", borderRadius: 999, fontWeight: 600 }}>Discuss a project ↗</Link>
            <Link href="/#work" style={{ border: "1px solid #d8d6cf", padding: "14px 20px", borderRadius: 999, fontWeight: 600 }}>Explore selected work</Link>
          </div>
          <section aria-labelledby="services-title" style={{ borderTop: "1px solid #e7e4dc", paddingTop: 30 }}>
            <h2 id="services-title" style={{ fontSize: 28, letterSpacing: "-.035em" }}>What I can help with</h2>
            <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, listStyle: "none", padding: 0, margin: "24px 0 52px" }}>
              {services.map((service) => <li key={service} style={{ border: "1px solid #e7e4dc", borderRadius: 14, padding: "17px 18px", lineHeight: 1.5 }}>{service}</li>)}
            </ul>
          </section>
          <section aria-labelledby="process-title">
            <h2 id="process-title" style={{ fontSize: 28, letterSpacing: "-.035em" }}>A thoughtful design process</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 22, margin: "24px 0 52px" }}>
              {process.map((step, index) => <div key={step.title} style={{ borderTop: "2px solid #171717", paddingTop: 16 }}><p style={{ color: "#77758a", fontSize: 12 }}>0{index + 1}</p><h3 style={{ fontSize: 19, margin: "8px 0" }}>{step.title}</h3><p style={{ lineHeight: 1.7, color: "#55545c" }}>{step.detail}</p></div>)}
            </div>
          </section>
          <section style={{ background: "#f0f3ff", borderRadius: 18, padding: "24px 26px", marginBottom: 36 }}>
            <h2 style={{ fontSize: 23, marginTop: 0 }}>Selected experience</h2>
            <p style={{ lineHeight: 1.7, marginBottom: 0 }}>{workNote}</p>
          </section>
          <section aria-labelledby="keywords-title">
            <h2 id="keywords-title" style={{ fontSize: 23 }}>Areas of focus</h2>
            <p style={{ lineHeight: 1.8, color: "#55545c" }}>{keywords.join(" · ")}</p>
          </section>
          <footer style={{ borderTop: "1px solid #e7e4dc", marginTop: 38, paddingTop: 24, display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
            <p style={{ margin: 0, color: "#55545c" }}>Rizwan Khan · Designer for digital and visual experiences</p>
            <Link href="/#contact" style={{ fontWeight: 700 }}>Get in touch ↗</Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
