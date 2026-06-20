import { Link } from "@tanstack/react-router";
import { Wheat, LogIn, LayoutDashboard, LogOut, MapPin, Home, Compass, User, Mail, Phone, Facebook, Instagram, Twitter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const { user, isAdmin } = useAuth();
  return (
    <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top)] bg-background/90 backdrop-blur-md border-b border-border/60">
      {/* Top contact bar — desktop only */}
      <div className="hidden md:block bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 h-10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-secondary" /> hello@pokkalivillage.in</span>
            <span className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-secondary" /> Kadamakkudy Islands, Kerala</span>
          </div>
          <div className="flex items-center gap-4 text-primary-foreground/80">
            <Twitter className="h-3.5 w-3.5 hover:text-secondary cursor-pointer" />
            <Facebook className="h-3.5 w-3.5 hover:text-secondary cursor-pointer" />
            <Instagram className="h-3.5 w-3.5 hover:text-secondary cursor-pointer" />
          </div>
        </div>
      </div>
      {/* Main bar */}
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="relative inline-flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-full bg-primary text-secondary ring-4 ring-secondary/30">
            <Wheat className="h-6 w-6 md:h-7 md:w-7" />
          </span>
          <div className="leading-tight min-w-0">
            <div className="font-display text-lg md:text-xl font-semibold truncate">Pokkali Village</div>
            <div className="hidden sm:block text-[10px] uppercase tracking-[0.22em] text-muted-foreground -mt-0.5">
              Best Quality Heritage Food
            </div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <Link to="/" hash="tours" className="hover:text-primary transition">Tours</Link>
          <Link to="/" hash="story" className="hover:text-primary transition">Our Story</Link>
          <Link to="/" hash="visit" className="hover:text-primary transition">Visit</Link>
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
            <Button asChild variant="hero" className="rounded-full pl-5 pr-2 h-11 hidden sm:inline-flex">
              <Link to="/auth">
                Book a Tour
                <span className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-secondary">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </Button>
          )}
          {!user && (
            <Button asChild size="sm" className="sm:hidden">
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