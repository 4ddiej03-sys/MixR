// components/ImportDrinkModal.jsx
import { useState } from "react";
import { callAI } from "../utils/callAI";

export default function ImportDrinkModal({ onClose, onSave }) {
  const [url, setUrl]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  async function handleImport() {
    if (!url.trim()) return;
    setLoading(true); setError("");
    try {
      const prompt = `You are a drinks/cocktail recipe extractor.

Fetch and extract the cocktail or drink recipe from this URL: ${url}

Return ONLY valid JSON (no markdown):
{
  "title": "Drink Name",
  "category": "Cocktail/Mocktail/Traditional/Shot/Wine/Beer",
  "origin": "Country of origin or Unknown",
  "difficulty": "Easy/Medium/Hard",
  "prepTime": "X mins",
  "servings": 1,
  "alcoholic": true/false,
  "description": "One sentence description",
  "glassware": "Type of glass or null",
  "garnish": "Garnish or null",
  "ingredients": ["60ml vodka", "30ml lime juice"],
  "steps": ["Step 1", "Step 2"],
  "tags": ["tag1", "tag2"],
  "sourceUrl": "${url}"
}

If you cannot extract a recipe, return: {"error": "Could not extract recipe from this URL"}`;

      const result = await callAI(prompt, 1500);
      if (result.error) throw new Error(result.error);
      if (!result.title) throw new Error("Could not find a drink recipe at this URL.");
      onSave({ ...result, id: crypto.randomUUID(), fromImport: true });
      onClose();
    } catch (err) {
      setError(err.message || "Import failed — try another URL.");
    }
    setLoading(false);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "#1a1a1a", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 480, padding: 24 }}>
        <div style={{ width: 40, height: 4, background: "#333", borderRadius: 2, margin: "0 auto 16px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "#f0ebe3" }}>🔗 Import Recipe</h3>
          <button type="button" onClick={onClose}
            style={{ background: "#333", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "#f0ebe3", fontSize: 16 }}>✕</button>
        </div>

        <p style={{ fontSize: 14, color: "#718096", marginBottom: 16, lineHeight: 1.6 }}>
          Paste a URL from any cocktail website — Difford's Guide, Liquor.com, TailsOnline, or any recipe blog.
        </p>

        <input value={url} onChange={e => setUrl(e.target.value)}
          placeholder="https://www.diffordsguide.com/cocktails/..."
          style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #333", background: "#111", color: "#f0ebe3", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 14 }} />

        {error && (
          <div style={{ background: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
            <p style={{ color: "#fc8181", fontSize: 13, margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        <button type="button" onClick={handleImport} disabled={loading || !url.trim()}
          style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: loading ? "#1a3a6b" : "#2563eb", color: "#fff", fontWeight: 700, fontSize: 16, cursor: loading || !url.trim() ? "not-allowed" : "pointer" }}>
          {loading ? "⏳ Importing…" : "🔗 Import Drink"}
        </button>
      </div>
    </div>
  );
}
