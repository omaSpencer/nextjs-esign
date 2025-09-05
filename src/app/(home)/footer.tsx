import { FileText, Shield, CheckCircle, Loader2 } from 'lucide-react'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const ContractFooter = ({
  handleSubmit,
  isSubmitting,
  personalDetails,
}: {
  handleSubmit: () => void
  isSubmitting: boolean
  personalDetails: Record<string, string>
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground text-lg font-semibold">
          Electronic Signature
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          By clicking &quot;Send for Signature&quot;, you agree to the terms and conditions outlined
          above
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <FileText className="text-foreground h-5 w-5" />
            </div>
            <div>
              <p className="text-foreground font-medium">Ready to Sign</p>
              <p className="text-muted-foreground text-sm">
                Document will be sent via DocuSign for electronic signature
              </p>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !personalDetails.firstName ||
              !personalDetails.lastName ||
              !personalDetails.email
            }
            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-48 px-8"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Sending...' : 'Send for Signature'}
          </Button>
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="text-muted-foreground flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>ESIGN Act Compliant</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>Legally Binding</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
