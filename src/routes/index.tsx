import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header, Footer } from "@/components/app/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wheat, Compass, Headphones, ScanLine, ArrowRight, Tractor, Sprout, ShoppingBasket, Check, Leaf, Sun, Droplets } from "lucide-react";
import hero from "@/assets/hero-paddy.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pokkali Village — Heritage Circuit Tours in Kerala" },
      { name: "description", content: "GPS-guided immersive tours through Kerala's Pokkali paddy heritage. Book half-day, full-day & multi-day journeys." },
      { property: "og:title", content: "Pokkali Village — Heritage Circuit Tours" },
      { property: "og:description", content: "Walk the fields. Ride the waters. Taste the story." },
      { property: "og:image", content: hero },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: packages } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("is_active", true)
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO — Agrion style: full-bleed image, giant centered word, pill CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/55 via-primary/30 to-primary/70" />
        </div>
        <div className="relative container mx-auto px-4 pt-20 md:pt-28 pb-12 md:pb-16 text-primary-foreground text-center min-h-[88vh] flex flex-col items-center justify-center">
          <div className="relative inline-block">
            <p className="font-display italic text-lg md:text-2xl tracking-wide">
              We are Producing Natural Products
            </p>
            <svg viewBox="0 0 300 12" className="mx-auto mt-1 h-2 w-56 md:w-72 text-secondary" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M5 7 Q 75 1 150 6 T 295 5" />
            </svg>
          </div>
          <h1 className="font-display font-semibold mt-6 leading-[0.95] text-[18vw] md:text-[12rem] tracking-tight text-balance">
            Pokkali<span className="text-secondary">.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base md:text-lg text-primary-foreground/90">
            Immersive heritage circuit tours through Kerala's last salt-tolerant paddy fields.
          </p>
          <div className="mt-8">
            <Button asChild variant="hero" className="rounded-full h-14 pl-7 pr-2 text-base bg-primary text-primary-foreground hover:bg-primary">
              <Link to="/" hash="tours">
                Discover More
                <span className="ml-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
            </Button>
          </div>

          {/* In-hero feature strip */}
          <div className="mt-16 md:mt-20 w-full border-t border-primary-foreground/20 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              { icon: Tractor, title: "The Best Quality Standards" },
              { icon: Sprout, title: "A Smart Organic Service" },
              { icon: ShoppingBasket, title: "Natural Healthy Products" },
            ].map((f) => (
              <div key={f.title} className="flex items-center gap-4">
                <f.icon className="h-12 w-12 shrink-0 text-secondary" strokeWidth={1.25} />
                <div className="font-display uppercase tracking-wider text-base md:text-lg leading-tight">
                  {f.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-feature row */}
      <section className="container mx-auto px-4 py-14">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Compass, title: "GPS-guided journey", body: "Your tour unfolds as you walk. Stories play at each stop, automatically." },
            { icon: Headphones, title: "English · हिन्दी · മലയാളം", body: "Heritage narration in three languages — choose yours at the start." },
            { icon: ScanLine, title: "Scan to learn", body: "Scan products at every stop to hear their story and take Pokkali home." },
          ].map((f) => (
            <Card key={f.title} className="p-6 border-l-4 border-l-secondary">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-display font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ABOUT — Agrion "Get to Know" style */}
      <section className="container mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-sm font-display italic text-primary">Get to Know Pokkali</div>
          <h2 className="font-display text-4xl md:text-5xl mt-2 leading-tight uppercase">
            We grow the agriculture<br />and organic farm
          </h2>
          <p className="text-primary font-medium mt-6">
            We've revived 20+ years of vanishing Pokkali heritage.
          </p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Pokkali grows where land meets backwater — salt-tolerant, naturally organic, untouched by pesticides because the brackish water deters pests itself. Every visitor plants a sapling and 70% of every fee goes directly to the farmers reviving this ancient grain.
          </p>
          <ul className="mt-6 space-y-2">
            {["Zero pesticides — brackish water keeps pests away.", "Heritage rice grown for over 3,000 years."].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-5">
            <Button asChild variant="default" className="rounded-full h-12 pl-6 pr-2 bg-primary hover:bg-primary">
              <Link to="/" hash="tours">
                Explore Tours
                <span className="ml-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-secondary/30 ring-2 ring-secondary grid place-items-center text-primary font-display font-bold">PV</div>
              <div className="text-xs leading-tight">
                <div className="font-semibold">The Pokkali Farmers</div>
                <div className="text-muted-foreground">Custodians of the grain</div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <img src={hero} alt="Pokkali paddy" className="rounded-3xl aspect-[4/5] object-cover w-full" />
          <div className="absolute -bottom-6 -left-6 bg-secondary text-secondary-foreground rounded-2xl p-5 shadow-xl">
            <div className="font-display text-3xl font-bold leading-none">20+</div>
            <div className="text-xs uppercase tracking-wider mt-1">Years of<br />Heritage Revival</div>
          </div>
          <div className="hidden md:block absolute -top-6 -right-6 h-24 w-24 rounded-full bg-primary text-secondary grid place-items-center ring-8 ring-background">
            <Leaf className="h-10 w-10" />
          </div>
        </div>
      </section>

      {/* TOURS — "Services We're Offering" style */}
      <section id="tours" className="bg-muted/40 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="text-sm font-display italic text-primary">What We're Offering</div>
          <h2 className="font-display text-4xl md:text-5xl mt-2 uppercase">Tours through the grain</h2>
        </div>

        {!packages?.length ? (
          <Card className="p-12 text-center text-muted-foreground">
            <Wheat className="h-8 w-8 mx-auto text-accent" />
            <p className="mt-3">Tours are being prepared. Check back soon, or visit the admin to add packages.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((p) => (
              <Link
                key={p.id}
                to="/packages/$slug"
                params={{ slug: p.slug }}
                className="group"
              >
                <Card className="overflow-hidden h-full transition-all hover:shadow-2xl hover:-translate-y-1 border-0 rounded-2xl bg-background">
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {p.hero_image_url ? (
                      <img src={p.hero_image_url} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <img src={hero} alt="" className="h-full w-full object-cover opacity-80" />
                    )}
                    <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground capitalize border-none">
                      {p.category?.replace("-", " ")}
                    </Badge>
                    <span className="absolute -bottom-5 right-5 h-10 w-10 rounded-full bg-secondary text-secondary-foreground grid place-items-center shadow-lg group-hover:bg-primary group-hover:text-secondary transition">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold uppercase">{p.title}</h3>
                    {p.tagline && <p className="text-sm text-muted-foreground mt-1">{p.tagline}</p>}
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">From</div>
                        <div className="font-display text-2xl text-primary">₹{Number(p.price_per_person).toLocaleString()}</div>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        {p.duration_hours ? `${p.duration_hours}h` : ""}<br />
                        {p.min_group_size}–{p.max_group_size} guests
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
      </section>

      {/* DARK CTA BANNER */}
      <section id="story" className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="text-sm font-display italic text-secondary">We're Selling Heritage Heritage</div>
          <h2 className="font-display text-4xl md:text-5xl mt-2 max-w-3xl mx-auto uppercase leading-tight">
            Unbeatable Organic and Pokkali Experiences
          </h2>
          <div className="mt-8">
            <Button asChild className="rounded-full h-14 pl-7 pr-2 text-base bg-primary border border-primary-foreground/20 hover:bg-primary">
              <Link to="/" hash="tours">
                Discover More
                <span className="ml-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* HEALTHY FOOD 3-icon row */}
      <section className="container mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-sm font-display italic text-primary">Pure Organic Food</div>
          <h2 className="font-display text-4xl md:text-5xl mt-2 uppercase leading-tight">
            Healthy food for your good growth
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md">
            Every grain of Pokkali tells a story — of brackish backwaters, monsoon tides, and farmers who refused to let it disappear.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Sprout, label: "Sowing" },
            { icon: Sun, label: "Growing" },
            { icon: Droplets, label: "Harvest" },
          ].map((s) => (
            <div key={s.label} className="bg-background border rounded-2xl p-5 text-center hover:bg-primary hover:text-primary-foreground group transition">
              <div className="mx-auto h-14 w-14 rounded-full bg-secondary/20 text-primary group-hover:bg-secondary group-hover:text-secondary-foreground grid place-items-center transition">
                <s.icon className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <div className="font-display mt-3 uppercase text-sm tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS COUNTERS */}
      <section className="bg-muted/40 border-y">
        <div className="container mx-auto px-4 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: "70%", label: "Fee to Farmers" },
            { stat: "20+", label: "Years Heritage" },
            { stat: "3", label: "Languages" },
            { stat: "100%", label: "Community-Led" },
          ].map((s) => (
            <div key={s.label}>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary/30 text-primary mx-auto">
                <Leaf className="h-5 w-5" />
              </div>
              <div className="font-display text-5xl text-primary mt-3 font-semibold">{s.stat}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SPLIT YELLOW/GREEN BANNER */}
      <section id="visit" className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-[1fr_auto_1fr] items-center rounded-3xl overflow-hidden shadow-xl">
          <div className="bg-secondary text-secondary-foreground p-10 md:p-14">
            <div className="font-display text-3xl md:text-4xl uppercase font-semibold">Heritage Tours</div>
          </div>
          <div className="grid place-items-center bg-background py-6 md:py-0">
            <Button asChild className="h-20 w-20 rounded-full bg-primary hover:bg-primary text-secondary p-0">
              <Link to="/" hash="tours" aria-label="Book"><ArrowRight className="h-7 w-7" /></Link>
            </Button>
          </div>
          <div className="bg-primary text-primary-foreground p-10 md:p-14 text-right">
            <div className="text-sm text-secondary">Reservations</div>
            <div className="font-display text-2xl md:text-3xl mt-1">+91 484 000 0000</div>
            <div className="text-xs text-primary-foreground/70 mt-1">hello@pokkalivillage.in</div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
