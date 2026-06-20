import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Tractor, Sprout, ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero-paddy.jpg";
import hero2 from "@/assets/hero-backwater.jpg";
import hero3 from "@/assets/hero-harvest.jpg";

type Slide = {
  img: string;
  eyebrow: string;
  big: string;
  dotColor?: string;
  sub: string;
  cta: { label: string; hash: string };
};

const SLIDES: Slide[] = [
  {
    img: hero1,
    eyebrow: "We are Producing Natural Products",
    big: "Pokkali",
    sub: "Immersive heritage circuit tours through Kerala's last salt-tolerant paddy fields.",
    cta: { label: "Discover More", hash: "tours" },
  },
  {
    img: hero2,
    eyebrow: "Where Land Meets Backwater",
    big: "Backwaters",
    sub: "Drift through Kadamakkudy at golden hour — Chinese fishing nets, mangroves, and the rising tide.",
    cta: { label: "Explore Tours", hash: "tours" },
  },
  {
    img: hero3,
    eyebrow: "From Grain to Story",
    big: "Harvest",
    sub: "Meet the farmers reviving a 3,000-year-old grain — and carry a handful of Pokkali home.",
    cta: { label: "Meet the Farmers", hash: "story" },
  },
];

const FEATURES = [
  { icon: Tractor, title: "The Best Quality Standards" },
  { icon: Sprout, title: "A Smart Organic Service" },
  { icon: ShoppingBasket, title: "Natural Healthy Products" },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Stacked slide images with crossfade + slow Ken Burns zoom */}
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s.img}
              aria-hidden={!active}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${active ? "opacity-100" : "opacity-0"}`}
            >
              <img
                src={s.img}
                alt=""
                className={`h-full w-full object-cover ${active ? "animate-kenburns" : ""}`}
                draggable={false}
              />
            </div>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/55 via-primary/30 to-primary/80" />
        {/* Decorative grain/leaf SVG overlay */}
        <svg
          aria-hidden
          className="absolute inset-x-0 bottom-0 w-full text-background/30"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,80 C240,20 480,120 720,70 C960,20 1200,110 1440,60 L1440,120 L0,120 Z"
          />
        </svg>
      </div>

      <div className="relative container mx-auto px-4 pt-20 md:pt-28 pb-12 md:pb-16 text-primary-foreground text-center min-h-[92vh] flex flex-col items-center justify-center">
        {SLIDES.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s.big}
              className={`w-full ${active ? "block" : "hidden"}`}
            >
              <div className="relative inline-block animate-fade-in" style={{ animationDelay: "100ms" }}>
                <p className="font-display italic text-lg md:text-2xl tracking-wide">
                  {s.eyebrow}
                </p>
                <svg viewBox="0 0 300 12" className="mx-auto mt-1 h-2 w-56 md:w-72 text-secondary" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <path d="M5 7 Q 75 1 150 6 T 295 5" />
                </svg>
              </div>
              <h1
                className="font-display font-semibold mt-6 leading-[0.95] text-[18vw] md:text-[12rem] tracking-tight text-balance animate-fade-in"
                style={{ animationDelay: "250ms", animationFillMode: "both" }}
              >
                {s.big}
                <span className="text-secondary">.</span>
              </h1>
              <p
                className="mt-4 max-w-xl mx-auto text-base md:text-lg text-primary-foreground/90 animate-fade-in"
                style={{ animationDelay: "450ms", animationFillMode: "both" }}
              >
                {s.sub}
              </p>
              <div className="mt-8 animate-fade-in" style={{ animationDelay: "600ms", animationFillMode: "both" }}>
                <Button asChild className="rounded-full h-14 pl-7 pr-2 text-base bg-primary text-primary-foreground hover:bg-primary border border-primary-foreground/15">
                  <Link to="/" hash={s.cta.hash}>
                    {s.cta.label}
                    <span className="ml-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}

        {/* Slide controls — vertical dots + counter */}
        <div className="hidden md:flex absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 flex-col items-center gap-4">
          <span className="font-display text-xs text-primary-foreground/70">
            0{index + 1}<span className="opacity-50"> / 0{SLIDES.length}</span>
          </span>
          <div className="flex flex-col gap-3">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`block h-3 w-3 rounded-full border border-primary-foreground/70 transition ${i === index ? "bg-secondary border-secondary scale-125" : "bg-transparent hover:bg-primary-foreground/50"}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile dots */}
        <div className="md:hidden mt-6 flex items-center justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-secondary" : "w-3 bg-primary-foreground/40"}`}
            />
          ))}
        </div>

        {/* In-hero feature strip */}
        <div className="mt-16 md:mt-20 w-full border-t border-primary-foreground/20 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {FEATURES.map((f) => (
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
  );
}