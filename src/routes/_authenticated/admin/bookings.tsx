import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/bookings")({
  component: BookingsAdmin,
});

function BookingsAdmin() {
  const { data } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*, packages(title)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <Card className="p-0 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-left">
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Tour</th>
            <th className="px-4 py-3">Guest</th>
            <th className="px-4 py-3">Guests</th>
            <th className="px-4 py-3">Language</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((b: any) => (
            <tr key={b.id} className="border-t border-border">
              <td className="px-4 py-3">{b.tour_date}</td>
              <td className="px-4 py-3 font-medium">{b.packages?.title}</td>
              <td className="px-4 py-3">{b.contact_name}<div className="text-xs text-muted-foreground">{b.contact_phone}</div></td>
              <td className="px-4 py-3">{b.num_guests}</td>
              <td className="px-4 py-3 capitalize">{b.preferred_language}</td>
              <td className="px-4 py-3">₹{Number(b.total_amount).toLocaleString()}</td>
              <td className="px-4 py-3"><Badge variant="outline" className="capitalize">{b.status}</Badge></td>
            </tr>
          ))}
          {!data?.length && <tr><td colSpan={7} className="p-12 text-center text-muted-foreground">No bookings yet.</td></tr>}
        </tbody>
      </table>
    </Card>
  );
}