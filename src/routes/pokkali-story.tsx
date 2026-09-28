import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Lead, Split, FeatureGrid, Timeline, Quote, EnquireCta, meta } from "@/components/app/PageShell";
import img from "@/assets/about-paddy-3d.jpg";
import imgP from "@/assets/hero-paddy.jpg";
import imgB from "@/assets/hero-backwater.jpg";
import imgH from "@/assets/hero-harvest.jpg";
import imgF from "@/assets/parallax-fields.jpg";
import { Bird, Droplets, Leaf, Users, Recycle, Shield } from "lucide-react";

export const Route = createFileRoute("/pokkali-story")({
  head: () => meta("The Pokkali Story — PAADI Tales", "How Pokkali rice and aquaculture share Kerala's tidal fields: the seasons, traditional knowledge, ecology and the farmers of Palliyakkal."),
  component: Story,
});

function Story() {
  return (
    <PageShell bare eyebrow="The foundation" title="The Pokkali Story" intro="A rice that grows in salt water, and a farming system where land and backwater take turns." image={img}
      stats={[{ value: "3000+", label: "Years of tradition" }, { value: "2m", label: "Tall rice plants" }, { value: "GI", label: "Tag since 2008" }, { value: "1", label: "Field, two harvests" }]}>
      <Lead eyebrow="Chapter one" title="A rice that refused to drown">
        <p>Along the coastal wetlands of central Kerala, where seawater meets the backwaters, most crops fail. Pokkali thrives. Its tall stalks rise above floods and tolerate salt — a gift of generations of careful seed selection by Kerala's farmers.</p>
      </Lead>
      <Split image={imgP} eyebrow="Chapter two" title="Mounds, seeds and the monsoon" points={["Farmers raise earthen mounds as the rains wash salt away", "Sprouted seeds are sown on the mounds", "Seedlings are spread across the field once strong"]}>
        <p>Pokkali cultivation begins when the monsoon rains flush the salt from the fields. It is labour of the hands — no tractors fit on these soft, tidal lands.</p>
      </Split>
      <Timeline eyebrow="Chapter three" title="The year of a Pokkali field" steps={[
        { when: "Apr – May", title: "Preparing the mounds", text: "Fields drained, mounds built, rain awaited." },
        { when: "Jun – Jul", title: "Sowing", text: "Sprouted seeds planted with the monsoon." },
        { when: "Oct – Nov", title: "Harvest", text: "Only the panicles are cut; stalks stay to rot and feed the soil." },
        { when: "Dec – Apr", title: "Prawn season", text: "Tide let in; prawns and fish grow on the stubble." },
      ]} />
      <Split reverse image={imgB} eyebrow="Chapter four" title="The tide as a partner">
        <p>Sluice gates called <em>thoombu</em> are opened and closed with the moon and tide. Young prawns drift in, feed on the decaying rice stalks, and their waste in turn fertilises the next rice crop. It is a circle with nothing wasted.</p>
      </Split>
      <FeatureGrid tinted items={[
        { icon: Leaf, title: "No chemicals", text: "The field feeds itself — no synthetic fertiliser or pesticide." },
        { icon: Recycle, title: "Zero waste", text: "Rice feeds prawns, prawns feed rice." },
        { icon: Bird, title: "Wetland life", text: "Home to migratory birds, crabs, fish and mangroves." },
        { icon: Droplets, title: "Climate resilient", text: "Survives floods and rising salinity better than modern varieties." },
        { icon: Shield, title: "Natural flood buffer", text: "Wetlands soak up floodwater that would reach homes." },
        { icon: Users, title: "Livelihoods", text: "Supports farming and fishing families together." },
      ]} />
      <Quote image={imgF} text="Pokkali is not just a crop. It is how our grandparents made peace with the sea." by="Elder farmer, Palliyakkal" />
      <Split image={imgH} eyebrow="Chapter five" title="Palliyakkal today">
        <p>Across Kerala, Pokkali fields have shrunk as labour costs rise and land is converted. In Palliyakkal, farmers, the Service Co-operative Bank and the community are fighting back — reviving fields, creating fair markets, and opening the village to visitors through PAADI Tales.</p>
        <p>Every farm tour, every packet of rice, every meal at the Hub helps keep a field alive for another season.</p>
      </Split>
      <EnquireCta text="See the story for yourself on a Pokkali farm tour." to="/farm-tours" label="Explore tours" />
    </PageShell>
  );
}
