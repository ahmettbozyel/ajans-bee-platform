# Dinamik Olmayan Yerler Raporu

> Tarih: 2025-12-31
> Durum: Mock/Hardcoded veri kullanan tüm yerler

---

## YÜKSEK ÖNCELİK

### 1. Görseller Sayfası (`/gorseller`)

**Dosya:** `src/app/(dashboard)/gorseller/page.tsx`
**Satırlar:** 35-51

**Sorun:** `MOCK_FILES` sabiti ile 12 adet sahte dosya verisi

```typescript
const MOCK_FILES = [
  // 4 logo varyasyonu
  // 5 ürün görseli
  // 3 örnek sosyal medya postu
]
```

**Durum:** KRİTİK - Supabase entegrasyonu yok
**Aksiyon:**
- `customer_files` tablosundan veri çekilmeli
- Dosya URL'leri `#` yerine gerçek Supabase Storage URL'leri olmalı

---

### 2. İçerik Üret Sayfası (`/icerik-uret`)

**Dosya:** `src/app/(dashboard)/icerik-uret/page.tsx`

#### Mock URL Data (Satır 33-39)
```typescript
const mockUrlData = {
  url: "https://example.com/urun/premium-sizma-zeytinyagi",
  title: "Yeni Ürün: Premium Sızma Zeytinyağı",
  description: "...",
  image: "https://images.unsplash.com/..."
}
```

#### Mock Generated Content (Satır 42-55)
```typescript
const mockGeneratedContent = `
🫒 Doğanın En Saf Hali...
...
#zeytinyağı #organik ...
`
```

**TODO Yorumları:**
- Satır 147: `// TODO: Replace with actual n8n webhook call`
- Satır 177: `// TODO: Replace with actual n8n webhook call`

**Durum:** PLACEHOLDER - n8n webhook entegrasyonu bekleniyor
**Aksiyon:**
- URL scraping için n8n webhook kurulmalı
- AI içerik üretimi için n8n webhook kurulmalı

---

### 3. Geçmiş Sayfası (`/gecmis`)

**Dosya:** `src/app/(dashboard)/gecmis/page.tsx`
**Satırlar:** 15-18

**Sorun:** Sayfa tamamen placeholder
```tsx
<p>🚧 Yapım Aşamasında</p>
```

**Durum:** TAMAMLANMAMIŞ
**Aksiyon:**
- `generated_content` tablosu oluşturulmalı
- Üretilen içeriklerin history'si gösterilmeli

---

## ORTA ÖNCELİK

### 4. Teknik Hizmetler Sayfası (`/teknik-hizmetler`)

**Dosya:** `src/app/(dashboard)/teknik-hizmetler/page.tsx`
**Satırlar:** 65-96

**Sorun:** Provider stilleri hardcoded
```typescript
const providerStyles = {
  siteground: { color: 'indigo', ... },
  natro: { color: 'amber', ... },
  veridyen: { color: 'emerald', ... },
  hostinger: { color: 'violet', ... }
}
```

**Durum:** KISMEN DİNAMİK
- Veriler API'den geliyor (`/api/technical-services`)
- Ama stiller hardcoded

**Aksiyon:**
- Kabul edilebilir (UI konfigürasyonu)
- İsteğe bağlı: Provider teması veritabanına taşınabilir

---

## DÜŞÜK ÖNCELİK (UI Konfigürasyonu)

### 5. Günlük İşler Sayfası

**Dosya:** `src/app/(dashboard)/gunluk-isler/page.tsx`
**Satırlar:** 440-454

```typescript
const gradientColors = [...] // 5 gradient
const brandGradients = [...] // 5 gradient
```

**Durum:** KABUL EDİLEBİLİR - UI renk konfigürasyonu

---

### 6. Müşteriler Sayfası

**Dosya:** `src/app/(dashboard)/musteriler/page.tsx`
**Satırlar:** 33-40

```typescript
const cardGradients = [...] // 6 gradient rengi
```

**Durum:** KABUL EDİLEBİLİR - UI çeşitliliği için

---

## TODO/FIXME YORUMLARI

| Dosya | Satır | Yorum |
|-------|-------|-------|
| `icerik-uret/page.tsx` | 147 | `// TODO: Replace with actual n8n webhook call` |
| `icerik-uret/page.tsx` | 177 | `// TODO: Replace with actual n8n webhook call` |
| `api/meta/sync/route.ts` | 72 | `// TODO: performance_ads tablosuna kaydet` |
| `ayarlar-tab.tsx` | 115 | `// TODO: n8n düzeltilince buraya gerçek sync eklenecek` |

---

## SUPABASE ENTEGRASYONU OLMAYAN SAYFALAR

| Sayfa | Durum |
|-------|-------|
| `/gorseller` | Supabase import yok, sadece MOCK_FILES |
| `/gecmis` | Hiç entegrasyon yok |
| `/icerik-uret` | Müşteri seçimi var, içerik üretimi mock |

---

## ÖZET TABLOSU

| Dosya | Tip | Öncelik | Aksiyon |
|-------|-----|---------|---------|
| `gorseller/page.tsx` | Mock Data (12 item) | YÜKSEK | Supabase files tablosu |
| `icerik-uret/page.tsx` | Mock URL + Content | YÜKSEK | n8n webhook kurulumu |
| `gecmis/page.tsx` | Placeholder | ORTA | History özelliği |
| `teknik-hizmetler/page.tsx` | Provider Styles | DÜŞÜK | Kabul edilebilir |
| `gunluk-isler/page.tsx` | UI Gradients | DÜŞÜK | Kabul edilebilir |
| `musteriler/page.tsx` | UI Gradients | DÜŞÜK | Kabul edilebilir |

---

## ÖNERİLER

### Acil (Bu Sprint)
1. `/gorseller` sayfasını `customer_files` tablosuna bağla
2. n8n webhooks kurulumu (URL scraping + AI generation)
3. `generated_content` tablosu oluştur

### Önemli
1. Dosya yükleme sistemi tamamla
2. Error handling ekle
3. Loading skeleton'lar ekle

### İsteğe Bağlı
1. Gradient renkleri merkezi tema dosyasına taşı
2. Provider stillerini veritabanına taşı
