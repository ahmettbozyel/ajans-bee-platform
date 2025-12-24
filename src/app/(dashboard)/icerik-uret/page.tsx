// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { 
  Link2, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronDown,
  Building2,
  ExternalLink,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSectorLabel, getBrandVoiceLabel, PLATFORMS } from '@/lib/constants'
import { addToRecentCustomers, getLastCustomerId } from '@/lib/local-storage'
import type { Customer } from '@/lib/types'

// Mock URL scraping data
const mockUrlData: Record<string, { title: string; description: string; image: string }> = {
  default: {
    title: 'Yeni Ürün: Premium Sızma Zeytinyağı',
    description: 'Ege\'nin en kaliteli zeytinlerinden üretilen, soğuk sıkım premium zeytinyağımız şimdi satışta. Doğal lezzet, sağlıklı yaşam.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'
  }
}

// Mock AI generated content
const mockGeneratedContent = `🫒 Doğanın armağanı, sofranızın yıldızı!

Ege'nin bereketli topraklarından gelen premium sızma zeytinyağımız ile tanışın. Her damlasında:

✨ %100 doğal, katkısız lezzet
🌿 Soğuk sıkım teknolojisi
💚 Sağlıklı yaşamın vazgeçilmezi

Aileniz için en iyisini seçin! 

🛒 Sipariş için link bio'da
📦 Türkiye'nin her yerine ücretsiz kargo

#zeytinyağı #sağlıklıyaşam #doğal #organik #egeden #premiumzeytinyağı #sofralık #mutfak #yemek`

