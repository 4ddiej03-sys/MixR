// components/OnlineDrinkSearch.jsx
import { useState } from "react";
import { callAI } from "../utils/callAI";

const TRADITIONS = [
  { flag: "🇯🇵", label: "Japanese", query: "traditional Japanese drinks" },
  { flag: "🇲🇾", label: "Malaysian", query: "traditional Malaysian drinks" },
  { flag: "🇵🇭", label: "Filipino", query: "traditional Filipino drinks" },
  { flag: "🇲🇽", label: "Mexican", query: "traditional Mexican drinks" },
  { flag: "🇨🇺", label: "Cuban", query: "traditional Cuban cocktails" },
  { flag: "🇮🇳", label: "Indian", query: "traditional Indian drinks" },
  { flag: "🇳🇿", label: "Māori", query: "traditional Māori New Zealand drinks" },
  { flag: "🇧🇷", label: "Brazilian", query: "traditional Brazilian drinks" },
  { flag: "🇹🇭", label: "Thai", query: "traditional Thai drinks" },
  { flag: "🇲🇦", label: "Moroccan", query: "traditional Moroccan drinks" },
  { flag: "🇰🇷", label: "Korean", query: "traditional Korean drinks" },
  { flag: "🇹🇷", label: "Turkish", query: "traditional Turkish drinks" },
];

export default function OnlineDrinkSearch({ shelf = [], onSaveDrink, onClose }) {
  const [query, setQuery]     = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError]     = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(searchQuery) {
    const q = searchQuery || query;
    if (!q.trim()) return;
    setLoading(true); setError(""); setResults([]); setSearched(false);

    const shelfItems = shelf.map(i => typeof i === "object" ? i.name : i).join(", ");

    const prompt = `You are a world-class bartender and drinks expert.

Search for and provide 4 drink recipes related to: "${q}"

Focus on traditional, cultural, and authentic recipes from around the world.
${shelfItems ? `The user has these items on their shelf: ${shelfItems}. Prioritise drinks they can make.` : ""}

Reply ONLY with valid JSON (no markdown):
{
  "drinks": [
    {
      "id": "unique-id",
      "title": "Drink Name",
      "category": "Cocktail/Mocktail/Traditional/Shot/Wine/Beer",
      "origin": "Country",
      "difficulty": "Easy/Medium/Hard",
      "prepTime": "X mins",
      "servings": 1,
      "alcoholic": true/false,
      "description": "One sentence about this drink and its cultural significance",
      "glassware": "Type of glass",
      "garnish": "Garnish",
      "ingredients": ["amount ingredient"],
      "steps": ["Step 1", "Step 2"],
      "tags": ["traditional", "cultural"]
    }
  ]
}`;

    try {
      const result = await callAI(prompt, 2000);
      if (!Array.isArray(result.drinks)) throw new Error("No results found.");
      setResults(result.drinks.map(d => ({ ...d, id: d.id || crypto.randomUUID(), fromOnline: true })));
      setSearched(true);
    } catch (err) {
      setError(err.message || "Search failed — try again.");
    }
    setLoading(false);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "#1a1a1a", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 480, maxHeight: "92vh", overflowY: "auto", padding: 20 }}>
        <div style={{ width: 40, height: 4, background: "#333", borderRadius: 2, margin: "0 auto 16px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "#f0ebe3" }}>🌍 Traditional Drinks</h3>
          <button type="button" onClick={onClose}
            style={{ background: "#333", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "#f0ebe3", fontSize: 16 }}>✕</button>
        </div>
        <p style={{ fontSize: 13, color: "#718096", marginBottom: 16 }}>
          Discover authentic drinks from cultures around the world
        </p>

        {/* Search bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Search any drink or culture…"
            style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #333", background: "#111", color: "#f0ebe3", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
          <button type="button" onClick={() => handleSearch()} disabled={loading}
            style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "…" : "🔍"}
          </button>
        </div>

        {/* Quick tradition pills */}
        {!searched && (
          <>
            <p style={{ fontSize: 12, color: "#718096", marginBottom: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
              Browse by culture
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {TRADITIONS.map((t, i) => (
                <button key={i} type="button" onClick={() => { setQuery(t.label); handleSearch(t.query); }}
                  style={{ padding: "8px 14px", borderRadius: 50, border: "1px solid #333", background: "#111", color: "#f0ebe3", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  {t.flag} {t.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ width: 36, height: 36, border: "3px solid #333", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            <p style={{ color: "#718096", fontSize: 14 }}>🌍 Finding authentic recipes…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
            <p style={{ color: "#fc8181", fontSize: 13, margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        {/* Results */}
        {results.map((drink, i) => (
          <div key={i} style={{ background: "#0d1a3a", border: "1px solid rgba(45,106,79,0.3)", borderRadius: 14, padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 4px", fontSize: 15, color: "#f0ebe3" }}>{drink.title}</h4>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {drink.origin && <span style={{ fontSize: 11, color: "#718096" }}>🌍 {drink.origin}</span>}
                  {drink.prepTime && <span style={{ fontSize: 11, color: "#718096" }}>⏱ {drink.prepTime}</span>}
                  {!drink.alcoholic && <span style={{ fontSize: 11, color: "#2563eb" }}>🌿 Non-alc</span>}
                </div>
              </div>
              <button type="button" onClick={() => { onSaveDrink(drink); onClose(); }}
                style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", marginLeft: 8 }}>
                + Save
              </button>
            </div>
            {drink.description && <p style={{ fontSize: 13, color: "rgba(240,235,227,0.6)", margin: "0 0 8px", lineHeight: 1.5 }}>{drink.description}</p>}
            <p style={{ fontSize: 12, color: "#718096", margin: 0 }}>
              {drink.ingredients?.slice(0, 3).join(", ")}{drink.ingredients?.length > 3 ? ` +${drink.ingredients.length - 3} more` : ""}
            </p>
          </div>
        ))}

        {searched && !loading && results.length > 0 && (
          <button type="button" onClick={() => { setResults([]); setSearched(false); setQuery(""); }}
            style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #333", background: "transparent", color: "#718096", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
            🔄 New Search
          </button>
        )}
      </div>
    </div>
  );
}
