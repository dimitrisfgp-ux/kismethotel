# Workflow: Implement Master Database Schema

Based on the spec **"A highly scalable E-Commerce platform for the Greek Market."**, you are building a **supabase** database.
Please ensure the unified schema accommodates the following target entities natively: Products, Categories, Orders, Users.

## Aggregated Constraints

> You MUST implement a unified schema that satisfies ALL of the following atom constraints simultaneously:

### From Atom: `shopping-cart`
- [ ] **Must have a database table to store volatile anonymous cart data tied to a specific session token.**
      _Enforced constraint extracted from markdown blueprint._

### From Atom: `wishlist`
- [ ] **Must have a `wishlists` (or `saved_items`) table mapping `user_id` to `product_variant_id`.**
      _Enforced constraint extracted from markdown blueprint._

### From Atom: `attribute-facets`
- [ ] **Schema MUST support dynamic attributes (e.g., JSONB columns).**
      _Enforced constraint extracted from markdown blueprint._

### From Atom: `inventory-sync`
- [ ] **Stock decrements MUST occur as atomic database transactions (e.g., `SET stock = stock - 1`).**
      _Enforced constraint extracted from markdown blueprint._

### From Atom: `order-fulfillment`
- [ ] **Order statuses MUST be backed by a strictly typed Enum constraint at the database layer.**
      _Enforced constraint extracted from markdown blueprint._

### From Atom: `order-history`
- [ ] **Invoices and Receipts MUST pull from immutable snapshot tables (e.g., `order_line_items`), NOT live product tables.**
      _Enforced constraint extracted from markdown blueprint._

### From Atom: `notifications`
- [ ] **Notifications MUST be isolatable per user via RLS.**
      _Enforced constraint extracted from markdown blueprint._
- [ ] **Realtime delivery MUST use Supabase Realtime postgres_changes on the notifications table.**
      _Enforced constraint extracted from markdown blueprint._

### From Atom: `backoffice-shell`
- [ ] **The CMS shell MUST utilize a primary lateral Sidebar for module navigation, leaving the main remaining view pane strictly for table rendering and editors.**
      _Enforced constraint extracted from markdown blueprint._

### From Atom: `marketplace-sync`
- [ ] **The system MUST support generating a structured product feed conforming to the marketplace's schema.**
      _Enforced constraint extracted from markdown blueprint._

### From Atom: `multi-currency`
- [ ] **The database MUST store the base price in the native organizational currency.**
      _Enforced constraint extracted from markdown blueprint._

### From Atom: `translation-layer`
- [ ] **Database schemas storing display text MUST use JSONB translation maps instead of basic strings.**
      _Enforced constraint extracted from markdown blueprint._

