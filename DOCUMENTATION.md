# PAADI — Web App Documentation

PAADI is a heritage-food and cultural-tour platform for Pokkali rice country in Kerala, India. It combines a public marketing / booking site, an authenticated traveler area with a live guided-tour experience, and an admin control room for content, users, and operations. The same web app also ships as an installable PWA and, via Capacitor, as a native Android app.

- **Stack:** TanStack Start (React 19 + Vite 7), Tailwind v4, shadcn/ui, Lovable Cloud (Postgres + auth + storage), Lovable AI Gateway for text-to-speech.
- **Distribution:** Web (`https://pokkali.in`), installable PWA, native Android via Capacitor (see `ANDROID.md`).
- **Tagline:** *Best Quality Heritage Food.*

---

## 1. Public site

### 1.1 Home (`/`)
- Hero slider showcasing Pokkali landscapes and tour packages (`HeroSlider`).
- Featured tour packages rendered inside the interactive `TourGlobe` "cabin window" with a boarding-pass CTA.
- Newsletter signup (`NewsletterForm`) — writes to the backend and triggers a confirmation email.
- Language picker (`LangPicker`) — English, Malayalam, Hindi — drives narration language and UI copy.
- Ambient `AudioPlayer` and decorative `RiceCursor` for atmosphere.
- SEO: per-route `head()` with title, description, OpenGraph, and Twitter card tags.

### 1.2 Packages (`/packages/:slug`)
- Full package detail: cover image, itinerary steps, GPS destinations, duration, price, inclusions.
- **Book now** flow — pick tour date, number of guests, preferred language, contact info; creates a booking tied to the signed-in user.
- Bookings are only accepted once the user has been **approved** by an admin (see §3 Users).

### 1.3 Blog (`/blog`, `/blog/:slug`)
- Listing of published posts with cover image, title, excerpt, tags, date.
- Markdown-rendered article pages with author meta and per-post share-ready OG image.
- Content managed from the admin **Blogs** panel; drafts stay hidden until published.

### 1.4 Auth (`/auth`)
- Email + password sign-in / sign-up.
- Google OAuth sign-in.
- Session persisted and restored automatically on return visits.
- Password recovery and email-change flows use branded transactional templates (`src/lib/email-templates/*`).

---

## 2. Traveler area (authenticated)

Routes under `/_authenticated/*` require a signed-in user. The layout redirects unauthenticated visitors to `/auth`.

### 2.1 My bookings (`/bookings`)
- List of the user's bookings with status (`pending` / `approved` / `completed` / `cancelled`), package, tour date, guests, total, and a link into the live tour view.

### 2.2 Live tour (`/tour/:bookingId`)
- Step-by-step itinerary playback for an active booking.
- Per-step audio narration streamed from the `/api/tts` server route (Lovable AI Gateway TTS) in the user's preferred language.
- Inline map with the package's GPS destinations.
- `QRScannerModal` — scan on-site QR codes at destinations / products to unlock stories, provenance, and offers.

---

## 3. Admin dashboard (`/admin`)

Gated by the `admin` role via the `has_role(user_id, role)` security-definer function. Non-admins are redirected to `/admin/setup`, where the first-ever user can claim the admin seat via the `claim_first_admin` RPC. Direct sign-in shortcut at `/admin/login`.

| Section | Route | What it does |
| --- | --- | --- |
| Overview | `/admin` | Live counts of packages, GPS stops, scannable products, and bookings; quick-start links. |
| Packages & GPS stops | `/admin/packages` | Create / edit / delete tour packages, itinerary steps, destinations with lat-long, pricing, cover image. |
| Products & QR | `/admin/products` | Manage heritage-food products (name, price, image, stock) and generate scannable QR codes. |
| Blogs & Newsletter | `/admin/blogs` | Create / edit blog posts, toggle publish state, set cover image and tags; view newsletter subscribers. |
| Users | `/admin/users` | Review sign-ups, **approve** or **reject** users, grant / revoke admin role. Only approved users can complete a booking. |
| Bookings | `/admin/bookings` | View all customer bookings with tour date, guest, guests count, language, total, and status. |
| Account | `/admin/account` | Change the signed-in admin's own email and password. |
| Setup | `/admin/setup` | First-run admin promotion / role bootstrapping (first user wins). |

