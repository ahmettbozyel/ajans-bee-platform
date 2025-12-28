// @ts-nocheck
'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Image, Package, FileImage, Upload, Trash2, Plus, Loader2, 
  CheckCircle, AlertCircle, X, Eye, Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Customer } from '@/lib/customer-types'
import { 
  LOGO_CATEGORIES, 
  FILE_CATEGORIES,
  type CustomerFile,
  type FileCategory,
  type LogoSubCategory 
} from '@/lib/customer-types'

interface CustomerFilesTabProps {
  customer: Customer
  onUpdate?: () => void
}

// File Card Component
function FileCard({ 
  file, 
  onDelete, 
  onSetPrimary,
  isDeleting 
}: { 
  file: CustomerFile
  onDelete: (id: string) => void
  onSetPrimary?: (id: string) => void
  isDeleting: boolean
}) {
  const [showPreview, setShowPreview] = useState(false)
  const isImage = file.mime_type?.startsWith('image/')
  
  const categoryLabel = FILE_CATEGORIES.find(c => c.value === file.category)?.label || file.category
  const subCategoryLabel = file.sub_category 
    ? LOGO_CATEGORIES.find(c => c.value === file.sub_category)?.label 
    : null
  
  return (
    <>
      <div className={cn(
        "group relative rounded-xl border overflow-hidden transition-all hover:shadow-lg",
        file.is_primary 
          ? "border-amber-400 dark:border-amber-500/50 ring-2 ring-amber-400/20" 
          : "border-zinc-200 dark:border-white/10"
      )}>
        {/* Preview Area */}
        <div 
          className="aspect-square bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center cursor-pointer"
          onClick={() => isImage && setShowPreview(true)}
        >
          {isImage ? (
            <img 
              src={file.file_url} 
              alt={file.file_name}
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <FileImage className="w-12 h-12 text-zinc-400" />
          )}
          
          {/* Primary Badge */}
          {file.is_primary && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5">
                Ana Logo
              </Badge>
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {isImage && (
              <Button 
                size="sm" 
                variant="secondary" 
                className="h-8 px-2"
                onClick={(e) => { e.stopPropagation(); setShowPreview(true) }}
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            <a 
              href={file.file_url} 
              download={file.file_name}
              onClick={(e) => e.stopPropagation()}
            >
              <Button size="sm" variant="secondary" className="h-8 px-2">
                <Download className="w-4 h-4" />
              </Button>
            </a>
            <Button 
              size="sm" 
              variant="destructive" 
              className="h-8 px-2"
              onClick={(e) => { e.stopPropagation(); onDelete(file.id) }}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        {/* Info */}
        <div className="p-3 bg-white dark:bg-zinc-900/50">
          <p className="text-sm font-medium text-zinc-900 dark:text-white truncate" title={file.file_name}>
            {file.file_name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-[10px]">
              {subCategoryLabel || categoryLabel}
            </Badge>
            {file.file_size && (
              <span className="text-[10px] text-zinc-500">
                {(file.file_size / 1024).toFixed(0)} KB
              </span>
            )}
          </div>
          
          {/* Set as Primary (for logos only) */}
          {file.category === 'logo' && !file.is_primary && onSetPrimary && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-xs h-7"
              onClick={() => onSetPrimary(file.id)}
            >
              Ana Logo Yap
            </Button>
          )}
        </div>
      </div>
      
      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{file.file_name}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <img 
              src={file.file_url} 
              alt={file.file_name}
              className="max-w-full max-h-[60vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Upload Zone Component
function UploadZone({
  category,
  subCategory,
  customerId,
  userId,
  onUploadComplete,
  disabled
}: {
  category: FileCategory
  subCategory?: LogoSubCategory
  customerId: string
  userId: string
  onUploadComplete: () => void
  disabled?: boolean
}) {
  const supabase = createClient()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    
    setIsUploading(true)
    setError(null)
    
    try {
      for (const file of Array.from(files)) {
        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
          setError(`Desteklenmeyen dosya tipi: ${file.type}`)
          continue
        }
        
        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
          setError('Dosya boyutu 10MB\'dan büyük olamaz')
          continue
        }
        
        // Generate unique filename
        const ext = file.name.split('.').pop()
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`
        const filePath = `${userId}/${customerId}/${category}/${uniqueName}`
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('customer-files')
          .upload(filePath, file)
        
        if (uploadError) throw uploadError
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('customer-files')
          .getPublicUrl(filePath)
        
        // Insert record to database
        const { error: dbError } = await supabase
          .from('customer_files')
          .insert({
            user_id: userId,
            customer_id: customerId,
            category,
            sub_category: subCategory || null,
            file_name: file.name,
            file_url: publicUrl,
            file_size: file.size,
            mime_type: file.type,
            is_primary: false
          })
        
        if (dbError) throw dbError
      }
      
      onUploadComplete()
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Yükleme sırasında hata oluştu')
    } finally {
      setIsUploading(false)
    }
  }
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleUpload(e.dataTransfer.files)
  }, [customerId, userId, category, subCategory])
  
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-xl p-6 text-center transition-colors",
        dragOver 
          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10" 
          : "border-zinc-300 dark:border-white/10 hover:border-indigo-400",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm text-zinc-500">Yükleniyor...</p>
        </div>
      ) : (
        <>
          <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
            Dosyaları sürükle bırak veya
          </p>
          <label className="cursor-pointer">
            <span className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              dosya seç
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp,image/gif"
              multiple
              onChange={(e) => handleUpload(e.target.files)}
              disabled={disabled || isUploading}
            />
          </label>
          <p className="text-xs text-zinc-400 mt-2">
            PNG, JPG, SVG, WebP, GIF • Max 10MB
          </p>
        </>
      )}
      
      {error && (
        <Alert variant="destructive" className="mt-3">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

// Main Component
export function CustomerFilesTab({ customer, onUpdate }: CustomerFilesTabProps) {
  const supabase = createClient()
  const [files, setFiles] = useState<CustomerFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<FileCategory>('logo')
  const [selectedLogoCategory, setSelectedLogoCategory] = useState<LogoSubCategory>('primary')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  
  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [])
  
  // Fetch files
  const fetchFiles = useCallback(async () => {
    if (!customer?.id) return
    
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('customer_files')
        .select('*')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setFiles(data || [])
    } catch (err) {
      console.error('Error fetching files:', err)
    } finally {
      setIsLoading(false)
    }
  }, [customer?.id])
  
  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])
  
  // Delete file
  const handleDelete = async (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (!file) return
    
    setDeletingId(fileId)
    try {
      // Extract path from URL
      const urlParts = file.file_url.split('/customer-files/')
      if (urlParts[1]) {
        await supabase.storage
          .from('customer-files')
          .remove([urlParts[1]])
      }
      
      // Delete from database
      const { error } = await supabase
        .from('customer_files')
        .delete()
        .eq('id', fileId)
      
      if (error) throw error
      
      setFiles(files.filter(f => f.id !== fileId))
      onUpdate?.()
    } catch (err) {
      console.error('Error deleting file:', err)
    } finally {
      setDeletingId(null)
    }
  }
  
  // Set primary logo
  const handleSetPrimary = async (fileId: string) => {
    try {
      // Remove primary from all logos
      await supabase
        .from('customer_files')
        .update({ is_primary: false })
        .eq('customer_id', customer.id)
        .eq('category', 'logo')
      
      // Set new primary
      await supabase
        .from('customer_files')
        .update({ is_primary: true })
        .eq('id', fileId)
      
      // Update local state
      setFiles(files.map(f => ({
        ...f,
        is_primary: f.id === fileId ? true : (f.category === 'logo' ? false : f.is_primary)
      })))
      
      onUpdate?.()
    } catch (err) {
      console.error('Error setting primary:', err)
    }
  }
  
  const filteredFiles = files.filter(f => f.category === activeCategory)
  const logoFiles = files.filter(f => f.category === 'logo')
  const productFiles = files.filter(f => f.category === 'product')
  const postFiles = files.filter(f => f.category === 'post')
  
  const primaryLogo = logoFiles.find(f => f.is_primary)
  
  return (
    <div className="space-y-6">
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className={cn(
          "glass-card rounded-xl p-4 border cursor-pointer transition-all",
          activeCategory === 'logo' 
            ? "glow-indigo border-indigo-500/50" 
            : "border-zinc-200 dark:border-white/10 hover:border-indigo-300"
        )} onClick={() => setActiveCategory('logo')}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/10">
              <Image className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{logoFiles.length}</p>
              <p className="text-xs text-zinc-500">Logo</p>
            </div>
          </div>
        </div>
        
        <div className={cn(
          "glass-card rounded-xl p-4 border cursor-pointer transition-all",
          activeCategory === 'product' 
            ? "glow-cyan border-cyan-500/50" 
            : "border-zinc-200 dark:border-white/10 hover:border-cyan-300"
        )} onClick={() => setActiveCategory('product')}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-500/10">
              <Package className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{productFiles.length}</p>
              <p className="text-xs text-zinc-500">Ürün Görseli</p>
            </div>
          </div>
        </div>
        
        <div className={cn(
          "glass-card rounded-xl p-4 border cursor-pointer transition-all",
          activeCategory === 'post' 
            ? "glow-fuchsia border-fuchsia-500/50" 
            : "border-zinc-200 dark:border-white/10 hover:border-fuchsia-300"
        )} onClick={() => setActiveCategory('post')}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-500/10">
              <FileImage className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{postFiles.length}</p>
              <p className="text-xs text-zinc-500">Örnek Post</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Primary Logo Preview */}
      {primaryLogo && (
        <div className="glass-card rounded-2xl p-5 border border-amber-200 dark:border-amber-500/20 bg-gradient-to-br from-amber-50 dark:from-amber-500/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 flex items-center justify-center overflow-hidden">
              <img 
                src={primaryLogo.file_url} 
                alt="Ana Logo"
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-amber-500 text-white">Ana Logo</Badge>
                <span className="text-xs text-zinc-500">{primaryLogo.file_name}</span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Bu logo kartlarda ve içerik üretiminde kullanılacak
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Section */}
      <div className="glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50">
        <h3 className="font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-500" />
          {activeCategory === 'logo' ? 'Logo Yükle' : 
           activeCategory === 'product' ? 'Ürün Görseli Yükle' : 
           'Örnek Post Yükle'}
        </h3>
        
        {/* Logo Sub-category Selector */}
        {activeCategory === 'logo' && (
          <div className="mb-4">
            <Label className="mb-2 block text-zinc-700 dark:text-zinc-300">Logo Tipi</Label>
            <Select value={selectedLogoCategory} onValueChange={(v) => setSelectedLogoCategory(v as LogoSubCategory)}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOGO_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div>
                      <span className="font-medium">{cat.label}</span>
                      <span className="text-xs text-zinc-500 ml-2">{cat.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {userId && (
          <UploadZone
            category={activeCategory}
            subCategory={activeCategory === 'logo' ? selectedLogoCategory : undefined}
            customerId={customer.id}
            userId={userId}
            onUploadComplete={() => {
              fetchFiles()
              onUpdate?.()
            }}
          />
        )}
      </div>
      
      {/* Files Grid */}
      <div className="glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50">
        <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
          {activeCategory === 'logo' ? 'Logolar' : 
           activeCategory === 'product' ? 'Ürün Görselleri' : 
           'Örnek Postlar'}
          <span className="text-zinc-500 font-normal ml-2">({filteredFiles.length})</span>
        </h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center mx-auto mb-4">
              {activeCategory === 'logo' ? <Image className="w-8 h-8 text-zinc-400" /> :
               activeCategory === 'product' ? <Package className="w-8 h-8 text-zinc-400" /> :
               <FileImage className="w-8 h-8 text-zinc-400" />}
            </div>
            <h4 className="font-semibold text-zinc-900 dark:text-white mb-2">
              Henüz dosya yok
            </h4>
            <p className="text-sm text-zinc-500">
              {activeCategory === 'logo' ? 'Logo dosyalarını yükleyerek başla' :
               activeCategory === 'product' ? 'Ürün görsellerini yükle' :
               'Beğendiğin örnek postları yükle'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDelete={handleDelete}
                onSetPrimary={activeCategory === 'logo' ? handleSetPrimary : undefined}
                isDeleting={deletingId === file.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
