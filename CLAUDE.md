# CLAUDE CODE ÇALIŞMA KURALLARI

## KIRMIZI - HER ZAMAN SOR
1. Deploy (vercel deploy, git push origin main)
2. Database (Migration, tablo silme/değiştirme, Supabase schema)
3. Paket (npm install/uninstall/update)
4. Silme (Dosya veya klasör silme)
5. Environment (.env.local değişiklikleri)

## SARI - BILGI VER
- Yeni dosya oluşturma
- Mevcut component'te büyük değişiklik

## YEŞİL - SERBEST
- Bug fix, console.log, yorum ekleme, type düzeltme

## PROJE ÖZELLİKLERİ
- Çoklu dil: YOK
- AI entegrasyonu: VAR
- UI referans: /docs/UI-KIT.md

---

## GIT PROTOKOLÜ (OTOMATİK)

### İŞE BAŞLARKEN:
Claude Code her göreve başlamadan önce `git pull` çalıştırır.

### İŞ BİTİNCE:
Claude Code işi bitirince:
1. `git add .`
2. `git commit -m "açıklayıcı mesaj"`
3. `git push` - KULLANICIYA SOR (Kırmızı kural)

### CONFLICT DURUMUNDA:
- Durumu kullanıcıya açıkla
- Manuel çözüm için yardım iste

### 2 KİŞİLİK EKİP:
- Ahmet + Berk aynı repo'da çalışıyor
- Farklı dosyalarda çalışmak → OK
- Aynı dosyada çalışmak → CONFLICT riski
