import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section, InfoCard, meta } from "@/components/app/PageShell";

export const Route = createFileRoute("/visit")({
  head: () => meta("Plan Your Visit — PAADI Tales", "How to reach Pokkali Village at Palliyakkal, Ezhikara, best time to visit and practical tips."),
  component: Visit,
});

function Visit() {
  return (
    <PageShell eyebrow="Practical guide" title="Plan Your Visit" intro="Getting to Pokkali Village and making the most of your day.">
      <div className="grid md:grid-cols-3 gap-5 mb-14">
        <InfoCard title="Getting here">Palliyakkal, Ezhikara, near North Paravur, Ernakulam. About 1 hour from Kochi city and 40 minutes from Cochin Airport.</InfoCard>
        <InfoCard title="Best time">November to May for dry fields and water activities. Mornings and late afternoons are coolest.</InfoCard>
        <InfoCard title="Timings">Visits by prior booking. Please arrive 15 minutes before your tour.</InfoCard>
      </div>
      <Section title="Map">
        <iframe title="Map to Palliyakkal, Ezhikara" className="w-full h-80 rounded-2xl border" loading="lazy" src="https://www.google.com/maps?q=Palliyakkal,Ezhikara,Kerala&output=embed" />
      </Section>
    </PageShell>
  );
}
