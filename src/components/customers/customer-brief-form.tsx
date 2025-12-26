// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { 
  Building2, Globe, Users, Package, Target, ShieldCheck, Calendar,
  Instagram, Facebook, Linkedin, Youtube, Twitter, Download, Eye,
  Upload, X, FileText, Image as ImageIcon, Palette, Bot, AlertCircle,
  ChevronDown, ChevronRight, Copy, Check, MoreHorizontal, RefreshCw,
  Trash2, ExternalLink, Phone, Mail, MapPin, Heart, Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Customer, SocialMediaData, Competitor, SpecialEvent } from '@/lib/customer-types'
import { SECTORS, BRAND_VOICES, BUSINESS_TYPES, PRICE_SEGMENTS, calculateBriefCompletion } from '@/lib/customer-types'

// =====================================================
// TYPES
// =====================================================

interface BrandAsset {
  id: string
  name: string
  file_name: string
  file_type: string
  file_size: number
  url: string
  category: 'logo' | 'brand-guide' | 'corporate-identity' | 'other'
  created_at: string
}

interface CustomerViewModeProps {
  customer: Customer
  onEdit: () => void
  onAIRefresh?: () => void
  onDelete?: () => void
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function getSectorLabel(value: string): string {
  return SECTORS.find(s => s.value === value)?.label || value
}

function getBrandVoiceLabel(value: string): string {
  return BRAND_VOICES.find(v => v.value === value)?.label || value
}

function getBusinessTypeLabel(value: string): string {
  return BUSINESS_TYPES.find(t => t.value === value)?.label || value
}

function getPriceSegmentLabel(value: string): string {
  return PRICE_SEGMENTS.find(s => s.value === value)?.label || value
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function formatFollowers(count: number | undefined): string {
  if (!count) return '0'
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
  return count.toString()
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith('image/')) return <ImageIcon className="h-5 w-5" />
  if (fileType === 'application/pdf') return <FileText className="h-5 w-5" />
  return <FileText className="h-5 w-5" />
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'logo': 'Logo',
    'brand-guide': 'Brand Guide',
    'corporate-identity': 'Kurumsal Kimlik',
    'other': 'Diğer'
  }
  return labels[category] || category
}

// =====================================================
// EMPTY STATE COMPONENT
// =====================================================

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="text-muted-foreground/50 mb-3">
        {icon}
      </div>
      <p className="text-sm text-muted-foreground font-medium">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}

// =====================================================
// INFO CARD COMPONENT
// =====================================================

interface InfoCardProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  isEmpty?: boolean
  emptyMessage?: string
  onAddClick?: () => void
  className?: string
}

function InfoCard({ title, icon, children, isEmpty, emptyMessage, onAddClick, className }: InfoCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span className="text-muted-foreground">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <EmptyState
            icon={icon}
            title={emptyMessage || 'Henüz eklenmedi'}
            action={onAddClick && (
              <Button variant="outline" size="sm" onClick={onAddClick}>
                <Bot className="h-3 w-3 mr-1" />
                AI ile Bul
              </Button>
            )}
          />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}

// =====================================================
// SOCIAL MEDIA BADGE COMPONENT
// =====================================================

interface SocialBadgeProps {
  platform: string
  handle?: string
  followers?: number
}

