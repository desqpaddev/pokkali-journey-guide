import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header, Footer } from "@/components/app/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Users, Languages, ArrowLeft, MapPin } from "lucide-react";
import { LANG_LABEL, type Lang } from "@/lib/geo";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import hero from "@/assets/hero-paddy.jpg";

export const Route = createFileRoute("/packages/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Pokkali Village Tour` },
      { name: "description", content: "Book this heritage circuit tour." },
    ],
  }),
  component: PackageDetail,
});

function PackageDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["package", slug],
    queryFn: async () => {
      const { data: pkg } = await supabase.from("packages").select("*").eq("slug", slug).maybeSingle();
      if (!pkg) return null;
      const [{ data: steps }, { data: dests }] = await Promise.all([
        supabase.from("itinerary_steps").select("*").eq("package_id", pkg.id).order("step_order"),
        supabase.from("destinations").select("id,name,stop_order").eq("package_id", pkg.id).order("stop_order"),
      ]);
      return { pkg, steps: steps ?? [], dests: dests ?? [] };
    },
  });

  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [lang, setLang] = useState<Lang>("english");
  const [busy, setBusy] = useState(false);

  if (isLoading) return <div className="min-h-screen bg-background"><Header /><div className="container mx-auto px-4 py-16">Loading…</div></div>;
  if (!data?.pkg) return <div className="min-h-screen bg-background"><Header /><div className="container mx-auto px-4 py-16">Tour not found. <Link to="/" className="text-primary underline">Go home</Link></div></div>;

  const { pkg, steps, dests } = data;
  const total = guests * Number(pkg.price_per_person);

  async function book() {
    if (!user) {
      toast.info("Please sign in to book");
      navigate({ to: "/auth" });
      return;
    }
    if (!date || !contactName) {
      toast.error("Add a date and your name");
      return;
    }
    setBusy(true);
    // Check approval first for a clear message
    const { data: prof } = await supabase
      .from("profiles")
      .select("approved")
      .eq("id", user.id)
      .maybeSingle();
    if (!prof?.approved) {
      setBusy(false);
      toast.error("Your account is pending admin approval. We'll notify you once approved.");
      return;
    }
    const { data: b, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        package_id: pkg.id,
        tour_date: date,
        num_guests: guests,
        total_amount: total,
        contact_name: contactName,
        contact_phone: phone,
        contact_email: user.email,
        preferred_language: lang,
      })
      .select()
      .single();
    setBusy(false);
    if (error || !b) {
      const msg = error?.message?.includes("row-level security")
        ? "Your account is pending admin approval."
        : (error?.message ?? "Could not book");
      return toast.error(msg);
    }
    toast.success("Booked! Your circuit awaits.");
    navigate({ to: "/bookings" });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={pkg.hero_image_url || hero} alt={pkg.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="container mx-auto px-4 h-full flex items-end pb-8 relative">
          <div className="text-foreground">
            <Badge className="capitalize bg-accent text-accent-foreground border-none">{pkg.category?.replace("-", " ")}</Badge>
            <h1 className="font-display text-4xl md:text-6xl mt-3 text-balance">{pkg.title}</h1>
            {pkg.tagline && <p className="text-lg text-muted-foreground mt-2 max-w-2xl">{pkg.tagline}</p>}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> All tours
          </Link>
          <div className="flex flex-wrap gap-4 text-sm">
            {pkg.duration_hours && <Stat icon={Clock} label={`${pkg.duration_hours} hours`} />}
            <Stat icon={Users} label={`${pkg.min_group_size}–${pkg.max_group_size} guests`} />
            <Stat icon={Languages} label="EN · हि · ম" />
          </div>
          {pkg.description && <p className="text-lg text-foreground/90 leading-relaxed whitespace-pre-line">{pkg.description}</p>}

          {steps.length > 0 && (
            <div>
              <h2 className="font-display text-3xl mb-6">The itinerary</h2>
              <ol className="space-y-4">
                {steps.map((s, i) => (
                  <li key={s.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground grid place-items-center font-display font-semibold">
                      {i + 1}
                    </div>
                    <Card className="flex-1 p-4">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-semibold">{s.title}</h3>
                        {s.duration_minutes && <span className="text-xs text-muted-foreground">{s.duration_minutes} min</span>}
                      </div>
                      {s.description && <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{s.description}</p>}
                    </Card>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {dests.length > 0 && (
            <div>
              <h2 className="font-display text-3xl mb-4">Stops on this circuit</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {dests.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/60">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span className="text-sm">{d.stop_order}. {d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Card className="p-6 h-fit sticky top-20">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">From</div>
          <div className="font-display text-4xl">₹{Number(pkg.price_per_person).toLocaleString()}<span className="text-sm text-muted-foreground"> /guest</span></div>
          <div className="mt-6 space-y-3">
            <div>
              <Label className="text-xs">Tour date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" min={new Date().toISOString().slice(0, 10)} />
            </div>
            <div>
              <Label className="text-xs">Guests</Label>
              <Input type="number" min={1} max={pkg.max_group_size ?? 10} value={guests} onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Contact name</Label>
              <Input value={contactName} onChange={(e) => setContactName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Preferred language</Label>
              <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(LANG_LABEL) as Lang[]).map((l) => (
                    <SelectItem key={l} value={l}>{LANG_LABEL[l]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-6 flex items-baseline justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-display text-2xl">₹{total.toLocaleString()}</span>
          </div>
          <Button onClick={book} disabled={busy} variant="hero" size="lg" className="w-full mt-4">
            {busy ? "Confirming…" : user ? "Confirm booking" : "Sign in to book"}
          </Button>
          <p className="text-[11px] text-muted-foreground mt-2 text-center">Payment is collected at the venue for now.</p>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

function Stat({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
      <Icon className="h-4 w-4 text-accent" />
      <span>{label}</span>
    </div>
  );
}