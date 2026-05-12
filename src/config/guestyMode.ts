import type {
    Attraction,
    Convenience,
    FAQ,
    HotelSettings,
    LocationCategory,
} from '@/types';

export interface GuestyRoomCategory {
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    guestyUrl: string;
    images: {
        main: string;
        secondary: [string, string, string];
        // Additional photos that don't render as visible thumbnails but
        // appear in the carousel arrows/bullets and the fullscreen lightbox.
        extras?: string[];
    };
    layout: 'image-left' | 'image-right';
}

export const GUESTY_HERO = {
    title: 'Urban Accommodation in the Heart of Crete',
    subtitle: 'Built on Comfort & Accessibility',
    ctaText: 'Explore Rooms',
    scrollTargetId: 'category-suite',
    // Shown immediately while the video loads (matches the video's first frame).
    poster: '/hero_videos/pre_load_frame.png',
    videos: {
        // ios + android sources both have media="(max-width: 768px)" inside Hero,
        // so on mobile the browser tries ios first and falls back to android.
        // desktop is the catch-all for everything > 768px.
        ios: '/hero_videos/ios/hero_4k_ios.mp4',
        android: '/hero_videos/android/hero_video_android.mp4',
        desktop: '/hero_videos/android/hero_video_android.mp4',
    },
};

export const GUESTY_SETTINGS: HotelSettings = {
    name: 'Kismet Urban Boutique',
    description: 'Urban Boutique',
    holdDurationMinutes: 0,
    logoMode: 'image',
    logoIconUrl: '/images/Brand%20Media/kismet-logo-icon.svg',
    logoTextUrl: '/images/Brand%20Media/kismet-logo-text.svg',
    contact: {
        address: 'Pl. Riga Feraiou, Heraklion 712 01',
        phone: '+30 2821200522',
        email: 'kismeturbanboutique@gmail.com',
    },
    socials: { whatsapp: '', viber: '', googleReviews: '' },
};

