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

export const dynamic = 'force-dynamic';

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
  const [settings, rooms] = await Promise.all([
    contentService.getSettings(),
    roomService.getRooms()
  ]);

  // Map to minimal room summary for header
  const roomSummaries = rooms.map(r => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    sizeSqm: r.sizeSqm,
    maxOccupancy: r.maxOccupancy
  }));

  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <body className="antialiased bg-[var(--color-warm-white)] text-[var(--color-charcoal)]">
        <UIProvider>
          <SessionProvider>
            <DateProvider>
              <ToastProvider>
                <ScrollToTop />
                <Header settings={settings} rooms={roomSummaries} />
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

