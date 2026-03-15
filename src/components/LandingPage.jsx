// components/LandingPage.jsx
import { useState, useEffect } from "react";

const EXPIRY_DATE = new Date("2026-04-13T23:59:59");

const FEATURES = [
  { icon: "📸", title: "Scan Your Shelf", desc: "Point your camera at your bar cabinet. AI identifies every bottle, mixer and garnish instantly." },
  { icon: "🤖", title: "AI Drink Generation", desc: "Tell us what you have. We'll create cocktails, mocktails and traditional drinks perfectly matched to your shelf." },
  { icon: "🌍", title: "Global Drinks Library", desc: "From Cuban mojitos to Japanese sake cocktails, Filipino lambanog to Māori kawakawa — every culture covered." },
  { icon: "🍹", title: "Step-by-Step Making Mode", desc: "Follow each step on screen. Ingredient checklist, timing cues, and garnish reminders included." },
  { icon: "🔗", title: "Import Any Recipe", desc: "Found a recipe on Difford's Guide or Liquor.com? Paste the URL and it's saved instantly." },
  { icon: "☁️", title: "Cloud Sync", desc: "Your drinks, shelf and shopping list sync across every device. Always with you at the bar." },
];

const STEPS = [
  { num: "01", title: "Add your shelf", desc: "Scan your bar cabinet or type what bottles you have in seconds." },
  { num: "02", title: "Pick your vibe", desc: "Cocktail, mocktail, traditional, shot — you choose the style." },
  { num: "03", title: "Shake what you've got", desc: "AI generates the perfect drink from exactly what's on your shelf." },
];

function useCountdown(target) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    function calc() {
      const diff = target - Date.now();
      if (diff <= 0) return;
      setTime({
        days:  Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins:  Math.floor((diff % 3600000) / 60000),
        secs:  Math.floor((diff % 60000) / 1000),
      });
    }
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [target]);
  return time;
}

