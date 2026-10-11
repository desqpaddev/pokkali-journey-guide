import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Section, InfoCard, meta, ORG_JSONLD } from "@/components/app/PageShell";

export const Route = createFileRoute("/visit")({
  staticData: { sitemap: true },
  head: () => meta("Plan Your Visit — Places to Visit Near Kochi | Pokkali Village", "How to reach Pokkali Village at Palliyakkal, Ezhikara — one of the quieter places to visit near Kochi — with timings, best season and a map.", { path: "/visit", crumb: "Plan Your Visit", jsonld: [ORG_JSONLD] }),
  component: Visit,
});

function Visit() {
  return (
    <PageShell eyebrow="Practical guide" title="Plan Your Visit" intro="Getting to Pokkali Village and making the most of your day.">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
        <InfoCard title="Getting here">Palliyakkal, Ezhikara, near North Paravur, Ernakulam. About 1 hour from Kochi city and 40 minutes from Cochin Airport.</InfoCard>
        <InfoCard title="Best time">November to May for dry fields and water activities. Mornings and late afternoons are coolest.</InfoCard>
        <InfoCard title="Make it a day trip"><Link to="/day-trip-from-kochi" className="underline text-primary">See our day trip from Kochi guide</Link> for a full-day plan.</InfoCard>
        <InfoCard title="Timings">Visits by prior booking. Please arrive 15 minutes before your tour.</InfoCard>
      </div>
      <Section title="Map">
        <iframe title="Map to Palliyakkal, Ezhikara" className="w-full h-80 rounded-2xl border" loading="lazy" src="https://www.google.com/maps?q=Palliyakkal,Ezhikara,Kerala&output=embed" />
      </Section>
    </PageShell>
  );
}
