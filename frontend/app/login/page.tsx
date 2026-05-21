"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Please fill in all fields.")
      return
    }

    try {
      setIsLoading(true)
      const res = await signIn("credentials", {
        email: email.toLowerCase(),
        password,
        redirect: false,
      })

      if (res?.error) {
        toast.error("Invalid email or password.")
        setIsLoading(false)
      } else {
        toast.success("Signed in successfully! Redirecting...")
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      toast.error("An unexpected error occurred.")
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true)
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Google sign in failed:", error)
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute -top-[40%] -left-[40%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute -bottom-[40%] -right-[40%] w-[80%] h-[80%] rounded-full bg-accent/5 blur-[120px]" />
      
      <Card className="relative w-full max-w-md border-border/50 bg-card/70 backdrop-blur-md shadow-2xl transition-all duration-300 hover:shadow-primary/5 hover:border-border">
        <CardHeader className="space-y-4 text-center">
          <Link href="/" className="mx-auto flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary transition-all group-hover:scale-105 group-hover:shadow-md group-hover:shadow-primary/20">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-gradient-stops">ResumeAI</span>
          </Link>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Sign in to your account to continue
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-2 pb-6 space-y-5">
          
          {/* Credentials Form */}
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-9 h-11 border-border/80 focus-visible:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-10 h-11 border-border/80 focus-visible:ring-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 transition-all duration-200 shadow-md font-medium text-sm hover:scale-[1.01] active:scale-[0.99]"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Elegant Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-border/40"></div>
            <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase tracking-widest">Or continue with</span>
            <div className="flex-grow border-t border-border/40"></div>
          </div>

          {/* Google Sign In */}
          <Button
            variant="outline"
            type="button"
            className="w-full h-11 flex items-center justify-center gap-3 font-medium transition-all duration-200 hover:bg-muted/80 border-border/80 text-foreground text-sm shadow-sm active:scale-[0.98]"
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <svg className="h-4 w-4" aria-hidden="true" focusable="false" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.5 24c0-1.55-.15-3.24-.47-4.77H24v9.03h12.75c-.53 2.87-2.14 5.31-4.59 6.95l7.13 5.53C43.51 36.6 46.5 30.93 46.5 24z" />
                <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.13-5.53c-1.97 1.32-4.5 2.13-7.76 2.13-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
            )}
            {isGoogleLoading ? "Connecting to Google..." : "Google"}
          </Button>

          {/* Toggle link */}
          <div className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline transition-colors">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
