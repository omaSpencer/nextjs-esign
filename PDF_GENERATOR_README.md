# PDF Generátor - Szerződés Sablon

Ez a projekt egy PDF generálási rendszert tartalmaz a `pdf-lib` könyvtár segítségével, amely egyszerű szerződési sablonokat hoz létre.

## Funkciók

- **PDF Generálás**: Statikus szerződési sablon létrehozása
- **Placeholder Helyettesítés**: Dinamikus adatok beillesztése ([[Név]], [[Dátum]], stb.)
- **Aláírás Helyek**: Előre definiált aláírási mezők
- **Base64 Export**: A generált PDF base64 formátumban elérhető
- **Automatikus Oldalszámozás**: Több oldalas dokumentumok támogatása

## Telepítés

A `pdf-lib` könyvtár már telepítve van a projektben:

```bash
npm install pdf-lib
```

## Használat

### 1. Alapvető PDF Generálás

```typescript
import { generateContractPDF, ContractData } from '@/lib/pdf-generator';

const contractData: ContractData = {
  name: 'Kovács János',
  date: '2024-01-15',
  companyName: 'ABC Kft.',
  contractValue: '1,000,000 Ft'
};

const base64PDF = await generateContractPDF(contractData);
```

### 2. API Endpoint Használata

```typescript
// POST /api/pdf
const response = await fetch('/api/pdf', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(contractData)
});

const result = await response.json();
const base64PDF = result.base64;
```

### 3. Teszt Oldal

A `/pdf-test` útvonalon elérhető egy interaktív teszt felület:

- Adatok megadása
- PDF generálása
- Letöltés
- Base64 adatok megjelenítése

## Szerződési Sablon

A generált PDF a következő részeket tartalmazza:

1. **Cím**: "Szerződés"
2. **Felek**: Szerződő felek azonosítása
3. **Feltételek**: Szerződési feltételek
4. **Aláírási Helyek**: 
   - Szerződő fél aláírása
   - Cég aláírása
   - Tanú aláírása

## Placeholder-ek

A sablon a következő placeholder-eket használja:

- `[[Nev]]` - Szerződő fél neve
- `[[Datum]]` - Szerződés dátuma
- `[[Ceg neve]]` - Cég neve (opcionális)
- `[[Osszeg]]` - Szerződéses összeg (opcionális)

## Fájl Struktúra

```
src/
├── lib/
│   └── pdf-generator.ts      # Fő PDF generálási logika
├── components/
│   └── pdf-test.tsx          # Teszt komponens
└── app/
    ├── api/pdf/
    │   └── route.ts          # API endpoint
    └── pdf-test/
        └── page.tsx          # Teszt oldal
```

## Technikai Részletek

- **PDF Formátum**: A4 méret (595.28 x 841.89 pont)
- **Betűtípusok**: Helvetica (normál és félkövér)
- **Színek**: Fekete szöveg, szürke oldalszámok
- **Margók**: 50 pont minden oldalon
- **Automatikus oldaltörés**: Hosszú tartalom esetén

## Hibakezelés

A rendszer a következő hibákat kezeli:

- Hiányzó kötelező adatok
- PDF generálási hibák
- API kommunikációs problémák

## Tesztelés

1. Indítsa el a fejlesztői szervert: `npm run dev`
2. Navigáljon a `/pdf-test` oldalra
3. Töltse ki az űrlapot
4. Generálja a PDF-et
5. Töltse le és ellenőrizze a tartalmat

## Következő Lépések

- [ ] Több sablon támogatása
- [ ] Kép beszúrása
- [ ] QR kód generálás
- [ ] Digitális aláírás támogatás
- [ ] Több nyelv támogatása