---

## 4. Backend (Lovable Cloud)

### 4.1 Database (Postgres)
All tables live in `public` with RLS enabled and explicit `GRANT`s per role.

- `packages`, `package_itinerary_steps`, `package_destinations` — tour catalogue and itinerary.
- `products` — heritage-food catalogue with QR references.
- `blogs` — long-form content.
- `bookings` — customer bookings linked to user + package.
- `newsletter_subscribers` — email opt-ins.
- `profiles` — public-safe profile data + approval status.
- `user_roles` + `app_role` enum (`admin`, `user`, …) — role assignments, never stored on `profiles`.

### 4.2 Security model
- Row Level Security on every public table with policies scoped to `auth.uid()` and role checks.
- Roles stored in `user_roles`; role checks use the `public.has_role(uuid, app_role)` security-definer function to avoid recursive-RLS issues.
- User-approval gate: booking-creation policies require an approved profile — pending users can browse but not book.
- Webhooks / public APIs live under `/api/public/*` with signature verification.
- Client uses the anon key with RLS; admin / maintenance flows use the service role only in server-side code (`client.server.ts`).

### 4.3 Server functions & routes
- `createServerFn` modules in `src/lib/*.functions.ts` for typed client-to-server RPC.
- Protected functions use `requireSupabaseAuth` middleware, wired via `attachSupabaseAuth` in `src/start.ts`.
- Raw HTTP endpoints under `src/routes/api/`:
  - `api/tts.ts` — streams synthesized speech for the live-tour narration.
- Email pipeline under `src/routes/lovable/email/*` — auth webhook, transactional send, queue processing, suppression, unsubscribe.

### 4.4 Auth
- Email / password + Google OAuth.
- Client session via `@/integrations/supabase/client`; the `useAuth()` hook exposes `session`, `user`, `loading`, `isAdmin`.
- SSR-safe: protected loaders only run under `_authenticated/*` so SSR / prerender never hits an authenticated call unauthenticated.
- Branded auth emails (signup, magic link, recovery, email change, reauth, invite) in `src/lib/email-templates/`.

---

## 5. Progressive Web App & Native Android

- **PWA:** `public/manifest.webmanifest` + `public/sw.js` (installable on Android Chrome and iOS Safari). Icons at `public/icon-192.png`, `public/icon-512.png`, `public/apple-touch-icon.png`. The service worker only registers on the published origin.
- **Native Android:** `capacitor.config.ts` (`appId: in.pokkali.paadi`) wraps the live site inside a WebView so every Lovable publish reaches users instantly. `ANDROID.md` documents the local build / signing / Play Store flow. Removing the `server` block yields a fully offline bundle.

---

## 6. Design system

- Tailwind v4 with semantic tokens in `src/styles.css` (no hardcoded color utilities in components).
- shadcn/ui primitives under `src/components/ui/*`.
- Brand: PAADI logo (`src/assets/paadi-logo.png`) used in the public header and admin shell.
- Signature components: `TourGlobe` (cabin-window package showcase), `HeroSlider`, `RiceCursor`, `AudioPlayer`, `LangPicker`, `QRScannerModal`.

---

## 7. Project layout

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
        index.tsx  packages.tsx  products.tsx  blogs.tsx
        users.tsx  bookings.tsx  account.tsx  setup.tsx
  components/
    app/                  # Feature components (Header, HeroSlider, TourGlobe, …)
    ui/                   # shadcn primitives
  integrations/supabase/  # Auto-generated client + auth middleware
  hooks/                  # useAuth, use-mobile, …
  lib/                    # Utilities, email templates, server-function modules
  styles.css              # Tailwind v4 tokens + theme
```

---

## 8. Local development

- Dev server: auto-started by Lovable on port `8080`.
- Package manager: `bun`.
- Type-safety: strict TS; routes are typed end-to-end via the generated route tree.
- Don't edit: `src/routeTree.gen.ts`, `src/integrations/supabase/*` auto-generated files, `.env`.

---

## 9. Roadmap hooks (already scaffolded)

- Product checkout / payments (Stripe or Paddle via Lovable connectors).
- Multi-language content via `LangPicker` (English, Malayalam, Hindi).
- Native Android build via Capacitor; iOS possible from the same config.
- Push notifications and offline-first tour playback.