export const GUESTY_ROOM_CATEGORIES: GuestyRoomCategory[] = [
    {
        slug: 'suite',
        title: 'Suite',
        subtitle: 'Our flagship space',
        description:
            'Our largest accommodation, built around a generous lounge area and an extended balcony. It feels like a small urban apartment — every detail considered for comfort, accessibility, and the kind of long, lazy mornings you came to Crete for.',
        guestyUrl:
            'https://kismeturbanboutique.hotelyzer.gr/en/properties/69faf52384a25c001c8e3fa7',
        images: {
            // Pulled from rooms 9 and 10 (the two folders flagged "Suite").
            main: '/images/Kismet_Room_Photos/Optimized/10%20-%20Suite/P1953449.jpg',
            secondary: [
                '/images/Kismet_Room_Photos/Optimized/9%20-%20Suite/P1953209.jpg',
                '/images/Kismet_Room_Photos/Optimized/10%20-%20Suite/P1953474.jpg',
                '/images/Kismet_Room_Photos/Optimized/9%20-%20Suite/P1953679.jpg',
            ],
            extras: [
                '/images/Kismet_Room_Photos/Optimized/10%20-%20Suite/P1953505.jpg',
                '/images/Kismet_Room_Photos/Optimized/10%20-%20Suite/P1953604.jpg',
                '/images/Kismet_Room_Photos/Optimized/10%20-%20Suite/P1953700.jpg',
                '/images/Kismet_Room_Photos/Optimized/10%20-%20Suite/P1953708.jpg',
                '/images/Kismet_Room_Photos/Optimized/10%20-%20Suite/P1953689.jpg',
                '/images/Kismet_Room_Photos/Optimized/9%20-%20Suite/P1953233.jpg',
                '/images/Kismet_Room_Photos/Optimized/9%20-%20Suite/P1953368.jpg',
                '/images/Kismet_Room_Photos/Optimized/9%20-%20Suite/P1953412.jpg',
                '/images/Kismet_Room_Photos/Optimized/9%20-%20Suite/P1953681.jpg',
                '/images/Kismet_Room_Photos/Optimized/9%20-%20Suite/P1953663.jpg',
            ],
        },
        layout: 'image-left',
    },
    {
        slug: 'deluxe',
        title: 'Deluxe',
        subtitle: 'Your own balcony over the city',
        description:
            'Step out onto your private balcony and watch Iraklio wake up below. The Deluxe adds space, light, and an outdoor moment to the comfort of our standard offering — for travellers who want a little more room to breathe.',
        guestyUrl:
            'https://kismeturbanboutique.hotelyzer.gr/en/properties/69faf38789895900135fe738',
        images: {
            // Pulled from rooms 3, 4, and 8 (the three folders flagged "Deluxe").
            main: '/images/Kismet_Room_Photos/Optimized/3%20-%20Deluxe/P1942404.jpg',
            secondary: [
                '/images/Kismet_Room_Photos/Optimized/4%20-%20Deluxe/P1942568.jpg',
                '/images/Kismet_Room_Photos/Optimized/8%20-%20Deluxe/P1953038.jpg',
                '/images/Kismet_Room_Photos/Optimized/3%20-%20Deluxe/P1942424.jpg',
            ],
            extras: [
                '/images/Kismet_Room_Photos/Optimized/3%20-%20Deluxe/P1942447.jpg',
                '/images/Kismet_Room_Photos/Optimized/3%20-%20Deluxe/P1942502.jpg',
                '/images/Kismet_Room_Photos/Optimized/3%20-%20Deluxe/P1942535.jpg',
                '/images/Kismet_Room_Photos/Optimized/3%20-%20Deluxe/P1942552.jpg',
                '/images/Kismet_Room_Photos/Optimized/4%20-%20Deluxe/P1942596.jpg',
                '/images/Kismet_Room_Photos/Optimized/4%20-%20Deluxe/P1942621.jpg',
                '/images/Kismet_Room_Photos/Optimized/4%20-%20Deluxe/P1942659.jpg',
                '/images/Kismet_Room_Photos/Optimized/4%20-%20Deluxe/P1942690.jpg',
                '/images/Kismet_Room_Photos/Optimized/8%20-%20Deluxe/P1953056.jpg',
                '/images/Kismet_Room_Photos/Optimized/8%20-%20Deluxe/P1953079.jpg',
                '/images/Kismet_Room_Photos/Optimized/8%20-%20Deluxe/P1953120.jpg',
                '/images/Kismet_Room_Photos/Optimized/8%20-%20Deluxe/P1953962.jpg',
            ],
        },
        layout: 'image-right',
    },
    {
        slug: 'standard',
        title: 'Standard',
        subtitle: 'Quiet comfort in the heart of Iraklio',
        description:
            'Thoughtfully designed for travellers who want to be in the middle of everything. Calm, accessible, and complete — with everything you need for a restful stay between exploring Crete’s capital.',
        guestyUrl:
            'https://kismeturbanboutique.hotelyzer.gr/en/properties/69faf0b284a25c001c8e20a4',
        images: {
            // Pulled from room 5 (the only folder flagged "Standard").
            main: '/images/Kismet_Room_Photos/Optimized/5%20-%20Standard/P1942696.jpg',
            secondary: [
                '/images/Kismet_Room_Photos/Optimized/5%20-%20Standard/P1942718.jpg',
                '/images/Kismet_Room_Photos/Optimized/5%20-%20Standard/P1953870.jpg',
                '/images/Kismet_Room_Photos/Optimized/5%20-%20Standard/P1942741.jpg',
            ],
            extras: [
                '/images/Kismet_Room_Photos/Optimized/5%20-%20Standard/P1942724.jpg',
                '/images/Kismet_Room_Photos/Optimized/5%20-%20Standard/P1942743.jpg',
                '/images/Kismet_Room_Photos/Optimized/5%20-%20Standard/P1942749.jpg',
                '/images/Kismet_Room_Photos/Optimized/5%20-%20Standard/P1942767.jpg',
                '/images/Kismet_Room_Photos/Optimized/5%20-%20Standard/P1942776.jpg',
                '/images/Kismet_Room_Photos/Optimized/5%20-%20Standard/P1953873.jpg',
                '/images/Kismet_Room_Photos/Optimized/5%20-%20Standard/P1953876.jpg',
                '/images/Kismet_Room_Photos/Optimized/5%20-%20Standard/P1953881.jpg',
                '/images/Kismet_Room_Photos/Optimized/5%20-%20Standard/P1953877.jpg',
                '/images/Kismet_Room_Photos/Optimized/5%20-%20Standard/P1953879.jpg',
            ],
        },
        layout: 'image-left',
    },
];

