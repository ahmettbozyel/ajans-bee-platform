# Claude Code Calisma Kurallari - Ajans Bee Platform

## KIRMIZI - HER ZAMAN SOR

Bu aksiyonlari YAPMADAN ONCE mutlaka onay al:

1. **Deploy** - vercel deploy, git push origin main
2. **Database** - Migration, tablo silme/degistirme, Supabase schema
3. **Paket** - npm install/uninstall/update
4. **Silme** - Dosya veya klasor silme
5. **Environment** - .env.local degisiklikleri

## SARI - BILGI VER

- Yeni dosya olustururken hangi klasore koyacagini soyle
- Component olustururken mevcut patterne uydugunu belirt

## YESIL - SERBEST

Bug fix, console.log, yorum, type duzeltme

## UI REFERANSI

Bu repodaki UI-KIT.md dosyasini kullan.

## PROJE OZELLIGI

- Coklu dil YOK
- AI entegrasyonu VAR (Anthropic Claude)
- Route groups: (auth), (dashboard)

---

## GIT PROTOKOLÜ (2 KİŞİLİK EKİP)

### HER İŞE BAŞLAMADAN ÖNCE:
```bash
git pull
```

### HER İŞ BİTİNCE:
```bash
git add .
git commit -m "açıklayıcı mesaj"
git push
```

### CONFLICT DURUMUNDA:
- Panik yapma
- Dosyayı manuel düzenleme
- Ahmet'e veya Claude'a danış

### AYNI ANDA ÇALIŞMA:
- Farklı dosyalarda çalışmak → OK
- Aynı dosyada çalışmak → CONFLICT riski
- Başlamadan önce ekibe haber ver
