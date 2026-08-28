import { createServerFn } from "@tanstack/react-start";
import { CHARACTERS, CHARACTER_NAMES, formatCast, type CharacterId } from "./data";

export type SceneWriterInput = {
  config: {
    cast: string[];
    timeline: string;
    setting: string;
    premise: string;
    mood?: string;
  };
  entries: { label: string; text: string }[];
  instruction: string;
};

export const continueScene = createServerFn({ method: "POST" })
  .validator((input: SceneWriterInput) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "Scene Writer is not available right now." };
    }

    const cast = formatCast(data.config.cast ?? []);
    const names = (data.config.cast ?? [])
      .map((id) => CHARACTER_NAMES[id as CharacterId] ?? id)
      .join(", ");
    const briefs = (data.config.cast ?? [])
      .map((id) => CHARACTERS.find((c) => c.id === id))
      .filter((c): c is (typeof CHARACTERS)[number] => Boolean(c))
      .map((c) => {
        const core = c.profile.find((row) => row.title === "Core")?.body ?? "";
        return `${c.name} (${c.role}) — ${c.kicker}\nVoice: ${c.voice}\n${core}`;
      })
      .join("\n\n");
    const recent = (data.entries ?? [])
      .slice(-6)
      .map((e) => `${e.label}: ${e.text}`)
      .join("\n\n");
    const instruction =
      data.instruction?.trim() || "Continue naturally from the current moment.";

    const system = `You are the Scene Writer for Project Lunelle, a dreamy editorial atelier.
Write literary, visual, slice-of-life prose for a childhood seaside romance set in Kanagawa.
The principal children are about 10–11 years old. Keep every beat age-appropriate, tender, and grounded — no romance beyond shy noticing, no adult themes, no violence.
Stay true to each character's voice and lore. Do not make anyone speak out of character.
Style: close third person, sensory, unhurried. Late-afternoon light, wind, tide, small gestures. 2–4 short paragraphs. Do not title the piece. Do not recap the configuration. Continue from the latest beat.`;

    const user = `Cast: ${names || cast}
Timeline: ${data.config.timeline}
Setting: ${data.config.setting}
Premise: ${data.config.premise}
Mood: ${data.config.mood || "unhurried"}

Character briefs:
${briefs || "(no briefs)"}

Notebook so far:
${recent || "(opening only)"}

Director instruction:
${instruction}`;

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          temperature: 0.9,
          max_tokens: 700,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (!res.ok) {
        return {
          ok: false as const,
          error: "Unable to continue this scene right now.",
        };
      }
      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = body.choices?.[0]?.message?.content?.trim() ?? "";
      if (!text) {
        return { ok: false as const, error: "Unable to continue this scene right now." };
      }
      return { ok: true as const, text };
    } catch {
      return { ok: false as const, error: "Unable to continue this scene right now." };
    }
  });