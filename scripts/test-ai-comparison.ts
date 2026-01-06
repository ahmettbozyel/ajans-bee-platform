/**
 * Claude vs Perplexity+Claude Karşılaştırma Testi
 *
 * Test: Abant Lotus Hotel için brief tamamlama
 *
 * Çalıştırmak için:
 * npx tsx scripts/test-ai-comparison.ts
 */

import * as fs from 'fs'
import * as path from 'path'

// .env.local dosyasını manuel oku
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8')
    content.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=["']?(.+?)["']?$/)
      if (match) {
        process.env[match[1].trim()] = match[2].trim()
      }
    })
  }
}
loadEnv()

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY

// Test verisi: Abant Lotus Hotel
const testBrand = {
  name: 'Abant Lotus Hotel',
  website_url: 'https://abantlotus.com',
  sector: 'Otelcilik',
  customer_type: 'retainer'
}

const emptyFields = ['slogan', 'brand_values', 'target_audience', 'target_age_range', 'top_products', 'do_not_do']

// ============== CLAUDE ONLY ==============
async function testClaudeOnly(): Promise<{ result: any; duration: number }> {
  const startTime = Date.now()

  const systemPrompt = `Sen bir marka stratejisti ve içerik uzmanısın. Türkiye pazarı için çalışıyorsun.
Görevin:
1. Boş alanları mevcut bilgilere dayanarak mantıklı şekilde doldurmak
2. Dolu alanlar için iyileştirme önerileri sunmak

KURALLAR:
- Türkçe yaz
- Sektöre uygun ol
- Gerçekçi ve uygulanabilir öneriler ver
- Array alanları için (brand_values, top_products, do_not_do) array döndür
- String alanları için string döndür

SADECE JSON FORMATINDA YANIT VER, başka hiçbir şey yazma.`

  const userPrompt = `MARKA BİLGİLERİ:
${JSON.stringify(testBrand, null, 2)}

DOLDURULMASI GEREKEN BOŞ ALANLAR:
${emptyFields.join(', ')}

Aşağıdaki JSON formatında yanıt ver:
{
  "filled": {
    // Boş alanlar için üretilen değerler
  },
  "suggestions": []
}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt
    })
  })

  const data = await response.json()
  const content = data.content?.[0]?.text || ''

  let result
  try {
    const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    result = JSON.parse(cleanedContent)
  } catch {
    result = { error: 'JSON parse failed', raw: content }
  }

  return {
    result,
    duration: Date.now() - startTime
  }
}

// ============== PERPLEXITY RESEARCH ==============
async function perplexityResearch(): Promise<{ research: string; duration: number }> {
  const startTime = Date.now()

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [
        {
          role: 'system',
          content: 'Sen bir araştırma asistanısın. Verilen marka hakkında güncel ve doğru bilgiler topla.'
        },
        {
          role: 'user',
          content: `"${testBrand.name}" (${testBrand.website_url}) hakkında araştırma yap:

1. Otel hakkında genel bilgiler (konum, özellikler, yıldız sayısı)
2. Sunulan hizmetler ve tesisler
3. Hedef kitle profili
4. Rekabet avantajları ve öne çıkan özellikler
5. Müşteri yorumlarından çıkarımlar
6. Fiyat segmenti

Kısa ve öz bilgiler ver.`
        }
      ]
    })
  })

  // Debug için status kontrolü
  if (!response.ok) {
    const text = await response.text()
    console.log(`⚠️ Perplexity API Error (${response.status}):`, text.substring(0, 200))
    return {
      research: `API Error: ${response.status}`,
      duration: Date.now() - startTime
    }
  }

  const data = await response.json()
  const research = data.choices?.[0]?.message?.content || ''

  return {
    research,
    duration: Date.now() - startTime
  }
}

// ============== PERPLEXITY + CLAUDE ==============
async function testPerplexityPlusClaude(): Promise<{ result: any; duration: number; researchDuration: number }> {
  // Önce Perplexity ile araştırma
  const { research, duration: researchDuration } = await perplexityResearch()

  const startTime = Date.now()

  const systemPrompt = `Sen bir marka stratejisti ve içerik uzmanısın. Türkiye pazarı için çalışıyorsun.
Görevin:
1. Boş alanları mevcut bilgilere VE ARAŞTIRMA SONUÇLARINA dayanarak mantıklı şekilde doldurmak
2. Dolu alanlar için iyileştirme önerileri sunmak

KURALLAR:
- Türkçe yaz
- Sektöre uygun ol
- ARAŞTIRMA SONUÇLARINI MUTLAKA KULLAN
- Gerçekçi ve uygulanabilir öneriler ver
- Array alanları için (brand_values, top_products, do_not_do) array döndür
- String alanları için string döndür

SADECE JSON FORMATINDA YANIT VER, başka hiçbir şey yazma.`

  const userPrompt = `MARKA BİLGİLERİ:
${JSON.stringify(testBrand, null, 2)}

WEB ARAŞTIRMASI SONUÇLARI:
${research}

DOLDURULMASI GEREKEN BOŞ ALANLAR:
${emptyFields.join(', ')}

Aşağıdaki JSON formatında yanıt ver:
{
  "filled": {
    // Boş alanlar için üretilen değerler - ARAŞTIRMA SONUÇLARINI KULLAN
  },
  "suggestions": []
}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt
    })
  })

  const data = await response.json()
  const content = data.content?.[0]?.text || ''

  let result
  try {
    const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    result = JSON.parse(cleanedContent)
  } catch {
    result = { error: 'JSON parse failed', raw: content }
  }

  return {
    result,
    duration: Date.now() - startTime,
    researchDuration
  }
}

