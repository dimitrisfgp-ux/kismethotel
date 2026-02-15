"use client";

import { createContext, useContext, ReactNode } from "react";

interface PermissionContextType {
    permissions: string[];
    role: string;
    can: (permission: string) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({
    children,
    permissions,
    role
}: {
    children: ReactNode;
    permissions: string[];
    role: string;
}) {
    const can = (permission: string) => {
        if (role === 'admin') return true; // Admin Superuser for UI convenience
        return permissions.includes(permission);
    };

    return (
        <PermissionContext.Provider value={{ permissions, role, can }}>
            {children}
        </PermissionContext.Provider>
    );
}

export function usePermission() {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error("usePermission must be used within a PermissionProvider");
    }
    return context;
}

export function Can({ permission, children }: { permission: string; children: ReactNode }) {
    const { can } = usePermission();
    return can(permission) ? <>{children}</> : null;
}
