import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section, EnquireCta, InfoCard, meta } from "@/components/app/PageShell";
import img from "@/assets/hero-backwater.jpg";

export const Route = createFileRoute("/water-sports")({
  head: () => meta("Water Sports — PAADI Tales", "Kayaking, country boat rides and backwater activities at Palliyakkal, with safety guidance and booking."),
  component: Water,
});

function Water() {
  return (
    <PageShell eyebrow="Gateway 04" title="Water Sports" intro="See Palliyakkal from the water — calm backwater paddles past fields, mangroves and fishing nets." image={img}>
      <Section title="Activities">
        <p>Rates, timings and online booking will appear here once confirmed.</p>
      </Section>
      <div className="grid md:grid-cols-3 gap-5 mb-14">
        <InfoCard title="Kayaking">Guided paddles through quiet backwater channels.</InfoCard>
        <InfoCard title="Country boat ride">A slow traditional boat trip along the fields.</InfoCard>
        <InfoCard title="Pedal boating">Easy family fun on sheltered water.</InfoCard>
      </div>
      <Section title="Safety">
        <p>Life jackets are required for every guest. Activities stop in rough weather or high tide. Children must be with an adult.</p>
      </Section>
      <EnquireCta text="Want to book a water activity? Send us your date and group size." />
    </PageShell>
  );
}
