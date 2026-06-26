import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/account")({
  component: AdminAccount,
});

function AdminAccount() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentEmail(data.user?.email ?? "");
      setEmail(data.user?.email ?? "");
    });
  }, []);

  async function updateEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email || email === currentEmail) {
      toast.error("Enter a new email address");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ email });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Confirmation email sent. Check your inbox to confirm the change.");
  }

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated");
      setPassword("");
      setConfirm("");
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Change email</CardTitle>
          <CardDescription>Current: {currentEmail || "—"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={updateEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">New email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" disabled={busy}>Update email</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>At least 6 characters.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={updatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pw">New password</Label>
              <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw2">Confirm password</Label>
              <Input id="pw2" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
            <Button type="submit" disabled={busy}>Update password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}