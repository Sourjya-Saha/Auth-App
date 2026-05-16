"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: "var(--accent)",
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
          }} />
        ))}
        <style>{`
          @keyframes pulse {
            0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
            40% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  const user = session?.user;

  return (
    <main style={{ minHeight: "100vh", padding: "0 0 60px", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Background */}
      <div style={{ position: "fixed", top: "-15%", right: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,107,255,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-10%", left: "-10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(79,255,176,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

        {/* Navbar */}
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", borderBottom: "1px solid var(--border)", marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px" }}>
            <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="var(--accent)" fillOpacity="0.15" />
              <path d="M18 8 L28 14 L28 22 L18 28 L8 22 L8 14 Z" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
              <circle cx="18" cy="18" r="4" fill="var(--accent)" />
            </svg>
            AuthApp
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {user?.image && (
              <img src={user.image} alt={user.name} referrerPolicy="no-referrer"
                style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--border-hover)", objectFit: "cover" }} />
            )}
            <button onClick={() => signOut({ callbackUrl: "/" })}
              style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text-secondary)", fontFamily: "var(--font-body)", fontSize: "13px", padding: "6px 14px", cursor: "pointer" }}>
              Sign out
            </button>
          </div>
        </nav>

        {/* Welcome Banner */}
        <div style={{
          background: "linear-gradient(135deg, rgba(124,107,255,0.1) 0%, rgba(255,107,157,0.06) 100%)",
          border: "1px solid rgba(124,107,255,0.2)", borderRadius: "var(--radius-xl)",
          padding: "32px", display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "20px", marginBottom: "28px", animation: "fadeUp 0.4s ease both"
        }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.3px", marginBottom: "6px" }}>
              Hello, {user?.name?.split(" ")[0] ?? "there"} 👋
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              You're signed in as <strong style={{ color: "var(--text-primary)" }}>{user?.email}</strong>
            </p>
          </div>
          {user?.unique_id && (
            <div style={{
              background: "rgba(124,107,255,0.12)", border: "1px solid rgba(124,107,255,0.25)",
              borderRadius: "var(--radius-md)", padding: "12px 18px",
              display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0
            }}>
              <span style={{ fontSize: "11px", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, marginBottom: "4px" }}>Your ID</span>
              <span style={{ fontFamily: "monospace", fontSize: "18px", fontWeight: 700, letterSpacing: "2px" }}>{user.unique_id}</span>
            </div>
          )}
        </div>

        {/* Lookup Card */}
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)", padding: "32px",
          animation: "fadeUp 0.4s 0.1s ease both"
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "28px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "var(--radius-sm)",
              background: "rgba(124,107,255,0.12)", border: "1px solid rgba(124,107,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--accent)", flexShrink: 0
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>User Lookup</h2>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Enter a unique ID to fetch user details</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "12px" }}>
            <input
              type="text"
              placeholder="e.g. A1B2C3D4"
              value={inputId}
              onChange={(e) => setInputId(e.target.value.toUpperCase())}
              maxLength={12}
              style={{
                flex: 1, background: "var(--bg-elevated)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)", padding: "12px 16px",
                color: "var(--text-primary)", fontFamily: "monospace",
                fontSize: "15px", letterSpacing: "2px", outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
            <button type="submit" disabled={loading || !inputId.trim()}
              style={{
                background: "var(--accent)", border: "none", borderRadius: "var(--radius-md)",
                color: "#fff", fontFamily: "var(--font-body)", fontSize: "14px",
                fontWeight: 600, padding: "12px 24px", cursor: loading || !inputId.trim() ? "not-allowed" : "pointer",
                opacity: loading || !inputId.trim() ? 0.5 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", minWidth: "90px",
                transition: "all 0.2s"
              }}>
              {loading
                ? <span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                : "Search"
              }
            </button>
          </form>

          {/* Error */}
          {error && (
            <div style={{
              display: "flex", alignItems: "center", gap: "10px", marginTop: "16px",
              padding: "12px 16px", background: "rgba(255,107,107,0.08)",
              border: "1px solid rgba(255,107,107,0.2)", borderRadius: "var(--radius-md)",
              color: "var(--error)", fontSize: "14px"
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Not Found */}
          {result?.type === "not_found" && (
            <div style={{
              marginTop: "28px", padding: "32px",
              border: "1px dashed var(--border-hover)", borderRadius: "var(--radius-lg)",
              textAlign: "center", animation: "fadeUp 0.3s ease both"
            }}>
              <div style={{ fontSize: "32px", marginBottom: "12px", color: "var(--text-muted)" }}>∅</div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>Try Again</p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>No user found with that ID.</p>
            </div>
          )}

          {/* Found */}
          {result?.type === "found" && (
            <div style={{
              marginTop: "28px", background: "var(--bg-elevated)",
              border: "1px solid rgba(124,107,255,0.2)", borderRadius: "var(--radius-lg)",
              overflow: "hidden", animation: "fadeUp 0.3s ease both"
            }}>
              {/* Result Header */}
              <div style={{
                display: "flex", alignItems: "center", gap: "16px", padding: "24px",
                borderBottom: "1px solid var(--border)",
                background: "linear-gradient(135deg, rgba(124,107,255,0.08) 0%, transparent 100%)"
              }}>
                {result.data.profile_photo && (
                  <img src={result.data.profile_photo} alt={result.data.name} referrerPolicy="no-referrer"
                    style={{ width: "56px", height: "56px", borderRadius: "50%", border: "2px solid rgba(124,107,255,0.3)", objectFit: "cover", flexShrink: 0 }} />
                )}
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>{result.data.name}</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{result.data.email}</p>
                </div>
              </div>

              {/* Fields */}
              {[
                { label: "Name", value: result.data.name },
                { label: "Email", value: result.data.email },
                { label: "Google ID", value: result.data.google_id, mono: true },
                { label: "Unique ID", value: result.data.unique_id, mono: true, accent: true },
              ].map(({ label, value, mono, accent }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: "16px", padding: "14px 24px", borderBottom: "1px solid var(--border)"
                }}>
                  <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text-muted)", fontWeight: 600, flexShrink: 0 }}>{label}</span>
                  <span style={{
                    fontSize: accent ? "15px" : "14px",
                    color: accent ? "var(--accent)" : "var(--text-primary)",
                    fontFamily: mono ? "monospace" : "var(--font-body)",
                    fontWeight: accent ? 600 : 400,
                    letterSpacing: accent ? "2px" : "normal",
                    wordBreak: "break-all", textAlign: "right"
                  }}>{value || "—"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}