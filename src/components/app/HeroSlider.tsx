import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Wheat, Fish, Store, Waves, ArrowUpRight } from "lucide-react";
import hero1 from "@/assets/hero-paddy.jpg";
import hero2 from "@/assets/hero-backwater.jpg";
import hero3 from "@/assets/hero-harvest.jpg";

// Placeholder photos — to be replaced with real Palliyakkal photographs.
const SLIDES = [
  { img: hero1, caption: "Pokkali fields and bunds, Palliyakkal" },
  { img: hero2, caption: "Backwaters and traditional agri-aqua life" },
  { img: hero3, caption: "Visitors sharing the village harvest" },
];

export const GATEWAYS = [
  { to: "/farm-tours", icon: Wheat, title: "Pokkali Farm Tours", sub: "Walk the fields, meet the farmers" },
  { to: "/products", icon: Fish, title: "Agri-Aqua Products", sub: "Grown and caught in Palliyakkal" },
  { to: "/village-hub", icon: Store, title: "Village Hub", sub: "Eat, shop and rest in the village" },
  { to: "/water-sports", icon: Waves, title: "Water Sports", sub: "Paddle the backwaters" },
] as const;

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 7000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => (
          <div
            key={s.img}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ${i === index ? "opacity-100" : "opacity-0"}`}
          >
            <img src={s.img} alt="" className={`h-full w-full object-cover ${i === index ? "animate-kenburns" : ""}`} draggable={false} />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/25 to-primary/90" />
      </div>

      <div className="relative container mx-auto px-4 pt-24 md:pt-32 pb-8 min-h-[92vh] flex flex-col text-primary-foreground">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="uppercase tracking-[0.3em] text-xs md:text-sm text-secondary">Pokkali Village · Palliyakkal, Ezhikara</p>
          <h1 className="font-display font-semibold mt-5 leading-[0.9] text-[17vw] md:text-[10rem] tracking-tight">
            PAADI <span className="italic font-normal">Tales</span>
          </h1>
          <p className="mt-4 font-display italic text-lg md:text-2xl text-primary-foreground/90">
            Palliyakkal Agri-Aqua Digital Immersive Tales
          </p>
          <p className="mt-6 text-base md:text-xl tracking-wide max-w-2xl">
            Experience the village. Explore the farm. Live the story.
          </p>
          <p className="mt-6 text-xs text-primary-foreground/70">{SLIDES[index].caption}</p>
          <div className="mt-3 flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-secondary" : "w-3 bg-primary-foreground/40"}`}
              />
            ))}
          </div>
        </div>

        <nav aria-label="PAADI Tales gateways" className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {GATEWAYS.map((g) => (
            <Link
              key={g.to}
              to={g.to}
              className="group relative rounded-2xl border border-primary-foreground/20 bg-primary/40 backdrop-blur-md p-4 md:p-5 hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              <g.icon className="h-7 w-7 md:h-9 md:w-9 text-secondary group-hover:text-secondary-foreground" strokeWidth={1.4} />
              <div className="mt-3 font-display text-base md:text-xl leading-tight">{g.title}</div>
              <div className="mt-1 text-xs md:text-sm opacity-80 hidden sm:block">{g.sub}</div>
              <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 opacity-60 group-hover:opacity-100" />
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
