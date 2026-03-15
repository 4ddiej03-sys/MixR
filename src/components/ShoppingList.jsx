// components/ShoppingList.jsx
import { useState } from "react";

export default function ShoppingList({ items, setItems }) {
  const [newItem, setNewItem] = useState("");
  const [checked, setChecked] = useState([]);

  function addItem() {
    const name = newItem.trim();
    if (!name || items.includes(name)) return;
    setItems([...items, name]);
    setNewItem("");
  }

  function toggleCheck(item) {
    setChecked(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  }

  function removeChecked() {
    setItems(items.filter(i => !checked.includes(i)));
    setChecked([]);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, color: "#f0ebe3" }}>🛒 Shopping List</h2>
        {checked.length > 0 && (
          <button type="button" onClick={removeChecked}
            style={{ fontSize: 13, background: "rgba(229,62,62,0.15)", border: "1px solid rgba(229,62,62,0.3)", color: "#fc8181", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
            Remove {checked.length} ✓
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={newItem} onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addItem()}
          placeholder="Add item…"
          style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #333", background: "#111", color: "#f0ebe3", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
        <button type="button" onClick={addItem}
          style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer" }}>+</button>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#718096" }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>🛒</p>
          <p>Your shopping list is empty!</p>
        </div>
      ) : (
        <div>
          {items.map((item, i) => (
            <div key={i} onClick={() => toggleCheck(item)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, background: "#1a1a1a", marginBottom: 8, cursor: "pointer", border: `1px solid ${checked.includes(item) ? "rgba(45,106,79,0.4)" : "#333"}`, opacity: checked.includes(item) ? 0.5 : 1 }}>
              <span style={{ fontSize: 18 }}>{checked.includes(item) ? "✅" : "⬜"}</span>
              <span style={{ flex: 1, fontSize: 14, color: "#f0ebe3", textDecoration: checked.includes(item) ? "line-through" : "none", textTransform: "capitalize" }}>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
