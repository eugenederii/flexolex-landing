"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface HeroVideoProps {
  src: string;
  className?: string;
}

/**
 * Same soft abstract field the placeholder system uses elsewhere, shown
 * underneath the video until it has a frame ready — so the hero never shows
 * a blank box, regardless of connection speed.
 */
const LOADING_FIELD =
  "radial-gradient(60% 55% at 22% 20%, #cfe0f0 0%, transparent 62%), radial-gradient(55% 50% at 82% 30%, #f0e3c6 0%, transparent 60%), radial-gradient(70% 60% at 55% 92%, #a9c4e0 0%, transparent 65%)";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Hero background video — purely atmospheric (the headline and copy already
 * carry the message), so it's marked decorative rather than described.
 *
 * - Autoplays muted and plays through once it has data, and only if the
 *   visitor hasn't asked for reduced motion; reduced-motion visitors still
 *   get the video's first frame as a static image, never autoplay.
 * - Pauses when scrolled out of view, resumes from the same point (never
 *   restarts from 0) when it scrolls back into view.
 * - Never blocks scrolling or page render: it's a plain in-flow <video>,
 *   nothing here waits on it before the rest of the hero paints.
 */
export function HeroVideo({ src, className }: HeroVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Reveal the video the moment it has a decodable frame. A cached or very
  // fast-loading video can fire `loadeddata` before this effect attaches its
  // listeners, so this also checks readyState directly on mount rather than
  // relying on the event alone.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.readyState >= 2) {
      setReady(true);
      return;
    }

    const markReady = () => setReady(true);
    video.addEventListener("loadeddata", markReady);
    video.addEventListener("playing", markReady);
    return () => {
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("playing", markReady);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!reducedMotion) {
            // Resumes from video.currentTime — never seeks back to 0.
            video.play().catch(() => {
              /* Autoplay can be blocked by the browser — the first frame
                 (or the loading field, if it hasn't loaded yet) still shows,
                 so there's nothing more to do here. */
            });
          }
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: LOADING_FIELD }} />

      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        autoPlay={!reducedMotion}
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
          ready ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
