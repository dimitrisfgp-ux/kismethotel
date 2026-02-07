import { iconMap } from "@/components/ui/icons/iconMap";
import { Star } from "lucide-react";

interface AmenityIconProps {
    iconName: string;
    className?: string;
}

export function AmenityIcon({ iconName, className }: AmenityIconProps) {
    const Icon = iconMap[iconName] || Star;
    return <Icon className={className} />;
}