// ============== MAIN ==============
async function main() {
  console.log('\n' + '='.repeat(80))
  console.log('🧪 CLAUDE vs PERPLEXITY+CLAUDE KARŞILAŞTIRMA TESTİ')
  console.log('='.repeat(80))
  console.log(`\n📍 Test Markası: ${testBrand.name}`)
  console.log(`🌐 Website: ${testBrand.website_url}`)
  console.log(`📁 Sektör: ${testBrand.sector}`)
  console.log(`📝 Doldurulacak alanlar: ${emptyFields.join(', ')}`)
  console.log('\n' + '-'.repeat(80))

  // Test 1: Claude Only
  console.log('\n🔵 TEST 1: SADECE CLAUDE')
  console.log('-'.repeat(40))

  try {
    const claudeResult = await testClaudeOnly()
    console.log(`⏱️  Süre: ${claudeResult.duration}ms`)
    console.log('\n📋 Sonuç:')
    console.log(JSON.stringify(claudeResult.result, null, 2))
  } catch (error) {
    console.error('❌ Claude hatası:', error)
  }

  console.log('\n' + '-'.repeat(80))

  // Test 2: Perplexity + Claude
  console.log('\n🟣 TEST 2: PERPLEXITY + CLAUDE')
  console.log('-'.repeat(40))

  try {
    const perplexityResult = await testPerplexityPlusClaude()
    console.log(`⏱️  Perplexity araştırma süresi: ${perplexityResult.researchDuration}ms`)
    console.log(`⏱️  Claude işleme süresi: ${perplexityResult.duration}ms`)
    console.log(`⏱️  Toplam süre: ${perplexityResult.researchDuration + perplexityResult.duration}ms`)
    console.log('\n📋 Sonuç:')
    console.log(JSON.stringify(perplexityResult.result, null, 2))
  } catch (error) {
    console.error('❌ Perplexity+Claude hatası:', error)
  }

  console.log('\n' + '='.repeat(80))
  console.log('✅ Test tamamlandı!')
  console.log('='.repeat(80) + '\n')
}

main().catch(console.error)
