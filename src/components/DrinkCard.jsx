// components/DrinkCard.jsx
import { useState } from "react";
import { getMissingIngredients, ingredientOnShelf, getShelfNames, calcMatchPct } from "../utils/shelfMatch";

const CATEGORY_COLORS = {
  Cocktail:    { bg: "#0d1a3a", border: "#2563eb", badge: "#2563eb" },
  Mocktail:    { bg: "#1a1a0d", border: "#6a6a2d", badge: "#8a8a3d" },
  Traditional: { bg: "#1a0d0d", border: "#6a2d2d", badge: "#8a4d3d" },
  Shot:        { bg: "#1a0d1a", border: "#6a2d6a", badge: "#8a4d8a" },
  Wine:        { bg: "#1a0d0d", border: "#8b1a1a", badge: "#b03030" },
  Beer:        { bg: "#1a1500", border: "#6a5500", badge: "#8a7000" },
};

export default function DrinkCard({
  drink, shelf = [], favorites = [],
  onUpdateFavorites = () => {}, onAddToShopping = () => {},
  onDeleteDrink = () => {}, onMakeDrink = () => {},
}) {
  const [expanded, setExpanded] = useState(false);
  const [deleted, setDeleted]   = useState(false);

  const c          = CATEGORY_COLORS[drink.category] || CATEGORY_COLORS.Cocktail;
  const shelfNames = getShelfNames(shelf);
  const missing    = getMissingIngredients(drink, shelf);
  const matchPct   = calcMatchPct(drink, shelf);
  const isFav      = favorites.includes(drink.id);

  function handleDelete() { setDeleted(true); setTimeout(() => onDeleteDrink(drink.id), 280); }
  if (deleted) return null;

  return (
    <div style={{ border: `1px solid ${c.border}`, borderRadius: 14, marginBottom: 12, background: c.bg, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
      <div style={{ padding: 14 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
              <h3 style={{ margin: 0, fontSize: 15, color: "#f0ebe3" }}>{drink.title}</h3>
              <span style={{ fontSize: 10, background: c.badge, color: "#fff", padding: "2px 6px", borderRadius: 50, fontWeight: 700 }}>{drink.category}</span>
              {drink.generated && <span style={{ fontSize: 10, background: "#1a3a5c", color: "#90cdf4", padding: "2px 6px", borderRadius: 50, fontWeight: 700 }}>🤖 AI</span>}
              {!drink.alcoholic && <span style={{ fontSize: 10, background: "#1a3a1a", color: "#9ae6b4", padding: "2px 6px", borderRadius: 50, fontWeight: 700 }}>🌿 Non-alc</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ height: 4, width: 60, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${matchPct}%`, borderRadius: 2, background: matchPct === 100 ? "#2563eb" : matchPct >= 50 ? "#6a6a2d" : "#6a2d2d" }} />
                </div>
                <span style={{ fontSize: 11, color: "#718096" }}>{matchPct}% {matchPct === 100 && "🎉"}</span>
              </div>
              {drink.origin && <span style={{ fontSize: 11, color: "#718096" }}>🌍 {drink.origin}</span>}
              {drink.prepTime && <span style={{ fontSize: 11, color: "#718096" }}>⏱ {drink.prepTime}</span>}
            </div>
          </div>
          <button type="button"
            onClick={() => onUpdateFavorites(isFav ? favorites.filter(id => id !== drink.id) : [...favorites, drink.id])}
            style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", padding: "0 4px", marginLeft: 8 }}>
            {isFav ? "❤️" : "🤍"}
          </button>
        </div>

        {drink.description && (
          <p style={{ fontSize: 13, color: "rgba(240,235,227,0.6)", marginBottom: 8, lineHeight: 1.5 }}>{drink.description}</p>
        )}

        {/* Expand */}
        <button type="button" onClick={() => setExpanded(v => !v)}
          style={{ background: "none", border: "none", color: "#2563eb", fontSize: 13, cursor: "pointer", padding: "4px 0" }}>
          {expanded ? "▲ Hide" : "▼ Show"} ingredients ({drink.ingredients?.length || 0})
        </button>

        {expanded && (
          <div style={{ marginTop: 6 }}>
            <ul style={{ paddingLeft: 16, margin: "0 0 8px", fontSize: 13 }}>
              {(drink.ingredients || []).map((ing, i) => {
                const have = ingredientOnShelf(ing, shelfNames);
                return <li key={i} style={{ color: have ? "#2563eb" : "#e53e3e", marginBottom: 2 }}>{have ? "✓" : "✗"} {ing}</li>;
              })}
            </ul>
            {drink.glassware && <p style={{ fontSize: 12, color: "#718096", marginBottom: 4 }}>🥃 Glassware: {drink.glassware}</p>}
            {drink.garnish   && <p style={{ fontSize: 12, color: "#718096", marginBottom: 8 }}>🍋 Garnish: {drink.garnish}</p>}
            {missing.length > 0 && (
              <div style={{ background: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.3)", borderRadius: 8, padding: 10 }}>
                <strong style={{ fontSize: 12, color: "#fc8181" }}>Missing: {missing.join(", ")}</strong>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          <button type="button" onClick={() => onMakeDrink(drink)}
            style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>🍹 Make It</button>
          <button type="button" onClick={() => onAddToShopping(missing.length ? missing : drink.ingredients)}
            style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(45,106,79,0.4)", background: "transparent", color: "#2563eb", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
            🛒 {missing.length ? `Add ${missing.length} missing` : "Add all"}
          </button>
          <button type="button" onClick={handleDelete}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(229,62,62,0.3)", background: "rgba(229,62,62,0.1)", cursor: "pointer", fontSize: 13 }}>🗑</button>
        </div>
      </div>
    </div>
  );
}
