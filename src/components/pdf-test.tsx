'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { generateContractPDF, downloadPDF, ContractData } from '@/lib/pdf-generator'

export default function PDFTest() {
  const [contractData, setContractData] = useState<ContractData>({
    name: '',
    date: new Date().toLocaleDateString('hu-HU'),
    companyName: '',
    contractValue: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [base64PDF, setBase64PDF] = useState<string>('')

  const handleInputChange = (field: keyof ContractData, value: string) => {
    setContractData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleGeneratePDF = async () => {
    if (!contractData.name.trim()) {
      alert('Kérjük, adja meg a nevet!')
      return
    }

    setIsGenerating(true)
    try {
      const base64 = await generateContractPDF(contractData)
      setBase64PDF(base64)
    } catch (error) {
      console.error('PDF generálási hiba:', error)
      alert('Hiba történt a PDF generálása során!')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (base64PDF) {
      downloadPDF(base64PDF, `szerzodes_${contractData.name.replace(/\s+/g, '_')}.pdf`)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>PDF Szerződés Generátor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Név *</Label>
            <Input
              id="name"
              value={contractData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Adja meg a nevét"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Dátum</Label>
            <Input
              id="date"
              type="date"
              value={contractData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Cég neve</Label>
            <Input
              id="companyName"
              value={contractData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Cég neve (opcionális)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractValue">Szerződéses összeg</Label>
            <Input
              id="contractValue"
              value={contractData.contractValue}
              onChange={(e) => handleInputChange('contractValue', e.target.value)}
              placeholder="Összeg (opcionális)"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleGeneratePDF}
              disabled={isGenerating || !contractData.name.trim()}
              className="flex-1"
            >
              {isGenerating ? 'Generálás...' : 'PDF Generálása'}
            </Button>

            {base64PDF && (
              <Button onClick={handleDownload} variant="outline" className="flex-1">
                PDF Letöltése
              </Button>
            )}
          </div>

          {base64PDF && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm text-green-800">
                ✓ PDF sikeresen generálva! Kattintson a &quot;PDF Letöltése&quot; gombra a
                letöltéshez.
              </p>
              <p className="mt-2 text-xs text-green-600">
                Base64 hossz: {base64PDF.length} karakter
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
