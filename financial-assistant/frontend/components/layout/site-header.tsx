"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart2, MessageSquare, FileText, User, Menu, X, Wallet } from "lucide-react"
import { Button } from "@/frontend/components/ui/button"
import { ThemeToggle } from "@/frontend/components/theme-toggle"
import { useState } from "react"
import { cn } from "@/backend/utils/cn"
import { useMobile } from "@/frontend/hooks/use-mobile"

export function SiteHeader() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: "/spending",
      label: "Spending",
      icon: BarChart2,
      active: pathname === "/spending",
    },
    {
      href: "/advisor",
      label: "Assistant",
      icon: MessageSquare,
      active: pathname === "/advisor",
    },
    {
      href: "/reports",
      label: "Reports",
      icon: FileText,
      active: pathname === "/reports",
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
      active: pathname === "/profile",
    },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <Wallet className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">
              Money<span className="text-primary">Minder</span>
            </span>
          </Link>
        </div>

        {isMobile ? (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        ) : (
          <nav className="flex items-center gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  route.active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="container pb-4">
          <nav className="flex flex-col gap-3">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  route.active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

