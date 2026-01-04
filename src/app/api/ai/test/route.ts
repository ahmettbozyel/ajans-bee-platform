import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 256,
        messages: [
          {
            role: 'user',
            content: 'Merhaba! Ben Ajans Bee platformundan test yapıyorum. Kısa bir Türkçe selam ver.'
          }
        ]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: data.error?.message || 'API hatası'
      }, { status: response.status })
    }

    return NextResponse.json({
      success: true,
      response: data.content[0].text,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
}
