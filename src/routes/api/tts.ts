import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { text, voice = "alloy" } = (await request.json()) as {
          text: string;
          voice?: string;
        };
        if (!text || text.length > 20000) {
          return new Response("Invalid text", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("AI not configured", { status: 500 });
        // Split long text into <=3500 char chunks on sentence boundaries.
        const chunks: string[] = [];
        const MAX = 3500;
        if (text.length <= MAX) {
          chunks.push(text);
        } else {
          const sentences = text.split(/(?<=[.!?。！？])\s+/);
          let buf = "";
          for (const s of sentences) {
            if ((buf + " " + s).trim().length > MAX) {
              if (buf) chunks.push(buf.trim());
              if (s.length > MAX) {
                for (let i = 0; i < s.length; i += MAX) chunks.push(s.slice(i, i + MAX));
                buf = "";
              } else {
                buf = s;
              }
            } else {
              buf = buf ? buf + " " + s : s;
            }
          }
          if (buf) chunks.push(buf.trim());
        }
        const parts: Uint8Array[] = [];
        for (const chunk of chunks) {
          const resp = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "openai/gpt-4o-mini-tts",
              input: chunk,
              voice,
              response_format: "mp3",
            }),
          });
          if (!resp.ok) {
            const body = await resp.text();
            return new Response(`TTS failed: ${resp.status} ${body}`, { status: resp.status });
          }
          parts.push(new Uint8Array(await resp.arrayBuffer()));
        }
        const total = parts.reduce((n, p) => n + p.length, 0);
        const merged = new Uint8Array(total);
        let offset = 0;
        for (const p of parts) {
          merged.set(p, offset);
          offset += p.length;
        }
        return new Response(merged, {
          headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});