import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

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

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  if (!packages.length) return null;
  const current = packages[active];
  const flightNo = (i: number) => `PK${(217 + i * 13).toString().padStart(3, "0")}`;
  const seat = `A${12 + active}`;

  const handleBoard = () => {
    if (takingOff) return;
    setTakingOff(true);
    timer.current = window.setTimeout(() => {
      navigate({ to: "/packages/$slug", params: { slug: current.slug } });
    }, 1400);
  };

  return (
    <div className="relative mx-auto max-w-6xl">
      {/* === Experience Shell === */}
      <div className="w-full bg-primary rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px] border-[12px] border-primary">
        {/* === Left: Cabin Window === */}
        <div className="relative flex-1 bg-primary/90 flex items-center justify-center p-8 overflow-hidden">
          {/* subtle cabin gradient */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-60 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top, hsl(var(--secondary)/0.08), transparent 60%)",
            }}
          />

          <div
            className={`relative w-full aspect-[4/5] max-w-sm rounded-[140px] border-[16px] border-primary overflow-hidden shadow-[inset_0_10px_40px_rgba(0,0,0,0.55),0_20px_40px_-10px_rgba(0,0,0,0.5)] group cursor-pointer transition-all ease-[cubic-bezier(.55,.05,.25,1)] ${
              takingOff
                ? "duration-[1400ms] -translate-y-24 -rotate-[10deg] scale-95 opacity-90"
                : "duration-700"
            }`}
            onClick={handleBoard}
            role="button"
            aria-label={`Board flight to ${current.title}`}
          >
            {/* destination image */}
            <div key={current.id} className="absolute inset-0 animate-fade-in">
              {current.hero_image_url ? (
                <img
                  src={current.hero_image_url}
                  alt={current.title}
                  className="h-full w-full object-cover scale-105 transition-transform duration-[1500ms] group-hover:scale-115"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-primary to-secondary" />
              )}
            </div>

            {/* glass glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-white/5 pointer-events-none" />
            <div className="absolute -left-1/4 top-0 h-full w-1/2 rotate-12 bg-white/10 blur-md pointer-events-none" />

            {/* floating label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/35 group-hover:bg-black/10 transition-colors duration-500">
              <span className="text-background/80 text-[10px] uppercase tracking-[0.3em] mb-2">
                Tap to Board
              </span>
              <div className="h-px w-8 bg-background/40 mb-4" />
              <h3 className="text-background text-2xl font-display leading-tight">
                {current.title}
              </h3>
              {current.tagline && (
                <p className="text-background/70 text-xs mt-3 max-w-[18ch] line-clamp-2">
                  {current.tagline}
                </p>
              )}
            </div>
          </div>

          {/* cabin wall caption */}
          <div className="absolute bottom-8 left-8">
            <p className="text-secondary/50 text-[10px] font-mono uppercase tracking-widest">
              Cabin Alt: 12,000ft · {flightNo(active)}
            </p>
          </div>
          <div className="absolute top-8 right-8 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
            <span className="text-secondary/70 text-[10px] font-mono uppercase tracking-widest">
              {takingOff ? "Cleared for takeoff" : "Cruising"}
            </span>
          </div>
        </div>

        {/* === Right: Concierge === */}
        <div className="w-full lg:w-[480px] bg-background p-8 md:p-10 flex flex-col">
          {/* Departures Board */}
          <div className="mb-8">
            <div className="flex justify-between items-end border-b border-primary/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <h4 className="text-primary text-xs font-semibold tracking-widest uppercase">
                  Live Departures
                </h4>
              </div>
              <span className="text-primary/40 text-[10px] font-medium uppercase tracking-widest">
                Gate · Kerala
              </span>
            </div>

            <div className="space-y-1 max-h-[260px] overflow-y-auto pr-1">
              {packages.map((p, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`w-full text-left group flex items-center justify-between p-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-primary text-background"
                        : "hover:bg-primary/5"
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`text-[10px] font-mono ${
                          isActive ? "text-secondary" : "text-primary/40"
                        }`}
                      >
                        {flightNo(i)}
                      </div>
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-semibold uppercase tracking-wide truncate ${
                            isActive ? "" : "text-primary"
                          }`}
                        >
                          {p.title}
                        </div>
                        <div
                          className={`text-[10px] capitalize ${
                            isActive ? "opacity-60" : "text-primary/50"
                          }`}
                        >
                          {p.category?.replace("-", " ") || "Heritage"}
                          {p.duration_hours ? ` · ${p.duration_hours}h` : ""}
                        </div>
                      </div>
                    </div>
                    <div className="text-right pl-3 shrink-0">
                      <div
                        className={`text-[10px] uppercase ${
                          isActive ? "opacity-60" : "text-primary/40"
                        }`}
                      >
                        From
                      </div>
                      <div
                        className={`text-xs font-bold font-mono ${
                          isActive ? "" : "text-primary"
                        }`}
                      >
                        ₹{Number(p.price_per_person).toLocaleString()}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Boarding Pass */}
          <div className="mt-auto relative">
            <div
              key={current.id + "-pass"}
              className="relative bg-card border border-primary/10 rounded-2xl p-6 shadow-sm overflow-hidden animate-fade-in"
            >
              {/* perforation */}
              <div className="absolute left-0 right-0 top-[64%] border-t border-dashed border-primary/15" />
              <div className="absolute -left-3 top-[64%] -translate-y-1/2 w-6 h-6 bg-background rounded-full border border-primary/10" />
              <div className="absolute -right-3 top-[64%] -translate-y-1/2 w-6 h-6 bg-background rounded-full border border-primary/10" />

              <div className="flex justify-between mb-5">
                <div className="pr-3 min-w-0">
                  <span className="block text-[9px] uppercase tracking-widest text-primary/50 mb-1">
                    Boarding Pass
                  </span>
                  <h5 className="text-primary font-display text-lg leading-tight truncate">
                    {current.title}
                  </h5>
                </div>
                <div className="text-right shrink-0">
                  <span className="block text-[9px] uppercase tracking-widest text-primary/50 mb-1">
                    Seat No.
                  </span>
                  <span className="text-secondary font-bold text-lg font-mono">
                    {seat}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <PassField label="Duration" value={`${current.duration_hours ?? "—"}h`} />
                <PassField
                  label="Group Size"
                  value={`${current.min_group_size ?? 1}-${current.max_group_size ?? 8}`}
                />
                <PassField label="Origin" value="Kochi" />
              </div>

              <button
                onClick={handleBoard}
                disabled={takingOff}
                className="w-full bg-primary text-background py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 group hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {takingOff ? "Taking off…" : "Board Flight"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PassField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-[8px] uppercase tracking-widest text-primary/40 mb-1">
        {label}
      </span>
      <span className="text-[11px] font-semibold text-primary">{value}</span>
    </div>
  );
}
