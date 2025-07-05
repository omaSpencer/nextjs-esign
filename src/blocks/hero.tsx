import { Shield, CheckCircle } from 'lucide-react'

export default function Hero() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12">
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

            <div className="flex items-center space-x-6">
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
        </div>
      </div>
    </section>
  )
}
