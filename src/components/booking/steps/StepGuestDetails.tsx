"use client";

import { Input } from "@/components/ui/Input";

export function StepGuestDetails() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-60">First Name</label>
                    <Input placeholder="First Name" />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Last Name</label>
                    <Input placeholder="Last Name" />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Email Address</label>
                <Input type="email" placeholder="email@example.com" />
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Phone Number (Optional)</label>
                <Input type="tel" placeholder="+1..." />
            </div>
        </div>
    );
}