function SocialBadge({ platform, handle, followers }: SocialBadgeProps) {
  if (!handle) return null

  const platformConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    instagram: { icon: <Instagram className="h-3.5 w-3.5" />, color: 'text-pink-600', bg: 'bg-pink-50 hover:bg-pink-100' },
    facebook: { icon: <Facebook className="h-3.5 w-3.5" />, color: 'text-blue-600', bg: 'bg-blue-50 hover:bg-blue-100' },
    linkedin: { icon: <Linkedin className="h-3.5 w-3.5" />, color: 'text-blue-700', bg: 'bg-blue-50 hover:bg-blue-100' },
    youtube: { icon: <Youtube className="h-3.5 w-3.5" />, color: 'text-red-600', bg: 'bg-red-50 hover:bg-red-100' },
    twitter: { icon: <Twitter className="h-3.5 w-3.5" />, color: 'text-sky-500', bg: 'bg-sky-50 hover:bg-sky-100' },
    tiktok: { icon: <Globe className="h-3.5 w-3.5" />, color: 'text-black', bg: 'bg-gray-100 hover:bg-gray-200' },
  }

  const config = platformConfig[platform] || platformConfig.tiktok

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-default",
      config.bg
    )}>
      <span className={config.color}>{config.icon}</span>
      <div className="flex flex-col">
        <span className="text-xs font-medium">{formatFollowers(followers)}</span>
        <span className="text-[10px] text-muted-foreground capitalize">{platform}</span>
      </div>
    </div>
  )
}

// =====================================================
// ASSET CARD COMPONENT
// =====================================================

interface AssetCardProps {
  asset: BrandAsset
  onDownload: (asset: BrandAsset) => void
  onPreview: (asset: BrandAsset) => void
  onDelete: (asset: BrandAsset) => void
}

