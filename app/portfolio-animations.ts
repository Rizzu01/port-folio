import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Portfolio motion layer.
 * Only transforms, opacity and clip-path are animated; every tween returns
 * elements to their existing visual state. Native browser scrolling remains
 * enabled so hash links and sticky navigation continue to work.
 */
export function setupPortfolioAnimations(root: HTMLElement) {
  if (window.matchMedia(REDUCED_MOTION).matches) {
    // Do not initialize any animation; the unanimated page remains visible.
    return () => {};
  }

  const mm = gsap.matchMedia();
  const ctx = gsap.context(() => {
    const $ = (selector: string) => root.querySelectorAll<HTMLElement>(selector);
    const once = { start: "top 85%", toggleActions: "play none none none" };

    // Navbar: intro, gentle scroll-direction hide/show, and active section state.
    const nav = $(".reference-nav")[0];
    if (nav) {
      gsap.fromTo(nav, { y: -14, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.75, ease: "power3.out", clearProps: "transform,opacity"
      });

      let navHidden = false;
      ScrollTrigger.create({
        start: 90,
        end: "max",
        onUpdate: (self) => {
          const shouldHide = window.scrollY > 160 && self.direction > 0 && !nav.classList.contains("reference-nav-open");
          if (!shouldHide) {
            if (navHidden) gsap.to(nav, { y: 0, duration: 0.28, ease: "power2.out", overwrite: true });
            navHidden = false;
          } else if (!navHidden) {
            gsap.to(nav, { y: -nav.getBoundingClientRect().height - 18, duration: 0.25, ease: "power2.out", overwrite: true });
            navHidden = true;
          }
        }
      });

      const sections = ["home", "work", "services", "experience", "contact"]
        .map((id) => root.querySelector<HTMLElement>(`#${id}`))
        .filter((section): section is HTMLElement => Boolean(section));
      sections.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (!self.isActive) return;
            nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
              if (link.getAttribute("href") === `#${section.id}`) link.setAttribute("aria-current", "location");
              else link.removeAttribute("aria-current");
            });
          },
        });
      });

      // Hero: calm staged reveal. No text is split or rewritten in the DOM.
      gsap.fromTo($(".portfolio-eyebrow"), { y: 12, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.65, ease: "power3.out", clearProps: "transform,opacity"
      });
      gsap.fromTo($(".portfolio-hero h1"), { y: 28, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, delay: 0.08, ease: "expo.out", clearProps: "transform,opacity"
      });
      gsap.fromTo($(".portfolio-hero h1 em"), { y: 18, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, delay: 0.22, ease: "expo.out", clearProps: "transform,opacity"
      });
      gsap.fromTo($(".hero-subtitle"), { y: 16, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.75, delay: 0.3, ease: "power3.out", clearProps: "transform,opacity"
      });
      gsap.fromTo($(".hero-actions > *"), { y: 12, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.65, delay: 0.38, stagger: 0.1,
        ease: "power3.out", clearProps: "transform,opacity"
      });
      gsap.fromTo($(".orbit-stamp, .trust-note, .clarity-note"), { opacity: 0 }, {
        opacity: 1, duration: 0.8, delay: 0.35, stagger: 0.08, clearProps: "opacity"
      });
      gsap.to($(".stamp-star, .clarity-star"), {
        rotation: 360, duration: 18, repeat: -1, ease: "none", transformOrigin: "50% 50%"
      });

      // Existing hero depth: restrained parallax on desktop, reduced on touch devices.
      mm.add("(min-width: 761px)", () => {
        gsap.to($(".portrait-stage"), {
          yPercent: -5, ease: "none",
          scrollTrigger: { trigger: $(".portfolio-hero")[0], start: "top top", end: "bottom top", scrub: 1.2 }
        });
        gsap.to($(".thought-card"), {
          y: -24, ease: "none",
          scrollTrigger: { trigger: $(".portfolio-hero")[0], start: "top top", end: "bottom top", scrub: 1.2 }
        });
        gsap.to($(".sync-card"), {
          y: -15, ease: "none",
          scrollTrigger: { trigger: $(".portfolio-hero")[0], start: "top top", end: "bottom top", scrub: 1.2 }
        });
      });

      // About: section heading, photo reveal, copy and values.
      gsap.fromTo($(".reference-about .reference-section-heading > *"), { y: 14, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: $(".reference-about")[0], ...once }
      });
      const aboutImage = $(".reference-about-image")[0];
      const aboutPhoto = $(".reference-about-image img")[0];
      if (aboutImage) {
        gsap.fromTo(aboutImage, { clipPath: "inset(100% 0 0 0)" }, {
          clipPath: "inset(0% 0 0 0)", duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: aboutImage, ...once },
          onComplete: () => gsap.set(aboutImage, { clearProps: "clipPath" })
        });
      }
      if (aboutPhoto) {
        gsap.fromTo(aboutPhoto, { scale: 1.08 }, {
          scale: 1, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: aboutImage, ...once },
          onComplete: () => gsap.set(aboutPhoto, { clearProps: "transform" })
        });
      }
      gsap.fromTo($(".reference-about-copy h2"), { y: 22, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: "expo.out", clearProps: "transform,opacity",
        scrollTrigger: { trigger: $(".reference-about-copy")[0], ...once }
      });
      gsap.fromTo($(".reference-about-copy > p, .reference-about-values > div, .reference-about-link"), {
        y: 16, opacity: 0
      }, {
        y: 0, opacity: 1, duration: 0.65, stagger: 0.09, ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: $(".reference-about-copy")[0], start: "top 80%", toggleActions: "play none none none" }
      });

      // Selected work: headings, cards, and small image parallax inside the existing frames.
      gsap.fromTo($(".reference-work .reference-section-heading > *"), { y: 16, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out",
        clearProps: "transform,opacity", scrollTrigger: { trigger: $(".reference-work")[0], ...once }
      });
      gsap.fromTo($(".reference-project"), { y: 22, opacity: 0, scale: 0.985 }, {
        y: 0, opacity: 1, scale: 1, duration: 0.85, stagger: 0.12, ease: "power3.out",
        clearProps: "transform,opacity", scrollTrigger: { trigger: $(".reference-project-grid")[0], ...once }
      });
      gsap.fromTo($(".reference-project-caption > span"), { x: -3, opacity: 0.65 }, {
        x: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: "power2.out",
        clearProps: "transform,opacity", scrollTrigger: { trigger: $(".reference-project-grid")[0], ...once }
      });
      mm.add("(min-width: 761px)", () => {
        $(".reference-project-image").forEach((frame) => {
          const img = frame.querySelector("img");
          if (!img) return;
          gsap.fromTo(img, { yPercent: -2 }, {
            yPercent: 2, ease: "none",
            scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: 0.8 }
          });
        });
      });

      // Services: each row enters in sequence; hover movement is transform-only.
      gsap.fromTo($(".reference-services .reference-section-heading > *"), { y: 14, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out",
        clearProps: "transform,opacity", scrollTrigger: { trigger: $(".reference-services")[0], ...once }
      });
      gsap.fromTo($(".reference-service-list > a"), { y: 14, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out",
        clearProps: "transform,opacity", scrollTrigger: { trigger: $(".reference-service-list")[0], ...once }
      });
      $(".reference-service-list > a").forEach((row) => {
        row.addEventListener("mouseenter", () => gsap.to(row, { x: 4, duration: 0.22, ease: "power2.out" }));
        row.addEventListener("mouseleave", () => gsap.to(row, { x: 0, duration: 0.28, ease: "power2.out" }));
      });

      // Experience: heading and timeline entries.
      gsap.fromTo($(".reference-experience-top > *"), { y: 18, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: "power3.out",
        clearProps: "transform,opacity", scrollTrigger: { trigger: $(".reference-experience")[0], ...once }
      });
      gsap.fromTo($(".reference-experience-list article"), { y: 18, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: "power3.out",
        clearProps: "transform,opacity", scrollTrigger: { trigger: $(".reference-experience-list")[0], ...once }
      });

      // Contact/footer: gentle arrival and a breathing status dot.
      gsap.fromTo($(".reference-contact-kicker, .reference-contact h2, .reference-contact > p, .reference-pill-button"), {
        y: 16, opacity: 0
      }, {
        y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: "power3.out",
        clearProps: "transform,opacity", scrollTrigger: { trigger: $(".reference-contact")[0], ...once }
      });
      gsap.fromTo($(".reference-contact-footer > *"), { y: 8, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: "power3.out",
        clearProps: "transform,opacity", scrollTrigger: { trigger: $(".reference-contact-footer")[0], ...once }
      });
      const statusDot = $(".reference-contact-kicker > span")[0];
      if (statusDot) gsap.to(statusDot, { opacity: 0.45, repeat: -1, yoyo: true, duration: 1.15, ease: "sine.inOut" });

      // Hover interactions use transform only and revert exactly on pointer leave.
      const hoverTargets = [
        ...Array.from($(".hero-actions > *")),
        ...Array.from($(".reference-all-work, .reference-pill-button, .reference-talk"))
      ];
      hoverTargets.forEach((target) => {
        target.addEventListener("mouseenter", () => gsap.to(target, { y: -2, duration: 0.2, ease: "power2.out", overwrite: true }));
        target.addEventListener("mouseleave", () => gsap.to(target, { y: 0, duration: 0.25, ease: "power2.out", overwrite: true }));
      });

      // Small top-level reusable animation API: opt in with data-anim attributes.
      const generic: Record<string, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
        "fade-up": { from: { y: 20, opacity: 0 }, to: { y: 0, opacity: 1 } },
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
        "scale-in": { from: { opacity: 0, scale: 0.97 }, to: { opacity: 1, scale: 1 } },
        "line-reveal": { from: { scaleX: 0, transformOrigin: "left center" }, to: { scaleX: 1 } },
        parallax: { from: { yPercent: 4 }, to: { yPercent: -4 } },
        "stagger-children": { from: { y: 16, opacity: 0 }, to: { y: 0, opacity: 1 } },
      };
      Object.entries(generic).forEach(([name, config]) => {
        const elements = $(`[data-anim="${name}"]`);
        elements.forEach((element) => {
          if (name === "parallax") {
            gsap.fromTo(element, config.from, {
              ...config.to, ease: "none",
              scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 0.8 }
            });
            return;
          }
          const targets = name === "stagger-children" ? Array.from(element.children) as HTMLElement[] : [element];
          gsap.fromTo(targets, config.from, {
            ...config.to, duration: 0.8, stagger: name === "stagger-children" ? 0.1 : 0,
            ease: "power3.out", clearProps: "transform,opacity",
            scrollTrigger: { trigger: element, ...once }
          });
        });
      });

      // Refresh after images and fonts have settled so triggers use real dimensions.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh, { once: true });
      if (document.fonts?.ready) document.fonts.ready.then(refresh);
      root.querySelectorAll("img").forEach((img) => {
        if (!img.complete) img.addEventListener("load", refresh, { once: true });
      });
    }, root);

  }, root);

  ScrollTrigger.refresh();
  return () => {
    ctx.revert();
    mm.revert();
  };
}
