"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { UserButton } from "@/components/user-button"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  LayoutDashboard, 
  Upload, 
  MessageSquare, 
  Building2, 
  BarChart3, 
  Settings, 
  Sparkles,
  Moon,
  Sun
} from "lucide-react"

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload Resume", icon: Upload },
  { href: "/interview", label: "AI Interview", icon: MessageSquare },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/results", label: "Results", icon: BarChart3 },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">ResumeAI</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 text-sidebar-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 ml-0" />
            <span className="ml-5">Toggle Theme</span>
          </Button>
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground">
              <Settings className="h-5 w-5" />
              Settings
            </Button>
          </Link>
          <div className="flex items-center justify-between rounded-md px-3 py-2">
            <span className="text-sm text-sidebar-foreground">Profile</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </aside>
  )
}
