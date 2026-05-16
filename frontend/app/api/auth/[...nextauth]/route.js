import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && account?.access_token) {
        try {
          const response = await fetch(`${API_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token: account.access_token }),
          });
          if (response.ok) {
            const data = await response.json();
            user.unique_id = data.user?.unique_id;
          }
        } catch (err) {
          console.error("Failed to sync user with backend:", err);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && account?.access_token) {
        token.accessToken = account.access_token;
      }
      if (user?.unique_id) {
        token.unique_id = user.unique_id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.unique_id = token.unique_id;
      return session;
    },
  },
  pages: { signIn: "/" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };