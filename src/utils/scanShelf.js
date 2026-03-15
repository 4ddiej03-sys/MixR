// utils/scanShelf.js — AI vision scans bar shelf for bottles and mixers
import { callAIWithImage } from "./callAI";

export async function scanShelfFromPhoto(imageFile) {
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  const prompt = `You are a expert bartender scanning a home bar shelf.

Identify ALL bottles, cans, mixers, garnishes and drink-related items you can see.
Be specific: include spirit type, brand if visible, mixers, juices, syrups, bitters, etc.
Use simple common names (e.g. "vodka", "lime juice", "angostura bitters", "tonic water").

Reply ONLY with valid JSON (no markdown):
{
  "items": ["item1", "item2"],
  "confidence": "high/medium/low",
  "notes": "Brief description of what you see"
}

If no drink items visible: {"items": [], "confidence": "low", "notes": "No bar items visible"}`;

  const result = await callAIWithImage(prompt, base64, imageFile.type || "image/jpeg");
  if (!Array.isArray(result.items)) throw new Error("Unexpected response format.");
  return result;
}
