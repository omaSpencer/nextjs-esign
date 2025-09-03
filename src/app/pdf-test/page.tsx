import PDFTest from '@/components/pdf-test';

export default function PDFTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            PDF Generátor Teszt
          </h1>
          <p className="text-gray-600">
            Tesztelje a PDF generálási funkciót egy egyszerű szerződés sablonnal
          </p>
        </div>
        
        <PDFTest />
        
        <div className="container mx-auto p-6 max-w-2xl mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Használati útmutató:</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Töltse ki az űrlapot a szükséges adatokkal</li>
              <li>• Kattintson a &quot;PDF Generálása&quot; gombra</li>
              <li>• A generált PDF letölthető a &quot;PDF Letöltése&quot; gombra kattintva</li>
              <li>• A PDF base64 formátumban is elérhető a komponens állapotában</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