export default function IcerikUretPage() {
  const searchParams = useSearchParams()
  const initialCustomerId = searchParams.get('customer')
  
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // URL scraping state
  const [url, setUrl] = useState('')
  const [urlData, setUrlData] = useState<{ title: string; description: string; image: string } | null>(null)
  const [urlLoading, setUrlLoading] = useState(false)
  const [urlError, setUrlError] = useState<string | null>(null)
  
  // Manual input state (fallback)
  const [manualTitle, setManualTitle] = useState('')
  const [manualDescription, setManualDescription] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  
  // Generation state
  const [generatedContent, setGeneratedContent] = useState('')
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // Selected platform
  const [selectedPlatform, setSelectedPlatform] = useState('instagram')

  const supabase = createClient()

  // Fetch customers
  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('name', { ascending: true })

        if (error) throw error
        setCustomers(data || [])

        // Auto-select customer from URL param or last used
        if (data && data.length > 0) {
          const targetId = initialCustomerId || getLastCustomerId()
          if (targetId) {
            const found = (data as Customer[]).find(c => c.id === targetId)
            if (found) {
              setSelectedCustomer(found)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching customers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [initialCustomerId])

  // Handle customer selection
  function handleSelectCustomer(customer: Customer) {
    setSelectedCustomer(customer)
    setCustomerSearchOpen(false)
    addToRecentCustomers({
      id: customer.id,
      name: customer.name,
      sector: customer.sector || ''
    })
  }

  // Fetch URL data (mock for now)
  async function handleFetchUrl() {
    if (!url.trim()) {
      setUrlError('URL giriniz')
      return
    }

    setUrlLoading(true)
    setUrlError(null)
    setUrlData(null)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For now, return mock data
      // TODO: Replace with actual n8n webhook call
      setUrlData(mockUrlData.default)
      setManualTitle(mockUrlData.default.title)
      setManualDescription(mockUrlData.default.description)
    } catch (error) {
      console.error('Error fetching URL:', error)
      setUrlError('URL bilgileri alınamadı. Manuel olarak girebilirsiniz.')
    } finally {
      setUrlLoading(false)
    }
  }

  // Generate content (mock for now)
  async function handleGenerate() {
    if (!selectedCustomer) {
      return
    }

    setGenerating(true)
    setGeneratedContent('')

    try {
      // Simulate streaming effect
      const content = mockGeneratedContent
      for (let i = 0; i <= content.length; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 20))
        setGeneratedContent(content.slice(0, i))
      }
      setGeneratedContent(content)
      
      // TODO: Replace with actual n8n webhook call
      // The webhook should receive:
      // - customer info (name, sector, tone_of_voice, target_audience)
      // - url data (title, description)
      // - additional notes
      // - platform
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setGenerating(false)
    }
  }

  // Copy to clipboard
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(generatedContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying:', error)
    }
  }

  // Clear all
  function handleClear() {
    setUrl('')
    setUrlData(null)
    setManualTitle('')
    setManualDescription('')
    setAdditionalNotes('')
    setGeneratedContent('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">İçerik Üret</h1>
        <p className="text-muted-foreground mt-1">
          AI ile sosyal medya içeriği oluşturun
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel - Input */}
        <div className="space-y-4">
          {/* Customer Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Müşteri Seç</CardTitle>
            </CardHeader>
            <CardContent>
              <Popover open={customerSearchOpen} onOpenChange={setCustomerSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={customerSearchOpen}
                    className="w-full justify-between"
                    disabled={loading}
                  >
                    {selectedCustomer ? (
                      <span className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {selectedCustomer.name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Müşteri seçin...</span>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Müşteri ara..." />
                    <CommandList>
                      <CommandEmpty>Müşteri bulunamadı.</CommandEmpty>
                      <CommandGroup>
                        {customers.map((customer) => (
                          <CommandItem
                            key={customer.id}
                            value={customer.name}
                            onSelect={() => handleSelectCustomer(customer)}
                          >
                            <Building2 className={cn(
                              "mr-2 h-4 w-4",
                              selectedCustomer?.id === customer.id ? "opacity-100" : "opacity-40"
                            )} />
                            <div className="flex-1">
                              <div>{customer.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {getSectorLabel(customer.sector || '')}
                              </div>
                            </div>
                            {selectedCustomer?.id === customer.id && (
                              <Check className="ml-2 h-4 w-4" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Selected customer info */}
              {selectedCustomer && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {getSectorLabel(selectedCustomer.sector || '')}
                    </Badge>
                    <Badge variant="outline">
                      {getBrandVoiceLabel(selectedCustomer.tone_of_voice || '')}
                    </Badge>
                  </div>
                  {selectedCustomer.target_audience && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Hedef: {selectedCustomer.target_audience}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* URL Input */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">İçerik Kaynağı</CardTitle>
              <CardDescription>
                URL girin veya bilgileri manuel doldurun
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="https://example.com/urun"
                    className="pl-9"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleFetchUrl} 
                  disabled={urlLoading || !url.trim()}
                >
                  {urlLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Çek
                    </>
                  )}
                </Button>
              </div>

              {urlError && (
                <p className="text-sm text-destructive">{urlError}</p>
              )}

              {/* URL Data Preview */}
              {urlLoading && (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              )}

              {urlData && !urlLoading && (
                <div className="p-3 border rounded-lg space-y-2">
                  {urlData.image && (
                    <img 
                      src={urlData.image} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded"
                    />
                  )}
                  <p className="font-medium text-sm">{urlData.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {urlData.description}
                  </p>
                </div>
              )}

              {/* Manual Input Fields */}
              <div className="space-y-3 pt-2 border-t">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm">
                    Başlık / Ürün Adı
                  </Label>
                  <Input
                    id="title"
                    placeholder="Ürün veya kampanya başlığı"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm">
                    Açıklama
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Ürün açıklaması, özellikler, fiyat bilgisi..."
                    value={manualDescription}
                    onChange={(e) => setManualDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm">
                    Ek Notlar (Opsiyonel)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Kampanya detayı, özel istekler..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((platform) => (
                  <Button
                    key={platform.value}
                    variant={selectedPlatform === platform.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPlatform(platform.value)}
                  >
                    {platform.icon} {platform.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleGenerate}
            disabled={!selectedCustomer || generating || (!manualTitle && !manualDescription)}
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Üretiliyor...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Post Üret
              </>
            )}
          </Button>
        </div>

        {/* Right Panel - Output */}
        <div className="space-y-4">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Üretilen İçerik</CardTitle>
                {generatedContent && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Temizle
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Kopyalandı
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Kopyala
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!generatedContent && !generating ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Henüz içerik üretilmedi.</p>
                  <p className="text-sm mt-1">
                    Müşteri seçin, bilgileri girin ve &quot;Post Üret&quot; butonuna tıklayın.
                  </p>
                </div>
              ) : (
                <Textarea
                  className="min-h-[400px] font-mono text-sm resize-none"
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  placeholder="İçerik burada görünecek..."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
