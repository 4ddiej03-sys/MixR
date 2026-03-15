// components/SettingsScreen.jsx
export default function SettingsScreen({ user, settings, onUpdateSettings, onSignOut, isPro, isFounder, onUpgrade }) {
  function toggle(key) {
    const next = { ...settings, [key]: !settings[key] };
    onUpdateSettings(next);
  }

  const Row = ({ label, desc, k }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #222" }}>
      <div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#f0ebe3" }}>{label}</p>
        {desc && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#718096" }}>{desc}</p>}
      </div>
      <button type="button" onClick={() => toggle(k)}
        style={{ width: 48, height: 28, borderRadius: 14, border: "none", background: settings[k] ? "#2d6a4f" : "#333", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 3, left: settings[k] ? 23 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
      </button>
    </div>
  );

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", fontSize: 18, color: "#f0ebe3" }}>⚙️ Settings</h2>

      {/* Account */}
      <div style={{ background: "#1a1a1a", borderRadius: 14, padding: "4px 16px", marginBottom: 16 }}>
        <div style={{ padding: "14px 0", borderBottom: "1px solid #222" }}>
          <p style={{ margin: 0, fontSize: 12, color: "#718096", textTransform: "uppercase", letterSpacing: 1 }}>Account</p>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#f0ebe3" }}>{user?.email}</p>
        </div>
        <div style={{ padding: "14px 0" }}>
          {isFounder && <span style={{ fontSize: 12, background: "#0d2818", color: "#2d6a4f", padding: "3px 8px", borderRadius: 50, fontWeight: 700, marginRight: 8 }}>👑 Founder</span>}
          {isPro && !isFounder && <span style={{ fontSize: 12, background: "#2d6a4f", color: "#fff", padding: "3px 8px", borderRadius: 50, fontWeight: 700, marginRight: 8 }}>⭐ Pro</span>}
          {!isPro && !isFounder && (
            <button type="button" onClick={onUpgrade}
              style={{ fontSize: 12, background: "rgba(45,106,79,0.2)", border: "1px solid rgba(45,106,79,0.4)", color: "#2d6a4f", padding: "4px 12px", borderRadius: 50, cursor: "pointer", fontWeight: 600 }}>
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>

      {/* Preferences */}
      <div style={{ background: "#1a1a1a", borderRadius: 14, padding: "4px 16px", marginBottom: 16 }}>
        <Row label="Large Text" desc="Increases font size" k="largeText" />
        <Row label="High Contrast" desc="Improves readability" k="highContrast" />
        <Row label="Dark Mode" desc="Already dark, goes darker" k="darkMode" />
      </div>

      {/* Sign out */}
      <button type="button" onClick={onSignOut}
        style={{ width: "100%", padding: 14, borderRadius: 12, border: "1px solid rgba(229,62,62,0.3)", background: "rgba(229,62,62,0.1)", color: "#fc8181", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
        Sign Out
      </button>

      <p style={{ textAlign: "center", fontSize: 12, color: "#333", marginTop: 24 }}>Mix-R v1.0 · Shake What You've Got</p>
    </div>
  );
}
