import { HotelSettings, PageContent } from "@/types";

export const HOTEL_SETTINGS: HotelSettings = {
    name: "Kismet Hotel",
    description: "Boutique Accommodations",
    contact: {
        address: "Agios Nikolaos, Crete, Greece",
        phone: "+30 2810 123 456",
        email: "stay@kismethotel.com"
    },
    socials: {
        whatsapp: "https://wa.me/30123456789",
        viber: "viber://chat?number=%2B30123456789",
        instagram: "#",
        facebook: "#"
    }
};

export const HOME_PAGE_CONTENT: PageContent = {
    hero: {
        title: "Your Destiny Awaits",
        subtitle: "Curated Luxury on the Cretan Coast",
        ctaText: "Explore Collection"
    },
    sections: {
        rooms: {
            title: "The Collection",
            subtitle: "Sanctuaries designed for the modern soul."
        },
        location: {
            title: "The Location",
            subtitle: "Agios Nikolaos: A jewel of the Mirabello Bay."
        },
        attractions: {
            title: "Experience Crete",
            subtitle: "Curated adventures beyond the ordinary."
        },
        faq: {
            title: "Guest Essentials",
            subtitle: "Everything you need to know for a seamless stay."
        }
    }
};
