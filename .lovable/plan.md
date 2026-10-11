# SEO Plan — 20 Target Keywords

Data: Semrush, India market. Volumes are monthly estimates and difficulty is 0–100 (lower means easier).

## The 20 keywords and where each one lives

| # | Keyword | Volume | Difficulty | Target page |
|---|---|---|---|---|
| 1 | things to do in kochi | 9,900 | 22 | New: /day-trip-from-kochi |
| 2 | places to visit near kochi | 3,600 | 26 | New: /day-trip-from-kochi |
| 3 | kochi day trip | 110 | 12 | New: /day-trip-from-kochi |
| 4 | day trip from kochi | 90 | 0 | New: /day-trip-from-kochi |
| 5 | kayaking in kochi | 3,600 | 31 | /water-sports |
| 6 | kayaking kerala | 30 | 0 | /water-sports |
| 7 | backwater tour kochi | 590 | 33 | /water-sports |
| 8 | kerala backwaters | 3,600 | 37 | /water-sports + blog |
| 9 | chinese fishing nets kochi | 3,600 | 30 | Blog post |
| 10 | pokkali rice | 1,000 | 24 | /pokkali-story |
| 11 | pokkali | 590 | 23 | /pokkali-story |
| 12 | pokkali farming | 140 | 23 | /farm-tours |
| 13 | salt tolerant rice | 30 | 0 | /pokkali-story |
| 14 | pokkali rice benefits | 20 | 0 | /products + blog |
| 15 | buy pokkali rice | 20 | 0 | /products |
| 16 | red rice kerala | 1,900 | 25 | /products |
| 17 | paddy field kerala | 720 | 23 | /farm-tours |
| 18 | eco tourism kerala | 1,300 | 26 | Home + /about |
| 19 | farm stay kerala | 210 | 2 | /village-hub |
| 20 | kerala village tour / responsible tourism kerala | 20 / 210 | 0 / 30 | Home + /about |

Strategy: win the easy, specific searches first (Pokkali, day trips, kayaking). Then build toward the big "things to do in Kochi" searches with a strong guide page.

## What will be implemented

1. **Page titles and descriptions**: rewrite them on Home, Farm Tours, Products, Village Hub, Water Sports, Pokkali Story, About, Visit and Contact, so each page leads with its keywords.
2. **Page wording**: work each page's keywords naturally into its main heading, opening paragraph, section headings and FAQs. Nothing gets stuffed or hidden.
3. **New page "Day Trip from Kochi"**: a guide covering a one-day plan, travel time from Kochi and the airport, what to do (farm tour, kayaking, country boat, the Pokkali story), best time to visit and FAQs. It links to booking.
4. **6 new blog posts** (published, in the existing blog), each built around 1–2 keywords:
   - "Pokkali Rice: Benefits of Kerala's Salt-Tolerant Grain" (pokkali rice, pokkali rice benefits, salt tolerant rice)
   - "Things to Do in Kochi: A Village Day Trip Locals Love" (things to do in kochi, places to visit near kochi)
   - "Kayaking in Kochi: Paddling the Quiet Backwaters of Palliyakkal" (kayaking in kochi, kerala backwaters)
   - "Chinese Fishing Nets of Kochi and the Village Nets of Palliyakkal" (chinese fishing nets kochi)
   - "Red Rice of Kerala vs Pokkali: What's the Difference?" (red rice kerala, buy pokkali rice)
   - "Eco Tourism in Kerala: Walking the Paddy Fields of a Living Village" (eco tourism kerala, paddy field kerala, responsible tourism kerala)
5. **Newsletters**: a branded newsletter email template, plus 3 ready issues that each feature the new blog posts and a tour offer:
   - Issue 1: "The Pokkali Story", covering the rice posts
   - Issue 2: "Day Trips & Backwaters from Kochi", covering the Kochi and kayaking posts
   - Issue 3: "Eco Travel in Kerala", covering the eco tourism and fishing nets posts

   In Admin → Blogs & Newsletter, a new "Send newsletter" area lets you pick an issue, preview it, send a test, then send it to all active subscribers. Each email includes an unsubscribe link. Nothing is sent automatically. You choose when to send each issue.
6. **Links between pages**: each page links to 2–3 related pages using keyword-rich link text, and the footer links to the new guide.
7. **Search details Google reads**: each page tells search engines its own main address and how it looks when shared. Google also gets business details (name, address, area), tour and attraction details, FAQs, and breadcrumb trails on the inner pages.
8. **Sitemap**: add the new page; the blog posts are added automatically.

## Notes
- Some facts will be written by me (travel times, activities). I'll flag anything you need to confirm.
- Changes reach Google only after you publish. Rankings then take weeks to months.
- Connecting Google Search Console afterwards is recommended so you can track impressions for these keywords.

## Technical details
- Use `head()` on each route with title, description, og:title, og:description, og:type, og:url and canonical. Everything points to https://pokkalivillage.com/<path>, leaf routes only.
- Structured data (JSON-LD) through `scripts` in `head()`:
  - LocalBusiness/TouristAttraction on Home and Visit
  - TouristTrip on Farm Tours
  - FAQPage where FAQs exist
  - BreadcrumbList on inner pages
  - Article on the new blog posts
- New route `src/routes/day-trip-from-kochi.tsx` using the PageShell components, with `staticData.sitemap: true`.
- Insert the 6 blog posts as data rows into `blogs` with `is_published = true`, using existing photos for the covers.
- Newsletter: a new `newsletter` email template in the registry (props: issue title, intro, featured posts, CTA). An admin-only server function verifies the admin role, then queues one email per active subscriber through the existing email queue, with an idempotency key per issue + subscriber. Test send goes to the admin email first.
- Extend `meta()` in PageShell to accept a path, so it can output the page address and the share details.
