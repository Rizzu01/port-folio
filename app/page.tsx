"use client";
import { ArrowRight, ArrowUpRight, Mail, Palette, PanelsTopLeft, Printer, Sparkles } from "lucide-react";

export default function Home() {
  return <main className="site-shell"><div className="page-frame portfolio-frame">
    <header className="topbar"><a className="brand" href="#home">Rizwan<span>°</span></a><nav className="nav-pill" aria-label="Main navigation"><a href="#home">Home</a><a href="#visual-design">Visual Design</a><a href="#ui-ux">UI/UX</a><a href="#branding">Branding</a></nav><a className="app-link" href="mailto:rizwankhan36200@gmail.com">Let’s talk <ArrowUpRight size={14}/></a></header>
    <section className="hero portfolio-hero" id="home">
      <div className="hero-copy"><div className="portfolio-eyebrow"><span className="availability-dot"/> DESIGNER · VISUAL THINKER · CREATIVE PROBLEM SOLVER</div><h1>Designing with<br/><em>meaning & feeling.</em></h1><p className="hero-subtitle">I’m Rizwan Khan — a designer focused on visual communication, branding,<br className="desktop-break"/> digital experiences, and thoughtful UI/UX.</p><div className="hero-actions"><a className="button button-dark" href="#experience">Explore my work <ArrowRight size={16}/></a><a className="button button-light" href="mailto:rizwankhan36200@gmail.com"><Mail size={15}/> Get in touch</a></div></div>
      <div className="orbit-stamp"><span className="stamp-top">DESIGN WITH INTENT</span><span className="stamp-star">✳</span><span className="stamp-bottom">STAY CURIOUS</span></div>
      <div className="float-card thought-card"><span className="mini-icon"><Palette size={17}/></span><strong>Visual stories<br/>that connect.</strong><p>Branding, graphics<br/>and digital craft.</p></div>
      <div className="float-card sync-card"><div className="avatar-stack"><span>U</span><span>I</span><span>✳</span></div><strong>Thoughtful by design.</strong><p>Purposeful details.<br/>Clear experiences.</p></div>
      <div className="portrait-stage"><div className="portrait-halo"/><div className="portrait-mask"><img src="/portrait.png" alt="Rizwan Khan portrait"/></div><div id="visual-design" className="floating-panel panel-focus"><span className="panel-icon green"><CheckIcon/></span><div><strong>Visual Design</strong><small>Shape the story clearly.</small></div></div><div id="ui-ux" className="floating-panel panel-ideas"><span className="panel-icon purple"><PanelsTopLeft size={15}/></span><div><strong>UI / UX</strong><small>Make every interaction count.</small></div></div><div id="branding" className="floating-panel panel-plan"><span className="panel-icon orange"><Sparkles size={15}/></span><div><strong>Branding</strong><small>Build a memorable identity.</small></div></div><div className="floating-panel panel-print"><span className="panel-icon orange"><Printer size={15}/></span><div><strong>Print Ready Design</strong><small>Production-ready artwork.</small></div></div></div>
      <div className="trust-note"><span className="tiny-rule"/><p>Design meets function.<br/>Details make the difference.</p><div className="trust-avatars"><span>V</span><span>U</span><span>G</span><span>D</span></div></div><div className="clarity-note"><span className="clarity-star">✳</span><span className="tiny-rule"/><p>Make it clear.<br/>Make it matter.</p></div>
    </section>
  </div>
</main>;
}
function CheckIcon(){return <Sparkles size={15}/>;}
