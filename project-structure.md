# Modern E-Commerce Platform

A production-oriented, full-stack e-commerce application built with **Next.js**, **TypeScript**, **Material UI**, **Redux Toolkit**, **Prisma**, **Supabase**, **Clerk**, and **Zod**.

The primary goal of this project is not only to build a functional online store, but also to apply modern **Next.js architecture, rendering strategies, caching, authentication, state management, SEO, validation, performance optimization, and software engineering principles** in a realistic application.

The project should be developed incrementally, with architecture and maintainability prioritized over unnecessary complexity.

---

# 1. Project Goals

The application aims to provide a complete modern e-commerce experience including:

* Product discovery and browsing
* Categories and brands
* Search, filtering, sorting, and pagination
* Dynamic product pages
* Product variants
* Shopping cart
* Wishlist
* Authentication
* User profiles
* Address management
* Checkout flow
* Order management
* Order history
* Reviews and ratings
* Admin dashboard
* Product and inventory management
* Responsive design
* SEO optimization
* Performance optimization
* Proper loading and error handling

The application should demonstrate not only what Next.js can do, but also **when and why specific Next.js features should be used**.

---

# 2. Technology Stack

## Core

### Next.js — App Router

Next.js is the main application framework.

The project will use the **App Router architecture** and modern Next.js features such as:

* Server Components
* Client Components
* Dynamic Routes
* Route Groups
* Layouts
* Server Actions
* Route Handlers where necessary
* Proxy for request-level routing concerns
* Suspense and Streaming
* Loading and Error boundaries
* Metadata API
* Caching and Revalidation
* Image Optimization
* Font Optimization

Server Components should remain the default choice.

Client Components should only be introduced when browser-side interactivity, state, effects, event handlers, or browser APIs are required.

---

### TypeScript

The entire application will be written in TypeScript.

TypeScript will be used for:

* Component props
* Domain models
* API/data structures
* Redux state
* Form data
* Utility functions
* Database-related types
* Server Actions
* Application contracts

Strict typing should be preferred.

Avoid unnecessary use of:

```ts
any
```

Types should describe the domain clearly rather than merely silence TypeScript errors.

---

# 3. UI — Material UI

**Material UI (MUI)** will be the primary UI component library.

MUI will be used for reusable interface primitives such as:

* Buttons
* Inputs
* Cards
* Dialogs
* Drawers
* Menus
* Selects
* Tabs
* Chips
* Badges
* Tables
* Pagination
* Skeletons
* Alerts
* Tooltips
* Navigation elements
* Admin dashboard components

The project should use MUI as a **design system foundation**, not simply as a collection of pre-built components.

---

## MUI Theme

A centralized custom theme should define:

* Color palette
* Typography
* Border radius
* Spacing
* Breakpoints
* Component variants
* Component overrides
* Light/dark behavior if dark mode is implemented

Avoid repeating arbitrary styling values throughout components.

Instead of repeatedly writing unrelated values:

```tsx
sx={{
  color: "#1976d2",
  borderRadius: "13px",
  marginTop: "19px",
}}
```

prefer values derived from the design system and theme.

The UI should maintain visual consistency across the entire application.

---

# 4. Design Direction

The visual language should be:

* Modern
* Minimal
* Clean
* Professional
* Product-focused
* Responsive
* Accessible
* Consistent

The interface should avoid unnecessary visual complexity.

Products and content should remain the primary focus.

---

## Layout Principles

Use a consistent container system.

Example conceptual layout:

```txt
Viewport
└── Page Container
    └── Section
        └── Content
```

Sections should not independently invent different horizontal spacing rules.

Spacing should follow a consistent system based on the MUI theme.

---

## Responsive Design

The application must support:

* Mobile
* Tablet
* Laptop
* Desktop
* Large desktop screens

Responsive behavior should be designed intentionally rather than added at the end.

Typical layout evolution:

```txt
Mobile
1 column

Tablet
2 columns

Desktop
3–4 columns
```

Responsive behavior may include:

* Responsive grids
* Adaptive navigation
* Mobile drawers
* Collapsible filters
* Responsive typography
* Adaptive product galleries
* Responsive checkout layouts

MUI breakpoints should be used consistently.

---

# 5. Application Architecture

The application should be organized primarily by **responsibility and domain**.

