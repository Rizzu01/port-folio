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
    const header = document.querySelector<HTMLElement>(".topbar");
    if (!header) return;
    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
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
    <header className={`topbar${mobileNavOpen ? " mobile-nav-open" : ""}`}><a className="brand" href="#home" onClick={() => setMobileNavOpen(false)}>Rizwan<span>°</span></a><nav className="nav-pill desktop-nav" aria-label="Main navigation"><a href="#home">Home</a><a href="#visual-design">Visual Design</a><a href="#ui-ux">UI/UX</a><a href="#branding">Branding</a></nav><a className="app-link desktop-talk" href="https://wa.me/919024043673" target="_blank" rel="noopener noreferrer">Let’s talk <ArrowUpRight size={14}/></a><button className="mobile-menu-toggle" type="button" aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen(!mobileNavOpen)}><span>{mobileNavOpen ? <X size={20}/> : <Menu size={20}/>}</span></button><div className="mobile-nav-drawer" aria-hidden={!mobileNavOpen}><nav aria-label="Mobile navigation"><a href="#home" onClick={() => setMobileNavOpen(false)}>Home <ArrowUpRight size={15}/></a><a href="#visual-design" onClick={() => setMobileNavOpen(false)}>Visual Design <ArrowUpRight size={15}/></a><a href="#ui-ux" onClick={() => setMobileNavOpen(false)}>UI/UX <ArrowUpRight size={15}/></a><a href="#branding" onClick={() => setMobileNavOpen(false)}>Branding <ArrowUpRight size={15}/></a></nav><a className="mobile-drawer-talk" href="https://wa.me/919024043673" target="_blank" rel="noopener noreferrer" onClick={() => setMobileNavOpen(false)}>Let’s talk <ArrowUpRight size={16}/></a></div></header>
  <div className="page-frame portfolio-frame">
    <section className="hero portfolio-hero" id="home">
      <div className="hero-copy"><div className="portfolio-eyebrow"><span className="availability-dot"/> DESIGNER · VISUAL THINKER · CREATIVE PROBLEM SOLVER</div><h1>Designing with<br/><em>meaning & feeling.</em></h1><p className="hero-subtitle">I’m Rizwan Khan — a designer focused on visual communication, branding,<br className="desktop-break"/> digital experiences, and thoughtful UI/UX.</p><div className="hero-actions"><a className="button button-dark" href="#experience">Explore my work <ArrowRight size={16}/></a><button className="button button-light" type="button" onClick={() => { setSubmitStatus("idle"); setContactOpen(true); }}><Mail size={15}/> Get in touch</button></div></div>
      <div className="orbit-stamp"><span className="stamp-top">DESIGN WITH INTENT</span><span className="stamp-star">✳</span><span className="stamp-bottom">STAY CURIOUS</span></div>
      <div className="float-card thought-card"><span className="mini-icon"><Palette size={17}/></span><strong>Visual stories<br/>that connect.</strong><p>Branding, graphics<br/>and digital craft.</p></div>
      <div className="float-card sync-card"><div className="avatar-stack"><span>U</span><span>I</span><span>✳</span></div><strong>Thoughtful by design.</strong><p>Purposeful details.<br/>Clear experiences.</p></div>
      <div className="portrait-stage"><div className="portrait-halo"/><div className="portrait-mask"><img src="/portrait.png" alt="Rizwan Khan portrait"/></div><div id="visual-design" className="floating-panel panel-focus"><span className="panel-icon green"><CheckIcon/></span><div><strong>Visual Design</strong><small>Shape the story clearly.</small></div></div><div id="ui-ux" className="floating-panel panel-ideas"><span className="panel-icon purple"><PanelsTopLeft size={15}/></span><div><strong>UI / UX</strong><small>Make every interaction count.</small></div></div><div id="branding" className="floating-panel panel-plan"><span className="panel-icon orange"><Sparkles size={15}/></span><div><strong>Branding</strong><small>Build a memorable identity.</small></div></div><div className="floating-panel panel-print"><span className="panel-icon orange"><Printer size={15}/></span><div><strong>Print Ready Design</strong><small>Production-ready artwork.</small></div></div></div>
      <div className="trust-note"><span className="tiny-rule"/><p>Design meets function.<br/>Details make the difference.</p><div className="trust-avatars"><span>V</span><span>U</span><span>G</span><span>D</span></div></div><div className="clarity-note"><span className="clarity-star">✳</span><span className="tiny-rule"/><p>Make it clear.<br/>Make it matter.</p></div>
    </section>
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-topline"><span>01 / A LITTLE ABOUT ME</span><span>DESIGNER · DELHI, INDIA</span></div>
      <div className="about-layout">
        <div className="about-portrait-wrap">
          <div className="about-photo-accent"/>
          <div className="about-portrait-frame"><img src="/About.png" alt="Rizwan Khan — portrait" loading="lazy"/></div>
          <div className="about-photo-caption"><span/> A little about me</div>
        </div>
        <div className="about-content">
          <div className="about-intro">
            <p className="about-kicker">BEHIND THE PIXELS</p>
            <h2 id="about-title">Curiosity first.<br/><em>Design with purpose.</em></h2>
          </div>
          <div className="about-description">
          <p className="about-lead">Hey, I’m Rizwan — a multidisciplinary designer who turns ideas into clear, thoughtful visual experiences.</p>
          <p>My work lives at the intersection of graphic design, branding, and UI/UX. I enjoy finding the story behind a brief, shaping it into a strong visual direction, and making sure every detail has a reason to be there.</p>
          <p>From brand identities and campaign creatives to intuitive digital products, I care about work that looks considered, feels human, and solves a real problem.</p>
          <a className="about-cta" href="#experience">A little more about my journey <ArrowRight size={15}/></a>
          </div>
        </div>
      </div>
      <div className="about-principles">
        <article><span>01</span><h3>Think clearly</h3><p>Understand the problem before jumping into the pixels.</p></article>
        <article><span>02</span><h3>Make it meaningful</h3><p>Build visual stories that connect people with ideas.</p></article>
        <article><span>03</span><h3>Care about details</h3><p>Balance craft, clarity, and function in every decision.</p></article>
      </div>
    </section>
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
