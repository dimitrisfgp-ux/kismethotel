import type { Metadata, Viewport } from "next";
import { montserrat, inter } from "@/lib/fonts";
import "../globals.css";
import { DateProvider } from "@/contexts/DateContext";
import { UIProvider } from "@/contexts/UIContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { SessionProvider } from "@/contexts/SessionContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWidget } from "@/components/layout/FloatingWidget";



export const metadata: Metadata = {
  title: {
    default: "Kismet - Boutique Accommodation in Crete",
    template: "%s | Kismet"
  },
  description: "Experience luxury and serenity at Kismet, Crete. Curated suites, breathtaking views, and authentic Greek hospitality.",
  keywords: ["hotel", "crete", "luxury", "accommodation", "boutique", "greece", "vacation"],
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://kismethotel.com",
    siteName: "Kismet",
    images: [
      {
        url: "https://placehold.co/1200x630/E8DCC4/2F3437?text=Kismet",
        width: 1200,
        height: 630,
        alt: "Kismet Hero",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Kismet - Crete",
    description: "Curated luxury accommodations.",
    images: ["https://placehold.co/1200x630/E8DCC4/2F3437?text=Kismet"],
  }
};

export const viewport: Viewport = {
  themeColor: "#2C5F8D", // var(--color-deep-med)
  width: "device-width",
  initialScale: 1,
};

import { ScrollToTop } from "@/components/layout/ScrollToTop";

// ...
import { contentService } from "@/services/contentService";
import { roomService } from "@/services/roomService";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, roomSummaries] = await Promise.all([
    contentService.getSettings(),
    roomService.getRoomsSummary()
  ]);

  // getRoomsSummary already returns { id, name, slug, pricePerNight }
  // Add sizeSqm and maxOccupancy as 0 since header only needs name/slug
  const roomsForHeader = roomSummaries.map(r => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    sizeSqm: 0,
    maxOccupancy: 0
  }));

  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <body className="antialiased bg-[var(--color-warm-white)] text-[var(--color-charcoal)]">
        <UIProvider>
          <SessionProvider>
            <DateProvider>
              <ToastProvider>
                <ScrollToTop />
                <Header settings={settings} rooms={roomsForHeader} />
                <main className="min-h-screen">
                  {children}
                </main>
                <Footer settings={settings} />
                <FloatingWidget settings={settings} />
              </ToastProvider>
            </DateProvider>
          </SessionProvider>
        </UIProvider>
      </body>
    </html>
  );
}