Example structure:

```txt
src/
├── app/
│   ├── (store)/
│   ├── (auth)/
│   ├── (account)/
│   ├── admin/
│   ├── api/
│   ├── layout.tsx
│   ├── error.tsx
│   ├── global-error.tsx
│   ├── not-found.tsx
│   ├── robots.ts
│   └── sitemap.ts
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   ├── account/
│   └── admin/
│
├── lib/
│   ├── db/
│   ├── auth/
│   ├── actions/
│   ├── validations/
│   ├── queries/
│   └── utils/
│
├── store/
│
├── types/
│
├── hooks/
│
├── theme/
│
└── generated/
```

Folders should be created when they serve a real architectural purpose.

Avoid creating dozens of empty abstraction folders before they are needed.

---

# 6. Routing Architecture

Route Groups should separate major application areas without affecting URLs.

Conceptually:

```txt
app/

(store)
(auth)
(account)
admin
```

---

## Store Routes

Example:

```txt
/
/products
/products/[slug]
/categories/[slug]
/search
/cart
```

---

## Authentication Routes

```txt
/login
/register
```

Authentication UI may be provided or integrated through Clerk.

---

## Account Routes

```txt
/account
/account/orders
/account/orders/[orderId]
/account/addresses
/account/favorites
```

---

## Checkout

```txt
/checkout
/checkout/success
```

Checkout routes require authentication where appropriate.

---

## Admin

```txt
/admin
/admin/products
/admin/products/new
/admin/products/[productId]/edit
/admin/categories
/admin/orders
/admin/users
```

Admin routes must be protected through authorization.

---

# 7. Dynamic Routing

Dynamic routes should represent resource-based pages.

Examples:

```txt
/products/[slug]
/categories/[slug]
/account/orders/[orderId]
/admin/products/[productId]/edit
```

Public product URLs should preferably use readable slugs.

Example:

```txt
/products/iphone-16-pro-256gb
```

instead of:

```txt
/products/847293
```

Internal database operations can still use unique IDs.

This provides:

* Human-readable URLs
* Better SEO
* Better sharing
* Cleaner navigation

---

# 8. Server Components First

Server Components should be the default architecture.

Good candidates include:

* Homepage
* Product listing
* Product detail
* Category pages
* Search result pages
* Order history
* Account data
* Admin product lists

Benefits include:

* Reduced client-side JavaScript
* Direct server-side data access
* Better initial rendering
* Improved SEO
* Better separation between server and client responsibilities

Do not add:

```tsx
"use client";
```

to an entire page merely because one small section requires interaction.

Instead:

```txt
ProductPage — Server Component

├── ProductInformation — Server
├── ProductGallery — Client if interactive
├── VariantSelector — Client
├── AddToCartButton — Client
├── ProductDescription — Server
└── Reviews — Server / streamed
```

Keep the client boundary as small as reasonably possible.

---

# 9. Client Components

Client Components should be used when required for:

* Event handlers
* Local interactive state
* Browser APIs
* Redux
* Effects
* Interactive forms
* Modals
* Drawers
* Product gallery interaction
* Variant selection
* Quantity controls
* Client-side search interactions

Client Components should complement Server Components rather than replace them.

---

# 10. Database — Supabase PostgreSQL

Supabase will provide the hosted PostgreSQL database.

Supabase is primarily responsible for database infrastructure.

Authentication will be handled separately by Clerk.

---

# 11. ORM — Prisma

Prisma will provide the database access layer.

Responsibilities include:

* Schema definition
* Database migrations
* Type-safe queries
* Relations
* Transactions
* Database client generation
* Seed data

Possible domain models:

```txt
User
Address

Product
ProductImage
ProductVariant

Category
Brand

Inventory

Cart
CartItem

Wishlist
WishlistItem

Order
OrderItem

Coupon

Review
```

The final schema should be designed according to actual business requirements rather than creating every possible model immediately.

---

# 12. Product Modeling

Products should support realistic e-commerce requirements.

A product should not necessarily be modeled as only:

```txt
Product
- name
- price
- stock
```

Products may have variants.

Example:

```txt
iPhone 16

├── Black / 128 GB
├── Black / 256 GB
├── White / 128 GB
└── White / 256 GB
```

Conceptually:

