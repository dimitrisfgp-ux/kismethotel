import type { Metadata, Viewport } from "next";
import { montserrat, inter } from "@/lib/fonts";
import "../globals.css";
import { DateProvider } from "@/contexts/DateContext";
import { UIProvider } from "@/contexts/UIContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWidget } from "@/components/layout/FloatingWidget";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await contentService.getSettings();

  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <body className="antialiased bg-[var(--color-warm-white)] text-[var(--color-charcoal)]">
        <UIProvider>
          <DateProvider>
            <ToastProvider>
              <ScrollToTop />
              <Header settings={settings} />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer settings={settings} />
              <FloatingWidget settings={settings} />
            </ToastProvider>
          </DateProvider>
        </UIProvider>
      </body>
    </html>
  );
}
