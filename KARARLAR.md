# Ajans Bee Platform - Kararlar ve Kurallar

> Son Güncelleme: 7 Ocak 2026

---

## 🗄️ Database Yapısı

### Tablo İsimlendirme
- App tabloları: `app_` prefix (örn: `app_technical_services`)
- Core tablolar: prefix yok (`customers`, `users`)
- CMS tabloları: `cms_` prefix (ayrı proje)
- View'lar: prefix yok (`daily_stats`, `upcoming_renewals`)

### customers Tablosu (12 alan)
```
id, created_at, updated_at, name, email, phone, notes, 
user_id, customer_type, billing_contact_name, 
billing_contact_email, billing_contact_phone
```

### Müşteri Tipleri (customer_type)
| Tip | Açıklama |
|-----|----------|
| `retainer` | Aktif - Aylık sözleşmeli müşteri |
| `project` | Aktif - Proje bazlı müşteri |
| `passive` | Pasif - Sadece teknik hizmet alan |

**Kural:** 
- Aktif müşteri = `customer_type IN ('retainer', 'project')`
- Pasif müşteriler de teknik hizmet alabilir

### Silinen Alanlar/Tablolar
- `customers.status` - gereksiz, customer_type yeterli
- `customers.brand_name` - name alanı kullanılıyor
- Brand Brain alanları (~50 alan) - AI projesine taşınacak
- `sectors`, `system_alerts`, `renewal_notifications` tabloları

---

## 📱 UI Yapısı

### Aktif Sayfalar
```
dashboard/         → Ana Sayfa
teknik-hizmetler/  → Hizmet Yönetimi
mesai/             → Mesai Takip
gorevler/          → Görev Yönetimi
ayarlar/           → Ayarlar
  ├── profil
  ├── kullanicilar
  └── musteriler   → Müşteri Yönetimi (Admin only)
```

### Silinen Sayfalar
- `/gecmis` - İçerik Üret geçmişi
- `/markalar` - Ayarlar/Müşteriler'e taşındı
- `/musteriler` - Ayarlar/Müşteriler'e taşındı
- `/customers` - Duplicate
- `/chat` - Kullanılmıyor
- `/icerik-uret` - AI projesine taşınacak
- `/gorseller` - Kullanılmıyor

### Müşteri Listeleme Kuralı
| Sayfa | Gösterilen Müşteriler |
|-------|----------------------|
| Ayarlar → Müşteriler | Default: Aktifler + Toggle ile pasifler |
| Teknik Hizmetler | Tüm müşteriler (filtre yok) |
| Görevler | Tüm müşteriler |

---

## ⚙️ n8n Workflow'ları

### Teknik Hizmet Yönetimi
- **Tetikleme:** Her gün 09:00
- **View:** `upcoming_renewals`
- **Mantık:** 30-7-1 gün kala bildirim (kademeli)
- **Gruplandırma:** Müşteri bazlı (name)
- **Fallback email:** ahmet.bozyel@ajansbee.com

### Günlük İstatistikler
- **Tetikleme:** Her gün 18:00
- **View:** `daily_stats`
- **İçerik:** Aktif hizmetler, yenilenecekler, gecikmiş, tahmini gelir

### Hata Bildirimi
- **Tetikleme:** Webhook
- **Endpoint:** POST /webhook/workflow-error
- **Aksiyon:** Direkt email (database log yok)

---

## 🔐 Yetki Kuralları

### Rol Yapısı
| Rol | Açıklama |
|-----|----------|
| Admin | Tam yetki |
| Operasyon | Günlük işlemler |
| Personel | Kısıtlı erişim |

### Müşteri Yönetimi
- **Görüntüleme:** Herkes (login olan)
- **Ekleme/Düzenleme/Silme:** Sadece Admin

### RLS (Row Level Security)
- ⚠️ Henüz aktif değil
- Proje sonunda implement edilecek

---

## 🚀 Gelecek Planları

### AI Projesi (app.beeswebsite.com)
- **Faz 1:** İç verimlilik - personel AI araçları
- **Faz 2:** Full platform - müşteri portali
- **Faz 3:** SaaS - diğer ajanslara satış

### Taşınacak Özellikler
- Brand Brain (müşteri detay bilgileri)
- İçerik Üret
- Görsel yönetimi

---

## 📝 Kod Kuralları

### Supabase Sorguları
- `brand_name` kullanma → `name` kullan
- `customers.status` yok → `customer_type` kullan
- Tablo adları `app_` prefix'li

### Müşteri Referansı
```typescript
// DOĞRU
brand:customers(id, name)
task.brand.name

// YANLIŞ
brand:customers(id, brand_name)
task.brand.brand_name
```

---

## 🔔 Bildirim Sistemi (Beklemede)

**Durum:** Devre dışı - `notifications` tablosu yok

**Aktif etmek için:**
```sql
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE TO authenticated
USING (user_id = auth.uid());
```

**Sonra:** `top-bar.tsx`'de `<NotificationBell />` yorum satırından çıkar

---

## 📅 Değişiklik Geçmişi

### 7 Ocak 2026
- Database temizliği (64 → 12 alan)
- UI temizliği (7 sayfa silindi)
- Müşteri tipi: retainer/project/passive
- n8n workflow'ları düzeltildi
- View'lar oluşturuldu (daily_stats, upcoming_renewals)
- `brand_name` → `name` geçişi tamamlandı
- NotificationBell devre dışı bırakıldı
- Supabase anon key düzeltildi (.env.local)
