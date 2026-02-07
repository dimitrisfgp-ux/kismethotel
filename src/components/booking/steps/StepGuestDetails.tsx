"use client";

import { Input } from "@/components/ui/Input";

export interface GuestData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface StepGuestDetailsProps {
    data: GuestData;
    onChange: (data: GuestData) => void;
}

export function StepGuestDetails({ data, onChange }: StepGuestDetailsProps) {
    const handleChange = (field: keyof GuestData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-60">First Name</label>
                    <Input
                        placeholder="First Name"
                        value={data.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Last Name</label>
                    <Input
                        placeholder="Last Name"
                        value={data.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Email Address</label>
                <Input
                    type="email"
                    placeholder="email@example.com"
                    value={data.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                />
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Phone Number (Optional)</label>
                <Input
                    type="tel"
                    placeholder="+1..."
                    value={data.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                />
            </div>
        </div>
    );
}
