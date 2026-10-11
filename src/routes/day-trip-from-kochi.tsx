import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Lead, Split, FeatureGrid, Timeline, Faq, EnquireCta, meta } from "@/components/app/PageShell";
import img from "@/assets/hero-backwater.jpg";
import imgP from "@/assets/hero-paddy.jpg";
import imgF from "@/assets/parallax-fields.jpg";
import { Sprout, Sailboat, Utensils, Ship, Car, Plane } from "lucide-react";

const FAQS = [
  { q: "How far is Pokkali Village from Kochi?", a: "Palliyakkal in Ezhikara is roughly an hour by road from Kochi city and about 40 minutes from Cochin International Airport, depending on traffic." },
  { q: "Is this a good day trip from Kochi with kids?", a: "Yes. Families enjoy the farm walk, the country boat and the pedal boats. Kayaking is recommended for ages 12 and up." },
  { q: "What is the best time for a Kochi day trip to the village?", a: "November to May is ideal for dry bunds and calm water. June to October is the green monsoon season, when Pokkali is sown and the fields are lush." },
  { q: "Do I need to book in advance?", a: "Yes, visits are by prior booking so our farmers and guides can be ready for you." },
];

export const Route = createFileRoute("/day-trip-from-kochi")({
  staticData: { sitemap: true },
  head: () =>
    meta(
      "Day Trip from Kochi: Things to Do Near Kochi in a Kerala Village",
      "Plan a day trip from Kochi to Pokkali Village: paddy field walks, kayaking on the backwaters, a country boat ride and Kerala village food — one of the best places to visit near Kochi.",
      {
        path: "/day-trip-from-kochi",
        crumb: "Day Trip from Kochi",
        type: "article",
        jsonld: [{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Day Trip from Kochi: Things to Do Near Kochi in a Kerala Village",
          author: { "@type": "Organization", name: "PAADI Tales — Pokkali Village" },
          mainEntityOfPage: "https://pokkali.in/day-trip-from-kochi",
        }],
      },
    ),
  component: DayTrip,
});

function DayTrip() {
  return (
    <PageShell bare eyebrow="Kochi day trip guide" title="A Day Trip from Kochi to Pokkali Village"
      intro="Looking for things to do in Kochi beyond Fort Kochi and Marine Drive? Spend a day in a living Kerala village — fields, backwaters and food, an hour from the city."
      image={img}
      stats={[{ value: "~1 hr", label: "From Kochi city" }, { value: "~40 min", label: "From the airport" }, { value: "4", label: "Experiences" }, { value: "Nov–May", label: "Best season" }]}>
      <Lead eyebrow="Places to visit near Kochi" title="Swap the city for the fields">
        <p>Palliyakkal, in Ezhikara near North Paravur, is one of the quieter places to visit near Kochi. Here salt-tolerant Pokkali rice and prawns share the same tidal fields, and the backwaters are calm enough for first-time kayakers. It makes an easy, unhurried Kochi day trip.</p>
      </Lead>
      <FeatureGrid tinted cols={4} items={[
        { icon: Sprout, title: "Pokkali farm tour", text: "Walk the paddy field bunds with farmers and hear the Pokkali story at every stop." },
        { icon: Sailboat, title: "Kayaking", text: "A guided paddle through mangrove channels — kayaking near Kochi without the crowds." },
        { icon: Ship, title: "Country boat ride", text: "Glide along the fields in a traditional wooden vallam." },
        { icon: Utensils, title: "Village lunch", text: "Pokkali rice meals and fresh fish at the Village Hub." },
      ]} />
      <Timeline eyebrow="Sample itinerary" title="Your day trip from Kochi, hour by hour" steps={[
        { when: "8:00", title: "Leave Kochi", text: "Drive north towards North Paravur and Ezhikara." },
        { when: "9:00", title: "Farm tour", text: "Guided Pokkali farm walk with GPS audio stories." },
        { when: "12:30", title: "Lunch", text: "Kerala meals with Pokkali rice at the Village Hub." },
        { when: "14:30", title: "On the water", text: "Kayak or country boat through the backwaters." },
        { when: "17:00", title: "Back to Kochi", text: "Pick up Pokkali rice at the counter and head home." },
      ]} />
      <Split image={imgP} eyebrow="Getting here" title="How to reach from Kochi and the airport" points={["By car or taxi from Kochi city: about 1 hour", "From Cochin International Airport: about 40 minutes", "Nearest town: North Paravur"]}>
        <p>Most visitors come by car or taxi. Share your pick-up point when you <Link to="/contact" className="underline text-primary">enquire</Link> and we'll send directions. See <Link to="/visit" className="underline text-primary">Plan Your Visit</Link> for a map.</p>
      </Split>
      <Split reverse image={imgF} eyebrow="Build your day" title="Mix and match experiences">
        <p>Start with the <Link to="/farm-tours" className="underline text-primary">Pokkali farm tour</Link>, add <Link to="/water-sports" className="underline text-primary">kayaking in the backwaters</Link>, and end at the <Link to="/village-hub" className="underline text-primary">Village Hub</Link>. Curious about the rice itself? Read <Link to="/pokkali-story" className="underline text-primary">the Pokkali story</Link>.</p>
      </Split>
      <FeatureGrid cols={2} items={[
        { icon: Car, title: "Self-drive or taxi", text: "Free parking near the Village Hub." },
        { icon: Plane, title: "Flying in or out?", text: "Fits easily around a flight from Cochin airport." },
      ]} />
      <Faq items={FAQS} />
      <EnquireCta text="Ready to plan your day trip from Kochi? Tell us your date and group size." />
    </PageShell>
  );
}
