import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2, MapPin, Crosshair, Save, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/packages")({
  component: PackagesAdmin,
});

function PackagesAdmin() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const { data: packages } = useQuery({
    queryKey: ["admin-packages"],
    queryFn: async () => {
      const { data } = await supabase.from("packages").select("*").order("created_at");
      return data ?? [];
    },
  });

  async function create() {
    const slug = `tour-${Date.now()}`;
    const { data, error } = await supabase
      .from("packages")
      .insert({ slug, title: "New Tour", category: "half-day", price_per_person: 0 })
      .select()
      .single();
    if (error) return toast.error(error.message);
    toast.success("Package created");
    qc.invalidateQueries({ queryKey: ["admin-packages"] });
    setSelected(data.id);
  }

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6">
      <Card className="p-4 h-fit">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Packages</h2>
          <Button size="sm" variant="hero" onClick={create}><Plus className="h-4 w-4" /> New</Button>
        </div>
        <div className="space-y-1">
          {packages?.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selected === p.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              <div className="font-medium truncate">{p.title}</div>
              <div className="text-[11px] opacity-70 capitalize">{p.category}</div>
            </button>
          ))}
          {!packages?.length && <p className="text-sm text-muted-foreground">No packages yet.</p>}
        </div>
      </Card>
      {selected ? <PackageEditor packageId={selected} /> : <Card className="p-12 text-center text-muted-foreground">Select or create a package.</Card>}
    </div>
  );
}

function PackageEditor({ packageId }: { packageId: string }) {
  const qc = useQueryClient();
  const { data, refetch } = useQuery({
    queryKey: ["admin-package", packageId],
    queryFn: async () => {
      const { data: pkg } = await supabase.from("packages").select("*").eq("id", packageId).maybeSingle();
      const { data: steps } = await supabase.from("itinerary_steps").select("*").eq("package_id", packageId).order("step_order");
      const { data: dests } = await supabase.from("destinations").select("*").eq("package_id", packageId).order("stop_order");
      return { pkg, steps: steps ?? [], dests: dests ?? [] };
    },
  });

  if (!data?.pkg) return <Card className="p-8">Loading…</Card>;
  const pkg = data.pkg;

  async function savePkg(patch: any) {
    const { error } = await supabase.from("packages").update(patch).eq("id", packageId);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["admin-packages"] });
    refetch();
  }

  async function remove() {
    if (!confirm("Delete this package?")) return;
    await supabase.from("packages").delete().eq("id", packageId);
    qc.invalidateQueries({ queryKey: ["admin-packages"] });
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Package details</h2>
          <Button variant="destructive" size="sm" onClick={remove}><Trash2 className="h-4 w-4" /> Delete</Button>
        </div>
        <PkgFields key={pkg.id} pkg={pkg} onSave={savePkg} />
      </Card>
      <ItinerarySection packageId={packageId} steps={data.steps} onChange={refetch} />
      <DestinationsSection packageId={packageId} dests={data.dests} onChange={refetch} />
    </div>
  );
}

