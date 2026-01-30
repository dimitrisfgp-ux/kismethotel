import { Room } from "@/types";
import { AMENITIES } from "./amenities";

// Helper to find amenity by ID
const getAmenity = (id: number) => {
    const a = AMENITIES.find(a => a.id === id);
    if (!a) throw new Error(`Amenity ${id} not found`);
    return a;
};

export const ROOMS: Room[] = [
    {
        id: "1", slug: "aegean-suite", name: "Aegean Suite", description: "Our signature suite, flooded with natural light from dual-aspect windows. The open-plan design connects a plush sleeping area with a private balcony overlooking the cretan seascape.",
        sizeSqm: 85, floor: 2, maxOccupancy: 4, pricePerNight: 350,
        images: [
            "/images/Room Imagery/Room 1/hero-room1.jpeg",
            "/images/Room Imagery/Room 1/angle1-room1.jpeg",
            "/images/Room Imagery/Room 1/angle2-room1.jpeg"
        ],
        beds: [{ type: 'double', count: 1 }, { type: 'double', count: 1 }], // King + Sofa Bed inferred from Max 4
        layout: [
            {
                type: 'bedroom',
                title: "Master Bedroom",
                details: ["King Size Bed", "Panoramic Ocean View", "Floor-to-Ceiling Windows"],
                amenities: [getAmenity(1), getAmenity(3), getAmenity(9)]
            },
            {
                type: 'living_room',
                title: "Lounge Area",
                details: ["L-Shaped Sofa", "Marble Coffee Table", "Direct Balcony Access"],
                amenities: [getAmenity(2), getAmenity(3)]
            },
            {
                type: 'bathroom',
                title: "En-suite",
                details: ["Double Vanity", "Walk-in Rain Shower"],
                amenities: [getAmenity(7)]
            }
        ],
        highlights: ["Wrap-around Balcony", "Corner Suite Privacy", "Sun-drenched Interiors", "Signature Welcome Amenity"]
    },
    {
        id: "2", slug: "knossos", name: "Knossos", description: "A tribute to heritage, this room features textured stone walls and warm timber accents. The layout creates a cozy yet sophisticated retreat suitable for introspection and relaxation.",
        sizeSqm: 60, floor: 1, maxOccupancy: 3, pricePerNight: 220,
        images: [
            "/images/Room Imagery/Room 2/hero-room2.jpeg",
            "/images/Room Imagery/Room 2/angle1-room2.jpeg",
            "/images/Room Imagery/Room 2/angle2-room2.jpeg"
        ],
        beds: [{ type: 'double', count: 1 }, { type: 'single', count: 1 }], // Queen + Daybed/Rollaway inferred from Max 3
        layout: [
            {
                type: 'bedroom',
                title: "Sleeping Quarters",
                details: ["Queen Size Bed", "Hand-carved Headboard", "Feature Stone Wall"],
                amenities: [getAmenity(1), getAmenity(3), getAmenity(9)]
            },
            {
                type: 'living_room',
                title: "Reading Corner",
                details: ["Velvet Armchair", "Brass Reading Lamp"],
                amenities: [getAmenity(2)]
            },
            {
                type: 'bathroom',
                title: "Stone Bathroom",
                details: ["Local Slate Finishes", "Rain Shower"],
                amenities: [getAmenity(7)]
            }
        ],
        highlights: ["Textured Stone Walls", "Warm Ambient Lighting", "Heritage Inspired Decor"]
    },
    {
        id: "3", slug: "meltemi", name: "Meltemi", description: "Designed for the modern traveler, Meltemi offers a crisp, minimalist aesthetic. White-washed walls and clean lines maximize the sense of space and airiness.",
        sizeSqm: 45, floor: 1, maxOccupancy: 2, pricePerNight: 150,
        images: [
            "/images/Room Imagery/Room 3/hero-room3.jpeg",
            "/images/Room Imagery/Room 3/angle1-room3.jpeg",
            "/images/Room Imagery/Room 3/angle2-room3.jpeg"
        ],
        beds: [{ type: 'double', count: 1 }],
        layout: [
            {
                type: 'bedroom',
                title: "Studio",
                details: ["Double Bed", "Built-in Wardrobe", "Minimalist Desk"],
                amenities: [getAmenity(1), getAmenity(3), getAmenity(9)]
            },
            {
                type: 'kitchen',
                title: "Kitchenette",
                details: ["Compact Design", "Hidden Appliances"],
                amenities: [getAmenity(4), getAmenity(8)]
            },
            {
                type: 'bathroom',
                title: "Shower Room",
                details: ["Glass Partition", "Modern Fixtures"],
                amenities: [getAmenity(7)]
            }
        ],
        highlights: ["Efficient Studio Layout", "Crisp White Decor", "Work-friendly Space"]
    },
    {
        id: "4", slug: "olive-grove", name: "Olive Grove", description: "A grounded sanctuary on the garden level. Earthy tones and natural wood textures connect you directly to the hotel's lush exterior spaces.",
        sizeSqm: 50, floor: 0, maxOccupancy: 2, pricePerNight: 160,
        images: [
            "/images/Room Imagery/Room 4/hero-room4.jpeg",
            "/images/Room Imagery/Room 4/angle1-room4.jpeg",
            "/images/Room Imagery/Room 4/angle2-room4.jpeg"
        ],
        beds: [{ type: 'double', count: 1 }],
        layout: [
            {
                type: 'bedroom',
                title: "Garden Bedroom",
                details: ["Double Bed", "Oak Furniture", "Patio Doors"],
                amenities: [getAmenity(1), getAmenity(3), getAmenity(9)]
            },
            {
                type: 'kitchen',
                title: "Dining Nook",
                details: ["Round Table", "Casual Seating"],
                amenities: [getAmenity(4)]
            },
            {
                type: 'bathroom',
                title: "En-suite",
                details: ["Nature-inspired Tiles"],
                amenities: [getAmenity(7)]
            }
        ],
        highlights: ["Direct Garden Access", "Private Patio", "Earth Tone Palette"]
    },
    {
        id: "5", slug: "horizon", name: "Horizon", description: "Perched high for the best vantage point, Horizon is defined by its connection to the sky. Blue accents and airy fabrics mirror the view outside.",
        sizeSqm: 70, floor: 2, maxOccupancy: 3, pricePerNight: 280,
        images: [
            "/images/Room Imagery/Room 5/hero-room 5.jpeg",
            "/images/Room Imagery/Room 5/angle1-room5.jpeg",
            "/images/Room Imagery/Room 5/angle2-room5.jpeg"
        ],
        beds: [{ type: 'double', count: 1 }, { type: 'single', count: 1 }],
        layout: [
            {
                type: 'bedroom',
                title: "Master Suite",
                details: ["King Bed", "Sea Facing", "Sheer Drapes"],
                amenities: [getAmenity(1), getAmenity(3), getAmenity(5), getAmenity(9)]
            },
            {
                type: 'bedroom',
                title: "Alcove",
                details: ["Single Bed", "Quiet Rear View"],
                amenities: [getAmenity(1)]
            },
            {
                type: 'living_room',
                title: "Observation Deck (Balcony)",
                details: ["Sunset Views", "Outdoor Seating"],
                amenities: [getAmenity(6)]
            }
        ],
        highlights: ["Uninterrupted Sea Views", "Top Floor Quietness", "Breezy Atmosphere"]
    },
    {
        id: "6", slug: "selene", name: "Selene", description: "Named after the moon, this interior room focuses on quiet luxury. Soft grey tones and sound-absorbing textiles create a cocoon of silence.",
        sizeSqm: 40, floor: 0, maxOccupancy: 2, pricePerNight: 130,
        images: [
            "/images/Room Imagery/Room 6/hero-room6.jpeg",
            "/images/Room Imagery/Room 6/angle1-room6.jpeg",
            "/images/Room Imagery/Room 6/angle2-room6.jpeg"
        ],
        beds: [{ type: 'double', count: 1 }],
        layout: [
            {
                type: 'bedroom',
                title: "Bedroom",
                details: ["Queen Bed", "Blackout Curtains", "Plush Carpet Area"],
                amenities: [getAmenity(1), getAmenity(9)]
            },
            {
                type: 'bathroom',
                title: "Spa Bath",
                details: ["Oversized Shower Head", "Dimmer Lighting"],
                amenities: [getAmenity(7)]
            }
        ],
        highlights: ["Ultimate Quiet", "Sleep-Centric Design", "Cool & Shaded"]
    },
    {
        id: "7", slug: "zephyr", name: "Zephyr", description: "Characterized by unique architectural arches and soft curves. This room breaks the mold of rectangular living with a fluid, organic layout.",
        sizeSqm: 55, floor: 1, maxOccupancy: 2, pricePerNight: 190,
        images: [
            "/images/Room Imagery/Room 7/hero-room7.jpeg",
            "/images/Room Imagery/Room 7/angle1-room7.jpeg",
            "/images/Room Imagery/Room 7/angle2-room7.jpeg"
        ],
        beds: [{ type: 'double', count: 1 }],
        layout: [
            {
                type: 'bedroom',
                title: "Arched Bedroom",
                details: ["King Bed", "Curved Ceiling Details", "Romantic Lighting"],
                amenities: [getAmenity(1), getAmenity(3), getAmenity(9)]
            },
            {
                type: 'kitchen',
                title: "Breakfast Bar",
                details: ["Marble Top", "High Stools"],
                amenities: [getAmenity(4)]
            }
        ],
        highlights: ["Unique Arched Architecture", "Organic Flow", "Romantic Ambiance"]
    },
    {
        id: "8", slug: "iris", name: "Iris", description: "Vibrant and centrally located, Iris brings the energy of the city inside. Large windows offer views of the bustling street life below, framed by soundproof glass.",
        sizeSqm: 65, floor: 1, maxOccupancy: 4, pricePerNight: 240,
        images: [
            "/images/Room Imagery/Room 8/hero-room8.jpeg",
            "/images/Room Imagery/Room 8/angle1-room8.jpeg",
            "/images/Room Imagery/Room 8/angle2-room8.jpeg"
        ],
        beds: [{ type: 'double', count: 2 }], // 1 Bed + 1 Convertible Sofa
        layout: [
            {
                type: 'bedroom',
                title: "Main Bedroom",
                details: ["Double Bed", "City View"],
                amenities: [getAmenity(1), getAmenity(3), getAmenity(9)]
            },
            {
                type: 'living_room',
                title: "Living Area",
                details: ["Convertible Double Sofa", "Large TV Wall"],
                amenities: [getAmenity(2), getAmenity(3)]
            },
            {
                type: 'bathroom',
                title: "Classic Bathroom",
                details: ["Bathtub with Shower"],
                amenities: []
            }
        ],
        highlights: ["Urban Views", "Spacious Living Room", "Ideal for Families"]
    },
    {
        id: "9", slug: "poseidon", name: "Poseidon", description: "A true residence on the third floor. Poseidon features a distinct separation between the grand living space and the private quarters, perfect for entertaining or extended stays.",
        sizeSqm: 90, floor: 2, maxOccupancy: 5, pricePerNight: 400,
        images: [
            "/images/Room Imagery/3rd Floor-SuiteB/livingroom-angle1.jpeg",
            "/images/Room Imagery/3rd Floor-SuiteB/livingroom-angle2.jpeg",
            "/images/Room Imagery/3rd Floor-SuiteB/livingroom-angle3.jpeg",
            "/images/Room Imagery/3rd Floor-SuiteB/bedroom.jpeg"
        ],
        beds: [{ type: 'double', count: 2 }], // King + Queen
        layout: [
            {
                type: 'living_room',
                title: "Grand Living Room",
                details: ["Seating for 6", "Formal Dining Area", "Hardwood Floors"],
                amenities: [getAmenity(2), getAmenity(3)]
            },
            {
                type: 'bedroom',
                title: "Master Bedroom",
                details: ["King Bed", "Private Balcony Access", "Jacuzzi Tub"],
                amenities: [getAmenity(1), getAmenity(3), getAmenity(5), getAmenity(9)]
            },
            {
                type: 'bedroom',
                title: "Guest Room",
                details: ["Queen Bed", "Dedicated Workspace"],
                amenities: [getAmenity(1), getAmenity(9)]
            },
            {
                type: 'kitchen',
                title: "Full Kitchen",
                details: ["Oven", "Large Fridge", "Dishwasher"],
                amenities: [getAmenity(4), getAmenity(8)]
            }
        ],
        highlights: ["Expansive Entertaining Space", "Separate Living & Sleeping Wings", "Private Jacuzzi"]
    },
    {
        id: "10", slug: "elysium", name: "Elysium", description: "The pinnacle of Kismet. Elysium is a sprawling penthouse suite offering multiple vantage points. From the multi-angle living room to the serene master bedroom, every corner renders a new perspective of luxury.",
        sizeSqm: 110, floor: 3, maxOccupancy: 2, pricePerNight: 500,
        images: [
            "/images/Room Imagery/3rd Floor-SuiteA/livingroom-angle1.jpeg",
            "/images/Room Imagery/3rd Floor-SuiteA/livingroom-angle2.jpeg",
            "/images/Room Imagery/3rd Floor-SuiteA/livingroom-angle3.jpeg",
            "/images/Room Imagery/3rd Floor-SuiteA/bedroom-angle1.jpeg",
            "/images/Room Imagery/3rd Floor-SuiteA/bedroom-angle2.jpeg"
        ],
        beds: [{ type: 'double', count: 1 }],
        layout: [
            {
                type: 'living_room',
                title: "The Salon",
                details: ["Panoramic Windows (3 Sides)", "Designer Sectional Sofa", "Feature Fireplace"],
                amenities: [getAmenity(2), getAmenity(3)]
            },
            {
                type: 'bedroom',
                title: "Penthouse Master",
                details: ["Emperor Bed", "Walk-in Wardrobe", "Direct Terrace Access"],
                amenities: [getAmenity(1), getAmenity(5), getAmenity(9)]
            },
            {
                type: 'kitchen',
                title: "Chef's Kitchen",
                details: ["Island with Seating", "Wine Fridge", "Premium Appliances"],
                amenities: [getAmenity(4), getAmenity(8)]
            },
            {
                type: 'bathroom',
                title: "Spa Sanctuary",
                details: ["Double Vanity", "Steam Shower", "Freestanding Tub"],
                amenities: [getAmenity(7)]
            }
        ],
        highlights: ["360-Degree Views", "Triple-Aspect Living Room", "Exclusive Top Floor Privacy", "Personal Concierge Service"]
    }
];
