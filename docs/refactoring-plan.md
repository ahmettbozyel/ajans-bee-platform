# 🔧 REFACTORING PLANI - BÜYÜK DOSYALARI BÖLME

**Tarih:** 30 Aralık 2025
**Amaç:** Büyük component dosyalarını küçük, yönetilebilir parçalara bölmek
**KRİTİK:** Tasarım/UI kesinlikle değişmemeli, sadece kod organizasyonu

---

## ⚠️ MUTLAK KURALLAR

1. **HİÇBİR CSS/TAILWIND CLASS DEĞİŞMEYECEK**
2. **HİÇBİR JSX YAPISI DEĞİŞMEYECEK**
3. **SADECE DOSYA BÖLME YAPILACAK**
4. **HER ADIMDAN SONRA `npm run build` İLE TEST**
5. **HATA OLURSA DEVAM ETME, AHMET'E SOR**

---

## 📊 BÖLÜNECEK DOSYALAR (Öncelik Sırası)

| # | Dosya | Boyut | Öncelik |
|---|-------|-------|---------|
| 1 | customer-performance-tab.tsx | 82 KB | 🔴 Kritik |
| 2 | giris-cikis/page.tsx | 61 KB | 🔴 Kritik |
| 3 | customer-brief-form.tsx | 47 KB | 🟡 Yüksek |
| 4 | customer-view-mode.tsx | 40 KB | 🟡 Yüksek |

---

## 📁 HEDEF KLASÖR YAPISI

```
src/components/
├── customers/
│   ├── performance/
│   │   ├── index.tsx                    (ana orchestrator ~100 satır)
│   │   ├── types.ts                     (tüm tipler)
│   │   ├── constants.ts                 (sabit değerler)
│   │   ├── tabs/
│   │   │   ├── reklamlar-tab.tsx
│   │   │   ├── sosyal-medya-tab.tsx
│   │   │   ├── web-analytics-tab.tsx
│   │   │   └── ayarlar-tab.tsx
│   │   ├── cards/
│   │   │   ├── summary-cards.tsx
│   │   │   ├── ai-analysis-card.tsx
│   │   │   └── platform-card.tsx
│   │   └── modals/
│   │       ├── add-data-modal.tsx
│   │       └── report-modal.tsx
│   │
│   ├── brief-form/
│   │   ├── index.tsx                    (ana form ~150 satır)
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   ├── sections/
│   │   │   ├── brand-identity-section.tsx
│   │   │   ├── target-audience-section.tsx
│   │   │   ├── products-section.tsx
│   │   │   ├── competitors-section.tsx
│   │   │   ├── rules-section.tsx
│   │   │   └── special-days-section.tsx
│   │   └── shared/
│   │       ├── section-accordion.tsx
│   │       └── form-field.tsx
│   │
│   ├── view-mode/
│   │   ├── index.tsx
│   │   ├── types.ts
│   │   ├── sections/
│   │   │   ├── brand-overview.tsx
│   │   │   ├── audience-section.tsx
│   │   │   ├── products-section.tsx
│   │   │   └── ...
│   │   └── shared/
│   │       └── info-card.tsx
│   │
│   └── [eski dosyalar silinecek sonra]

src/app/(dashboard)/
├── giris-cikis/
│   ├── page.tsx                         (sadece layout ~50 satır)
│   ├── components/
│   │   ├── check-in-section.tsx
│   │   ├── today-records.tsx
│   │   ├── monthly-summary.tsx
│   │   ├── history-section.tsx
│   │   ├── leaderboard.tsx
│   │   └── manual-entry-modal.tsx       (mevcut, taşınacak)
│   ├── hooks/
│   │   └── use-attendance.ts
│   ├── utils/
│   │   └── calculations.ts              (mesafe, geç kalma hesapları)
│   └── types.ts
```

---

## 🔄 BÖLME ADIMLARI (Her dosya için)

### Adım 1: Analiz
```bash
# Dosyayı oku, bölümleri belirle
# Örnek: customer-performance-tab.tsx içinde
# - Header bölümü (satır 30-70)
# - Summary Cards (satır 71-150)
# - Tab Navigation (satır 151-200)
# - Reklamlar Tab (satır 201-500)
# - ...
```

### Adım 2: Types dosyası oluştur
```typescript
// types.ts - Tüm interface'leri buraya taşı
export interface CustomerPerformanceTabProps {
  customer: Customer
  onUpdate?: () => void
}

export type PerformanceTab = 'reklamlar' | 'sosyal-medya' | 'web-analytics' | 'ayarlar'
// ...
```

