"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, SplitText } from "@/lib/gsap-client";

/** Weiße Fläche von der Mitte auf Vollbild */
const WHITE_START_SCALE = 0;
const EXPAND_DURATION_S = 0.84;
const EXPAND_START_OFFSET_S = 0.52;
const PRELOADER_HEADLINE_START_DELAY_S = 0.06;
const PRELOADER_HEADLINE_IN_S = 0.76;
const PRELOADER_HEADLINE_STAGGER_S = 0.022;
const PRELOADER_HEADLINE_TO_TARGET_S = 1.02;
const HEADLINE_HANDOFF_FADE_S = 0.14;
/** Gesamtes Overlay ausblenden — kein Slide nach oben */
const OVERLAY_FADE_OUT_S = 0.32;

type IntroPreloaderProps = {
  id?: string;
  skip: boolean;
  onIntroReady: () => void;
};

export function IntroPreloader({
  id = "intro-preloader",
  skip,
  onIntroReady,
}: IntroPreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const whiteRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const readyFiredRef = useRef(false);
  const [removed, setRemoved] = useState(false);

  const fireIntroReady = useCallback(() => {
    if (readyFiredRef.current) return;
    readyFiredRef.current = true;
    onIntroReady();
  }, [onIntroReady]);

  useEffect(() => {
    if (skip) {
      fireIntroReady();
    }
  }, [skip, fireIntroReady]);

  useEffect(() => {
    if (skip || removed) return;
    const overlay = overlayRef.current;
    const white = whiteRef.current;
    const headline = headlineRef.current;
    if (!overlay || !white || !headline) return;

    let cancelled = false;
    let activeSplit: SplitText | null = null;

    const run = async () => {
      gsap.set(overlay, { autoAlpha: 1 });
      gsap.set(white, {
        scale: WHITE_START_SCALE,
        transformOrigin: "50% 50%",
        force3D: true,
      });
      gsap.set(headline, {
        autoAlpha: 0,
        willChange: "transform,opacity",
      });

      await new Promise<void>((resolve) => {
        gsap.to({}, {
          duration: PRELOADER_HEADLINE_START_DELAY_S,
          onComplete: resolve,
        });
      });

      if (cancelled) return;

      await new Promise<void>((resolve) => {
        gsap.set(headline, { autoAlpha: 1 });
        activeSplit = SplitText.create(headline, {
          type: "words,lines",
          mask: "words",
          aria: "none",
        });
        const words = activeSplit.words ?? [];
        gsap.fromTo(
          words,
          { x: 0, y: 22, autoAlpha: 0, force3D: true },
          {
            x: 0,
            y: 0,
            autoAlpha: 1,
            duration: PRELOADER_HEADLINE_IN_S,
            stagger: PRELOADER_HEADLINE_STAGGER_S,
            ease: "power3.out",
            force3D: true,
            onComplete: () => {
              resolve();
            },
          },
        );
      });

      if (cancelled) return;

      const targetHeadline = document.getElementById("hero-headline");
      const currentRect = headline.getBoundingClientRect();
      const targetRect = targetHeadline?.getBoundingClientRect();
      const moveY = targetRect
        ? Math.round(targetRect.top - currentRect.top)
        : Math.round(window.innerHeight * 0.24);

      await new Promise<void>((resolve) => {
        const tl = gsap.timeline({ onComplete: resolve });
        tl.to(
          headline,
          {
            y: 24,
            duration: HEADLINE_HANDOFF_FADE_S,
            ease: "power2.in",
          },
          0,
        );
        tl.to(
          headline,
          {
            y: moveY,
            duration: PRELOADER_HEADLINE_TO_TARGET_S,
            ease: "power3.inOut",
          },
          0,
        );
        tl.to(white, {
          scale: 1,
          duration: EXPAND_DURATION_S,
          ease: "heroFigureReveal",
          force3D: true,
        }, EXPAND_START_OFFSET_S);
      });

      if (cancelled) return;

      gsap.to(overlay, {
        autoAlpha: 0,
        duration: OVERLAY_FADE_OUT_S,
        ease: "power2.out",
        onStart: () => {
          gsap.to(headline, {
            autoAlpha: 0,
            duration: HEADLINE_HANDOFF_FADE_S,
            ease: "none",
            overwrite: true,
          });
        },
        onComplete: () => {
          activeSplit?.revert();
          activeSplit = null;
          gsap.set(headline, { clearProps: "willChange" });
          gsap.set(overlay, {
            visibility: "hidden",
            pointerEvents: "none",
            clearProps: "opacity,visibility",
          });
          fireIntroReady();
          setRemoved(true);
        },
      });
    };

    void run();

    return () => {
      cancelled = true;
      activeSplit?.revert();
      gsap.killTweensOf([overlay, white, headline]);
    };
  }, [skip, removed, fireIntroReady]);

  if (skip || removed) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      id={id}
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        overflow: "hidden",
        backgroundColor: "#000",
        opacity: 1,
        visibility: "visible",
      }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="absolute inset-0 bg-[#000000]"
        aria-hidden="true"
      />

      <div
        ref={whiteRef}
        className="absolute inset-0 origin-center bg-white will-change-transform"
        style={{
          transform: "scale(0)",
          transformOrigin: "50% 50%",
        }}
      />

      <div
        id="intro-preloader-headline-wrapper"
        className="absolute inset-0 z-10 flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          id="intro-preloader-headline-viewport"
          className="max-w-[100vw] overflow-hidden"
        >
          <h1
            ref={headlineRef}
            id="intro-preloader-headline"
            className="split max-w-[100vw] font-sans font-black uppercase leading-[0.9] tracking-tighter text-white [font-size:clamp(1.75rem,8vw,9.5rem)]"
            style={{
              opacity: 0,
            }}
          >
            pool
          </h1>
        </div>
      </div>

    </div>
  );
}
