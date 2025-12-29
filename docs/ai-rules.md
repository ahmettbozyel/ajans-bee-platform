# 🐝 AI RULES - Ajans Bee Platform

**Amaç:** Claude Desktop bu dosyayı okuyarak proje kurallarını öğrenir.
**Konum:** `docs/ai-rules.md`
**Son Güncelleme:** 29 Aralık 2025

---

## ✏️ DOSYA DÜZENLEME KURALLARI

### Küçük Değişiklik (1-10 satır)
**str_replace kullan** - Tüm dosyayı yeniden yazma!
```
str_replace:
  old_str: "değişecek satır"
  new_str: "yeni satır"
```

### Büyük Değişiklik (>10 satır veya yeni dosya)
- `create_or_update_file` kullan

### YASAK
- Tek satır için 36KB dosya yazmak
- Gereksiz network kullanımı
- Zaman kaybı

---

## 🔧 CODING STANDARDS (Emre Mirası)

### TypeScript
- `any` YASAK
- Type assertion: `(res.data || []) as ServiceRow[]`
- Zod validation her API route'unda ZORUNLU

### API Route Yapısı
```typescript
// 1. Auth kontrolü (İLK İŞ)
const { data: { user } } = await supabase.auth.getUser()
if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

// 2. Zod validation
const parsed = schema.safeParse(body)
if (!parsed.success) return Response.json({ error: parsed.error }, { status: 400 })

// 3. Yetki kontrolü
// 4. İşlem
```

### Component Kuralları
- Küçük tut, tek sorumluluk
- shadcn/ui kullan
- Mobile-first responsive

### Environment Variables
- Hassas bilgiler ASLA hardcode
- `process.env.X` kullan

---

## 🎨 DESIGN TOKENS (Defne Mirası)

### Renkler
| Renk | HEX | Kullanım |
|------|-----|----------|
| Bee Yellow | #FFD600 | Logo, premium |
| Indigo | #6366f1 | Primary |
| Violet | #8b5cf6 | Secondary |
| Emerald | #10b981 | Success |
| Rose | #f43f5e | Danger |
| Fuchsia | #d946ef | AI |

### Background
- Dark: #09090b
- Light: #f8fafc

### Tipografi
- Genel: Inter
- Teknik (sayılar, kod): JetBrains Mono

### Layout
- Sidebar: w-72 (288px)
- Card padding: p-5
- Border radius: rounded-2xl
- Glow border: 8 varyant (indigo, violet, cyan, emerald, amber, rose, fuchsia, bee)

### Progress Renkleri
| Yüzde | Renk |
|-------|------|
| 0-30% | Rose |
| 31-70% | Amber |
| 71-99% | Cyan |
| 100% | Emerald |

### Component Checklist
- [ ] Dark mode stili var mı?
- [ ] Light mode stili var mı?
- [ ] Hover efekti var mı?
- [ ] Renk paleti doğru mu?

---

## ⚡ N8N KURALLARI (Zeynep Mirası)

### Kritik Kural
- **ASLA HTTP Request kullanma** (Türkçe karakter hatası)
- **Native node kullan** (Anthropic, Perplexity)

### Model İsimleri (ASLA UYDURMA)
```
Claude:
- claude-sonnet-4-20250514 (Sonnet 4)
- claude-sonnet-4-5-20250929 (Sonnet 4.5)
- claude-opus-4-5-20251101 (Opus 4.5 - production)

Perplexity:
- Sonar (hızlı)
- Sonar Pro (orta)
- Sonar Deep Research (production)
```

### Ayarlar
- Max Tokens: 16000 (uzun JSON için)
- Simplify Output: ON
- Retry: 2 deneme, 3sn bekleme
- Timeout: 120sn

### MCP Supervisor
- Endpoint: https://n8n.beeswebsite.com/mcp/supervisor
- Scope: READ-ONLY

---

## 📝 PROMPT KURALLARI (Elif Mirası)

### Format
- Claude: XML tags (`<context>`, `<instructions>`, `<o>`)
- Output: Saf JSON (prefill tekniği ile)

### Prefill Tekniği
Assistant mesajına `{` başlangıcı ekle → %100 temiz JSON

### Maliyet
- Opus: ~$0.50-1.00/istek (1 kerelik araştırma)
- Sonnet: ~$0.005/istek (günlük üretim)

---

## 🚫 YASAKLAR

1. GPT, Gemini kullanma (SADECE Claude)
2. `any` type kullanma
3. HTTP Request ile AI API çağırma
4. Hardcode credentials
5. Auth kontrolsüz API route
6. **Küçük değişiklik için tüm dosyayı yazmak**

---

## ✅ HER İŞ BAŞLARKEN

1. Bu dosyayı oku
2. Mevcut kodu/yapıyı kontrol et (MCP ile)
3. Riskleri söyle
4. "Emin misin?" de
5. Sonra başla

---

*Bu dosya projede durur, Claude Desktop MCP ile okur.*
