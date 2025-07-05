import { NextResponse } from 'next/server'
import { DocuSignClient } from '@/lib/docusign-client'

export async function GET() {
  try {
    const docusignClient = new DocuSignClient()
    const result = await docusignClient.testConnection()

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('DocuSign test error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Test failed with exception',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
