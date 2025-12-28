# Teknik Hizmetler Modülü

Bu modül ajans müşterilerinin teknik hizmetlerini (hosting, domain, SSL, email) yönetmek için kullanılır.

## Özellikler

- ✅ Hizmet ekleme/düzenleme/silme
- ✅ Sağlayıcı bazlı fiyatlandırma
- ✅ Yenileme tarihi takibi
- ✅ İndirim hesaplama
- ✅ Modern UI (Yeni Marka Ekle stili)
- 🔄 Otomatik yenileme hatırlatıcı (yakında)

## Tablolar

- `technical_services` - Ana hizmet tablosu
- `service_providers` - Sağlayıcı ve fiyat bilgileri  
- `renewal_history` - Yenileme geçmişi

## API Endpoints

- `GET /api/technical-services` - Tüm hizmetleri listele
- `POST /api/technical-services` - Yeni hizmet ekle
- `PATCH /api/technical-services/[id]` - Hizmet güncelle
- `DELETE /api/technical-services/[id]` - Hizmet sil
