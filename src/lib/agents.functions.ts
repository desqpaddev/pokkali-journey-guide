import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({
  mode: z.enum(["agent", "link"]),
  agentCode: z.string().max(20).optional(),
  packageId: z.string().uuid(),
  tourDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.number().int().min(1).max(100),
  contactName: z.string().trim().min(1).max(120),
  contactPhone: z.string().trim().max(30).optional().default(""),
  contactEmail: z.string().trim().email().max(255).optional(),
  language: z.string().max(20).default("english"),
});

export const createAgentBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    let code = data.agentCode;
    if (data.mode === "agent") {
      const { data: me } = await supabase
        .from("agents")
        .select("code, status")
        .eq("user_id", userId)
        .maybeSingle();
      if (!me || me.status !== "approved") throw new Error("Your agent account is not approved.");
      code = me.code;
    }
    if (!code) throw new Error("Missing agent code");
    const { data: priceRows, error: pErr } = await supabase.rpc("get_agent_price", {
      _code: code,
      _package_id: data.packageId,
    });
    const price = priceRows?.[0];
    if (pErr || !price) throw new Error("This agent price is not available.");

    const base = Number(price.base_price) * data.guests;
    const total = Number(price.price_per_person) * data.guests;
    const { data: userRes } = await supabase.auth.getUser();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: b, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        user_id: userId,
        package_id: data.packageId,
        tour_date: data.tourDate,
        num_guests: data.guests,
        total_amount: total,
        base_amount: base,
        markup_amount: total - base,
        agent_id: price.agent_id,
        booked_by_agent: data.mode === "agent",
        status: "pending_approval",
        contact_name: data.contactName,
        contact_phone: data.contactPhone,
        contact_email: data.contactEmail ?? userRes.user?.email ?? null,
        preferred_language: data.language,
      })
      .select("id")
      .single();
    if (error) {
      console.error(error);
      throw new Error("Could not save booking");
    }
    return { id: b.id, total };
  });
