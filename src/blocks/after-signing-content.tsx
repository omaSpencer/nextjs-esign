'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Clock, Download, Home, FileText, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { DefaultLayout } from '@/layout/default'

interface EnvelopeStatus {
  envelopeId: string
  status: string
  statusDateTime: string
  emailSubject: string
}

export default function AfterSigningContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [envelopeStatus, setEnvelopeStatus] = useState<EnvelopeStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const event = searchParams.get('event')
  const envelopeId = searchParams.get('envelopeId')

  useEffect(() => {
    if (envelopeId) {
      fetchEnvelopeStatus(envelopeId)
    } else {
      setLoading(false)
    }
  }, [envelopeId])

  const fetchEnvelopeStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/docusign/status/${id}`)
      if (response.ok) {
        const data = await response.json()
        setEnvelopeStatus(data)
      } else {
        setError('Failed to fetch envelope status')
      }
    } catch (err) {
      console.error(err)
      setError('Error fetching envelope status')
    } finally {
      setLoading(false)
    }
  }

  const getEventDetails = () => {
    switch (event) {
      case 'signing_complete':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-600" />,
          title: 'Document Signed Successfully!',
          message:
            'Thank you for signing the document. The contract has been completed and all parties will receive a copy.',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        }
      case 'signing_cancelled':
        return {
          icon: <XCircle className="h-16 w-16 text-red-600" />,
          title: 'Signing Cancelled',
          message:
            'The document signing process was cancelled. You can return to sign it later if needed.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        }
      case 'signing_declined':
        return {
          icon: <XCircle className="h-16 w-16 text-red-600" />,
          title: 'Document Declined',
          message: 'The document has been declined. The sender will be notified of your decision.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        }
      default:
        return {
          icon: <Clock className="h-16 w-16 text-blue-600" />,
          title: 'Document Status',
          message: 'Processing your document status...',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        }
    }
  }

  const eventDetails = getEventDetails()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
            <p className="text-foreground">Loading document status...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-2xl py-6 lg:py-10 xl:py-16">
        <Card className={`${eventDetails.bgColor} ${eventDetails.borderColor} border-2`}>
          <CardHeader className="pb-4 text-center">
            <div className="mb-4 flex justify-center">{eventDetails.icon}</div>
            <CardTitle className="text-foreground text-2xl font-bold">
              {eventDetails.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-foreground text-lg">{eventDetails.message}</p>

            {/* Envelope Details */}
            {envelopeStatus && (
              <div className="border-border bg-background rounded-lg border p-6">
                <h3 className="text-foreground mb-4 text-lg font-semibold">Document Details</h3>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Document:</span>
                    <span className="text-foreground">{envelopeStatus.emailSubject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Status:</span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        envelopeStatus.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : envelopeStatus.status === 'sent'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {envelopeStatus.status.charAt(0).toUpperCase() +
                        envelopeStatus.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Envelope ID:</span>
                    <span className="text-foreground font-mono text-sm">
                      {envelopeStatus.envelopeId}
                    </span>
                  </div>
                  {envelopeStatus.statusDateTime && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">Last Updated:</span>
                      <span className="text-foreground">
                        {new Date(envelopeStatus.statusDateTime).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-yellow-800">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col justify-center gap-4 pt-6 sm:flex-row">
              {event === 'signing_complete' && (
                <>
                  <Button className="flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Download Document</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                    <Mail className="h-4 w-4" />
                    <span>Email Copy</span>
                  </Button>
                </>
              )}

              {(event === 'signing_cancelled' || event === 'signing_declined') && (
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Create New Contract</span>
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Return Home</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="mt-8 text-center">
          <Card className="bg-gray-50">
            <CardContent className="p-6">
              <h3 className="text-foreground mb-3 text-lg font-semibold">What happens next?</h3>
              <div className="space-y-2 text-gray-700">
                {event === 'signing_complete' && (
                  <>
                    <p>✅ All parties will receive a copy of the signed document via email</p>
                    <p>✅ The document is legally binding and stored securely</p>
                    <p>✅ You can download a copy anytime from your email</p>
                  </>
                )}
                {event === 'signing_cancelled' && (
                  <>
                    <p>📧 The document sender will be notified of the cancellation</p>
                    <p>🔄 You can still sign the document if you change your mind</p>
                    <p>📞 Contact the sender if you have any questions</p>
                  </>
                )}
                {event === 'signing_declined' && (
                  <>
                    <p>📧 The document sender has been notified of your decision</p>
                    <p>📝 They may send a revised version if needed</p>
                    <p>📞 Contact the sender to discuss any concerns</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Section */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">Need help or have questions?</p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
            <Button variant="outline" size="sm">
              View FAQ
            </Button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
