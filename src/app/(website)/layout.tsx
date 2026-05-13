import type { Metadata, Viewport } from "next";
import { montserrat, inter } from "@/lib/fonts";
import "../globals.css";
import { DateProvider } from "@/contexts/DateContext";
import { UIProvider } from "@/contexts/UIContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { SessionProvider } from "@/contexts/SessionContext";
import { HoldContentionProvider } from "@/contexts/HoldContentionContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWidget } from "@/components/layout/FloatingWidget";
import { HoldBlockedModal } from "@/components/booking/HoldBlockedModal";
import { FloatingHoldTimer } from "@/components/booking/FloatingHoldTimer";



export const metadata: Metadata = {
  metadataBase: new URL("https://kismethotel.com"),
  title: {
    default: "Kismet - Boutique Accommodation in Crete",
    template: "%s | Kismet"
  },
  description: "Experience luxury and serenity at Kismet, Crete. Curated suites, breathtaking views, and authentic Greek hospitality.",
  keywords: ["hotel", "crete", "luxury", "accommodation", "boutique", "greece", "vacation"],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: "Kismet",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kismet - Boutique Accommodation in Crete",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Kismet - Crete",
    description: "Curated luxury accommodations.",
    images: ["/og-image.jpg"],
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
import { getMode } from "@/lib/mode";
import { GUESTY_SETTINGS } from "@/config/guestyMode";
import { GuestyContactCTA } from "@/components/layout/GuestyContactCTA";
import { HOTEL_COORDINATES } from "@/lib/constants";
import type { HotelSettings } from "@/types";

type RoomsForHeader = {
  id: string;
  slug: string;
  name: string;
  sizeSqm: number;
  maxOccupancy: number;
}[];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // In Guesty mode the Supabase-backed CMS may be paused.
  // Skip the request-time fetch and feed Header/Footer/FloatingWidget hardcoded values.
  const mode = await getMode();

  let settings: HotelSettings;
  let roomsForHeader: RoomsForHeader;

  if (mode === "guesty") {
    settings = GUESTY_SETTINGS;
    roomsForHeader = [];
  } else {
    const [s, roomSummaries] = await Promise.all([
      contentService.getSettings(),
      roomService.getRoomsSummary()
    ]);
    settings = s;
    // getRoomsSummary already returns { id, name, slug, pricePerNight }.
    // Header only needs name/slug — pad sizeSqm/maxOccupancy to satisfy its type.
    roomsForHeader = roomSummaries.map(r => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      sizeSqm: 0,
      maxOccupancy: 0
    }));
  }

  // Schema.org Hotel structured data — helps Google render rich results
  // (knowledge panel, location, contact). Address parsed from
  // settings.contact.address: "<street>, <locality> <postal>".
  const addrMatch = settings.contact.address.match(/^(.+?),\s*(.+?)\s+(\d{3}\s?\d{2})$/);
  const hotelJsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: settings.name,
    description: settings.description,
    url: "https://kismethotel.com",
    image: "https://kismethotel.com/og-image.jpg",
    telephone: settings.contact.phone,
    email: settings.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: addrMatch?.[1] ?? settings.contact.address,
      addressLocality: addrMatch?.[2] ?? "Heraklion",
      postalCode: addrMatch?.[3] ?? "",
      addressCountry: "GR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: HOTEL_COORDINATES[0],
      longitude: HOTEL_COORDINATES[1],
    },
    priceRange: "€€",
  };

  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <body className="antialiased bg-[var(--color-warm-white)] text-[var(--color-charcoal)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd) }}
        />
        <UIProvider>
          <SessionProvider>
            <DateProvider>
              <ToastProvider>
                <HoldContentionProvider>
                  <ScrollToTop />
                  <Header settings={settings} rooms={roomsForHeader} />
                  <main className="min-h-screen">
                    {children}
                  </main>
                  <Footer
                    settings={settings}
                    rightPanel={mode === "guesty" ? <GuestyContactCTA /> : undefined}
                  />
                  <FloatingHoldTimer />
                  <FloatingWidget settings={settings} />
                  <HoldBlockedModal />
                </HoldContentionProvider>
              </ToastProvider>
            </DateProvider>
          </SessionProvider>
        </UIProvider>
      </body>
    </html>
  );
}

