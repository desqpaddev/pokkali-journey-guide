import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Lead, Split, FeatureGrid, Quote, Faq, EnquireCta, meta } from "@/components/app/PageShell";
import img from "@/assets/parallax-fields.jpg";
import imgH from "@/assets/hero-harvest.jpg";
import imgB from "@/assets/hero-backwater.jpg";
import imgP from "@/assets/hero-paddy.jpg";
import { Utensils, Fish, Gift, Info, Car, Coffee, Wifi, Baby } from "lucide-react";

export const Route = createFileRoute("/village-hub")({
  staticData: { sitemap: true },
  head: () => meta("Village Hub — PAADI Tales", "The visitor centre of Pokkali Village: restaurant, fish and agri-aqua sales counter, souvenirs and visitor services."),
  component: Hub,
});

function Hub() {
  return (
    <PageShell bare eyebrow="Gateway 03" title="Village Hub" intro="The heart of your visit — eat, shop and rest at the visitor centre of Pokkali Village." image={img}
      stats={[{ value: "1", label: "Place to start" }, { value: "4", label: "Core services" }, { value: "Kerala", label: "Home kitchen" }, { value: "Free", label: "Parking" }]}>
      <Lead eyebrow="Where every tour begins" title="A welcoming stop by the fields">
        <p>Run with the local community and the Palliyakkal Service Co-operative Bank, the Hub is where you check in, meet your guide, share a meal and pick up fresh produce before heading home.</p>
      </Lead>
      <FeatureGrid tinted cols={4} items={[
        { icon: Utensils, title: "Restaurant", text: "Kerala meals with Pokkali rice, fish curry and seasonal sides." },
        { icon: Fish, title: "Fish & produce", text: "Fresh prawns, fish and agri-aqua products direct from farmers." },
        { icon: Gift, title: "Souvenir shop", text: "Local crafts, rice packs and PAADI keepsakes." },
        { icon: Info, title: "Visitor desk", text: "Check-in, audio guide help and local information." },
      ]} />
      <Split image={imgH} eyebrow="The kitchen" title="Lunch the way the village eats it" points={["Pokkali rice meals on banana leaf", "Karimeen (pearl spot) fry & prawn roast", "Group and pre-booked meals available"]}>
        <p>Our cooks are women from Palliyakkal families. The menu follows the season and the catch, so each visit tastes a little different.</p>
      </Split>
      <Split reverse image={imgB} eyebrow="The counter" title="Take the village home">
        <p>Buy the same rice you walked through and prawns from that morning's catch. The counter also stocks rice flakes, pickles and handmade crafts from local groups.</p>
      </Split>
      <section className="container mx-auto px-4 max-w-6xl py-14">
        <h2 className="font-display text-3xl md:text-4xl text-center mb-10">Comforts on site</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ i: Car, t: "Parking" }, { i: Coffee, t: "Tea & snacks" }, { i: Wifi, t: "Rest area" }, { i: Baby, t: "Family friendly" }].map(({ i: I, t }) => (
            <div key={t} className="rounded-2xl border bg-card p-6 text-center"><I className="h-6 w-6 mx-auto text-accent" /><p className="mt-3 text-sm font-medium">{t}</p></div>
          ))}
        </div>
      </section>
      <Quote image={imgP} text="Come hungry, leave with a bag of rice and a story." by="Village Hub team" />
      <Faq items={[
        { q: "What are the opening hours?", a: "Hub timings and meal rates will be published once confirmed. Please enquire before visiting." },
        { q: "Can I visit the Hub without a tour?", a: "Yes, the restaurant and counter are open to all visitors during opening hours." },
        { q: "Can you host large groups?", a: "Yes, with advance notice. Share your group size and date and we'll arrange seating and meals." },
      ]} />
      <EnquireCta text="Reserve a group meal or ask about Hub services." />
    </PageShell>
  );
}
