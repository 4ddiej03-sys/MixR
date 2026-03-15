// components/AccessGate.jsx
// Shows when a Che AF user tries to access Mix-R without a subscription

export default function AccessGate({ user, onGetAccess, onSignOut }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>

        {/* Icon */}
        <div style={{ fontSize: 80, marginBottom: 16 }}>🍹</div>
        <h1 style={{ margin: "0 0 8px", fontSize: 32, fontWeight: 900, color: "#f0ebe3" }}>Mix-R</h1>
        <p style={{ margin: "0 0 32px", fontSize: 15, color: "#718096", lineHeight: 1.6 }}>
          Shake What You've Got
        </p>

        {/* Message */}
        <div style={{ background: "#1a1a1a", border: "1px solid rgba(45,106,79,0.3)", borderRadius: 16, padding: 24, marginBottom: 24, textAlign: "left" }}>
          <p style={{ margin: "0 0 12px", fontSize: 14, color: "#f0ebe3", lineHeight: 1.7 }}>
            👋 Hey <strong>{user?.email?.split("@")[0]}</strong>!
          </p>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "rgba(240,235,227,0.7)", lineHeight: 1.7 }}>
            You have a <strong style={{ color: "#c4622d" }}>Che AF</strong> account but Mix-R is a separate app.
            Get access to Mix-R to start making cocktails from what you have on your shelf!
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "🤖 AI cocktail generation from your shelf",
              "📸 Scan your bar shelf with your camera",
              "🌍 Global drinks — cocktails, mocktails, traditional",
              "🍹 Step-by-step making mode",
              "☁️ Syncs with your Che AF account",
            ].map((f, i) => (
              <div key={i} style={{ fontSize: 13, color: "rgba(240,235,227,0.6)", display: "flex", alignItems: "center", gap: 8 }}>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
          <div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 14, padding: 16, textAlign: "center" }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: "#718096", textTransform: "uppercase", letterSpacing: 1 }}>Mix-R Only</p>
            <p style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 900, color: "#f0ebe3" }}>$2.99</p>
            <p style={{ margin: 0, fontSize: 11, color: "#718096" }}>NZD/month</p>
          </div>
          <div style={{ background: "rgba(45,106,79,0.1)", border: "1px solid rgba(45,106,79,0.4)", borderRadius: 14, padding: 16, textAlign: "center", position: "relative" }}>
            <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#2d6a4f", padding: "2px 10px", borderRadius: 50, fontSize: 10, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
              BEST VALUE
            </div>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: "#2d6a4f", textTransform: "uppercase", letterSpacing: 1 }}>Bundle</p>
            <p style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 900, color: "#f0ebe3" }}>$4.99</p>
            <p style={{ margin: 0, fontSize: 11, color: "#2d6a4f" }}>Che AF + Mix-R</p>
          </div>
        </div>

        {/* CTA */}
        <button type="button" onClick={onGetAccess}
          style={{ width: "100%", padding: 16, borderRadius: 14, border: "none", background: "#2d6a4f", color: "#fff", fontWeight: 800, fontSize: 17, cursor: "pointer", boxShadow: "0 8px 24px rgba(45,106,79,0.4)", marginBottom: 12 }}>
          🍹 Get Mix-R Access
        </button>

        <button type="button" onClick={onSignOut}
          style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", background: "none", color: "#718096", fontSize: 14, cursor: "pointer" }}>
          Sign out
        </button>
      </div>
    </div>
  );
}
