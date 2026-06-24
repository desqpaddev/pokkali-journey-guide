import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/app/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, ScanLine, CheckCircle2, Radio, Volume2 } from "lucide-react";
import { AudioPlayer } from "@/components/app/AudioPlayer";
import { LangPicker } from "@/components/app/LangPicker";
import { QRScannerModal } from "@/components/app/QRScannerModal";
import { haversineMeters, type Lang } from "@/lib/geo";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/tour/$bookingId")({
  component: TourPlayer,
});

function TourPlayer() {
  const { bookingId } = Route.useParams();
  const [lang, setLang] = useState<Lang>("english");
  const [pos, setPos] = useState<{ lat: number; lng: number; acc: number } | null>(null);
  const [posErr, setPosErr] = useState<string | null>(null);
  const [triggered, setTriggered] = useState<Set<string>>(new Set());
  const [activeDestId, setActiveDestId] = useState<string | null>(null);
  const [scanOpen, setScanOpen] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<any | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const { data } = useQuery({
    queryKey: ["tour", bookingId],
    queryFn: async () => {
      const { data: b } = await supabase
        .from("bookings")
        .select("*, packages(*)")
        .eq("id", bookingId)
        .maybeSingle();
      if (!b) return null;
      const { data: dests } = await supabase
        .from("destinations")
        .select("*")
        .eq("package_id", b.package_id)
        .order("stop_order");
      return { booking: b, destinations: dests ?? [] };
    },
  });

  useEffect(() => {
    if (data?.booking?.preferred_language) setLang(data.booking.preferred_language as Lang);
  }, [data?.booking?.preferred_language]);

  // GPS watch
  const watchId = useRef<number | null>(null);
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setPosErr("Geolocation not supported");
      return;
    }
    watchId.current = navigator.geolocation.watchPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy });
        setPosErr(null);
      },
      (e) => setPosErr(e.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  // Auto-trigger story when entering a destination radius
  useEffect(() => {
    if (!pos || !data?.destinations) return;
    for (const d of data.destinations) {
      const dist = haversineMeters(pos.lat, pos.lng, Number(d.latitude), Number(d.longitude));
      if (dist <= (d.trigger_radius_meters ?? 50) && !triggered.has(d.id)) {
        setTriggered((s) => new Set(s).add(d.id));
        setActiveDestId(d.id);
        toast.success(`You've reached ${d.name}`, { description: "Story is playing." });
        break;
      }
    }
  }, [pos, data?.destinations, triggered]);

  async function handleScan(code: string) {
    const { data: p } = await supabase.from("products").select("*").eq("qr_code", code).maybeSingle();
    if (!p) {
      toast.error("Product not found");
      return;
    }
    setScannedProduct(p);
  }

  async function enableTourAudio() {
    try {
      const silentAudio = new Audio("data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgAAAA");
      silentAudio.volume = 0;
      await silentAudio.play();
      silentAudio.pause();
    } catch {
      // Some browsers reject silent unlock files, but the user gesture is still captured.
    }
    setAudioUnlocked(true);
    toast.success("Tour audio enabled", { description: "Stories will start when you reach each stop." });
  }

  if (!data) return <div className="min-h-screen bg-background"><Header /><div className="container mx-auto px-4 py-16">Loading tour…</div></div>;
  const { booking, destinations } = data;
  const activeDest = destinations.find((d) => d.id === activeDestId) ?? null;

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Link to="/bookings" className="text-xs text-muted-foreground hover:text-primary">← My tours</Link>
        <h1 className="font-display text-3xl mt-2">{booking.packages?.title}</h1>
        <p className="text-sm text-muted-foreground">{booking.tour_date} · {booking.num_guests} guests</p>

        <div className="mt-6 flex flex-wrap gap-3 items-center">
          <LangPicker value={lang} onChange={setLang} />
          <Badge variant="outline" className="gap-1">
            <Radio className={`h-3 w-3 ${pos ? "text-green-600 animate-pulse" : "text-muted-foreground"}`} />
            {pos ? `GPS ±${Math.round(pos.acc)}m` : posErr ?? "Locating…"}
          </Badge>
          {!audioUnlocked && (
            <Button onClick={enableTourAudio} variant="hero" size="sm" className="min-h-10">
              <Volume2 className="h-4 w-4" /> Enable audio
            </Button>
          )}
        </div>

        {activeDest && (
          <Card className="p-6 mt-6 border-accent/40 bg-accent/5">
            <div className="flex items-center gap-2 text-accent text-xs uppercase tracking-widest font-semibold">
              <MapPin className="h-4 w-4" /> Now playing
            </div>
            <h2 className="font-display text-2xl mt-1">{activeDest.name}</h2>
            {activeDest.description && <p className="text-sm text-muted-foreground mt-1">{activeDest.description}</p>}
            <div className="mt-4">
              <AudioPlayer
                key={`${activeDest.id}-${lang}`}
                audioUrl={activeDest[`audio_${lang}_url`] as string | null}
                fallbackText={activeDest[`story_${lang}`] as string | null}
                lang={lang}
                autoplay={audioUnlocked}
              />
            </div>
            {activeDest[`story_${lang}`] && (
              <details className="mt-4 text-sm">
                <summary className="cursor-pointer text-muted-foreground">Read the story</summary>
                <p className="mt-2 whitespace-pre-line leading-relaxed">{activeDest[`story_${lang}`]}</p>
              </details>
            )}
          </Card>
        )}

        <h3 className="font-display text-xl mt-10 mb-3">All stops</h3>
        <div className="space-y-2">
          {destinations.map((d) => {
            const isTriggered = triggered.has(d.id);
            const dist = pos ? haversineMeters(pos.lat, pos.lng, Number(d.latitude), Number(d.longitude)) : null;
            return (
              <Card
                key={d.id}
                className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${activeDestId === d.id ? "border-accent" : ""}`}
                onClick={() => setActiveDestId(d.id)}
              >
                <div className={`h-10 w-10 rounded-full grid place-items-center font-display font-semibold ${isTriggered ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {isTriggered ? <CheckCircle2 className="h-5 w-5" /> : d.stop_order}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{d.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {dist !== null ? `${Math.round(dist)} m away` : "—"} · trigger {d.trigger_radius_meters}m
                  </div>
                </div>
                <Navigation className="h-4 w-4 text-muted-foreground" />
              </Card>
            );
          })}
        </div>

        {!destinations.length && (
          <Card className="p-8 text-center text-muted-foreground mt-4">
            No destinations set for this tour yet. Admin can add them.
          </Card>
        )}
      </div>

      {/* Sticky scan button — lifted above mobile bottom nav */}
      <div className="fixed inset-x-0 flex justify-center z-[60] px-4 bottom-24 md:bottom-6" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <Button onClick={() => setScanOpen(true)} variant="hero" size="xl" className="shadow-2xl">
          <ScanLine className="h-5 w-5" /> Scan a product
        </Button>
      </div>

      <QRScannerModal open={scanOpen} onOpenChange={setScanOpen} onScan={handleScan} />

      {/* Product result */}
      {scannedProduct && (
        <div
          className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto"
          onClick={() => setScannedProduct(null)}
        >
          <Card
            className="w-full sm:max-w-lg overflow-hidden rounded-b-none sm:rounded-lg max-h-[90vh] flex flex-col my-0 sm:my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {scannedProduct.image_url && (
              <img
                src={scannedProduct.image_url}
                alt={scannedProduct.name}
                className="h-40 sm:h-48 w-full object-cover shrink-0"
              />
            )}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-w-0">
              <Badge className="bg-accent text-accent-foreground">Pokkali product</Badge>
              <h3 className="font-display text-xl sm:text-2xl mt-2 break-words">{scannedProduct.name}</h3>
              {scannedProduct.description && (
                <p className="text-sm text-muted-foreground mt-1 break-words">{scannedProduct.description}</p>
              )}
              {scannedProduct.price && (
                <div className="font-display text-lg sm:text-xl mt-2">
                  ₹{Number(scannedProduct.price).toLocaleString()}
                </div>
              )}
              <div className="mt-4">
                <AudioPlayer
                  key={`${scannedProduct.id}-${lang}`}
                  audioUrl={scannedProduct[`audio_${lang}_url`]}
                  fallbackText={scannedProduct[`story_${lang}`]}
                  lang={lang}
                  autoplay={audioUnlocked}
                />
              </div>
              {scannedProduct[`story_${lang}`] && (
                <p className="text-sm mt-4 whitespace-pre-line leading-relaxed break-words">
                  {scannedProduct[`story_${lang}`]}
                </p>
              )}
              <Button
                onClick={() => setScannedProduct(null)}
                variant="outline"
                className="w-full mt-4"
                style={{ marginBottom: "env(safe-area-inset-bottom)" }}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}