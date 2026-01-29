"use client";

import { Input } from "../ui/Input";
import { CreditCard, ShieldCheck } from "lucide-react";

export function PaymentMock() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center space-x-2 text-[var(--color-success)] mb-4">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Secure SSL Connection</span>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Cardholder Name</label>
                    <Input placeholder="JOHN DOE" />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Card Number</label>
                    <div className="relative">
                        <Input placeholder="0000 0000 0000 0000" />
                        <CreditCard className="absolute right-3 top-3 h-5 w-5 text-[var(--color-charcoal)] opacity-30" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Expiry</label>
                        <Input placeholder="MM/YY" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-60">CVC</label>
                        <Input placeholder="123" />
                    </div>
                </div>
            </div>

            <div className="p-4 bg-[var(--color-warm-white)] rounded-[var(--radius-subtle)] border border-[var(--color-sand)] text-xs opacity-70">
                <p>This is a prototype. No actual charge will be made, but you can click confirm to simulate a booking.</p>
            </div>
        </div>
    );
}
