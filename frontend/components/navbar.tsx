"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"
import { UserButton } from "@/components/user-button"
import { Button } from "@/components/ui/button"
import { Moon, Sun, FileText } from "lucide-react"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const isSignedIn = !!session

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">ResumeReady</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link href="/upload" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Upload Resume
          </Link>
          <Link href="/interview" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            AI Interview
          </Link>
          <Link href="/companies" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Companies
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