```txt
Product
│
├── ProductImage
│
└── ProductVariant
    ├── SKU
    ├── attributes
    ├── price
    └── stock
```

Cart and order operations should reference the actual purchasable variant when variants exist.

---

# 13. Authentication — Clerk

Clerk will handle authentication.

Features may include:

* Sign up
* Sign in
* Sign out
* Session management
* User identity
* Social authentication
* Protected routes

The application database may maintain an internal user record linked to the Clerk user ID when application-specific user data is required.

Example:

```txt
Clerk

Authentication identity
        │
        ▼
clerkId
        │
        ▼
Database User

addresses
orders
reviews
preferences
```

Clerk should handle authentication.

The application should handle its own business data and authorization rules.

---

# 14. Authentication vs Authorization

These concepts must remain separate.

Authentication answers:

> Who is the user?

Authorization answers:

> What is this user allowed to do?

Possible roles:

```txt
USER
ADMIN
```

Examples:

```txt
USER

Browse products
Manage own cart
Manage own addresses
Create orders
View own orders
Write reviews
```

```txt
ADMIN

Manage products
Manage categories
Manage inventory
Manage orders
Access admin dashboard
```

Authorization must always be verified on the server for sensitive operations.

UI-level protection alone is not security.

---

# 15. Proxy

Modern Next.js request interception should be used only where appropriate.

Possible responsibilities:

* Early authentication redirects
* Protecting account routes
* Protecting admin routes
* Redirecting authenticated users away from login pages
* Request-level routing concerns

Conceptually:

```txt
Request
   ↓
Proxy
   ↓
Early route/session check
   ↓
Page
```

However:

```txt
Proxy ≠ complete authorization
```

Sensitive operations must verify permissions again on the server.

---

# 16. State Management — Redux Toolkit

Redux Toolkit will manage **shared mutable client state**.

Potential Redux responsibilities:

```txt
Cart client interactions
Cart drawer state
Checkout UI state
Temporary shared selections
Global UI state where necessary
```

Redux should not become a duplicate database.

Do not automatically copy all server data into Redux.

Avoid:

```txt
Database
    ↓
Server Component
    ↓
Redux
    ↓
Component
```

when the component can directly receive server-rendered data.

Prefer:

```txt
Database
    ↓
Server Component
    ↓
Component
```

Redux should be introduced when multiple Client Components genuinely need coordinated shared state.

---

# 17. Redux Architecture

Prefer feature-based slices.

Example:

```txt
store/

├── store.ts
├── StoreProvider.tsx
│
└── features/
    ├── cart/
    │   └── cartSlice.ts
    │
    ├── checkout/
    │   └── checkoutSlice.ts
    │
    └── ui/
        └── uiSlice.ts
```

Avoid creating one enormous global slice.

Each slice should represent a clear domain responsibility.

---

# 18. Validation — Zod

Zod will be used for runtime validation.

Possible uses:

* Product creation
* Product editing
* Checkout
* Address forms
* Search parameters
* Review forms
* Server Actions
* Environment variables where appropriate

Example flow:

```txt
Form
  ↓
Server Action
  ↓
Zod Validation
  ↓
Authorization
  ↓
Business Logic
  ↓
Database
```

TypeScript alone does not validate runtime input.

All untrusted external input must be validated.

---

# 19. Forms

Forms should provide:

* Validation
* Loading state
* Error feedback
* Accessible labels
* Disabled submission state
* Success feedback

Depending on complexity, forms may use:

```txt
React Hook Form
+
Zod
```

or native Server Action form patterns where appropriate.

Choose the simplest architecture that correctly handles the requirement.

---

# 20. Server Actions

Server Actions should be used for server-side mutations where they provide a clean architecture.

Possible examples:

* Create product
* Update product
* Delete/deactivate product
* Create address
* Update profile
* Apply coupon
* Create order
* Add review

Conceptual flow:

```txt
Client
   ↓
Server Action
   ↓
Authentication
   ↓
Authorization
   ↓
Zod validation
   ↓
Business logic
   ↓
Prisma
   ↓
Database
   ↓
Cache invalidation
```

Server Actions must be treated as externally callable server entry points.

Never assume that a Server Action is secure merely because its implementation is not visible in the browser bundle.

---

# 21. Route Handlers

Route Handlers should only be introduced when an actual HTTP endpoint is needed.

