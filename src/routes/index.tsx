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

      {/* TOURS */}
      <section id="tours" className="container mx-auto px-4 py-24">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Choose your circuit</div>
            <h2 className="font-display text-4xl md:text-5xl mt-2">Tours through the grain</h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Half-day strolls, full-day deep dives, or multi-day immersives — every step plants hope for an endangered ecosystem.
          </p>
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
                <Card className="overflow-hidden h-full transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {p.hero_image_url ? (
                      <img src={p.hero_image_url} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <img src={hero} alt="" className="h-full w-full object-cover opacity-80" />
                    )}
                    <Badge className="absolute top-3 left-3 bg-background/90 text-foreground capitalize">
                      {p.category?.replace("-", " ")}
                    </Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                    {p.tagline && <p className="text-sm text-muted-foreground mt-1">{p.tagline}</p>}
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">From</div>
                        <div className="font-display text-2xl">₹{Number(p.price_per_person).toLocaleString()}</div>
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
      </section>

      {/* STORY */}
      <section id="story" className="bg-primary text-primary-foreground py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-secondary font-semibold">Our story</div>
            <h2 className="font-display text-4xl md:text-5xl mt-2">A grain that refused to disappear.</h2>
            <p className="mt-6 text-primary-foreground/90 leading-relaxed">
              Pokkali grows where land meets backwater — salt-tolerant, naturally organic, untouched by pesticides because the brackish water deters pests itself. Low yields once pushed it to the brink of extinction. Today, every visitor plants a sapling, eats a meal, takes home a story — and 70% of every fee goes directly to the farmers reviving this ancient grain.
            </p>
            <p className="mt-4 text-secondary font-display text-xl">
              "Pokkali rises again — not through subsidies, but through the curious feet of travellers like you."
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { stat: "70%", label: "of fee to farmers" },
              { stat: "0", label: "pesticides or fertilizers" },
              { stat: "3", label: "languages of narration" },
              { stat: "100%", label: "community-led" },
            ].map((s) => (
              <div key={s.label} className="bg-primary-foreground/10 rounded-2xl p-6 backdrop-blur">
                <div className="font-display text-4xl text-secondary">{s.stat}</div>
                <div className="text-sm text-primary-foreground/80 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISIT CTA */}
      <section id="visit" className="container mx-auto px-4 py-24 text-center">
        <h2 className="font-display text-4xl md:text-5xl">Ready to plant some hope?</h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Pick a tour, choose your date, and we'll meet you at the jetty with a welcome drink of rice kanji.
        </p>
        <Button asChild size="xl" variant="hero" className="mt-8">
          <Link to="/" hash="tours">Book a tour <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </section>

      <Footer />
    </div>
  );
}
