"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <>
      <button
        onClick={handleLogin}
        disabled={loading}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          width: "100%",
          padding: "15px 24px",
          backdropFilter: "blur(20px)",
          background: hovered
            ? "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)"
            : "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)",
          boxShadow: hovered
            ? "inset 0 0 0 1px rgba(212,89,40,0.5), 0 8px 32px rgba(212,89,40,0.15)"
            : "inset 0 0 0 1px rgba(255,255,255,0.18)",
          borderRadius: "100px",
          border: "none",
          color: "#ffffff",
          fontFamily: "'Barlow', sans-serif",
          fontSize: "12px",
          letterSpacing: "0.15em",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          transform: hovered && !loading ? "translateY(-2px)" : "translateY(0)",
          transition: "all 0.25s ease",
        }}
      >
        {loading ? (
          <>
            <span style={{
              display: "inline-block", width: "18px", height: "18px",
              border: "2px solid rgba(255,255,255,0.2)",
              borderTopColor: "#d45928",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
              flexShrink: 0
            }} />
            <span>CONNECTING…</span>
          </>
        ) : (
          <>
            <GoogleIcon />
            <span>CONTINUE WITH GOOGLE</span>
          </>
        )}
      </button>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}