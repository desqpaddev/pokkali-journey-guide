import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { agentPrice, downloadCsv } from "@/lib/agent-utils";

export const Route = createFileRoute("/_authenticated/admin/agents")({
  staticData: { sitemap: false },
  component: AgentsAdmin,
});

async function me() {
  return (await supabase.auth.getUser()).data.user!;
}

function AgentsAdmin() {
  return (
    <div>
      <h2 className="font-display text-2xl">Tour agents</h2>
      <p className="text-sm text-muted-foreground">Approve agents, their markups and every agent booking.</p>
      <Tabs defaultValue="apps" className="mt-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="apps">Applications</TabsTrigger>
          <TabsTrigger value="markups">Markups</TabsTrigger>
          <TabsTrigger value="bookings">Agent bookings</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
        </TabsList>
        <TabsContent value="apps"><Applications /></TabsContent>
        <TabsContent value="markups"><Markups /></TabsContent>
        <TabsContent value="bookings"><AgentBookings /></TabsContent>
        <TabsContent value="report"><Report /></TabsContent>
      </Tabs>
    </div>
  );
}

function Applications() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-agents"],
    queryFn: async () => (await supabase.from("agents").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  async function setStatus(id: string, status: string) {
    const u = await me();
    const { error } = await supabase.from("agents").update({ status, approved_by: u.id, approved_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Agent ${status}`);
    qc.invalidateQueries({ queryKey: ["admin-agents"] });
  }
  return (
    <Card className="p-0 overflow-x-auto mt-4">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left"><tr>{["Agency", "Code", "Phone", "GST", "Status", ""].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
        <tbody>
          {data?.map((a) => (
            <tr key={a.id} className="border-t border-border">
              <td className="p-3"><b>{a.agency_name}</b><div className="text-xs text-muted-foreground">{a.address}</div></td>
              <td className="p-3">{a.code}</td><td className="p-3">{a.phone}</td><td className="p-3">{a.gst_no || "—"}</td>
              <td className="p-3"><Badge variant="outline" className="capitalize">{a.status}</Badge></td>
              <td className="p-3 text-right space-x-2 whitespace-nowrap">
                {a.status !== "approved" && <Button size="sm" onClick={() => setStatus(a.id, "approved")}>Approve</Button>}
                {a.status === "pending" && <Button size="sm" variant="outline" onClick={() => setStatus(a.id, "rejected")}>Reject</Button>}
                {a.status === "approved" && <Button size="sm" variant="outline" onClick={() => setStatus(a.id, "suspended")}>Suspend</Button>}
              </td>
            </tr>
          ))}
          {!data?.length && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No agent applications yet.</td></tr>}
        </tbody>
      </table>
    </Card>
  );
}

function Markups() {
  const qc = useQueryClient();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const { data } = useQuery({
    queryKey: ["admin-markups"],
    queryFn: async () =>
      (await supabase.from("agent_markups").select("*, agents(agency_name), packages(title, price_per_person)").order("created_at", { ascending: false })).data ?? [],
  });
  async function review(id: string, status: string) {
    const u = await me();
    const { error } = await supabase.from("agent_markups").update({ status, admin_note: notes[id] || null, reviewed_by: u.id, reviewed_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Markup ${status}`);
    qc.invalidateQueries({ queryKey: ["admin-markups"] });
  }
  const sorted = [...(data ?? [])].sort((a: any, b: any) => (a.status === "pending" ? -1 : 0) - (b.status === "pending" ? -1 : 0));
  return (
    <div className="grid md:grid-cols-2 gap-4 mt-4">
      {sorted.map((m: any) => {
        const base = Number(m.packages?.price_per_person ?? 0);
        return (
          <Card key={m.id} className="p-4">
            <div className="flex justify-between"><b>{m.agents?.agency_name}</b><Badge variant="outline" className="capitalize">{m.status}</Badge></div>
            <div className="text-sm">{m.packages?.title}</div>
            <div className="text-sm mt-1">Base ₹{base} + {m.markup_type === "percent" ? `${m.markup_value}%` : `₹${m.markup_value}`} = <b>₹{agentPrice(base, m.markup_type, Number(m.markup_value))}</b> / guest</div>
            <Input className="mt-2" placeholder="Note to agent (optional)" value={notes[m.id] ?? ""} onChange={(e) => setNotes({ ...notes, [m.id]: e.target.value })} />
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={() => review(m.id, "approved")}>Approve</Button>
              <Button size="sm" variant="outline" onClick={() => review(m.id, "rejected")}>Reject</Button>
            </div>
          </Card>
        );
      })}
      {!sorted.length && <p className="text-muted-foreground">No markup requests.</p>}
    </div>
  );
}

function AgentBookings() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-agent-bookings"],
    queryFn: async () =>
      (await supabase.from("bookings").select("*, packages(title), agents(agency_name)").not("agent_id", "is", null).order("created_at", { ascending: false })).data ?? [],
  });
  async function decide(b: any, status: "confirmed" | "rejected") {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", b.id);
    if (error) return toast.error(error.message);
    if (status === "confirmed" && b.contact_email) {
      const { data: s } = await supabase.auth.getSession();
      fetch("/lovable/email/transactional/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${s.session?.access_token}` },
        body: JSON.stringify({
          templateName: "booking-confirmation",
          recipientEmail: b.contact_email,
          idempotencyKey: `booking-confirm-${b.id}`,
          templateData: { guestName: b.contact_name, packageTitle: b.packages?.title, tourDate: b.tour_date, guests: b.num_guests, bookingId: b.id, totalAmount: `₹${Number(b.total_amount).toLocaleString()}` },
        }),
      }).catch(() => toast.error("Booking confirmed, but the email could not be sent"));
    }
    toast.success(`Booking ${status}`);
    qc.invalidateQueries({ queryKey: ["admin-agent-bookings"] });
  }
  return (
    <Card className="p-0 overflow-x-auto mt-4">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left"><tr>{["Date", "Tour", "Agent", "Customer", "Guests", "Via", "Total", "Status", ""].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
        <tbody>
          {data?.map((b: any) => (
            <tr key={b.id} className="border-t border-border">
              <td className="p-3">{b.tour_date}</td><td className="p-3">{b.packages?.title}</td><td className="p-3">{b.agents?.agency_name}</td>
              <td className="p-3">{b.contact_name}<div className="text-xs text-muted-foreground">{b.contact_phone}</div></td>
              <td className="p-3">{b.num_guests}</td><td className="p-3">{b.booked_by_agent ? "Direct" : "Link"}</td>
              <td className="p-3">₹{Number(b.total_amount).toLocaleString()}</td>
              <td className="p-3 capitalize">{b.status.replace("_", " ")}</td>
              <td className="p-3 text-right whitespace-nowrap space-x-2">
                {b.status === "pending_approval" && (<>
                  <Button size="sm" onClick={() => decide(b, "confirmed")}>Confirm</Button>
                  <Button size="sm" variant="outline" onClick={() => decide(b, "rejected")}>Reject</Button>
                </>)}
              </td>
            </tr>
          ))}
          {!data?.length && <tr><td colSpan={9} className="p-6 text-center text-muted-foreground">No agent bookings yet.</td></tr>}
        </tbody>
      </table>
    </Card>
  );
}

