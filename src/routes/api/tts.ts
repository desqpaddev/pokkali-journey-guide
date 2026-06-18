import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { text, voice = "alloy" } = (await request.json()) as {
          text: string;
          voice?: string;
        };
        if (!text || text.length > 4000) {
          return new Response("Invalid text", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("AI not configured", { status: 500 });
        const resp = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini-tts",
            input: text,
            voice,
            response_format: "mp3",
          }),
        });
        if (!resp.ok) {
          return new Response(`TTS failed: ${resp.status}`, { status: resp.status });
        }
        return new Response(resp.body, {
          headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});