Good examples:

* Webhooks
* External service callbacks
* File upload endpoints
* Public/internal APIs
* Integrations requiring HTTP endpoints

Do not create Route Handlers simply to call them immediately from a Server Component when direct server-side code can perform the same operation.

Avoid unnecessary architecture:

```txt
Server Component
     ↓
Own Route Handler
     ↓
Database
```

Prefer:

```txt
Server Component
     ↓
Query/service layer
     ↓
Database
```

when no HTTP boundary is needed.

---

# 22. Search, Filters and URL State

Search and product filtering should primarily use the URL as state.

Example:

```txt
/products
?category=laptops
&brand=lenovo
&minPrice=20000
&maxPrice=60000
&sort=price-asc
&page=2
```

Benefits:

* Shareable URLs
* Browser history support
* Refresh persistence
* Server-side rendering compatibility
* Better navigation
* Better SEO architecture

Use:

```txt
searchParams
useSearchParams
router
Link
```

where appropriate.

Do not put all filtering state exclusively into Redux.

---

# 23. Caching Strategy

Caching must be intentional.

The project should distinguish between:

```txt
Public + relatively stable data

Public + frequently changing data

User-specific data

Sensitive data

Admin-specific data
```

Possible cache candidates:

* Categories
* Brands
* Featured products
* Product descriptions
* Homepage sections
* Public product catalog data

Data that should generally remain dynamic:

* Cart
* Wishlist
* Checkout
* User profile
* Orders
* Sensitive account data
* Critical stock validation

Caching should never cause users to see another user's private data.

---

# 24. Revalidation

When data changes, related cached content should be invalidated intentionally.

Example:

```txt
Admin updates Product A
        ↓
Database updated
        ↓
Product cache invalidated
        ↓
Product listing invalidated if necessary
        ↓
Updated data becomes available
```

Use the appropriate Next.js revalidation strategy depending on whether the invalidation is resource-based or route-based.

The project should document important caching decisions.

---

# 25. Suspense and Streaming

Slow sections should not unnecessarily block the entire page.

Example:

```txt
Product Page

Product Information    → immediately useful

Reviews                 → streamed

Related Products        → streamed

Recommendations         → streamed
```

Use Suspense boundaries where they improve actual user experience.

Skeleton components should visually resemble the final content to reduce layout shifts.

---

# 26. Loading States

Use appropriate loading patterns:

* `loading.tsx`
* Suspense fallbacks
* MUI Skeleton
* Button loading states
* Form pending states

Avoid full-screen spinners for every small operation.

Prefer contextual loading feedback.

---

# 27. Error Handling

The application should handle errors intentionally.

Use:

```txt
error.tsx
global-error.tsx
not-found.tsx
```

where appropriate.

Handle cases such as:

* Product does not exist
* Order does not exist
* Unauthorized access
* Database failure
* Invalid form data
* Network/service failure
* Empty search results
* Payment failure

Do not expose raw server errors or stack traces to users.

---

# 28. SEO

SEO is a core project requirement.

Use:

* Metadata API
* `generateMetadata`
* Canonical URLs
* Open Graph metadata
* Twitter metadata
* Sitemap
* Robots configuration
* Semantic HTML
* Structured data
* Clean URLs

Dynamic product metadata should be generated from product data.

Example:

```txt
Product

Lenovo Legion 5

↓

<title>
Lenovo Legion 5 | Store Name
</title>
```

Product pages should also consider structured data such as Product JSON-LD.

---

# 29. Images

Use Next.js Image optimization where appropriate.

Requirements:

* Correct dimensions
* Responsive sizing
* Lazy loading
* Proper `sizes`
* Meaningful alt text
* Avoid layout shifts

Product images should not be loaded at unnecessarily large resolutions.

---

# 30. Accessibility

Accessibility is part of implementation quality.

Requirements include:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Accessible form labels
* Proper contrast
* ARIA only where necessary
* Accessible dialogs and menus
* Correct heading hierarchy
* Alt text

MUI's accessibility support should be preserved rather than overridden carelessly.

---

# 31. Performance Principles

Performance should be considered architecturally.

Principles:

