"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, Eye, EyeOff, LogOut, RefreshCw, Save, Search, RotateCcw, Sparkles } from "lucide-react";

type Category = "Social Media Posts" | "UI/UX Designs" | "Printed Designs";
type Pin = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pinUrl: string;
  createdAt: string;
  category: Category;
};
type PinResponse = { configured: boolean; pins: Pin[]; message?: string };
type Metadata = { pin_id: string; title: string; description: string; alt_text: string; updated_at?: string };
type MetadataMap = Record<string, Metadata>;

const CATEGORIES: Category[] = ["Social Media Posts", "UI/UX Designs", "Printed Designs"];

export function AdminDashboard() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pins, setPins] = useState<Pin[]>([]);
  const [metadata, setMetadata] = useState<MetadataMap>({});
  const [activeCategory, setActiveCategory] = useState<Category>("Social Media Posts");
  const [selectedId, setSelectedId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [altText, setAltText] = useState("");
  const [generatingSeo, setGeneratingSeo] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  // Prevent the initial session check from overwriting a successful login if it resolves late.
  const loginStarted = useRef(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [pinsResponse, metadataResponse] = await Promise.all([
        fetch("/api/pinterest/pins?raw=1", { cache: "no-store" }),
        fetch("/api/admin/pinterest/metadata", { cache: "no-store" }),
      ]);
      if (pinsResponse.status === 401 || metadataResponse.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!pinsResponse.ok) throw new Error("Pinterest boards could not be loaded.");
      if (!metadataResponse.ok) {
        const data = await metadataResponse.json().catch(() => ({}));
        throw new Error(data.error || "Saved metadata could not be loaded.");
      }
      const pinData = (await pinsResponse.json()) as PinResponse;
      const metaData = (await metadataResponse.json()) as { metadata: MetadataMap };
      setPins(pinData.pins || []);
      setMetadata(metaData.metadata || {});
      setAuthenticated(true);
      setSelectedId((current) => current || pinData.pins?.[0]?.id || "");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/admin/auth", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { configured: boolean; authenticated: boolean }) => {
        if (loginStarted.current) return;
        setConfigured(data.configured);
        setAuthenticated(data.authenticated);
        if (data.authenticated) void loadDashboard();
      })
      .catch(() => {
        if (!loginStarted.current) setError("Could not check admin session. Refresh the page.");
      });
  }, [loadDashboard]);

  const categoryPins = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return pins.filter((pin) => pin.category === activeCategory && (
      !needle || pin.title.toLowerCase().includes(needle) || pin.id.includes(needle)
    ));
  }, [pins, activeCategory, search]);

  const selectedPin = pins.find((pin) => pin.id === selectedId) ?? null;
  const selectedMetadata = selectedPin ? metadata[selectedPin.id] : undefined;

  const choosePin = (pin: Pin) => {
    setSelectedId(pin.id);
    const saved = metadata[pin.id];
    setTitle(saved?.title ?? pin.title);
    setDescription(saved?.description ?? pin.description);
    setAltText(saved?.alt_text ?? pin.title);
    setMessage("");
    setError("");
  };

  useEffect(() => {
    if (selectedPin && selectedPin.id === selectedId) {
      const saved = metadata[selectedPin.id];
      setTitle(saved?.title ?? selectedPin.title);
      setDescription(saved?.description ?? selectedPin.description);
      setAltText(saved?.alt_text ?? selectedPin.title);
    }
  // Update editor only when the selected pin or its saved record changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, metadata]);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loginStarted.current = true;
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed.");
      setPassword("");
      setAuthenticated(true);
      await loadDashboard();
    } catch (caught) {
      loginStarted.current = false;
      setError(caught instanceof Error ? caught.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function generateSeo() {
    if (!selectedPin) return;
    setGeneratingSeo(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/seo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedPin.category,
          title,
          description,
          pinUrl: selectedPin.pinUrl,
          imageUrl: selectedPin.imageUrl,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not generate SEO content.");
      setTitle(data.title);
      setDescription(data.description);
      setAltText(data.altText);
      setMessage("AI suggestions added. Review and edit them before saving.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not generate SEO content.");
    } finally {
      setGeneratingSeo(false);
    }
  }

  async function saveMetadata(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedPin) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/pinterest/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinId: selectedPin.id, title, description, altText }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed.");
      setMetadata((current) => ({
        ...current,
        [selectedPin.id]: {
          pin_id: selectedPin.id,
          title: title.trim(),
          description: description.trim(),
          alt_text: altText.trim() || title.trim(),
          updated_at: new Date().toISOString(),
        },
      }));
      setMessage("Changes saved. Your portfolio will now use this metadata.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function resetMetadata() {
    if (!selectedPin || !selectedMetadata) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/pinterest/metadata", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinId: selectedPin.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Reset failed.");
      setMetadata((current) => {
        const next = { ...current };
        delete next[selectedPin.id];
        return next;
      });
      setTitle(selectedPin.title);
      setDescription(selectedPin.description);
      setAltText(selectedPin.title);
      setMessage("Pinterest's original metadata has been restored.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not reset metadata.");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    loginStarted.current = false;
    setAuthenticated(false);
    setPins([]);
    setMetadata({});
    setSelectedId("");
  }

  if (configured === null) {
    return <main className="cr-admin-loading">Loading CreativeRizz Admin…</main>;
  }

  if (!configured) {
    return (
      <main className="cr-admin-auth">
        <section className="cr-admin-login">
          <span className="cr-admin-eyebrow">CREATIVERIZZ / ADMIN</span>
          <h1>Admin setup required</h1>
          <p>Add <code>ADMIN_PASSWORD</code> to your Vercel environment variables. Use a unique password with at least 8 characters, then redeploy.</p>
        </section>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="cr-admin-auth">
        <form className="cr-admin-login" onSubmit={login}>
          <span className="cr-admin-eyebrow">CREATIVERIZZ / PRIVATE AREA</span>
          <h1>Welcome back.</h1>
          <p>Sign in to manage the titles and descriptions shown across your Pinterest work.</p>
          <label htmlFor="admin-password">Admin password</label>
          <div className="cr-admin-password-wrap">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              autoFocus
            />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && <p className="cr-admin-error">{error}</p>}
          <button className="cr-admin-primary" type="submit" disabled={loading || !password}>
            {loading ? "Signing in…" : "Unlock admin"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="cr-admin-shell">
      <header className="cr-admin-header">
        <a href="/" className="cr-admin-brand">Creative<span>Rizz</span><small>ADMIN</small></a>
        <div className="cr-admin-header-actions">
          <span className="cr-admin-secure"><span /> Private workspace</span>
          <button type="button" className="cr-admin-logout" onClick={logout}><LogOut size={16} /> Sign out</button>
        </div>
      </header>

      <section className="cr-admin-intro">
        <div>
          <span className="cr-admin-eyebrow">PINTEREST CONTENT MANAGER</span>
          <h1>Manage your work.</h1>
          <p>Write your own project titles and descriptions. Saved content automatically appears on your public portfolio.</p>
        </div>
        <button type="button" className="cr-admin-refresh" onClick={() => void loadDashboard()} disabled={loading}>
          <RefreshCw size={16} className={loading ? "cr-admin-spin" : ""} /> Refresh boards
        </button>
      </section>

      <nav className="cr-admin-tabs" aria-label="Pinterest boards">
        {CATEGORIES.map((category) => (
          <button key={category} type="button" className={activeCategory === category ? "is-active" : ""} onClick={() => { setActiveCategory(category); setSelectedId(""); setMessage(""); }}>
            {category}
            <span>{pins.filter((pin) => pin.category === category).length}</span>
          </button>
        ))}
      </nav>

      {error && <div className="cr-admin-alert cr-admin-alert-error">{error}</div>}
      {message && <div className="cr-admin-alert cr-admin-alert-success"><Check size={16} /> {message}</div>}

      <section className="cr-admin-workspace">
        <aside className="cr-admin-library">
          <div className="cr-admin-library-top">
            <div><h2>Projects</h2><span>{categoryPins.length} pins</span></div>
            <label className="cr-admin-search">
              <Search size={16} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search pins…" />
            </label>
          </div>
          <div className="cr-admin-pin-list">
            {categoryPins.map((pin) => {
              const saved = metadata[pin.id];
              return (
                <button type="button" key={pin.id} className={selectedId === pin.id ? "cr-admin-pin is-selected" : "cr-admin-pin"} onClick={() => choosePin(pin)}>
                  <img src={pin.imageUrl} alt="" loading="lazy" />
                  <span className="cr-admin-pin-copy">
                    <strong>{saved?.title ?? pin.title}</strong>
                    <small>{saved ? "Custom metadata saved" : "Using Pinterest metadata"}</small>
                  </span>
                  {saved && <span className="cr-admin-saved-dot" aria-label="Custom metadata saved" />}
                </button>
              );
            })}
            {!loading && categoryPins.length === 0 && <p className="cr-admin-empty">{pins.length ? "No pins match this filter." : "No pins returned from Pinterest. Check the Pinterest connection and board IDs."}</p>}
          </div>
        </aside>

        <section className="cr-admin-editor">
          {selectedPin ? (
            <>
              <div className="cr-admin-editor-heading">
                <div><span className="cr-admin-eyebrow">EDIT PIN METADATA</span><h2>Project details</h2></div>
                <a href={selectedPin.pinUrl} target="_blank" rel="noopener noreferrer">Open on Pinterest <ArrowUpRight size={15} /></a>
              </div>
              <div className="cr-admin-selected-pin">
                <img src={selectedPin.imageUrl} alt={selectedPin.title} />
                <div><strong>{selectedPin.category}</strong><span>Pin ID: {selectedPin.id}</span></div>
                {selectedMetadata && <span className="cr-admin-custom-badge">CUSTOM</span>}
              </div>
              <form className="cr-admin-edit-form" onSubmit={saveMetadata}>
                <div className="cr-admin-seo-tools">
                  <div className="cr-admin-seo-copy">
                    <span className="cr-admin-seo-icon"><Sparkles size={16} /></span>
                    <div><strong>AI SEO assistant</strong><small>Generate a search-friendly title, description and image alt text.</small></div>
                  </div>
                  <div className="cr-admin-seo-controls">
                    <button type="button" className="cr-admin-generate" onClick={() => void generateSeo()} disabled={generatingSeo}>
                      <Sparkles size={15} /> {generatingSeo ? "Generating SEO…" : "Generate SEO"}
                    </button>
                  </div>
                </div>
                <div className="cr-admin-field">
                  <div><label htmlFor="pin-title">Title</label><span>{title.length}/120</span></div>
                  <input id="pin-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required placeholder="Write a clear project title" />
                </div>
                <div className="cr-admin-field">
                  <div><label htmlFor="pin-description">Description</label><span>{description.length}/1000</span></div>
                  <textarea id="pin-description" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={1000} rows={6} placeholder="Describe the project, design approach and relevant details…" />
                </div>
                <div className="cr-admin-field">
                  <div><label htmlFor="pin-alt">Image alt text <small>Optional</small></label><span>{altText.length}/300</span></div>
                  <input id="pin-alt" value={altText} onChange={(event) => setAltText(event.target.value)} maxLength={300} placeholder="Describe what is visible in the image" />
                </div>
                <div className="cr-admin-editor-actions">
                  {selectedMetadata && <button type="button" className="cr-admin-reset" onClick={resetMetadata} disabled={saving}><RotateCcw size={15} /> Restore Pinterest original</button>}
                  <button type="submit" className="cr-admin-primary cr-admin-save" disabled={saving || !title.trim()}><Save size={16} /> {saving ? "Saving…" : "Save changes"}</button>
                </div>
              </form>
            </>
          ) : (
            <div className="cr-admin-no-selection"><div><Search size={24} /></div><h2>Select a project</h2><p>Choose a Pin from the list to edit its title, description and image alt text.</p></div>
          )}
        </section>
      </section>
      <footer className="cr-admin-footer">Changes are saved to Supabase and reflected on your public portfolio. Pinterest remains the source of your images.</footer>
    </main>
  );
}
