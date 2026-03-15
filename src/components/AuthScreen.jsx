// components/AuthScreen.jsx
import { useState } from "react";
import { signIn, signUp } from "../utils/supabase";

const FEATURES = [
  { icon: "🤖", text: "AI cocktail generation from your shelf" },
  { icon: "📸", text: "Scan your bar shelf with your camera" },
  { icon: "🌍", text: "Global drinks — cocktails, mocktails, traditional" },
  { icon: "🍹", text: "Step-by-step making mode" },
  { icon: "☁️", text: "Cloud sync across all devices" },
  { icon: "🌿", text: "Non-alcoholic options included" },
];

const PRICING = [
  {
    label: "Free",
    price: "$0",
    sub: "Forever",
    detail: "10 AI calls/month",
    color: "#333",
    textColor: "#718096",
    highlight: false,
  },
  {
    label: "Mix-R Pro",
    price: "$2.99",
    sub: "NZD/month",
    detail: "Unlimited AI · Full access",
    color: "rgba(45,106,79,0.3)",
    textColor: "#2563eb",
    highlight: false,
  },
  {
    label: "Bundle",
    price: "$4.99",
    sub: "NZD/month",
    detail: "Che AF + Mix-R · Best value",
    color: "rgba(45,106,79,0.15)",
    textColor: "#2563eb",
    highlight: true,
    badge: "BEST VALUE",
  },
];

export default function AuthScreen({ onAuth }) {
  const [mode, setMode]         = useState("signin");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  async function handleSubmit() {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError(""); setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(email, password);
        setSuccess("✅ Account created! Please check your email to confirm, then sign in.");
        setMode("signin");
      } else {
        await signIn(email, password);
        onAuth();
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px", overflowY: "auto" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img src="/icon-192.png" alt="Mix-R" style={{ width: 80, height: 80, borderRadius: 16, marginBottom: 8 }} />
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: "#f0ebe3" }}>Mix-R</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#718096" }}>Shake What You've Got</p>
        </div>

        {/* Login card */}
        <div style={{ background: "#1a1a1a", borderRadius: 20, padding: 28, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", marginBottom: 24 }}>
          <div style={{ display: "flex", background: "#111", borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {["signin", "signup"].map(m => (
              <button key={m} type="button" onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: mode === m ? "#2563eb" : "transparent", fontWeight: mode === m ? 700 : 500, fontSize: 14, cursor: "pointer", color: mode === m ? "#fff" : "#718096", transition: "all 0.2s" }}>
                {m === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, color: "#718096", fontWeight: 600, display: "block", marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #333", fontSize: 14, boxSizing: "border-box", outline: "none", fontFamily: "inherit", background: "#111", color: "#fff" }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: "#718096", fontWeight: 600, display: "block", marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
              onKeyDown={e => e.key === "Enter" && !loading && handleSubmit()}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #333", fontSize: 14, boxSizing: "border-box", outline: "none", fontFamily: "inherit", background: "#111", color: "#fff" }} />
          </div>

          {error   && <div style={{ background: "#2d0000", border: "1px solid #c53030", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}><p style={{ color: "#fc8181", fontSize: 13, margin: 0 }}>⚠️ {error}</p></div>}
          {success && <div style={{ background: "#002d0f", border: "1px solid #276749", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}><p style={{ color: "#9ae6b4", fontSize: 13, margin: 0 }}>{success}</p></div>}

          {mode === "signup" && (
            <p style={{ fontSize: 11, color: "#718096", textAlign: "center", marginBottom: 12 }}>
              By signing up you agree to our <span style={{ color: "#2563eb", cursor: "pointer" }}>Terms of Service</span> and <span style={{ color: "#2563eb", cursor: "pointer" }}>Privacy Policy</span>
            </p>
          )}

          <button type="button" onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: loading ? "#1a3a6b" : "#2563eb", color: "#fff", fontWeight: 700, fontSize: 16, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Please wait…" : mode === "signin" ? "Sign In →" : "Create Account →"}
          </button>
        </div>

        {/* Features */}
        <div style={{ background: "#1a1a1a", borderRadius: 20, padding: 24, marginBottom: 16 }}>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: "#718096", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
            What's included
          </p>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 20, minWidth: 28 }}>{f.icon}</span>
              <span style={{ fontSize: 14, color: "rgba(240,235,227,0.7)", lineHeight: 1.5 }}>{f.text}</span>
            </div>
          ))}
        </div>

        {/* Pricing — 3 options */}
        <div style={{ background: "#1a1a1a", borderRadius: 20, padding: 24, marginBottom: 32 }}>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: "#718096", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
            Pricing
          </p>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(240,235,227,0.5)", lineHeight: 1.6 }}>
            Already have <strong style={{ color: "#c4622d" }}>Che AF</strong>? Get Mix-R separately — no need to pay for both in a bundle unless you want to save.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PRICING.map((p, i) => (
              <div key={i} style={{ background: p.color, border: `1px solid ${p.textColor}`, borderRadius: 12, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
                {p.badge && (
                  <div style={{ position: "absolute", top: -10, right: 12, background: "#2563eb", padding: "2px 10px", borderRadius: 50, fontSize: 10, fontWeight: 700, color: "#fff" }}>
                    {p.badge}
                  </div>
                )}
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f0ebe3" }}>{p.label}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(240,235,227,0.5)" }}>{p.detail}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: p.textColor }}>{p.price}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "rgba(240,235,227,0.4)" }}>{p.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ margin: "12px 0 0", fontSize: 11, color: "#4a5568", textAlign: "center" }}>
            Upgrade available inside the app after signing up
          </p>
        </div>

      </div>
    </div>
  );
}