export const GUESTY_LOCATION_CATEGORIES: LocationCategory[] = [
    { id: 'attractions', label: 'Attractions', icon: 'Star', color: '#C9A961' },
    { id: 'museums', label: 'Museums', icon: 'BookOpen', color: '#7C3AED' },
    { id: 'restaurants', label: 'Restaurants', icon: 'Utensils', color: '#EF4444' },
    { id: 'cafes', label: 'Cafés', icon: 'Coffee', color: '#92400E' },
    { id: 'transport', label: 'Transport', icon: 'Bus', color: '#6B7280' },
    { id: 'banks', label: 'Banks', icon: 'CreditCard', color: '#3B82F6' },
    { id: 'markets', label: 'Markets', icon: 'ShoppingCart', color: '#A855F7' },
];

// Verified coordinates around the hotel (35.336944, 25.130250).
export const GUESTY_CONVENIENCES: Convenience[] = [
    {
        id: 'saint-minas',
        name: 'Saint Minas Church',
        description: 'The 19th-century cathedral of Heraklion, dedicated to the city’s patron saint.',
        lat: 35.337535,
        lng: 25.130160,
        categoryId: 'attractions',
        type: 'Church / Landmark',
        distanceLabel: '~1 min walk',
    },
    {
        id: 'thirathen-musical-instruments',
        name: 'Museum of Musical Instruments "Thirathen"',
        description: 'Small museum of traditional Cretan and Greek musical instruments.',
        // Real location is essentially on top of the hotel (35.337020, 25.130191);
        // nudged east for map readability so the pin doesn't sit underneath Kismet's marker.
        lat: 35.337020,
        lng: 25.131000,
        categoryId: 'museums',
        type: 'Museum',
        distanceLabel: '~1 min walk',
    },
    {
        id: 'heraklion-archaeological-museum',
        name: 'Heraklion Archaeological Museum',
        description: 'One of the world’s great museums; home to the bull-leaping fresco and the Phaistos Disc.',
        lat: 35.339137,
        lng: 25.137102,
        categoryId: 'museums',
        type: 'Museum',
        distanceLabel: '~8 min walk',
    },
    {
        id: 'chalali',
        name: 'Chalali',
        description: 'Neighbourhood restaurant just around the corner from the hotel.',
        lat: 35.336987,
        lng: 25.130395,
        categoryId: 'restaurants',
        type: 'Restaurant',
        distanceLabel: '~1 min walk',
    },
    {
        id: 'apiri-greek-eatery',
        name: 'Apiri Greek Eatery',
        description: 'Modern Greek eatery in central Heraklion.',
        lat: 35.338677,
        lng: 25.131160,
        categoryId: 'restaurants',
        type: 'Restaurant',
        distanceLabel: '~3 min walk',
    },
    {
        id: 'peskesi',
        name: 'Peskesi',
        description: 'Authentic Cretan cuisine in a restored historic building.',
        lat: 35.340461,
        lng: 25.132652,
        categoryId: 'restaurants',
        type: 'Restaurant',
        distanceLabel: '~6 min walk',
    },
    {
        id: 'the-fifty',
        name: 'The Fifty',
        description: 'Bistro-style restaurant in the old town.',
        lat: 35.338863,
        lng: 25.132496,
        categoryId: 'restaurants',
        type: 'Restaurant',
        distanceLabel: '~4 min walk',
    },
    {
        id: 'ktel-heraklion-lassithi',
        name: 'KTEL Heraklion–Lassithi',
        description: 'Intercity bus terminal for eastern Crete routes (Agios Nikolaos, Sitia, Lassithi plateau).',
        lat: 35.339222,
        lng: 25.141033,
        categoryId: 'transport',
        type: 'Bus terminal',
        distanceLabel: '~13 min walk',
    },
    {
        id: 'heraklion-port',
        name: 'Heraklion Port',
        description: 'Ferries to Athens (Piraeus), Santorini, Mykonos and the Cyclades.',
        lat: 35.344105,
        lng: 25.151065,
        categoryId: 'transport',
        type: 'Port',
        distanceLabel: '~25 min walk',
    },
    // Banks
    {
        id: 'eurobank-daedalou',
        name: 'Eurobank — Daedalou Branch',
        description: 'Branch and ATM in central Heraklion.',
        lat: 35.3392,
        lng: 25.1330,
        categoryId: 'banks',
        type: 'Bank / ATM',
        distanceLabel: '~5 min walk',
    },
    {
        id: 'national-bank-eleftherias',
        name: 'National Bank of Greece — Eleftherias Sq.',
        description: 'Branch and ATM at Plateia Eleftherias.',
        lat: 35.3411,
        lng: 25.1369,
        categoryId: 'banks',
        type: 'Bank / ATM',
        distanceLabel: '~10 min walk',
    },
    {
        id: 'alpha-bank-daedalou',
        name: 'Alpha Bank — Daedalou',
        description: 'Branch and ATM in the central pedestrian zone.',
        lat: 35.3386,
        lng: 25.1338,
        categoryId: 'banks',
        type: 'Bank / ATM',
        distanceLabel: '~5 min walk',
    },
    // Cafés
    {
        id: 'kirkor',
        name: 'Kirkor',
        description: 'Famous for bougatsa and traditional Cretan coffee, on Lions Square.',
        lat: 35.3389,
        lng: 25.1346,
        categoryId: 'cafes',
        type: 'Café',
        rating: 4.5,
        distanceLabel: '~6 min walk',
    },
    {
        id: 'crop-coffee',
        name: 'Crop Coffee Roasters',
        description: 'Specialty coffee bar with single-origin beans.',
        lat: 35.3380,
        lng: 25.1331,
        categoryId: 'cafes',
        type: 'Café',
        rating: 4.6,
        distanceLabel: '~4 min walk',
    },
    {
        id: 'floral-bistrot',
        name: 'Floral Café Bistrot',
        description: 'Lively café-bistro for brunch, lunch and evening cocktails.',
        lat: 35.3383,
        lng: 25.1342,
        categoryId: 'cafes',
        type: 'Café',
        rating: 4.5,
        distanceLabel: '~5 min walk',
    },
    // Markets
    {
        id: 'lions-square',
        name: 'Lions Square (Pl. Eleftheriou Venizelou)',
        description: 'The historic heart of Heraklion, lined with cafés and shops.',
        lat: 35.3389,
        lng: 25.1349,
        categoryId: 'markets',
        type: 'Public square',
        distanceLabel: '~6 min walk',
    },
    {
        id: 'public-market-1866',
        name: 'Heraklion Public Market (1866 St.)',
        description: 'Open-air market street with fresh produce, herbs, and Cretan goods.',
        lat: 35.3389,
        lng: 25.1335,
        categoryId: 'markets',
        type: 'Market street',
        distanceLabel: '~5 min walk',
    },
];

