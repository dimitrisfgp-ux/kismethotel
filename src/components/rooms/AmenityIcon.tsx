import { Wind, Wifi, Tv, ChefHat, Waves, Sun, CloudRain, Coffee, BedDouble, Car, Star } from "lucide-react";

interface AmenityIconProps {
    iconName: string;
    className?: string;
}

export function AmenityIcon({ iconName, className }: AmenityIconProps) {
    const icons: Record<string, any> = {
        Wind, Wifi, Tv, ChefHat, Waves, Sun, CloudRain, Coffee, BedDouble, Car
    };

    const Icon = icons[iconName] || Star;

    return <Icon className={className} />;
}
