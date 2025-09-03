import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export interface ContractData {
  name: string
  date: string
  companyName?: string
  contractValue?: string
}

export async function generateContractPDF(contractData: ContractData): Promise<string> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create()

  // Add a page
  let page = pdfDoc.addPage([595.28, 841.89]) // A4 size in points

  // Get the standard font - use Helvetica which has better Unicode support
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Set page dimensions
  const { width, height } = page.getSize()
  const margin = 50
  const contentWidth = width - 2 * margin

  // Title - center it manually since TextAlignment.Center was removed
  const titleText = 'Szerzodes'
  const titleWidth = font.widthOfTextAtSize(titleText, 24)
  const titleX = margin + (contentWidth - titleWidth) / 2

  page.drawText(titleText, {
    x: titleX,
    y: height - margin - 40,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
    maxWidth: contentWidth,
  })

  // Contract content
  const contractText = [
    'Ez a szerzodes (a "Szerzodes") a kovetkezo felek kozott jon letre:',
    '',
    '1. [[Nev]] (a "Szerzodo Fel")',
    '2. [[Ceg neve]] (a "Szerzodo Fel")',
    '',
    'A felek a kovetkezo felteteleket fogadjak el:',
    '',
    '1. SZERZODES TARGYA',
    'A Szerzodo Felek megallapodnak abban, hogy...',
    '',
    '2. SZERZODES IDOTARTAMA',
    'A Szerzodes [[Datum]] napjan lep hatalyba es...',
    '',
    '3. FIZETESI FELTETELEK',
    'A szerzodeses osszeg: [[Osszeg]]',
    '',
    '4. FELELOSSEG',
    'Minden felelosseg a vonatkozo jogszabalyok szerint...',
    '',
    '5. ALAIRAS',
    'A Szerzodo Felek alairasaval egyetertenek a fenti feltetelekkel.',
    '',
    'Alairas helye:',
    '',
    '_____________________',
    '[[Nev]] alairasa',
    'Datum: [[Datum]]',
    '',
    '_____________________',
    '[[Ceg neve]] alairasa',
    'Datum: [[Datum]]',
    '',
    '_____________________',
    'Tanu alairasa',
    'Datum: [[Datum]]',
  ]

  let currentY = height - margin - 80
  const lineHeight = 20

  // Draw contract text
  contractText.forEach((line) => {
    if (line.trim() === '') {
      currentY -= lineHeight / 2
      return
    }

    // Replace placeholders with actual data
    const displayText = line
      .replace('[[Nev]]', contractData.name)
      .replace('[[Datum]]', contractData.date)
      .replace('[[Ceg neve]]', contractData.companyName || '_________________')
      .replace('[[Osszeg]]', contractData.contractValue || '_________________')

    // Check if we need to add a new page
    if (currentY < margin + 100) {
      const newPage = pdfDoc.addPage([595.28, 841.89])
      currentY = height - margin - 40
      // Update the page reference for drawing
      page = newPage
    }

    // Determine font weight based on content
    const isBold =
      line.includes('SZERZŐDÉS') ||
      line.includes('Aláírás helye:') ||
      line.includes('_____________________') ||
      line.includes('aláírása')

    // Calculate text width to handle long lines properly
    const textWidth = (isBold ? boldFont : font).widthOfTextAtSize(displayText, isBold ? 12 : 11)
    
    // If text is too long, break it into multiple lines
    if (textWidth > contentWidth) {
      // Simple word wrapping - split by spaces and draw each part
      const words = displayText.split(' ')
      let currentLine = ''
      let tempY = currentY
      
      words.forEach((word, wordIndex) => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word
        const testWidth = (isBold ? boldFont : font).widthOfTextAtSize(testLine, isBold ? 12 : 11)
        
        if (testWidth > contentWidth && currentLine) {
          // Draw current line and start new one
          page.drawText(currentLine, {
            x: margin,
            y: tempY,
            size: isBold ? 12 : 11,
            font: isBold ? boldFont : font,
            color: rgb(0, 0, 0),
            maxWidth: contentWidth,
          })
          tempY -= lineHeight
          currentLine = word
        } else {
          currentLine = testLine
        }
        
        // Draw last line
        if (wordIndex === words.length - 1) {
          page.drawText(currentLine, {
            x: margin,
            y: tempY,
            size: isBold ? 12 : 11,
            font: isBold ? boldFont : font,
            color: rgb(0, 0, 0),
            maxWidth: contentWidth,
          })
          currentY = tempY - lineHeight
        }
      })
    } else {
      // Text fits on one line
      page.drawText(displayText, {
        x: margin,
        y: currentY,
        size: isBold ? 12 : 11,
        font: isBold ? boldFont : font,
        color: rgb(0, 0, 0),
        maxWidth: contentWidth,
      })
      currentY -= lineHeight
    }
  })

  // Add page numbers
  const pages = pdfDoc.getPages()
  pages.forEach((page, index) => {
    const { width } = page.getSize()
    page.drawText(`Oldal ${index + 1} / ${pages.length}`, {
      x: width - 80,
      y: 30,
      size: 10,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    })
  })

  // Convert PDF to bytes
  const pdfBytes = await pdfDoc.save()

  // Convert to base64
  const base64 = Buffer.from(pdfBytes).toString('base64')

  return base64
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
