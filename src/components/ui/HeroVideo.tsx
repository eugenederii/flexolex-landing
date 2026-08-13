"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
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
 * Playback state machine:
 *
 *   idle --(autoplay attempted once, on mount)--> playing | autoplayBlocked
 *   playing --(native `ended` event)--> ended
 *   autoplayBlocked --(user taps Play)--> playing
 *   ended --(user taps Replay)--> playing
 *
 * Only one play() attempt is ever made automatically (guarded by
 * `autoplayAttempted`); every transition after that is a direct result of a
 * user tap, never re-triggered by scrolling.
 */
type PlaybackState = "idle" | "playing" | "autoplayBlocked" | "ended";

/**
 * Hero background video — purely atmospheric (the headline and copy already
 * carry the message), so the video element itself is marked decorative;
 * the Play/Replay controls are the only interactive, accessible parts.
 *
 * - Attempts autoplay exactly once, muted. If the browser allows it, the
 *   video plays through to the end and stops — no loop. If the browser
 *   blocks it (most mobile browsers, in-app browsers), a custom Play button
 *   appears instead; tapping it starts playback via a real user gesture.
 * - When playback ends, the last frame stays on screen (no reset, no
 *   poster) and a small Replay control appears. Replaying is always a
 *   manual, explicit choice — never automatic.
 * - Pauses when scrolled far out of view and resumes when it scrolls back,
 *   but only while actively `playing` — this never restarts an ended video
 *   and never triggers a fresh autoplay attempt.
 */
export function HeroVideo({ src, className }: HeroVideoProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoplayAttempted = useRef(false);
  const [ready, setReady] = useState(false);
  const [reducedMotion] = useState(prefersReducedMotion);
  // Reduced-motion visitors skip the autoplay attempt entirely — the initial
  // state already reflects that, so there's no synchronous setState-in-effect
  // needed for this branch (only the async play() outcome sets state later).
  const [state, setState] = useState<PlaybackState>(() =>
    reducedMotion ? "autoplayBlocked" : "idle",
  );

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

  // Attempt autoplay exactly once. Reduced-motion visitors skip the attempt
  // entirely and land straight on the custom Play control, matching the
  // same "nothing moves until you ask it to" outcome as a blocked autoplay.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || autoplayAttempted.current || reducedMotion) return;
    autoplayAttempted.current = true;

    video.muted = true;
    video.defaultMuted = true;

    // Every browser in practice returns a promise from play(); the
    // Promise.resolve() wrapper only exists so a hypothetical non-promise
    // return still resolves state from a microtask callback rather than
    // synchronously inside the effect body.
    Promise.resolve(video.play()).then(
      () => setState("playing"),
      () => setState("autoplayBlocked"),
    );
  }, [reducedMotion]);

  // Native `ended` fires once, exactly on completion (loop is off) — leaves
  // the last frame on screen untouched; only the state (and therefore the
  // Replay control) changes here.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnded = () => setState("ended");
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, []);

  // Pause when scrolled far out of view, resume when back — but only while
  // a playback is actually in progress. Deliberately does nothing for
  // "autoplayBlocked" (scrolling must never itself start playback) or
  // "ended" (scrolling back must never itself replay it).
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (state !== "playing") return;
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* Resuming an already-engaged video essentially never fails,
               but if it does, the last visible frame simply stays put. */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [state]);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().then(
      () => setState("playing"),
      () => {
        /* A play() called directly from a click handler essentially never
           rejects — if it somehow does, the Play button simply stays put
           so the visitor can try again. */
      },
    );
  };

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().then(
      () => setState("playing"),
      () => {},
    );
  };

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: LOADING_FIELD }} />

      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        autoPlay={!reducedMotion}
        loop={false}
        controls={false}
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
          ready ? "opacity-100" : "opacity-0",
        )}
      />

      {ready && state === "autoplayBlocked" && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label={t.hero.playAriaLabel}
          className={cn(
            "absolute inset-0 m-auto size-[60px] sm:size-[70px]",
            "grid place-items-center rounded-full bg-navy/90 text-cream shadow-lift backdrop-blur-sm",
            "transition-transform duration-200 ease-out hover:scale-105 active:scale-95",
          )}
        >
          <Play aria-hidden="true" className="size-6 translate-x-0.5 sm:size-7" fill="currentColor" strokeWidth={0} />
        </button>
      )}

      {ready && state === "ended" && (
        <button
          type="button"
          onClick={handleReplay}
          aria-label={t.hero.replayAriaLabel}
          className={cn(
            "absolute inset-0 m-auto size-11 sm:size-12",
            "grid place-items-center rounded-full bg-navy/75 text-cream shadow-soft backdrop-blur-sm",
            "transition-transform duration-200 ease-out hover:scale-105 active:scale-95",
          )}
        >
          <RotateCcw aria-hidden="true" className="size-4.5 sm:size-5" strokeWidth={2.2} />
        </button>
      )}
    </div>
  );
}
