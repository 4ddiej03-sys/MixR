// components/ShelfScanner.jsx — scan bar shelf with camera
import { useState, useRef } from "react";
import { scanShelfFromPhoto } from "../utils/scanShelf";

export default function ShelfScanner({ onAddItems, onClose }) {
  const [scanning, setScanning]   = useState(false);
  const [results, setResults]     = useState(null);
  const [selected, setSelected]   = useState([]);
  const [error, setError]         = useState("");
  const fileRef                   = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true); setError(""); setResults(null);
    try {
      const data = await scanShelfFromPhoto(file);
      setResults(data);
      setSelected(data.items);
    } catch (err) {
      setError(err.message || "Scan failed — try again.");
    }
    setScanning(false);
  }

  function toggle(item) {
    setSelected(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  }

  function handleAdd() {
    onAddItems(selected.map(name => ({ name, category: "Bar" })));
    onClose();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 600, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "#1a1a1a", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto", padding: 20 }}>
        <div style={{ width: 40, height: 4, background: "#333", borderRadius: 2, margin: "0 auto 16px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 17, color: "#f0ebe3" }}>📸 Scan Your Shelf</h3>
          <button type="button" onClick={onClose}
            style={{ background: "#333", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "#f0ebe3", fontSize: 16 }}>✕</button>
        </div>

        {!results && !scanning && (
          <>
            <p style={{ fontSize: 14, color: "#718096", marginBottom: 16, lineHeight: 1.6 }}>
              Take a photo of your bar shelf or drinks cabinet. AI will identify all your bottles and mixers.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => { fileRef.current.capture = "environment"; fileRef.current.click(); }}
                style={{ flex: 1, padding: 14, borderRadius: 12, border: "none", background: "#2d6a4f", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                📷 Take Photo
              </button>
              <button type="button" onClick={() => { fileRef.current.removeAttribute("capture"); fileRef.current.click(); }}
                style={{ flex: 1, padding: 14, borderRadius: 12, border: "1px solid rgba(45,106,79,0.4)", background: "transparent", color: "#2d6a4f", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                🖼 Upload
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          </>
        )}

        {scanning && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ width: 40, height: 40, border: "3px solid #333", borderTopColor: "#2d6a4f", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ color: "#718096", fontSize: 14 }}>🍶 Identifying bottles and mixers…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {error && (
          <div style={{ background: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.3)", borderRadius: 10, padding: 12, marginBottom: 16 }}>
            <p style={{ color: "#fc8181", fontSize: 13, margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        {results && (
          <>
            <p style={{ fontSize: 14, color: "#718096", marginBottom: 12 }}>
              Found {results.items.length} items — tap to deselect any you don't want to add:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {results.items.map((item, i) => (
                <button key={i} type="button" onClick={() => toggle(item)}
                  style={{ padding: "8px 14px", borderRadius: 50, border: `1px solid ${selected.includes(item) ? "#2d6a4f" : "#333"}`, background: selected.includes(item) ? "rgba(45,106,79,0.2)" : "transparent", color: selected.includes(item) ? "#2d6a4f" : "#718096", fontSize: 13, cursor: "pointer", fontWeight: selected.includes(item) ? 600 : 400 }}>
                  {selected.includes(item) ? "✓ " : ""}{item}
                </button>
              ))}
            </div>
            <button type="button" onClick={handleAdd} disabled={!selected.length}
              style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: selected.length ? "#2d6a4f" : "#333", color: "#fff", fontWeight: 700, fontSize: 15, cursor: selected.length ? "pointer" : "not-allowed" }}>
              + Add {selected.length} items to shelf
            </button>
          </>
        )}
      </div>
    </div>
  );
}