export const GUESTY_ATTRACTIONS: Attraction[] = [
    {
        id: 0,
        name: 'Museum of Musical Instruments "Thirathen"',
        description:
            "A small, lovingly curated museum just steps from the hotel — traditional Cretan and Greek instruments, with regular live demonstrations.",
        image: '/images/Attractions/Thirathen/kainourio3.jpg',
        distance: '10 m',
        gallery: [
            '/images/Attractions/Thirathen/kainourio3.jpg',
            '/images/Attractions/Thirathen/piano%20kazantzaki.jpg',
            '/images/Attractions/Thirathen/DSCF7528.jpg',
            '/images/Attractions/Thirathen/DSCF7529.jpg',
            '/images/Attractions/Thirathen/11-_DSC9033.jpg',
            '/images/Attractions/Thirathen/13-_DSC9025.jpg',
            '/images/Attractions/Thirathen/15-_DSC9010.jpg',
            '/images/Attractions/Thirathen/17-_DSC8967.jpg',
            '/images/Attractions/Thirathen/18-_DSC8950.jpg',
            '/images/Attractions/Thirathen/20-_DSC8933.jpg',
        ],
    },
    {
        id: 1,
        name: 'Knossos Palace',
        description:
            "Europe's oldest city — explore the labyrinthine ruins of the Minoan civilisation.",
        image: '/images/Attractions/Knossos/jametlene-reskp-Nre--Rexegs-unsplash.jpg',
        distance: '5 km',
        gallery: [
            '/images/Attractions/Knossos/jametlene-reskp-Nre--Rexegs-unsplash.jpg',
            '/images/Attractions/Knossos/andy-goldsby-ZxCHqEuvvhg-unsplash.jpg',
            '/images/Attractions/Knossos/bigfoot-ruins-111492.jpg',
            '/images/Attractions/Knossos/davestem-knossos-165561.jpg',
            '/images/Attractions/Knossos/egor-myznik-EZBfg-MjfQ0-unsplash.jpg',
            '/images/Attractions/Knossos/jacek-urbanski-6-W_t8Zc8zo-unsplash.jpg',
            '/images/Attractions/Knossos/martijn-vonk-D08XwX5u-d0-unsplash.jpg',
            '/images/Attractions/Knossos/martijn-vonk-su5rTuLlQG0-unsplash.jpg',
            '/images/Attractions/Knossos/martijn-vonk-ub3QsXzVR_0-unsplash.jpg',
        ],
    },
    {
        id: 2,
        name: 'Heraklion Archaeological Museum',
        description:
            "One of the world's great museums; home to the bull-leaping fresco and the Phaistos Disc.",
        image: '/images/Attractions/Heraklion%20Archaeological%20Museum/%CE%91%CE%9C%CE%97-1024x607.jpg',
        distance: '0.5 km',
        gallery: [
            '/images/Attractions/Heraklion%20Archaeological%20Museum/%CE%91%CE%9C%CE%97-1024x607.jpg',
        ],
    },
    {
        id: 3,
        name: 'Koules Fortress',
        description:
            "The 16th-century Venetian sea fortress guarding Heraklion's old harbour.",
        image: '/images/Attractions/Koules%20Fortress/printsi-crete-6507213_1920.jpg',
        distance: '0.7 km',
        gallery: [
            '/images/Attractions/Koules%20Fortress/printsi-crete-6507213_1920.jpg',
        ],
    },
    {
        id: 4,
        name: 'Spinalonga Island',
        description:
            "The fortified island leper colony immortalised by Victoria Hislop's The Island.",
        image: '/images/Attractions/Spinaloga/herbert2512-crete-1676057.jpg',
        distance: '70 km',
        gallery: [
            '/images/Attractions/Spinaloga/herbert2512-crete-1676057.jpg',
            '/images/Attractions/Spinaloga/evangelos-mpikakis-MSqxB-SX5VQ-unsplash.jpg',
            '/images/Attractions/Spinaloga/joshua-kettle-6duUhb9WwQ8-unsplash.jpg',
        ],
    },
    {
        id: 5,
        name: 'Samaria Gorge',
        description:
            "A 16-km hike through Europe's longest gorge, ending on a remote Libyan-sea beach.",
        image: '/images/Attractions/Samaria/eloneo-the-samaria-gorge-3852381.jpg',
        distance: '150 km',
        gallery: [
            '/images/Attractions/Samaria/eloneo-the-samaria-gorge-3852381.jpg',
            '/images/Attractions/Samaria/alain95440-crete-2772296_1920.jpg',
            '/images/Attractions/Samaria/gunel-o7REjmP52rA-unsplash.jpg',
            '/images/Attractions/Samaria/tadeusz-zachwieja-2Plavx_5YBQ-unsplash.jpg',
            '/images/Attractions/Samaria/tinabierhoff-crete-1137843_1920.jpg',
        ],
    },
    {
        id: 6,
        name: 'Elafonisi Beach',
        description:
            "Pink sand and shallow turquoise lagoons on Crete's south-west tip.",
        image: '/images/Attractions/Elafonisi/jarekgrafik-greece-997651.jpg',
        distance: '210 km',
        gallery: [
            '/images/Attractions/Elafonisi/jarekgrafik-greece-997651.jpg',
            '/images/Attractions/Elafonisi/jarekgrafik-greece-997621_1920.jpg',
            '/images/Attractions/Elafonisi/reiseuhu-cOEnr81WHgo-unsplash.jpg',
        ],
    },
];

