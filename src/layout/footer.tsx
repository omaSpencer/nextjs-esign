import { FileText } from 'lucide-react'
import Link from 'next/link'

export const Footer = () => {
  return (
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
  )
}