* Prefer Server Components
* Keep Client Components focused
* Avoid unnecessary JavaScript
* Optimize images
* Avoid unnecessary global state
* Use caching intentionally
* Stream slow content
* Lazy-load expensive client components when useful
* Avoid unnecessary third-party packages

Do not optimize blindly.

Measure before performing complex optimizations.

Potential tools:

* Lighthouse
* Chrome DevTools
* Next.js build output
* Web Vitals

---

# 32. Security Principles

Never trust client input.

All sensitive operations must validate:

```txt
Authentication
Authorization
Input
Resource ownership
Business rules
```

Examples:

A user must not be able to:

```txt
Change another user's address

View another user's order

Modify product prices

Access admin actions

Submit arbitrary checkout totals
```

Critical calculations should happen on the server.

For example, never trust:

```json
{
  "total": 100
}
```

from the client.

Instead:

```txt
Client sends cart/product identifiers
        ↓
Server reads current database prices
        ↓
Server validates stock
        ↓
Server calculates final total
        ↓
Order is created
```

---

# 33. Cart Architecture

The cart should support a realistic shopping experience.

Possible requirements:

* Add item
* Remove item
* Update quantity
* Select variant
* Validate stock
* Calculate totals
* Preserve cart state
* Merge guest and authenticated carts if implemented

Redux may manage immediate client interaction.

The server/database remains authoritative for sensitive checkout operations.

---

# 34. Checkout Architecture

Conceptual flow:

```txt
Cart
  ↓
Authentication
  ↓
Address
  ↓
Delivery
  ↓
Order Summary
  ↓
Payment
  ↓
Server-side validation
  ↓
Order creation
  ↓
Success / Failure
```

Before creating an order, the server must verify:

* User
* Products
* Variants
* Current prices
* Stock
* Discounts
* Coupon validity
* Address
* Final total

---

# 35. Admin Architecture

The admin dashboard should provide:

```txt
Dashboard

Products
Categories
Inventory
Orders
Customers
Reviews
```

Product management should support:

```txt
Create
Read
Update
Deactivate/Delete
```

Admin forms should use:

```txt
MUI
+
React Hook Form where useful
+
Zod
+
Server Actions
+
Prisma
```

All admin mutations must verify authorization on the server.

---

# 36. Component Design Principles

Components should have clear responsibilities.

Avoid enormous files such as:

```txt
ProductPage.tsx
1200 lines
```

Prefer composition:

```txt
ProductPage

├── ProductBreadcrumb
├── ProductGallery
├── ProductInfo
│   ├── ProductPrice
│   ├── VariantSelector
│   ├── QuantitySelector
│   └── AddToCart
├── ProductDescription
├── ProductSpecifications
├── ProductReviews
└── RelatedProducts
```

However, avoid over-engineering.

Do not create a component merely because three lines of JSX can technically be extracted.

Extract when it improves:

* Reusability
* Readability
* Responsibility separation
* Testing
* Maintenance

---

# 37. Utility Principles

Use utility functions for reusable pure logic.

Examples:

```txt
formatCurrency()

formatDate()

calculateDiscount()

createSlug()

calculateCartTotal()
```

Utilities should generally be:

* Small
* Predictable
* Reusable
* Easy to test

Business logic should not be hidden inside random utility files.

---

# 38. Testing Strategy

Testing will be introduced progressively.

Possible stack:

```txt
Vitest
React Testing Library
Playwright
```

---

## Unit Tests

Good candidates:

* Price calculations
* Discount logic
* Cart calculations
* Validation schemas
* Utility functions

---

## Component Tests

Examples:

* ProductCard
* QuantitySelector
* Filters
* Forms
* Cart interactions

---

## E2E Tests

Critical flows:

```txt
Browse products

Search product

Open product

Select variant

Add to cart

Authenticate

Checkout

Create order

View order
```

Admin flow:

```txt
Login as admin

Create product

Update product

Verify storefront update
```

Do not test implementation details unnecessarily.

Test observable behavior.

---

# 39. Development Principles

## Keep It Simple

Do not introduce complexity without a real requirement.

Avoid adding technologies simply because they look impressive on a CV.

---

## Server First

Prefer server-side solutions when interactivity is not required.

---

## Client When Necessary

Use client-side state and logic intentionally.

---

## URL as State

Use URL search parameters for shareable navigation state such as:

* Search
* Filters
* Sort
* Pagination

---

