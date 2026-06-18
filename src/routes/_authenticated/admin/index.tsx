import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, MapPin, ScanLine, Calendar } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Overview,
});

function Overview() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [pk, ds, pr, bk] = await Promise.all([
        supabase.from("packages").select("id", { count: "exact", head: true }),
        supabase.from("destinations").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
      ]);
      return { packages: pk.count ?? 0, destinations: ds.count ?? 0, products: pr.count ?? 0, bookings: bk.count ?? 0 };
    },
  });

  const cards = [
    { label: "Packages", value: data?.packages, icon: Package, to: "/admin/packages" },
    { label: "GPS stops", value: data?.destinations, icon: MapPin, to: "/admin/packages" },
    { label: "Scannable products", value: data?.products, icon: ScanLine, to: "/admin/products" },
    { label: "Bookings", value: data?.bookings, icon: Calendar, to: "/admin/bookings" },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Link key={c.label} to={c.to}>
          <Card className="p-6 hover:border-accent transition-colors">
            <c.icon className="h-6 w-6 text-accent" />
            <div className="font-display text-3xl mt-3">{c.value ?? "—"}</div>
            <div className="text-sm text-muted-foreground">{c.label}</div>
          </Card>
        </Link>
      ))}
      <Card className="sm:col-span-2 lg:col-span-4 p-6 bg-primary text-primary-foreground">
        <h2 className="font-display text-2xl">Quick start</h2>
        <p className="text-primary-foreground/80 text-sm mt-1">Create a package → add GPS stops with stories → add scannable products. Audio can be a pasted URL or auto-generated from the story text in 3 languages.</p>
        <Button asChild variant="hero" className="mt-4"><Link to="/admin/packages">Add a package</Link></Button>
      </Card>
    </div>
  );
}