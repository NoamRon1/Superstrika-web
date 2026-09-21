"use client";

import { useState } from "react";
import { RobotViewer } from "@/components/robot-viewer";
import type { MediaItem } from "@/lib/robot-versions";

export function VersionGallery({ media, label }: { media: MediaItem[]; label: string }) {
  const [index, setIndex] = useState(0);
  const item = media[index];

  return (
    <div className="robot-canvas">
      <div className="robot-canvas-media">
        {item.type === "model" && <RobotViewer modelUrl={item.url} />}
        {item.type === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.url} alt={label} />
        )}
        {item.type === "video" && (
          <video src={item.url} controls playsInline />
        )}
      </div>

      {media.length > 1 && (
        <>
          <button
            type="button"
            className="gallery-arrow gallery-arrow-prev"
            aria-label="הקודם"
            onClick={() => setIndex((i) => (i - 1 + media.length) % media.length)}
          >
            ‹
          </button>
          <button
            type="button"
            className="gallery-arrow gallery-arrow-next"
            aria-label="הבא"
            onClick={() => setIndex((i) => (i + 1) % media.length)}
          >
            ›
          </button>
          <span className="gallery-counter" dir="ltr">{index + 1} / {media.length}</span>
        </>
      )}
    </div>
  );
}