function Report() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const { data } = useQuery({
    queryKey: ["admin-agent-report"],
    queryFn: async () =>
      (await supabase.from("bookings").select("tour_date, num_guests, base_amount, markup_amount, total_amount, status, agents(agency_name)").not("agent_id", "is", null).eq("status", "confirmed")).data ?? [],
  });
  const map = new Map<string, { n: number; g: number; base: number; mk: number; tot: number }>();
  (data ?? []).filter((b: any) => (!from || b.tour_date >= from) && (!to || b.tour_date <= to)).forEach((b: any) => {
    const k = b.agents?.agency_name ?? "—";
    const r = map.get(k) ?? { n: 0, g: 0, base: 0, mk: 0, tot: 0 };
    r.n++; r.g += b.num_guests; r.base += Number(b.base_amount ?? 0); r.mk += Number(b.markup_amount ?? 0); r.tot += Number(b.total_amount);
    map.set(k, r);
  });
  const rows = [...map.entries()];
  return (
    <div className="mt-4 space-y-3">
      <div className="flex gap-2 items-end flex-wrap">
        <div><Label className="text-xs">From</Label><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div><Label className="text-xs">To</Label><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        <Button variant="outline" onClick={() => downloadCsv("agent-report.csv", [["Agent", "Bookings", "Guests", "Base", "Markup", "Total"], ...rows.map(([k, r]) => [k, r.n, r.g, r.base, r.mk, r.tot])])}>Export CSV</Button>
      </div>
      <Card className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left"><tr>{["Agent", "Bookings", "Guests", "Base revenue", "Markup", "Total"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map(([k, r]) => (
              <tr key={k} className="border-t border-border"><td className="p-3">{k}</td><td className="p-3">{r.n}</td><td className="p-3">{r.g}</td><td className="p-3">₹{r.base.toLocaleString()}</td><td className="p-3">₹{r.mk.toLocaleString()}</td><td className="p-3">₹{r.tot.toLocaleString()}</td></tr>
            ))}
            {!rows.length && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No confirmed agent sales in this period.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
