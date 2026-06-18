import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/app/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, ArrowRight, Wheat } from "lucide-react";

export const Route = createFileRoute("/_authenticated/bookings")({
  component: Bookings,
});

function Bookings() {
  const { data } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, packages(title, slug, hero_image_url, category)")
        .order("tour_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-4xl">My Tours</h1>
            <p className="text-muted-foreground mt-1">Your upcoming and past circuits.</p>
          </div>
          <Button asChild variant="outline"><Link to="/">Browse tours</Link></Button>
        </div>
        {!data?.length ? (
          <Card className="p-12 text-center">
            <Wheat className="h-8 w-8 mx-auto text-accent" />
            <p className="mt-3 text-muted-foreground">No bookings yet.</p>
            <Button asChild className="mt-4" variant="hero"><Link to="/">Find a tour</Link></Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {data.map((b: any) => (
              <Card key={b.id} className="overflow-hidden">
                {b.packages?.hero_image_url && (
                  <img src={b.packages.hero_image_url} alt="" className="h-40 w-full object-cover" />
                )}
                <div className="p-5">
                  <Badge className="capitalize mb-2">{b.status}</Badge>
                  <h3 className="font-display text-2xl">{b.packages?.title ?? "Tour"}</h3>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{b.tour_date}</span>
                    <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" />{b.num_guests} guests</span>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div className="font-display text-xl">₹{Number(b.total_amount).toLocaleString()}</div>
                    <Button asChild variant="hero">
                      <Link to="/tour/$bookingId" params={{ bookingId: b.id }}>
                        <MapPin className="h-4 w-4" /> Start tour <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}