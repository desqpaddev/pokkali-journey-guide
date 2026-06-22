import { createFileRoute, Outlet, Link, redirect, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/app/Header";
import { Package, ScanLine, Calendar, LayoutDashboard, ShieldCheck, BookOpen } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return {};
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
    if (!roles?.some((r) => r.role === "admin")) {
      throw redirect({ to: "/admin/setup" });
    }
    return { user: u.user };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const items = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/packages", label: "Packages & GPS stops", icon: Package },
    { to: "/admin/products", label: "Products & QR", icon: ScanLine },
    { to: "/admin/blogs", label: "Blogs & Newsletter", icon: BookOpen },
    { to: "/admin/bookings", label: "Bookings", icon: Calendar },
  ];
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-accent font-semibold mb-2">
          <ShieldCheck className="h-4 w-4" /> Admin
        </div>
        <h1 className="font-display text-4xl">Pokkali Village Control Room</h1>
        <nav className="mt-6 flex flex-wrap gap-2 border-b border-border pb-2">
          {items.map((i) => {
            const active = path === i.to;
            return (
              <Link
                key={i.to}
                to={i.to}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                <i.icon className="h-4 w-4" /> {i.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-8"><Outlet /></div>
      </div>
    </div>
  );
}