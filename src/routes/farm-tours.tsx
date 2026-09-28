import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, Section, EnquireCta, InfoCard, meta } from "@/components/app/PageShell";
import img from "@/assets/hero-paddy.jpg";
import { Clock, Users } from "lucide-react";

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
    <PageShell eyebrow="Gateway 01" title="Pokkali Farm Tours" intro="Step onto the bunds of Palliyakkal, where salt-tolerant Pokkali rice and prawn farming share the same water through the seasons." image={img}>
      <Section title="What a hosted visit includes">
        <p>A local guide walks you through the fields, explains the seasonal rice–aquaculture cycle, and introduces you to the farmers and their tools. Audio stories play at each stop through the PAADI app.</p>
      </Section>
      <h2 className="font-display text-2xl md:text-3xl mb-6">Choose your experience</h2>
      {isLoading ? (
        <p className="text-muted-foreground">Loading experiences…</p>
      ) : !data?.length ? (
        <p className="text-muted-foreground">New experiences are being prepared. Please enquire for a visit.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {data.map((p) => (
            <Link key={p.id} to="/packages/$slug" params={{ slug: p.slug }} className="group rounded-2xl overflow-hidden border bg-card hover:shadow-xl transition">
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                <img src={p.hero_image_url || img} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl">{p.title}</h3>
                {p.tagline && <p className="text-sm text-muted-foreground mt-1">{p.tagline}</p>}
                <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                  {p.duration_hours && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{p.duration_hours} hrs</span>}
                  {p.max_group_size && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />Up to {p.max_group_size}</span>}
                </div>
                <div className="mt-4 font-semibold">₹{p.price_per_person} <span className="text-xs font-normal text-muted-foreground">per person</span></div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-5 mb-14">
        <InfoCard title="What to bring">Hat, sunscreen, water bottle, clothes that can get muddy, and slip-on footwear.</InfoCard>
        <InfoCard title="Weather">Tours run in the dry months; monsoon visits depend on field conditions.</InfoCard>
        <InfoCard title="Accessibility">Bunds are narrow and uneven. Tell us your needs and we'll suggest a suitable route.</InfoCard>
      </div>
      <EnquireCta text="Planning a group, school or custom visit? Talk to us." />
    </PageShell>
  );
}
