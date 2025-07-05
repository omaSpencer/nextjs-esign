import { ContractForm } from '@/components/contract-form'
import { Button } from '@/components/ui/button'
import { FileText, Shield, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="from-primary/10 to-background min-h-screen bg-gradient-to-b">
      {/* Header */}
      <header className="border-b backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <FileText className="text-primary h-8 w-8" />
            <span className="text-foreground text-2xl font-bold">DocuFlow</span>
          </div>
          <nav className="hidden items-center space-x-6 md:flex">
            <Link href="#features" className="text-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-foreground hover:text-primary transition-colors"
            >
              How it Works
            </Link>
            <Button variant="outline">Sign In</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-foreground text-4xl leading-tight font-bold lg:text-6xl">
                  Send Contracts for
                  <span className="text-primary"> Digital Signature</span>
                </h1>
                <p className="text-foreground text-xl leading-relaxed">
                  Streamline your contract process with our secure DocuSign integration. Fill out
                  contract details and send for signature in seconds.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg">Get Started Free</Button>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 pt-8">
                <div className="flex items-center space-x-2">
                  <Shield className="text-primary h-5 w-5" />
                  <span className="text-foreground text-sm">Bank-level Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-primary h-5 w-5" />
                  <span className="text-foreground text-sm">Legally Binding</span>
                </div>
              </div>
            </div>

            {/* Contract Form */}
            <div className="bg-background rounded-2xl p-8 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-foreground mb-2 text-2xl font-bold">Create Your Contract</h2>
                <p className="text-foreground">
                  Fill out the details below and we&apos;ll send it for signature
                </p>
              </div>
              <ContractForm />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold lg:text-4xl">
              Why Choose DocuFlow?
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              Powerful features designed to make contract signing simple and secure
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-foreground text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Send contracts for signature in under 60 seconds. No complex setup required.
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-foreground text-xl font-semibold">Secure & Compliant</h3>
              <p className="text-muted-foreground">
                Built on DocuSign&apos;s trusted platform with enterprise-grade security.
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-foreground text-xl font-semibold">Smart Templates</h3>
              <p className="text-muted-foreground">
                Pre-built contract templates that automatically populate with your details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="bg-secondary py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold lg:text-4xl">How It Works</h2>
            <p className="text-muted-foreground text-xl">
              Three simple steps to get your contracts signed
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold">
                1
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">Fill Details</h3>
              <p className="text-muted-foreground">
                Enter contract information, signer details, and any custom terms
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold">
                2
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">Send for Signature</h3>
              <p className="text-muted-foreground">
                We automatically create and send the contract via DocuSign
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold">
                3
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">Get Signed Contract</h3>
              <p className="text-muted-foreground">
                Receive the fully executed contract once all parties have signed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6" />
                <span className="text-xl font-bold">DocuFlow</span>
              </div>
              <p className="text-primary-foreground/70">
                Streamline your contract process with secure digital signatures.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Product</h4>
              <ul className="text-primary-foreground/70 space-y-2">
                <li>
                  <Link href="#" className="hover:text-primary-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-foreground transition-colors">
                    Templates
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Support</h4>
              <ul className="text-primary-foreground/70 space-y-2">
                <li>
                  <Link href="#" className="hover:text-primary-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-foreground transition-colors">
                    API Docs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Legal</h4>
              <ul className="text-primary-foreground/70 space-y-2">
                <li>
                  <Link href="#" className="hover:text-primary-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-foreground transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-border text-primary-foreground/70 mt-8 border-t pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} DocuFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
