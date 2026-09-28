import type { ReactNode, ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { Header, Footer } from "@/components/app/Header";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Leaf } from "lucide-react";

export function PageShell({
  eyebrow,
  title,
  intro,
  image,
  stats,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  image?: string;
  stats?: { value: string; label: string }[];
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        {image && (
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45 scale-105 animate-[kenburns_18s_ease-in-out_infinite_alternate]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/10" />
        <div className="relative container mx-auto px-4 pt-24 pb-20 md:pt-36 md:pb-28 max-w-5xl">
          <div className="flex items-center gap-2 text-xs text-primary-foreground/70">
            <Link to="/" className="hover:text-secondary">Home</Link>
            <span>/</span>
            <span className="text-secondary">{title}</span>
          </div>
          <p className="mt-8 inline-flex items-center gap-3 uppercase tracking-[0.35em] text-[11px] text-secondary">
            <span className="h-px w-10 bg-secondary" />{eyebrow}
          </p>
          <h1 className="font-display text-5xl md:text-7xl mt-5 leading-[1.02] tracking-tight">{title}</h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl font-light leading-relaxed">{intro}</p>
          <ChevronDown className="mt-12 h-6 w-6 text-secondary animate-bounce" />
        </div>
        {stats && (
          <div className="relative border-t border-primary-foreground/15 bg-primary/70 backdrop-blur">
            <div className="container mx-auto px-4 max-w-5xl grid grid-cols-2 md:grid-cols-4 divide-x divide-primary-foreground/15">
              {stats.map((s) => (
                <div key={s.label} className="py-6 px-4 text-center">
                  <div className="font-display text-3xl md:text-4xl text-secondary">{s.value}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-widest text-primary-foreground/70">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      <main>{children}</main>
      <Footer />
    </div>
  );
}

/** Centred intro block with ornament */
export function Lead({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="container mx-auto px-4 max-w-3xl text-center py-16 md:py-24">
      {eyebrow && <p className="uppercase tracking-[0.3em] text-[11px] text-accent font-medium">{eyebrow}</p>}
      <h2 className="font-display text-3xl md:text-5xl mt-3 leading-tight">{title}</h2>
      <div className="mx-auto my-6 flex items-center justify-center gap-3 text-secondary">
        <span className="h-px w-12 bg-secondary/60" /><Leaf className="h-4 w-4" /><span className="h-px w-12 bg-secondary/60" />
      </div>
      {children && <div className="text-muted-foreground text-lg leading-relaxed space-y-4">{children}</div>}
    </div>
  );
}

/** Image + text split, alternating */
export function Split({
  image, eyebrow, title, children, reverse, points,
}: {
  image: string; eyebrow?: string; title: string; children: ReactNode; reverse?: boolean; points?: string[];
}) {
  return (
    <section className="container mx-auto px-4 max-w-6xl py-12 md:py-16">
      <div className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
        <div className="relative">
          <div className="absolute -inset-3 md:-inset-4 rounded-[2rem] border border-secondary/50 translate-x-3 translate-y-3" />
          <img src={image} alt={title} loading="lazy" className="relative rounded-[2rem] aspect-[4/5] md:aspect-[5/6] w-full object-cover shadow-2xl" />
        </div>
        <div>
          {eyebrow && <p className="uppercase tracking-[0.3em] text-[11px] text-accent font-medium">{eyebrow}</p>}
          <h3 className="font-display text-3xl md:text-4xl mt-3 leading-tight">{title}</h3>
          <div className="mt-5 text-muted-foreground leading-relaxed space-y-4">{children}</div>
          {points && (
            <ul className="mt-6 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-secondary shrink-0" />{p}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export type Feature = { icon: ComponentType<{ className?: string }>; title: string; text: string; tag?: string };

export function FeatureGrid({ items, cols = 3, tinted }: { items: Feature[]; cols?: 2 | 3 | 4; tinted?: boolean }) {
  const c = cols === 4 ? "lg:grid-cols-4" : cols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";
  return (
    <div className={tinted ? "bg-muted/60 py-16 md:py-20" : "py-10"}>
      <div className={`container mx-auto px-4 max-w-6xl grid sm:grid-cols-2 ${c} gap-6`}>
        {items.map((f, i) => (
          <div key={f.title} className="group relative rounded-3xl bg-card border p-7 transition duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:border-secondary/60">
            <span className="absolute top-6 right-7 font-display text-4xl text-muted-foreground/15">{String(i + 1).padStart(2, "0")}</span>
            <div className="h-14 w-14 rounded-2xl bg-primary text-secondary grid place-items-center transition group-hover:rotate-6">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl mt-6">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.text}</p>
            {f.tag && <p className="mt-4 text-xs font-medium text-accent">{f.tag}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Timeline({ title, eyebrow, steps }: { title: string; eyebrow?: string; steps: { when: string; title: string; text: string }[] }) {
  return (
    <section className="bg-primary text-primary-foreground py-20 md:py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center">
          {eyebrow && <p className="uppercase tracking-[0.3em] text-[11px] text-secondary">{eyebrow}</p>}
          <h2 className="font-display text-3xl md:text-5xl mt-3">{title}</h2>
        </div>
        <ol className="mt-14 relative border-l border-secondary/40 md:border-l-0 md:grid md:grid-cols-4 md:gap-6">
          <span className="hidden md:block absolute top-5 left-0 right-0 h-px bg-secondary/40" />
          {steps.map((s) => (
            <li key={s.title} className="relative pl-8 pb-10 md:pl-0 md:pb-0">
              <span className="absolute -left-[9px] top-1 md:left-0 md:top-3 h-4 w-4 rounded-full bg-secondary ring-4 ring-primary" />
              <p className="md:mt-12 text-xs uppercase tracking-widest text-secondary">{s.when}</p>
              <h3 className="font-display text-xl mt-2">{s.title}</h3>
              <p className="mt-2 text-sm text-primary-foreground/75 leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Quote({ text, by, image }: { text: string; by: string; image?: string }) {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover bg-fixed" loading="lazy" />}
      <div className="absolute inset-0 bg-primary/80" />
      <blockquote className="relative container mx-auto px-4 max-w-3xl text-center text-primary-foreground">
        <span className="font-display text-7xl text-secondary leading-none">“</span>
        <p className="font-display text-2xl md:text-4xl leading-snug italic -mt-4">{text}</p>
        <footer className="mt-6 text-sm uppercase tracking-widest text-secondary">— {by}</footer>
      </blockquote>
    </section>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section className="container mx-auto px-4 max-w-3xl py-16">
      <h2 className="font-display text-3xl md:text-4xl text-center mb-10">Good to know</h2>
      <div className="divide-y border-y">
        {items.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
              {f.q}
              <span className="h-8 w-8 shrink-0 rounded-full border grid place-items-center text-accent transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function EnquireCta({ text, to = "/contact", label = "Enquire now" }: { text: string; to?: string; label?: string }) {
  return (
    <section className="container mx-auto px-4 max-w-6xl pb-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-primary text-primary-foreground p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-secondary/20 blur-2xl" />
        <div className="relative">
          <p className="uppercase tracking-[0.3em] text-[11px] text-secondary">Plan your visit</p>
          <p className="font-display text-2xl md:text-3xl max-w-xl mt-2">{text}</p>
        </div>
        <Button asChild size="lg" variant="secondary" className="relative rounded-full px-8">
          <Link to={to}>{label} <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  );
}

/* Back-compat helpers used by other pages */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="container mx-auto px-4 max-w-3xl py-8">
      <h2 className="font-display text-2xl md:text-3xl mb-5">{title}</h2>
      <div className="text-muted-foreground leading-relaxed space-y-4">{children}</div>
    </section>
  );
}

export function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <h3 className="font-display text-xl">{title}</h3>
      <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

export function meta(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
