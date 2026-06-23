# PAADI — Web App Documentation

PAADI is a heritage-food and cultural-tour platform for Pokkali rice country. It combines a public marketing/booking site, an authenticated traveler area, and an admin dashboard for content and operations.

- **Stack:** TanStack Start (React 19 + Vite 7), Tailwind v4, shadcn/ui, Lovable Cloud (Supabase) for DB / auth / storage, Lovable AI Gateway for TTS.
- **Live preview:** `/` (public) · `/auth` (sign-in) · `/admin` (admin dashboard).

---

## 1. Public site

### 1.1 Home (`/`)
- Hero slider showcasing Pokkali landscapes and packages (`HeroSlider`).
- Featured tour packages rendered through the interactive `TourGlobe` "cabin window" with a boarding-pass CTA.
- Newsletter signup (`NewsletterForm`) and language picker (`LangPicker`).
- Ambient audio player (`AudioPlayer`) and decorative `RiceCursor`.
- SEO: per-route `head()` with title, description, OG/Twitter tags.

### 1.2 Packages (`/packages/:slug`)
- Full package detail: cover image, itinerary steps, destinations, duration, price.
- "Book now" flow that creates a booking tied to the signed-in user.

### 1.3 Blog (`/blog`, `/blog/:slug`)
- Listing of published posts (cover image, title, excerpt, tags, date).
- Markdown-rendered article pages with cover, author meta, and share-ready OG image.
- Content seeded from external source and editable from the admin Blogs panel.

### 1.4 Auth (`/auth`)
- Email + password sign-in / sign-up via Lovable Cloud.
- Google OAuth sign-in.
- Session restored automatically on return visits.

---

## 2. Traveler area (authenticated)

Routes under `/_authenticated/*` require a signed-in user.

### 2.1 My bookings (`/bookings`)
- List of the user's bookings with status, package, dates, and a link into the live tour view.

### 2.2 Live tour (`/tour/:bookingId`)
- Step-by-step itinerary playback for an active booking.
- Per-step audio narration via the `/api/tts` server route (Lovable AI Gateway text-to-speech).
- QR scanner modal (`QRScannerModal`) for on-site check-ins at destinations.

---

## 3. Admin dashboard (`/admin`)

Gated by the `admin` role (`has_role` check). Non-admins are redirected to `/admin/setup`.

| Section | Route | What it does |
| --- | --- | --- |
| Overview | `/admin` | Live counts of packages, destinations, products, bookings; quick links. |
| Packages | `/admin/packages` | Create/edit/delete tour packages, itinerary steps, destinations, pricing, cover image. |
| Products | `/admin/products` | Manage heritage-food products (name, price, image, stock). |
| Blogs | `/admin/blogs` | Create/edit blog posts, toggle publish state, set cover image and tags. |
| Bookings | `/admin/bookings` | View all customer bookings, statuses, and traveler details. |
| Setup | `/admin/setup` | First-run admin promotion / role bootstrapping. |

Admin login shortcut at `/admin/login`.

---

## 4. Backend (Lovable Cloud)

### 4.1 Database (Postgres)
Core tables (all in `public` with RLS enabled and explicit GRANTs):
- `packages`, `package_itinerary_steps`, `package_destinations`
- `products`
- `blogs`
- `bookings`
- `user_roles` + `app_role` enum (`admin`, `user`, …)
- `profiles`

### 4.2 Security model
- Row Level Security on every public table.
- Roles stored in `user_roles` (never on `profiles`).
- `public.has_role(user_id, role)` security-definer function used inside RLS policies and the admin route guard.
- Webhooks / public APIs (if added) live under `/api/public/*` with signature verification.

### 4.3 Server functions & routes
- `createServerFn` modules in `src/lib/*.functions.ts` for typed RPC.
- Protected functions use `requireSupabaseAuth` middleware (wired through `attachSupabaseAuth` in `src/start.ts`).
- Raw HTTP endpoint: `src/routes/api/tts.ts` — streams synthesized speech for the live-tour narration.

### 4.4 Auth
- Email/password + Google OAuth.
- Session injected on the client via `@/integrations/supabase/client`.
- SSR-safe: protected loaders only run under `_authenticated/*`.

---

## 5. Design system

- Tailwind v4 with semantic tokens in `src/styles.css` (no hardcoded color utilities in components).
- shadcn/ui primitives under `src/components/ui/*`.
- Brand: PAADI logo (`src/assets/paadi-logo.png`) used in the public header and admin shell.
- Tagline: "Best Quality Heritage Food".

---

## 6. Project layout

```
src/
  routes/                 # File-based routing (TanStack Start)
    __root.tsx            # HTML shell, providers, global head tags
    index.tsx             # Home
    packages.$slug.tsx
    blog.tsx, blog.$slug.tsx
    auth.tsx, admin.login.tsx
    api/tts.ts            # TTS HTTP endpoint
    _authenticated/
      route.tsx           # Auth gate (redirects to /auth)
      bookings.tsx
      tour.$bookingId.tsx
      admin/
        route.tsx         # Admin gate (role check)
        index.tsx packages.tsx products.tsx blogs.tsx bookings.tsx setup.tsx
  components/
    app/                  # Feature components (Header, HeroSlider, TourGlobe, …)
    ui/                   # shadcn primitives
  integrations/supabase/  # Auto-generated client + auth middleware
  hooks/                  # useAuth, use-mobile, …
  lib/                    # Utilities and server-function modules
  styles.css              # Tailwind v4 tokens + theme
```

---

## 7. Local development

- Dev server: auto-started by Lovable on port `8080`.
- Package manager: `bun`.
- Type-safety: strict TS; routes are typed end-to-end via the generated route tree.
- Don't edit: `src/routeTree.gen.ts`, `src/integrations/supabase/*` auto-generated files, `.env`.

---

## 8. Roadmap hooks (already scaffolded)

- Flutter mobile client consuming the same Lovable Cloud backend.
- Product checkout / payments (Stripe or Paddle via Lovable connectors).
- Multi-language content via `LangPicker`.
