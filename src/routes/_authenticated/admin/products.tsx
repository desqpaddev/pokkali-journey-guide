import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save, ScanLine, QrCode, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: ProductsAdmin,
});

function ProductsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const [{ data: products }, { data: dests }] = await Promise.all([
        supabase.from("products").select("*, destinations(name)").order("created_at"),
        supabase.from("destinations").select("id, name, packages(title)").order("name"),
      ]);
      return { products: products ?? [], dests: dests ?? [] };
    },
  });

  async function add() {
    const code = `PKL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    await supabase.from("products").insert({ qr_code: code, name: "New product", price: 0 });
    qc.invalidateQueries({ queryKey: ["admin-products"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Each product has a QR code. Print the code and stick it on the item — tourists scan during the tour to hear its story.</p>
        <Button onClick={add} variant="hero"><Plus className="h-4 w-4" /> New product</Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {data?.products.map((p) => <ProductCard key={p.id} product={p} destinations={data.dests} onChange={() => qc.invalidateQueries({ queryKey: ["admin-products"] })} />)}
      </div>
      {!data?.products.length && <Card className="p-12 text-center text-muted-foreground"><ScanLine className="h-8 w-8 mx-auto" /><p className="mt-3">No products yet.</p></Card>}
    </div>
  );
}

function ProductCard({ product, destinations, onChange }: { product: any; destinations: any[]; onChange: () => void }) {
  const [p, setP] = useState(product);
  async function save() {
    const { error } = await supabase.from("products").update({
      qr_code: p.qr_code, name: p.name, description: p.description, price: p.price ? Number(p.price) : null,
      image_url: p.image_url, destination_id: p.destination_id || null,
      story_english: p.story_english, story_hindi: p.story_hindi, story_malayalam: p.story_malayalam,
      audio_english_url: p.audio_english_url, audio_hindi_url: p.audio_hindi_url, audio_malayalam_url: p.audio_malayalam_url,
    }).eq("id", product.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    onChange();
  }
  async function remove() {
    if (!confirm("Delete product?")) return;
    await supabase.from("products").delete().eq("id", product.id);
    onChange();
  }
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(p.qr_code)}`;

  return (
    <Card className="p-5 space-y-3">
      <div className="flex gap-4">
        <img src={qrSrc} alt="qr" className="h-24 w-24 rounded border" />
        <div className="flex-1 space-y-2">
          <Field label="QR code"><Input value={p.qr_code} onChange={(e) => setP({ ...p, qr_code: e.target.value })} /></Field>
          <Field label="Name"><Input value={p.name ?? ""} onChange={(e) => setP({ ...p, name: e.target.value })} /></Field>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Price (₹)"><Input type="number" value={p.price ?? ""} onChange={(e) => setP({ ...p, price: e.target.value })} /></Field>
        <Field label="At destination">
          <Select value={p.destination_id ?? "none"} onValueChange={(v) => setP({ ...p, destination_id: v === "none" ? null : v })}>
            <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— None —</SelectItem>
              {destinations.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Field label="Description"><Textarea rows={2} value={p.description ?? ""} onChange={(e) => setP({ ...p, description: e.target.value })} /></Field>
      <Field label="Image URL"><Input value={p.image_url ?? ""} onChange={(e) => setP({ ...p, image_url: e.target.value })} placeholder="https://..." /></Field>
      <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t">
        {(["english", "hindi", "malayalam"] as const).map((lang) => (
          <div key={lang} className="space-y-2">
            <div className="text-xs uppercase tracking-widest font-semibold text-accent">{lang}</div>
            <Field label="Story"><Textarea rows={3} value={p[`story_${lang}`] ?? ""} onChange={(e) => setP({ ...p, [`story_${lang}`]: e.target.value })} /></Field>
            <AudioField
              value={p[`audio_${lang}_url`] ?? ""}
              onChange={(v) => setP({ ...p, [`audio_${lang}_url`]: v })}
              productId={product.id}
              lang={lang}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2 pt-2">
        <Button onClick={save} variant="hero" size="sm"><Save className="h-4 w-4" /> Save</Button>
        <Button asChild variant="outline" size="sm">
          <a href={qrSrc} target="_blank" rel="noreferrer"><QrCode className="h-4 w-4" /> Print QR</a>
        </Button>
        <Button onClick={remove} variant="destructive" size="sm" className="ml-auto"><Trash2 className="h-4 w-4" /></Button>
      </div>
    </Card>
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

function AudioField({ value, onChange, productId, lang }: { value: string; onChange: (v: string) => void; productId: string; lang: string }) {
  const [uploading, setUploading] = useState(false);
  async function upload(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "mp3";
      const path = `products/${productId}/${lang}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("product-media").upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from("product-media").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Audio uploaded");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }
  return (
      <div className="space-y-2 rounded-md border bg-muted/20 p-2">
      <Label className="text-xs">Audio (upload or URL)</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Auto-generated from story if empty" />
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