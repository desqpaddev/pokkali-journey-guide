import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section, EnquireCta, InfoCard, meta } from "@/components/app/PageShell";
import img from "@/assets/hero-harvest.jpg";

export const Route = createFileRoute("/products")({
  head: () => meta("Agri-Aqua Products — PAADI Tales", "Pokkali rice, prawns, fish and village products from Palliyakkal's agri-aqua ecosystem, straight from local producers."),
  component: Products,
});

const ITEMS = [
  { t: "Pokkali Rice", d: "Salt-tolerant heritage rice grown in Palliyakkal's tidal fields." },
  { t: "Pokkali Rice Products", d: "Flakes, powder and value-added goods from local groups." },
  { t: "Fresh Prawns & Fish", d: "From the aquaculture season in the same fields — at the Village Hub counter." },
  { t: "Village Crafts & Souvenirs", d: "Handmade goods by Palliyakkal families." },
];

function Products() {
  return (
    <PageShell eyebrow="Gateway 02" title="Agri-Aqua Products" intro="Everything here comes from the same brackish fields — rice in one season, prawns and fish in the next — grown by Palliyakkal farmers." image={img}>
      <Section title="From field to your kitchen">
        <p>Every purchase supports the farmers and producers keeping the Pokkali system alive. Online ordering is coming soon; until then, products are available at the Village Hub or by enquiry.</p>
      </Section>
      <div className="grid sm:grid-cols-2 gap-5 mb-14">
        {ITEMS.map((i) => <InfoCard key={i.t} title={i.t}>{i.d}<div className="mt-3 text-xs font-medium text-primary">Available at Village Hub · Enquire</div></InfoCard>)}
      </div>
      <EnquireCta text="Want to order Pokkali rice or bulk products? Send us an enquiry." />
    </PageShell>
  );
}
