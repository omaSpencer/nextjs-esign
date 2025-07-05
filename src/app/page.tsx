import Hero from '@/blocks/hero'
import Features from '@/blocks/features'
import HowItWorks from '@/blocks/how-it-works'
import ContractForm from '@/blocks/contract-form'

import { DefaultLayout } from '@/layout/default'

export default function HomePage() {
  return (
    <DefaultLayout>
      <div className="from-primary/10 to-background min-h-screen bg-gradient-to-b">
        <div className="container mx-auto grid items-center gap-12 px-4 lg:grid-cols-2">
          <Hero />

          <section className="py-6 lg:py-12">
            <div className="bg-background rounded-2xl p-8 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-foreground mb-2 text-2xl font-bold">Create Your Contract</h2>
                <p className="text-foreground">
                  Fill out the details below and we&apos;ll send it for signature
                </p>
              </div>
              <ContractForm />
            </div>
          </section>
        </div>

        <Features />
      </div>
      <HowItWorks />
    </DefaultLayout>
  )
}
