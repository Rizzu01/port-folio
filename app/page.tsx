"use client";
import { useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Mail, Palette, PanelsTopLeft, Printer, Sparkles, X } from "lucide-react";

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", purpose: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success">("idle");
  const [submitError, setSubmitError] = useState("");

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSubmitError("");

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
    if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE") {
      setSubmitError("Email submission is not configured yet. Please add your Web3Forms Access Key.");
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

  return <main className="site-shell"><div className="page-frame portfolio-frame">
    <header className="topbar"><a className="brand" href="#home">Rizwan<span>°</span></a><nav className="nav-pill" aria-label="Main navigation"><a href="#home">Home</a><a href="#visual-design">Visual Design</a><a href="#ui-ux">UI/UX</a><a href="#branding">Branding</a></nav><a className="app-link" href="https://wa.me/919024043673" target="_blank" rel="noopener noreferrer">Let’s talk <ArrowUpRight size={14}/></a></header>
    <section className="hero portfolio-hero" id="home">
      <div className="hero-copy"><div className="portfolio-eyebrow"><span className="availability-dot"/> DESIGNER · VISUAL THINKER · CREATIVE PROBLEM SOLVER</div><h1>Designing with<br/><em>meaning & feeling.</em></h1><p className="hero-subtitle">I’m Rizwan Khan — a designer focused on visual communication, branding,<br className="desktop-break"/> digital experiences, and thoughtful UI/UX.</p><div className="hero-actions"><a className="button button-dark" href="#experience">Explore my work <ArrowRight size={16}/></a><button className="button button-light" type="button" onClick={() => { setSubmitStatus("idle"); setContactOpen(true); }}><Mail size={15}/> Get in touch</button></div></div>
      <div className="orbit-stamp"><span className="stamp-top">DESIGN WITH INTENT</span><span className="stamp-star">✳</span><span className="stamp-bottom">STAY CURIOUS</span></div>
      <div className="float-card thought-card"><span className="mini-icon"><Palette size={17}/></span><strong>Visual stories<br/>that connect.</strong><p>Branding, graphics<br/>and digital craft.</p></div>
      <div className="float-card sync-card"><div className="avatar-stack"><span>U</span><span>I</span><span>✳</span></div><strong>Thoughtful by design.</strong><p>Purposeful details.<br/>Clear experiences.</p></div>
      <div className="portrait-stage"><div className="portrait-halo"/><div className="portrait-mask"><img src="/portrait.png" alt="Rizwan Khan portrait"/></div><div id="visual-design" className="floating-panel panel-focus"><span className="panel-icon green"><CheckIcon/></span><div><strong>Visual Design</strong><small>Shape the story clearly.</small></div></div><div id="ui-ux" className="floating-panel panel-ideas"><span className="panel-icon purple"><PanelsTopLeft size={15}/></span><div><strong>UI / UX</strong><small>Make every interaction count.</small></div></div><div id="branding" className="floating-panel panel-plan"><span className="panel-icon orange"><Sparkles size={15}/></span><div><strong>Branding</strong><small>Build a memorable identity.</small></div></div><div className="floating-panel panel-print"><span className="panel-icon orange"><Printer size={15}/></span><div><strong>Print Ready Design</strong><small>Production-ready artwork.</small></div></div></div>
      <div className="trust-note"><span className="tiny-rule"/><p>Design meets function.<br/>Details make the difference.</p><div className="trust-avatars"><span>V</span><span>U</span><span>G</span><span>D</span></div></div><div className="clarity-note"><span className="clarity-star">✳</span><span className="tiny-rule"/><p>Make it clear.<br/>Make it matter.</p></div>
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
        <button className="button button-dark contact-submit" type="button" onClick={() => { setContactOpen(false); setSubmitStatus("idle"); }}>Done <ArrowRight size={16}/></button>
      </div> : <form className="contact-form" onSubmit={submitContact}>
        <input type="checkbox" name="botcheck" tabIndex={-1} aria-hidden="true" className="contact-honeypot" />
        {submitError && <p className="contact-error" role="alert">{submitError}</p>}
        <label>Name<input name="name" required autoComplete="name" value={form.name} onChange={(event) => setForm({...form, name: event.target.value})} placeholder="Your full name"/></label>
        <label>Email<input name="email" required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({...form, email: event.target.value})} placeholder="you@example.com"/></label>
        <label>Number<input name="phone" required type="tel" autoComplete="tel" value={form.phone} onChange={(event) => setForm({...form, phone: event.target.value})} placeholder="+91 98765 43210"/></label>
        <label>Purpose of contact<select name="purpose" required value={form.purpose} onChange={(event) => setForm({...form, purpose: event.target.value})}><option value="" disabled>Select a purpose</option><option>UI/UX Design</option><option>Visual Design</option><option>Print Ready Design</option><option>Branding</option><option>Website / Development</option><option>Freelance Collaboration</option><option>Other</option></select></label>
        <button className="button button-dark contact-submit" type="submit" disabled={submitStatus === "loading"}>{submitStatus === "loading" ? <>Submitting... <span className="button-spinner" aria-hidden="true"/></> : submitStatus === "success" ? <>Submitted! <span className="button-check" aria-hidden="true">✓</span></> : <>Send Message <ArrowRight size={16}/></>}</button>
      </form>}
    </section>
  </div>}
</main>;
}
function CheckIcon(){return <Sparkles size={15}/>;}
