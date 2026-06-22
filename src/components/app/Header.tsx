import { Link } from "@tanstack/react-router";
import { Wheat, LogIn, LayoutDashboard, LogOut, MapPin, Home, Compass, User, Mail, Phone, Facebook, Instagram, Twitter, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { NewsletterForm } from "@/components/app/NewsletterForm";
import paadiLogo from "@/assets/paadi-logo.png.asset.json";

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
          <img
            src={paadiLogo.url}
            alt="PAADI"
            className="h-10 w-auto md:h-12"
          />
          <div className="leading-tight min-w-0">
            <div className="font-display text-lg md:text-xl font-semibold truncate">PAADI</div>
            <div className="hidden sm:block text-[10px] uppercase tracking-[0.22em] text-muted-foreground -mt-0.5">
              Best Quality Heritage Food
            </div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <Link to="/" hash="tours" className="hover:text-primary transition">Tours</Link>
          <Link to="/" hash="story" className="hover:text-primary transition">Our Story</Link>
          <Link to="/" hash="visit" className="hover:text-primary transition">Visit</Link>
          <Link to="/blog" className="hover:text-primary transition" activeProps={{ className: "text-primary" }}>Blog</Link>
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
    { to: "/blog", label: "Blog", icon: BookOpen },
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
    <footer className="relative isolate overflow-hidden bg-primary text-primary-foreground pb-20 md:pb-0">
      {/* Creative SVG illustration background */}
      <svg
        aria-hidden
        className="absolute inset-x-0 bottom-0 w-full h-full text-secondary/20 pointer-events-none"
        viewBox="0 0 1440 700"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <pattern id="footer-grain" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.5" />
          </pattern>
          <linearGradient id="footer-sun" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="1440" height="700" fill="url(#footer-grain)" />
        {/* Sun */}
        <circle cx="1200" cy="180" r="120" fill="url(#footer-sun)" />
        <circle cx="1200" cy="180" r="60" fill="currentColor" opacity="0.35" />
        {/* Concentric rings */}
        <circle cx="120" cy="120" r="80" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <circle cx="120" cy="120" r="140" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25" />
        <circle cx="120" cy="120" r="200" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.15" />
        {/* Mountain silhouettes */}
        <path d="M0,520 L160,380 L320,460 L520,320 L720,440 L920,360 L1120,460 L1300,380 L1440,440 L1440,560 L0,560 Z" fill="currentColor" opacity="0.18" />
        <path d="M0,560 L200,460 L420,540 L640,440 L860,520 L1080,460 L1300,520 L1440,480 L1440,620 L0,620 Z" fill="currentColor" opacity="0.22" />
        {/* Wave-like rolling fields */}
        <path d="M0,620 C240,560 480,680 720,610 C960,540 1200,660 1440,600 L1440,700 L0,700 Z" fill="currentColor" opacity="0.35" />
        <path d="M0,660 C240,620 480,720 720,660 C960,600 1200,720 1440,670 L1440,700 L0,700 Z" fill="currentColor" opacity="0.5" />
        {/* Sprout sprigs */}
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6">
          <path d="M260,640 Q258,610 250,595 M260,640 Q262,615 272,605" />
          <path d="M540,640 Q538,605 530,590 M540,640 Q542,610 552,600" />
          <path d="M880,640 Q878,605 870,590 M880,640 Q882,610 892,600" />
          <path d="M1180,640 Q1178,605 1170,590 M1180,640 Q1182,610 1192,600" />
        </g>
      </svg>

      <div className="relative">
      {/* Bottom dark CTA banner */}
      <div className="container mx-auto px-4 pt-16">
        <div className="bg-primary border border-primary-foreground/15 rounded-3xl px-8 py-10 md:px-14 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={paadiLogo.url}
              alt="PAADI"
              className="h-12 w-auto"
            />
            <div className="font-display text-2xl md:text-3xl uppercase max-w-md leading-tight">
              We're a popular leader in heritage tourism & organic farming.
            </div>
          </div>
          <Button asChild className="rounded-full h-12 pl-6 pr-2 bg-secondary text-secondary-foreground hover:bg-secondary">
            <Link to="/" hash="tours">
              Discover More
              <span className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-secondary">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 4-column footer */}
      <div className="container mx-auto px-4 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
        <div>
          <div className="flex items-center gap-2">
            <img
              src={paadiLogo.url}
              alt="PAADI"
              className="h-10 w-auto"
            />
            <div className="font-display text-lg font-semibold">PAADI</div>
          </div>
          <p className="text-primary-foreground/70 mt-4 leading-relaxed">
            Walk the fields. Ride the waters. Taste the story of a vanishing grain — alive again through curious travellers.
          </p>
          <div className="flex items-center gap-3 mt-5">
            {[Twitter, Facebook, Instagram].map((Icon, i) => (
              <span key={i} className="h-9 w-9 rounded-full border border-primary-foreground/20 grid place-items-center hover:bg-secondary hover:text-secondary-foreground hover:border-secondary cursor-pointer transition">
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="font-display text-base uppercase tracking-wider mb-5">Explore</div>
          <ul className="space-y-2.5 text-primary-foreground/80">
            <li><Link to="/" hash="tours" className="hover:text-secondary">Tours</Link></li>
            <li><Link to="/" hash="story" className="hover:text-secondary">Our Story</Link></li>
            <li><Link to="/" hash="visit" className="hover:text-secondary">Visit</Link></li>
            <li><Link to="/blog" className="hover:text-secondary">Blog</Link></li>
            <li><Link to="/bookings" className="hover:text-secondary">My Bookings</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-display text-base uppercase tracking-wider mb-5">Tours</div>
          <ul className="space-y-2.5 text-primary-foreground/80">
            <li>Half-day Heritage Walk</li>
            <li>Full-day Backwater Circuit</li>
            <li>Multi-day Immersive</li>
            <li>Private Custom Tours</li>
          </ul>
        </div>
        <div>
          <div className="font-display text-base uppercase tracking-wider mb-5">Contact</div>
          <ul className="space-y-2.5 text-primary-foreground/80">
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 text-secondary mt-0.5 shrink-0" /> +91 484 000 0000</li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 text-secondary mt-0.5 shrink-0" /> hello@pokkalivillage.in</li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-secondary mt-0.5 shrink-0" /> Kadamakkudy Islands, Ernakulam, Kerala</li>
          </ul>
          <div className="mt-5">
            <div className="text-[11px] uppercase tracking-widest text-secondary mb-2">Newsletter</div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-5 text-xs text-primary-foreground/60 flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Pokkali Village. Heritage Circuit Tours.</span>
          <span>Crafted with the farmers of Kadamakkudy</span>
        </div>
      </div>
      </div>
    </footer>
  );
}