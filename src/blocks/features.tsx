import { Clock, Shield, FileText } from 'lucide-react'

export default function Features() {
  return (
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
  )
}
