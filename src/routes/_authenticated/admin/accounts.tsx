import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Download, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/accounts")({
  component: Accounts,
});

const KINDS = ["service_provider", "tour_operator", "farmer", "water_sports_partner", "other"];
const ACTIVITIES = ["farm_tour", "water_sports", "village_hub", "products"];
const inr = (n: number) => "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const today = () => new Date().toISOString().slice(0, 10);

function csv(name: string, rows: (string | number)[][]) {
  const text = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
  a.download = name;
  a.click();
}

async function audit(action: string, entity: string, entity_id?: string, details?: unknown) {
  const { data } = await supabase.auth.getUser();
  await supabase.from("acc_audit_log").insert({
    user_id: data.user?.id, user_email: data.user?.email, action, entity, entity_id, details: details as never,
  });
}

function useData() {
  const settings = useQuery({ queryKey: ["acc-settings"], queryFn: async () => (await supabase.from("acc_settings").select("*").eq("id", 1).maybeSingle()).data });
  const stakeholders = useQuery({ queryKey: ["acc-stake"], queryFn: async () => (await supabase.from("acc_stakeholders").select("*").order("name")).data ?? [] });
  const rules = useQuery({ queryKey: ["acc-rules"], queryFn: async () => (await supabase.from("acc_share_rules").select("*")).data ?? [] });
  return { gst: Number(settings.data?.gst_percent ?? 5), stakeholders: stakeholders.data ?? [], rules: rules.data ?? [] };
}

function useBookings(from: string, to: string) {
  return useQuery({
    queryKey: ["acc-bookings", from, to],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, created_at, tour_date, num_guests, total_amount, status, contact_name, packages(title)")
        .gte("created_at", from + "T00:00:00").lte("created_at", to + "T23:59:59")
        .order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });
}

type Row = { id: string; date: string; activity: string; label: string; status: string; gross: number; tax: number; net: number; shares: Record<string, number>; pscb: number };

function compute(bookings: any[], gst: number, rules: any[]): Row[] {
  return bookings.map((b) => {
    const cancelled = b.status === "cancelled";
    const gross = cancelled ? 0 : Number(b.total_amount);
    const tax = gross * gst / (100 + gst);
    const net = gross - tax;
    const shares: Record<string, number> = {};
    let used = 0;
    rules.filter((r) => r.activity === "farm_tour").forEach((r) => {
      const v = net * Number(r.percent) / 100;
      shares[r.stakeholder_id] = (shares[r.stakeholder_id] ?? 0) + v;
      used += v;
    });
    return { id: b.id, date: b.created_at.slice(0, 10), activity: "farm_tour", label: b.packages?.title ?? "Tour", status: b.status, gross, tax, net, shares, pscb: net - used };
  });
}

function Accounts() {
  return (
    <div>
      <h2 className="font-display text-2xl">PSCB Accounts</h2>
      <p className="text-sm text-muted-foreground mb-6">Collections, stakeholder shares, reconciliation, settlement and audit trail.</p>
      <Tabs defaultValue="statement">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="statement">Daily statement</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settlements">Settlements</TabsTrigger>
          <TabsTrigger value="ledger">Ledger</TabsTrigger>
          <TabsTrigger value="setup">Stakeholders & shares</TabsTrigger>
          <TabsTrigger value="audit">Audit trail</TabsTrigger>
        </TabsList>
        <TabsContent value="statement"><Statement /></TabsContent>
        <TabsContent value="reports"><Reports /></TabsContent>
        <TabsContent value="settlements"><Settlements /></TabsContent>
        <TabsContent value="ledger"><Ledger /></TabsContent>
        <TabsContent value="setup"><Setup /></TabsContent>
        <TabsContent value="audit"><Audit /></TabsContent>
      </Tabs>
    </div>
  );
}

