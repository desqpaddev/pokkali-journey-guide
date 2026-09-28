import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section, EnquireCta, InfoCard, meta } from "@/components/app/PageShell";
import img from "@/assets/parallax-fields.jpg";

export const Route = createFileRoute("/village-hub")({
  head: () => meta("Village Hub — PAADI Tales", "The visitor centre of Pokkali Village: restaurant, fish and agri-aqua sales counter, souvenirs and visitor services."),
  component: Hub,
});

function Hub() {
  return (
    <PageShell eyebrow="Gateway 03" title="Village Hub" intro="The heart of your visit — eat, shop and rest at the visitor centre of Pokkali Village." image={img}>
      <Section title="Services at the Hub">
        <p>Your tour starts and ends here. Rates and timings will be published once confirmed.</p>
      </Section>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
        <InfoCard title="Restaurant">Traditional Kerala meals featuring Pokkali rice and fresh local catch.</InfoCard>
        <InfoCard title="Fish & produce counter">Buy fresh prawns, fish and agri-aqua products.</InfoCard>
        <InfoCard title="Souvenir shop">Local crafts and Pokkali products to take home.</InfoCard>
        <InfoCard title="Visitor services">Information desk, restrooms, parking and rest area.</InfoCard>
      </div>
      <EnquireCta text="Reserve a group meal or ask about Hub services." />
    </PageShell>
  );
}
