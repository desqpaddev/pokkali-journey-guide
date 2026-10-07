import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/app/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, Briefcase } from "lucide-react";
import { createAgentBooking } from "@/lib/agents.functions";
import { agentPrice, downloadCsv } from "@/lib/agent-utils";

export const Route = createFileRoute("/_authenticated/agent/")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Agent Dashboard — Pokkali Village" }, { name: "robots", content: "noindex" }] }),
  component: AgentDashboard,
});

const statusColor: Record<string, string> = { approved: "bg-primary", pending: "bg-secondary text-secondary-foreground", rejected: "bg-destructive" };

function AgentDashboard() {
  const { data: agent, isLoading } = useQuery({
    queryKey: ["my-agent"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await supabase.from("agents").select("*").eq("user_id", u.user!.id).maybeSingle();
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent font-semibold"><Briefcase className="h-4 w-4" /> Agent</div>
        {isLoading ? <p className="mt-4">Loading…</p> : !agent ? (
          <Card className="p-8 mt-4 text-center">
            <p>You're not registered as an agent yet.</p>
            <Button asChild variant="hero" className="mt-4"><Link to="/agent/apply">Apply to become an agent</Link></Button>
          </Card>
        ) : agent.status !== "approved" ? (
          <Card className="p-8 mt-4">
            <h1 className="font-display text-3xl">{agent.agency_name}</h1>
            <p className="mt-2">Your application status is <b className="capitalize">{agent.status}</b>. {agent.status === "pending" && "We'll review it shortly."}</p>
          </Card>
        ) : (
          <>
            <h1 className="font-display text-4xl">{agent.agency_name}</h1>
            <p className="text-sm text-muted-foreground">Agent code: <b>{agent.code}</b></p>
            <Tabs defaultValue="prices" className="mt-6">
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="prices">My prices & links</TabsTrigger>
                <TabsTrigger value="book">Book for customer</TabsTrigger>
                <TabsTrigger value="sales">My sales</TabsTrigger>
              </TabsList>
              <TabsContent value="prices"><Prices agentId={agent.id} code={agent.code} /></TabsContent>
              <TabsContent value="book"><BookForCustomer agentId={agent.id} /></TabsContent>
              <TabsContent value="sales"><Sales agentId={agent.id} /></TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}

function useAgentData(agentId: string) {
  return useQuery({
    queryKey: ["agent-markups", agentId],
    queryFn: async () => {
      const [{ data: pkgs }, { data: m }] = await Promise.all([
        supabase.from("packages").select("id,title,slug,price_per_person,max_group_size").eq("is_active", true).order("title"),
        supabase.from("agent_markups").select("*").eq("agent_id", agentId),
      ]);
      return { pkgs: pkgs ?? [], markups: m ?? [] };
    },
  });
}

function Prices({ agentId, code }: { agentId: string; code: string }) {
  const { data } = useAgentData(agentId);
  return (
    <div className="grid md:grid-cols-2 gap-4 mt-4">
      {data?.pkgs.map((p) => (
        <MarkupCard key={p.id} pkg={p} agentId={agentId} code={code} markup={data.markups.find((m) => m.package_id === p.id)} />
      ))}
    </div>
  );
}

function MarkupCard({ pkg, agentId, code, markup }: any) {
  const qc = useQueryClient();
  const [type, setType] = useState<string>(markup?.markup_type ?? "fixed");
  const [value, setValue] = useState<number>(Number(markup?.markup_value ?? 0));
  const base = Number(pkg.price_per_person);
  const link = typeof window !== "undefined" ? `${window.location.origin}/packages/${pkg.slug}?agent=${code}` : "";

  async function save() {
    if (value < 0) return toast.error("Markup can't be negative");
    const { error } = await supabase.from("agent_markups").upsert(
      { agent_id: agentId, package_id: pkg.id, markup_type: type, markup_value: value },
      { onConflict: "agent_id,package_id" },
    );
    if (error) return toast.error(error.message);
    toast.success("Sent for admin approval");
    qc.invalidateQueries({ queryKey: ["agent-markups", agentId] });
  }

  return (
    <Card className="p-5">
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-semibold">{pkg.title}</h3>
        {markup && <Badge className={`capitalize ${statusColor[markup.status] ?? ""}`}>{markup.status}</Badge>}
      </div>
      <p className="text-xs text-muted-foreground">Base ₹{base.toLocaleString()} / guest</p>
      {markup?.admin_note && <p className="text-xs mt-1 text-destructive">Admin note: {markup.admin_note}</p>}
      <div className="flex gap-2 mt-3">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="fixed">Fixed ₹ / guest</SelectItem><SelectItem value="percent">Percent %</SelectItem></SelectContent>
        </Select>
        <Input type="number" min={0} value={value} onChange={(e) => setValue(Number(e.target.value))} />
      </div>
      <div className="mt-2 text-sm">Your selling price: <b>₹{agentPrice(base, type, value).toLocaleString()}</b> / guest</div>
      <div className="flex gap-2 mt-3 flex-wrap">
        <Button size="sm" onClick={save}>{markup ? "Update markup" : "Submit markup"}</Button>
        {markup?.status === "approved" && (
          <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(link); toast.success("Link copied"); }}>
            <Copy className="h-3 w-3 mr-1" /> Copy share link
          </Button>
        )}
      </div>
    </Card>
  );
}

function BookForCustomer({ agentId }: { agentId: string }) {
  const { data } = useAgentData(agentId);
  const qc = useQueryClient();
  const book = useServerFn(createAgentBooking);
  const [f, setF] = useState({ packageId: "", tourDate: "", guests: 2, contactName: "", contactPhone: "", contactEmail: "" });
  const [busy, setBusy] = useState(false);
  const approved = data?.pkgs.filter((p) => data.markups.some((m) => m.package_id === p.id && m.status === "approved")) ?? [];
  const pkg = approved.find((p) => p.id === f.packageId);
  const m = data?.markups.find((x) => x.package_id === f.packageId);
  const per = pkg && m ? agentPrice(Number(pkg.price_per_person), m.markup_type, Number(m.markup_value)) : 0;

  async function submit() {
    if (!f.packageId || !f.tourDate || !f.contactName) return toast.error("Pick a tour, date and customer name");
    setBusy(true);
    try {
      await book({ data: { mode: "agent", ...f, contactEmail: f.contactEmail || undefined, language: "english" } });
      toast.success("Booking sent for admin approval");
      setF({ ...f, contactName: "", contactPhone: "", contactEmail: "" });
      qc.invalidateQueries({ queryKey: ["agent-sales", agentId] });
    } catch (e: any) {
      toast.error(e.message);
    }
    setBusy(false);
  }

  if (!approved.length) return <Card className="p-6 mt-4 text-muted-foreground">You need at least one approved markup before booking.</Card>;
  return (
    <Card className="p-6 mt-4 max-w-xl space-y-3">
      <div>
        <Label className="text-xs">Tour</Label>
        <Select value={f.packageId} onValueChange={(v) => setF({ ...f, packageId: v })}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="Choose a tour" /></SelectTrigger>
          <SelectContent>{approved.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs">Date</Label><Input type="date" className="mt-1" min={new Date().toISOString().slice(0, 10)} value={f.tourDate} onChange={(e) => setF({ ...f, tourDate: e.target.value })} /></div>
        <div><Label className="text-xs">Guests</Label><Input type="number" min={1} className="mt-1" value={f.guests} onChange={(e) => setF({ ...f, guests: Math.max(1, Number(e.target.value)) })} /></div>
      </div>
      <div><Label className="text-xs">Customer name</Label><Input className="mt-1" value={f.contactName} onChange={(e) => setF({ ...f, contactName: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs">Phone</Label><Input className="mt-1" value={f.contactPhone} onChange={(e) => setF({ ...f, contactPhone: e.target.value })} /></div>
        <div><Label className="text-xs">Email</Label><Input type="email" className="mt-1" value={f.contactEmail} onChange={(e) => setF({ ...f, contactEmail: e.target.value })} /></div>
      </div>
      <div className="flex justify-between border-t border-border pt-3"><span className="text-sm text-muted-foreground">Total</span><b className="font-display text-2xl">₹{(per * f.guests).toLocaleString()}</b></div>
      <Button onClick={submit} disabled={busy} variant="hero" className="w-full">{busy ? "Sending…" : "Submit booking"}</Button>
    </Card>
  );
}

function Sales({ agentId }: { agentId: string }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const { data } = useQuery({
    queryKey: ["agent-sales", agentId],
    queryFn: async () => {
      const { data } = await supabase.from("bookings").select("*, packages(title)").eq("agent_id", agentId).order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  const rows = (data ?? []).filter((b: any) => (!from || b.tour_date >= from) && (!to || b.tour_date <= to));
  const sum = (k: string) => rows.filter((b: any) => b.status === "confirmed").reduce((s: number, b: any) => s + Number(b[k] ?? 0), 0);
  return (
    <div className="mt-4 space-y-4">
      <div className="flex gap-2 flex-wrap items-end">
        <div><Label className="text-xs">From</Label><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div><Label className="text-xs">To</Label><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        <Button variant="outline" onClick={() => downloadCsv("my-sales.csv", [["Date", "Tour", "Customer", "Guests", "Status", "Base", "Markup", "Total"], ...rows.map((b: any) => [b.tour_date, b.packages?.title, b.contact_name, b.num_guests, b.status, b.base_amount, b.markup_amount, b.total_amount])])}>Export CSV</Button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Confirmed sales</div><div className="font-display text-2xl">₹{sum("total_amount").toLocaleString()}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Base</div><div className="font-display text-2xl">₹{sum("base_amount").toLocaleString()}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Your markup</div><div className="font-display text-2xl">₹{sum("markup_amount").toLocaleString()}</div></Card>
      </div>
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left"><tr>{["Date", "Tour", "Customer", "Guests", "Via", "Status", "Markup", "Total"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((b: any) => (
              <tr key={b.id} className="border-t border-border">
                <td className="p-3">{b.tour_date}</td><td className="p-3">{b.packages?.title}</td><td className="p-3">{b.contact_name}</td>
                <td className="p-3">{b.num_guests}</td><td className="p-3">{b.booked_by_agent ? "Direct" : "Link"}</td>
                <td className="p-3 capitalize">{b.status.replace("_", " ")}</td>
                <td className="p-3">₹{Number(b.markup_amount ?? 0).toLocaleString()}</td><td className="p-3">₹{Number(b.total_amount).toLocaleString()}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No sales yet.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
