import PDFTest from '@/components/pdf-test'

export default function PDFTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">PDF Generátor Teszt</h1>
          <p className="text-gray-600">
            Tesztelje a PDF generálási funkciót egy egyszerű szerződés sablonnal
          </p>
        </div>

        <PDFTest />

        <div className="container mx-auto mt-8 max-w-2xl p-6">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">Használati útmutató:</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Töltse ki az űrlapot a szükséges adatokkal</li>
              <li>• Kattintson a &quot;PDF Generálása&quot; gombra</li>
              <li>• A generált PDF letölthető a &quot;PDF Letöltése&quot; gombra kattintva</li>
              <li>• A PDF base64 formátumban is elérhető a komponens állapotában</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
