# PAADI — Features & Overview

PAADI is a heritage-food and cultural-tour platform for **Pokkali rice country** in Kerala, India. It lets travelers discover Pokkali packages, book guided tours, and follow a live audio-guided journey through the villages, backwaters, and heritage kitchens. Village producers list their heritage products with scannable QR codes, and the PAADI team runs everything from a single admin control room.

**Tagline:** *Best Quality Heritage Food.*

**Live at:** [pokkali.in](https://pokkali.in) · installable as a mobile app (PWA + native Android).

---

## Development timeline

A dated log of when each major feature was developed and shipped.

| Date (UTC) | Feature |
| --- | --- |
| 2026-07-14 | Added dated development timeline to features documentation |
| 2026-07-14 | `FEATURES.md` — user-facing features & overview document created |
| 2026-07-14 | `DOCUMENTATION.md` — full engineering documentation rewritten |
| 2026-06-26 | Native Android app scaffolding via Capacitor — `capacitor.config.ts`, `ANDROID.md`, `appId: in.pokkali.paadi` |
| 2026-06-26 | PWA support — `manifest.webmanifest`, service worker (`public/sw.js`), app icons (192/512/apple-touch) |
| 2026-06-26 | Admin **Users** panel — approve/reject travelers, grant/revoke admin role |
| 2026-06-26 | Admin **Account** panel — self-service email + password change |
| 2026-06-26 | Booking-approval RLS — only admin-approved users can complete a booking |
| 2026-06-24 | Branded transactional email templates — signup, magic link, recovery, email change, reauth, invite, booking confirmation |
| 2026-06-24 | Email pipeline — auth webhook, transactional send, queue processing, suppression, unsubscribe under `/lovable/email/*` |
| 2026-06-23 | Initial engineering documentation |
| 2026-06-22 | **Blogs** — public blog listing + article pages, admin blogs panel |
| 2026-06-22 | **Newsletter** signup form with confirmation flow |
| 2026-06-20 | `TourGlobe` — interactive "cabin window" package showcase |
| 2026-06-20 | `HeroSlider` — cinematic landing hero |
| 2026-06-20 | `RiceCursor` — ambient rice-grain cursor |
| 2026-06-18 | Admin dashboard — Overview, Packages & GPS, Products & QR, Bookings, Setup |
| 2026-06-18 | Admin sign-in shortcut at `/admin/login` |
| 2026-06-18 | Traveler area — My Bookings, Live Tour with per-step audio narration |
| 2026-06-18 | `/api/tts` server route — Lovable AI Gateway text-to-speech for tour narration |
| 2026-06-18 | `QRScannerModal` — on-site QR check-ins at stops and products |
| 2026-06-18 | `LangPicker` — English / Malayalam / Hindi language switcher |
| 2026-06-18 | Ambient `AudioPlayer` component |
| 2026-06-18 | Package detail + booking flow (`/packages/:slug`) |
| 2026-06-18 | Auth — email + password and Google OAuth, session persistence |
| 2026-06-18 | Backend foundation — RLS on all public tables, `user_roles` + `has_role()` security-definer, `bookings`, `packages`, `destinations`, `products` |
| 2026-06-17 | Project bootstrap — TanStack Start + Tailwind v4 + shadcn/ui template |

New features should append a row here on the day they ship.

---

## 1. What PAADI does

- Showcases curated **tour packages** through Pokkali rice country.
- Lets verified travelers **book a tour** with date, guests, and preferred language.
- Delivers a **live guided tour** on the day, with step-by-step audio narration and on-site QR check-ins.
- Sells and tells the story of **heritage food products** from the region.
- Publishes **blogs** and a **newsletter** to keep followers engaged.
- Gives admins a single dashboard to run packages, products, blogs, bookings, and users.

---

## 2. Who uses PAADI

| Persona | What they do |
| --- | --- |
| **Visitor** | Browses packages, reads blogs, subscribes to the newsletter. |
| **Traveler** | Signs up, gets approved, books a tour, follows the live guided tour, scans QR codes on-site. |
| **Admin** | Manages packages, GPS stops, products, blogs, users, and bookings. |

---

## 3. Traveler experience

### 3.1 Discover
- **Cinematic hero slider** of Pokkali landscapes and featured packages.
- **TourGlobe** — an interactive "cabin window" that surfaces packages like boarding passes.
- **Blog** with photo-rich stories about the villages, farmers, and cuisine.
- **Newsletter** signup with confirmation email.
- **Language picker** — English, Malayalam, Hindi — for both UI copy and audio narration.
- **Ambient audio** and a playful rice-grain cursor for atmosphere.

### 3.2 Book a tour
- Open a package to see cover image, day-by-day itinerary, GPS stops, duration, price, and inclusions.
- Sign in with **email + password** or **Google**.
- Fill in **tour date, number of guests, preferred language, contact info** and submit.
- The booking is created in **pending** status until an admin approves the traveler's account.
- Approved travelers see the tour go **active** on their booking dashboard.

### 3.3 On tour day (Live Tour)
- Open the booking to launch the **live tour view** on the phone.
- Each itinerary step plays **audio narration** in the traveler's chosen language, streamed on demand from the Lovable AI Gateway.
- An inline map plots the package's GPS destinations.
- At each stop, travelers **scan a QR code** to unlock that stop's story, provenance details, and any offers on local products.

### 3.4 My account
- **My Bookings** — status (pending / approved / completed / cancelled), package, date, guests, total.
- Automatic session restore on return visits, on any device.
- Branded emails for signup confirmation, password recovery, magic link, and email change.

---

## 4. Admin control room

Accessible at **`/admin`** to users with the `admin` role. The first user to sign up can claim the admin seat at `/admin/setup`; further admins are granted from the Users panel.

| Panel | What it does |
| --- | --- |
| **Overview** | Live counts of packages, GPS stops, scannable products, and bookings, plus quick-start links. |
| **Packages & GPS stops** | Create / edit / delete tour packages: cover image, pricing, duration, inclusions, itinerary steps, GPS destinations with lat-long. |
| **Products & QR** | Manage heritage-food products (name, price, image, stock) and generate scannable QR codes for on-site provenance. |
| **Blogs & Newsletter** | Write and publish blog posts (cover image, tags, excerpt); view newsletter subscribers. |
| **Users** | Review new sign-ups, **approve** or **reject** travelers, grant / revoke admin role. Only approved users can book. |
| **Bookings** | See every booking with date, guest, guest count, language, total, and status. |
| **Account** | Change the signed-in admin's own email and password. |

---

## 5. Feature catalog

### Content & storytelling
- Tour packages with itineraries and GPS stops
- Heritage-food product catalogue with QR codes
- Blog with markdown articles and share-ready OG images
- Newsletter with confirmation flow
- Multi-language content (English / Malayalam / Hindi)

### Booking & tours
- Package browsing and detail pages
- Sign in / sign up (email + Google OAuth)
- Booking form with date, guests, language, contact info
- Traveler approval gate — only approved users can complete a booking
- Live guided tour view with per-step audio narration (AI TTS)
- Interactive map of the package's GPS destinations
- QR scanner for on-site check-ins at stops and products

### Admin
- Role-gated admin dashboard (`admin` vs `user`)
- First-run admin bootstrap ("claim first admin")
- CRUD for packages, itinerary steps, GPS destinations, products, blogs
- User approval / rejection and admin-role management
- Global booking oversight
- Admin email / password self-service

### Platform
- Installable **PWA** (Android Chrome, iOS Safari — Add to Home Screen)
- Native **Android app** via Capacitor, wraps the live site so every publish reaches users instantly
- Branded transactional email templates (signup, magic link, recovery, email change, reauth, invite)
- Per-route SEO with OpenGraph and Twitter cards
- Responsive design, mobile-first

### Security
- Row Level Security on every table
- Roles stored in a dedicated `user_roles` table with a security-definer `has_role` function
- Approval-based booking gate enforced at the database policy layer
- Anon key + RLS on the client; service role only in server-side code
- Signed webhooks for public API endpoints

---

## 6. Where things live

| Area | URL |
| --- | --- |
| Home | `/` |
| Package detail | `/packages/:slug` |
| Blog | `/blog`, `/blog/:slug` |
| Sign in | `/auth` |
| My bookings | `/bookings` |
| Live tour | `/tour/:bookingId` |
| Admin dashboard | `/admin` |
| Admin sign-in shortcut | `/admin/login` |

---

## 7. Roadmap

- Product checkout and payments (Stripe or Paddle).
- Deeper multi-language content across all packages and blogs.
- Push notifications for booking updates and tour reminders.
- Fully offline tour playback for low-signal villages.
- Native iOS build from the same Capacitor config.

---

For engineering internals — stack, routing, database schema, server functions, and file layout — see [`DOCUMENTATION.md`](./DOCUMENTATION.md). For the native Android build steps, see [`ANDROID.md`](./ANDROID.md).