export const GUESTY_FAQS: FAQ[] = [
    {
        id: 1,
        category: 'general',
        question: 'What time is check-in and check-out?',
        answer:
            'Check-in is from 15:00. Check-out is by 11:00. Earlier check-in or later check-out can be arranged subject to availability — just message us before arrival.',
    },
    {
        id: 2,
        category: 'general',
        question: 'Is parking available?',
        answer:
            "Public paid parking is available within a short walk; we'll send you a map and instructions before arrival.",
    },
    {
        id: 3,
        category: 'general',
        question: 'Is the property accessible?',
        answer:
            'Yes — all rooms feature step-free access and accessible bathrooms. If you have specific accessibility needs, please contact us so we can prepare your stay.',
    },
    {
        id: 4,
        category: 'general',
        question: 'Is breakfast included?',
        answer:
            "Breakfast is not included with the room. We'll happily recommend nearby cafés and bakeries — there are excellent options on every corner.",
    },
    {
        id: 5,
        category: 'general',
        question: "What's your cancellation policy?",
        answer:
            'Cancellation terms depend on the rate you book. Full conditions are shown on the booking page before you confirm.',
    },
    {
        id: 6,
        category: 'general',
        question: 'How do I get to the property from the airport?',
        answer:
            'Heraklion International Airport (HER) is ~10 minutes by taxi. Public bus (Line 1) also runs from the airport to the city centre. Detailed directions are sent with your booking confirmation.',
    },
];

// Off-site contact page hosted by Guesty / Hotelyzer.
// Used by the footer CTA in place of the internal contact form.
export const GUESTY_CONTACT_URL = 'https://kismeturbanboutique.hotelyzer.gr/en/contact';

// Embed snippet provided by Guesty / Hotelyzer (kept verbatim for fidelity).
// Mounted client-side via next/script in HomeGuesty.
// `color` drives Guesty's `--guesty-brand-primary` (button + active-state accent).
export const GUESTY_WIDGET = {
    containerId: 'search-widget_IO312PWQ',
    cssUrl: 'https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.css',
    jsUrl: 'https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.js',
    siteUrl: 'kismeturbanboutique.hotelyzer.gr',
    color: '#2C5F8D', // matches --color-deep-med (the primary Button background)
};
