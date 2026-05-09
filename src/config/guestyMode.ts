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
    };
    layout: 'image-left' | 'image-right';
}

export const HOTEL_COORDINATES = {
    lat: 35.33693409632511,
    lng: 25.13071886492972,
};

export const GUESTY_HERO = {
    title: 'Urban Accommodation in the Heart of Crete',
    subtitle: 'Built on Comfort & Accessibility',
    ctaText: 'Explore Rooms',
    scrollTargetId: 'category-suite',
};

export const GUESTY_SETTINGS: HotelSettings = {
    name: 'Kismet Urban Boutique',
    description: 'Urban Boutique Rooms',
    holdDurationMinutes: 0,
    logoMode: 'image',
    logoIconUrl: '/images/kismet-logo-icon.svg',
    logoTextUrl: '/images/kismet-logo-text.svg',
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
            main: '/images/rooms/suite/main.jpg',
            secondary: [
                '/images/rooms/suite/01.jpg',
                '/images/rooms/suite/02.jpg',
                '/images/rooms/suite/03.jpg',
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
            main: '/images/rooms/deluxe/main.jpg',
            secondary: [
                '/images/rooms/deluxe/01.jpg',
                '/images/rooms/deluxe/02.jpg',
                '/images/rooms/deluxe/03.jpg',
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
            main: '/images/rooms/standard/main.jpg',
            secondary: [
                '/images/rooms/standard/01.jpg',
                '/images/rooms/standard/02.jpg',
                '/images/rooms/standard/03.jpg',
            ],
        },
        layout: 'image-left',
    },
];

export const GUESTY_LOCATION_CATEGORIES: LocationCategory[] = [
    { id: 'pharmacies', label: 'Pharmacies', icon: 'Pill', color: '#22C55E' },
    { id: 'banks', label: 'Banks', icon: 'CreditCard', color: '#3B82F6' },
    { id: 'restaurants', label: 'Restaurants', icon: 'Utensils', color: '#EF4444' },
    { id: 'cafes', label: 'Cafés', icon: 'Coffee', color: '#92400E' },
    { id: 'transport', label: 'Transport', icon: 'Bus', color: '#6B7280' },
    { id: 'markets', label: 'Markets', icon: 'ShoppingCart', color: '#A855F7' },
];

// Coordinates are approximate placements around the hotel.
// Verify and adjust per real Google Maps positions when finalising.
export const GUESTY_CONVENIENCES: Convenience[] = [
    {
        id: 'ktel-heraklion',
        name: 'KTEL Heraklion Bus Station',
        description: 'Main intercity bus terminal serving all of Crete.',
        lat: 35.3424,
        lng: 25.1364,
        categoryId: 'transport',
        type: 'Bus terminal',
        distanceLabel: '~10 min walk',
    },
    {
        id: 'lions-square',
        name: 'Lions Square (Pl. Eleftheriou Venizelou)',
        description: 'The historic heart of Heraklion, lined with cafés and shops.',
        lat: 35.3389,
        lng: 25.1349,
        categoryId: 'markets',
        type: 'Public square',
        distanceLabel: '~3 min walk',
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
    {
        id: 'pharmacy-daedalou',
        name: 'Pharmacy Daedalou',
        description: 'Central pharmacy on Daedalou pedestrian street.',
        lat: 35.3382,
        lng: 25.1342,
        categoryId: 'pharmacies',
        type: 'Pharmacy',
        distanceLabel: '~4 min walk',
    },
    {
        id: 'eurobank-daedalou',
        name: 'Eurobank — Daedalou Branch',
        description: 'Branch and ATM in central Heraklion.',
        lat: 35.3392,
        lng: 25.1330,
        categoryId: 'banks',
        type: 'Bank / ATM',
        distanceLabel: '~4 min walk',
    },
    {
        id: 'national-bank-eleftherias',
        name: 'National Bank of Greece — Eleftherias Sq.',
        description: 'Branch and ATM at Plateia Eleftherias.',
        lat: 35.3411,
        lng: 25.1369,
        categoryId: 'banks',
        type: 'Bank / ATM',
        distanceLabel: '~6 min walk',
    },
    {
        id: 'peskesi',
        name: 'Peskesi',
        description: 'Authentic Cretan cuisine in a restored historic building.',
        lat: 35.3398,
        lng: 25.1322,
        categoryId: 'restaurants',
        type: 'Restaurant',
        rating: 4.6,
        distanceLabel: '~5 min walk',
    },
    {
        id: 'kirkor',
        name: 'Kirkor',
        description: 'Famous for bougatsa and traditional Cretan coffee, on Lions Square.',
        lat: 35.3389,
        lng: 25.1346,
        categoryId: 'cafes',
        type: 'Café',
        rating: 4.5,
        distanceLabel: '~3 min walk',
    },
];

export const GUESTY_ATTRACTIONS: Attraction[] = [
    {
        id: 1,
        name: 'Knossos Palace',
        description:
            "Europe's oldest city — explore the labyrinthine ruins of the Minoan civilisation.",
        image: '/images/attractions/knossos.jpg',
        distance: '5 km',
    },
    {
        id: 2,
        name: 'Heraklion Archaeological Museum',
        description:
            "One of the world's great museums; home to the bull-leaping fresco and the Phaistos Disc.",
        image: '/images/attractions/archaeological-museum.jpg',
        distance: '0.5 km',
    },
    {
        id: 3,
        name: 'Koules Fortress',
        description:
            "The 16th-century Venetian sea fortress guarding Heraklion's old harbour.",
        image: '/images/attractions/koules.jpg',
        distance: '0.7 km',
    },
    {
        id: 4,
        name: 'Spinalonga Island',
        description:
            "The fortified island leper colony immortalised by Victoria Hislop's The Island.",
        image: '/images/attractions/spinalonga.jpg',
        distance: '70 km',
    },
    {
        id: 5,
        name: 'Samaria Gorge',
        description:
            "A 16-km hike through Europe's longest gorge, ending on a remote Libyan-sea beach.",
        image: '/images/attractions/samaria.jpg',
        distance: '150 km',
    },
    {
        id: 6,
        name: 'Elafonisi Beach',
        description:
            "Pink sand and shallow turquoise lagoons on Crete's south-west tip.",
        image: '/images/attractions/elafonisi.jpg',
        distance: '210 km',
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

// Embed snippet provided by Guesty / Hotelyzer (kept verbatim for fidelity).
// Mounted client-side via next/script in HomeGuesty.
export const GUESTY_WIDGET = {
    containerId: 'search-widget_IO312PWQ',
    cssUrl: 'https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.css',
    jsUrl: 'https://s3.amazonaws.com/guesty-frontend-production/search-bar-production.js',
    siteUrl: 'kismeturbanboutique.hotelyzer.gr',
    color: '#206CFF',
};
