import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section, EnquireCta, meta } from "@/components/app/PageShell";
import img from "@/assets/parallax-fields.jpg";

export const Route = createFileRoute("/about")({
  staticData: { sitemap: true },
  head: () => meta("About Palliyakkal — Responsible Eco Tourism in Kerala | PAADI Tales", "Community-led, responsible eco tourism in Kerala: a village tour of Palliyakkal, Ezhikara, run with its farmers and the Palliyakkal Service Co-operative Bank.", { path: "/about", crumb: "About" }),
  component: About,
});

function About() {
  return (
    <PageShell eyebrow="The people & place" title="About Palliyakkal" intro="A farming and fishing community in Ezhikara, living with the rhythm of the tides." image={img}>
      <Section title="The place">
        <p>Palliyakkal lies in Ezhikara, in the backwater belt of Ernakulam district, Kerala — a landscape of Pokkali fields, canals and mangroves.</p>
      </Section>
      <Section title="PAADI Tales and Pokkali Village">
        <p>PAADI Tales — Palliyakkal Agri-Aqua Digital Immersive Tales — is the experience brand for Pokkali Village: farm tours, products, the Village Hub and water sports, all rooted in the Pokkali story.</p>
      </Section>
      <Section title="Palliyakkal Service Co-operative Bank">
        <p>PSCB operates PAADI Tales together with local farmers, producers and service providers, so that tourism income supports the community — responsible tourism in Kerala, where every village tour helps keep Pokkali farming alive.</p>
      </Section>
      <EnquireCta text="Want to partner with us or learn more about the project?" />
    </PageShell>
  );
}