function PkgFields({ pkg, onSave }: { pkg: any; onSave: (p: any) => void }) {
  const [s, setS] = useState(pkg);
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <Field label="Title"><Input value={s.title ?? ""} onChange={(e) => setS({ ...s, title: e.target.value })} /></Field>
      <Field label="URL slug"><Input value={s.slug ?? ""} onChange={(e) => setS({ ...s, slug: e.target.value })} /></Field>
      <Field label="Tagline" className="sm:col-span-2"><Input value={s.tagline ?? ""} onChange={(e) => setS({ ...s, tagline: e.target.value })} /></Field>
      <Field label="Description" className="sm:col-span-2"><Textarea rows={4} value={s.description ?? ""} onChange={(e) => setS({ ...s, description: e.target.value })} /></Field>
      <Field label="Category">
        <Select value={s.category ?? "half-day"} onValueChange={(v) => setS({ ...s, category: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="half-day">Half-day</SelectItem>
            <SelectItem value="full-day">Full-day</SelectItem>
            <SelectItem value="multi-day">Multi-day</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Duration (hours)"><Input type="number" value={s.duration_hours ?? ""} onChange={(e) => setS({ ...s, duration_hours: e.target.value ? Number(e.target.value) : null })} /></Field>
      <Field label="Price per person (₹)"><Input type="number" value={s.price_per_person ?? 0} onChange={(e) => setS({ ...s, price_per_person: Number(e.target.value) })} /></Field>
      <Field label="Hero image URL"><Input value={s.hero_image_url ?? ""} onChange={(e) => setS({ ...s, hero_image_url: e.target.value })} placeholder="https://..." /></Field>
      <Field label="Min group size"><Input type="number" value={s.min_group_size ?? 0} onChange={(e) => setS({ ...s, min_group_size: Number(e.target.value) })} /></Field>
      <Field label="Max group size"><Input type="number" value={s.max_group_size ?? 0} onChange={(e) => setS({ ...s, max_group_size: Number(e.target.value) })} /></Field>
      <div className="sm:col-span-2 flex items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={s.is_active} onChange={(e) => setS({ ...s, is_active: e.target.checked })} /> Active (visible to public)
        </label>
        <Button variant="hero" onClick={() => onSave(s)}><Save className="h-4 w-4" /> Save</Button>
      </div>
    </div>
  );
}

function ItinerarySection({ packageId, steps, onChange }: { packageId: string; steps: any[]; onChange: () => void }) {
  async function add() {
    await supabase.from("itinerary_steps").insert({ package_id: packageId, step_order: (steps.at(-1)?.step_order ?? 0) + 1, title: "New step" });
    onChange();
  }
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-2xl">Itinerary steps</h2>
        <Button onClick={add} size="sm"><Plus className="h-4 w-4" /> Add step</Button>
      </div>
      <Accordion type="multiple" className="space-y-2">
        {steps.map((s) => <ItineraryRow key={s.id} step={s} onChange={onChange} />)}
      </Accordion>
      {!steps.length && <p className="text-sm text-muted-foreground">No steps yet.</p>}
    </Card>
  );
}

function ItineraryRow({ step, onChange }: { step: any; onChange: () => void }) {
  const [s, setS] = useState(step);
  async function save() {
    await supabase.from("itinerary_steps").update({ title: s.title, description: s.description, duration_minutes: s.duration_minutes, step_order: s.step_order }).eq("id", step.id);
    toast.success("Step saved");
    onChange();
  }
  async function remove() {
    await supabase.from("itinerary_steps").delete().eq("id", step.id);
    onChange();
  }
  return (
    <AccordionItem value={step.id} className="border rounded-md px-3">
      <AccordionTrigger className="py-2"><span className="font-medium">#{step.step_order} · {s.title || "Untitled"}</span></AccordionTrigger>
      <AccordionContent className="space-y-3 pb-3">
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Order"><Input type="number" value={s.step_order} onChange={(e) => setS({ ...s, step_order: Number(e.target.value) })} /></Field>
          <Field label="Title" className="sm:col-span-2"><Input value={s.title ?? ""} onChange={(e) => setS({ ...s, title: e.target.value })} /></Field>
          <Field label="Duration (min)"><Input type="number" value={s.duration_minutes ?? ""} onChange={(e) => setS({ ...s, duration_minutes: e.target.value ? Number(e.target.value) : null })} /></Field>
          <Field label="Description" className="sm:col-span-3"><Textarea rows={3} value={s.description ?? ""} onChange={(e) => setS({ ...s, description: e.target.value })} /></Field>
        </div>
        <div className="flex gap-2">
          <Button onClick={save} variant="hero" size="sm"><Save className="h-4 w-4" /> Save</Button>
          <Button onClick={remove} variant="destructive" size="sm"><Trash2 className="h-4 w-4" /> Delete</Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function DestinationsSection({ packageId, dests, onChange }: { packageId: string; dests: any[]; onChange: () => void }) {
  async function add() {
    await supabase.from("destinations").insert({
      package_id: packageId,
      stop_order: (dests.at(-1)?.stop_order ?? 0) + 1,
      name: "New stop",
      latitude: 0,
      longitude: 0,
      trigger_radius_meters: 50,
    });
    onChange();
  }
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-2xl">GPS destinations</h2>
        <Button onClick={add} size="sm"><Plus className="h-4 w-4" /> Add stop</Button>
      </div>
      <Accordion type="multiple" className="space-y-2">
        {dests.map((d) => <DestRow key={d.id} dest={d} onChange={onChange} />)}
      </Accordion>
      {!dests.length && <p className="text-sm text-muted-foreground">No GPS stops yet. Add one and capture coordinates on your phone at the location.</p>}
    </Card>
  );
}

function DestRow({ dest, onChange }: { dest: any; onChange: () => void }) {
  const [d, setD] = useState(dest);
  function capture() {
    if (!navigator.geolocation) return toast.error("Geolocation unsupported");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setD({ ...d, latitude: p.coords.latitude, longitude: p.coords.longitude });
        toast.success(`Captured ${p.coords.latitude.toFixed(6)}, ${p.coords.longitude.toFixed(6)}`);
      },
      (e) => toast.error(e.message),
      { enableHighAccuracy: true },
    );
  }
  async function save() {
    const { error } = await supabase.from("destinations").update({
      name: d.name, description: d.description, latitude: d.latitude, longitude: d.longitude,
      trigger_radius_meters: d.trigger_radius_meters, stop_order: d.stop_order, image_url: d.image_url,
      story_english: d.story_english, story_hindi: d.story_hindi, story_malayalam: d.story_malayalam,
      audio_english_url: d.audio_english_url, audio_hindi_url: d.audio_hindi_url, audio_malayalam_url: d.audio_malayalam_url,
    }).eq("id", dest.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    onChange();
  }
  async function remove() {
    await supabase.from("destinations").delete().eq("id", dest.id);
    onChange();
  }
  return (
    <AccordionItem value={dest.id} className="border rounded-md px-3">
      <AccordionTrigger className="py-2">
        <span className="font-medium flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> #{d.stop_order} · {d.name || "Untitled"}</span>
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pb-3">
        <div className="grid sm:grid-cols-4 gap-3">
          <Field label="Order"><Input type="number" value={d.stop_order} onChange={(e) => setD({ ...d, stop_order: Number(e.target.value) })} /></Field>
          <Field label="Name" className="sm:col-span-3"><Input value={d.name ?? ""} onChange={(e) => setD({ ...d, name: e.target.value })} /></Field>
          <Field label="Latitude"><Input type="number" step="any" value={d.latitude} onChange={(e) => setD({ ...d, latitude: Number(e.target.value) })} /></Field>
          <Field label="Longitude"><Input type="number" step="any" value={d.longitude} onChange={(e) => setD({ ...d, longitude: Number(e.target.value) })} /></Field>
          <Field label="Trigger radius (m)"><Input type="number" value={d.trigger_radius_meters ?? 50} onChange={(e) => setD({ ...d, trigger_radius_meters: Number(e.target.value) })} /></Field>
          <div className="flex items-end"><Button onClick={capture} variant="outline" size="sm" className="w-full"><Crosshair className="h-4 w-4" /> Capture here</Button></div>
          <Field label="Description" className="sm:col-span-4"><Textarea rows={2} value={d.description ?? ""} onChange={(e) => setD({ ...d, description: e.target.value })} /></Field>
          <Field label="Image URL" className="sm:col-span-4"><Input value={d.image_url ?? ""} onChange={(e) => setD({ ...d, image_url: e.target.value })} placeholder="https://..." /></Field>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {(["english", "hindi", "malayalam"] as const).map((lang) => (
            <div key={lang} className="space-y-2 border rounded-md p-3">
              <div className="text-xs uppercase tracking-widest font-semibold text-accent">{lang}</div>
              <Field label={`Story (${lang})`}><Textarea rows={4} value={d[`story_${lang}`] ?? ""} onChange={(e) => setD({ ...d, [`story_${lang}`]: e.target.value })} placeholder="Will auto-generate audio if empty URL." /></Field>
              <AudioField
                value={d[`audio_${lang}_url`] ?? ""}
                onChange={(v) => setD({ ...d, [`audio_${lang}_url`]: v })}
                destinationId={dest.id}
                lang={lang}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button onClick={save} variant="hero" size="sm"><Save className="h-4 w-4" /> Save stop</Button>
          <Button onClick={remove} variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-xs">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function AudioField({ value, onChange, destinationId, lang }: { value: string; onChange: (v: string) => void; destinationId: string; lang: string }) {
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "mp3";
      const path = `destinations/${destinationId}/${lang}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("product-media").upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from("product-media").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Audio uploaded. Save stop to keep it.");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2 rounded-md border bg-muted/20 p-2">
      <Label className="text-xs">Audio (upload or URL)</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Leave empty to auto-generate from story" />
      <div className="flex flex-col gap-2">
        <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
          {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
          {uploading ? "Uploading…" : "Upload file"}
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </label>
        {value && <audio src={value} controls className="h-10 w-full min-w-0" />}
      </div>
    </div>
  );
}