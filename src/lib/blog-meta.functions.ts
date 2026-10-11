import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const getBlogMeta = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => ({ slug: String(d.slug).slice(0, 200) }))
  .handler(async ({ data }) => {
    try {
      const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
      const sb = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
        auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
        global: {
          fetch: (input, init) => {
            const h = new Headers(init?.headers);
            if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
            h.set("apikey", key);
            return fetch(input, { ...init, headers: h });
          },
        },
      });
      const { data: post } = await sb
        .from("blogs")
        .select("title, excerpt, cover_image_url, published_at, author_name")
        .eq("slug", data.slug)
        .eq("is_published", true)
        .maybeSingle();
      return post ?? null;
    } catch (e) {
      console.error(e);
      return null;
    }
  });
