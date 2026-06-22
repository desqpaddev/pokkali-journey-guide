import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header, Footer } from "@/components/app/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewsletterForm } from "@/components/app/NewsletterForm";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Stories from the Fields — Pokkali Village Blog" },
      { name: "description", content: "Reflections, recipes, and farmer stories from the Pokkali heritage backwaters of Kerala." },
      { property: "og:title", content: "Stories from the Fields — Pokkali Village Blog" },
      { property: "og:description", content: "Reflections, recipes, and farmer stories from Kerala's Pokkali heritage." },
    ],
  }),
  component: BlogList,
});

function BlogList() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blogs", "public"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("blogs")
        .select("id, slug, title, excerpt, cover_image_url, author_name, tags, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl">
          <div className="text-sm font-display italic text-primary">From the Backwaters</div>
          <h1 className="font-display text-4xl md:text-5xl mt-2 uppercase leading-tight">Stories from the Fields</h1>
          <p className="text-muted-foreground mt-4">Reflections, recipes, and farmer voices — the slow journal of Kerala's heritage Pokkali grain.</p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-muted" />
              <div className="p-5 space-y-3"><div className="h-4 bg-muted rounded w-3/4" /><div className="h-3 bg-muted rounded" /></div>
            </Card>
          ))}
          {!isLoading && posts?.length === 0 && (
            <Card className="md:col-span-2 lg:col-span-3 p-12 text-center text-muted-foreground">
              <BookOpen className="h-8 w-8 mx-auto text-accent" />
              <p className="mt-3">No stories published yet. Check back soon.</p>
            </Card>
          )}
          {posts?.map((p: any) => (
            <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group">
              <Card className="overflow-hidden h-full hover:shadow-xl transition-shadow border-l-4 border-l-secondary">
                {p.cover_image_url ? (
                  <img src={p.cover_image_url} alt={p.title} loading="lazy" className="aspect-[4/3] w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/30 grid place-items-center">
                    <BookOpen className="h-12 w-12 text-primary/40" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(p.tags ?? []).slice(0, 2).map((t: string) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                  </div>
                  <h2 className="font-display text-xl group-hover:text-primary transition-colors">{p.title}</h2>
                  {p.excerpt && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{p.excerpt}</p>}
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {p.published_at ? new Date(p.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-primary font-medium">Read <ArrowRight className="h-3.5 w-3.5" /></span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="mt-16 p-8 md:p-12 bg-primary text-primary-foreground border-0">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="text-sm font-display italic text-secondary">Stay Close to the Grain</div>
              <h3 className="font-display text-2xl md:text-3xl mt-2 uppercase">Join our newsletter</h3>
              <p className="text-primary-foreground/80 text-sm mt-3">New stories, seasonal tour openings, and farmer dispatches — once a month, never spam.</p>
            </div>
            <NewsletterForm variant="inline" />
          </div>
        </Card>
      </section>
      <Footer />
    </div>
  );
}