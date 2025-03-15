import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Wallet, BarChart2, MessageSquare, Shield, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "MoneyMinder - Your Personal Financial Assistant",
  description: "Manage your finances, track spending, and get personalized advice",
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section with improved layout */}
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-background via-background to-muted/50">
          {/* Background elements */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
          <div className="absolute top-1/3 -left-64 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

          <div className="container relative z-10 px-4 py-16 md:py-24 lg:py-32 xl:py-40">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Left content */}
              <div className="flex flex-col space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary">
                    Financial Management Simplified
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                    Money<span className="text-primary">Minder</span>
                  </h1>
                  <p className="max-w-[600px] text-xl text-muted-foreground">
                    Smart financial tracking with personalized insights to help you save more and spend wisely.
                  </p>
                </div>

                {/* Features Preview */}
                <div className="grid grid-cols-3 gap-4 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-border/50 shadow-sm">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Track</p>
                    <p className="text-2xl font-bold text-primary">Expenses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Set</p>
                    <p className="text-2xl font-bold text-primary">Goals</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Get</p>
                    <p className="text-2xl font-bold text-primary">Insights</p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto gap-2 text-base">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right content - Phone mockup */}
              <div className="relative mx-auto lg:mx-0 max-w-[400px] aspect-[9/16]">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-2xl"></div>
                <div className="relative h-full w-full flex items-center justify-center">
                  {/* Main phone */}
                  <div className="relative w-[280px] sm:w-[320px] transition-all duration-700 hover:scale-[1.02] hover:rotate-0 rotate-3">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Google%20Pixel%207-5G%20Android%20Phone%20-%20Unlocked%20Smartphone%20with%20Telephoto%20Lens%20-%20256GB%20-%20Snow.jpg-VZkfUYybRmL4NTvgpb0fdqfhss62mv.jpeg"
                      alt="MoneyMinder App on Google Pixel"
                      className="w-full h-auto rounded-[2rem] shadow-2xl"
                    />

                    {/* UI Elements */}
                    <div className="absolute top-10 -left-16 p-4 bg-white/10 dark:bg-black/10 backdrop-blur-xl rounded-lg shadow-lg border border-white/20 dark:border-white/5 transform rotate-[-6deg]">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        <span className="font-medium">Balance</span>
                      </div>
                      <p className="text-xl font-bold mt-1 text-primary">$0.00</p>
                    </div>

                    <div className="absolute -bottom-10 -right-10 p-4 bg-white/10 dark:bg-black/10 backdrop-blur-xl rounded-lg shadow-lg border border-white/20 dark:border-white/5 transform rotate-[6deg]">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <span className="font-medium">Savings</span>
                      </div>
                      <p className="text-xl font-bold mt-1 text-primary">0.0%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with improved layout */}
        <section className="w-full py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <div className="inline-flex items-center px-4 py-1 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
                Powerful Features
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                Everything you need to manage your finances
              </h2>
              <p className="max-w-[800px] text-xl text-muted-foreground">
                MoneyMinder combines powerful financial tools with smart assistance to give you complete control.
              </p>
            </div>

            {/* Feature cards with improved layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Feature 1 */}
              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-background to-muted/30 border border-border/50 p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="absolute top-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full"></div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Smart Tracking</h3>
                <p className="text-muted-foreground">
                  Automatically categorize and track all your financial transactions in one place.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-background to-muted/30 border border-border/50 p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="absolute top-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full"></div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BarChart2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Visual Insights</h3>
                <p className="text-muted-foreground">
                  Interactive charts and graphs to visualize your spending patterns and financial health.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-background to-muted/30 border border-border/50 p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="absolute top-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full"></div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Financial Assistant</h3>
                <p className="text-muted-foreground">
                  Get personalized financial advice and recommendations from our smart assistant.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-background to-muted/30 border border-border/50 p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="absolute top-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full"></div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Bank-level security and privacy protection for all your sensitive financial data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works section */}
        <section className="w-full py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <div className="inline-flex items-center px-4 py-1 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                Take control of your finances in 3 simple steps
              </h2>
              <p className="max-w-[800px] text-xl text-muted-foreground">
                Getting started with MoneyMinder is quick and easy.
              </p>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center p-6">
                <div className="absolute -top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
                  1
                </div>
                <div className="mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Connect Your Accounts</h3>
                <p className="text-muted-foreground">
                  Securely link your bank accounts and credit cards to automatically import transactions.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center p-6">
                <div className="absolute -top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
                  2
                </div>
                <div className="mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Analyze Your Spending</h3>
                <p className="text-muted-foreground">
                  Get insights into your spending habits with automatic categorization and visual reports.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center p-6">
                <div className="absolute -top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
                  3
                </div>
                <div className="mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Optimize Your Finances</h3>
                <p className="text-muted-foreground">
                  Get personalized recommendations to save more, reduce debt, and achieve your financial goals.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-center mt-12">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 text-base">
                  Start Your Financial Journey <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="w-full py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <div className="rounded-2xl bg-gradient-to-b from-primary/5 to-primary/10 p-8 md:p-10 shadow-sm">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                    </svg>
                  </div>
                  <p className="text-xl md:text-2xl font-medium leading-relaxed">
                    MoneyMinder has completely transformed how I manage my finances. The financial assistant helped me
                    save an extra $450 per month!
                  </p>
                  <div className="mt-4">
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">Marketing Director • Using MoneyMinder for 8 months</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