function Range({ from, to, setFrom, setTo }: any) {
  return (
    <div className="flex flex-wrap gap-3 items-end my-4">
      <div><Label>From</Label><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
      <div><Label>To</Label><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border bg-card p-4"><div className="text-xs text-muted-foreground">{label}</div><div className="font-display text-xl mt-1">{value}</div></div>;
}

function Statement() {
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(today());
  const { gst, stakeholders, rules } = useData();
  const { data: bookings = [], isLoading } = useBookings(from, to);
  const rows = useMemo(() => compute(bookings, gst, rules), [bookings, gst, rules]);
  const sh = stakeholders.filter((s) => rules.some((r) => r.stakeholder_id === s.id));
  const sum = (f: (r: Row) => number) => rows.reduce((a, r) => a + f(r), 0);
  const cancelled = rows.filter((r) => r.status === "cancelled").length;

  const exportCsv = () => csv(`statement_${from}_${to}.csv`, [
    ["Booking ID", "Date", "Activity", "Status", "Gross", "Tax", "Net", "PSCB share", ...sh.map((s) => s.name)],
    ...rows.map((r) => [r.id, r.date, r.label, r.status, r.gross.toFixed(2), r.tax.toFixed(2), r.net.toFixed(2), r.pscb.toFixed(2), ...sh.map((s) => (r.shares[s.id] ?? 0).toFixed(2))]),
    ["TOTAL", "", "", "", sum((r) => r.gross).toFixed(2), sum((r) => r.tax).toFixed(2), sum((r) => r.net).toFixed(2), sum((r) => r.pscb).toFixed(2), ...sh.map((s) => sum((r) => r.shares[s.id] ?? 0).toFixed(2))],
  ]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-end">
        <Range {...{ from, to, setFrom, setTo }} />
        <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4" />Export Excel (CSV)</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <Stat label="Bookings" value={`${rows.length} (${cancelled} cancelled)`} />
        <Stat label="Gross collected" value={inr(sum((r) => r.gross))} />
        <Stat label={`GST (${gst}% incl.)`} value={inr(sum((r) => r.tax))} />
        <Stat label="Net for settlement" value={inr(sum((r) => r.net))} />
        <Stat label="PSCB retained" value={inr(sum((r) => r.pscb))} />
      </div>
      {isLoading ? <p>Loading…</p> : rows.length === 0 ? <p className="text-muted-foreground">No transactions in this period.</p> : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left"><tr>
              {["Booking", "Date", "Activity", "Status", "Gross", "Tax", "Net", "PSCB", ...sh.map((s) => s.name)].map((h) => <th key={h} className="p-2 whitespace-nowrap">{h}</th>)}
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2 font-mono text-xs">{r.id.slice(0, 8)}</td><td className="p-2">{r.date}</td><td className="p-2">{r.label}</td><td className="p-2">{r.status}</td>
                  <td className="p-2">{inr(r.gross)}</td><td className="p-2">{inr(r.tax)}</td><td className="p-2">{inr(r.net)}</td><td className="p-2">{inr(r.pscb)}</td>
                  {sh.map((s) => <td key={s.id} className="p-2">{inr(r.shares[s.id] ?? 0)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Reports() {
  const d = new Date();
  const [from, setFrom] = useState(new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10));
  const [to, setTo] = useState(today());
  const { gst, rules } = useData();
  const { data: bookings = [] } = useBookings(from, to);
  const rows = compute(bookings, gst, rules);
  const group = (key: (r: Row) => string) => {
    const m = new Map<string, { n: number; gross: number; tax: number; net: number }>();
    rows.forEach((r) => { const k = key(r); const g = m.get(k) ?? { n: 0, gross: 0, tax: 0, net: 0 }; g.n++; g.gross += r.gross; g.tax += r.tax; g.net += r.net; m.set(k, g); });
    return [...m.entries()];
  };
  const Table = ({ title, data }: { title: string; data: [string, any][] }) => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-display text-lg">{title}</h3>
        <Button size="sm" variant="outline" onClick={() => csv(`${title}_${from}_${to}.csv`, [[title, "Bookings", "Gross", "Tax", "Net"], ...data.map(([k, g]) => [k, g.n, g.gross.toFixed(2), g.tax.toFixed(2), g.net.toFixed(2)])])}><Download className="h-4 w-4" />CSV</Button>
      </div>
      <table className="w-full text-sm border rounded-xl overflow-hidden">
        <thead className="bg-muted text-left"><tr><th className="p-2">{title}</th><th className="p-2">Bookings</th><th className="p-2">Gross</th><th className="p-2">Tax</th><th className="p-2">Net</th></tr></thead>
        <tbody>{data.map(([k, g]) => <tr key={k} className="border-t"><td className="p-2">{k}</td><td className="p-2">{g.n}</td><td className="p-2">{inr(g.gross)}</td><td className="p-2">{inr(g.tax)}</td><td className="p-2">{inr(g.net)}</td></tr>)}</tbody>
      </table>
    </div>
  );
  return (
    <div>
      <Range {...{ from, to, setFrom, setTo }} />
      <Table title="Date" data={group((r) => r.date)} />
      <Table title="Activity" data={group((r) => r.label)} />
      <Table title="Status" data={group((r) => r.status)} />
      <p className="text-xs text-muted-foreground">Water Sports, Village Hub and product sales will appear here once their online booking is live.</p>
    </div>
  );
}

function Settlements() {
  const qc = useQueryClient();
  const d = new Date();
  const [from, setFrom] = useState(new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10));
  const [to, setTo] = useState(today());
  const { gst, stakeholders, rules } = useData();
  const { data: bookings = [] } = useBookings(from, to);
  const { data: list = [] } = useQuery({ queryKey: ["acc-settlements"], queryFn: async () => (await supabase.from("acc_settlements").select("*").order("created_at", { ascending: false })).data ?? [] });
  const name = (id: string) => stakeholders.find((s) => s.id === id)?.name ?? "—";
  const refresh = () => qc.invalidateQueries({ queryKey: ["acc-settlements"] });

  const generate = async () => {
    const rows = compute(bookings, gst, rules);
    const totals: Record<string, number> = {};
    rows.forEach((r) => Object.entries(r.shares).forEach(([k, v]) => (totals[k] = (totals[k] ?? 0) + v)));
    const ids = Object.keys(totals);
    if (!ids.length) return toast.error("No shares to settle. Set up stakeholders and share % first.");
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("acc_settlements").insert(ids.map((id) => ({
      stakeholder_id: id, period_start: from, period_end: to,
      amount_earned: +totals[id].toFixed(2), amount_payable: +totals[id].toFixed(2), created_by: u.user?.id,
    })));
    if (error) return toast.error(error.message);
    await audit("generate", "settlement", undefined, { from, to, stakeholders: ids.length });
    toast.success(`Draft statement created for ${ids.length} stakeholders`);
    refresh();
  };

  const advance = async (s: any, next: string) => {
    const { data: u } = await supabase.auth.getUser();
    const now = new Date().toISOString();
    const patch: any = { status: next };
    if (next === "reconciled") { patch.reconciled_by = u.user?.id; patch.reconciled_at = now; }
    if (next === "approved") {
      if (s.reconciled_by === u.user?.id && !confirm("You reconciled this yourself. Approve anyway?")) return;
      patch.approved_by = u.user?.id; patch.approved_at = now;
    }
    if (next === "paid") {
      const ref = prompt("Bank / UTR reference number");
      if (!ref) return;
      const amt = prompt("Amount paid", String(s.amount_payable));
      if (!amt) return;
      patch.payment_reference = ref; patch.amount_paid = Number(amt); patch.paid_at = today();
      if (Number(amt) < Number(s.amount_payable)) patch.status = "partly_paid";
    }
    const { error } = await supabase.from("acc_settlements").update(patch).eq("id", s.id);
    if (error) return toast.error(error.message);
    await audit(next, "settlement", s.id, patch);
    refresh();
  };

  const adjust = async (s: any) => {
    const v = prompt("Adjustment / deduction amount (negative to deduct)", String(s.adjustments));
    if (v === null) return;
    const adj = Number(v);
    await supabase.from("acc_settlements").update({ adjustments: adj, amount_payable: Number(s.amount_earned) + adj }).eq("id", s.id);
    await audit("adjust", "settlement", s.id, { adjustments: adj });
    refresh();
  };

  const advice = () => csv(`payment_advice_${today()}.csv`, [
    ["Stakeholder", "Bank account", "IFSC", "Period", "Payable"],
    ...list.filter((s) => s.status === "approved").map((s) => {
      const st = stakeholders.find((x) => x.id === s.stakeholder_id);
      return [st?.name ?? "", st?.bank_account ?? "", st?.ifsc ?? "", `${s.period_start} to ${s.period_end}`, Number(s.amount_payable).toFixed(2)];
    }),
  ]);

  const nextStep: Record<string, [string, string] | null> = { draft: ["reconciled", "Reconcile"], reconciled: ["approved", "Approve"], approved: ["paid", "Mark paid"], partly_paid: null, paid: null };

  return (
    <div>
      <p className="text-sm text-muted-foreground mt-4">Workflow: Transaction → Statement → Reconcile → Approve → Pay → Settled. Nothing is final until approved.</p>
      <div className="flex flex-wrap gap-3 items-end">
        <Range {...{ from, to, setFrom, setTo }} />
        <Button className="mb-4" onClick={generate}>Generate stakeholder statement</Button>
        <Button className="mb-4" variant="outline" onClick={advice}><Download className="h-4 w-4" />Payment advice (approved)</Button>
      </div>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left"><tr>{["Stakeholder", "Period", "Earned", "Adjust", "Payable", "Paid", "Status", "Reference", ""].map((h) => <th key={h} className="p-2">{h}</th>)}</tr></thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{name(s.stakeholder_id)}</td><td className="p-2 whitespace-nowrap">{s.period_start} → {s.period_end}</td>
                <td className="p-2">{inr(Number(s.amount_earned))}</td><td className="p-2">{inr(Number(s.adjustments))}</td>
                <td className="p-2">{inr(Number(s.amount_payable))}</td><td className="p-2">{inr(Number(s.amount_paid))}</td>
                <td className="p-2"><span className="rounded-full bg-muted px-2 py-0.5 text-xs">{s.status}</span></td>
                <td className="p-2 text-xs">{s.payment_reference ?? ""}</td>
                <td className="p-2 flex gap-2">
                  {s.status === "draft" && <Button size="sm" variant="ghost" onClick={() => adjust(s)}>Adjust</Button>}
                  {nextStep[s.status] && <Button size="sm" onClick={() => advance(s, nextStep[s.status]![0])}>{nextStep[s.status]![1]}</Button>}
                </td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan={9} className="p-4 text-muted-foreground">No statements yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Ledger() {
  const { stakeholders } = useData();
  const { data: list = [] } = useQuery({ queryKey: ["acc-settlements"], queryFn: async () => (await supabase.from("acc_settlements").select("*").order("created_at", { ascending: false })).data ?? [] });
  const rows = stakeholders.map((s) => {
    const mine = list.filter((x) => x.stakeholder_id === s.id);
    const f = (k: string) => mine.reduce((a, x: any) => a + Number(x[k]), 0);
    const earned = f("amount_earned"), adj = f("adjustments"), payable = f("amount_payable"), paid = f("amount_paid");
    return { s, earned, adj, payable, paid, bal: payable - paid };
  });
  return (
    <div className="mt-4">
      <div className="flex justify-end mb-3">
        <Button variant="outline" onClick={() => csv(`ledger_${today()}.csv`, [["Stakeholder", "Type", "Earned", "Adjustments", "Payable", "Paid", "Balance"], ...rows.map((r) => [r.s.name, r.s.kind, r.earned.toFixed(2), r.adj.toFixed(2), r.payable.toFixed(2), r.paid.toFixed(2), r.bal.toFixed(2)])])}><Download className="h-4 w-4" />Export</Button>
      </div>
      <table className="w-full text-sm border rounded-xl overflow-hidden">
        <thead className="bg-muted text-left"><tr>{["Stakeholder", "Type", "Earned", "Adjustments", "Payable", "Paid", "Balance pending"].map((h) => <th key={h} className="p-2">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.s.id} className="border-t"><td className="p-2">{r.s.name}</td><td className="p-2">{r.s.kind.replace(/_/g, " ")}</td><td className="p-2">{inr(r.earned)}</td><td className="p-2">{inr(r.adj)}</td><td className="p-2">{inr(r.payable)}</td><td className="p-2">{inr(r.paid)}</td><td className="p-2 font-semibold">{inr(r.bal)}</td></tr>
        ))}</tbody>
      </table>
    </div>
  );
}

function Setup() {
  const qc = useQueryClient();
  const { gst, stakeholders, rules } = useData();
  const [f, setF] = useState({ name: "", kind: KINDS[0], bank_account: "", ifsc: "", contact: "" });
  const [gstV, setGstV] = useState<string>("");
  const inv = () => ["acc-stake", "acc-rules", "acc-settings"].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));

  const add = async () => {
    if (!f.name) return toast.error("Name required");
    const { data, error } = await supabase.from("acc_stakeholders").insert(f).select().single();
    if (error) return toast.error(error.message);
    await audit("create", "stakeholder", data.id, f);
    setF({ name: "", kind: KINDS[0], bank_account: "", ifsc: "", contact: "" }); inv();
  };
  const setRule = async (stakeholder_id: string, activity: string, percent: number) => {
    const ex = rules.find((r) => r.stakeholder_id === stakeholder_id && r.activity === activity);
    if (ex) await supabase.from("acc_share_rules").update({ percent }).eq("id", ex.id);
    else await supabase.from("acc_share_rules").insert({ stakeholder_id, activity, percent });
    await audit("set_share", "share_rule", stakeholder_id, { activity, percent }); inv();
  };
  const remove = async (id: string) => {
    if (!confirm("Remove this stakeholder and its share rules?")) return;
    await supabase.from("acc_stakeholders").delete().eq("id", id);
    await audit("delete", "stakeholder", id); inv();
  };
  const saveGst = async () => {
    await supabase.from("acc_settings").update({ gst_percent: Number(gstV), updated_at: new Date().toISOString() }).eq("id", 1);
    await audit("set_gst", "settings", "1", { gst: gstV }); toast.success("Saved"); inv();
  };
  const totalFor = (a: string) => rules.filter((r) => r.activity === a).reduce((s, r) => s + Number(r.percent), 0);

  return (
    <div className="mt-4 space-y-8">
      <div className="flex items-end gap-3">
        <div><Label>GST % (included in price)</Label><Input type="number" placeholder={String(gst)} value={gstV} onChange={(e) => setGstV(e.target.value)} className="w-32" /></div>
        <Button onClick={saveGst} disabled={!gstV}>Save</Button>
        <span className="text-sm text-muted-foreground">Current: {gst}%</span>
      </div>

      <div className="rounded-xl border p-4">
        <h3 className="font-display text-lg mb-3">Add stakeholder</h3>
        <div className="grid md:grid-cols-6 gap-3 items-end">
          <div className="md:col-span-2"><Label>Name</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div><Label>Type</Label><select className="w-full h-9 rounded-md border bg-background px-2 text-sm" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}>{KINDS.map((k) => <option key={k} value={k}>{k.replace(/_/g, " ")}</option>)}</select></div>
          <div><Label>Bank A/c</Label><Input value={f.bank_account} onChange={(e) => setF({ ...f, bank_account: e.target.value })} /></div>
          <div><Label>IFSC</Label><Input value={f.ifsc} onChange={(e) => setF({ ...f, ifsc: e.target.value })} /></div>
          <Button onClick={add}>Add</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <h3 className="font-display text-lg mb-1">Revenue share % of net amount</h3>
        <p className="text-xs text-muted-foreground mb-3">Whatever is not assigned stays with PSCB.</p>
        <table className="w-full text-sm border rounded-xl overflow-hidden">
          <thead className="bg-muted text-left"><tr><th className="p-2">Stakeholder</th>{ACTIVITIES.map((a) => <th key={a} className="p-2">{a.replace(/_/g, " ")}</th>)}<th /></tr></thead>
          <tbody>
            {stakeholders.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.name}<div className="text-xs text-muted-foreground">{s.kind.replace(/_/g, " ")}</div></td>
                {ACTIVITIES.map((a) => {
                  const r = rules.find((x) => x.stakeholder_id === s.id && x.activity === a);
                  return <td key={a} className="p-2"><Input type="number" className="w-20" defaultValue={r ? Number(r.percent) : ""} onBlur={(e) => e.target.value !== "" && Number(e.target.value) !== Number(r?.percent) && setRule(s.id, a, Number(e.target.value))} /></td>;
                })}
                <td className="p-2"><Button size="icon" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4" /></Button></td>
              </tr>
            ))}
            <tr className="border-t bg-muted/50"><td className="p-2 font-medium">PSCB retains</td>{ACTIVITIES.map((a) => <td key={a} className={`p-2 font-medium ${totalFor(a) > 100 ? "text-destructive" : ""}`}>{(100 - totalFor(a)).toFixed(1)}%</td>)}<td /></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Audit() {
  const { data = [] } = useQuery({ queryKey: ["acc-audit"], queryFn: async () => (await supabase.from("acc_audit_log").select("*").order("created_at", { ascending: false }).limit(300)).data ?? [] });
  return (
    <table className="w-full text-sm border rounded-xl overflow-hidden mt-4">
      <thead className="bg-muted text-left"><tr>{["When", "Who", "Action", "Item", "Details"].map((h) => <th key={h} className="p-2">{h}</th>)}</tr></thead>
      <tbody>{data.map((a) => (
        <tr key={a.id} className="border-t align-top"><td className="p-2 whitespace-nowrap">{new Date(a.created_at).toLocaleString("en-IN")}</td><td className="p-2">{a.user_email}</td><td className="p-2">{a.action}</td><td className="p-2">{a.entity}</td><td className="p-2 text-xs font-mono break-all">{a.details ? JSON.stringify(a.details) : ""}</td></tr>
      ))}
      {!data.length && <tr><td colSpan={5} className="p-4 text-muted-foreground">No activity yet.</td></tr>}</tbody>
    </table>
  );
}
