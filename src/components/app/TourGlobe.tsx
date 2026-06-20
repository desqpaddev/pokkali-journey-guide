import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Globe2, MapPin, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import hero from "@/assets/hero-paddy.jpg";

type Pkg = {
  id: string;
  slug: string;
  title: string;
  tagline?: string | null;
  category?: string | null;
  hero_image_url?: string | null;
  price_per_person: number | string;
  duration_hours?: number | null;
  min_group_size?: number | null;
  max_group_size?: number | null;
};

export function TourGlobe({ packages }: { packages: Pkg[] }) {
  const [active, setActive] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const count = packages.length;
  const step = useMemo(() => (count ? 360 / count : 0), [count]);
  // Globe yaw – we rotate the ring so the active package faces forward.
  const yaw = -active * step;

  useEffect(() => {
    if (!autoRotate || count < 2) return;
    const id = setInterval(() => setActive((a) => (a + 1) % count), 4500);
    return () => clearInterval(id);
  }, [autoRotate, count]);

  if (!count) return null;
  const current = packages[active];

  // Distance of the orbit ring from the globe center (px). Cards float around the sphere.
  const radius = 320;

  return (
    <div className="relative">
      {/* Stage */}
      <div
        className="relative mx-auto h-[560px] md:h-[640px] w-full max-w-5xl select-none"
        style={{ perspective: "1600px" }}
        onMouseEnter={() => setAutoRotate(false)}
        onMouseLeave={() => setAutoRotate(true)}
      >
        {/* Soft halo */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-secondary/20 blur-3xl" />

        {/* Orbit ring (decorative) */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[680px] w-[680px] rounded-full border border-dashed border-primary/20"
          style={{ transform: "translate(-50%, -50%) rotateX(72deg)" }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full border border-primary/15"
          style={{ transform: "translate(-50%, -50%) rotateX(72deg)" }}
        />

        {/* === The Globe === */}
        <button
          type="button"
          onClick={() => setActive((a) => (a + 1) % count)}
          aria-label="Rotate globe to next tour"
          className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-56 md:h-64 md:w-64 rounded-full cursor-pointer outline-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Globe sphere */}
          <div
            className="absolute inset-0 rounded-full shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5),inset_-30px_-40px_80px_rgba(0,0,0,0.35),inset_20px_30px_60px_rgba(255,255,255,0.15)] transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              background:
                "radial-gradient(circle at 30% 25%, hsl(var(--secondary)/0.9), hsl(var(--primary)) 55%, hsl(var(--primary)) 100%)",
            }}
          >
            {/* Latitude lines */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {[18, 36, 50, 64, 82].map((top) => (
                <div
                  key={top}
                  className="absolute left-0 right-0 border-t border-secondary/25"
                  style={{ top: `${top}%` }}
                />
              ))}
              {/* Longitude lines (rotating with active) */}
              <div
                className="absolute inset-0 transition-transform duration-1000 ease-out"
                style={{ transform: `rotate(${yaw * 0.4}deg)` }}
              >
                {[0, 30, 60, 90, 120, 150].map((deg) => (
                  <div
                    key={deg}
                    className="absolute left-1/2 top-0 bottom-0 w-px bg-secondary/25"
                    style={{ transform: `translateX(-50%) rotate(${deg}deg)`, transformOrigin: "center" }}
                  />
                ))}
              </div>
              {/* Continent-ish blobs */}
              <div className="absolute left-[22%] top-[30%] h-12 w-16 rounded-[60%_40%_50%_60%] bg-secondary/30 blur-[1px]" />
              <div className="absolute right-[18%] top-[45%] h-16 w-14 rounded-[50%_60%_40%_60%] bg-secondary/25 blur-[1px]" />
              <div className="absolute left-[35%] bottom-[18%] h-10 w-20 rounded-[60%_40%_60%_40%] bg-secondary/30 blur-[1px]" />
            </div>
            {/* Specular highlight */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.55),transparent_38%)]" />
          </div>

          {/* Center label */}
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="text-center text-primary-foreground">
              <Globe2 className="h-7 w-7 mx-auto opacity-90 drop-shadow" />
              <div className="mt-2 text-[10px] uppercase tracking-[0.3em] opacity-80">Click to rotate</div>
              <div className="font-display text-xl mt-1 drop-shadow">
                {active + 1} / {count}
              </div>
            </div>
          </div>

          {/* Pulse pin */}
          <span className="absolute top-2 right-8 h-3 w-3 rounded-full bg-secondary ring-4 ring-secondary/30 animate-ping" />
        </button>

        {/* === Orbiting Package Pins === */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-[cubic-bezier(.2,.7,.2,1)]"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(-8deg) rotateY(${yaw}deg)`,
          }}
        >
          {packages.map((p, i) => {
            const angle = i * step;
            const isActive = i === active;
            return (
              <button
                type="button"
                key={p.id}
                onClick={() => setActive(i)}
                className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 group/pin"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px) rotateY(${-angle}deg) rotateY(${-yaw}deg)`,
                  transformStyle: "preserve-3d",
                }}
                aria-label={`Show ${p.title}`}
              >
                <div
                  className={`relative w-44 rounded-2xl overflow-hidden ring-1 transition-all duration-500 ${
                    isActive
                      ? "ring-secondary scale-110 shadow-2xl"
                      : "ring-primary/10 opacity-70 hover:opacity-100 shadow-lg"
                  }`}
                >
                  <div className="aspect-[4/5] bg-muted">
                    <img
                      src={p.hero_image_url || hero}
                      alt={p.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-primary/95 via-primary/70 to-transparent text-primary-foreground">
                    <div className="text-[10px] uppercase tracking-wider text-secondary">
                      {p.category?.replace("-", " ")}
                    </div>
                    <div className="font-display text-sm leading-tight line-clamp-2">{p.title}</div>
                  </div>
                  {isActive && (
                    <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-secondary ring-4 ring-secondary/30 animate-pulse" />
                  )}
                </div>
                {/* Tether line to globe */}
                <div className="absolute left-1/2 top-1/2 -z-10 h-px w-[140px] origin-left bg-gradient-to-r from-secondary/60 to-transparent" />
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <button
          type="button"
          onClick={() => setActive((a) => (a - 1 + count) % count)}
          aria-label="Previous tour"
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-background/90 ring-1 ring-primary/10 shadow-lg grid place-items-center hover:bg-secondary hover:text-secondary-foreground transition"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setActive((a) => (a + 1) % count)}
          aria-label="Next tour"
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-background/90 ring-1 ring-primary/10 shadow-lg grid place-items-center hover:bg-secondary hover:text-secondary-foreground transition"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Active package detail card */}
      <div className="relative mx-auto -mt-6 max-w-2xl px-4">
        <Link
          to="/packages/$slug"
          params={{ slug: current.slug }}
          key={current.id}
          className="block group animate-fade-in"
        >
          <div className="rounded-3xl bg-background ring-1 ring-primary/10 shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 text-center md:text-left">
              <Badge className="bg-secondary text-secondary-foreground capitalize border-none">
                {current.category?.replace("-", " ") || "Tour"}
              </Badge>
              <h3 className="font-display text-2xl md:text-3xl uppercase mt-3 leading-tight">
                {current.title}
              </h3>
              {current.tagline && (
                <p className="text-muted-foreground mt-2 text-sm">{current.tagline}</p>
              )}
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 text-xs text-muted-foreground">
                {current.duration_hours ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" /> {current.duration_hours}h
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" /> {current.min_group_size}–{current.max_group_size} guests
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Kerala backwaters
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">From</div>
                <div className="font-display text-3xl text-primary leading-none">
                  ₹{Number(current.price_per_person).toLocaleString()}
                </div>
              </div>
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg group-hover:bg-secondary group-hover:text-secondary-foreground transition">
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
          </div>
        </Link>

        {/* Dot pager */}
        <div className="mt-6 flex justify-center gap-2">
          {packages.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(i)}
              aria-label={`Go to ${p.title}`}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-8 bg-primary" : "w-2 bg-primary/25 hover:bg-primary/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}