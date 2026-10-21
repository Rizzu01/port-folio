"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Mail, Menu, Palette, PanelsTopLeft, Printer, Sparkles, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const motion = gsap.matchMedia();
    const context = gsap.context(() => {
      // A gentle, scroll-linked depth effect in the hero — not scroll-jacking.
      gsap.to(".portrait-stage", {
        yPercent: -9,
        ease: "none",
        scrollTrigger: {
          trigger: ".portfolio-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });
      gsap.to(".thought-card", {
        y: -42,
        rotate: -3,
        ease: "none",
        scrollTrigger: {
          trigger: ".portfolio-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.4,
        },
      });
      gsap.to(".sync-card", {
        y: -24,
        rotate: 3,
        ease: "none",
        scrollTrigger: {
          trigger: ".portfolio-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.6,
        },
      });

      gsap.fromTo(".about-topline",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.85, ease: "power3.out",
          scrollTrigger: { trigger: ".about-section", start: "top 82%", once: true } }
      );
      gsap.fromTo(".about-portrait-wrap",
        { opacity: 0, y: 44, rotate: -2, scale: 0.97 },
        { opacity: 1, y: 0, rotate: 0, scale: 1, duration: 1.05, ease: "power3.out",
          scrollTrigger: { trigger: ".about-layout", start: "top 78%", once: true } }
      );
      gsap.fromTo(".about-intro",
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".about-intro", start: "top 84%", once: true } }
      );
      gsap.fromTo(".about-description > *",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.72, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: ".about-description", start: "top 84%", once: true } }
      );
      gsap.fromTo(".about-principles article",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.14, ease: "power3.out",
          scrollTrigger: { trigger: ".about-principles", start: "top 88%", once: true } }
      );

      // Keep the motion setup scoped to this page and responsive to viewport changes.
      motion.add("(min-width: 861px)", () => {
        gsap.to(".about-photo-accent", {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-portrait-wrap",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });
    }, root);

    return () => {
      context.revert();
      motion.revert();
    };
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
      <button className="reference-menu-toggle" type="button" aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen(!mobileNavOpen)}>{mobileNavOpen ? <X size={18}/> : <Menu size={18}/>}</button>
      <div className="reference-mobile-menu"><a href="#home" onClick={() => setMobileNavOpen(false)}>Home</a><a href="#work" onClick={() => setMobileNavOpen(false)}>Work</a><a href="#services" onClick={() => setMobileNavOpen(false)}>Services</a><a href="#experience" onClick={() => setMobileNavOpen(false)}>Experience</a><a href="#contact" onClick={() => setMobileNavOpen(false)}>Contact</a><a href="https://wa.me/919024043673" target="_blank" rel="noopener noreferrer" onClick={() => setMobileNavOpen(false)}>Let’s talk ↗</a></div>
    </header>
    <section className="hero portfolio-hero" id="home">
      <div className="hero-copy"><div className="portfolio-eyebrow"><span className="availability-dot"/> DESIGNER · VISUAL THINKER · CREATIVE PROBLEM SOLVER</div><h1>Designing with<br/><em>meaning &amp; feeling.</em></h1><p className="hero-subtitle">I’m Rizwan Khan — a designer focused on visual communication, branding,<br className="desktop-break"/> digital experiences, and thoughtful UI/UX.</p><div className="hero-actions"><a className="button button-dark" href="#work">Explore my work <ArrowRight size={16}/></a><button className="button button-light" type="button" onClick={() => { setSubmitStatus("idle"); setContactOpen(true); }}><Mail size={15}/> Get in touch</button></div></div>
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
      <div className="reference-project-grid">
        <a className="reference-project project-crypto" href="#contact"><div className="project-art project-art-crypto"><span className="project-art-label">SUNCRYPTO / CAMPAIGNS</span><div className="project-coin">₿</div><strong>MAKE<br/>YOUR MOVE.</strong><span className="project-art-footer">DESIGN THAT MOVES MARKETS</span></div><div className="reference-project-caption"><div><h3>Crypto Campaigns</h3><p>Visual design · Digital marketing</p></div><span>↗</span></div></a>
        <a className="reference-project project-product" href="#contact"><div className="project-art project-art-product"><span className="project-art-label">DIGITAL PRODUCT / UI UX</span><div className="product-window"><div className="product-window-bar"><i/><i/><i/></div><div className="product-window-content"><span>Good design<br/>feels effortless.</span><div className="product-window-shape"/></div></div><span className="project-art-footer">INTERFACES WITH INTENT</span></div><div className="reference-project-caption"><div><h3>Digital Experiences</h3><p>UI/UX design · Web design</p></div><span>↗</span></div></a>
        <a className="reference-project project-brand" href="#contact"><div className="project-art project-art-brand"><span className="project-art-label">IDENTITY / BRANDING</span><div className="brand-monogram">K<span>.</span></div><strong>BUILT TO<br/>BE REMEMBERED.</strong><span className="project-art-footer">IDENTITY &amp; ART DIRECTION</span></div><div className="reference-project-caption"><div><h3>Brand Identity</h3><p>Branding · Art direction</p></div><span>↗</span></div></a>
        <a className="reference-project project-print" href="#contact"><div className="project-art project-art-print"><span className="project-art-label">PRINT / CAMPAIGNS</span><div className="print-card"><span>IDEAS<br/>INTO<br/><em>IMPACT.</em></span><i>DESIGN STUDIO — 2026</i></div><span className="project-art-footer">FROM SCREEN TO PRINT</span></div><div className="reference-project-caption"><div><h3>Print &amp; Marketing</h3><p>Campaigns · Print-ready design</p></div><span>↗</span></div></a>
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
