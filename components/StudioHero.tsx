"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/** Aligns with tokens/motion.tokens.json stagger.heroLines (100ms) */
const HERO_STAGGER_S = 0.1;

const headline = "ARCHITEKTEN UND GENERALPLANER";
const HERO_BG_IMAGE =
  "https://www.poolarch.ch/assets/projekte/0529%20Lauchernalp/0529_Provisorisches%20Hotel%20Lauchernalp_Baustelle_6002_1180.png";

function LogoMark() {
  return (
    <div
      className="grid grid-cols-2 gap-0.5"
      aria-hidden="true"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className="block size-1 rounded-full bg-white/90"
        />
      ))}
    </div>
  );
}

function NavLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`nav-reveal group relative inline-block py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/85 transition-colors hover:text-white focus-visible:text-white ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-white/80 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
        aria-hidden="true"
      />
    </Link>
  );
}

export default function StudioHero() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const q = gsap.utils.selector(root);
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(q(".nav-reveal, .hero-reveal, .headline-word-inner"), {
          autoAlpha: 1,
          yPercent: 0,
        });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.from(q(".nav-reveal"), {
        autoAlpha: 0,
        y: 14,
        duration: 0.75,
        stagger: 0.06,
      })
        .from(
          q(".hero-reveal"),
          {
            autoAlpha: 0,
            y: 20,
            duration: 0.85,
            stagger: HERO_STAGGER_S,
          },
          "-=0.45",
        )
        .from(
          q(".headline-word-inner"),
          {
            yPercent: 110,
            autoAlpha: 0,
            duration: 0.95,
            stagger: HERO_STAGGER_S,
            ease: "power4.out",
          },
          "-=0.55",
        );
    },
    { scope: rootRef },
  );

  const words = headline.split(" ");

  return (
    <header
      ref={rootRef}
      className="relative isolate min-h-[100dvh] w-full overflow-hidden"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={HERO_BG_IMAGE}
          alt=""
          className="h-full w-full object-cover object-center"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] flex-col px-5 pb-10 pt-6 sm:px-8 sm:pb-14 sm:pt-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="nav-reveal flex items-center gap-3">
            <LogoMark />
            <span className="font-sans text-sm font-medium tracking-wide text-white">
              pool
            </span>
          </div>

          <nav
            className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-white/90"
            aria-label="Primary"
          >
            <ul className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
              <li>
                <NavLink href="#profil">Profil</NavLink>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white/50" aria-hidden="true">
                  •
                </span>
                <Link
                  href="#blog"
                  className="nav-reveal group relative inline-block py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white focus-visible:text-white"
                  aria-current="page"
                >
                  <span className="relative z-10">Blog</span>
                  <span
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/90"
                    aria-hidden="true"
                  />
                </Link>
              </li>
              <li>
                <NavLink href="#projekte">Projekte</NavLink>
              </li>
            </ul>
          </nav>

          <nav
            className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-white/90 sm:text-right"
            aria-label="Secondary"
          >
            <ul className="flex flex-col gap-2 sm:items-end">
              <li>
                <NavLink href="#kunden">Kunden</NavLink>
              </li>
              <li>
                <NavLink href="#kontakt">Kontakt</NavLink>
              </li>
              <li>
                <NavLink href="#english">English</NavLink>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-auto grid flex-1 grid-cols-1 gap-10 pt-16 sm:grid-cols-12 sm:items-end sm:gap-6 sm:pt-24">
          <p className="hero-reveal hero-eyebrow font-sans text-[11px] font-medium uppercase leading-relaxed tracking-[0.25em] text-white/80 sm:col-span-3">
            pool Architekten
            <br />
            Zürich
          </p>

          <div className="hero-reveal sm:col-span-5 sm:col-start-5">
            <p className="mb-2 font-sans text-[10px] uppercase tracking-[0.35em] text-white/55">
              Profil
            </p>
            <p className="max-w-md font-sans text-sm leading-relaxed text-white/90 sm:text-base">
              Daum Architekten entwickelt zeitlose Architektur mit klarem
              Fokus auf Raumqualität, Materialität und nachhaltige Wirkung.
            </p>
          </div>

          <div className="hero-reveal sm:col-span-3 sm:col-start-11 sm:flex sm:justify-end">
            <NavLink href="#kontakt" className="text-sm normal-case tracking-normal">
              Kontakt&nbsp;→
            </NavLink>
          </div>
        </div>

        <h1
          className="mt-10 font-serif text-[clamp(2.75rem,11vw,7rem)] font-medium leading-[0.92] tracking-tight text-white sm:mt-14"
          aria-label={headline}
        >
          <span
            className="flex flex-wrap gap-x-[0.2em] gap-y-1"
            aria-hidden="true"
          >
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="inline-block overflow-hidden pb-1"
              >
                <span className="headline-word-inner inline-block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </span>
        </h1>
      </div>
    </header>
  );
}
