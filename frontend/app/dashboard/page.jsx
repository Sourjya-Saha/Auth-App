"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const GOV_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600&family=Instrument+Serif:ital@0;1&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .bg-background { background-color: #141313; }
  .text-primary { color: #ffffff; }
  .text-on-surface-variant { color: #c4c7c8; }
  .text-on-surface { color: #e5e2e1; }
  .bg-primary { background-color: #ffffff; }
  .text-on-primary { color: #2f3131; }

  .font-serif { font-family: 'Instrument Serif', serif; }
  .font-sans { font-family: 'Barlow', sans-serif; }

  .liquid-glass {
    backdrop-filter: blur(20px);
    background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15);
  }
  .liquid-glass-strong {
    backdrop-filter: blur(40px);
    background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.3), 0 20px 40px rgba(0,0,0,0.5);
  }
  .bg-grid {
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 64px 64px;
  }
  .blob {
    position: fixed;
    pointer-events: none;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.15;
    z-index: 0;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse {
    0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1); }
  }

  .anim-fade-up { animation: fadeUp 0.5s ease both; }
  .anim-fade-up-2 { animation: fadeUp 0.5s 0.12s ease both; }
  .anim-fade-up-3 { animation: fadeUp 0.5s 0.24s ease both; }

  .nav-link {
    font-family: 'Barlow', sans-serif;
    font-size: 12px; letter-spacing: 0.15em; font-weight: 600;
    color: #c4c7c8; text-decoration: none;
    transition: color 0.2s;
  }
  .nav-link:hover { color: #ffffff; }
  .nav-link-active {
    color: #ffffff;
    border-bottom: 1px solid #ffffff;
    padding-bottom: 2px;
  }

  .id-badge {
    background: rgba(212,89,40,0.15);
    box-shadow: inset 0 0 0 1px rgba(212,89,40,0.35);
    border-radius: 16px;
    padding: 14px 22px;
    display: flex; flex-direction: column; align-items: flex-end;
  }

  .result-row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; padding: 14px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    transition: background 0.15s;
  }
  .result-row:hover { background: rgba(255,255,255,0.04); }
  .result-row:last-child { border-bottom: none; }

  input:focus { outline: none; }
`;

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inputId, setInputId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/");
  }, [status, router]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!inputId.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await fetch(`${API_URL}/user/${inputId.trim()}`);
      const data = await res.json();
      if (res.ok) {
        setResult({ type: "found", data });
      } else {
        setResult({ type: "not_found" });
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div style={{
        minHeight: "100vh", background: "#141313",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
      }}>
        <style>{GOV_STYLES}</style>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: "10px", height: "10px", borderRadius: "50%",
            background: "#d45928",
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
          }} />
        ))}
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="bg-background" style={{ minHeight: "100vh", position: "relative", overflow: "hidden", paddingBottom: "80px" }}>
      <style>{GOV_STYLES}</style>


      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

        {/* ── NAV ── */}
        <nav style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 0 16px", borderBottom: "1px solid rgba(255,255,255,0.1)",
          marginBottom: "48px"
        }}>
          <div className="font-serif" style={{ fontSize: "20px", fontStyle: "italic", color: "#fff", fontWeight: 400 }}>
            AuthApp
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            <a href="/" className="nav-link">About</a>
            <a href="/dashboard" className="nav-link nav-link-active">Dashboard</a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {user?.image && (
              <img src={user.image} alt={user.name} referrerPolicy="no-referrer"
                style={{ width: "34px", height: "34px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", objectFit: "cover" }} />
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="liquid-glass font-sans"
              style={{
                border: "none", borderRadius: "100px",
                color: "#c4c7c8", fontSize: "12px", letterSpacing: "0.12em", fontWeight: 600,
                padding: "8px 18px", cursor: "pointer", background: "none"
              }}
            >
              SIGN OUT
            </button>
          </div>
        </nav>

        {/* ── WELCOME BANNER ── */}
        <div className="anim-fade-up" style={{ marginBottom: "28px" }}>
          <p className="font-sans" style={{ fontSize: "12px", letterSpacing: "0.15em", fontWeight: 600, color: "#c4c7c8", marginBottom: "12px" }}>
            // Welcome
          </p>
          <div className="liquid-glass" style={{
            borderRadius: "2rem", padding: "36px 40px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px",
            background: "linear-gradient(135deg, rgba(212,89,40,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            boxShadow: "inset 0 0 0 1px rgba(212,89,40,0.25)"
          }}>
            <div>
              <h1 className="font-serif" style={{ fontSize: "56px", fontStyle: "italic", color: "#fff", lineHeight: "1.1", marginBottom: "8px" }}>
                Hello, <span style={{ color: "#d45928" }}>{user?.name?.split(" ")[0] ?? "there"}</span>
              </h1>
              <p className="font-sans" style={{ fontSize: "15px", color: "#c4c7c8", letterSpacing: "0.01em" }}>
                Signed in as&nbsp;
                <span style={{ color: "#e5e2e1", fontWeight: 600 }}>{user?.email}</span>
              </p>
            </div>

            {user?.unique_id && (
              <div className="id-badge" style={{ flexShrink: 0 }}>
                <span className="font-sans" style={{ fontSize: "10px", color: "#d45928", letterSpacing: "0.18em", fontWeight: 600, textTransform: "uppercase", marginBottom: "6px" }}>
                  Your ID
                </span>
                <span className="font-serif" style={{ fontSize: "28px", fontStyle: "italic", color: "#fff", letterSpacing: "4px" }}>
                  {user.unique_id}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── LOOKUP CARD ── */}
        <div className="liquid-glass anim-fade-up-2" style={{ borderRadius: "2rem", padding: "36px 40px" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "18px", marginBottom: "32px" }}>
            <div className="liquid-glass" style={{
              width: "48px", height: "48px", borderRadius: "14px",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, color: "#d45928",
              boxShadow: "inset 0 0 0 1px rgba(212,89,40,0.3)"
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>
                manage_search
              </span>
            </div>
            <div>
              <h2 className="font-serif" style={{ fontSize: "28px", fontStyle: "italic", color: "#fff", marginBottom: "4px" }}>
                User Lookup
              </h2>
              <p className="font-sans" style={{ fontSize: "14px", color: "#c4c7c8" }}>
                Enter a unique ID to fetch user details
              </p>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "12px" }}>
            <div className="liquid-glass" style={{
              flex: 1, borderRadius: "100px", display: "flex", alignItems: "center",
              gap: "12px", padding: "0 20px"
            }}>
              <span className="material-symbols-outlined" style={{ color: "#c4c7c8", fontSize: "18px" }}>search</span>
              <input
                type="text"
                placeholder="e.g. A1B2C3D4"
                value={inputId}
                onChange={(e) => setInputId(e.target.value.toUpperCase())}
                maxLength={12}
                className="font-sans"
                style={{
                  flex: 1, background: "transparent", border: "none",
                  color: "#fff", fontFamily: "'Barlow', sans-serif",
                  fontSize: "15px", letterSpacing: "3px", padding: "14px 0",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !inputId.trim()}
              className="bg-primary text-on-primary font-sans"
              style={{
                border: "none", borderRadius: "100px",
                fontSize: "12px", letterSpacing: "0.15em", fontWeight: 600,
                padding: "14px 28px", cursor: loading || !inputId.trim() ? "not-allowed" : "pointer",
                opacity: loading || !inputId.trim() ? 0.5 : 1,
                display: "flex", alignItems: "center", justifyContent: "center",
                minWidth: "100px", transition: "opacity 0.2s",
              }}
            >
              {loading
                ? <span style={{
                    width: "16px", height: "16px",
                    border: "2px solid rgba(47,49,49,0.3)",
                    borderTopColor: "#2f3131", borderRadius: "50%",
                    animation: "spin 0.7s linear infinite", display: "inline-block"
                  }} />
                : "SEARCH"
              }
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="liquid-glass font-sans" style={{
              display: "flex", alignItems: "center", gap: "10px",
              marginTop: "16px", padding: "14px 20px",
              borderRadius: "16px", color: "#ff6b6b", fontSize: "14px",
              boxShadow: "inset 0 0 0 1px rgba(255,107,107,0.25)",
              background: "rgba(255,107,107,0.06)"
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>warning</span>
              {error}
            </div>
          )}

          {/* Not Found */}
          {result?.type === "not_found" && (
            <div className="anim-fade-up" style={{
              marginTop: "32px", padding: "40px",
              border: "1px dashed rgba(255,255,255,0.15)", borderRadius: "1.5rem",
              textAlign: "center"
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#c4c7c8", display: "block", marginBottom: "12px" }}>
                person_search
              </span>
              <p className="font-serif" style={{ fontSize: "24px", fontStyle: "italic", color: "#e5e2e1", marginBottom: "6px" }}>
                No results found
              </p>
              <p className="font-sans" style={{ fontSize: "13px", color: "#c4c7c8" }}>
                No user with that ID exists in the system.
              </p>
            </div>
          )}

          {/* Found */}
          {result?.type === "found" && (
            <div className="anim-fade-up" style={{
              marginTop: "32px",
              background: "linear-gradient(135deg, rgba(212,89,40,0.06) 0%, rgba(255,255,255,0.01) 100%)",
              boxShadow: "inset 0 0 0 1px rgba(212,89,40,0.2)",
              borderRadius: "1.5rem", overflow: "hidden"
            }}>
              {/* Result Header */}
              <div style={{
                display: "flex", alignItems: "center", gap: "18px",
                padding: "24px 28px", borderBottom: "1px solid rgba(255,255,255,0.08)"
              }}>
                {result.data.profile_photo ? (
                  <img
                    src={result.data.profile_photo} alt={result.data.name}
                    referrerPolicy="no-referrer"
                    style={{ width: "60px", height: "60px", borderRadius: "50%", border: "2px solid rgba(212,89,40,0.4)", objectFit: "cover", flexShrink: 0 }}
                  />
                ) : (
                  <div style={{
                    width: "60px", height: "60px", borderRadius: "50%", flexShrink: 0,
                    background: "rgba(212,89,40,0.15)", border: "2px solid rgba(212,89,40,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#d45928"
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1" }}>person</span>
                  </div>
                )}
                <div>
                  <h3 className="font-serif" style={{ fontSize: "22px", fontStyle: "italic", color: "#fff", marginBottom: "4px" }}>
                    {result.data.name}
                  </h3>
                  <p className="font-sans" style={{ fontSize: "13px", color: "#c4c7c8" }}>{result.data.email}</p>
                </div>
              </div>

              {/* Fields */}
              {[
                { label: "Name",      value: result.data.name,      icon: "badge",     mono: false, accent: false },
                { label: "Email",     value: result.data.email,     icon: "mail",      mono: false, accent: false },
                { label: "Google ID", value: result.data.google_id, icon: "fingerprint", mono: true,  accent: false },
                { label: "Unique ID", value: result.data.unique_id, icon: "tag",       mono: true,  accent: true  },
              ].map(({ label, value, icon, mono, accent }) => (
                <div key={label} className="result-row">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{
                      fontSize: "16px", fontVariationSettings: "'FILL' 1",
                      color: accent ? "#d45928" : "#c4c7c8"
                    }}>{icon}</span>
                    <span className="font-sans" style={{
                      fontSize: "11px", letterSpacing: "0.15em", fontWeight: 600,
                      color: "#c4c7c8", textTransform: "uppercase"
                    }}>{label}</span>
                  </div>
                  <span className="font-sans" style={{
                    fontSize: accent ? "16px" : "14px",
                    color: accent ? "#d45928" : "#e5e2e1",
                    fontFamily: mono ? "monospace" : "'Barlow', sans-serif",
                    fontWeight: accent ? 700 : 400,
                    letterSpacing: accent ? "3px" : mono ? "1px" : "normal",
                    wordBreak: "break-all", textAlign: "right"
                  }}>
                    {value || "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "24px",
        marginTop: "64px",
        display: "flex", justifyContent: "center", alignItems: "center",
        position: "relative", zIndex: 1
      }}>
        <p className="font-sans" style={{ fontSize: "12px", color: "#c4c7c8", letterSpacing: "0.05em" }}>
          © 2026 AuthApp · All Rights Reserved
        </p>
      </footer>
    </div>
  );
}