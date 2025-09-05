import EnvelopeTest from '@/components/envelope-test'

export default function EnvelopeTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">DocuSign Envelope Teszt</h1>
          <p className="text-gray-600">
            Tesztelje a PDF generálást és DocuSign envelope létrehozást egy lépésben
          </p>
        </div>

        <EnvelopeTest />

        <div className="container mx-auto mt-8 max-w-4xl p-6">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">Használati útmutató:</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>
                • <strong>1. lépés:</strong> Töltse ki a szerződés adatait és generálja le a PDF-t
              </li>
              <li>
                • <strong>2. lépés:</strong> Adja meg az aláíró adatait és hozza létre az envelope-t
              </li>
              <li>
                • <strong>3. lépés:</strong> Kattintson az &quot;Aláírás megnyitása&quot; gombra a
                DocuSign aláírási felület megnyitásához
              </li>
              <li>• A PDF letölthető a &quot;PDF Letöltése&quot; gombra kattintva</li>
              <li>• Az envelope létrehozása után megjelenik az envelope ID és a státusz</li>
            </ul>
          </div>

          <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <h3 className="mb-2 font-semibold text-yellow-900">Fontos megjegyzések:</h3>
            <ul className="space-y-1 text-sm text-yellow-800">
              <li>• Az aláíró email címe valósnak kell lennie a teszteléshez</li>
              <li>• A DocuSign API kulcsoknak be kell lennie állítva a környezeti változókban</li>
              <li>• Az aláírási URL egy új ablakban nyílik meg</li>
              <li>• Az aláírás után a felhasználó az /after-signing oldalra kerül átirányításra</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
