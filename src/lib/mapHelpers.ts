// Bounds for Crete (approximate for prototype)
const BOUNDS = {
    N: 35.7,
    S: 34.8,
    W: 23.5,
    E: 26.4
};

export function getPinPosition(lat: number, lng: number): { left: string; top: string } {
    const x = (lng - BOUNDS.W) / (BOUNDS.E - BOUNDS.W) * 100;
    const y = (BOUNDS.N - lat) / (BOUNDS.N - BOUNDS.S) * 100;

    // Clamp to 0-100% to keep pins inside map visual
    return {
        left: `${Math.max(0, Math.min(100, x))}%`,
        top: `${Math.max(0, Math.min(100, y))}%`
    };
}
