import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Globe2, MapPin, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

// Lat/lon-style pin positions distributed around the globe.
// lat: -90 (south) to 90 (north). lon: 0..360 around the equator.
const SLOTS: { lat: number; lon: number }[] = [
  { lat: 12, lon: 0 },
  { lat: -8, lon: 90 },
  { lat: 20, lon: 180 },
  { lat: -18, lon: 270 },
  { lat: 35, lon: 45 },
  { lat: -30, lon: 135 },
  { lat: 25, lon: 225 },
  { lat: -12, lon: 315 },
];

const R = 150; // sphere radius (px)

export function TourGlobe({ packages }: { packages: Pkg[] }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const count = packages.length;

  useEffect(() => {
    if (!auto || count < 2) return;
    const id = setInterval(() => setActive((a) => (a + 1) % count), 5000);
    return () => clearInterval(id);
  }, [auto, count]);

  if (!count) return null;
  const current = packages[active];
  const activeSlot = SLOTS[active % SLOTS.length];

  // Rotate the entire globe so the active pin faces front (z+).
  // A pin at (lat, lon) maps to (rotateY=-lon, rotateX=lat).
  // To bring it to the front we apply the inverse: rotateX(-lat) rotateY(lon).
  const globeRotY = activeSlot.lon;
  const globeRotX = -activeSlot.lat;

  return (
    <div className="relative">
      <div
        className="relative mx-auto h-[520px] md:h-[600px] w-full max-w-5xl select-none"
        style={{ perspective: "1400px" }}
        onMouseEnter={() => setAuto(false)}
        onMouseLeave={() => setAuto(true)}
      >
        {/* Glow halo */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[460px] w-[460px] rounded-full bg-secondary/25 blur-3xl" />
        {/* Orbit ring */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] rounded-full border border-dashed border-primary/25"
          style={{ transform: "translate(-50%, -50%) rotateX(72deg)" }}
        />

        {/* === Rotating Globe === */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: R * 2, height: R * 2, transformStyle: "preserve-3d" }}
        >
          <button
            type="button"
            onClick={() => setActive((a) => (a + 1) % count)}
            aria-label="Rotate globe to next tour"
            className="absolute inset-0 outline-none cursor-pointer"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${globeRotX}deg) rotateY(${globeRotY}deg)`,
              transition: "transform 1100ms cubic-bezier(.2,.7,.2,1)",
            }}
          >
            {/* Sphere body */}
            <div
              className="absolute inset-0 rounded-full shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55),inset_-30px_-40px_80px_rgba(0,0,0,0.4),inset_20px_30px_60px_rgba(255,255,255,0.18)]"
              style={{
                background:
                  "radial-gradient(circle at 30% 25%, hsl(var(--secondary)/0.95), hsl(var(--primary)) 55%, hsl(var(--primary)) 100%)",
                transform: "translateZ(0)",
              }}
            >
              {/* Latitude grid */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                {[18, 36, 50, 64, 82].map((top) => (
                  <div
                    key={top}
                    className="absolute left-0 right-0 border-t border-secondary/25"
                    style={{ top: `${top}%` }}
                  />
                ))}
                {[0, 30, 60, 90, 120, 150].map((deg) => (
                  <div
                    key={deg}
                    className="absolute left-1/2 top-0 bottom-0 w-px bg-secondary/25"
                    style={{ transform: `translateX(-50%) rotate(${deg}deg)` }}
                  />
                ))}
                {/* Continent blobs */}
                <div className="absolute left-[22%] top-[30%] h-12 w-16 rounded-[60%_40%_50%_60%] bg-secondary/30 blur-[1px]" />
                <div className="absolute right-[18%] top-[45%] h-16 w-14 rounded-[50%_60%_40%_60%] bg-secondary/25 blur-[1px]" />
                <div className="absolute left-[35%] bottom-[18%] h-10 w-20 rounded-[60%_40%_60%_40%] bg-secondary/30 blur-[1px]" />
              </div>
              {/* Specular highlight */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.5),transparent_38%)]" />
            </div>

            {/* === Pins stuck on globe surface === */}
            {packages.map((p, i) => {
              const slot = SLOTS[i % SLOTS.length];
              const isActive = i === active;
              return (
                <div
                  key={p.id}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transformStyle: "preserve-3d",
                    // Position on sphere surface, then orient outward.
                    transform: `rotateY(${-slot.lon}deg) rotateX(${slot.lat}deg) translateZ(${R + 2}px)`,
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive(i);
                    }}
                    aria-label={`Show ${p.title}`}
                    className="-translate-x-1/2 -translate-y-1/2 absolute"
                  >
                    {/* Pin head */}
                    <span
                      className={`relative grid place-items-center rounded-full ring-2 ring-background shadow-xl transition-all duration-500 ${
                        isActive
                          ? "h-9 w-9 bg-secondary text-secondary-foreground scale-110"
                          : "h-6 w-6 bg-primary text-primary-foreground hover:scale-110"
                      }`}
                    >
                      <MapPin className={isActive ? "h-4 w-4" : "h-3 w-3"} />
                      {isActive && (
                        <span className="absolute inset-0 rounded-full bg-secondary/40 animate-ping" />
                      )}
                    </span>
                    {/* Pin pulse base */}
                    <span
                      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary/50 ${
                        isActive ? "h-14 w-14" : "h-8 w-8 opacity-50"
                      }`}
                    />
                  </button>
                </div>
              );
            })}

            {/* Center compass label (counter-rotated so it stays readable) */}
            <div
              className="absolute inset-0 grid place-items-center pointer-events-none text-primary-foreground"
              style={{
                transform: `rotateY(${-globeRotY}deg) rotateX(${-globeRotX}deg) translateZ(${R + 30}px)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div className="text-center">
                <Globe2 className="h-6 w-6 mx-auto opacity-90 drop-shadow" />
                <div className="mt-1 text-[9px] uppercase tracking-[0.3em] opacity-80">Click to spin</div>
              </div>
            </div>
          </button>
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

        {/* Counter */}
        <div className="absolute top-4 right-4 text-xs font-display tracking-widest text-muted-foreground">
          {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </div>
      </div>

      {/* === Active package detail panel === */}
      <div className="relative mx-auto -mt-2 max-w-3xl px-4">
        <Link
          to="/packages/$slug"
          params={{ slug: current.slug }}
          key={current.id}
          className="block group animate-fade-in"
        >
          <div className="rounded-3xl bg-background ring-1 ring-primary/10 shadow-2xl overflow-hidden grid md:grid-cols-[200px_1fr_auto] gap-0 items-stretch">
            <div className="relative h-44 md:h-auto bg-muted overflow-hidden">
              {current.hero_image_url ? (
                <img
                  src={current.hero_image_url}
                  alt={current.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-primary to-secondary/60" />
              )}
              <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground capitalize border-none">
                {current.category?.replace("-", " ") || "Tour"}
              </Badge>
            </div>
            <div className="p-6 md:p-7 text-center md:text-left">
              <h3 className="font-display text-2xl md:text-[1.65rem] uppercase leading-tight">
                {current.title}
              </h3>
              {current.tagline && (
                <p className="text-muted-foreground mt-2 text-sm line-clamp-2">{current.tagline}</p>
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
            <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 p-6 md:px-8 md:py-7 bg-muted/40 border-t md:border-t-0 md:border-l border-primary/10">
              <div className="text-center md:text-right">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">From</div>
                <div className="font-display text-3xl text-primary leading-none">
                  ₹{Number(current.price_per_person).toLocaleString()}
                </div>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg group-hover:bg-secondary group-hover:text-secondary-foreground transition">
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