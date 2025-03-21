import Link from "next/link"
import { ArrowRight, CheckCircle, Clock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Shield className="h-6 w-6 text-primary" />
            <span>PaySafe</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-20 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                    Secure Payments for Freelancers
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground text-sm md:text-base lg:text-xl">
                    Our platform ensures transparent, secure, and fair payments with milestone-based escrow and
                    automated work verification.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[500px] aspect-video rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-background p-1 shadow-lg">
                  <div className="absolute inset-0 rounded-lg border border-border"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="space-y-2 text-center">
                      <Shield className="h-8 w-8 md:h-12 md:w-12 mx-auto text-primary" />
                      <h3 className="text-lg md:text-xl font-bold">Secure Escrow Payments</h3>
                      <p className="text-xs md:text-sm text-muted-foreground max-w-[300px] mx-auto">
                        Funds are held securely until work is verified and approved
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How PaySafe Works</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform simplifies payments between freelancers and clients with a secure, transparent process.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 py-8 md:py-12">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-4 md:p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-center">Milestone Payments</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Break projects into milestones with secure escrow payments released upon completion.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-4 md:p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-center">Work Verification</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Submit and verify work with our intuitive system that tracks progress and approvals.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-4 md:p-6 shadow-sm sm:col-span-2 md:col-span-1">
                <div className="rounded-full bg-primary/10 p-3">
                  <Shield className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-center">Dispute Resolution</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Fair and transparent dispute resolution with mediation when needed.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Process</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Simple 3-Step Process</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform makes it easy to manage freelance projects from start to finish.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-8 py-8 md:py-12">
              <div className="relative flex flex-col items-center space-y-4">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-center">Create Project</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Define project details and set up payment milestones.
                  </p>
                </div>
                <div className="absolute right-0 top-5 md:top-6 hidden h-0.5 w-full bg-border md:block md:right-[-50%] md:w-[100%]"></div>
              </div>
              <div className="relative flex flex-col items-center space-y-4">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-center">Track Progress</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Submit work and track milestone completion in real-time.
                  </p>
                </div>
                <div className="absolute right-0 top-5 md:top-6 hidden h-0.5 w-full bg-border md:block md:right-[-50%] md:w-[100%]"></div>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-center">Get Paid</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Receive secure payments automatically when work is approved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} PaySafe. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

