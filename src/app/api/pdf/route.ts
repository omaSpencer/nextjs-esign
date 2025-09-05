import { NextRequest, NextResponse } from 'next/server'
import { generateContractPDF, ContractData } from '@/lib/pdf-generator'

export async function POST(request: NextRequest) {
  try {
    const body: ContractData = await request.json()

    // Validate required fields
    if (!body.name || !body.date) {
      return NextResponse.json({ error: 'Név és dátum megadása kötelező!' }, { status: 400 })
    }

    // Generate PDF
    const base64PDF = await generateContractPDF(body)

    // Return the base64 PDF data
    return NextResponse.json({
      success: true,
      base64: base64PDF,
      message: 'PDF sikeresen generálva',
    })
  } catch (error) {
    console.error('PDF generálási hiba:', error)
    return NextResponse.json({ error: 'Hiba történt a PDF generálása során' }, { status: 500 })
  }
}

export async function GET() {
  // Sample data for testing
  const sampleData: ContractData = {
    name: 'Teszt Felhasználó',
    date: new Date().toLocaleDateString('hu-HU'),
    companyName: 'Teszt Kft.',
    contractValue: '500,000 Ft',
  }

  try {
    const base64PDF = await generateContractPDF(sampleData)

    return NextResponse.json({
      success: true,
      base64: base64PDF,
      message: 'Teszt PDF sikeresen generálva',
      sampleData,
    })
  } catch (error) {
    console.error('Teszt PDF generálási hiba:', error)
    return NextResponse.json(
      { error: 'Hiba történt a teszt PDF generálása során' },
      { status: 500 },
    )
  }
}
