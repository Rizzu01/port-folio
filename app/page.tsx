"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Mail, Menu, Palette, PanelsTopLeft, Printer, Sparkles, X, Linkedin } from "lucide-react";
import { setupPortfolioAnimations } from "./portfolio-animations";

// Generate the Web3Forms Access Key for creativerizz.in@gmail.com, then paste it here. Access keys are intended for client-side use.
const WEB3FORMS_ACCESS_KEY = "b7401cb5-7c06-4ff0-863e-cf86c6d2eb11";

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pageRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(any-pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cursor = cursorRef.current;
    if (!cursor) return;
    document.body.classList.add("custom-cursor-enabled");
    const move = (event: MouseEvent) => {
      cursor.style.setProperty("--cursor-x", `${event.clientX}px`);
      cursor.style.setProperty("--cursor-y", `${event.clientY}px`);
      cursor.classList.add("cursor-visible");
      const target = event.target;
      cursor.classList.toggle("cursor-hover", target instanceof Element && Boolean(target.closest("a, button, input, select, textarea, [role=button]")));
    };
    const down = () => cursor.classList.add("cursor-pressed");
    const up = () => cursor.classList.remove("cursor-pressed");
    const leave = () => cursor.classList.remove("cursor-visible", "cursor-hover");
    window.addEventListener("pointermove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);
    return () => {
      document.body.classList.remove("custom-cursor-enabled");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".reference-nav");
    if (!header) return;
    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 32);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    return setupPortfolioAnimations(root);
  }, []);

  const [form, setForm] = useState({ name: "", email: "", phone: "", purpose: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success">("idle");
  const [submitError, setSubmitError] = useState("");

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSubmitError("");

    const accessKey = WEB3FORMS_ACCESS_KEY.trim();
    if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE") {
      setSubmitError("Email submission is not configured yet. Add the Web3Forms Access Key generated for creativerizz.in@gmail.com in app/page.tsx.");
      return;
    }

    setSubmitStatus("loading");
    try {
      const formData = new FormData(formElement);
      formData.set("access_key", accessKey);
      formData.set("subject", `Portfolio contact: ${form.purpose}`);
      formData.set("from_name", "Rizwan Khan Portfolio");
      formData.set("name", form.name.trim());
      formData.set("email", form.email.trim());
      formData.set("phone", form.phone.trim());
      formData.set("purpose", form.purpose);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      const result: { success?: boolean; message?: string; body?: { message?: string } } = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || result.body?.message || "The email service could not accept your message.");
      }

      await new Promise<void>((resolve) => window.setTimeout(resolve, 1000));
      setForm({ name: "", email: "", phone: "", purpose: "" });
      formElement.reset();
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("idle");
      setSubmitError("Your message couldn’t be sent. Please check your connection and try again.");
    }
  }

  return <main ref={pageRef} className="site-shell"><div className="custom-cursor" ref={cursorRef} aria-hidden="true"><span /></div>

  <div className="reference-site">
    <header className={`reference-nav${mobileNavOpen ? " reference-nav-open" : ""}`}>
      <a className="reference-logo" href="#home" aria-label="Rizwan Khan — Home"><img src="/Logo.svg" alt="Rizwan Khan logo"/></a>
      <nav className="reference-desktop-links" aria-label="Main navigation"><a href="#home">Home</a><a href="#work">Work</a><a href="#services">Services</a><a href="#experience">Experience</a><a href="#contact">Contact</a></nav>
      <a className="reference-talk" href="https://wa.me/919024043673" target="_blank" rel="noopener noreferrer">Let’s talk <ArrowUpRight size={13}/></a>
      <div className="reference-social-links" aria-label="Social profiles">
        <a href="https://in.pinterest.com/Creative___Rizz/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" title="Pinterest"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.64 19.31c-.02-.78 0-1.72.19-2.58l1.35-5.72s-.34-.68-.34-1.68c0-1.57.91-2.75 2.04-2.75.96 0 1.42.72 1.42 1.58 0 .96-.61 2.39-.92 3.72-.26 1.11.56 2.02 1.65 2.02 1.98 0 3.51-2.09 3.51-5.11 0-2.67-1.92-4.53-4.66-4.53-3.17 0-5.03 2.38-5.03 4.84 0 .96.37 1.99.83 2.55a.33.33 0 0 1 .08.32l-.31 1.27c-.05.2-.17.24-.39.14-1.47-.69-2.39-2.84-2.39-4.57 0-3.72 2.7-7.13 7.79-7.13 4.09 0 7.27 2.92 7.27 6.82 0 4.07-2.57 7.35-6.13 7.35-1.2 0-2.34-.63-2.73-1.37l-.74 2.8c-.27 1.02-1 2.29-1.49 3.06A10 10 0 1 0 12 2Z"/></svg></a>
        <a href="https://www.behance.net/creativeriz01" target="_blank" rel="noopener noreferrer" aria-label="Behance" title="Behance"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h8.1c3.05 0 4.82 1.56 4.82 4.03 0 1.58-.75 2.69-2.08 3.25 1.82.47 2.8 1.78 2.8 3.67C16.64 18.8 14.46 20 11.5 20H3V5Zm4 3v3h3.55c.91 0 1.42-.52 1.42-1.5S11.46 8 10.55 8H7Zm0 6v3h4.15c.94 0 1.55-.5 1.55-1.5 0-1.04-.61-1.5-1.55-1.5H7Zm10-7h5v1.7h-5V7Zm2.5 3c3.13 0 4.5 2.27 4.5 5.1v.6h-6.4c.1 1.22.75 1.9 1.9 1.9.72 0 1.4-.32 1.62-.9h2.65c-.5 1.9-2.2 2.9-4.3 2.9-2.9 0-4.7-1.9-4.7-4.8 0-2.9 1.8-4.8 4.73-4.8Zm0 2c-.96 0-1.58.56-1.82 1.7h3.48c-.1-1.1-.7-1.7-1.66-1.7Z"/></svg></a>
        <a href="https://www.linkedin.com/in/rizwan-khan-44771826b/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><Linkedin size={16} strokeWidth={2}/></a>
      </div>
      <button className="reference-menu-toggle" type="button" aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen(!mobileNavOpen)}>{mobileNavOpen ? <X size={18}/> : <Menu size={18}/>}</button>
      <div className="reference-mobile-menu"><a href="#home" onClick={() => setMobileNavOpen(false)}>Home</a><a href="#work" onClick={() => setMobileNavOpen(false)}>Work</a><a href="#services" onClick={() => setMobileNavOpen(false)}>Services</a><a href="#experience" onClick={() => setMobileNavOpen(false)}>Experience</a><a href="#contact" onClick={() => setMobileNavOpen(false)}>Contact</a><a href="https://wa.me/919024043673" target="_blank" rel="noopener noreferrer" onClick={() => setMobileNavOpen(false)}>Let’s talk ↗</a></div>
    </header>
    <section className="hero portfolio-hero" id="home">
      <div className="hero-copy"><div className="portfolio-eyebrow"><span className="availability-dot"/> DESIGNER · VISUAL THINKER · CREATIVE PROBLEM SOLVER</div><h1>Designing with<br/><em>meaning &amp; feeling.</em></h1><p className="hero-subtitle">I’m Rizwan Khan — a designer focused on visual communication, branding,<br className="desktop-break"/> digital experiences, and thoughtful UI/UX.</p><div className="hero-actions"><a className="button button-dark" href="#work">Explore my work <ArrowRight size={16}/></a><button className="button button-light" type="button" onClick={() => { setSubmitStatus("idle"); setContactOpen(true); }}><Mail size={15}/> Get in touch</button></div><div className="hero-socials" aria-label="Social profiles"><a href="https://in.pinterest.com/Creative___Rizz/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest profile" title="Pinterest"><SocialMark network="pinterest"/></a><a href="https://www.behance.net/creativeriz01" target="_blank" rel="noopener noreferrer" aria-label="Behance profile" title="Behance"><SocialMark network="behance"/></a><a href="https://www.linkedin.com/in/rizwan-khan-44771826b/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" title="LinkedIn"><SocialMark network="linkedin"/></a></div></div>
      <div className="orbit-stamp"><span className="stamp-top">DESIGN WITH INTENT</span><span className="stamp-star">✳</span><span className="stamp-bottom">STAY CURIOUS</span></div>
      <div className="float-card thought-card"><span className="mini-icon"><Palette size={17}/></span><strong>Visual stories<br/>that connect.</strong><p>Branding, graphics<br/>and digital craft.</p></div>
      <div className="float-card sync-card"><div className="avatar-stack"><span>U</span><span>I</span><span>✳</span></div><strong>Thoughtful by design.</strong><p>Purposeful details.<br/>Clear experiences.</p></div>
      <div className="portrait-stage"><div className="portrait-halo"/><div className="portrait-mask"><img src="/portrait.png" alt="Rizwan Khan portrait"/></div><div id="visual-design" className="floating-panel panel-focus"><span className="panel-icon green"><CheckIcon/></span><div><strong>Visual Design</strong><small>Shape the story clearly.</small></div></div><div id="ui-ux" className="floating-panel panel-ideas"><span className="panel-icon purple"><PanelsTopLeft size={15}/></span><div><strong>UI / UX</strong><small>Make every interaction count.</small></div></div><div id="branding" className="floating-panel panel-plan"><span className="panel-icon orange"><Sparkles size={15}/></span><div><strong>Branding</strong><small>Build a memorable identity.</small></div></div><div className="floating-panel panel-print"><span className="panel-icon orange"><Printer size={15}/></span><div><strong>Print Ready Design</strong><small>Production-ready artwork.</small></div></div></div>
      <div className="trust-note"><span className="tiny-rule"/><p>Design meets function.<br/>Details make the difference.</p><div className="trust-avatars"><span>V</span><span>U</span><span>G</span><span>D</span></div></div><div className="clarity-note"><span className="clarity-star">✳</span><span className="tiny-rule"/><p>Make it clear.<br/>Make it matter.</p></div>
    </section>
    <section className="reference-about" id="about">
      <div className="reference-section-heading"><span className="reference-ghost-title">ABOUT</span><p>/ A LITTLE ABOUT ME</p><span className="reference-section-note">The person behind the pixels</span></div>
      <div className="reference-about-layout">
        <div className="reference-about-image"><img src="/About.png" alt="Rizwan Khan at work"/><span>CURIOUS BY NATURE · DESIGNER BY CHOICE</span></div>
        <div className="reference-about-copy">
          <h2>I believe good design should <em>feel as good as it looks.</em></h2>
          <p>I’m Rizwan, a graphic and UI/UX designer who enjoys turning complex ideas into clear, thoughtful visual experiences. My work moves between brand communication, digital products, and web design.</p>
          <p>I care about the small details, the bigger picture, and making every design decision serve a purpose.</p>
          <div className="reference-about-values"><div><span>01</span><strong>Think with clarity</strong></div><div><span>02</span><strong>Design with purpose</strong></div><div><span>03</span><strong>Care about details</strong></div></div>
          <a className="reference-about-link" href="#experience">A little more about my journey <ArrowUpRight size={14}/></a>
        </div>
      </div>
    </section>
    <section className="reference-work" id="work">
      <div className="reference-section-heading"><span className="reference-ghost-title">PORTFOLIO</span><p>/ SELECTED WORK</p><span className="reference-section-note">A selection of visual and digital projects</span></div>
      <div className="reference-project-grid reference-project-grid-real">
        <a className="reference-project project-crypto" href="#contact"><div className="reference-project-image"><img src="/U-1.jpg" alt="BitZup crypto campaign and social media creative designs" loading="lazy"/></div><div className="reference-project-caption"><div><h3>Crypto Campaigns</h3><p>Visual design · Digital marketing</p></div><span>↗</span></div></a>
        <a className="reference-project project-product" href="#contact"><div className="reference-project-image"><img src="/U-2.jpg" alt="Software company website UI and web design mockup" loading="lazy"/></div><div className="reference-project-caption"><div><h3>UI/UX &amp; Web Design</h3><p>Website design · Digital experiences</p></div><span>↗</span></div></a>
        <a className="reference-project project-brand" href="#contact"><div className="reference-project-image"><img src="/U-3.jpg" alt="Social media product creative designs displayed in a portfolio mockup" loading="lazy"/></div><div className="reference-project-caption"><div><h3>Social Media Creatives</h3><p>Product visuals · Campaign design</p></div><span>↗</span></div></a>
        <a className="reference-project project-brand" href="#contact"><div className="reference-project-image"><img src="/U-4.jpg" alt="Branding and creative design project displayed in a portfolio mockup" loading="lazy"/></div><div className="reference-project-caption"><div><h3>Branding &amp; Creative Design</h3><p>Brand identity · Visual communication</p></div><span>↗</span></div></a>
      </div>
      <a className="reference-all-work" href="https://www.behance.net/" target="_blank" rel="noopener noreferrer">Explore more work <ArrowUpRight size={14}/></a>
    </section>
    <section className="reference-services" id="services">
      <div className="reference-section-heading"><span className="reference-ghost-title">SERVICES</span><p>/ WHAT I DO</p></div>
      <div className="reference-service-list">
        <a href="#contact"><span className="reference-service-index">01</span><span className="reference-service-name">Visual Design</span><span className="reference-service-detail">Campaigns, social media, marketing assets</span><ArrowUpRight size={17}/></a>
        <a href="#contact"><span className="reference-service-index">02</span><span className="reference-service-name">UI/UX Design</span><span className="reference-service-detail">Research-led, intuitive digital products</span><ArrowUpRight size={17}/></a>
        <a href="#contact"><span className="reference-service-index">03</span><span className="reference-service-name">Web Design &amp; Development</span><span className="reference-service-detail">Responsive websites and landing pages</span><ArrowUpRight size={17}/></a>
        <a href="#contact"><span className="reference-service-index">04</span><span className="reference-service-name">Branding</span><span className="reference-service-detail">Identity systems and visual direction</span><ArrowUpRight size={17}/></a>
      </div>
    </section>
    <section className="reference-experience" id="experience">
      <div className="reference-experience-top"><div><span className="reference-dark-kicker">/ EXPERIENCE</span><h2>Good work comes<br/>from <em>good thinking.</em></h2></div><span className="reference-experience-years">4+ years of experience</span></div>
      <div className="reference-experience-list">
        <article><div><h3>SunCrypto</h3><p>Graphic Designer &amp; UI/UX Designer</p></div><span>Nov 2024 — Present</span><div className="reference-company-note">Campaign design, brand communication, email marketing and digital experiences.</div></article>
        <article><div><h3>Doomshell Software Pvt. Ltd.</h3><p>Graphic Designer &amp; UI/UX Designer</p></div><span>2023 — 2024</span><div className="reference-company-note">Responsive interfaces, functional layouts and usability improvements.</div></article>
        <article><div><h3>TDI Online Services</h3><p>Graphic Designer</p></div><span>2022 — 2023</span><div className="reference-company-note">Digital marketing creatives, branding and visual communication.</div></article>
      </div>
    </section>
    <section className="reference-contact" id="contact"><span className="reference-contact-kicker"><span/> Available for new projects</span><h2>Have a project<br/>in mind<span>?</span></h2><p>Let’s create something thoughtful, useful, and memorable together.</p><button className="reference-pill-button" type="button" onClick={() => { setSubmitStatus("idle"); setContactOpen(true); }}>Start a conversation <ArrowUpRight size={13}/></button><div className="reference-contact-footer"><span>RIZWAN KHAN · DESIGNER</span><a href="mailto:creativerizz.in@gmail.com">CREATIVERIZZ.IN@GMAIL.COM</a><span>© 2026</span></div></section>
  </div>
  {contactOpen && <div className="contact-modal-backdrop" onClick={() => setContactOpen(false)}>
    <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title" onClick={(event) => event.stopPropagation()}>
      <button className="contact-modal-close" type="button" aria-label="Close contact form" onClick={() => { setContactOpen(false); setSubmitStatus("idle"); }}><X size={18}/></button>
      <span className="contact-modal-kicker">LET'S CONNECT</span>
      <h2 id="contact-modal-title">Tell me about your project.</h2>
      <p>Share a few details and I’ll get back to you.</p>
      {submitStatus === "success" ? <div className="contact-feedback contact-success" role="status">
        <span className="success-check"><svg viewBox="0 0 36 36" aria-hidden="true"><path d="M8 18.5 15 25l13-14"/></svg></span>
        <h3>Message submitted!</h3>
        <p>Thanks for reaching out. Your message has been sent successfully, and I’ll get back to you soon.</p>
        <button className="button button-dark contact-submit" type="button" onClick={() => { setContactOpen(false); setSubmitStatus("idle"); }}>Submitted!</button>
      </div> : <form className="contact-form" onSubmit={submitContact}>
        <input type="checkbox" name="botcheck" tabIndex={-1} aria-hidden="true" className="contact-honeypot" />
        {submitError && <p className="contact-error" role="alert">{submitError}</p>}
        <label>Name<input name="name" required autoComplete="name" value={form.name} onChange={(event) => setForm({...form, name: event.target.value})} placeholder="Your full name"/></label>
        <label>Email<input name="email" required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({...form, email: event.target.value})} placeholder="you@example.com"/></label>
        <label>Number<input name="phone" required type="tel" autoComplete="tel" value={form.phone} onChange={(event) => setForm({...form, phone: event.target.value})} placeholder="+91 98765 43210"/></label>
        <label>Purpose of contact<select name="purpose" required value={form.purpose} onChange={(event) => setForm({...form, purpose: event.target.value})}><option value="" disabled>Select a purpose</option><option>UI/UX Design</option><option>Visual Design</option><option>Print Ready Design</option><option>Branding</option><option>Website / Development</option><option>Freelance Collaboration</option><option>Other</option></select></label>
        <button className="button button-dark contact-submit" type="submit" disabled={submitStatus === "loading"}>{submitStatus === "loading" ? <>Submitting... <span className="button-spinner" aria-hidden="true"/></> : <>Submit <ArrowRight size={16}/></>}</button>
      </form>}
    </section>
  </div>}
