// components/MakingMode.jsx — step by step drink making mode
import { useState } from "react";

export default function MakingMode({ drink, onExit }) {
  const [step, setStep] = useState(0);
  const [checked, setChecked] = useState([]);

  if (!drink) return null;

  const steps    = drink.steps || [];
  const isLast   = step === steps.length - 1;
  const progress = Math.round(((step + 1) / steps.length) * 100);

  function toggleCheck(ing) {
    setChecked(prev => prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0d0d0d", zIndex: 500, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(45,106,79,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, color: "#f0ebe3" }}>🍹 {drink.title}</h2>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#718096" }}>{drink.origin} · {drink.category}</p>
        </div>
        <button type="button" onClick={onExit}
          style={{ background: "rgba(229,62,62,0.15)", border: "1px solid rgba(229,62,62,0.3)", color: "#fc8181", padding: "8px 16px", borderRadius: 10, fontWeight: 600, fontSize: 13 }}>
          Done
        </button>
      </div>

      {/* Progress */}
      <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(45,106,79,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: "#718096" }}>Step {step + 1} of {steps.length}</span>
          <span style={{ fontSize: 12, color: "#2d6a4f", fontWeight: 600 }}>{progress}%</span>
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "#2d6a4f", borderRadius: 2, transition: "width 0.3s" }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        {/* Ingredients checklist — only on step 0 */}
        {step === 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, color: "#718096", fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Gather your ingredients</h3>
            {(drink.ingredients || []).map((ing, i) => (
              <button key={i} type="button" onClick={() => toggleCheck(ing)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${checked.includes(ing) ? "#2d6a4f" : "rgba(255,255,255,0.1)"}`, background: checked.includes(ing) ? "rgba(45,106,79,0.2)" : "transparent", marginBottom: 6, textAlign: "left", color: checked.includes(ing) ? "#2d6a4f" : "#f0ebe3", fontSize: 14, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16 }}>{checked.includes(ing) ? "✅" : "⬜"}</span>
                {ing}
              </button>
            ))}
            {drink.glassware && <p style={{ fontSize: 13, color: "#718096", marginTop: 8 }}>🥃 You'll need: {drink.glassware}</p>}
          </div>
        )}

        {/* Current step */}
        <div style={{ background: "rgba(45,106,79,0.1)", border: "1px solid rgba(45,106,79,0.3)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 40, textAlign: "center", marginBottom: 16 }}>
            {step === 0 ? "🧊" : step === steps.length - 1 ? "🍹" : "🔄"}
          </div>
          <p style={{ fontSize: 17, color: "#f0ebe3", lineHeight: 1.7, textAlign: "center", margin: 0 }}>
            {steps[step]}
          </p>
        </div>

        {/* Garnish reminder on last step */}
        {isLast && drink.garnish && (
          <div style={{ background: "rgba(106,106,45,0.15)", border: "1px solid rgba(106,106,45,0.3)", borderRadius: 10, padding: 12, marginBottom: 16, textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#d4d48a", margin: 0 }}>🍋 Don't forget the garnish: <strong>{drink.garnish}</strong></p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(45,106,79,0.2)", display: "flex", gap: 10 }}>
        {step > 0 && (
          <button type="button" onClick={() => setStep(s => s - 1)}
            style={{ flex: 1, padding: 14, borderRadius: 12, border: "1px solid rgba(45,106,79,0.3)", background: "transparent", color: "#2d6a4f", fontWeight: 700, fontSize: 15 }}>
            ← Back
          </button>
        )}
        <button type="button" onClick={() => isLast ? onExit() : setStep(s => s + 1)}
          style={{ flex: 2, padding: 14, borderRadius: 12, border: "none", background: isLast ? "#2d6a4f" : "#2d6a4f", color: "#fff", fontWeight: 700, fontSize: 15, boxShadow: "0 4px 12px rgba(45,106,79,0.3)" }}>
          {isLast ? "🍹 Cheers! Done" : "Next Step →"}
        </button>
      </div>
    </div>
  );
}
