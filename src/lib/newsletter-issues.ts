export type NewsletterIssue = {
  id: string;
  subject: string;
  title: string;
  intro: string;
  posts: { title: string; slug: string; blurb: string }[];
  cta: { label: string; path: string };
};

export const NEWSLETTER_ISSUES: NewsletterIssue[] = [
  {
    id: "issue-1-pokkali-story",
    subject: "🌾 The Pokkali Story — Kerala's salt-tolerant rice",
    title: "The Pokkali Story",
    intro: "This month we look at Pokkali rice — the salt-tolerant red rice of Kerala that grows where the river meets the sea — and what makes it so special.",
    posts: [
      { title: "Pokkali Rice: Benefits of Kerala's Salt-Tolerant Grain", slug: "pokkali-rice-benefits-salt-tolerant-rice-kerala", blurb: "How Pokkali survives salt water, and why it is grown without chemicals." },
      { title: "Red Rice of Kerala vs Pokkali: What's the Difference?", slug: "red-rice-kerala-vs-pokkali", blurb: "Matta, Navara and Pokkali compared — plus where to buy Pokkali rice." },
    ],
    cta: { label: "Book a Pokkali farm tour", path: "/farm-tours" },
  },
  {
    id: "issue-2-kochi-day-trips",
    subject: "🚣 Day trips & backwaters from Kochi",
    title: "Day Trips & Backwaters from Kochi",
    intro: "Looking for things to do in Kochi beyond the city? Spend a day in the fields and on the quiet backwaters of Palliyakkal, an hour away.",
    posts: [
      { title: "Things to Do in Kochi: A Village Day Trip Locals Love", slug: "things-to-do-in-kochi-village-day-trip", blurb: "One of the best places to visit near Kochi, with a sample day plan." },
      { title: "Kayaking in Kochi: Paddling the Quiet Kerala Backwaters", slug: "kayaking-in-kochi-kerala-backwaters", blurb: "A beginner-friendly kayak trail through mangroves and Pokkali fields." },
    ],
    cta: { label: "Plan your day trip from Kochi", path: "/day-trip-from-kochi" },
  },
  {
    id: "issue-3-eco-travel-kerala",
    subject: "🌿 Eco travel in Kerala — fields, nets and the tide",
    title: "Eco Travel in Kerala",
    intro: "Responsible tourism in Kerala means visiting places that benefit from you. Here's how a village tour at Palliyakkal does exactly that.",
    posts: [
      { title: "Eco Tourism in Kerala: Walking the Paddy Fields of a Living Village", slug: "eco-tourism-kerala-paddy-fields-village", blurb: "A paddy field walk run with local farmers and the co-operative bank." },
      { title: "Chinese Fishing Nets of Kochi and the Village Nets of Palliyakkal", slug: "chinese-fishing-nets-kochi-village-nets", blurb: "How the famous nets work — and where to see their village cousins." },
    ],
    cta: { label: "Explore water sports", path: "/water-sports" },
  },
];
