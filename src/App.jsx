import { useState, useEffect, useCallback } from "react";
import { supabase, loadUserData, saveUserData, signOut } from "./utils/supabase";
import { useMixRSubscription } from "./utils/useMixRSubscription";
import defaultDrinks from "./data/drinks.json";
import DrinkCard from "./components/DrinkCard";
import Shelf from "./components/Shelf";
import ShoppingList from "./components/ShoppingList";
import BottomNav from "./components/BottomNav";
import MakingMode from "./components/MakingMode";
import AuthScreen from "./components/AuthScreen";
import SettingsScreen from "./components/SettingsScreen";
import AccessGate from "./components/AccessGate";
import NewDrinkModal from "./components/NewDrinkModal";
import ImportDrinkModal from "./components/ImportDrinkModal";
import OnlineDrinkSearch from "./components/OnlineDrinkSearch";
import LandingPage from "./components/LandingPage";
import { generateAIDrink } from "./utils/aiDrink";
import { calcMatchPct } from "./utils/shelfMatch";

const DEFAULT_SETTINGS = { largeText: false, highContrast: false, darkMode: false };

export default function App() {
  const [user, setUser]                     = useState(null);
  const [authLoading, setAuthLoading]       = useState(true);
  const [showAuth, setShowAuth]             = useState(false);
  const [tab, setTab]                       = useState("drinks");
  const [drinks, setDrinks]                 = useState([]);
  const [favorites, setFavorites]           = useState([]);
  const [shoppingList, setShoppingList]     = useState([]);
  const [shelf, setShelf]                   = useState([]);
  const [makingDrink, setMakingDrink]       = useState(null);
  const [showNewDrink, setShowNewDrink]     = useState(false);
  const [showImport, setShowImport]         = useState(false);
  const [showOnlineSearch, setShowOnlineSearch] = useState(false);
  const [aiLoading, setAiLoading]           = useState(false);
  const [toast, setToast]                   = useState("");
  const [syncing, setSyncing]               = useState(false);
  const [settings, setSettings]             = useState(DEFAULT_SETTINGS);
  const [filterCat, setFilterCat]           = useState("All");
  const [preferences, setPreferences]       = useState({ alcoholic: "any", category: "any" });

  const {
    isPro, isFounder, hasAccess, canUseAI,
    callsLeft, loading: subLoading,
    incrementCalls, grantMixRAccess,
  } = useMixRSubscription(user);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = settings.largeText ? "18px" : "16px";
    root.style.filter   = settings.highContrast ? "contrast(1.4)" : "";
  }, [settings]);

  useEffect(() => {
    try { const s = localStorage.getItem("mixr_settings"); if (s) setSettings(JSON.parse(s)); } catch {}
  }, []);

  function updateSettings(next) {
    setSettings(next);
    try { localStorage.setItem("mixr_settings", JSON.stringify(next)); } catch {}
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !hasAccess) return;
    async function load() {
      try {
        const data = await loadUserData(user.id);
        if (data) {
          setDrinks(data.recipes?.length ? data.recipes : defaultDrinks);
          setFavorites(data.favorites || []);
          setShoppingList(data.shopping_list || []);
          setShelf(data.pantry || []);
        } else {
          setDrinks(defaultDrinks);
        }
      } catch { setDrinks(defaultDrinks); }
    }
    load();
  }, [user, hasAccess]);

  const syncData = useCallback(async (d, f, s, sh) => {
    if (!user) return;
    setSyncing(true);
    try { await saveUserData(user.id, { recipes: d, favorites: f, shopping_list: s, pantry: sh }); }
    catch (err) { console.error(err); }
    setSyncing(false);
  }, [user]);

  function updateDrinks(val)       { setDrinks(val);       syncData(val, favorites, shoppingList, shelf); }
  function updateFavorites(val)    { setFavorites(val);    syncData(drinks, val, shoppingList, shelf); }
  function updateShoppingList(val) { setShoppingList(val); syncData(drinks, favorites, val, shelf); }
  function updateShelf(val)        { setShelf(val);        syncData(drinks, favorites, shoppingList, val); }

  function addToShopping(items) {
    if (!Array.isArray(items)) return;
    const next = [...shoppingList];
    const existing = shoppingList.map(i => i.toLowerCase());
    items.forEach(item => {
      const name = typeof item === "object" ? item.name : item;
      if (name && !existing.includes(name.toLowerCase())) next.push(name);
    });
    updateShoppingList(next);
  }

  function saveDrink(drink) {
    const next = drinks.find(d => d.id === drink.id) ? drinks : [drink, ...drinks];
    updateDrinks(next);
    setTab("drinks");
    showToast(`"${drink.title}" saved! 🍹`);
  }

  async function generateDrink() {
    if (!shelf.length) { showToast("Add items to your shelf first 🍶"); return; }
    if (!canUseAI) { showToast("You've used your free AI calls — upgrade to Pro! ⭐"); return; }
    setAiLoading(true);
    showToast("🤖 Mixing up 3 drink ideas…");
    try {
      const results = await generateAIDrink(shelf, preferences);
      await incrementCalls();
      results.forEach(d => saveDrink(d));
      showToast(`Generated ${results.length} drinks! 🍹`);
    } catch (err) {
      console.error(err);
      showToast("AI failed — try again");
    }
    setAiLoading(false);
  }

  function bestShelfMatch() {
    if (!shelf.length || !drinks.length) { showToast("Add shelf items first 🍶"); return; }
    const best = drinks.map(d => ({ ...d, pct: calcMatchPct(d, shelf) })).sort((a, b) => b.pct - a.pct)[0];
    if (!best || best.pct === 0) { showToast("No matches — add more to your shelf!"); return; }
    showToast(`Best match: ${best.title} (${best.pct}% match) 🍹`);
    setMakingDrink(best);
  }

  async function handleSignOut() {
    await signOut();
    setDrinks([]); setFavorites([]); setShoppingList([]); setShelf([]);
    setTab("drinks"); setShowAuth(false);
  }

  const CATEGORIES     = ["All", "Cocktail", "Mocktail", "Traditional", "Shot", "Wine", "Beer"];
  const filteredDrinks = filterCat === "All" ? drinks : drinks.filter(d => d.category === filterCat);
  const favDrinks      = drinks.filter(d => favorites.includes(d.id));
  const appBg          = settings.darkMode ? "#080808" : "#0d0d0d";

  // ── Loading ──────────────────────────────────────────────────────
  if (authLoading || subLoading) return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🍹</div>
        <div style={{ width: 36, height: 36, border: "3px solid #333", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  // ── Not logged in — landing page or auth ────────────────────────
  if (!user) {
    if (showAuth) return <AuthScreen onAuth={() => setShowAuth(false)} />;
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  // ── Logged in but no Mix-R access ────────────────────────────────
  if (!hasAccess) {
    return (
      <AccessGate
        user={user}
        onGetAccess={async () => {
          await grantMixRAccess();
          showToast("🍹 Welcome to Mix-R!");
        }}
        onSignOut={handleSignOut}
      />
    );
  }

  // ── Main app ─────────────────────────────────────────────────────
  return (
    <div style={{ paddingBottom: 90, background: appBg, minHeight: "100vh", fontFamily: "system-ui, sans-serif", color: "#f0ebe3" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 28 }}>🍹</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, color: "#f0ebe3" }}>Mix-R</h1>
              <p style={{ margin: 0, fontSize: 12, color: "#718096" }}>
                {syncing ? "☁️ Syncing…" : user.email.split("@")[0]}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {aiLoading && <span style={{ fontSize: 13, color: "#2563eb" }}>🤖 Mixing…</span>}
            {isFounder && <span style={{ fontSize: 11, background: "#0d1a3a", color: "#2563eb", padding: "3px 8px", borderRadius: 50, fontWeight: 700 }}>👑 Founder</span>}
            {isPro && !isFounder && <span style={{ fontSize: 11, background: "#2563eb", color: "#fff", padding: "3px 8px", borderRadius: 50, fontWeight: 700 }}>⭐ Pro</span>}
            {!isPro && !isFounder && (
              <span style={{ fontSize: 11, background: "#1a1a1a", border: "1px solid #333", color: "#718096", padding: "3px 8px", borderRadius: 50 }}>
                {callsLeft} AI left
              </span>
            )}
            <button type="button" onClick={handleSignOut}
              style={{ fontSize: 11, background: "none", border: "1px solid #333", color: "#718096", padding: "4px 10px", borderRadius: 50, cursor: "pointer" }}>
              Sign out
            </button>
          </div>
        </div>

        {/* Drinks tab */}
        {tab === "drinks" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <button type="button" onClick={() => setShowNewDrink(true)} style={btn("#1a3a5c")}>➕ New</button>
              <button type="button" onClick={() => setShowImport(true)} style={btn("#1a2a4a")}>🔗 Import</button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button type="button" onClick={generateDrink} disabled={aiLoading}
                style={btn(aiLoading ? "#1a3a6b" : "#2563eb")}>🤖 AI Mix</button>
              <button type="button" onClick={bestShelfMatch} style={btn("#3a2d1a")}>🍹 Best</button>
              <button type="button" onClick={() => setShowOnlineSearch(true)} style={btn("#2d1a3a")}>🌍 Search</button>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <select value={preferences.alcoholic} onChange={e => setPreferences(p => ({ ...p, alcoholic: e.target.value }))}
                style={{ flex: 1, padding: "8px 10px", borderRadius: 10, border: "1px solid #333", background: "#1a1a1a", color: "#f0ebe3", fontSize: 12, outline: "none" }}>
                <option value="any">🍹 Any</option>
                <option value="alcoholic">🍸 Alcoholic only</option>
                <option value="non-alcoholic">🌿 Non-alcoholic only</option>
              </select>
              <select value={preferences.category} onChange={e => setPreferences(p => ({ ...p, category: e.target.value }))}
                style={{ flex: 1, padding: "8px 10px", borderRadius: 10, border: "1px solid #333", background: "#1a1a1a", color: "#f0ebe3", fontSize: 12, outline: "none" }}>
                <option value="any">All types</option>
                <option value="Cocktail">Cocktails</option>
                <option value="Mocktail">Mocktails</option>
                <option value="Traditional">Traditional</option>
                <option value="Shot">Shots</option>
                <option value="Wine">Wine</option>
                <option value="Beer">Beer</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16, paddingBottom: 4 }}>
              {CATEGORIES.map(c => (
                <button key={c} type="button" onClick={() => setFilterCat(c)}
                  style={{ padding: "6px 12px", borderRadius: 50, border: `1px solid ${filterCat === c ? "#2563eb" : "#333"}`, background: filterCat === c ? "rgba(45,106,79,0.2)" : "transparent", color: filterCat === c ? "#2563eb" : "#718096", fontSize: 12, fontWeight: filterCat === c ? 700 : 400, whiteSpace: "nowrap", cursor: "pointer" }}>
                  {c}
                </button>
              ))}
            </div>

            {filteredDrinks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#718096" }}>
                <p style={{ fontSize: 48, marginBottom: 12 }}>🍹</p>
                <p style={{ fontSize: 16, marginBottom: 8 }}>No drinks yet!</p>
                <p style={{ fontSize: 14 }}>Add items to your shelf then tap 🤖 AI Mix</p>
              </div>
            ) : filteredDrinks.map(d => (
              <DrinkCard key={d.id} drink={d} shelf={shelf} favorites={favorites}
                onUpdateFavorites={updateFavorites}
                onAddToShopping={addToShopping}
                onDeleteDrink={id => updateDrinks(drinks.filter(x => x.id !== id))}
                onMakeDrink={setMakingDrink} />
            ))}
          </>
        )}

        {tab === "shelf" && <Shelf shelf={shelf} setShelf={updateShelf} />}

        {tab === "favorites" && (
          <div>
            <h2 style={{ margin: "0 0 16px", fontSize: 18, color: "#f0ebe3" }}>❤️ Saved Drinks</h2>
            {favDrinks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#718096" }}>
                <p style={{ fontSize: 48, marginBottom: 12 }}>🤍</p>
                <p>No saved drinks yet — tap 🤍 on any drink!</p>
              </div>
            ) : favDrinks.map(d => (
              <DrinkCard key={d.id} drink={d} shelf={shelf} favorites={favorites}
                onUpdateFavorites={updateFavorites} onAddToShopping={addToShopping}
                onDeleteDrink={id => updateDrinks(drinks.filter(x => x.id !== id))}
                onMakeDrink={setMakingDrink} />
            ))}
          </div>
        )}

        {tab === "shopping" && <ShoppingList items={shoppingList} setItems={updateShoppingList} />}

        {tab === "settings" && (
          <SettingsScreen user={user} settings={settings} onUpdateSettings={updateSettings}
            onSignOut={handleSignOut} isPro={isPro} isFounder={isFounder}
            onUpgrade={() => showToast("Bundle upgrade coming soon! 🍹")} />
        )}
      </div>

      <MakingMode drink={makingDrink} onExit={() => setMakingDrink(null)} />
      {showNewDrink     && <NewDrinkModal onClose={() => setShowNewDrink(false)} onSave={d => { saveDrink(d); setShowNewDrink(false); }} />}
      {showImport       && <ImportDrinkModal onClose={() => setShowImport(false)} onSave={d => { saveDrink(d); setShowImport(false); }} />}
      {showOnlineSearch && <OnlineDrinkSearch shelf={shelf} onSaveDrink={saveDrink} onClose={() => setShowOnlineSearch(false)} />}

      <BottomNav tab={tab} setTab={setTab} />

      {toast && (
        <div style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", background: "#1a1a1a", color: "#f0ebe3", padding: "10px 20px", borderRadius: 50, fontSize: 13, whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.5)", zIndex: 9998, border: "1px solid rgba(45,106,79,0.3)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}

function btn(bg) {
  return { flex: 1, padding: "10px 8px", borderRadius: 10, border: "none", background: bg, color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13 };
}
