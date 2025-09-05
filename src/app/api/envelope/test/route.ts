import { NextResponse } from 'next/server'
import { generateContractPDF } from '@/lib/pdf-generator'

export async function GET() {
  try {
    // Generate a sample contract PDF
    const contractData = {
      name: 'Teszt Felhasználó',
      date: new Date().toLocaleDateString('hu-HU'),
      companyName: 'Teszt Kft.',
      contractValue: '500,000 Ft',
    }

    const base64PDF = await generateContractPDF(contractData)

    return NextResponse.json({
      success: true,
      message: 'Test PDF generated successfully',
      base64PDF: base64PDF.substring(0, 100) + '...', // Show first 100 chars
      contractData,
      instructions: [
        'This endpoint generates a sample contract PDF',
        'Use the base64PDF data to test the envelope creation',
        'The PDF contains anchor text for signature positioning',
        'Call POST /api/envelope with the base64PDF to create a DocuSign envelope',
      ],
    })
  } catch (error) {
    console.error('Test PDF generation error:', error)
    return NextResponse.json({ error: 'Failed to generate test PDF' }, { status: 500 })
  }
}
