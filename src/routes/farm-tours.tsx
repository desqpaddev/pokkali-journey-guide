import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, Lead, Split, FeatureGrid, Timeline, Quote, Faq, EnquireCta, meta } from "@/components/app/PageShell";
import img from "@/assets/hero-paddy.jpg";
import imgB from "@/assets/hero-backwater.jpg";
import imgH from "@/assets/hero-harvest.jpg";
import imgF from "@/assets/parallax-fields.jpg";
import { Clock, Users, ArrowUpRight, Sprout, Headphones, Fish, Sun, Footprints, Utensils } from "lucide-react";

export const Route = createFileRoute("/farm-tours")({
  head: () => meta("Pokkali Farm Tours — PAADI Tales", "Hosted walks through Palliyakkal's Pokkali fields, bunds and backwaters with the farmers who keep them alive."),
  component: FarmTours,
});

function FarmTours() {
  const { data, isLoading } = useQuery({
    queryKey: ["public-packages"],
    queryFn: async () => {
      const { data } = await supabase.from("packages").select("*").eq("is_active", true).order("created_at");
      return (data ?? []).filter((p) => !/trial|new tour/i.test(p.title));
    },
  });
  return (
    <PageShell bare eyebrow="Gateway 01" title="Pokkali Farm Tours" intro="Step onto the bunds of Palliyakkal, where salt-tolerant Pokkali rice and prawn farming share the same water through the seasons." image={img}
      stats={[{ value: "3–4", label: "Hours on the farm" }, { value: "15", label: "Story stops" }, { value: "2", label: "Farming seasons" }, { value: "100%", label: "Chemical-free fields" }]}>
      <Lead eyebrow="A hosted village walk" title="Walk the fields with the people who farm them">
        <p>A local guide leads you along narrow bunds, past sluice gates and prawn ponds, into the working life of a Pokkali farm. At every stop, the PAADI app plays a short audio story in English or Malayalam — so the land speaks for itself.</p>
      </Lead>

      <FeatureGrid tinted items={[
        { icon: Footprints, title: "Guided bund walk", text: "Walk the raised earthen paths that divide the tidal fields, with a guide from the village." },
        { icon: Headphones, title: "Audio stories", text: "GPS-triggered stories play automatically as you reach each stop on the route." },
        { icon: Sprout, title: "Hands in the soil", text: "Try seed mounding, transplanting or harvesting, depending on the season." },
        { icon: Fish, title: "Prawn filtration", text: "See how farmers trap prawns and fish with the tide using traditional sluices." },
        { icon: Utensils, title: "Village lunch", text: "Pokkali rice meal with local catch at the Village Hub (on selected packages)." },
        { icon: Sun, title: "Golden-hour views", text: "Morning and late-afternoon slots for soft light over water and paddy." },
      ]} />

      <section className="container mx-auto px-4 max-w-6xl py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="uppercase tracking-[0.3em] text-[11px] text-accent font-medium">Book online</p>
            <h2 className="font-display text-3xl md:text-5xl mt-2">Choose your experience</h2>
          </div>
          <p className="text-muted-foreground max-w-sm">Every tour is small-group and led by a local host. Prices are per person.</p>
        </div>
        {isLoading ? (
          <p className="text-muted-foreground">Loading experiences…</p>
        ) : !data?.length ? (
          <p className="text-muted-foreground">New experiences are being prepared. Please enquire for a visit.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {data.map((p) => (
              <Link key={p.id} to="/packages/$slug" params={{ slug: p.slug }} className="group relative rounded-[1.75rem] overflow-hidden bg-card border hover:shadow-2xl transition duration-500 hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={p.hero_image_url || img} alt={p.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
                  <span className="absolute top-4 left-4 rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-xs font-semibold">₹{p.price_per_person} / person</span>
                  <span className="absolute bottom-4 right-4 h-11 w-11 rounded-full bg-background text-foreground grid place-items-center transition group-hover:rotate-45"><ArrowUpRight className="h-5 w-5" /></span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl leading-snug">{p.title}</h3>
                  {p.tagline && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.tagline}</p>}
                  <div className="mt-5 pt-5 border-t flex gap-5 text-xs text-muted-foreground">
                    {p.duration_hours && <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-accent" />{p.duration_hours} hrs</span>}
                    {p.max_group_size && <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-accent" />Up to {p.max_group_size}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Timeline eyebrow="Your half day" title="How the visit unfolds" steps={[
        { when: "Arrival", title: "Welcome at the Hub", text: "Tender coconut, a short briefing and your audio guide set up." },
        { when: "Hour 1", title: "Into the fields", text: "Walk the bunds, meet farmers and see Pokkali rice up close." },
        { when: "Hour 2", title: "Water & tools", text: "Sluice gates, prawn traps and the traditional tools of the trade." },
        { when: "Finish", title: "Taste & take home", text: "A Pokkali meal and a stop at the produce counter." },
      ]} />

      <Split image={imgH} eyebrow="Seasonal" title="Every season tells a different story" points={["Jun – Oct: seed mounds, sowing and green rice fields", "Nov – Dec: harvest of tall Pokkali stalks", "Dec – Apr: prawn and fish farming in the same fields"]}>
        <p>Pokkali land never rests. Come in the monsoon to see rice rise from the brackish water, or in the dry months to watch the tide feed the prawn season. Your guide adapts the route to what the fields are doing that week.</p>
      </Split>
      <Split reverse image={imgB} eyebrow="Groups" title="Schools, researchers & corporate teams">
        <p>We host student field trips, agriculture and ecology study groups, and team-building days. Tell us your group size and interests and we'll shape a custom itinerary, with bilingual guides and certificates on request.</p>
      </Split>

      <Quote image={imgF} text="The water comes and goes with the moon. We just learned to farm with it." by="A Palliyakkal farmer" />

      <Faq items={[
        { q: "What should I wear and bring?", a: "Light clothes that can get muddy, a hat, sunscreen, a water bottle and slip-on footwear. We provide drinking water on the route." },
        { q: "Is it suitable for children and seniors?", a: "Yes, with care. The bunds are narrow and uneven, so tell us your needs when booking and we'll suggest an easier route." },
        { q: "Do tours run in the rain?", a: "Light rain is part of the experience. In heavy monsoon or flooding, we'll reschedule at no charge." },
        { q: "Do I need an account to book?", a: "Yes — sign in, and once your account is approved you can book and unlock the audio tour on the day." },
      ]} />
      <EnquireCta text="Planning a group, school or custom visit? Talk to us." />
    </PageShell>
  );
}
