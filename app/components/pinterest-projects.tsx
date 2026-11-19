"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, RefreshCw, X } from "lucide-react";

type Category = "Social Media Posts" | "UI/UX Designs" | "Printed Designs";
type Pin = {
  id: string;
  title: string;
  description: string;
  altText?: string;
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
  pinUrl: string;
  createdAt: string;
  category: Category;
};
export type PinResponse = { configured: boolean; pins: Pin[]; message?: string };

const CATEGORIES: Category[] = ["Social Media Posts", "UI/UX Designs", "Printed Designs"];

export function PinterestProjects({ fullPage = false, initialData }: { fullPage?: boolean; initialData?: PinResponse }) {
  const [data, setData] = useState<PinResponse | null>(initialData?.pins.length ? initialData : null);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("Social Media Posts");

  const [refreshing, setRefreshing] = useState(false);
  const refreshRef = useRef<(force?: boolean) => void>(() => {});

  useEffect(() => {
    let disposed = false;
    let activeController: AbortController | null = null;

    const refreshPins = async (force = false) => {
      // Prevent overlapping automatic requests. A manual refresh can replace one.
      if (activeController && !force) return;
      activeController?.abort();
      const controller = new AbortController();
      activeController = controller;
      if (force) setRefreshing(true);

      try {
        const url = force ? "/api/pinterest/pins?fresh=1" : "/api/pinterest/pins";
        const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("Pinterest request failed");
        const result = (await response.json()) as PinResponse;
        if (!disposed && !controller.signal.aborted) setData(result);
      } catch (error) {
        if (!disposed && !controller.signal.aborted) {
          // Keep successfully loaded portfolio items visible during transient API errors.
          setData((previous) => previous?.pins.length ? previous : {
            configured: false,
            pins: [],
            message: "Pinterest projects could not be loaded right now. Please try again or view the work on Pinterest.",
          });
        }
      } finally {
        if (activeController === controller) {
          activeController = null;
          if (!disposed) setRefreshing(false);
        }
      }
    };

    refreshRef.current = refreshPins;
    // Show SSR data immediately and check for new Pins after hydration.
    refreshPins();

    // Only poll while the page is visible. This lowers API usage on background tabs.
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") refreshPins();
    }, 30 * 1000);
    const onResume = () => {
      if (document.visibilityState === "visible") refreshPins();
    };
    window.addEventListener("focus", onResume);
    document.addEventListener("visibilitychange", onResume);

    return () => {
      disposed = true;
      activeController?.abort();
      refreshRef.current = () => {};
      window.clearInterval(interval);
      window.removeEventListener("focus", onResume);
      document.removeEventListener("visibilitychange", onResume);
    };
  }, [initialData]);

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
      <div className="pinterest-filters-toolbar">
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
        <button className="pinterest-refresh-button" type="button"
          onClick={() => refreshRef.current(true)}
          disabled={refreshing} aria-label="Refresh work from Pinterest">
          <RefreshCw size={14} className={refreshing ? "is-refreshing" : ""} />
          {refreshing ? "Refreshing..." : "Refresh work"}
        </button>
      </div>
      <div id="work-category-panel" role="tabpanel" aria-labelledby={`work-tab-${CATEGORIES.indexOf(activeCategory)}`}>
        {filteredPins.length > 0 ? (
          <div key={`${activeCategory}-${pinsToShow.length}`} className="reference-project-grid reference-project-grid-real pinterest-project-grid" aria-label={`${activeCategory} projects`}>
            {pinsToShow.map((pin) => (
              <article className="reference-project pinterest-project pinterest-project-card" key={pin.id}>
                <button className="pinterest-project-trigger" type="button" onClick={() => setSelectedPin(pin)} aria-label={`Preview ${pin.title}`}>
                  <span className="reference-project-image pinterest-project-image">
                    <Image src={pin.imageUrl} alt={pin.altText || pin.title} width={pin.imageWidth || 1200} height={pin.imageHeight || 1200} sizes="(max-width: 760px) 44vw, (max-width: 1100px) 50vw, 33vw" loading="lazy" />
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
              <Image src={selectedPin.imageUrl} alt={selectedPin.altText || selectedPin.title} width={selectedPin.imageWidth || 1200} height={selectedPin.imageHeight || 1200} sizes="(max-width: 760px) 100vw, 70vw" />
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
