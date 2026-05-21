import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          const response = await fetch(`${apiBase}/api/auth/google-login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name
            })
          });

          if (response.ok) {
            const data = await response.json();
            if (data && data.user) {
              user.id = data.user.id;
            }
          } else {
            console.error("Google sign-in sync failed with status:", response.status);
          }
        } catch (error) {
          console.error("Google sign-in sync connection error:", error);
        }
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
      }
      return session
    }
  }
} satisfies NextAuthConfig
