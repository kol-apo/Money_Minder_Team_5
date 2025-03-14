import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/frontend/components/theme-provider"
import { SiteHeader } from "@/frontend/components/layout/site-header"
import { SiteFooter } from "@/frontend/components/layout/site-footer"
import { ChatbotProvider } from "@/frontend/components/features/chatbot-provider"
import { AuthProvider } from "@/frontend/contexts/auth-context"
import { FinancialProvider } from "@/frontend/contexts/financial-context"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <FinancialProvider>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1">{children}</div>
                <SiteFooter />
                <ChatbotProvider />
              </div>
            </FinancialProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
