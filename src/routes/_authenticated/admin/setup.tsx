import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/app/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/setup")({
  component: Setup,
});

function Setup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  // Allow promoting to admin only if no admin exists yet (first-user-wins).
  const { data: noAdmins } = useQuery({
    queryKey: ["any-admin"],
    queryFn: async () => {
      const { count } = await supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "admin");
      return (count ?? 0) === 0;
    },
  });

  async function promote() {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.rpc("claim_first_admin");
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("You are now an admin!");
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card className="p-8 text-center">
          <ShieldCheck className="h-10 w-10 mx-auto text-accent" />
          <h1 className="font-display text-2xl mt-4">Admin access</h1>
          {noAdmins ? (
            <>
              <p className="text-sm text-muted-foreground mt-2">No admin exists yet. Claim the first admin seat.</p>
              <Button onClick={promote} disabled={busy} variant="hero" className="mt-6 w-full">
                Make me an admin
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">An admin already exists. Ask an existing admin to grant you access.</p>
          )}
        </Card>
      </div>
    </div>
  );
}