"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GoogleLoginButton from "./components/GoogleLoginButton";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="loading-screen">
        <div className="loading-dot" />
        <div className="loading-dot" />
        <div className="loading-dot" />
        <style>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: var(--bg);
          }
          .loading-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--accent);
            animation: pulse 1.2s ease-in-out infinite;
          }
          .loading-dot:nth-child(2) { animation-delay: 0.2s; }
          .loading-dot:nth-child(3) { animation-delay: 0.4s; }
          @keyframes pulse {
            0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
            40% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
      background: "var(--bg)"
    }}>
      {/* Background orbs */}
      <div style={{
        position: "fixed", top: "-20%", left: "-10%",
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,107,255,0.12) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed", bottom: "-20%", right: "-10%",
        width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,107,157,0.08) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        pointerEvents: "none"
      }} />

      {/* Card */}
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "48px 40px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "var(--shadow-card), var(--shadow-glow)",
        position: "relative",
        zIndex: 1,
        animation: "fadeUp 0.5s ease both"
      }}>
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Logo */}
        <div style={{ marginBottom: "28px" }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="var(--accent)" fillOpacity="0.15" />
            <path d="M18 8 L28 14 L28 22 L18 28 L8 22 L8 14 Z" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
            <circle cx="18" cy="18" r="4" fill="var(--accent)" />
          </svg>
        </div>

        {/* Text */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.5px",
            marginBottom: "8px"
          }}>Welcome back</h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Sign in to access your account and retrieve your unique user ID.
          </p>
        </div>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          marginBottom: "16px", fontSize: "12px",
          color: "var(--text-muted)", letterSpacing: "0.5px",
          textTransform: "uppercase"
        }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <span>Sign in with</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

        <GoogleLoginButton />

        <p style={{
          marginTop: "20px", fontSize: "12px",
          color: "var(--text-muted)", textAlign: "center", lineHeight: 1.7
        }}>
          By continuing, you agree to our{" "}
          <span style={{ color: "var(--accent)", cursor: "pointer" }}>Terms of Service</span>
          {" "}and{" "}
          <span style={{ color: "var(--accent)", cursor: "pointer" }}>Privacy Policy</span>.
        </p>
      </div>
    </main>
  );
}