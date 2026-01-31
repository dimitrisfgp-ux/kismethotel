import type { Metadata, Viewport } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { DateProvider } from "@/contexts/DateContext";
import { UIProvider } from "@/contexts/UIContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWidget } from "@/components/layout/FloatingWidget";


const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kismet - Boutique Accommodation in Crete",
    template: "%s | Kismet Hotel"
  },
  description: "Experience luxury and serenity at Kismet Hotel, Crete. Curated suites, breathtaking views, and authentic Greek hospitality.",
  keywords: ["hotel", "crete", "luxury", "accommodation", "boutique", "greece", "vacation"],
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://kismethotel.com",
    siteName: "Kismet Hotel",
    images: [
      {
        url: "https://placehold.co/1200x630/E8DCC4/2F3437?text=Kismet+Hotel",
        width: 1200,
        height: 630,
        alt: "Kismet Hotel Hero",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Kismet Hotel - Crete",
    description: "Curated luxury accommodations.",
    images: ["https://placehold.co/1200x630/E8DCC4/2F3437?text=Kismet+Hotel"],
  }
};

export const viewport: Viewport = {
  themeColor: "#4A90E2",
  width: "device-width",
  initialScale: 1,
};

import { ScrollToTop } from "@/components/layout/ScrollToTop";

// ...
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <body className="antialiased bg-[var(--color-warm-white)] text-[var(--color-charcoal)]">
        <UIProvider>
          <DateProvider>
            <ScrollToTop />
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <FloatingWidget />
          </DateProvider>
        </UIProvider>
      </body>
    </html>
  );
}
