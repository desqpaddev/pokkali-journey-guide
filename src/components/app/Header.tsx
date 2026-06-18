import { Link } from "@tanstack/react-router";
import { Wheat, LogIn, LayoutDashboard, LogOut, MapPin, Home, Compass, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const { user, isAdmin } = useAuth();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60 pt-[env(safe-area-inset-top)]">
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Wheat className="h-5 w-5" />
          </span>
          <div className="leading-tight min-w-0">
            <div className="font-display text-base md:text-lg font-semibold truncate">Pokkali Village</div>
            <div className="hidden sm:block text-[10px] uppercase tracking-[0.18em] text-muted-foreground -mt-0.5">
              Heritage Circuit Tours
            </div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" hash="tours" className="hover:text-primary">Tours</Link>
          <Link to="/" hash="story" className="hover:text-primary">Our Story</Link>
          <Link to="/" hash="visit" className="hover:text-primary">Visit</Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                <Link to="/bookings"><MapPin className="h-4 w-4" />My Tours</Link>
              </Button>
              {isAdmin && (
                <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
                  <Link to="/admin"><LayoutDashboard className="h-4 w-4" />Admin</Link>
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => supabase.auth.signOut()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth"><LogIn className="h-4 w-4" />Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export function MobileBottomNav() {
  const { user, isAdmin } = useAuth();
  const items: Array<{ to: string; hash?: string; label: string; icon: typeof Home }> = [
    { to: "/", label: "Home", icon: Home },
    { to: "/", hash: "tours", label: "Tours", icon: Compass },
    { to: user ? "/bookings" : "/auth", label: user ? "Tours" : "Sign in", icon: user ? MapPin : User },
  ];
  if (isAdmin) items.push({ to: "/admin", label: "Admin", icon: LayoutDashboard });
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
      aria-label="Primary"
    >
      <ul className="grid h-16" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))` }}>
        {items.map((it) => (
          <li key={it.label} className="contents">
            <Link
              to={it.to}
              hash={it.hash}
              className="flex flex-col items-center justify-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-primary active:scale-95 transition"
              activeOptions={{ exact: it.to === "/" && !it.hash }}
              activeProps={{ className: "text-primary" }}
            >
              <it.icon className="h-5 w-5" />
              <span>{it.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/40 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-10 grid sm:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="font-display text-lg font-semibold">Pokkali Village</div>
          <p className="text-muted-foreground mt-2 max-w-xs">
            Walk the fields. Ride the waters. Taste the story of a vanishing grain — alive again.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Visit</div>
          <p>Kadamakkudy Islands, Ernakulam, Kerala</p>
          <p>+91 484 000 0000</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Tours</div>
          <p>Half-day · Full-day · Multi-day immersives</p>
          <p className="text-muted-foreground mt-3">© {new Date().getFullYear()} Pokkali Village</p>
        </div>
      </div>
    </footer>
  );
}