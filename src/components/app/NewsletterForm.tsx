import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
});

export function NewsletterForm({ variant = "footer" }: { variant?: "footer" | "inline" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await (supabase as any)
      .from("newsletter_subscribers")
      .insert({ email: parsed.data.email });
    setLoading(false);
    if (error) {
      if (error.code === "23505") {
        setDone(true);
        toast.success("You're already subscribed — thank you!");
        return;
      }
      toast.error(error.message);
      return;
    }
    setDone(true);
    setEmail("");
    toast.success("Subscribed! Watch your inbox for stories from the fields.");
  }

  if (variant === "inline") {
    return (
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
        <input
          type="email"
          required
          maxLength={255}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 h-12 rounded-full px-5 bg-background border border-border outline-none focus:ring-2 focus:ring-secondary text-sm"
        />
        <button
          type="submit"
          disabled={loading || done}
          className="h-12 px-6 rounded-full bg-primary text-primary-foreground font-medium text-sm inline-flex items-center justify-center gap-2 hover:bg-primary/90 transition disabled:opacity-60"
        >
          {done ? <><Check className="h-4 w-4" /> Subscribed</> : loading ? "Subscribing…" : <>Subscribe <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 flex bg-primary-foreground/10 rounded-full p-1.5 pl-4">
      <input
        type="email"
        required
        maxLength={255}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="bg-transparent flex-1 text-xs outline-none placeholder:text-primary-foreground/50 min-w-0"
      />
      <button
        type="submit"
        disabled={loading || done}
        aria-label="Subscribe"
        className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground grid place-items-center shrink-0 disabled:opacity-60"
      >
        {done ? <Check className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
      </button>
    </form>
  );
}