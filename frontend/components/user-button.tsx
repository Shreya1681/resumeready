"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Settings, LogOut, Sparkles } from "lucide-react"

export function UserButton({ afterSignOutUrl = "/" }: { afterSignOutUrl?: string }) {
  const { data: session, status } = useSession()

  if (status === "loading" || !session?.user) {
    return (
      <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
    )
  }

  const user = session.user
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 border border-border/50 hover:bg-transparent">
          <Avatar className="h-9 w-9 transition-all hover:scale-105">
            {user.image && <AvatarImage src={user.image} alt={user.name || "User Avatar"} />}
            <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex w-full items-center gap-2 cursor-pointer">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex w-full items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          className="flex w-full items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
          onClick={() => signOut({ callbackUrl: afterSignOutUrl })}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
