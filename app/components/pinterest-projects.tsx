"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, X } from "lucide-react";

type Pin = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pinUrl: string;
  createdAt: string;
};

type PinResponse = { configured: boolean; pins: Pin[]; message?: string };

export function PinterestProjects({ fullPage = false }: { fullPage?: boolean }) {
  const [data, setData] = useState<PinResponse | null>(null);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/pinterest/pins", { signal: controller.signal })
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
    return () => controller.abort();
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

  if (!data.configured || !data.pins.length) {
    return (
      <div className="pinterest-project-status">
        <p>{data.message || "No public Pins were returned from this board yet."}</p>
        <a href="https://in.pinterest.com/Creative___Rizz/work-showcase/" target="_blank" rel="noopener noreferrer">
          View Work Showcase on Pinterest <ArrowUpRight size={14} />
        </a>
      </div>
    );
  }

  const pinsToShow = fullPage ? data.pins : data.pins.slice(0, 6);

  return (
    <>
      <div className="reference-project-grid reference-project-grid-real pinterest-project-grid" aria-label="Pinterest projects">
        {pinsToShow.map((pin) => (
          <article className="reference-project pinterest-project pinterest-project-card" key={pin.id}>
            <button className="pinterest-project-trigger" type="button" onClick={() => setSelectedPin(pin)} aria-label={`Preview ${pin.title}`}>
              <span className="reference-project-image pinterest-project-image">
                <img src={pin.imageUrl} alt={pin.title} loading="lazy" />
              </span>
              <span className="reference-project-caption">
                <span className="pinterest-project-caption-copy">
                  <span className="pinterest-project-title">{pin.title}</span>
                  <span className="pinterest-project-subtitle">Work Showcase · Pinterest</span>
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
      {!fullPage && data.pins.length > 6 && (
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
