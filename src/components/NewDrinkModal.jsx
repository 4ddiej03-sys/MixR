// components/NewDrinkModal.jsx
import { useState } from "react";

const CATEGORIES = ["Cocktail", "Mocktail", "Traditional", "Shot", "Wine", "Beer"];

export default function NewDrinkModal({ onClose, onSave }) {
  const [title, setTitle]         = useState("");
  const [category, setCategory]   = useState("Cocktail");
  const [origin, setOrigin]       = useState("");
  const [prepTime, setPrepTime]   = useState("");
  const [alcoholic, setAlcoholic] = useState(true);
  const [glassware, setGlassware] = useState("");
  const [garnish, setGarnish]     = useState("");
  const [description, setDesc]    = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps]         = useState([""]);

  function updateIngredient(i, val) {
    const next = [...ingredients]; next[i] = val; setIngredients(next);
  }
  function updateStep(i, val) {
    const next = [...steps]; next[i] = val; setSteps(next);
  }

  function handleSave() {
    if (!title.trim()) return;
    const drink = {
      id: crypto.randomUUID(),
      title: title.trim(),
      category,
      origin: origin.trim(),
      prepTime: prepTime.trim(),
      alcoholic,
      glassware: glassware.trim(),
      garnish: garnish.trim(),
      description: description.trim(),
      ingredients: ingredients.filter(i => i.trim()),
      steps: steps.filter(s => s.trim()),
      servings: 1,
    };
    onSave(drink);
    onClose();
  }

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #333", background: "#111", color: "#f0ebe3", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const labelStyle = { fontSize: 13, color: "#718096", fontWeight: 600, display: "block", marginBottom: 6 };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "#1a1a1a", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 480, maxHeight: "92vh", overflowY: "auto", padding: 20 }}>
        <div style={{ width: 40, height: 4, background: "#333", borderRadius: 2, margin: "0 auto 16px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: "#f0ebe3" }}>➕ New Drink</h3>
          <button type="button" onClick={onClose}
            style={{ background: "#333", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "#f0ebe3", fontSize: 16 }}>✕</button>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Drink Name *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Mango Mojito" style={inputStyle} />
        </div>

        {/* Category + Alcoholic */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              style={{ ...inputStyle, padding: "10px 12px" }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Type</label>
            <select value={alcoholic} onChange={e => setAlcoholic(e.target.value === "true")}
              style={{ ...inputStyle, padding: "10px 12px" }}>
              <option value="true">🍸 Alcoholic</option>
              <option value="false">🌿 Non-alcoholic</option>
            </select>
          </div>
        </div>

        {/* Origin + Prep time */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Origin Country</label>
            <input value={origin} onChange={e => setOrigin(e.target.value)} placeholder="e.g. Cuba" style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Prep Time</label>
            <input value={prepTime} onChange={e => setPrepTime(e.target.value)} placeholder="e.g. 5 mins" style={inputStyle} />
          </div>
        </div>

        {/* Glassware + Garnish */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Glassware</label>
            <input value={glassware} onChange={e => setGlassware(e.target.value)} placeholder="e.g. Highball glass" style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Garnish</label>
            <input value={garnish} onChange={e => setGarnish(e.target.value)} placeholder="e.g. Lime wedge" style={inputStyle} />
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Description</label>
          <input value={description} onChange={e => setDesc(e.target.value)} placeholder="One sentence about this drink" style={inputStyle} />
        </div>

        {/* Ingredients */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Ingredients</label>
          {ingredients.map((ing, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input value={ing} onChange={e => updateIngredient(i, e.target.value)}
                placeholder={`e.g. 60ml white rum`}
                style={{ ...inputStyle, flex: 1 }} />
              {ingredients.length > 1 && (
                <button type="button" onClick={() => setIngredients(ingredients.filter((_, j) => j !== i))}
                  style={{ background: "rgba(229,62,62,0.15)", border: "none", borderRadius: 8, padding: "0 10px", color: "#fc8181", cursor: "pointer" }}>✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setIngredients([...ingredients, ""])}
            style={{ fontSize: 13, color: "#2d6a4f", background: "none", border: "1px dashed rgba(45,106,79,0.4)", borderRadius: 8, padding: "8px 14px", cursor: "pointer", width: "100%" }}>
            + Add ingredient
          </button>
        </div>

        {/* Steps */}
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Steps</label>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 12, color: "#718096", minWidth: 20, paddingTop: 12 }}>{i + 1}.</span>
              <input value={step} onChange={e => updateStep(i, e.target.value)}
                placeholder={`Step ${i + 1}`}
                style={{ ...inputStyle, flex: 1 }} />
              {steps.length > 1 && (
                <button type="button" onClick={() => setSteps(steps.filter((_, j) => j !== i))}
                  style={{ background: "rgba(229,62,62,0.15)", border: "none", borderRadius: 8, padding: "0 10px", color: "#fc8181", cursor: "pointer", marginTop: 2 }}>✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setSteps([...steps, ""])}
            style={{ fontSize: 13, color: "#2d6a4f", background: "none", border: "1px dashed rgba(45,106,79,0.4)", borderRadius: 8, padding: "8px 14px", cursor: "pointer", width: "100%" }}>
            + Add step
          </button>
        </div>

        <button type="button" onClick={handleSave} disabled={!title.trim()}
          style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: title.trim() ? "#2d6a4f" : "#333", color: "#fff", fontWeight: 700, fontSize: 16, cursor: title.trim() ? "pointer" : "not-allowed", boxShadow: title.trim() ? "0 4px 12px rgba(45,106,79,0.3)" : "none" }}>
          🍹 Save Drink
        </button>
      </div>
    </div>
  );
}