</main>;
}
function CheckIcon(){return <Sparkles size={15}/>;}

function SocialMark({ network }: { network: "pinterest" | "behance" | "linkedin" }) {
  if (network === "pinterest") return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.64 19.31c-.02-.78 0-1.72.19-2.57l1.35-5.72s-.34-.68-.34-1.68c0-1.57.91-2.74 2.05-2.74.97 0 1.44.73 1.44 1.6 0 .97-.62 2.43-.94 3.78-.27 1.13.57 2.05 1.68 2.05 2.01 0 3.56-2.12 3.56-5.18 0-2.71-1.95-4.6-4.74-4.6-3.23 0-5.13 2.42-5.13 4.92 0 .98.38 2.03.85 2.6.09.11.1.21.07.33l-.32 1.3c-.05.21-.17.25-.39.15-1.45-.68-2.36-2.79-2.36-4.49 0-3.65 2.65-7 7.64-7 4.01 0 7.13 2.86 7.13 6.68 0 3.98-2.51 7.18-6 7.18-1.17 0-2.27-.61-2.65-1.33l-.72 2.74c-.26 1-.96 2.24-1.43 3A10 10 0 1 0 12 2Z"/></svg>;
  if (network === "behance") return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8.2 11.1c1.25-.58 1.9-1.47 1.9-2.83 0-2.4-1.78-3.56-4.16-3.56H1v14.57h5.09c2.55 0 4.9-1.23 4.9-4.1 0-1.97-1.06-3.52-2.79-4.08ZM4.05 7.1h1.67c1.15 0 1.95.33 1.95 1.56 0 1.18-.9 1.61-1.97 1.61H4.05V7.1Zm1.99 9.7H4.05v-4.13h2.03c1.37 0 2.56.48 2.56 2.03 0 1.58-1.16 2.1-2.6 2.1ZM15 7h5V5.5h-5V7Zm3.07 2.1c-3.12 0-5.05 2.36-5.05 5.28 0 3.02 1.87 5.1 5.15 5.1 2.28 0 4.14-1.06 4.7-3.32h-2.68c-.2.72-1.12 1.1-1.94 1.1-1.47 0-2.27-.86-2.31-2.34H23c.22-3.1-1.49-5.82-4.93-5.82Zm-2.1 4.04c.1-1.14.85-1.9 2.08-1.9 1.26 0 1.94.76 2.06 1.9h-4.14Z"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.23 0Z"/></svg>;
}
