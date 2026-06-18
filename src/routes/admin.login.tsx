import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/app/Header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin sign in — Pokkali Village" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn() {
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setBusy(false);
      return toast.error(error?.message ?? "Sign-in failed");
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    const isAdmin = !!roles?.some((r) => r.role === "admin");
    setBusy(false);
    if (!isAdmin) {
      toast.message("Signed in — claim admin access if available.");
      return navigate({ to: "/admin/setup" });
    }
    toast.success("Welcome, admin.");
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="text-center mb-8">
          <ShieldCheck className="h-10 w-10 mx-auto text-accent" />
          <h1 className="font-display text-3xl mt-3">Admin sign in</h1>
          <p className="text-muted-foreground text-sm mt-2">Restricted access for Pokkali Village staff.</p>
        </div>
        <Card className="p-6 space-y-3">
          <div>
            <Label className="text-xs">Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-1"
              onKeyDown={(e) => e.key === "Enter" && signIn()}
            />
          </div>
          <Button onClick={signIn} disabled={busy} className="w-full" variant="hero" size="lg">
            Sign in to admin
          </Button>
        </Card>
        <p className="text-center text-xs text-muted-foreground mt-6">
          Need a customer account? <Link to="/auth" className="hover:text-primary underline">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}