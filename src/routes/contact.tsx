import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell, InfoCard, meta } from "@/components/app/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  head: () => meta("Contact — PAADI Tales", "Enquire about farm tours, products, Village Hub services and water sports at Pokkali Village, Palliyakkal."),
  component: Contact,
});

function Contact() {
  const [f, setF] = useState({ name: "", email: "", phone: "", topic: "Farm Tours", message: "" });
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name || !f.email || !f.message) return toast.error("Please fill name, email and message.");
    const body = encodeURIComponent(`${f.message}\n\n${f.name}\n${f.phone}`);
    window.location.href = `mailto:info@pokkali.in?subject=${encodeURIComponent("Enquiry: " + f.topic)}&body=${body}`;
  };
  return (
    <PageShell eyebrow="Reach us" title="Contact & Enquiries" intro="Tell us what you'd like to experience and we'll get back to you.">
      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={send} className="lg:col-span-2 space-y-4 rounded-2xl border bg-card p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label htmlFor="n">Name</Label><Input id="n" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
            <div><Label htmlFor="e">Email</Label><Input id="e" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
            <div><Label htmlFor="p">Phone</Label><Input id="p" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
            <div>
              <Label htmlFor="t">Interested in</Label>
              <select id="t" className="w-full h-10 rounded-md border bg-background px-3 text-sm" value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })}>
                {["Farm Tours", "Agri-Aqua Products", "Village Hub", "Water Sports", "Other"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div><Label htmlFor="m">Message</Label><Textarea id="m" rows={5} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></div>
          <Button type="submit" className="rounded-full">Send enquiry</Button>
        </form>
        <div className="space-y-5">
          <InfoCard title="Address">Palliyakkal Service Co-operative Bank, Palliyakkal, Ezhikara, Ernakulam, Kerala</InfoCard>
          <InfoCard title="Email">info@pokkali.in</InfoCard>
        </div>
      </div>
    </PageShell>
  );
}
