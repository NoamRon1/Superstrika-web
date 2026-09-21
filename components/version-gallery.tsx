"use client";

import { useEffect, useState } from "react";
import { RobotViewer } from "@/components/robot-viewer";
import type { MediaItem } from "@/lib/robot-versions";

function loadImageRatio(url: string): Promise<number | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(img.naturalWidth / img.naturalHeight);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function loadVideoRatio(url: string): Promise<number | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => resolve(video.videoWidth / video.videoHeight);
    video.onerror = () => resolve(null);
    video.src = url;
  });
}

export function VersionGallery({ media, label }: { media: MediaItem[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      media.map((item) => {
        if (item.type === "image") return loadImageRatio(item.url);
        if (item.type === "video") return loadVideoRatio(item.url);
        return Promise.resolve(null);
      })
    ).then((ratios) => {
      if (cancelled) return;
      const valid = ratios.filter((r): r is number => r !== null && Number.isFinite(r) && r > 0);
      if (valid.length > 0) setAspectRatio(Math.max(...valid));
    });
    return () => {
      cancelled = true;
    };
  }, [media]);

  const item = media[index];

  return (
    <div className="robot-canvas" style={aspectRatio ? { height: "auto", aspectRatio: String(aspectRatio) } : undefined}>
      <div className="robot-canvas-media">
        {item.type === "model" && <RobotViewer modelUrl={item.url} />}
        {item.type === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.url} alt={label} />
        )}
        {item.type === "video" && (
          <video
            src={item.url}
            controls
            playsInline
            muted
            onVolumeChange={(e) => {
              const video = e.currentTarget;
              if (!video.muted || video.volume !== 0) {
                video.muted = true;
                video.volume = 0;
              }
            }}
          />
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
