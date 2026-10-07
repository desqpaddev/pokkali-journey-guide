import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/app/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/agent/apply")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Become a Tour Agent — Pokkali Village" }, { name: "robots", content: "noindex" }] }),
  component: Apply,
});

function Apply() {
  const navigate = useNavigate();
  const { data: existing, isLoading } = useQuery({
    queryKey: ["my-agent"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await supabase.from("agents").select("*").eq("user_id", u.user!.id).maybeSingle();
      return data;
    },
  });
  const [f, setF] = useState({ agency_name: "", phone: "", gst_no: "", address: "" });
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!f.agency_name.trim() || !f.phone.trim()) return toast.error("Agency name and phone are required");
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("agents").insert({ ...f, user_id: u.user!.id });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Application sent. We'll review it soon.");
    navigate({ to: "/agent" });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <h1 className="font-display text-4xl">Become a tour agent</h1>
        <p className="text-muted-foreground mt-2">Sell Pokkali Village tours with your own markup. Every agent is reviewed by our team.</p>
        {isLoading ? null : existing ? (
          <Card className="p-6 mt-6">
            <p>You've already applied as <b>{existing.agency_name}</b>. Status: <b className="capitalize">{existing.status}</b>.</p>
            <Button asChild className="mt-4"><Link to="/agent">Go to agent dashboard</Link></Button>
          </Card>
        ) : (
          <Card className="p-6 mt-6 space-y-4">
            {([["agency_name", "Agency name *"], ["phone", "Phone *"], ["gst_no", "GST number (optional)"], ["address", "Address"]] as const).map(([k, l]) => (
              <div key={k}>
                <Label className="text-xs">{l}</Label>
                <Input className="mt-1" value={f[k]} maxLength={200} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
              </div>
            ))}
            <Button onClick={submit} disabled={busy} variant="hero" className="w-full">{busy ? "Sending…" : "Apply"}</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
