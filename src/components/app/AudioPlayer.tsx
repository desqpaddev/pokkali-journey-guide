import { useEffect, useRef, useState } from "react";
import { Play, Pause, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Lang } from "@/lib/geo";
import { LANG_LOCALE } from "@/lib/geo";

interface Props {
  audioUrl?: string | null;
  fallbackText?: string | null;
  lang: Lang;
  autoplay?: boolean;
  voice?: string;
}

const SILENT_AUDIO_SRC =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQQAAAAAAA==";

let sharedAudio: HTMLAudioElement | null = null;

function getSharedAudio() {
  if (typeof window === "undefined") return null;
  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.preload = "auto";
    sharedAudio.setAttribute("playsinline", "true");
  }
  return sharedAudio;
}

function getProductMediaPath(value: string) {
  if (value.startsWith("storage://product-media/")) return value.replace("storage://product-media/", "");
  if (value.startsWith("product-media/")) return value.replace("product-media/", "");
  try {
    const url = new URL(value);
    const publicMarker = "/storage/v1/object/public/product-media/";
    const objectMarker = "/storage/v1/object/product-media/";
    const signedMarker = "/storage/v1/object/sign/product-media/";
    if (url.pathname.includes(signedMarker)) return null;
    const marker = url.pathname.includes(publicMarker) ? publicMarker : url.pathname.includes(objectMarker) ? objectMarker : null;
    if (!marker) return null;
    return decodeURIComponent(url.pathname.split(marker)[1] ?? "");
  } catch {
    return null;
  }
}

export async function unlockTourAudio() {
  const audio = getSharedAudio();
  if (!audio) return false;
  try {
    audio.pause();
    audio.src = SILENT_AUDIO_SRC;
    audio.volume = 0;
    await audio.play();
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;
    return true;
  } catch {
    audio.volume = 1;
    return false;
  }
}

export async function resolvePlayableAudioUrl(audioUrl?: string | null) {
  if (!audioUrl) return null;
  const storagePath = getProductMediaPath(audioUrl);
  if (!storagePath) return audioUrl;
  const { data, error } = await supabase.storage.from("product-media").createSignedUrl(storagePath, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}

function speakStoryText(fallbackText: string | null | undefined, lang: Lang, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !fallbackText) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(fallbackText);
  utterance.lang = LANG_LOCALE[lang];
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
  return true;
}

export async function playStoryAudio({
  audioUrl,
  fallbackText,
  lang,
}: {
  audioUrl?: string | null;
  fallbackText?: string | null;
  lang: Lang;
}) {
  const audio = getSharedAudio();
  if (audioUrl && audio) {
    const playableUrl = await resolvePlayableAudioUrl(audioUrl);
    if (playableUrl) {
      audio.pause();
      if (audio.src !== playableUrl) audio.src = playableUrl;
      audio.currentTime = 0;
      audio.volume = 1;
      await audio.play();
      return true;
    }
  }
  return speakStoryText(fallbackText, lang);
}

export function AudioPlayer({ audioUrl, fallbackText, lang, autoplay, voice }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoTriedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [src, setSrc] = useState<string | null>(audioUrl || null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    autoTriedRef.current = false;
    pause();
    setErr(null);
    setResolving(false);

    if (!audioUrl) {
      setSrc(null);
      return () => {
        alive = false;
      };
    }

    const storagePath = getProductMediaPath(audioUrl);
    if (!storagePath) {
      setSrc(audioUrl);
      return () => {
        alive = false;
      };
    }

    setSrc(null);
    setResolving(true);
    supabase.storage
      .from("product-media")
      .createSignedUrl(storagePath, 60 * 60)
      .then(({ data, error }) => {
        if (error) throw error;
        if (alive) {
          autoTriedRef.current = false;
          setErr(null);
          setSrc(data.signedUrl);
        }
      })
      .catch(() => {
        if (alive) {
          setSrc(audioUrl);
          setErr("Audio file could not be opened. Please re-upload it from admin if it still will not play.");
        }
      })
      .finally(() => {
        if (alive) setResolving(false);
      });

    return () => {
      alive = false;
    };
  }, [audioUrl, fallbackText, lang]);

  // Browser TTS fallback
  function browserTTS() {
    const ok = speakStoryText(fallbackText, lang, () => setPlaying(false));
    if (ok) setPlaying(true);
    return ok;
  }

  async function play(isAuto = false) {
    setErr(null);
    if (src) {
      try {
        const audio = getSharedAudio();
        if (!audio) throw new Error("Audio not ready");
        audio.onended = () => setPlaying(false);
        audio.onpause = () => setPlaying(false);
        audio.onerror = () => {
          setPlaying(false);
          setErr("Audio file could not load. Please re-upload it from admin if this continues.");
        };
        audio.pause();
        if (audio.src !== src) audio.src = src;
        audio.currentTime = 0;
        audio.volume = 1;
        await audio.play();
        setPlaying(true);
      } catch {
        if (isAuto && browserTTS()) return;
        setErr("Audio could not start. Tap Play story again or check the uploaded file.");
      }
      return;
    }
    if (audioUrl && resolving) {
      setErr("Audio is preparing. Please try again in a moment.");
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
          const audio = getSharedAudio();
          if (!audio) throw new Error("Audio not ready");
          audio.onended = () => setPlaying(false);
          audio.onpause = () => setPlaying(false);
          audio.pause();
          audio.src = url;
          audio.currentTime = 0;
          await audio.play();
          setPlaying(true);
        } catch {
          if (isAuto && browserTTS()) return;
          setErr("Audio is ready. Tap Play story to start.");
        }
      }, 50);
    } catch {
      setLoading(false);
      if (!browserTTS()) setErr("Audio unavailable");
    }
  }

  function pause() {
    sharedAudio?.pause();
    audioRef.current?.pause();
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setPlaying(false);
  }

  useEffect(() => {
    if (!autoplay || autoTriedRef.current || resolving || (!src && !fallbackText)) return;
    autoTriedRef.current = true;
    play(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, src, fallbackText, resolving]);

  useEffect(() => () => pause(), []);

  return (
    <div className="w-full rounded-md border bg-card/70 p-3 shadow-sm">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
      <Button
        onClick={() => (playing ? pause() : play(false))}
        size="lg"
        variant="hero"
        disabled={loading || resolving}
        className="w-full justify-center sm:w-auto"
      >
        {loading || resolving ? <Loader2 className="h-5 w-5 animate-spin" /> : playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        {playing ? "Pause" : loading || resolving ? "Preparing…" : "Play story"}
      </Button>
      {src && (
        <audio
          ref={audioRef}
          src={src}
          onPlay={() => {
            sharedAudio?.pause();
            setPlaying(true);
          }}
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          onError={() => {
            setPlaying(false);
            setErr("Audio file could not load. Please re-upload it from admin if this continues.");
          }}
          controls
          preload="auto"
          className="h-10 w-full min-w-0 flex-1"
        />
      )}
      </div>
      {err && <div className="mt-2 text-xs text-destructive">{err}</div>}
    </div>
  );
}