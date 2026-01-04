import { NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store (production'da Redis kullanılmalı)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Temizlik için interval (5 dakikada bir eski kayıtları sil)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

interface RateLimitOptions {
  // Kaç istek izin verilecek
  limit: number
  // Kaç saniye içinde
  windowSeconds: number
  // Benzersiz anahtar (user_id veya IP)
  key: string
}

interface RateLimitResult {
  success: true
  remaining: number
}

interface RateLimitError {
  success: false
  response: NextResponse
}

/**
 * Rate limiting kontrolü
 * Başarısız olursa 429 Too Many Requests döner
 */
export function checkRateLimit(options: RateLimitOptions): RateLimitResult | RateLimitError {
  const { limit, windowSeconds, key } = options
  const now = Date.now()
  const windowMs = windowSeconds * 1000

  const entry = rateLimitStore.get(key)

  // Yeni veya süresi dolmuş giriş
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return { success: true, remaining: limit - 1 }
  }

  // Limit aşıldı
  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
    return {
      success: false,
      response: NextResponse.json(
        {
          error: 'Too Many Requests',
          message: `Rate limit aşıldı. ${retryAfter} saniye sonra tekrar deneyin.`,
          retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(entry.resetTime / 1000))
          }
        }
      )
    }
  }

  // Sayacı artır
  entry.count++
  return { success: true, remaining: limit - entry.count }
}

/**
 * AI endpoint'leri için rate limit (daha kısıtlayıcı)
 * Dakikada 10 istek, saatte 100 istek
 */
export function checkAIRateLimit(userId: string): RateLimitResult | RateLimitError {
  // Dakikalık limit
  const minuteCheck = checkRateLimit({
    key: `ai:minute:${userId}`,
    limit: 10,
    windowSeconds: 60
  })

  if (!minuteCheck.success) {
    return minuteCheck
  }

  // Saatlik limit
  const hourCheck = checkRateLimit({
    key: `ai:hour:${userId}`,
    limit: 100,
    windowSeconds: 3600
  })

  return hourCheck
}

/**
 * Genel API'ler için rate limit
 * Dakikada 60 istek
 */
export function checkAPIRateLimit(userId: string): RateLimitResult | RateLimitError {
  return checkRateLimit({
    key: `api:${userId}`,
    limit: 60,
    windowSeconds: 60
  })
}
