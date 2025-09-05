import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'

export interface ContractData {
  name: string
  date: string
  companyName?: string
  contractValue?: string
}

export async function generateContractPDF(contractData: ContractData): Promise<string> {
  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)

  // 🔹 Font betöltése a /public/fonts mappából
  const fontBytes = await fetch('/fonts/Roboto-Regular.ttf').then((res) => res.arrayBuffer())
  const boldFontBytes = await fetch('/fonts/Roboto-Bold.ttf').then((res) => res.arrayBuffer())

  const font = await pdfDoc.embedFont(fontBytes)
  const boldFont = await pdfDoc.embedFont(boldFontBytes)

  const page = pdfDoc.addPage([595.28, 841.89])
  const { width, height } = page.getSize()
  const margin = 50
  const contentWidth = width - 2 * margin

  const titleText = 'Szerződés'
  const titleWidth = boldFont.widthOfTextAtSize(titleText, 24)
  const titleX = margin + (contentWidth - titleWidth) / 2

  page.drawText(titleText, {
    x: titleX,
    y: height - margin - 40,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  })

  // 🔹 Itt jönne a szerződés szöveg (placeholderekkel, tördeléssel, stb.)
  page.drawText(
    `Ez a szerződés ${contractData.name} és ${contractData.companyName ?? '________________'} között jön létre ${contractData.date} napján.`,
    {
      x: margin,
      y: height - margin - 100,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
      maxWidth: contentWidth,
    },
  )

  // Add signature placeholder
  page.drawText('Aláírás helye:', {
    x: margin,
    y: height - margin - 200,
    size: 12,
    font: font,
    color: rgb(0, 0, 0),
  })

  // Add signature line
  page.drawLine({
    start: { x: margin, y: height - margin - 220 },
    end: { x: margin + 200, y: height - margin - 220 },
    thickness: 1,
    color: rgb(0, 0, 0),
  })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes).toString('base64')
}

// Utility function to download PDF (for testing purposes)
export function downloadPDF(base64Data: string, filename: string = 'contract.pdf') {
  const link = document.createElement('a')
  link.href = `data:application/pdf;base64,${base64Data}`
  link.download = filename
  link.click()
}

// Example usage function
export async function createSampleContract(): Promise<string> {
  const sampleData: ContractData = {
    name: 'Kovács János',
    date: new Date().toLocaleDateString('hu-HU'),
    companyName: 'ABC Kft.',
    contractValue: '1,000,000 Ft',
  }

  return await generateContractPDF(sampleData)
}
