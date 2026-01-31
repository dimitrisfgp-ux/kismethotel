import { Room } from "@/types";
import { AmenityIcon } from "./AmenityIcon";
import { BedDouble, Utensils, Armchair, Bath, LayoutGrid, Users, Maximize, Layers } from "lucide-react";

const getCategoryIcon = (type: string) => {
    switch (type) {
        case 'bedroom': return <BedDouble className="h-5 w-5 text-[var(--color-aegean-blue)]" />;
        case 'kitchen': return <Utensils className="h-5 w-5 text-[var(--color-aegean-blue)]" />;
        case 'living_room': return <Armchair className="h-5 w-5 text-[var(--color-aegean-blue)]" />;
        case 'bathroom': return <Bath className="h-5 w-5 text-[var(--color-aegean-blue)]" />;
        default: return <LayoutGrid className="h-5 w-5 text-[var(--color-aegean-blue)]" />;
    }
};

export function RoomInfo({ room }: { room: Room }) {
    return (
        <div className="space-y-16">
            {/* Header */}
            <div>
                <h1 className="font-montserrat text-4xl font-bold uppercase tracking-widest text-[var(--color-charcoal)] mb-4">{room.name}</h1>
                <p className="font-inter text-lg opacity-80 leading-relaxed">{room.description}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-[var(--color-sand)]">
                <div>
                    <div className="flex items-center gap-2 mb-1 opacity-50 text-[var(--color-charcoal)]">
                        <Users className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-widest">Max Occupancy</span>
                    </div>
                    <span className="font-inter text-lg font-medium">{room.maxOccupancy} Guests</span>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1 opacity-50 text-[var(--color-charcoal)]">
                        <Maximize className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-widest">Size</span>
                    </div>
                    <span className="font-inter text-lg font-medium">{room.sizeSqm} m²</span>
                </div>
                <div>
                    {/* Bed Types derived from Layout */}
                    <div className="flex items-center gap-2 mb-1 opacity-50 text-[var(--color-charcoal)]">
                        <BedDouble className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-widest">Beds</span>
                    </div>
                    <span className="font-inter text-lg font-medium capitalize">
                        {room.beds?.map(b => `${b.count} ${b.type}`).join(", ") || "Double"}
                    </span>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1 opacity-50 text-[var(--color-charcoal)]">
                        <Layers className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-widest">Floor</span>
                    </div>
                    <span className="font-inter text-lg font-medium">{room.floor === 0 ? "Ground" : `${room.floor}th`}</span>
                </div>
            </div>

            {/* Room Layout & Amenities Section */}
            <div className="space-y-12">
                <h3 className="font-montserrat text-xl font-bold uppercase tracking-widest border-b border-[var(--color-sand)] pb-4">Room Layout</h3>

                <div className="grid grid-cols-1 gap-12">
                    {room.layout.map((category, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-card border border-[var(--color-sand)]/30 shadow-sm transition-all duration-300 hover:shadow-md">

                            {/* Category Header */}
                            <div className="flex items-center justify-between border-b border-[var(--color-sand)]/30 pb-5 mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-[var(--color-warm-white)] rounded-full border border-[var(--color-sand)]/30">
                                        {getCategoryIcon(category.type)}
                                    </div>
                                    <h4 className="font-montserrat text-lg font-bold text-[var(--color-deep-med)] uppercase tracking-wide">
                                        {category.title}
                                    </h4>
                                </div>
                                <span className="text-xs font-inter uppercase tracking-widest opacity-50 bg-[var(--color-sand)]/30 px-3 py-1.5 rounded-full">
                                    {category.type.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Details */}
                                <div>
                                    <span className="block text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Features</span>
                                    <ul className="space-y-2">
                                        {category.details.map((detail, dIdx) => (
                                            <li key={dIdx} className="text-sm font-inter opacity-80 flex items-center gap-2">
                                                • {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Amenities */}
                                {category.amenities.length > 0 && (
                                    <div>
                                        <span className="block text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Amenities</span>
                                        <div className="grid grid-cols-1 gap-3">
                                            {category.amenities.map(amenity => (
                                                <div key={amenity.id} className="flex items-center space-x-3 text-[var(--color-charcoal)] opacity-80 bg-white p-2 rounded border border-[var(--color-sand)]/30">
                                                    <AmenityIcon iconName={amenity.iconName} className="h-4 w-4 text-[var(--color-aegean-blue)]" />
                                                    <span className="font-inter text-sm">{amenity.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Highlights Section */}
            <div>
                <h3 className="font-montserrat text-xl font-bold uppercase tracking-widest mb-8 text-[var(--color-aegean-blue)]">Highlights</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {room.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-accent-gold)] flex-shrink-0" />
                            <span className="font-inter text-[var(--color-charcoal)]">{highlight}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
