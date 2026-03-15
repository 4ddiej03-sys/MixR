// components/Shelf.jsx — manage bar shelf items
import { useState } from "react";
import ShelfScanner from "./ShelfScanner";

const CATEGORIES = ["All", "Spirits", "Mixers", "Juices", "Syrups", "Garnishes", "Beer/Wine", "Other"];

export default function Shelf({ shelf, setShelf }) {
  const [newItem, setNewItem]         = useState("");
  const [category, setCategory]       = useState("Spirits");
  const [filterCat, setFilterCat]     = useState("All");
  const [showScanner, setShowScanner] = useState(false);

  function addItem() {
    const name = newItem.trim().toLowerCase();
    if (!name) return;
    if (shelf.some(i => (typeof i === "object" ? i.name : i).toLowerCase() === name)) return;
    setShelf([...shelf, { name, category }]);
    setNewItem("");
  }

  function removeItem(nameToRemove) {
    setShelf(shelf.filter(i => (typeof i === "object" ? i.name : i) !== nameToRemove));
  }

  const filtered = filterCat === "All" ? shelf
    : shelf.filter(i => (typeof i === "object" ? i.category : "Other") === filterCat);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, color: "#f0ebe3" }}>🍶 My Shelf</h2>
        <button type="button" onClick={() => setShowScanner(true)}
          style={{ padding: "8px 14px", borderRadius: 10, border: "none", background: "#2d6a4f", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          📸 Scan Shelf
        </button>
      </div>

      {/* Add item */}
      <div style={{ background: "#1a1a1a", borderRadius: 14, padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input value={newItem} onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addItem()}
            placeholder="Add bottle or mixer…"
            style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #333", background: "#111", color: "#f0ebe3", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
          <button type="button" onClick={addItem}
            style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: "#2d6a4f", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            +
          </button>
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)}
          style={{ width: "100%", padding: "8px 12px", borderRadius: 10, border: "1px solid #333", background: "#111", color: "#f0ebe3", fontSize: 13, outline: "none" }}>
          {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16, paddingBottom: 4 }}>
        {CATEGORIES.map(c => (
          <button key={c} type="button" onClick={() => setFilterCat(c)}
            style={{ padding: "6px 12px", borderRadius: 50, border: `1px solid ${filterCat === c ? "#2d6a4f" : "#333"}`, background: filterCat === c ? "rgba(45,106,79,0.2)" : "transparent", color: filterCat === c ? "#2d6a4f" : "#718096", fontSize: 12, fontWeight: filterCat === c ? 700 : 400, whiteSpace: "nowrap", cursor: "pointer" }}>
            {c}
          </button>
        ))}
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#718096" }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>🍶</p>
          <p>Your shelf is empty — add some bottles!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {filtered.map((item, i) => {
            const name = typeof item === "object" ? item.name : item;
            const cat  = typeof item === "object" ? item.category : "Other";
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "#1a1a1a", border: "1px solid #333", borderRadius: 50, padding: "6px 12px" }}>
                <span style={{ fontSize: 13, color: "#f0ebe3", textTransform: "capitalize" }}>{name}</span>
                <span style={{ fontSize: 10, color: "#718096" }}>{cat}</span>
                <button type="button" onClick={() => removeItem(name)}
                  style={{ background: "none", border: "none", color: "#718096", cursor: "pointer", fontSize: 12, padding: "0 2px", lineHeight: 1 }}>✕</button>
              </div>
            );
          })}
        </div>
      )}

      {showScanner && (
        <ShelfScanner
          onAddItems={items => setShelf([...shelf, ...items.filter(i => !shelf.some(s => (typeof s === "object" ? s.name : s) === i.name))])}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
