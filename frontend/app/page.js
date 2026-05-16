"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GoogleLoginButton from "./components/GoogleLoginButton";

const GOV_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;600&family=Instrument+Serif:ital@0;1&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .bg-background { background-color: #141313; }
  .text-primary { color: #ffffff; }
  .text-on-surface-variant { color: #c4c7c8; }

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
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.3), 0 32px 64px rgba(0,0,0,0.6);
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
    filter: blur(120px);
    opacity: 0.18;
    z-index: 0;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1); }
  }

  .anim-fade-up { animation: fadeUp 0.6s ease both; }

  .feature-pill {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 16px; border-radius: 100px;
  }
`;

const features = [
  { icon: "fingerprint",  label: "Unique ID per user" },
  { icon: "lock",         label: "Secure OAuth login" },
  { icon: "bolt",         label: "Instant lookup" },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
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

  return (
    <div className="bg-background" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden" }}>
      <style>{GOV_STYLES}</style>


      <div className="bg-grid" style={{ position: "fixed", inset: 0, pointerEvents: "none" }} />

      {/* Top wordmark */}
      <div className="anim-fade-up" style={{ marginBottom: "40px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p className="font-sans" style={{ fontSize: "11px", letterSpacing: "0.2em", fontWeight: 600, color: "#c4c7c8", marginBottom: "10px" }}>
          // Authentication
        </p>
        <div className="font-serif" style={{ fontSize: "20px", fontStyle: "italic", color: "#fff" }}>
          AuthApp
        </div>
      </div>

      {/* Main Card */}
      <div
        className="liquid-glass-strong anim-fade-up"
        style={{
          borderRadius: "2.5rem", padding: "52px 48px",
          width: "100%", maxWidth: "460px",
          position: "relative", zIndex: 1,
          animationDelay: "0.1s"
        }}
      >
        {/* Headline */}
        <div style={{ marginBottom: "36px" }}>
          <h1 className="font-serif" style={{
            fontSize: "52px", fontStyle: "italic",
            color: "#fff", lineHeight: "1.05",
            letterSpacing: "-0.02em", marginBottom: "14px"
          }}>
            Welcome 
            <span style={{ color: "#d45928" }}> back.</span>
          </h1>
          <p className="font-sans" style={{ fontSize: "15px", color: "#c4c7c8", lineHeight: "1.65", letterSpacing: "0.01em" }}>
            Sign in to access your account and retrieve your unique user ID.
          </p>
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "36px" }}>
          {features.map(({ icon, label }) => (
            <div key={label} className="liquid-glass feature-pill">
              <span className="material-symbols-outlined" style={{
                fontSize: "16px", color: "#d45928", fontVariationSettings: "'FILL' 1"
              }}>{icon}</span>
              <span className="font-sans" style={{ fontSize: "13px", color: "#e5e2e1", letterSpacing: "0.03em" }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center", gap: "14px",
          marginBottom: "20px"
        }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
          <span className="font-sans" style={{ fontSize: "11px", letterSpacing: "0.15em", color: "#c4c7c8", textTransform: "uppercase", fontWeight: 600 }}>
            Sign in with
          </span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Google Login Button */}
        <GoogleLoginButton />

        {/* Fine print */}
        <p className="font-sans" style={{
          marginTop: "22px", fontSize: "12px", color: "#c4c7c8",
          textAlign: "center", lineHeight: "1.7", letterSpacing: "0.01em"
        }}>
          By continuing, you agree to our{" "}
          <span style={{ color: "#d45928", cursor: "pointer" }}>Terms of Service</span>
          {" "}and{" "}
          <span style={{ color: "#d45928", cursor: "pointer" }}>Privacy Policy</span>.
        </p>
      </div>

      {/* Footer hint */}
      <div className="anim-fade-up" style={{
        marginTop: "32px", position: "relative", zIndex: 1,
        animationDelay: "0.3s"
      }}>
        <p className="font-sans" style={{ fontSize: "11px", letterSpacing: "0.12em", color: "#c4c7c8", textAlign: "center", opacity: 0.6 }}>
          © 2026 AuthApp · All Rights Reserved
        </p>
      </div>
    </div>
  );
}