function AssetCard({ asset, onDownload, onPreview, onDelete }: AssetCardProps) {
  const isImage = asset.file_type.startsWith('image/')

  return (
    <div className="group relative border rounded-lg p-3 hover:border-primary/50 hover:shadow-sm transition-all bg-card">
      {/* Thumbnail */}
      <div className="aspect-square rounded-md bg-muted/50 flex items-center justify-center mb-2 overflow-hidden">
        {isImage ? (
          <img 
            src={asset.url} 
            alt={asset.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-muted-foreground">
            {getFileIcon(asset.file_type)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <p className="text-xs font-medium truncate" title={asset.name}>
          {asset.name}
        </p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {asset.file_type.split('/')[1]?.toUpperCase() || 'FILE'}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            {formatFileSize(asset.file_size)}
          </span>
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <Button size="sm" variant="secondary" onClick={() => onDownload(asset)}>
          <Download className="h-3 w-3 mr-1" />
          İndir
        </Button>
        {isImage && (
          <Button size="sm" variant="outline" onClick={() => onPreview(asset)}>
            <Eye className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
}

// =====================================================
// COMPETITOR CARD COMPONENT
// =====================================================

interface CompetitorCardProps {
  competitor: Competitor
}

function CompetitorCard({ competitor }: CompetitorCardProps) {
  return (
    <div className="p-3 border rounded-lg bg-muted/30">
      <div className="flex items-start justify-between mb-2">
        <span className="font-medium text-sm">{competitor.name}</span>
        {competitor.instagram_handle && (
          <Badge variant="outline" className="text-[10px]">
            @{competitor.instagram_handle}
          </Badge>
        )}
      </div>
      {competitor.followers && (
        <p className="text-xs text-muted-foreground mb-2">
          {formatFollowers(competitor.followers)} takipçi
        </p>
      )}
      {competitor.strengths && competitor.strengths.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {competitor.strengths.map((strength, i) => (
            <Badge key={i} variant="secondary" className="text-[10px]">
              {strength}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

// =====================================================
// SPECIAL EVENT CARD COMPONENT
// =====================================================

interface EventCardProps {
  event: SpecialEvent
}

function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date)
  const month = eventDate.toLocaleDateString('tr-TR', { month: 'short' })
  const day = eventDate.getDate()

  return (
    <div className="flex items-center gap-3 p-2 border rounded-lg bg-muted/30">
      <div className="flex flex-col items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
        <span className="text-[10px] uppercase text-primary font-medium">{month}</span>
        <span className="text-lg font-bold text-primary">{day}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{event.name}</p>
        {event.notes && (
          <p className="text-xs text-muted-foreground truncate">{event.notes}</p>
        )}
      </div>
    </div>
  )
}

// =====================================================
// COPYABLE TEXT COMPONENT
// =====================================================

interface CopyableTextProps {
  text: string
  className?: string
}

function CopyableText({ text, className }: CopyableTextProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("group relative p-3 bg-muted/50 rounded-lg", className)}>
      <p className="text-sm pr-8">{text}</p>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  )
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export function CustomerViewMode({ customer, onEdit, onAIRefresh, onDelete }: CustomerViewModeProps) {
  const supabase = createClient()
  const [assets, setAssets] = useState<BrandAsset[]>([])
  const [loadingAssets, setLoadingAssets] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadCategory, setUploadCategory] = useState<string>('logo')

  // Fetch brand assets
  useEffect(() => {
    async function fetchAssets() {
      setLoadingAssets(true)
      try {
        const { data, error } = await supabase.storage
          .from('brand-assets')
          .list(`${customer.id}`, {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' }
          })

        if (error) throw error

        // Get public URLs for each file
        const assetsWithUrls: BrandAsset[] = (data || []).map(file => {
          const { data: urlData } = supabase.storage
            .from('brand-assets')
            .getPublicUrl(`${customer.id}/${file.name}`)

          // Parse category from file name (format: category_filename.ext)
          const parts = file.name.split('_')
          const category = ['logo', 'brand-guide', 'corporate-identity', 'other'].includes(parts[0]) 
            ? parts[0] as BrandAsset['category']
            : 'other'

          return {
            id: file.id || file.name,
            name: parts.slice(1).join('_') || file.name,
            file_name: file.name,
            file_type: file.metadata?.mimetype || 'application/octet-stream',
            file_size: file.metadata?.size || 0,
            url: urlData.publicUrl,
            category,
            created_at: file.created_at || new Date().toISOString()
          }
        })

        setAssets(assetsWithUrls)
      } catch (error) {
        console.error('Error fetching assets:', error)
      } finally {
        setLoadingAssets(false)
      }
    }

    fetchAssets()
  }, [customer.id, supabase])

  // Upload handler
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const fileName = `${uploadCategory}_${Date.now()}_${file.name}`
        const filePath = `${customer.id}/${fileName}`

        const { error } = await supabase.storage
          .from('brand-assets')
          .upload(filePath, file)

        if (error) throw error
      }

      // Refresh assets
      const { data } = await supabase.storage
        .from('brand-assets')
        .list(`${customer.id}`)

      // Update assets state
      const assetsWithUrls: BrandAsset[] = (data || []).map(file => {
        const { data: urlData } = supabase.storage
          .from('brand-assets')
          .getPublicUrl(`${customer.id}/${file.name}`)

        const parts = file.name.split('_')
        const category = ['logo', 'brand-guide', 'corporate-identity', 'other'].includes(parts[0]) 
          ? parts[0] as BrandAsset['category']
          : 'other'

        return {
          id: file.id || file.name,
          name: parts.slice(1).join('_') || file.name,
          file_name: file.name,
          file_type: file.metadata?.mimetype || 'application/octet-stream',
          file_size: file.metadata?.size || 0,
          url: urlData.publicUrl,
          category,
          created_at: file.created_at || new Date().toISOString()
        }
      })

      setAssets(assetsWithUrls)
    } catch (error) {
      console.error('Error uploading:', error)
    } finally {
      setUploading(false)
    }
  }

  // Download handler
  const handleDownload = async (asset: BrandAsset) => {
    const link = document.createElement('a')
    link.href = asset.url
    link.download = asset.name
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Preview handler
  const handlePreview = (asset: BrandAsset) => {
    window.open(asset.url, '_blank')
  }

  // Delete asset handler
  const handleDeleteAsset = async (asset: BrandAsset) => {
    try {
      const { error } = await supabase.storage
        .from('brand-assets')
        .remove([`${customer.id}/${asset.file_name}`])

      if (error) throw error

      setAssets(prev => prev.filter(a => a.id !== asset.id))
    } catch (error) {
      console.error('Error deleting asset:', error)
    }
  }

  // Calculate completion and missing fields
  const completion = calculateBriefCompletion(customer)
  
  const missingFields: string[] = []
  if (!customer.mission) missingFields.push('Misyon')
  if (!customer.vision) missingFields.push('Vizyon')
  if (!customer.competitors || customer.competitors.length === 0) missingFields.push('Rakipler')
  if (!customer.special_events || customer.special_events.length === 0) missingFields.push('Özel Günler')

  // Social media data
  const socialMedia = customer.social_media || {}
  const hasSocialMedia = Object.values(socialMedia).some(s => s?.handle)

  return (
    <div className="space-y-6">
      {/* ==================== HEADER ACTIONS ==================== */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Marka Bilgileri</h2>
        <div className="flex items-center gap-2">
          <Button variant="default" onClick={onEdit}>
            Düzenle
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onAIRefresh && (
                <DropdownMenuItem onClick={onAIRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  AI ile Güncelle
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <ExternalLink className="h-4 w-4 mr-2" />
                Dışa Aktar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Sil
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ==================== HERO SECTION ==================== */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Logo */}
            <div className="shrink-0">
              {customer.brand_assets?.logo_url ? (
                <img 
                  src={customer.brand_assets.logo_url}
                  alt={customer.name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-contain bg-white shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary/50" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-2xl font-bold">{customer.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {customer.sector && (
                    <Badge variant="secondary">
                      {getSectorLabel(customer.sector)}
                      {customer.sub_sector && ` - ${customer.sub_sector}`}
                    </Badge>
                  )}
                  {customer.business_type && (
                    <Badge variant="outline">{getBusinessTypeLabel(customer.business_type)}</Badge>
                  )}
                  {customer.location && (
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="h-3 w-3" />
                      {customer.location}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Website & Contact */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {customer.website_url && (
                  <a 
                    href={customer.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    {(() => {
                      try {
                        return new URL(customer.website_url).hostname
                      } catch {
                        return customer.website_url
                      }
                    })()}
                  </a>
                )}
                {customer.email && (
                  <a href={`mailto:${customer.email}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                    {customer.email}
                  </a>
                )}
                {customer.phone && (
                  <a href={`tel:${customer.phone}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Phone className="h-4 w-4" />
                    {customer.phone}
                  </a>
                )}
              </div>

              {/* Social Media Badges */}
              {hasSocialMedia && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(socialMedia).map(([platform, data]) => (
                    <SocialBadge 
                      key={platform}
                      platform={platform}
                      handle={data?.handle}
                      followers={data?.followers}
                    />
                  ))}
                </div>
              )}

              {/* Brand Voice */}
              {customer.brand_voice && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Marka Sesi:</span>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                    {getBrandVoiceLabel(customer.brand_voice)}
                  </Badge>
                </div>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
                <span>📅 Brief: {new Date(customer.created_at).toLocaleDateString('tr-TR')}</span>
                {customer.ai_research_date && (
                  <span className="flex items-center gap-1">
                    <Bot className="h-3 w-3" />
                    AI: {new Date(customer.ai_research_date).toLocaleDateString('tr-TR')} güncellendi
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Missing Fields Alert */}
        {missingFields.length > 0 && (
          <div className="px-6 py-3 bg-amber-50 border-t border-amber-200">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{missingFields.length} eksik alan var:</span>
              <span className="text-sm">{missingFields.join(', ')}</span>
              <Button variant="link" size="sm" onClick={onEdit} className="text-amber-800 p-0 h-auto ml-auto">
                Tamamla →
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ==================== BRAND ASSETS ==================== */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Download className="h-4 w-4 text-muted-foreground" />
              Marka Dosyaları
            </CardTitle>
            <div className="flex items-center gap-2">
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="text-xs border rounded px-2 py-1"
              >
                <option value="logo">Logo</option>
                <option value="brand-guide">Brand Guide</option>
                <option value="corporate-identity">Kurumsal Kimlik</option>
                <option value="other">Diğer</option>
              </select>
              <Button variant="outline" size="sm" className="relative" disabled={uploading}>
                <Upload className="h-3 w-3 mr-1" />
                {uploading ? 'Yükleniyor...' : 'Yükle'}
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.ai,.eps,.svg"
                  onChange={handleUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploading}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingAssets ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : assets.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-12 w-12" />}
              title="Henüz dosya yüklenmedi"
              description="Logo, brand guide ve kurumsal kimlik dosyalarını yükleyin"
              action={
                <Button variant="outline" size="sm" className="relative">
                  <Upload className="h-3 w-3 mr-1" />
                  Dosya Yükle
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.ai,.eps,.svg"
                    onChange={handleUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {assets.map(asset => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  onDownload={handleDownload}
                  onPreview={handlePreview}
                  onDelete={handleDeleteAsset}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ==================== INFO CARDS GRID ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Marka Kimliği */}
        <InfoCard
          title="Marka Kimliği"
          icon={<Sparkles className="h-4 w-4" />}
          isEmpty={!customer.brand_description && !customer.mission && !customer.vision && !customer.slogan && !customer.usp}
          emptyMessage="Marka kimliği henüz tanımlanmadı"
          onAddClick={onEdit}
        >
          <div className="space-y-3 text-sm">
            {customer.brand_description && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Açıklama</p>
                <p>{customer.brand_description}</p>
              </div>
            )}
            {customer.mission && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Misyon</p>
                <p>{customer.mission}</p>
              </div>
            )}
            {customer.vision && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Vizyon</p>
                <p>{customer.vision}</p>
              </div>
            )}
            {customer.slogan && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Slogan</p>
                <p className="italic">"{customer.slogan}"</p>
              </div>
            )}
            {customer.usp && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">USP (Fark)</p>
                <p>{customer.usp}</p>
              </div>
            )}
          </div>
        </InfoCard>

        {/* Hedef Kitle */}
        <InfoCard
          title="Hedef Kitle"
          icon={<Users className="h-4 w-4" />}
          isEmpty={!customer.target_audience && !customer.target_age_range && !customer.target_geography}
          emptyMessage="Hedef kitle henüz tanımlanmadı"
          onAddClick={onEdit}
        >
          <div className="space-y-3 text-sm">
            {customer.target_audience && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Genel Tanım</p>
                <p>{customer.target_audience}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {customer.target_age_range && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Yaş Aralığı</p>
                  <p>{customer.target_age_range}</p>
                </div>
              )}
              {customer.target_geography && (
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Coğrafya</p>
                  <p>{customer.target_geography}</p>
                </div>
              )}
            </div>
          </div>
        </InfoCard>

        {/* Ürün/Hizmet */}
        <InfoCard
          title="Ürün / Hizmet"
          icon={<Package className="h-4 w-4" />}
          isEmpty={(!customer.product_categories || customer.product_categories.length === 0) && (!customer.top_products || customer.top_products.length === 0)}
          emptyMessage="Ürün bilgisi henüz eklenmedi"
          onAddClick={onEdit}
        >
          <div className="space-y-3 text-sm">
            {customer.product_categories && customer.product_categories.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-2">Kategoriler</p>
                <div className="flex flex-wrap gap-1">
                  {customer.product_categories.map((cat, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{cat}</Badge>
                  ))}
                </div>
              </div>
            )}
            {customer.top_products && customer.top_products.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-2">En Çok Satanlar</p>
                <div className="space-y-1">
                  {customer.top_products.map((product, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '•'}</span>
                      {product}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {customer.price_segment && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Fiyat Segmenti</p>
                <Badge>{getPriceSegmentLabel(customer.price_segment)}</Badge>
              </div>
            )}
          </div>
        </InfoCard>

        {/* Rekabet */}
        <InfoCard
          title="Rekabet"
          icon={<Target className="h-4 w-4" />}
          isEmpty={!customer.competitors || customer.competitors.length === 0}
          emptyMessage="Rakip bilgisi henüz eklenmedi"
          onAddClick={onEdit}
        >
          <div className="space-y-2">
            {customer.competitors?.map((competitor, i) => (
              <CompetitorCard key={i} competitor={competitor} />
            ))}
          </div>
        </InfoCard>

        {/* Kurallar */}
        <InfoCard
          title="Kurallar"
          icon={<ShieldCheck className="h-4 w-4" />}
          isEmpty={(!customer.do_not_do || customer.do_not_do.length === 0) && (!customer.must_emphasize || customer.must_emphasize.length === 0)}
          emptyMessage="İçerik kuralları henüz tanımlanmadı"
          onAddClick={onEdit}
        >
          <div className="space-y-3">
            {customer.do_not_do && customer.do_not_do.length > 0 && (
              <div>
                <p className="text-xs text-red-600 font-medium mb-2">❌ Yapılmaması Gerekenler</p>
                <div className="flex flex-wrap gap-1">
                  {customer.do_not_do.map((item, i) => (
                    <Badge key={i} variant="destructive" className="text-xs">{item}</Badge>
                  ))}
                </div>
              </div>
            )}
            {customer.must_emphasize && customer.must_emphasize.length > 0 && (
              <div>
                <p className="text-xs text-green-600 font-medium mb-2">✅ Vurgulanması Gerekenler</p>
                <div className="flex flex-wrap gap-1">
                  {customer.must_emphasize.map((item, i) => (
                    <Badge key={i} variant="default" className="text-xs bg-green-600">{item}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </InfoCard>

        {/* AI İçgörüleri */}
        <InfoCard
          title="AI İçgörüleri"
          icon={<Bot className="h-4 w-4" />}
          isEmpty={(!customer.pain_points || customer.pain_points.length === 0) && (!customer.hook_sentences || customer.hook_sentences.length === 0)}
          emptyMessage="AI içgörüleri henüz oluşturulmadı"
          onAddClick={onAIRefresh}
        >
          <div className="space-y-3">
            {customer.pain_points && customer.pain_points.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-2">Acı Noktalar</p>
                <div className="space-y-1">
                  {customer.pain_points.slice(0, 3).map((point, i) => (
                    <p key={i} className="text-sm">• {point.problem}</p>
                  ))}
                </div>
              </div>
            )}
            {customer.hook_sentences && customer.hook_sentences.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-2">Hook Cümleleri</p>
                <div className="space-y-1">
                  {customer.hook_sentences.slice(0, 3).map((hook, i) => (
                    <p key={i} className="text-sm italic">"{hook.hook}"</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </InfoCard>
      </div>

      {/* ==================== SPECIAL EVENTS ==================== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Özel Tarihler & Etkinlikler
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!customer.special_events || customer.special_events.length === 0 ? (
            <EmptyState
              icon={<Calendar className="h-12 w-12" />}
              title="Özel tarih henüz eklenmedi"
              description="Kampanya ve etkinlik tarihlerini ekleyin"
              action={
                <Button variant="outline" size="sm" onClick={onEdit}>
                  + Etkinlik Ekle
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {customer.special_events.map((event, i) => (
                <EventCard key={i} event={event} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ==================== EXAMPLE CAPTIONS ==================== */}
      {customer.example_captions && (customer.example_captions.good_examples?.length || customer.example_captions.bad_examples?.length) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Örnek Captionlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customer.example_captions.good_examples?.map((caption, i) => (
                <CopyableText key={i} text={caption} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ==================== MOBILE ACCORDION (for smaller screens) ==================== */}
      <div className="md:hidden">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="marka">
            <AccordionTrigger className="text-sm">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Marka Kimliği
              </span>
            </AccordionTrigger>
            <AccordionContent>
              {/* Mobile content for brand identity */}
              <div className="space-y-2 text-sm">
                {customer.brand_description && <p>{customer.brand_description}</p>}
                {customer.mission && <p><strong>Misyon:</strong> {customer.mission}</p>}
                {customer.vision && <p><strong>Vizyon:</strong> {customer.vision}</p>}
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Add more accordion items as needed */}
        </Accordion>
      </div>
    </div>
  )
}
