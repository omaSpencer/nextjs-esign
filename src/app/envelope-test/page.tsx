import EnvelopeTest from '@/components/envelope-test';

export default function EnvelopeTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            DocuSign Envelope Teszt
          </h1>
          <p className="text-gray-600">
            Tesztelje a PDF generálást és DocuSign envelope létrehozást egy lépésben
          </p>
        </div>
        
        <EnvelopeTest />
        
        <div className="container mx-auto p-6 max-w-4xl mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Használati útmutató:</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• <strong>1. lépés:</strong> Töltse ki a szerződés adatait és generálja le a PDF-t</li>
              <li>• <strong>2. lépés:</strong> Adja meg az aláíró adatait és hozza létre az envelope-t</li>
              <li>• <strong>3. lépés:</strong> Kattintson az &quot;Aláírás megnyitása&quot; gombra a DocuSign aláírási felület megnyitásához</li>
              <li>• A PDF letölthető a &quot;PDF Letöltése&quot; gombra kattintva</li>
              <li>• Az envelope létrehozása után megjelenik az envelope ID és a státusz</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Fontos megjegyzések:</h3>
            <ul className="text-yellow-800 text-sm space-y-1">
              <li>• Az aláíró email címe valósnak kell lennie a teszteléshez</li>
              <li>• A DocuSign API kulcsoknak be kell lennie állítva a környezeti változókban</li>
              <li>• Az aláírási URL egy új ablakban nyílik meg</li>
              <li>• Az aláírás után a felhasználó az /after-signing oldalra kerül átirányításra</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
