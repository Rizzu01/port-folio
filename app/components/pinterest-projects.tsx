"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

type Pin = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pinUrl: string;
  createdAt: string;
};

type PinResponse = { configured: boolean; pins: Pin[]; message?: string };

export function PinterestProjects() {
  const [data, setData] = useState<PinResponse | null>(null);

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

  if (!data) {
    return <div className="pinterest-project-status" aria-live="polite">Loading latest work from Pinterest…</div>;
  }

  if (!data.configured) {
    return (
      <div className="pinterest-project-status">
        <p>Connect the Pinterest API to automatically display your latest designs here.</p>
        <a href="https://in.pinterest.com/Creative___Rizz/work-showcase/" target="_blank" rel="noopener noreferrer">
          View Work Showcase on Pinterest <ArrowUpRight size={14} />
        </a>
      </div>
    );
  }

  if (!data.pins.length) {
    return (
      <div className="pinterest-project-status">
        <p>{data.message || "No public Pins were returned from this board yet."}</p>
        <a href="https://in.pinterest.com/Creative___Rizz/work-showcase/" target="_blank" rel="noopener noreferrer">
          View Work Showcase on Pinterest <ArrowUpRight size={14} />
        </a>
      </div>
    );
  }

  return (
    <div className="reference-project-grid reference-project-grid-real pinterest-project-grid" aria-label="Latest Pinterest projects">
      {data.pins.slice(0, 12).map((pin) => (
        <a className="reference-project pinterest-project" href={pin.pinUrl} key={pin.id} target="_blank" rel="noopener noreferrer">
          <div className="reference-project-image pinterest-project-image">
            {/* Pinterest supplies this image URL through its authenticated API. */}
            <img src={pin.imageUrl} alt={pin.title} loading="lazy" />
          </div>
          <div className="reference-project-caption">
            <div>
              <h3>{pin.title}</h3>
              <p>Work Showcase · Pinterest</p>
            </div>
            <span aria-hidden="true">↗</span>
          </div>
        </a>
      ))}
    </div>
  );
}
