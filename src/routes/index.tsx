import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header, Footer } from "@/components/app/Header";
import { HeroSlider } from "@/components/app/HeroSlider";
import { TourGlobe } from "@/components/app/TourGlobe";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wheat, Compass, Headphones, ScanLine, ArrowRight, Sprout, Check, Leaf, Sun, Droplets } from "lucide-react";
import hero from "@/assets/hero-paddy.jpg";
import parallaxImg from "@/assets/parallax-fields.jpg";
import aboutImg from "@/assets/about-paddy-3d.jpg";
import { useRef, useState } from "react";

function Tilt3DCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setT({ ry: (px - 0.5) * 18, rx: -(py - 0.5) * 18, mx: px * 100, my: py * 100 });
  };
  const reset = () => setT({ rx: 0, ry: 0, mx: 50, my: 50 });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="relative [perspective:1400px] group"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        className="relative transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Soft shadow plate */}
        <div
          className="absolute inset-0 rounded-[2rem] bg-primary/30 blur-3xl"
          style={{ transform: "translateZ(-80px) scale(0.92)" }}
          aria-hidden
        />

        {/* Main image card */}
        <div
          className="relative rounded-[2rem] overflow-hidden ring-1 ring-primary/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)]"
          style={{ transform: "translateZ(0px)" }}
        >
          <img
            src={aboutImg}
            alt="Pokkali farmer wading through brackish paddy waters at sunrise"
            loading="lazy"
            width={1080}
            height={1600}
            className="aspect-[4/5] w-full object-cover scale-110 transition-transform duration-700 group-hover:scale-100"
          />
          {/* Light sheen tracking the cursor */}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-80 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${t.mx}% ${t.my}%, rgba(255,255,255,0.55), transparent 45%)`,
            }}
          />
          {/* Bottom vignette */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/40 to-transparent" />
        </div>

        {/* Floating 20+ badge */}
        <div
          className="absolute -bottom-6 -left-6 bg-secondary text-secondary-foreground rounded-2xl p-5 shadow-2xl ring-1 ring-black/5"
          style={{ transform: "translateZ(90px)" }}
        >
          <div className="font-display text-3xl font-bold leading-none">20+</div>
          <div className="text-xs uppercase tracking-wider mt-1">Years of<br />Heritage Revival</div>
        </div>

        {/* Floating leaf medallion */}
        <div
          className="hidden md:grid absolute -top-8 -right-8 h-28 w-28 rounded-full bg-primary text-secondary place-items-center ring-8 ring-background shadow-xl"
          style={{ transform: "translateZ(120px)" }}
        >
          <Leaf className="h-12 w-12" />
        </div>

        {/* Floating organic chip */}
        <div
          className="absolute top-8 -left-8 hidden md:flex items-center gap-2 rounded-full bg-background/90 backdrop-blur px-4 py-2 shadow-lg ring-1 ring-primary/10"
          style={{ transform: "translateZ(70px)" }}
        >
          <Sprout className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider">100% Organic</span>
        </div>

        {/* Floating grain droplet */}
        <div
          className="absolute bottom-16 -right-6 hidden md:flex items-center gap-2 rounded-2xl bg-background/90 backdrop-blur px-3 py-2 shadow-lg ring-1 ring-primary/10"
          style={{ transform: "translateZ(100px)" }}
        >
          <Droplets className="h-4 w-4 text-secondary" />
          <div className="text-[10px] leading-tight">
            <div className="font-bold text-primary">Brackish</div>
            <div className="text-muted-foreground">Salt-tolerant</div>
          </div>
        </div>
      </div>

      {/* Decorative ground rings (outside tilt) */}
      <div className="pointer-events-none absolute -z-10 -inset-10">
        <div className="absolute inset-0 rounded-full bg-secondary/10 blur-2xl animate-pulse" />
      </div>
    </div>
  );
}

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

      {/* HERO SLIDER */}
      <HeroSlider />

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
        <Tilt3DCard />
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
          <TourGlobe packages={packages} />
        )}
      </div>
      </section>

      {/* PARALLAX SECTION */}
      <section
        id="story"
        className="relative isolate overflow-hidden bg-fixed bg-center bg-cover"
        style={{ backgroundImage: `url(${parallaxImg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/85" />
        {/* Floating accent ring */}
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full border border-secondary/40 hidden md:block" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full border border-secondary/30 hidden md:block" />
        <div className="relative container mx-auto px-4 py-28 md:py-40 text-primary-foreground text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 text-xs uppercase tracking-[0.2em]">
            <Leaf className="h-3.5 w-3.5 text-secondary" /> A vanishing heritage
          </div>
          <h2 className="font-display text-4xl md:text-6xl mt-6 leading-tight">
            Every step plants a grain of <span className="text-secondary italic">hope.</span>
          </h2>
          <p className="mt-6 text-base md:text-lg text-primary-foreground/85 leading-relaxed">
            Pokkali grows only where land kisses brackish water — and only when travellers care enough to keep walking the fields. Seventy percent of every fee goes straight to the farmers reviving this 3,000-year-old grain.
          </p>
          <p className="mt-6 font-display italic text-xl md:text-2xl text-secondary">
            "Pokkali rises again — through the curious feet of travellers like you."
          </p>
        </div>
      </section>

      {/* DARK CTA BANNER */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="text-sm font-display italic text-secondary">We're Sharing the Heritage</div>
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
