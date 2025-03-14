"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  PieChart,
  FileText,
  User,
  Settings,
  LogOut,
  Menu,
  Wallet,
  CreditCard,
  Target,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-context"
import { cn } from "@/lib/utils"

/**
 * Sidebar Component
 *
 * This component provides navigation for the application.
 * It's responsive and collapses to a mobile menu on smaller screens.
 */

// Define navigation items
const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview of your finances",
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: CreditCard,
    description: "Manage your income and expenses",
  },
  {
    title: "Spending Analysis",
    href: "/spending",
    icon: PieChart,
    description: "Analyze your spending patterns",
  },
  {
    title: "Savings Goals",
    href: "/goals",
    icon: Target,
    description: "Track progress towards your goals",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    description: "Generate financial reports",
  },
  {
    title: "Financial Advisor",
    href: "/advisor",
    icon: HelpCircle,
    description: "Get personalized financial advice",
  },
]

const accountNavItems = [
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    description: "Manage your account",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Application preferences",
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Handle logout
  const handleLogout = async () => {
    await logout()
  }

  // Sidebar content (shared between desktop and mobile)
  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-16 px-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">
            Money<span className="text-primary">Minder</span>
          </span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="py-4">
          <div className="px-3 py-2">
            <h3 className="text-sm font-medium text-muted-foreground">Main</h3>
            <div className="mt-2 space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="px-3 py-2">
            <h3 className="text-sm font-medium text-muted-foreground">Account</h3>
            <div className="mt-2 space-y-1">
              {accountNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
      {user && (
        <div className="border-t p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-full bg-primary/10 p-1 h-8 w-8 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Button>
        </div>
      )}
    </div>
  )

  // Mobile sidebar (using Sheet component)
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center h-16 px-4 border-b lg:hidden">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <div className="flex items-center justify-center flex-1">
            <Link href="/" className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">
                Money<span className="text-primary">Minder</span>
              </span>
            </Link>
          </div>
        </div>
        <SheetContent side="left" className="p-0 w-[300px]">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop sidebar
  return <div className={cn("hidden lg:flex lg:flex-col h-full w-[280px] border-r", className)}>{sidebarContent}</div>
}

