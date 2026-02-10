-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    module TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Enable RLS (start open for migration, lock down later)
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- 2. Seed Permissions (Idempotent)
DO $$
DECLARE
    p_id UUID;
BEGIN
    -- Bookings
    INSERT INTO public.permissions (slug, description, module) VALUES
    ('bookings.view', 'View the Bookings Dashboard and Details', 'bookings'),
    ('bookings.create', 'Manually create new bookings', 'bookings'),
    ('bookings.edit', 'Update booking dates/details', 'bookings'),
    ('bookings.cancel', 'Cancel existing bookings', 'bookings'),
    ('bookings.delete', 'Permanently remove bookings (Hard Delete)', 'bookings')
    ON CONFLICT (slug) DO NOTHING;

    -- Requests
    INSERT INTO public.permissions (slug, description, module) VALUES
    ('requests.view', 'View Guest Requests', 'requests'),
    ('requests.manage', 'Approve or Discard requests', 'requests')
    ON CONFLICT (slug) DO NOTHING;

    -- Rooms
    INSERT INTO public.permissions (slug, description, module) VALUES
    ('rooms.view', 'View Room List and Details', 'rooms'),
    ('rooms.manage', 'Create, Edit, Delete Rooms', 'rooms'),
    ('rooms.availability', 'Manage blocked dates/availability', 'rooms')
    ON CONFLICT (slug) DO NOTHING;

    -- Content
    INSERT INTO public.permissions (slug, description, module) VALUES
    ('content.view', 'View Page Content & Settings', 'content'),
    ('content.manage', 'Update Hotel Settings, FAQs, Locations, Text', 'content')
    ON CONFLICT (slug) DO NOTHING;

    -- Users
    INSERT INTO public.permissions (slug, description, module) VALUES
    ('users.view', 'View Staff List', 'users'),
    ('users.manage', 'Invite, Delete Staff Members', 'users')
    ON CONFLICT (slug) DO NOTHING;

    -- Roles
    INSERT INTO public.permissions (slug, description, module) VALUES
    ('roles.view', 'View Roles & Permissions', 'roles'),
    ('roles.manage', 'Create, Edit, Delete Custom Roles', 'roles')
    ON CONFLICT (slug) DO NOTHING;
END $$;

-- 3. Seed System Roles & Assignments
DO $$
DECLARE
    r_admin UUID;
    r_manager UUID;
    r_receptionist UUID;
    r_viewer UUID;
BEGIN
    -- Create Roles
    INSERT INTO public.roles (name, description, is_system) 
    VALUES ('admin', 'Full System Access', true)
    ON CONFLICT (name) DO UPDATE SET is_system = true
    RETURNING id INTO r_admin;

    INSERT INTO public.roles (name, description, is_system) 
    VALUES ('manager', 'Manage Operations', true)
    ON CONFLICT (name) DO UPDATE SET is_system = true
    RETURNING id INTO r_manager;

    INSERT INTO public.roles (name, description, is_system) 
    VALUES ('receptionist', 'Front Desk Operations', true)
    ON CONFLICT (name) DO UPDATE SET is_system = true
    RETURNING id INTO r_receptionist;

    INSERT INTO public.roles (name, description, is_system) 
    VALUES ('viewer', 'Read-Only Access', true)
    ON CONFLICT (name) DO UPDATE SET is_system = true
    RETURNING id INTO r_viewer;

    -- Assign Permissions

    -- Admin: ALL
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT r_admin, id FROM public.permissions
    ON CONFLICT DO NOTHING;

    -- Manager: All except users.manage, roles.manage, bookings.delete
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT r_manager, id FROM public.permissions
    WHERE slug NOT IN ('users.manage', 'roles.manage', 'bookings.delete')
    ON CONFLICT DO NOTHING;

    -- Receptionist: Bookings, Requests, Rooms View
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT r_receptionist, id FROM public.permissions
    WHERE slug IN (
        'bookings.view', 'bookings.create', 'bookings.edit', 'bookings.cancel',
        'requests.view', 'requests.manage',
        'rooms.view', 'rooms.availability'
    )
    ON CONFLICT DO NOTHING;

    -- Viewer: Read Only
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT r_viewer, id FROM public.permissions
    WHERE slug IN ('bookings.view', 'rooms.view', 'content.view', 'requests.view')
    ON CONFLICT DO NOTHING;

END $$;

-- 4. Migrate Profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.roles(id);

-- Update existing profiles based on text role
UPDATE public.profiles p
SET role_id = r.id
FROM public.roles r
WHERE p.role = r.name;

-- 5. RLS Policies for New Tables

-- Roles: Admins/Managers can view, Super Admin (has permissions) can manage
CREATE POLICY "Everyone can view roles" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Admins can manage roles" ON public.roles FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.role_permissions rp
        JOIN public.permissions p ON rp.permission_id = p.id
        WHERE rp.role_id = (SELECT role_id FROM public.profiles WHERE id = auth.uid())
        AND p.slug = 'roles.manage'
    )
);

-- Permissions: Public Read (for UI), No Write (System/Seed only)
CREATE POLICY "Everyone can view permissions" ON public.permissions FOR SELECT USING (true);

-- Role Permissions: Viewable by all, manageable by Admins
CREATE POLICY "Everyone can view role_permissions" ON public.role_permissions FOR SELECT USING (true);
CREATE POLICY "Admins can manage role_permissions" ON public.role_permissions FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.role_permissions rp
        JOIN public.permissions p ON rp.permission_id = p.id
        WHERE rp.role_id = (SELECT role_id FROM public.profiles WHERE id = auth.uid())
        AND p.slug = 'roles.manage'
    )
);