## Database as Source of Truth

Do not create unnecessary duplicate sources of truth.

---

## Validate Boundaries

Validate data when it enters trusted application boundaries.

---

## Secure Every Mutation

Every sensitive mutation must independently verify authorization.

---

## Optimize After Correctness

Correct architecture first.

Performance optimization second.

---

## Build Incrementally

Complete working vertical slices rather than building every infrastructure layer first.

---

# 40. Development Roadmap

## Phase 1 — Foundation

* Next.js setup
* TypeScript
* MUI
* Custom theme
* Global layout
* Responsive navigation
* Footer
* Base components
* Folder architecture

---

## Phase 2 — Static Storefront

Using mock data:

* Homepage
* Product cards
* Product listing
* Dynamic product page
* Categories
* Search UI
* Responsive layouts

Focus:

```txt
Routing
Layouts
Server/Client Components
MUI
Responsive Design
Component Architecture
```

---

## Phase 3 — Database

* Supabase PostgreSQL
* Prisma
* Schema
* Migrations
* Seed data
* Product queries
* Category queries
* Product detail queries

---

## Phase 4 — Product Discovery

* Search
* Filters
* Sorting
* Pagination
* URL state
* Categories
* Brands

---

## Phase 5 — Authentication

* Clerk
* Sign in
* Sign up
* Session
* User database synchronization if needed
* Protected account routes
* Protected admin routes
* Authorization

---

## Phase 6 — Shopping Features

* Product variants
* Cart
* Wishlist
* Quantity management
* Stock validation
* Redux Toolkit integration

---

## Phase 7 — Checkout

* Address management
* Checkout flow
* Server validation
* Order creation
* Order history
* Order detail

Payment may initially be simulated before integrating a real provider.

---

## Phase 8 — Admin

* Dashboard
* Product CRUD
* Categories
* Inventory
* Orders
* Customers
* Server Actions
* Validation
* Cache invalidation

---

## Phase 9 — Performance

* Caching
* Revalidation
* Suspense
* Streaming
* Image optimization
* Bundle optimization
* Lighthouse improvements

---

## Phase 10 — SEO

* Metadata
* Dynamic metadata
* Sitemap
* Robots
* Canonical URLs
* Open Graph
* Structured data

---

## Phase 11 — Testing

* Unit tests
* Component tests
* E2E tests
* Critical user flows
* Admin flows

---

## Phase 12 — Production

* Environment configuration
* Production database
* Deployment
* Error monitoring
* Security review
* Performance testing
* Accessibility review
* Final documentation

---

# 41. What We Will Avoid Initially

The first production-ready version will intentionally avoid unnecessary complexity such as:

* Microservices
* Kubernetes
* RabbitMQ
* Multiple frontend state libraries
* Unnecessary custom APIs
* Premature real-time systems
* AI recommendation systems
* Multi-vendor marketplace architecture
* Native mobile applications
* Overly complex DevOps infrastructure

These may be explored later only if they solve a real requirement.

---

# 42. Architecture Decision Philosophy

For every important technical decision, we should be able to answer:

```txt
1. What problem are we solving?

2. Why did we choose this solution?

3. What alternatives existed?

4. What trade-offs did we accept?
```

Examples:

```txt
Why Redux Toolkit?

Why Server Components?

Why Clerk?

Why Prisma?

Why Supabase?

Why MUI?

Why URL-based filters?

Why cache this data?

Why not cache that data?

Why Server Action instead of Route Handler?
```

Being able to explain these decisions is as important as implementing them.

---

# 43. Final Objective

The final application should demonstrate practical knowledge of:

```txt
Next.js App Router

React Server Components

Client Components

Dynamic Routing

Layouts

Route Groups

Server Actions

Route Handlers

Proxy

Authentication

Authorization

Caching

Revalidation

Suspense

Streaming

SEO

Metadata

Responsive Design

Material UI

Redux Toolkit

TypeScript

Prisma

PostgreSQL / Supabase

Clerk

Zod

Form Validation

Database Design

Security

Testing

Performance Optimization

Accessibility
```

The goal is not to claim:

> “Every Next.js feature was used.”

The goal is to be able to say:

> “Each technology and Next.js feature was used where it solved a real architectural or product problem, and I can explain why.”

That principle should guide the entire development of the project.
