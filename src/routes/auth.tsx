import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/app/Header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Wheat } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Pokkali Village" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn() {
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: "/bookings" });
  }

  async function signUp() {
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        data: { full_name: name },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — you're signed in.");
    navigate({ to: "/bookings" });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="text-center mb-8">
          <Wheat className="h-10 w-10 mx-auto text-accent" />
          <h1 className="font-display text-3xl mt-3">Welcome to Pokkali Village</h1>
          <p className="text-muted-foreground text-sm mt-2">Sign in to book and follow your circuit.</p>
        </div>
        <Card className="p-6">
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="space-y-3 mt-4">
              <Field label="Email" value={email} onChange={setEmail} type="email" />
              <Field label="Password" value={password} onChange={setPassword} type="password" />
              <Button onClick={signIn} disabled={busy} className="w-full" variant="hero" size="lg">Sign in</Button>
            </TabsContent>
            <TabsContent value="signup" className="space-y-3 mt-4">
              <Field label="Full name" value={name} onChange={setName} />
              <Field label="Email" value={email} onChange={setEmail} type="email" />
              <Field label="Password" value={password} onChange={setPassword} type="password" />
              <Button onClick={signUp} disabled={busy} className="w-full" variant="hero" size="lg">Create account</Button>
            </TabsContent>
          </Tabs>
        </Card>
        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-primary">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} type={type} className="mt-1" />
    </div>
  );
}