'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateContractPDF, downloadPDF, ContractData } from '@/lib/pdf-generator';
import { DocuSignEnvelopeRequest } from '@/lib/docusign-envelope';

interface EnvelopeTestData extends ContractData {
  signerName: string;
  signerEmail: string;
  documentName?: string;
  emailSubject?: string;
  emailBlurb?: string;
}

export default function EnvelopeTest() {
  const [envelopeData, setEnvelopeData] = useState<EnvelopeTestData>({
    name: '',
    date: new Date().toLocaleDateString('hu-HU'),
    companyName: '',
    contractValue: '',
    signerName: '',
    signerEmail: '',
    documentName: 'Szerződés',
    emailSubject: 'Kérjük, írja alá ezt a dokumentumot',
    emailBlurb: 'Kérjük, tekintse át és írja alá a mellékelt dokumentumot.'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingEnvelope, setIsCreatingEnvelope] = useState(false);
  const [base64PDF, setBase64PDF] = useState<string>('');
  const [envelopeResult, setEnvelopeResult] = useState<{
    envelopeId: string;
    status: string;
    signingUrl: string;
    message: string;
  } | null>(null);

  const handleInputChange = (field: keyof EnvelopeTestData, value: string) => {
    setEnvelopeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGeneratePDF = async () => {
    if (!envelopeData.name.trim()) {
      alert('Kérjük, adja meg a nevet!');
      return;
    }

    setIsGenerating(true);
    try {
      const contractData: ContractData = {
        name: envelopeData.name,
        date: envelopeData.date,
        companyName: envelopeData.companyName,
        contractValue: envelopeData.contractValue
      };
      const base64 = await generateContractPDF(contractData);
      setBase64PDF(base64);
    } catch (error) {
      console.error('PDF generálási hiba:', error);
      alert('Hiba történt a PDF generálása során!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateEnvelope = async () => {
    if (!base64PDF) {
      alert('Először generálja le a PDF-t!');
      return;
    }

    if (!envelopeData.signerName.trim() || !envelopeData.signerEmail.trim()) {
      alert('Kérjük, adja meg az aláíró nevét és email címét!');
      return;
    }

    setIsCreatingEnvelope(true);
    try {
      const envelopeRequest: DocuSignEnvelopeRequest = {
        signerName: envelopeData.signerName,
        signerEmail: envelopeData.signerEmail,
        base64PDF: base64PDF,
        documentName: envelopeData.documentName,
        emailSubject: envelopeData.emailSubject,
        emailBlurb: envelopeData.emailBlurb
      };

      const response = await fetch('/api/envelope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(envelopeRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setEnvelopeResult(result);
    } catch (error) {
      console.error('Envelope létrehozási hiba:', error);
      alert('Hiba történt az envelope létrehozása során!');
    } finally {
      setIsCreatingEnvelope(false);
    }
  };

  const handleDownload = () => {
    if (base64PDF) {
      downloadPDF(base64PDF, `szerzodes_${envelopeData.name.replace(/\s+/g, '_')}.pdf`);
    }
  };

  const handleOpenSigning = () => {
    if (envelopeResult?.signingUrl) {
      window.open(`/envelope?url=${encodeURIComponent(envelopeResult.signingUrl)}`, '_blank');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PDF Generation Section */}
        <Card>
          <CardHeader>
            <CardTitle>1. PDF Szerződés Generálás</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Név *</Label>
              <Input
                id="name"
                value={envelopeData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Adja meg a nevét"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Dátum</Label>
              <Input
                id="date"
                type="date"
                value={envelopeData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Cég neve</Label>
              <Input
                id="companyName"
                value={envelopeData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Cég neve (opcionális)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractValue">Szerződéses összeg</Label>
              <Input
                id="contractValue"
                value={envelopeData.contractValue}
                onChange={(e) => handleInputChange('contractValue', e.target.value)}
                placeholder="Összeg (opcionális)"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleGeneratePDF} 
                disabled={isGenerating || !envelopeData.name.trim()}
                className="flex-1"
              >
                {isGenerating ? 'Generálás...' : 'PDF Generálása'}
              </Button>
              
              {base64PDF && (
                <Button 
                  onClick={handleDownload}
                  variant="outline"
                  className="flex-1"
                >
                  PDF Letöltése
                </Button>
              )}
            </div>

            {base64PDF && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  ✓ PDF sikeresen generálva!
                </p>
                <p className="text-green-600 text-xs mt-2">
                  Base64 hossz: {base64PDF.length} karakter
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Envelope Creation Section */}
        <Card>
          <CardHeader>
            <CardTitle>2. DocuSign Envelope Létrehozás</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signerName">Aláíró neve *</Label>
              <Input
                id="signerName"
                value={envelopeData.signerName}
                onChange={(e) => handleInputChange('signerName', e.target.value)}
                placeholder="Aláíró teljes neve"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signerEmail">Aláíró email címe *</Label>
              <Input
                id="signerEmail"
                type="email"
                value={envelopeData.signerEmail}
                onChange={(e) => handleInputChange('signerEmail', e.target.value)}
                placeholder="alairo@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentName">Dokumentum neve</Label>
              <Input
                id="documentName"
                value={envelopeData.documentName}
                onChange={(e) => handleInputChange('documentName', e.target.value)}
                placeholder="Dokumentum neve"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailSubject">Email tárgy</Label>
              <Input
                id="emailSubject"
                value={envelopeData.emailSubject}
                onChange={(e) => handleInputChange('emailSubject', e.target.value)}
                placeholder="Email tárgya"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailBlurb">Email szöveg</Label>
              <Input
                id="emailBlurb"
                value={envelopeData.emailBlurb}
                onChange={(e) => handleInputChange('emailBlurb', e.target.value)}
                placeholder="Email szövege"
              />
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleCreateEnvelope} 
                disabled={isCreatingEnvelope || !base64PDF || !envelopeData.signerName.trim() || !envelopeData.signerEmail.trim()}
                className="w-full"
              >
                {isCreatingEnvelope ? 'Envelope létrehozása...' : 'Envelope Létrehozása'}
              </Button>
            </div>

            {envelopeResult && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm font-semibold mb-2">
                  ✓ Envelope sikeresen létrehozva!
                </p>
                <div className="text-blue-700 text-xs space-y-1">
                  <p><strong>Envelope ID:</strong> {envelopeResult.envelopeId}</p>
                  <p><strong>Státusz:</strong> {envelopeResult.status}</p>
                  <p><strong>Üzenet:</strong> {envelopeResult.message}</p>
                </div>
                <Button 
                  onClick={handleOpenSigning}
                  className="mt-3 w-full"
                  variant="outline"
                >
                  Aláírás megnyitása
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
