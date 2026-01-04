import { NextRequest, NextResponse } from 'next/server'

// Response type
interface BriefCompletionResult {
  filled: Record<string, any>
  suggestions: Array<{
    field: string
    current: any
    suggested: any
    reason: string
  }>
}

export async function POST(req: NextRequest) {
  try {
    const { filledFields, emptyFields, websiteUrl } = await req.json()

    // Validation
    if (!filledFields?.name) {
      return NextResponse.json({ error: 'Marka adı zorunlu' }, { status: 400 })
    }

    const systemPrompt = `Sen bir marka stratejisti ve içerik uzmanısın. Türkiye pazarı için çalışıyorsun.
Görevin:
1. Boş alanları mevcut bilgilere dayanarak mantıklı şekilde doldurmak
2. Dolu alanlar için iyileştirme önerileri sunmak

KURALLAR:
- Türkçe yaz
- Sektöre uygun ol
- Gerçekçi ve uygulanabilir öneriler ver
- Marka sesine (brand_voice) uygun içerik üret
- Array alanları için (brand_values, top_products, do_not_do) array döndür
- String alanları için string döndür

SADECE JSON FORMATINDA YANIT VER, başka hiçbir şey yazma.`

    const userPrompt = `MARKA BİLGİLERİ:
${JSON.stringify(filledFields, null, 2)}

${websiteUrl ? `Website: ${websiteUrl}` : ''}

DOLDURULMASI GEREKEN BOŞ ALANLAR:
${emptyFields.join(', ')}

Aşağıdaki JSON formatında yanıt ver:
{
  "filled": {
    // Boş alanlar için üretilen değerler
    // Örn: "slogan": "Üretilen slogan", "brand_values": ["değer1", "değer2"]
  },
  "suggestions": [
    // Mevcut dolu alanlar için iyileştirme önerileri (sadece gerçekten faydalı olanlar)
    {
      "field": "alan_adı",
      "current": "mevcut değer",
      "suggested": "önerilen değer",
      "reason": "öneri sebebi"
    }
  ]
}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250514',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: userPrompt }
        ],
        system: systemPrompt
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Anthropic API error:', errorData)
      return NextResponse.json(
        { error: 'AI servisi hatası' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const content = data.content?.[0]?.text

    if (!content) {
      return NextResponse.json(
        { error: 'AI yanıtı alınamadı' },
        { status: 500 }
      )
    }

    // JSON parse
    let result: BriefCompletionResult
    try {
      // Clean potential markdown code blocks
      const cleanedContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      result = JSON.parse(cleanedContent)
    } catch (parseError) {
      console.error('JSON parse error:', parseError, content)
      return NextResponse.json(
        { error: 'AI yanıtı işlenemedi' },
        { status: 500 }
      )
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Brief completion error:', error)
    return NextResponse.json(
      { error: 'Brief tamamlama başarısız' },
      { status: 500 }
    )
  }
}
