import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import authConfig from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          // Query the separate Express Backend Server
          const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();
          if (data && data.user) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email
            };
          }
        } catch (error) {
          console.error("NextAuth authorize Express connection error:", error);
        }
        
        return null;
      }
    })
  ]
})
