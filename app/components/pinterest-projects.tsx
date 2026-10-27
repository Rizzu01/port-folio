"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";

type Category = "Social Media Posts" | "UI/UX Designs" | "Printed Designs";
type Pin = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pinUrl: string;
  createdAt: string;
  category: Category;
};
type PinResponse = { configured: boolean; pins: Pin[]; message?: string };

const CATEGORIES: Category[] = ["Social Media Posts", "UI/UX Designs", "Printed Designs"];

export function PinterestProjects({ fullPage = false }: { fullPage?: boolean }) {
  const [data, setData] = useState<PinResponse | null>(null);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("Social Media Posts");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/pinterest/pins", { signal: controller.signal, cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Pinterest request failed");
        return response.json() as Promise<PinResponse>;
      })
      .then(setData)
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError") {
          setData({ configured: false, pins: [], message: "Pinterest projects are temporarily unavailable." });
        }
      });
    const refreshPins = () => {
      fetch("/api/pinterest/pins", { cache: "no-store" })
        .then((response) => {
          if (!response.ok) throw new Error("Pinterest request failed");
          return response.json() as Promise<PinResponse>;
        })
        .then(setData)
        .catch(() => {
          // Keep the last successfully loaded Pins visible if a background refresh fails.
        });
    };
    const interval = window.setInterval(refreshPins, 5 * 60 * 1000);
    window.addEventListener("focus", refreshPins);
    return () => {
      controller.abort();
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshPins);
    };
  }, []);

  useEffect(() => {
    if (!selectedPin) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPin(null);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedPin]);

  if (!data) {
    return <div className="pinterest-project-status" aria-live="polite">Loading latest work from Pinterest…</div>;
  }

  if (!data.configured) {
    return (
      <div className="pinterest-project-status">
        <p>{data.message || "Pinterest projects are temporarily unavailable."}</p>
        <a href="https://in.pinterest.com/Creative___Rizz/work-showcase/" target="_blank" rel="noopener noreferrer">
          View Work Showcase on Pinterest <ArrowUpRight size={14} />
        </a>
      </div>
    );
  }

  const filteredPins = data.pins.filter((pin) => pin.category === activeCategory);
  const pinsToShow = fullPage ? filteredPins : filteredPins.slice(0, 6);

  return (
    <>
      <div className="pinterest-category-filters" role="tablist" aria-label="Work categories">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            id={`work-tab-${CATEGORIES.indexOf(category)}`}
            aria-selected={activeCategory === category}
            aria-controls="work-category-panel"
            className={activeCategory === category ? "pinterest-category-filter is-active" : "pinterest-category-filter"}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div id="work-category-panel" role="tabpanel" aria-labelledby={`work-tab-${CATEGORIES.indexOf(activeCategory)}`}>
        {filteredPins.length > 0 ? (
          <div className="reference-project-grid reference-project-grid-real pinterest-project-grid" aria-label={`${activeCategory} projects`}>
            {pinsToShow.map((pin) => (
              <article className="reference-project pinterest-project pinterest-project-card" key={pin.id}>
                <button className="pinterest-project-trigger" type="button" onClick={() => setSelectedPin(pin)} aria-label={`Preview ${pin.title}`}>
                  <span className="reference-project-image pinterest-project-image">
                    <img src={pin.imageUrl} alt={pin.title} loading="lazy" />
                  </span>
                  <span className="reference-project-caption">
                    <span className="pinterest-project-caption-copy">
                      <span className="pinterest-project-title">{pin.title}</span>
                      <span className="pinterest-project-subtitle">{pin.category} · Pinterest</span>
                    </span>
                    <span className="pinterest-project-arrow" aria-hidden="true">↗</span>
                  </span>
                </button>
                <a className="pinterest-card-source-link" href={pin.pinUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${pin.title} on Pinterest`} title="Open this Pin on Pinterest">
                  <img src="/Pinterest.svg" alt="" />
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="pinterest-project-status">
            <p>No Pins found in <strong>{activeCategory}</strong> yet. Check that the matching Pinterest board is public and connected.</p>
          </div>
        )}
      </div>
      {!fullPage && filteredPins.length > 6 && (
        <div className="pinterest-more-wrap">
          <a className="reference-all-work pinterest-more-button" href="/work">More work <ArrowUpRight size={14} /></a>
        </div>
      )}
      {selectedPin && (
        <div className="pinterest-lightbox-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedPin(null); }}>
          <section className="pinterest-lightbox" role="dialog" aria-modal="true" aria-label={selectedPin.title}>
            <button className="pinterest-lightbox-close" type="button" onClick={() => setSelectedPin(null)} aria-label="Close image preview"><X size={21} /></button>
            <div className="pinterest-lightbox-artwork">
              <img src={selectedPin.imageUrl} alt={selectedPin.title} />
            </div>
            <aside className="pinterest-lightbox-side">
              <span className="pinterest-lightbox-kicker">WORK SHOWCASE</span>
              <h2>{selectedPin.title}</h2>
              {selectedPin.description && <p>{selectedPin.description}</p>}
              <a className="pinterest-source-link" href={selectedPin.pinUrl} target="_blank" rel="noopener noreferrer" aria-label="Open this work on Pinterest">
                <img src="/Pinterest.svg" alt="" />
                <span>View on Pinterest</span>
                <ArrowUpRight size={16} />
              </a>
              <button className="pinterest-lightbox-back" type="button" onClick={() => setSelectedPin(null)}>Back to work</button>
            </aside>
          </section>
        </div>
      )}
    </>
  );
}
