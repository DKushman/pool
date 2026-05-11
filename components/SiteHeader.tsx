"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap, SplitText } from "@/lib/gsap-client";
import { HEADER_SHELL_IN_DURATION_S } from "@/lib/heroRevealTiming";

const MENU_LINKS = [
  { id: "menu-link-profil", label: "Home", href: "#profil-section" },
  { id: "menu-link-blog", label: "Team", href: "#blog-section" },
  { id: "menu-link-projekte", label: "Projekte", href: "#projekte-section" },
  { id: "menu-link-kunden", label: "Datenschutz", href: "#kunden-section" },
  { id: "menu-link-kontakt", label: "Impressum", href: "#site-contact-cta-section" },
] as const;

type SplitTextInstance = InstanceType<typeof SplitText>;

type SiteHeaderProps = {
  contactHref?: string;
  introDone?: boolean;
  reducedMotion?: boolean;
};

export function SiteHeader({
  contactHref = "mailto:office@daumarchitekten.com",
  introDone = false,
  reducedMotion = false,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  /** Nach Ende des SplitText-Entrance-Timeline (bei reducedMotion irrelevant). */
  const [menuIntroComplete, setMenuIntroComplete] = useState(false);
  const menuId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const [shellRevealDone, setShellRevealDone] = useState(reducedMotion);
  const panelRef = useRef<HTMLDivElement>(null);
  /** Label nodes that SplitText masks (single line → one masked stripe per link). */
  const menuLabelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const splitsRef = useRef<SplitTextInstance[]>([]);
  const menuEnterTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const menuClosingRef = useRef(false);

  const revertMenuSplits = useCallback(() => {
    splitsRef.current.forEach((s) => s.revert());
    splitsRef.current = [];
  }, []);

  const openMenu = useCallback(() => {
    menuClosingRef.current = false;
    setMenuIntroComplete(false);
    setMenuOpen(true);
  }, []);

  const menuHoverReelActive = reducedMotion
    ? menuOpen
    : menuOpen && menuIntroComplete;

  const closeMenu = useCallback(() => {
    if (menuClosingRef.current) return;

    if (reducedMotion) {
      revertMenuSplits();
      setMenuIntroComplete(false);
      setMenuOpen(false);
      return;
    }

    menuClosingRef.current = true;

    const panel = panelRef.current;
    menuEnterTimelineRef.current?.kill();
    menuEnterTimelineRef.current = null;

    const finishClosed = () => {
      revertMenuSplits();
      gsap.set(panel, { yPercent: 100 });
      menuClosingRef.current = false;
      setMenuIntroComplete(false);
      setMenuOpen(false);
    };

    if (!panel) {
      menuClosingRef.current = false;
      revertMenuSplits();
      setMenuIntroComplete(false);
      setMenuOpen(false);
      return;
    }

    const splits = splitsRef.current;
    const maskedLines = splits.flatMap((s) => s.lines);

    if (splits.length === 0 || maskedLines.length === 0) {
      gsap.killTweensOf(panel);
      gsap.to(panel, {
        yPercent: 100,
        duration: 0.55,
        ease: "power3.in",
        onComplete: finishClosed,
      });
      return;
    }

    gsap.killTweensOf([panel, maskedLines]);

    gsap
      .timeline({ onComplete: finishClosed })
      .to(maskedLines, {
        yPercent: 100,
        opacity: 0,
        duration: 0.26,
        stagger: { each: 0.028, from: "end" },
        ease: "power2.in",
      })
      .to(
        panel,
        { yPercent: 100, duration: 0.58, ease: "power3.in" },
        0.05,
      );
  }, [reducedMotion, revertMenuSplits]);

  useEffect(() => {
    if (!menuOpen) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useLayoutEffect(() => {
    if (!menuOpen || reducedMotion) return;

    const panel = panelRef.current;
    if (!panel) return;

    menuEnterTimelineRef.current?.kill();
    revertMenuSplits();

    gsap.killTweensOf(panel);

    gsap.set(panel, { yPercent: 100 });

    const labelEls = MENU_LINKS.map((_, i) => menuLabelRefs.current[i]).filter(
      Boolean,
    ) as HTMLSpanElement[];

    if (labelEls.length !== MENU_LINKS.length) return;

    for (const el of labelEls) {
      splitsRef.current.push(
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        }),
      );
    }

    const maskedLines = splitsRef.current.flatMap((s) => s.lines);

    gsap.set(maskedLines, { yPercent: 112, opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        revertMenuSplits();
        setMenuIntroComplete(true);
      },
    });
    menuEnterTimelineRef.current = tl;

    tl.to(panel, {
      yPercent: 0,
      duration: 0.82,
      ease: "power3.out",
    }).to(
      maskedLines,
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.52,
        stagger: 0.055,
        ease: "power2.out",
      },
      "-=0.42",
    );

    return () => {
      tl.kill();
      menuEnterTimelineRef.current = null;
      revertMenuSplits();
    };
  }, [menuOpen, reducedMotion, revertMenuSplits]);

  useGSAP(
    () => {
      const shell = shellRef.current;
      if (!shell || !introDone || reducedMotion) return;

      gsap.fromTo(
        shell,
        { opacity: 0, y: -12 },
        {
          opacity: 1,
          y: 0,
          duration: HEADER_SHELL_IN_DURATION_S,
          ease: "power2.out",
          onComplete: () => setShellRevealDone(true),
        },
      );
    },
    { dependencies: [introDone, reducedMotion] },
  );

  const hideShell = !shellRevealDone && !reducedMotion;

  return (
    <>
      <header
        id="site-header"
        className="pointer-events-none fixed inset-x-0 top-0 z-40 pt-[clamp(1rem,3vw,2rem)]"
      >
        <div
          ref={shellRef}
          id="site-header-shell"
          className={
            "flex w-full items-start justify-between px-[clamp(1rem,4vw,2.5rem)] " +
            (hideShell ? "opacity-0" : "")
          }
        >
          <div className="pointer-events-auto">
            <button
              id="menu-open-button"
              type="button"
              className="group flex flex-col gap-1.5 p-0 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={openMenu}
            >
              <span className="sr-only">Menü öffnen</span>
              <span
                aria-hidden="true"
                className="block h-px w-6 bg-black transition-opacity group-hover:opacity-70"
              />
              <span
                aria-hidden="true"
                className="block h-px w-6 bg-black transition-opacity group-hover:opacity-70"
              />
            </button>
          </div>
          <nav
            id="site-nav-utility"
            aria-label="Kurznavigation"
            className="pointer-events-auto"
          >
            <Link
              id="nav-contact-link"
              href={contactHref}
              className={
                "relative inline-block pb-1 font-sans text-xs font-normal text-black no-underline " +
                "transition-opacity after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left " +
                "after:scale-x-0 after:bg-black after:transition-transform after:duration-300 after:ease-out motion-reduce:after:transition-none " +
                "hover:opacity-70 hover:after:scale-x-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black " +
                "focus-visible:after:scale-x-100"
              }
            >
              pool@poolarch.ch
            </Link>
          </nav>
        </div>
      </header>

      <div
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        className={`fixed inset-0 z-50 overflow-hidden transition-[visibility,opacity] duration-150 ease-out ${
          menuOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
        aria-hidden={!menuOpen}
        inert={menuOpen ? undefined : true}
      >
        {/* Blue panel slides up */}
        <div
          ref={panelRef}
          className={`absolute inset-0 flex flex-col bg-[#000000] text-white shadow-[0_-1rem_3rem_rgba(0,0,0,0.25)] ${
            reducedMotion
              ? `transition-transform duration-300 ease-out ${
                  menuOpen ? "translate-y-0" : "translate-y-full"
                }`
              : "will-change-transform"
          }`}
        >
          <div className="relative flex h-full flex-1 flex-col px-[clamp(1.25rem,5vw,3rem)] py-[clamp(1.25rem,4vw,2.5rem)]">
            <div className="flex justify-end">
              <button
                ref={closeButtonRef}
                id="menu-close-button"
                type="button"
                aria-label="Menü schließen"
                className="rounded p-2 text-white/90 outline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                onClick={closeMenu}
              >
                <span aria-hidden className="flex h-6 w-6 items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </span>
              </button>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center">
              <p id="mobile-menu-title" className="sr-only">
                Hauptmenü
              </p>
              <ul
                className={
                  "flex w-full max-w-4xl flex-col items-center px-2 text-center " +
                  "font-sans font-medium uppercase leading-none tracking-normal " +
                  "text-[clamp(1.6rem,5.5vw,3.125rem)] [font-variant-ligatures:none]"
                }
              >
                {MENU_LINKS.map((item, i) => (
                  <li
                    key={item.id}
                    className="flex w-full shrink-0 items-center justify-center py-px"
                  >
                    <Link
                      id={item.id}
                      href={item.href}
                      aria-label={item.label}
                      className={
                        "group block w-full max-w-full text-center text-[inherit] leading-[inherit] " +
                        "text-white/95 no-underline outline-offset-[6px] " +
                        "transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                      }
                      onClick={closeMenu}
                    >
                      <span
                        aria-hidden
                        className="inline-block w-full max-w-full text-center align-middle font-[inherit] text-[inherit] leading-[inherit]"
                      >
                        {menuHoverReelActive ? (
                          <span className="inline-block h-[1.2em] overflow-hidden align-middle">
                            <span
                              className={
                                "flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] " +
                                "will-change-transform group-hover:-translate-y-[1.2em] group-focus-visible:-translate-y-[1.2em] " +
                                "motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 " +
                                "motion-reduce:group-focus-visible:translate-y-0"
                              }
                            >
                              <span className="flex h-[1.2em] w-full items-center justify-center whitespace-nowrap leading-none">
                                {item.label}
                              </span>
                              <span
                                className="flex h-[1.2em] w-full items-center justify-center whitespace-nowrap leading-none"
                                aria-hidden="true"
                              >
                                {item.label}
                              </span>
                            </span>
                          </span>
                        ) : (
                          <span
                            ref={(el) => {
                              menuLabelRefs.current[i] = el;
                            }}
                            className="inline-flex min-h-[1.2em] w-full items-center justify-center whitespace-nowrap leading-none"
                          >
                            {item.label}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
