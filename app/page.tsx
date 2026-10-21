"use client";
import { useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Mail, Palette, PanelsTopLeft, Printer, Sparkles, X } from "lucide-react";

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", purpose: "" });

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = [
      "Hi Rizwan, I'd like to get in touch.",
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Purpose: ${form.purpose}`,
    ].join("\\n");
    window.open(`https://wa.me/919024043673?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setContactOpen(false);
  }

  return <main className="site-shell"><div className="page-frame portfolio-frame">
    <header className="topbar"><a className="brand" href="#home">Rizwan<span>°</span></a><nav className="nav-pill" aria-label="Main navigation"><a href="#home">Home</a><a href="#visual-design">Visual Design</a><a href="#ui-ux">UI/UX</a><a href="#branding">Branding</a></nav><a className="app-link" href="https://wa.me/919024043673" target="_blank" rel="noopener noreferrer">Let’s talk <ArrowUpRight size={14}/></a></header>
    <section className="hero portfolio-hero" id="home">
      <div className="hero-copy"><div className="portfolio-eyebrow"><span className="availability-dot"/> DESIGNER · VISUAL THINKER · CREATIVE PROBLEM SOLVER</div><h1>Designing with<br/><em>meaning & feeling.</em></h1><p className="hero-subtitle">I’m Rizwan Khan — a designer focused on visual communication, branding,<br className="desktop-break"/> digital experiences, and thoughtful UI/UX.</p><div className="hero-actions"><a className="button button-dark" href="#experience">Explore my work <ArrowRight size={16}/></a><button className="button button-light" type="button" onClick={() => setContactOpen(true)}><Mail size={15}/> Get in touch</button></div></div>
      <div className="orbit-stamp"><span className="stamp-top">DESIGN WITH INTENT</span><span className="stamp-star">✳</span><span className="stamp-bottom">STAY CURIOUS</span></div>
      <div className="float-card thought-card"><span className="mini-icon"><Palette size={17}/></span><strong>Visual stories<br/>that connect.</strong><p>Branding, graphics<br/>and digital craft.</p></div>
      <div className="float-card sync-card"><div className="avatar-stack"><span>U</span><span>I</span><span>✳</span></div><strong>Thoughtful by design.</strong><p>Purposeful details.<br/>Clear experiences.</p></div>
      <div className="portrait-stage"><div className="portrait-halo"/><div className="portrait-mask"><img src="/portrait.png" alt="Rizwan Khan portrait"/></div><div id="visual-design" className="floating-panel panel-focus"><span className="panel-icon green"><CheckIcon/></span><div><strong>Visual Design</strong><small>Shape the story clearly.</small></div></div><div id="ui-ux" className="floating-panel panel-ideas"><span className="panel-icon purple"><PanelsTopLeft size={15}/></span><div><strong>UI / UX</strong><small>Make every interaction count.</small></div></div><div id="branding" className="floating-panel panel-plan"><span className="panel-icon orange"><Sparkles size={15}/></span><div><strong>Branding</strong><small>Build a memorable identity.</small></div></div><div className="floating-panel panel-print"><span className="panel-icon orange"><Printer size={15}/></span><div><strong>Print Ready Design</strong><small>Production-ready artwork.</small></div></div></div>
      <div className="trust-note"><span className="tiny-rule"/><p>Design meets function.<br/>Details make the difference.</p><div className="trust-avatars"><span>V</span><span>U</span><span>G</span><span>D</span></div></div><div className="clarity-note"><span className="clarity-star">✳</span><span className="tiny-rule"/><p>Make it clear.<br/>Make it matter.</p></div>
    </section>
  </div>
  {contactOpen && <div className="contact-modal-backdrop" onClick={() => setContactOpen(false)}>
    <section className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title" onClick={(event) => event.stopPropagation()}>
      <button className="contact-modal-close" type="button" aria-label="Close contact form" onClick={() => setContactOpen(false)}><X size={18}/></button>
      <span className="contact-modal-kicker">LET'S CONNECT</span>
      <h2 id="contact-modal-title">Tell me about your project.</h2>
      <p>Share a few details and I’ll get back to you.</p>
      <form className="contact-form" onSubmit={submitContact}>
        <label>Name<input required autoComplete="name" value={form.name} onChange={(event) => setForm({...form, name: event.target.value})} placeholder="Your full name"/></label>
        <label>Email<input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({...form, email: event.target.value})} placeholder="you@example.com"/></label>
        <label>Number<input required type="tel" autoComplete="tel" value={form.phone} onChange={(event) => setForm({...form, phone: event.target.value})} placeholder="+91 98765 43210"/></label>
        <label>Purpose of contact<select required value={form.purpose} onChange={(event) => setForm({...form, purpose: event.target.value})}><option value="" disabled>Select a purpose</option><option>UI/UX Design</option><option>Visual Design</option><option>Print Ready Design</option><option>Branding</option><option>Website / Development</option><option>Freelance Collaboration</option><option>Other</option></select></label>
        <button className="button button-dark contact-submit" type="submit">Continue to WhatsApp <ArrowRight size={16}/></button>
      </form>
    </section>
  </div>}
</main>;
}
function CheckIcon(){return <Sparkles size={15}/>;}
