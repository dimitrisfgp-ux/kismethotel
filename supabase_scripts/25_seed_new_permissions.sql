-- Add granular permissions for Rooms and Content
-- This splits the generic 'manage' permissions into specific actions.

INSERT INTO permissions (slug, description, module)
VALUES 
    -- Room Logistics
    ('rooms.update_times', 'Update room check-in and check-out times', 'rooms'),
    
    -- Room CRUD (Splitting rooms.manage)
    ('rooms.create', 'Create new rooms', 'rooms'),
    ('rooms.update', 'Update room details and amenities', 'rooms'),
    ('rooms.delete', 'Delete rooms', 'rooms'),

    -- Content Sections (Splitting content.manage)
    ('content.settings', 'Manage hotel settings and contact info', 'content'),
    ('content.pages', 'Manage page text and images', 'content'),
    ('content.faqs', 'Manage Frequently Asked Questions', 'content'),
    ('content.locations', 'Manage locations and attractions', 'content')

ON CONFLICT (slug) DO NOTHING;
