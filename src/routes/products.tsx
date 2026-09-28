import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Lead, Split, FeatureGrid, Quote, Faq, EnquireCta, meta } from "@/components/app/PageShell";
import img from "@/assets/hero-harvest.jpg";
import imgP from "@/assets/hero-paddy.jpg";
import imgB from "@/assets/hero-backwater.jpg";
import imgF from "@/assets/parallax-fields.jpg";
import { Wheat, Leaf, HeartHandshake, Truck } from "lucide-react";

export const Route = createFileRoute("/products")({
  head: () => meta("Agri-Aqua Products — PAADI Tales", "Pokkali rice, prawns, fish and village products from Palliyakkal's agri-aqua ecosystem, straight from local producers."),
  component: Products,
});

const ITEMS = [
  { img: imgP, t: "Pokkali Rice", d: "Salt-tolerant heritage red rice with a distinct nutty taste, grown in Palliyakkal's tidal fields.", tag: "1 kg · 5 kg packs" },
  { img: img, t: "Rice Products", d: "Pokkali rice flakes (aval), puttu powder and value-added goods from local women's groups.", tag: "Seasonal" },
  { img: imgB, t: "Fresh Prawns & Fish", d: "Tiger prawns, pearl spot (karimeen) and mullet from the aquaculture season.", tag: "Dec – Apr · Hub counter" },
  { img: imgF, t: "Crafts & Souvenirs", d: "Coir, palm-leaf and bamboo crafts, and PAADI keepsakes made by village families.", tag: "All year" },
];

function Products() {
  return (
    <PageShell bare eyebrow="Gateway 02" title="Agri-Aqua Products" intro="Everything here comes from the same brackish fields — rice in one season, prawns and fish in the next — grown by Palliyakkal farmers." image={img}
      stats={[{ value: "0", label: "Chemical fertiliser" }, { value: "2", label: "Harvests a year" }, { value: "GI", label: "Tagged rice" }, { value: "Local", label: "Producers" }]}>
      <Lead eyebrow="Field to kitchen" title="Honest food from a living wetland">
        <p>Pokkali rice is Geographical Indication–tagged and grown without chemical fertiliser — the tide and the prawn season feed the soil. Every purchase goes back to the farmers and families keeping this system alive.</p>
      </Lead>

      <section className="container mx-auto px-4 max-w-6xl pb-16">
        <div className="grid sm:grid-cols-2 gap-8">
          {ITEMS.map((i, n) => (
            <article key={i.t} className={`group relative overflow-hidden rounded-[2rem] ${n % 3 === 0 ? "sm:row-span-1" : ""}`}>
              <img src={i.img} alt={i.t} loading="lazy" className="h-80 md:h-96 w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
              <div className="absolute bottom-0 p-7 text-primary-foreground">
                <span className="rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-[11px] font-semibold">{i.tag}</span>
                <h3 className="font-display text-3xl mt-3">{i.t}</h3>
                <p className="mt-2 text-sm text-primary-foreground/85 max-w-md">{i.d}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <FeatureGrid tinted cols={4} items={[
        { icon: Wheat, title: "Heritage grain", text: "A centuries-old variety adapted to salt water and floods." },
        { icon: Leaf, title: "Naturally grown", text: "No chemical fertiliser or pesticide in the fields." },
        { icon: HeartHandshake, title: "Fair to farmers", text: "Bought directly from Palliyakkal producers and groups." },
        { icon: Truck, title: "Online soon", text: "Home delivery across Kerala is on the way." },
      ]} />

      <Split image={imgP} eyebrow="Why Pokkali" title="Rich in taste, rich in story" points={["High in fibre and minerals", "Naturally red, lightly nutty flavour", "Great for kanji, puttu and appam"]}>
        <p>Pokkali grains are bold and red, with a flavour shaped by the brackish soil. Locals have long valued it as a light, healing food — perfect for rice porridge and breakfast dishes.</p>
      </Split>
      <Split reverse image={imgB} eyebrow="Aqua season" title="Prawns that grow with the tide">
        <p>After harvest, farmers open the sluices and let the tide carry young prawns and fish into the fields. They feed on rice stubble and grow naturally — then return to the tide or to your table.</p>
      </Split>

      <Quote image={imgF} text="When you buy our rice, you keep the field alive for another year." by="Pokkali producers' group, Palliyakkal" />
      <Faq items={[
        { q: "Can I buy online now?", a: "Online ordering is coming soon. For now, buy at the Village Hub or send us an enquiry for bulk orders." },
        { q: "When are fresh prawns available?", a: "Mainly December to April during the aquaculture season, subject to the day's catch." },
        { q: "Do you supply shops and restaurants?", a: "Yes — contact us with the quantity you need and we'll connect you with producer groups." },
      ]} />
      <EnquireCta text="Want to order Pokkali rice or bulk products? Send us an enquiry." />
    </PageShell>
  );
}

