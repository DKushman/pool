"use client";

import { useGSAP } from "@gsap/react";
import { useLayoutEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap-client";
import { HERO_HEADLINE_DELAY_S } from "@/lib/heroRevealTiming";

const LINE_DURATION_S = 0.72;
const LINE_STAGGER_S = 0.055;

type HeroHeadlineProps = {
  id?: string;
  reveal: boolean;
  reducedMotion: boolean;
};

export function HeroHeadline({
  id = "hero-headline",
  reveal,
  reducedMotion,
}: HeroHeadlineProps) {
  const headingRef = useRef<HTMLSpanElement>(null);

  /** Vor Intro / ohne Animation: unsichtbar — nur GSAP, kein Tailwind-opacity-Toggle (vermeidet Flackern mit clearProps). */
  useLayoutEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    if (reducedMotion) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }
    if (!reveal) {
      gsap.set(el, { autoAlpha: 0 });
    }
  }, [reveal, reducedMotion]);

  useGSAP(
    () => {
      const el = headingRef.current;
      if (!el || reducedMotion || !reveal) return;

      gsap.set(el, { autoAlpha: 0 });
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        aria: "auto",
      });

      gsap.set(split.lines, { yPercent: 100, force3D: true });
      gsap.set(el, { autoAlpha: 1 });

      const tl = gsap.timeline({
        delay: HERO_HEADLINE_DELAY_S,
        defaults: { ease: "power2.out" },
      });

      tl.to(split.lines, {
        yPercent: 0,
        duration: LINE_DURATION_S,
        stagger: LINE_STAGGER_S,
        force3D: true,
      });

      return () => {
        tl.kill();
        split.revert();
      };
    },
    { scope: headingRef, dependencies: [reveal, reducedMotion] },
  );

  return (
    <span
      ref={headingRef}
      id={id}
      className="block max-w-[100vw] font-sans font-black uppercase leading-[0.9] tracking-tighter text-black [font-size:clamp(1.75rem,8vw,9.5rem)]"
    >
      pool
    </span>
  );
}
