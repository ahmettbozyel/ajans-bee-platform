import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { text } = await generateText({
      model: anthropic('claude-3-5-haiku-20241022'),
      prompt: 'Merhaba! Ben Ajans Bee platformundan test yapıyorum. Kısa bir Türkçe selam ver.',
    })

    return NextResponse.json({
      success: true,
      response: text,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
}
