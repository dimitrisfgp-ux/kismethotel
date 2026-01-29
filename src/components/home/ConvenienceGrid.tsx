import { Convenience } from "@/types";
import { Coffee, ShoppingCart, Umbrella, Pill, Car } from "lucide-react";
import { Container } from "../ui/Container";

interface ConvenienceGridProps {
    conveniences: Convenience[];
}

export function ConvenienceGrid({ conveniences }: ConvenienceGridProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'Supermarket': return <ShoppingCart className="h-6 w-6" />;
            case 'Bus': return <Car className="h-6 w-6" />;
            case 'Pharmacy': return <Pill className="h-6 w-6" />;
            case 'Beach': return <Umbrella className="h-6 w-6" />;
            default: return <Coffee className="h-6 w-6" />;
        }
    };

    return (
        <section className="bg-[var(--color-warm-white)] py-16">
            <Container>
                <div className="mb-12 text-center">
                    <h2 className="font-montserrat text-2xl md:text-3xl font-bold uppercase tracking-widest text-[var(--color-charcoal)] mb-4">Easy Access to Conveniences</h2>
                    <div className="w-16 h-1 bg-[var(--color-aegean-blue)] mx-auto" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {conveniences.map((item, index) => (
                        <div key={item.id} className="flex flex-col items-center text-center space-y-3 group">
                            <div className="p-4 rounded-full bg-white border border-[var(--color-sand)] text-[var(--color-aegean-blue)] shadow-sm transition-all duration-300 group-hover:shadow-[var(--shadow-hover)] group-hover:scale-110">
                                {getIcon(item.type)}
                            </div>
                            <div>
                                <h4 className="font-montserrat text-sm font-bold uppercase tracking-wider">{item.name}</h4>
                                <p className="font-inter text-xs opacity-60 mt-1">{item.distanceLabel}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
