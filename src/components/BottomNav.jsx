// components/BottomNav.jsx
export default function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: "drinks",    icon: "🍹", label: "Drinks" },
    { id: "shelf",     icon: "🍶", label: "Shelf" },
    { id: "favorites", icon: "❤️",  label: "Saved" },
    { id: "shopping",  icon: "🛒",  label: "Shop" },
    { id: "settings",  icon: "⚙️",  label: "More" },
  ];
  return (
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0d0d0d", borderTop: "1px solid rgba(45,106,79,0.3)", display: "flex", zIndex: 300, paddingBottom: "env(safe-area-inset-bottom)" }}>
      {tabs.map(t => (
        <button key={t.id} type="button" onClick={() => setTab(t.id)}
          style={{ flex: 1, padding: "10px 0", border: "none", background: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer" }}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          <span style={{ fontSize: 10, fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? "#2d6a4f" : "#718096" }}>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
