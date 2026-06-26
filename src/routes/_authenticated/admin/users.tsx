import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersAdmin,
});

function UsersAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, phone, approved, approved_at, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const setApproved = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ approved, approved_at: approved ? new Date().toISOString() : null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, v) => {
      toast.success(v.approved ? "User approved" : "Approval revoked");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <div className="text-muted-foreground">Loading users…</div>;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl">Users</h2>
        <p className="text-sm text-muted-foreground">Approve users so they can book tours.</p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3">{u.full_name || "—"}</td>
                <td className="p-3">{u.phone || "—"}</td>
                <td className="p-3">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  {u.approved ? (
                    <span className="inline-flex items-center gap-1 text-green-700"><Check className="h-3 w-3" /> Approved</span>
                  ) : (
                    <span className="text-amber-700">Pending</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  {u.approved ? (
                    <Button size="sm" variant="outline" onClick={() => setApproved.mutate({ id: u.id, approved: false })}>
                      <X className="h-3 w-3 mr-1" /> Revoke
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => setApproved.mutate({ id: u.id, approved: true })}>
                      <Check className="h-3 w-3 mr-1" /> Approve
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {!data?.length && (
              <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No users yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}