export default function LandingPage({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible]   = useState(false);
  const countdown = useCountdown(EXPIRY_DATE);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ background: "#080808", color: "#f0ebe3", minHeight: "100vh", fontFamily: "'Georgia', serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .hero-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(52px, 12vw, 120px);
          font-weight: 700; line-height: 0.92; letter-spacing: -2px; color: #f0ebe3;
        }
        .hero-title em { font-style: italic; color: #2563eb; }
        .body-font { font-family: 'DM Sans', system-ui, sans-serif; font-weight: 300; }
        .pioneer-bar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          background: linear-gradient(90deg, #2563eb, #3b72d4, #2563eb);
          background-size: 200% 100%; animation: shimmer 3s linear infinite;
          padding: 10px 0; text-align: center;
        }
        @keyframes shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        .nav-fixed {
          position: fixed; top: 41px; left: 0; right: 0; z-index: 100;
          padding: 16px 24px; display: flex; justify-content: space-between; align-items: center;
          background: rgba(8,8,8,0.95); backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(45,106,79,0.15); transition: border-color 0.3s;
        }
        .nav-scrolled { border-bottom-color: rgba(45,106,79,0.4); }
        .cta-btn {
          background: #2563eb; color: #fff; border: none; padding: 14px 32px;
          font-family: 'DM Sans', system-ui, sans-serif; font-weight: 500; font-size: 15px;
          cursor: pointer; letter-spacing: 0.5px; transition: all 0.2s;
          clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
        }
        .cta-btn:hover { background: #3b72d4; transform: translateY(-1px); }
        .cta-btn-lg { padding: 18px 48px; font-size: 17px; clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%); }
        .cta-btn-outline { background: transparent; border: 1px solid rgba(45,106,79,0.5); color: #2563eb; }
        .cta-btn-outline:hover { background: rgba(45,106,79,0.1); border-color: #2563eb; }
        .feature-card {
          border: 1px solid rgba(240,235,227,0.06); padding: 28px;
          transition: all 0.3s; position: relative; overflow: hidden; background: rgba(255,255,255,0.02);
        }
        .feature-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #2563eb, transparent); opacity: 0; transition: opacity 0.3s;
        }
        .feature-card:hover::before { opacity: 1; }
        .feature-card:hover { border-color: rgba(45,106,79,0.3); background: rgba(45,106,79,0.04); transform: translateY(-2px); }
        .badge-pill {
          display: inline-block; border: 1px solid rgba(45,106,79,0.4); color: #2563eb;
          padding: 6px 16px; font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 12px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px;
        }
        .divider-line { width: 60px; height: 1px; background: #2563eb; margin: 24px 0; }
        .step-num {
          font-family: 'Cormorant Garamond', serif; font-size: 72px; font-weight: 700;
          color: rgba(45,106,79,0.15); line-height: 1; position: absolute; top: -10px; left: 0;
        }
        .hero-fade-in { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .hero-fade-in.visible { opacity: 1; transform: translateY(0); }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.25s; }
        .delay-3 { transition-delay: 0.4s; }
        .delay-4 { transition-delay: 0.55s; }
        .big-quote {
          font-family: 'Cormorant Garamond', serif; font-size: clamp(24px, 5vw, 48px);
          font-weight: 400; font-style: italic; line-height: 1.3; color: rgba(240,235,227,0.7);
        }
        .big-quote strong { color: #f0ebe3; font-style: normal; font-weight: 700; }
        .countdown-box {
          display: inline-flex; background: rgba(45,106,79,0.08);
          border: 1px solid rgba(45,106,79,0.3); padding: 16px 24px;
          margin-bottom: 32px; gap: 24px; flex-wrap: wrap; justify-content: center;
        }
        .countdown-unit { text-align: center; min-width: 48px; }
        .countdown-num {
          font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 700;
          color: #2563eb; display: block; line-height: 1;
        }
        .countdown-label {
          font-family: 'DM Sans', system-ui, sans-serif; font-size: 10px;
          text-transform: uppercase; letter-spacing: 2px; color: rgba(240,235,227,0.4);
          display: block; margin-top: 4px;
        }
        .legal-link {
          color: rgba(240,235,227,0.35); font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 12px; cursor: pointer; text-decoration: underline; background: none; border: none;
          transition: color 0.2s;
        }
        .legal-link:hover { color: #2563eb; }
        .shelf-circle { display: flex; }
        @media (max-width: 600px) {
          .feature-grid { grid-template-columns: 1fr !important; }
          .hero-section { padding: 160px 24px 80px !important; }
          .shelf-circle { display: none !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Announcement bar */}
      <div className="pioneer-bar">
        <p className="body-font" style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>
          🌟 First 200 users get <strong>Pro FREE forever</strong> + Pioneer badge — <strong>limited spots left</strong>
        </p>
      </div>

      {/* Nav */}
      <nav className={`nav-fixed ${scrolled ? "nav-scrolled" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/icon-192.png" alt="Mix-R" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 20, color: "#f0ebe3" }}>

          </span>
        </div>
        <button className="cta-btn" onClick={onGetStarted} style={{ padding: "10px 24px", fontSize: 13 }}>
          Get Started Free
        </button>
      </nav>

      {/* Hero */}
      <section className="hero-section" style={{ padding: "180px 24px 100px", maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className={`hero-fade-in ${visible ? "visible" : ""}`}>
          <div className="badge-pill">Shake What You've Got</div>
        </div>
        <h1 className={`hero-title hero-fade-in delay-1 ${visible ? "visible" : ""}`}>
          Your bar.<br /><em>Your rules.</em><br />Your way.
        </h1>
        <div className="divider-line" style={{ margin: "32px 0" }} />

        {/* Countdown */}
        <div className={`hero-fade-in delay-2 ${visible ? "visible" : ""}`}>
          <p className="body-font" style={{ fontSize: 13, color: "#2563eb", fontWeight: 500, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>
            🌟 Pioneer offer expires in
          </p>
          <div className="countdown-box">
            {[
              { val: countdown.days,  label: "Days" },
              { val: countdown.hours, label: "Hours" },
              { val: countdown.mins,  label: "Mins" },
              { val: countdown.secs,  label: "Secs" },
            ].map((u, i) => (
              <div key={i} className="countdown-unit">
                <span className="countdown-num">{String(u.val).padStart(2, "0")}</span>
                <span className="countdown-label">{u.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className={`body-font hero-fade-in delay-2 ${visible ? "visible" : ""}`}
          style={{ fontSize: 18, color: "rgba(240,235,227,0.65)", lineHeight: 1.7, maxWidth: 520, marginBottom: 40 }}>
          Scan your bar shelf. AI generates cocktails from exactly what you have.
          No wasted bottles. No missing mixers. No excuses.
        </p>
        <div className={`hero-fade-in delay-3 ${visible ? "visible" : ""}`}
          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="cta-btn cta-btn-lg" onClick={onGetStarted}>🍹 Start Mixing Free</button>
          <button className="cta-btn cta-btn-outline cta-btn-lg" onClick={onGetStarted}>See how it works</button>
        </div>
        <p className={`body-font hero-fade-in delay-4 ${visible ? "visible" : ""}`}
          style={{ marginTop: 20, fontSize: 13, color: "rgba(240,235,227,0.35)" }}>
          No credit card · Free forever for first 200 users · Works on any device
        </p>

        {/* Shelf circle — hidden on mobile */}
        <div className="shelf-circle" style={{
          position: "absolute", top: 180, right: 0, width: 140, height: 140,
          borderRadius: "50%", border: "1px solid rgba(45,106,79,0.3)",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", background: "rgba(45,106,79,0.06)", backdropFilter: "blur(8px)",
        }}>
          <span style={{ fontSize: 28 }}>🌟</span>
          <span className="body-font" style={{ fontSize: 11, color: "#2563eb", fontWeight: 500, marginTop: 4, lineHeight: 1.3 }}>
            Pioneer<br />Member<br />Perks
          </span>
        </div>
      </section>

      {/* Big quote */}
      <section style={{ padding: "60px 24px", borderTop: "1px solid rgba(240,235,227,0.06)", borderBottom: "1px solid rgba(240,235,227,0.06)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p className="big-quote">"Stop buying drinks you'll never finish.<br />Start making <strong>exactly what you want.</strong>"</p>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "100px 24px", maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: 60 }}>
          <div className="badge-pill">Everything you need</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 700, lineHeight: 1.1, color: "#f0ebe3" }}>
            Built for real bars.<br /><em style={{ color: "#2563eb", fontStyle: "italic" }}>Not cocktail blogs.</em>
          </h2>
        </div>
        <div className="feature-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "rgba(240,235,227,0.06)" }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card">
              <span style={{ fontSize: 32, display: "block", marginBottom: 16 }}>{f.icon}</span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, marginBottom: 10, color: "#f0ebe3" }}>{f.title}</h3>
              <p className="body-font" style={{ fontSize: 14, color: "rgba(240,235,227,0.55)", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "80px 24px", background: "rgba(45,106,79,0.04)", borderTop: "1px solid rgba(45,106,79,0.1)", borderBottom: "1px solid rgba(45,106,79,0.1)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ marginBottom: 60, textAlign: "center" }}>
            <div className="badge-pill">Simple as that</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, color: "#f0ebe3" }}>
              From shelf to glass<br />in 3 steps
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 40, alignItems: "flex-start", position: "relative", paddingLeft: 20 }}>
                <div style={{ position: "relative", minWidth: 80 }}>
                  <span className="step-num">{s.num}</span>
                </div>
                <div style={{ paddingTop: 8 }}>
                  <div className="divider-line" style={{ margin: "0 0 16px" }} />
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, marginBottom: 8, color: "#f0ebe3" }}>{s.title}</h3>
                  <p className="body-font" style={{ fontSize: 16, color: "rgba(240,235,227,0.55)", lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global drinks callout */}
      <section style={{ padding: "80px 24px", maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ border: "1px solid rgba(45,106,79,0.3)", padding: "48px", background: "rgba(45,106,79,0.04)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, fontSize: 120, opacity: 0.06 }}>🌍</div>
          <div className="badge-pill">Global drinks</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700, color: "#f0ebe3", marginBottom: 16, lineHeight: 1.2 }}>
            Every culture.<br /><em style={{ color: "#2563eb", fontStyle: "italic" }}>Every tradition.</em>
          </h2>
          <p className="body-font" style={{ fontSize: 16, color: "rgba(240,235,227,0.6)", lineHeight: 1.8, marginBottom: 24 }}>
            Mix-R goes beyond Western cocktails. Discover authentic traditional drinks from every corner of the world — Japanese sake cocktails, Filipino lambanog, Māori kawakawa, Malaysian teh tarik, and hundreds more.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {["🇯🇵 Japanese", "🇵🇭 Filipino", "🇳🇿 Māori", "🇲🇾 Malaysian", "🇲🇽 Mexican", "🇨🇺 Cuban", "🇧🇷 Brazilian", "🇰🇷 Korean"].map((t, i) => (
              <span key={i} className="body-font" style={{ fontSize: 13, color: "#2563eb", border: "1px solid rgba(45,106,79,0.3)", padding: "6px 14px" }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle callout */}
      <section style={{ padding: "80px 24px", background: "rgba(240,235,227,0.02)", borderTop: "1px solid rgba(240,235,227,0.06)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div className="badge-pill">Better together</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, color: "#f0ebe3", marginBottom: 16 }}>
            Pair with <em style={{ color: "#c4622d", fontStyle: "italic" }}>Che AF</em><br />and save.
          </h2>
          <p className="body-font" style={{ fontSize: 16, color: "rgba(240,235,227,0.5)", marginBottom: 40, lineHeight: 1.7 }}>
            Get both the AI recipe app and the AI drinks app together for just $4.99/month NZD. Food and drinks — covered.
          </p>

          {/* Pricing */}
          <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "rgba(240,235,227,0.06)", marginBottom: 32 }}>
            {[
              { label: "Free", price: "$0", sub: "Forever", features: ["10 AI calls/month", "6 default drinks", "Shelf tracking"], highlight: false },
              { label: "Mix-R Pro", price: "$2.99", sub: "NZD/month", features: ["Unlimited AI", "Shelf scan", "All features"], highlight: false },
              { label: "Bundle", price: "$4.99", sub: "NZD/month", features: ["Che AF + Mix-R", "Unlimited AI", "Best value 🏆"], highlight: true },
            ].map((p, i) => (
              <div key={i} style={{ padding: 24, background: p.highlight ? "rgba(45,106,79,0.08)" : "#080808", border: p.highlight ? "1px solid rgba(45,106,79,0.3)" : "none", textAlign: "left", position: "relative" }}>
                {p.highlight && <div style={{ position: "absolute", top: -1, right: 12, background: "#2563eb", padding: "3px 10px", fontSize: 10, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>BEST VALUE</div>}
                <p className="body-font" style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: p.highlight ? "#2563eb" : "rgba(240,235,227,0.4)", marginBottom: 8 }}>{p.label}</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 700, color: "#f0ebe3", marginBottom: 2 }}>{p.price}</p>
                <p className="body-font" style={{ fontSize: 11, color: "rgba(240,235,227,0.3)", marginBottom: 16 }}>{p.sub}</p>
                {p.features.map((f, j) => (
                  <div key={j} className="body-font" style={{ fontSize: 13, color: p.highlight ? "rgba(240,235,227,0.8)" : "rgba(240,235,227,0.5)", marginBottom: 6 }}>✓ {f}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 8vw, 80px)", fontWeight: 700, lineHeight: 0.95, color: "#f0ebe3", marginBottom: 32 }}>
            Shake what<br /><em style={{ color: "#2563eb", fontStyle: "italic" }}>you've got.</em>
          </h2>
          <p className="body-font" style={{ fontSize: 16, color: "rgba(240,235,227,0.5)", marginBottom: 40, lineHeight: 1.7 }}>
            Join the first 200 users and lock in Pro free forever.<br />
            No credit card. No commitment. Just great drinks.
          </p>
          <button className="cta-btn cta-btn-lg" onClick={onGetStarted} style={{ fontSize: 18, padding: "20px 56px" }}>
            🍹 Get Started — It's Free
          </button>
          <p className="body-font" style={{ marginTop: 20, fontSize: 12, color: "rgba(240,235,227,0.25)", letterSpacing: 1 }}>
            mix-r.vercel.app · Shake What You've Got
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(240,235,227,0.06)", padding: "40px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          <img src="/icon-192.png" alt="Mix-R" style={{ width: 28, height: 28, borderRadius: 6 }} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 18, color: "#f0ebe3" }}>

          </span>
        </div>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <button className="legal-link">Terms of Service</button>
          <button className="legal-link">Privacy Policy</button>
          <a href="mailto:support@mix-r.vercel.app" className="legal-link" style={{ textDecoration: "underline" }}>Contact</a>
          <a href="https://www.instagram.com/cheaf_cooklikeyouknow" target="_blank" rel="noopener noreferrer" className="legal-link" style={{ textDecoration: "underline", color: "#c4622d" }}>📸 Instagram</a>
          <a href="https://che-af.vercel.app" className="legal-link" style={{ textDecoration: "underline", color: "#c4622d" }}>🍳 Che AF</a>
        </div>
        <p className="body-font" style={{ fontSize: 12, color: "rgba(240,235,227,0.2)" }}>
          © 2026 Mix-R · Shake What You've Got · Registered in New Zealand
        </p>
      </footer>
    </div>
  );
}
