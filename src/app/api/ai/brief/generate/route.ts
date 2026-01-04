import { NextRequest, NextResponse } from 'next/server'

// Brief Generator API - Basit versiyon
// Kullanıcı bilgi girer, Claude brief formatlar

const MASTER_PROMPT = `Sen bir dijital ajansın kıdemli Strateji Direktörüsün. Marka brief dokümanları hazırlama konusunda uzmanlaşmış, 15+ yıl deneyimli bir profesyonelsin.

## GÖREV
Sana verilen marka bilgilerini kullanarak kapsamlı bir MARKA BRİEF DOKÜMANI hazırla.

## BRIEF ŞABLONU (19 BÖLÜM)

Aşağıdaki 19 bölümü JSON formatında doldur. Bilgi yoksa mantıklı tahminler yap veya "Belirtilecek" yaz.

1. MARKA KİMLİĞİ: marka_adi, kurulus_yili, lokasyon, telefon, website, email, sektor, pazar, misyon, vizyon, slogan, degerler (5 adet)

2. HEDEF KİTLE: birincil (kim, yas, cinsiyet, lokasyon, gelir, karar_verici), ikincil, psikografik (4 adet), satin_alma_motivasyonlari (4 adet)

3. ÜRÜN VE HİZMETLER: ana_gruplar (kategorize), one_cikan_urunler (5 adet)

4. PAZAR VE REKABET: pazar_buyuklugu, buyume_orani, trendler, rakipler (3 adet - isim, website, guclu_yan, zayif_yan), rekabet_avantajlari (4 adet)

5. İLETİŞİM VE TON: dijital_varlik (platform, link, takipci), marka_sesi (4 özellik), ton (3 özellik), anahtar_mesajlar (3 adet), dil (birincil, ikincil, emoji), hashtag_stratejisi (marka, sektor, yerel)

6. GÖRSEL KİMLİK: logo, renk_paleti, font, gorsel_stil, referanslar, notlar

7. KANALLAR VE HEDEFLER: aktif_kanallar (kanal, amac, oncelik), reklam_butcesi, ana_hedefler (4 adet)

8. ÖNEMLİ NOTLAR: yapilmamasi_gerekenler (5 adet), yapilmasi_gerekenler (5 adet)

9. İLETİŞİM BİLGİLERİ: sirket, yetkili, telefon, email, adres

10. MEVSİMSEL İÇERİK TAKVİMİ: 6 dönem için içerik odağı

11. HOOK CÜMLELERİ BANKASI: soru_ile (3 adet), bilgi_ile (3 adet), direkt (3 adet)

12. MÜŞTERİ AĞRI NOKTALARI: pain_points (5 adet - problem, cozum)

13. CTA STANDARTLARI: instagram, facebook, linkedin, soft_cta, hard_cta

14. YASAK KELİMELER: kullanma (5 adet), alternatifler (5 adet)

15. ÖZEL GÜNLER TAKVİMİ: ay bazlı önemli günler ve içerik önerileri (12 ay)

16. İÇERİK SÜTUNLARİ: 5 adet content pillar (isim, aciklama, ornek_konular)

17. ÖRNEK CAPTION'LAR: iyi_ornekler (3 adet - platform, caption), kotu_ornek (caption, neden_kotu)

18. PLATFORM KURALLARI: instagram, facebook, linkedin, youtube (caption_uzunlugu, emoji, hashtag, cta, ton)

19. AYLIK POST DAĞILIMI: toplam, dagilim (6 kategori), yayin_gunleri, yayin_saatleri

## ÇIKTI FORMATI
Sadece JSON döndür, başka açıklama ekleme. JSON'u \`\`\`json ile sarmalama.`

interface BriefInput {
  marka_adi: string
  website?: string
  instagram?: string
  linkedin?: string
  facebook?: string
  youtube?: string
  sektor: string
  ek_bilgiler?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: BriefInput = await request.json()

    // Validasyon
    if (!body.marka_adi || !body.sektor) {
      return NextResponse.json({
        success: false,
        error: 'Marka adı ve sektör zorunludur'
      }, { status: 400 })
    }

    // Kullanıcı bilgilerini formatla
    const userInput = `
## MARKA BİLGİLERİ

- Marka Adı: ${body.marka_adi}
- Website: ${body.website || 'Belirtilmedi'}
- Instagram: ${body.instagram || 'Belirtilmedi'}
- LinkedIn: ${body.linkedin || 'Belirtilmedi'}
- Facebook: ${body.facebook || 'Belirtilmedi'}
- YouTube: ${body.youtube || 'Belirtilmedi'}
- Sektör: ${body.sektor}
${body.ek_bilgiler ? `- Ek Bilgiler: ${body.ek_bilgiler}` : ''}

Bu bilgileri kullanarak 19 bölümlük brief'i JSON formatında hazırla.
`

    // Claude API çağrısı
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 8000,
        system: MASTER_PROMPT,
        messages: [
          {
            role: 'user',
            content: userInput
          }
        ]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: data.error?.message || 'Claude API hatası'
      }, { status: response.status })
    }

    // JSON parse et
    let briefData
    try {
      const rawText = data.content[0].text
      briefData = JSON.parse(rawText)
    } catch {
      // JSON parse edilemezse raw text döndür
      return NextResponse.json({
        success: true,
        raw: true,
        brief: data.content[0].text,
        marka: body.marka_adi,
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: true,
      brief: briefData,
      marka: body.marka_adi,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
}
