export function calculateTotal(pricePerNight: number, nights: number): number {
    return pricePerNight * nights;
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(amount);
}
