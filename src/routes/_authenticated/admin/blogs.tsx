import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, ExternalLink, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/blogs")({
  component: BlogsAdmin,
});

function BlogsAdmin() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);

  const { data: posts } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("blogs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: subs } = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: async () => {
      const { data } = await (supabase as any).from("newsletter_subscribers").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  async function create() {
    const slug = `post-${Date.now()}`;
    const { data, error } = await (supabase as any)
      .from("blogs")
      .insert({ slug, title: "New post", author_name: "Pokkali Village" })
      .select()
      .single();
    if (error) return toast.error(error.message);
    toast.success("Draft created");
    qc.invalidateQueries({ queryKey: ["admin-blogs"] });
    setSelected(data.id);
  }

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <div className="font-semibold">Newsletter subscribers</div>
              <div className="text-xs text-muted-foreground">{subs?.length ?? 0} active</div>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => {
            const csv = "email,subscribed_at\n" + (subs ?? []).map((s: any) => `${s.email},${s.created_at}`).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = "newsletter-subscribers.csv"; a.click();
            URL.revokeObjectURL(url);
          }}>Export CSV</Button>
        </div>
        {subs?.length ? (
          <div className="mt-3 max-h-32 overflow-y-auto text-xs space-y-1">
            {subs.slice(0, 50).map((s: any) => (
              <div key={s.id} className="flex justify-between border-b py-1">
                <span>{s.email}</span>
                <span className="text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        ) : <p className="text-xs text-muted-foreground mt-2">No subscribers yet.</p>}
      </Card>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        <Card className="p-4 h-fit">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Blog posts</h2>
            <Button size="sm" variant="hero" onClick={create}><Plus className="h-4 w-4" /> New</Button>
          </div>
          <div className="space-y-1">
            {posts?.map((p: any) => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selected === p.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                <div className="font-medium truncate">{p.title}</div>
                <div className="text-[11px] opacity-70">{p.is_published ? "Published" : "Draft"}</div>
              </button>
            ))}
            {!posts?.length && <p className="text-sm text-muted-foreground">No posts yet.</p>}
          </div>
        </Card>
        {selected ? <BlogEditor key={selected} blogId={selected} onDeleted={() => setSelected(null)} /> : <Card className="p-12 text-center text-muted-foreground">Select or create a post.</Card>}
      </div>
    </div>
  );
}

function BlogEditor({ blogId, onDeleted }: { blogId: string; onDeleted: () => void }) {
  const qc = useQueryClient();
  const { data: post, refetch } = useQuery({
    queryKey: ["admin-blog", blogId],
    queryFn: async () => {
      const { data } = await (supabase as any).from("blogs").select("*").eq("id", blogId).maybeSingle();
      return data;
    },
  });
  const [s, setS] = useState<any>(null);
  if (!post) return <Card className="p-8">Loading…</Card>;
  const v = s ?? post;

  function patch(p: any) { setS({ ...v, ...p }); }

  async function save() {
    const tagsArr = typeof v.tags === "string" ? v.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : v.tags ?? [];
    const payload: any = {
      slug: v.slug, title: v.title, excerpt: v.excerpt, content: v.content,
      cover_image_url: v.cover_image_url, author_name: v.author_name,
      tags: tagsArr, is_published: v.is_published,
      published_at: v.is_published && !post.published_at ? new Date().toISOString() : v.published_at,
    };
    const { error } = await (supabase as any).from("blogs").update(payload).eq("id", blogId);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["admin-blogs"] });
    qc.invalidateQueries({ queryKey: ["blogs", "public"] });
    refetch();
  }

  async function remove() {
    if (!confirm("Delete this post?")) return;
    const { error } = await (supabase as any).from("blogs").delete().eq("id", blogId);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-blogs"] });
    onDeleted();
  }

  const tagsValue = Array.isArray(v.tags) ? v.tags.join(", ") : (v.tags ?? "");

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-display text-2xl">Edit post</h2>
        <div className="flex gap-2">
          {v.is_published && (
            <Button asChild variant="outline" size="sm"><Link to="/blog/$slug" params={{ slug: v.slug }} target="_blank"><ExternalLink className="h-4 w-4" /> View</Link></Button>
          )}
          <Button variant="destructive" size="sm" onClick={remove}><Trash2 className="h-4 w-4" /> Delete</Button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Title" className="sm:col-span-2"><Input value={v.title ?? ""} onChange={(e) => patch({ title: e.target.value })} /></Field>
        <Field label="URL slug"><Input value={v.slug ?? ""} onChange={(e) => patch({ slug: e.target.value })} /></Field>
        <Field label="Author"><Input value={v.author_name ?? ""} onChange={(e) => patch({ author_name: e.target.value })} /></Field>
        <Field label="Cover image URL" className="sm:col-span-2"><Input value={v.cover_image_url ?? ""} onChange={(e) => patch({ cover_image_url: e.target.value })} placeholder="https://..." /></Field>
        <Field label="Tags (comma separated)" className="sm:col-span-2"><Input value={tagsValue} onChange={(e) => patch({ tags: e.target.value })} placeholder="heritage, recipes, farmers" /></Field>
        <Field label="Excerpt" className="sm:col-span-2"><Textarea rows={2} value={v.excerpt ?? ""} onChange={(e) => patch({ excerpt: e.target.value })} /></Field>
        <Field label="Content (Markdown / plain text)" className="sm:col-span-2"><Textarea rows={14} value={v.content ?? ""} onChange={(e) => patch({ content: e.target.value })} /></Field>
      </div>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!v.is_published} onChange={(e) => patch({ is_published: e.target.checked })} />
          Published <Badge variant={v.is_published ? "default" : "secondary"} className="ml-2">{v.is_published ? "Live" : "Draft"}</Badge>
        </label>
        <Button variant="hero" onClick={save}><Save className="h-4 w-4" /> Save</Button>
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