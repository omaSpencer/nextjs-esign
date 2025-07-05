export default function HowItWorks() {
  return (
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
  )
}