### Adım 3: Constants dosyası oluştur
```typescript
// constants.ts - Sabit değerler
export const OFFICE_LOCATION = { lat: 38.450468, lng: 27.186318, radius: 100 }
export const WORK_HOURS = { start: '09:00', end: '18:30' }
// ...
```

### Adım 4: Utility functions ayır
```typescript
// utils/calculations.ts
export function calculateDistance(lat1, lng1, lat2, lng2): number { ... }
export function calculateLateMinutes(checkInTime: Date): number { ... }
```

### Adım 5: Sub-component'leri oluştur
```typescript
// tabs/reklamlar-tab.tsx
'use client'
import { ... } from '../types'

interface ReklamlarTabProps {
  customer: Customer
  // gerekli props
}

export function ReklamlarTab({ customer }: ReklamlarTabProps) {
  // AYNI JSX, sadece farklı dosyada
  return (
    <div className="...">  {/* AYNI CLASS'LAR */}
      ...
    </div>
  )
}
```

### Adım 6: Ana dosyayı orchestrator yap
```typescript
// index.tsx
'use client'
import { ReklamlarTab } from './tabs/reklamlar-tab'
import { SosyalMedyaTab } from './tabs/sosyal-medya-tab'
import { SummaryCards } from './cards/summary-cards'
// ...

export function CustomerPerformanceTab({ customer, onUpdate }) {
  const [activeTab, setActiveTab] = useState<PerformanceTab>('reklamlar')
  
  return (
    <div className="space-y-6">
      <Header />
      <SummaryCards customer={customer} />
      <TabNavigation activeTab={activeTab} onChange={setActiveTab} />
      
      {activeTab === 'reklamlar' && <ReklamlarTab customer={customer} />}
      {activeTab === 'sosyal-medya' && <SosyalMedyaTab customer={customer} />}
      {/* ... */}
    </div>
  )
}
```

### Adım 7: Test
```bash
npm run build
# Hata yoksa devam
# Hata varsa DURUR, düzelt
```

### Adım 8: Import'ları güncelle
```typescript
// Eski: import { CustomerPerformanceTab } from '@/components/customers/customer-performance-tab'
// Yeni: import { CustomerPerformanceTab } from '@/components/customers/performance'
```

---

## ✅ KONTROL LİSTESİ (Her dosya için)

- [ ] Orijinal dosyanın backup'ı alındı mı?
- [ ] types.ts oluşturuldu mu?
- [ ] constants.ts oluşturuldu mu?
- [ ] Sub-component'ler oluşturuldu mu?
- [ ] Ana index.tsx orchestrator olarak yazıldı mı?
- [ ] Tüm import'lar güncellendi mi?
- [ ] `npm run build` başarılı mı?
- [ ] UI tarayıcıda test edildi mi?
- [ ] Eski dosya silindi mi? (en son)

---

## 🚫 YAPILMAYACAKLAR

1. ❌ Tailwind class'larını değiştirme
2. ❌ Component yapısını değiştirme (div → section gibi)
3. ❌ Yeni UI öğesi ekleme
4. ❌ State yönetimini değiştirme (useState kalacak)
5. ❌ API çağrılarını değiştirme
6. ❌ Birden fazla dosyayı aynı anda bölme

---

## 📝 İŞ SIRASI

### Gün 1: customer-performance-tab.tsx
1. Dosyayı analiz et, bölümleri belirle
2. `src/components/customers/performance/` klasörünü oluştur
3. types.ts yaz
4. Her tab için ayrı dosya oluştur
5. Test et

### Gün 2: giris-cikis/page.tsx
1. Utility fonksiyonları ayır
2. Her section için component oluştur
3. Custom hook yaz (useAttendance)
4. Test et

### Gün 3: customer-brief-form.tsx
1. Section'ları ayır (6 bölüm = 6 dosya)
2. Shared component'leri çıkar
3. Test et

### Gün 4: customer-view-mode.tsx
1. Benzer yaklaşım
2. Test et

---

## 🔑 ÖNEMLİ NOTLAR

1. **State lifting:** Eğer sub-component state'e ihtiyaç duyuyorsa, parent'tan prop olarak al
2. **Callback'ler:** onChange, onSave gibi fonksiyonları prop olarak geçir
3. **cn() kullanımı:** `import { cn } from '@/lib/utils'` her dosyada olmalı
4. **'use client':** İnteraktif component'lerin başında olmalı

---

**Bu planı takip et, adım adım ilerle, her adımda test et.**
