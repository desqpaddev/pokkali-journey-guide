import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Plane,
  PlaneTakeoff,
  Clock,
  Users,
  MapPin,
  ArrowRight,
  Ticket,
  Cloud,
} from "lucide-react";
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

export function TourGlobe({ packages }: { packages: Pkg[] }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [takingOff, setTakingOff] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  if (!packages.length) return null;
  const current = packages[active];

  const flightNo = (i: number) =>
    `PK${(217 + i * 13).toString().padStart(3, "0")}`;

  const handleBoard = () => {
    if (takingOff) return;
    setTakingOff(true);
    timer.current = window.setTimeout(() => {
      navigate({ to: "/packages/$slug", params: { slug: current.slug } });
    }, 1500);
  };

  return (
    <div className="relative">
      {/* Sky backdrop with drifting clouds */}
      <div className="relative mx-auto max-w-6xl rounded-[2.5rem] overflow-hidden ring-1 ring-primary/10 shadow-2xl bg-gradient-to-b from-[#bfe1f3] via-[#e9f4fb] to-[#fef7e8]">
        {/* Sun */}
        <div className="absolute top-8 right-10 h-24 w-24 rounded-full bg-[radial-gradient(circle,_#fff3b0,_#f5c45e_60%,_transparent_70%)] blur-[1px]" />
        {/* Clouds */}
        <CloudDrift className="top-12 left-[-10%]" delay="0s" duration="42s" scale={1} />
        <CloudDrift className="top-32 left-[-20%]" delay="-12s" duration="58s" scale={0.7} />
        <CloudDrift className="bottom-24 left-[-15%]" delay="-25s" duration="50s" scale={1.2} />
        <CloudDrift className="bottom-10 left-[-25%]" delay="-6s" duration="65s" scale={0.6} />

        {/* Distant mountains */}
        <svg
          className="absolute bottom-0 left-0 w-full text-primary/30"
          viewBox="0 0 800 140"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0 140 L80 70 L140 100 L220 40 L320 110 L420 60 L520 105 L620 50 L720 95 L800 70 L800 140 Z"
            fill="currentColor"
          />
          <path
            d="M0 140 L70 110 L160 80 L240 115 L340 90 L460 120 L560 95 L680 118 L800 100 L800 140 Z"
            className="text-primary/50"
            fill="currentColor"
          />
        </svg>

        <div className="relative grid lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-10 p-6 md:p-10 pt-12">
          {/* === LEFT: Airplane with window === */}
          <div className="relative min-h-[460px]">
            <div
              className={`relative will-change-transform transition-all ease-[cubic-bezier(.55,.05,.25,1)] ${
                takingOff
                  ? "duration-[1400ms] -translate-y-72 translate-x-32 -rotate-[18deg] scale-90 opacity-90"
                  : "duration-700"
              }`}
            >
              <Airplane />

              {/* Window with package image */}
              <div
                className="absolute left-[28%] top-[34%] w-[44%] aspect-[2.2/1] rounded-[42%_42%_42%_42%/55%_55%_55%_55%] overflow-hidden ring-[6px] ring-white shadow-[inset_0_6px_18px_rgba(0,0,0,0.35),0_10px_30px_-10px_rgba(0,0,0,0.4)] cursor-pointer group"
                onClick={handleBoard}
                role="button"
                aria-label={`Board flight to ${current.title}`}
              >
                {/* Window inner frame */}
                <div className="absolute inset-0 rounded-[inherit] ring-1 ring-black/20 z-10 pointer-events-none" />
                {/* Image slides in on change */}
                <div key={current.id} className="absolute inset-0 animate-fade-in">
                  {current.hero_image_url ? (
                    <img
                      src={current.hero_image_url}
                      alt={current.title}
                      className="h-full w-full object-cover scale-110 group-hover:scale-125 transition-transform duration-[1200ms]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary to-secondary" />
                  )}
                  {/* Glass reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-white/10 mix-blend-screen" />
                  <div className="absolute -left-1/4 top-0 h-full w-1/2 rotate-12 bg-white/20 blur-md" />
                  {/* Caption inside window */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                    <div className="text-[10px] uppercase tracking-[0.25em] opacity-80">
                      Now boarding · {flightNo(active)}
                    </div>
                    <div className="font-display text-lg leading-tight line-clamp-1">
                      {current.title}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tap-to-board hint */}
              {!takingOff && (
                <div className="absolute left-[28%] top-[34%] w-[44%] flex justify-center -mt-3 pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-white/90 ring-1 ring-primary/15 text-[10px] uppercase tracking-widest text-primary shadow animate-pulse">
                    Tap window to board
                  </span>
                </div>
              )}
            </div>

            {/* Runway / contrail */}
            <div className="absolute bottom-4 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            {takingOff && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-1 w-[60%] bg-gradient-to-r from-transparent via-white to-transparent blur-sm animate-pulse" />
            )}
          </div>

          {/* === RIGHT: Flight board === */}
          <div className="relative">
            <div className="rounded-2xl bg-background/90 backdrop-blur ring-1 ring-primary/10 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-primary text-primary-foreground">
                <div className="flex items-center gap-2">
                  <PlaneTakeoff className="h-4 w-4" />
                  <span className="font-display tracking-[0.25em] text-xs">
                    DEPARTURES
                  </span>
                </div>
                <span className="text-[10px] opacity-80">
                  GATE · KERALA
                </span>
              </div>

              <ul className="divide-y divide-primary/10 max-h-[360px] overflow-y-auto">
                {packages.map((p, i) => {
                  const isActive = i === active;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => setActive(i)}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 transition ${
                          isActive
                            ? "bg-secondary/15"
                            : "hover:bg-muted/60"
                        }`}
                      >
                        <span
                          className={`grid place-items-center h-9 w-9 rounded-full ring-1 transition ${
                            isActive
                              ? "bg-secondary text-secondary-foreground ring-secondary"
                              : "bg-muted text-primary ring-primary/15"
                          }`}
                        >
                          <Plane
                            className={`h-4 w-4 transition-transform ${
                              isActive ? "-rotate-45" : "rotate-0"
                            }`}
                          />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                              {flightNo(i)}
                            </span>
                            {isActive && (
                              <Badge className="h-4 px-1.5 text-[9px] bg-secondary text-secondary-foreground border-none">
                                BOARDING
                              </Badge>
                            )}
                          </div>
                          <div className="font-display text-sm uppercase leading-tight truncate">
                            {p.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground capitalize truncate">
                            {p.category?.replace("-", " ") || "Heritage tour"}
                            {p.duration_hours ? ` · ${p.duration_hours}h` : ""}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                            From
                          </div>
                          <div className="font-display text-primary text-sm">
                            ₹{Number(p.price_per_person).toLocaleString()}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Boarding pass for active flight */}
            <div
              key={current.id + "-pass"}
              className="mt-5 relative rounded-2xl bg-background ring-1 ring-primary/10 shadow-2xl overflow-hidden animate-fade-in"
            >
              <div className="absolute left-1/2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[hsl(var(--muted))] -translate-x-1/2 hidden" />
              <div className="grid grid-cols-[1fr_auto] gap-0">
                <div className="p-5">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    <Ticket className="h-3 w-3" /> Boarding pass
                  </div>
                  <h3 className="font-display text-xl uppercase mt-1 leading-tight">
                    {current.title}
                  </h3>
                  {current.tagline && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {current.tagline}
                    </p>
                  )}
                  <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                    <Info icon={<Clock className="h-3 w-3" />} label="Duration" value={`${current.duration_hours ?? "—"}h`} />
                    <Info icon={<Users className="h-3 w-3" />} label="Guests" value={`${current.min_group_size ?? 1}-${current.max_group_size ?? 8}`} />
                    <Info icon={<MapPin className="h-3 w-3" />} label="From" value="Kochi" />
                  </div>
                  <button
                    onClick={handleBoard}
                    disabled={takingOff}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-display tracking-widest uppercase shadow-lg hover:bg-secondary hover:text-secondary-foreground transition disabled:opacity-60"
                  >
                    {takingOff ? "Taking off…" : "Board flight"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                {/* Stub */}
                <div className="relative bg-primary text-primary-foreground p-4 flex flex-col items-center justify-center min-w-[110px] border-l border-dashed border-primary-foreground/30">
                  <div className="text-[9px] uppercase tracking-[0.25em] opacity-80">Seat</div>
                  <div className="font-display text-2xl leading-none">
                    {String.fromCharCode(65 + (active % 6))}
                    {12 + active}
                  </div>
                  <div className="mt-2 text-[9px] uppercase tracking-widest opacity-80">
                    {flightNo(active)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/60 px-2 py-1.5">
      <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div className="font-display text-sm leading-tight">{value}</div>
    </div>
  );
}

function CloudDrift({
  className = "",
  delay,
  duration,
  scale = 1,
}: {
  className?: string;
  delay: string;
  duration: string;
  scale?: number;
}) {
  return (
    <div
      className={`absolute text-white/85 pointer-events-none ${className}`}
      style={{
        animation: `flightCloud ${duration} linear infinite`,
        animationDelay: delay,
        transform: `scale(${scale})`,
      }}
      aria-hidden
    >
      <Cloud className="h-16 w-24 drop-shadow" fill="currentColor" strokeWidth={0} />
    </div>
  );
}

function Airplane() {
  // Stylized side-view airplane in SVG.
  return (
    <svg viewBox="0 0 600 260" className="w-full max-w-[640px] mx-auto drop-shadow-[0_30px_30px_rgba(0,0,0,0.25)]">
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f4f6f8" />
          <stop offset="100%" stopColor="#c9d1d8" />
        </linearGradient>
        <linearGradient id="stripe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(var(--secondary))" />
          <stop offset="100%" stopColor="hsl(var(--primary))" />
        </linearGradient>
      </defs>

      {/* Tail */}
      <path d="M70 130 L30 50 L95 50 L130 130 Z" fill="url(#body)" stroke="hsl(var(--primary)/0.25)" />
      {/* Fuselage */}
      <path
        d="M60 130 Q60 90 140 80 L470 80 Q560 85 580 130 Q560 175 470 180 L140 180 Q60 170 60 130 Z"
        fill="url(#body)"
        stroke="hsl(var(--primary)/0.3)"
      />
      {/* Wing */}
      <path
        d="M240 175 Q310 235 430 215 L470 180 Z"
        fill="hsl(var(--primary)/0.85)"
        stroke="hsl(var(--primary))"
      />
      {/* Cockpit window */}
      <path
        d="M520 110 Q560 115 575 132 Q560 150 525 152 Q510 135 520 110 Z"
        fill="#1f3a4d"
        opacity="0.75"
      />
      {/* Stripe */}
      <rect x="60" y="155" width="520" height="6" fill="url(#stripe)" opacity="0.8" />
      {/* Door */}
      <rect x="155" y="95" width="14" height="34" rx="6" fill="none" stroke="hsl(var(--primary)/0.5)" />
      {/* Small accent windows on sides of the main panoramic window */}
      <circle cx="195" cy="125" r="9" fill="#1f3a4d" opacity="0.7" />
      <circle cx="430" cy="125" r="9" fill="#1f3a4d" opacity="0.7" />
    </svg>
  );
}
