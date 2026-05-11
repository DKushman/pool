import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.daumarchitekten.com"),
  title: {
    default: "pool Zürich",
    template: "%s — pool Zürich",
  },
  description:
    "pool in Zürich. Architektur und Planung mit klarem gestalterischem Anspruch.",
  applicationName: "pool",
  keywords: [
    "pool",
    "pool Zürich",
    "Architektur Zürich",
    "Architekten Zürich",
    "Bauplanung",
    "Generalplanung",
    "Architekturbuero Berlin",
  ],
  authors: [{ name: "pool" }],
  creator: "pool",
  publisher: "pool",
  category: "architecture",
  alternates: {
    canonical: "/",
    languages: {
      "de-DE": "/",
      "en-US": "/#english-section",
    },
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: "pool",
    title: "pool Zürich",
    description:
      "pool in Zürich. Architektur und Planung mit klarem gestalterischem Anspruch.",
  },
  twitter: {
    card: "summary_large_image",  
    title: "pool Zürich",
    description:
      "pool in Zürich. Architektur und Planung mit klarem gestalterischem Anspruch.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-white font-sans text-black"
      >
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
