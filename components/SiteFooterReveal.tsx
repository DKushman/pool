"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { PillArrowButton } from "@/components/PillArrowButton";

const POOL_SITE = "https://www.poolarch.ch";

export function SiteFooterReveal() {
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl) return;

    const syncFooterHeight = () => {
      document.documentElement.style.setProperty(
        "--site-footer-reveal-height",
        `${footerEl.offsetHeight}px`,
      );
    };

    syncFooterHeight();
    const resizeObserver = new ResizeObserver(syncFooterHeight);
    resizeObserver.observe(footerEl);
    window.addEventListener("resize", syncFooterHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncFooterHeight);
    };
  }, []);

  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      footerEl.style.transform = "translate3d(0, 0px, 0)";
      return;
    }

    const spacerEl = document.getElementById("site-footer-reveal-spacer");
    if (!spacerEl) {
      footerEl.style.transform = "translate3d(0, 0px, 0)";
      return;
    }

    let lastScrollY = window.scrollY;
    let shiftPx = 0;
    let revealOffsetPx = 64;
    let pendingRaf = 0;
    let settleTimer = 0;
    let lastAppliedTransform = "";

    const applyTransform = () => {
      const transform = `translate3d(0, ${revealOffsetPx + shiftPx}px, 0)`;
      if (transform !== lastAppliedTransform) {
        footerEl.style.transform = transform;
        lastAppliedTransform = transform;
      }
    };

    const updateFooterPosition = () => {
      pendingRaf = 0;
      const rect = spacerEl.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const revealStart = viewportH * 1.02;
      const revealEnd = viewportH * 0.02;
      const progress = Math.min(
        1,
        Math.max(0, (revealStart - rect.top) / Math.max(1, revealStart - revealEnd)),
      );
      revealOffsetPx = (1 - progress) * 64;

      const nextY = window.scrollY;
      const delta = nextY - lastScrollY;
      lastScrollY = nextY;

      if (delta < 0) {
        shiftPx = Math.min(26, Math.abs(delta) * 0.62);
        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(() => {
          shiftPx = 0;
          applyTransform();
        }, 180);
      } else {
        shiftPx = Math.max(0, shiftPx - 2.2);
      }

      applyTransform();
    };

    const onScrollOrResize = () => {
      if (pendingRaf) return;
      pendingRaf = window.requestAnimationFrame(updateFooterPosition);
    };

    applyTransform();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      window.cancelAnimationFrame(pendingRaf);
      window.clearTimeout(settleTimer);
    };
  }, []);

  const navClass =
    "text-white/76 underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

  return (
    <footer
      ref={footerRef}
      id="site-footer-reveal"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-0 rounded-tl-[clamp(1rem,2.2vw,1.8rem)] rounded-tr-[clamp(1rem,2.2vw,1.8rem)] bg-[#000000] text-white will-change-transform"
      aria-label="Site footer"
      style={{ transform: "translate3d(0, 64px, 0)" }}
    >
      <div
        id="site-footer-shell"
        className="pointer-events-auto mx-auto w-full max-w-[100rem] overflow-hidden rounded-tl-[clamp(1rem,2.2vw,1.8rem)] rounded-tr-[clamp(1rem,2.2vw,1.8rem)] px-[clamp(1rem,4vw,2.5rem)] py-[clamp(1.2rem,2.8vw,2.2rem)]"
      >
        <div
          id="site-footer-cta-row"
          className="flex flex-col items-start gap-[clamp(0.9rem,2.3vw,1.5rem)] border-b border-white/12 pb-[clamp(1rem,2.4vw,1.8rem)]"
        >
          <p
            id="site-footer-kicker"
            className="max-w-[40ch] font-sans text-[clamp(0.72rem,1vw,0.86rem)] leading-[1.35] text-white/72 md:max-w-[32ch]"
          >
            pool Genossenschaft, Bremgartnerstrasse 7, CH-8003 Zürich.
          </p>

          <div className="w-full">
            <PillArrowButton
              id="site-footer-cta-link"
              href="mailto:pool@poolarch.ch"
              label="E-Mail an pool Architekten"
              tone="light"
              className="w-full justify-start sm:w-auto"
            />
          </div>
        </div>

        <section
          id="site-footer-meta-row"
          className="mt-[clamp(0.9rem,2vw,1.5rem)] grid grid-cols-1 gap-[clamp(0.9rem,2vw,1.5rem)] text-[clamp(0.72rem,0.98vw,0.84rem)] leading-[1.4] text-white/76 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          <div id="site-footer-contact-col" className="min-w-0 break-words">
            <p className="font-medium text-white">Kontakt:</p>
            <ul className="mt-[clamp(0.22rem,0.5vw,0.35rem)] space-y-[clamp(0.18rem,0.42vw,0.32rem)]">
              <li>pool</li>
              <li>Bremgartnerstrasse 7</li>
              <li>8003 Zürich</li>
              <li>
                <a className={navClass} href="tel:+41442007070">
                  T +41 44 200 70 70
                </a>
              </li>
              <li>
                <a className={navClass} href="mailto:pool@poolarch.ch">
                  pool@poolarch.ch
                </a>
              </li>
              <li>
                <a
                  className={navClass}
                  href="https://www.instagram.com/poolarchitekten/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div id="site-footer-news-col" className="min-w-0">
            <p className="font-medium text-white">
              <a
                className={navClass}
                href={`${POOL_SITE}/index/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                News
              </a>
            </p>
          </div>

          <div id="site-footer-projekte-col" className="min-w-0">
            <p className="font-medium text-white">
              <a
                className={navClass}
                href={`${POOL_SITE}/projekte/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Projekte
              </a>
            </p>
            <ul className="mt-[clamp(0.22rem,0.5vw,0.35rem)] space-y-[clamp(0.18rem,0.42vw,0.32rem)]">
              <li>
                <a
                  className={navClass}
                  href={`${POOL_SITE}/projekte/karte.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Karte
                </a>
              </li>
              <li>
                <a
                  className={navClass}
                  href={`${POOL_SITE}/projekte/projektstand.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Projektstand
                </a>
                <ul className="mt-[clamp(0.12rem,0.35vw,0.22rem)] space-y-[clamp(0.12rem,0.35vw,0.22rem)] border-l border-white/14 pl-[clamp(0.45rem,1vw,0.65rem)]">
                  <li>
                    <a
                      className={navClass}
                      href={`${POOL_SITE}/projekte/projektstand.html&refPage=Projektstand&filter=Ausgeführt`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ausgeführt
                    </a>
                  </li>
                  <li>
                    <a
                      className={navClass}
                      href={`${POOL_SITE}/projekte/projektstand.html&refPage=Projektstand&filter=In Bearbeitung`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      In Bearbeitung
                    </a>
                  </li>
                  <li>
                    <a
                      className={navClass}
                      href={`${POOL_SITE}/projekte/projektstand.html&refPage=Projektstand&filter=1. Preis`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      1. Preis
                    </a>
                  </li>
                  <li>
                    <a
                      className={navClass}
                      href={`${POOL_SITE}/projekte/projektstand.html&refPage=Projektstand&filter=Wettbewerbe`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Wettbewerbe
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a
                  className={navClass}
                  href={`${POOL_SITE}/projekte/werkverzeichnis.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Werkverzeichnis
                </a>
              </li>
              <li>
                <a
                  className={navClass}
                  href={`${POOL_SITE}/projekte/nutzung.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nutzung
                </a>
                <ul className="mt-[clamp(0.12rem,0.35vw,0.22rem)] space-y-[clamp(0.12rem,0.35vw,0.22rem)] border-l border-white/14 pl-[clamp(0.45rem,1vw,0.65rem)]">
                  <li>
                    <a
                      className={navClass}
                      href={`${POOL_SITE}/projekte/nutzung.html&refPage=Nutzung&filter=Städtebau`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Städtebau
                    </a>
                  </li>
                  <li>
                    <a
                      className={navClass}
                      href={`${POOL_SITE}/projekte/nutzung.html&refPage=Nutzung&filter=Wohnen`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Wohnen
                    </a>
                  </li>
                  <li>
                    <a
                      className={navClass}
                      href={`${POOL_SITE}/projekte/nutzung.html&refPage=Nutzung&filter=Dienstleistung`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Dienstleistung
                    </a>
                  </li>
                  <li>
                    <a
                      className={navClass}
                      href={`${POOL_SITE}/projekte/nutzung.html&refPage=Nutzung&filter=Mixed`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Mixed
                    </a>
                  </li>
                  <li>
                    <a
                      className={navClass}
                      href={`${POOL_SITE}/projekte/nutzung.html&refPage=Nutzung&filter=Schulen`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Schulen
                    </a>
                  </li>
                  <li>
                    <a
                      className={navClass}
                      href={`${POOL_SITE}/projekte/nutzung.html&refPage=Nutzung&filter=Öffentliche Bauten`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Öffentliche Bauten
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div id="site-footer-buero-col" className="min-w-0">
            <p className="font-medium text-white">
              <a
                className={navClass}
                href={`${POOL_SITE}/buero/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Büro
              </a>
            </p>
            <ul className="mt-[clamp(0.22rem,0.5vw,0.35rem)] space-y-[clamp(0.18rem,0.42vw,0.32rem)]">
              <li>
                <Link className={navClass} href="#profil-section-section">
                  Portrait
                </Link>
              </li>
              <li>
                <Link className={navClass} href="#team-section">
                  Team
                </Link>
              </li>
              <li>
                <a
                  className={navClass}
                  href={`${POOL_SITE}/buero/jobs.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Jobs
                </a>
              </li>
              <li>
                <Link className={navClass} href="#site-contact-cta-section">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          <div id="site-footer-annex-col" className="min-w-0">
            <p className="font-medium text-white">
              <a
                className={navClass}
                href={`${POOL_SITE}/annex/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Annex
              </a>
            </p>
            <ul className="mt-[clamp(0.22rem,0.5vw,0.35rem)] space-y-[clamp(0.18rem,0.42vw,0.32rem)]">
              <li>
                <a
                  className={navClass}
                  href={`${POOL_SITE}/annex/ausstellungen.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ausstellungen
                </a>
              </li>
              <li>
                <a
                  className={navClass}
                  href={`${POOL_SITE}/annex/buecher.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Bücher
                </a>
              </li>
              <li>
                <a
                  className={navClass}
                  href={`${POOL_SITE}/annex/galerie/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Galerie
                </a>
              </li>
              <li>
                <a
                  className={navClass}
                  href={`${POOL_SITE}/annex/publikationen/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Publikationen
                </a>
              </li>
              <li>
                <a
                  className={navClass}
                  href={`${POOL_SITE}/annex/auszeichnungen.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Auszeichnungen
                </a>
              </li>
            </ul>
          </div>

          <div id="site-footer-impressum-col" className="min-w-0 break-words">
            <p className="font-medium text-white">
              <a
                className={navClass}
                href={`${POOL_SITE}/impressum.html`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Impressum
              </a>
            </p>
            <ul className="mt-[clamp(0.22rem,0.5vw,0.35rem)] space-y-[clamp(0.18rem,0.42vw,0.32rem)]">
              <li>
                <a
                  className={navClass}
                  href={`${POOL_SITE}/impressum/datenschutzinformationen.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Datenschutzinformation
                </a>
              </li>
            </ul>
            <p className="mt-[clamp(0.8rem,1.5vw,1.1rem)] text-white/76">
              © pool {new Date().getFullYear()}
            </p>
          </div>
        </section>

        <div
          id="site-footer-brand"
          className="mt-[clamp(1rem,2.3vw,1.8rem)] border-t border-white/10 pt-[clamp(1rem,2.3vw,1.8rem)]"
        >
          <span className="block max-w-[100vw] font-sans font-medium leading-[0.92] tracking-tight text-white [font-size:clamp(1.75rem,8vw,9.5rem)]">
            pool 
          </span>
        </div>
      </div>
    </footer>
  );
}
