import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import WebVitals from "@/components/WebVitals";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
});

import { SITE_DESCRIPTION, SITE_LOCALE, SITE_NAME, siteUrl } from "@/lib/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.tedcromwell.com",
  ),
  title: { default: SITE_NAME, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: siteUrl() }],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    url: siteUrl(),
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: siteUrl("/og-default.png"), width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [siteUrl("/og-default.png")],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerif.variable}`}>
      <body className="min-h-screen bg-bg text-ink font-sans antialiased flex flex-col">
        <Nav />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-10">{children}</main>
        <Footer />
        <GoogleAnalytics />
        <WebVitals />
      </body>
    </html>
  );
}
