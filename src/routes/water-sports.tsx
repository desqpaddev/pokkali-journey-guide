import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Lead, Split, FeatureGrid, Quote, Faq, EnquireCta, meta } from "@/components/app/PageShell";
import img from "@/assets/hero-backwater.jpg";
import imgF from "@/assets/parallax-fields.jpg";
import imgP from "@/assets/hero-paddy.jpg";
import { Sailboat, Ship, Waves, Anchor, LifeBuoy, CloudRain, Baby, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/water-sports")({
  staticData: { sitemap: true },
  head: () => meta("Water Sports — PAADI Tales", "Kayaking, country boat rides and backwater activities at Palliyakkal, with safety guidance and booking."),
  component: Water,
});

function Water() {
  return (
    <PageShell bare eyebrow="Gateway 04" title="Water Sports" intro="See Palliyakkal from the water — calm backwater paddles past fields, mangroves and fishing nets." image={img}
      stats={[{ value: "4", label: "Activities" }, { value: "Calm", label: "Backwaters" }, { value: "Trained", label: "Local crew" }, { value: "100%", label: "Life jackets" }]}>
      <Lead eyebrow="On the backwater" title="Glide where the fields meet the tide">
        <p>The channels around Palliyakkal are sheltered and slow — perfect for first-time paddlers and families. Drift past Pokkali fields, mangrove edges, Chinese nets and birds feeding at low tide.</p>
      </Lead>
      <FeatureGrid tinted cols={4} items={[
        { icon: Sailboat, title: "Kayaking", text: "Guided single and double kayaks through quiet channels.", tag: "Ages 12+" },
        { icon: Ship, title: "Country boat", text: "A slow, poled wooden vallam ride along the fields.", tag: "All ages" },
        { icon: Waves, title: "Pedal boats", text: "Easy family fun on sheltered water.", tag: "Families" },
        { icon: Anchor, title: "Sunset cruise", text: "Golden-hour drift with tea and snacks on board.", tag: "Coming soon" },
      ]} />
      <Split image={imgF} eyebrow="Kayak trail" title="A paddle through the mangroves" points={["Short briefing and practice", "45–60 minute guided loop", "Stops for birdwatching and photos"]}>
        <p>Your guide paddles with you, pointing out kingfishers, herons and the tidal sluices that feed the farms. No experience needed.</p>
      </Split>
      <Split reverse image={imgP} eyebrow="Country boat" title="The traditional way to cross the water">
        <p>Before roads, the village moved by boat. Sit back in a wooden country boat while a local boatman poles you gently along the field edges.</p>
      </Split>
      <FeatureGrid items={[
        { icon: LifeBuoy, title: "Life jackets for all", text: "Every guest wears a fitted life jacket — no exceptions." },
        { icon: CloudRain, title: "Weather first", text: "Activities pause in rough weather, strong wind or high tide." },
        { icon: Baby, title: "Children with adults", text: "Kids ride with a parent or guardian at all times." },
        { icon: ShieldCheck, title: "Trained crew", text: "Local operators trained in rescue and first aid." },
      ]} cols={4} />
      <Quote image={img} text="From the water you see how the whole village breathes with the tide." by="Kayak guide, Palliyakkal" />
      <Faq items={[
        { q: "Do I need to know swimming?", a: "No, but tell us if you can't swim. Life jackets are compulsory and guides stay close." },
        { q: "What are the rates and timings?", a: "Rates, timings and online booking will appear here once confirmed. Enquire for now." },
        { q: "Can I combine it with a farm tour?", a: "Yes — a paddle pairs beautifully with the half-day farm tour. Ask us for a combo." },
      ]} />
      <EnquireCta text="Want to book a water activity? Send us your date and group size." />
    </PageShell>
  );
}
