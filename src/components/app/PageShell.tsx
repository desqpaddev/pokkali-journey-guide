import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Header, Footer } from "@/components/app/Header";
import { Button } from "@/components/ui/button";

export function PageShell({
  eyebrow,
  title,
  intro,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  image?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />}
        <div className="relative container mx-auto px-4 py-20 md:py-28 max-w-4xl">
          <p className="uppercase tracking-[0.3em] text-xs text-secondary">{eyebrow}</p>
          <h1 className="font-display text-4xl md:text-6xl mt-4 leading-tight">{title}</h1>
          <p className="mt-5 text-lg text-primary-foreground/85 max-w-2xl">{intro}</p>
        </div>
      </section>
      <main className="container mx-auto px-4 py-14 md:py-20">{children}</main>
      <Footer />
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-14">
      <h2 className="font-display text-2xl md:text-3xl mb-5">{title}</h2>
      <div className="text-muted-foreground leading-relaxed space-y-4 max-w-3xl">{children}</div>
    </section>
  );
}

export function EnquireCta({ text }: { text: string }) {
  return (
    <div className="rounded-3xl bg-muted p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
      <p className="font-display text-xl md:text-2xl max-w-xl">{text}</p>
      <Button asChild size="lg" className="rounded-full">
        <Link to="/contact">Enquire now</Link>
      </Button>
    </div>
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
