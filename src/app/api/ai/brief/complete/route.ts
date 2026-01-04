import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

// Response schema
const BriefCompletionSchema = z.object({
  filled: z.record(z.string(), z.any()).describe('Boş alanlar için üretilen değerler'),
  suggestions: z.array(z.object({
    field: z.string(),
    current: z.any(),
    suggested: z.any(),
    reason: z.string()
  })).describe('Mevcut alanlar için iyileştirme önerileri')
})

export async function POST(req: NextRequest) {
  try {
    const { filledFields, emptyFields, websiteUrl } = await req.json()

    // Validation
    if (!filledFields?.name) {
      return NextResponse.json({ error: 'Marka adı zorunlu' }, { status: 400 })
    }

    const prompt = `Sen bir marka stratejisti ve içerik uzmanısın. Türkiye pazarı için çalışıyorsun.

MARKA BİLGİLERİ:
${JSON.stringify(filledFields, null, 2)}

${websiteUrl ? `Website: ${websiteUrl}` : ''}

GÖREV 1 - BOŞ ALANLARI DOLDUR:
Aşağıdaki boş alanları, mevcut bilgilere dayanarak mantıklı şekilde doldur:
${emptyFields.join(', ')}

GÖREV 2 - ÖNERİLER:
Dolu alanlar için iyileştirme önerileri sun. Sadece gerçekten faydalı olacak öneriler yap.

KURALLAR:
- Türkçe yaz
- Sektöre uygun ol
- Gerçekçi ve uygulanabilir öneriler ver
- Marka sesine (brand_voice) uygun içerik üret
- Array alanları için (brand_values, top_products vb.) array döndür
- String alanları için string döndür`

    const { object } = await generateObject({
      model: anthropic('claude-sonnet-4-5-20250514'),
      schema: BriefCompletionSchema,
      prompt,
    })

    return NextResponse.json(object)

  } catch (error) {
    console.error('Brief completion error:', error)
    return NextResponse.json(
      { error: 'Brief tamamlama başarısız' },
      { status: 500 }
    )
  }
}
