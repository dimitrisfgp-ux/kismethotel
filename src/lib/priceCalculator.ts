export function calculateTotal(pricePerNight: number, nights: number): number {
    return pricePerNight * nights;
}

export function calculateBookingTotal(start: Date | string, end: Date | string, pricePerNight: number): number {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return nights > 0 ? nights * pricePerNight : 0;
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(amount);
}
