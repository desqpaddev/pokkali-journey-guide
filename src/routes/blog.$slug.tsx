import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header, Footer } from "@/components/app/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, User } from "lucide-react";
import heroPaddy from "@/assets/hero-paddy.jpg";
import heroBackwater from "@/assets/hero-backwater.jpg";
import heroHarvest from "@/assets/hero-harvest.jpg";
import parallaxFields from "@/assets/parallax-fields.jpg";

const RELATED_IMAGES = [heroPaddy, heroBackwater, heroHarvest, parallaxFields];

export const Route = createFileRoute("/blog/$slug")({
  component: BlogDetail,
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center p-8 text-center">
      <div>
        <h1 className="font-display text-2xl">Couldn't load this story</h1>
        <p className="text-muted-foreground mt-2 text-sm">{error.message}</p>
        <Button asChild variant="outline" className="mt-4"><Link to="/blog">Back to blog</Link></Button>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center p-8 text-center">
      <div>
        <h1 className="font-display text-3xl">Story not found</h1>
        <Button asChild variant="outline" className="mt-4"><Link to="/blog">Back to blog</Link></Button>
      </div>
    </div>
  ),
});

function BlogDetail() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <article className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition">
          <ArrowLeft className="h-4 w-4" /> All stories
        </Link>
        {isLoading && <div className="mt-8 space-y-4 animate-pulse"><div className="h-8 bg-muted rounded w-3/4" /><div className="h-64 bg-muted rounded" /></div>}
        {post && (
          <>
            <header className="mt-6">
              <div className="flex flex-wrap gap-1.5">
                {(post.tags ?? []).map((t: string) => <Badge key={t} variant="secondary">{t}</Badge>)}
              </div>
              <h1 className="font-display text-3xl md:text-5xl mt-3 leading-tight">{post.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {post.author_name && <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4" /> {post.author_name}</span>}
                {post.published_at && <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(post.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>}
              </div>
            </header>
            <img
              src={post.cover_image_url || RELATED_IMAGES[0]}
              alt={post.title}
              className="mt-8 rounded-2xl w-full aspect-[16/9] object-cover"
            />
            {post.excerpt && <p className="mt-8 text-lg text-muted-foreground italic leading-relaxed border-l-4 border-secondary pl-4">{post.excerpt}</p>}
            <div className="mt-8 prose prose-lg max-w-none whitespace-pre-wrap leading-relaxed text-foreground/90">
              {post.content}
            </div>
            <div className="mt-12">
              <h3 className="font-display text-xl uppercase tracking-wider mb-4">Related photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {RELATED_IMAGES.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Pokkali fields"
                    loading="lazy"
                    className="aspect-square w-full object-cover rounded-xl hover:scale-105 transition-transform duration-500"
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </article>
      <Footer />
    </div>
  );
}