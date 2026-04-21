import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: "Ted Cromwell",
  description: "Blog, concerts, travel, and resume.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.tedcromwell.com",
  ),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerif.variable}`}>
      <body className="min-h-screen bg-bg text-ink font-sans antialiased flex flex-col">
        <Nav />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
