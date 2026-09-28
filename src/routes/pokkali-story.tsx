import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/app/PageShell";
import { meta } from "@/components/app/PageShell";
import { Button } from "@/components/ui/button";
import img from "@/assets/about-paddy-3d.jpg";

export const Route = createFileRoute("/pokkali-story")({
  head: () => meta("The Pokkali Story — PAADI Tales", "How Pokkali rice and aquaculture share Kerala's tidal fields: the seasons, traditional knowledge, ecology and the farmers of Palliyakkal."),
  component: Story,
});

function Story() {
  return (
    <PageShell eyebrow="The foundation" title="The Pokkali Story" intro="A rice that grows in salt water, and a farming system where land and backwater take turns." image={img}>
      <Section title="A rice that tolerates salt">
        <p>Pokkali is a traditional rice variety grown in the low-lying coastal wetlands of central Kerala. Its tall plants survive tidal, brackish water where most rice cannot grow.</p>
      </Section>
      <Section title="Rice and prawns, season by season">
        <p>From roughly June to October, during the monsoon, the fields are used for rice. After the harvest, tidal water is let in and the same fields support prawn and fish farming until the next rice season.</p>
      </Section>
      <Section title="Traditional knowledge">
        <p>Farmers build mounds, manage sluice gates with the tides, and select seed by hand — knowledge passed down through generations.</p>
      </Section>
      <Section title="Why it matters">
        <p>The system uses no chemical fertiliser, supports wetland biodiversity, and sustains livelihoods for farming and fishing families.</p>
      </Section>
      <Section title="Palliyakkal today">
        <p>In Palliyakkal, farmers, the co-operative bank and the community are working to keep Pokkali alive — and PAADI Tales invites you to see it for yourself.</p>
      </Section>
      <Button asChild size="lg" className="rounded-full"><Link to="/farm-tours">Experience it on a farm tour</Link></Button>
    </PageShell>
  );
}
