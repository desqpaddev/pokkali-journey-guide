import { useEffect, useRef, useState } from "react";
import { Play, Pause, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lang } from "@/lib/geo";
import { LANG_LOCALE } from "@/lib/geo";

interface Props {
  audioUrl?: string | null;
  fallbackText?: string | null;
  lang: Lang;
  autoplay?: boolean;
  voice?: string;
}

export function AudioPlayer({ audioUrl, fallbackText, lang, autoplay, voice }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [src, setSrc] = useState<string | null>(audioUrl || null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setSrc(audioUrl || null);
    setErr(null);
  }, [audioUrl, fallbackText, lang]);

  // Browser TTS fallback
  function browserTTS() {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !fallbackText) return false;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(fallbackText);
    u.lang = LANG_LOCALE[lang];
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(u);
    setPlaying(true);
    return true;
  }

  async function play(isAuto = false) {
    setErr(null);
    if (src) {
      try {
        await audioRef.current?.play();
        setPlaying(true);
      } catch {
        if (isAuto && browserTTS()) return;
        setErr("Tap to play");
      }
      return;
    }
    if (!fallbackText) {
      setErr("No audio available");
      return;
    }
    // Try server TTS first (better quality), fall back to browser
    setLoading(true);
    try {
      const r = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fallbackText, voice: voice || "alloy" }),
      });
      if (!r.ok) throw new Error(String(r.status));
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      setSrc(url);
      setLoading(false);
      setTimeout(async () => {
        try {
          await audioRef.current?.play();
          setPlaying(true);
        } catch {
          if (isAuto && browserTTS()) return;
          setErr("Tap to play");
        }
      }, 50);
    } catch {
      setLoading(false);
      if (!browserTTS()) setErr("Audio unavailable");
    }
  }

  function pause() {
    audioRef.current?.pause();
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setPlaying(false);
  }

  useEffect(() => {
    if (autoplay && (src || fallbackText)) play(true);
    return () => pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center gap-3">
      <Button onClick={() => (playing ? pause() : play(false))} size="lg" variant="hero" disabled={loading}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        {playing ? "Pause" : loading ? "Loading…" : "Play story"}
      </Button>
      {src && (
        <audio
          ref={audioRef}
          src={src}
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          controls
          className="flex-1 h-9"
        />
      )}
      {err && <span className="text-xs text-destructive">{err}</span>}
    </div>
  );
}