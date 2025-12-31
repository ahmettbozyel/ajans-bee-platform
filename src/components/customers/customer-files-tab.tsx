// @ts-nocheck
'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { 
  PenTool, Package, ImageIcon, Folder, Upload, Trash2, Plus, Loader2, 
  CheckCircle, AlertCircle, X, Eye, Download, CloudUpload, Layers,
  ChevronDown, Star, Search, FileIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { ConfirmModal } from '@/components/ui/confirm-modal'
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

// ==========================================
// HELPERS
// ==========================================
function formatFileSize(bytes: number): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getCategoryConfig(category: FileCategory) {
  const configs = {
    logo: {
      label: 'Logo',
      pluralLabel: 'Logolar',
      icon: PenTool,
      color: 'indigo',
      glowClass: 'glow-indigo',
      iconBoxClass: 'icon-box-indigo',
      badgeClass: 'badge-indigo',
      textClass: 'text-indigo-400',
      addLabel: 'Logo Ekle'
    },
    product: {
      label: 'Ürün Görseli',
      pluralLabel: 'Ürün Görselleri',
      icon: Package,
      color: 'emerald',
      glowClass: 'glow-emerald',
      iconBoxClass: 'icon-box-emerald',
      badgeClass: 'badge-emerald',
      textClass: 'text-emerald-400',
      addLabel: 'Görsel Ekle'
    },
    post: {
      label: 'Örnek Post',
      pluralLabel: 'Örnek Postlar',
      icon: ImageIcon,
      color: 'amber',
      glowClass: 'glow-amber',
      iconBoxClass: 'icon-box-amber',
      badgeClass: 'badge-amber',
      textClass: 'text-amber-400',
      addLabel: 'Post Ekle'
    }
  }
  return configs[category] || configs.logo
}

// ==========================================
// FILE CARD COMPONENT
// ==========================================
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
  const config = getCategoryConfig(file.category)
  
  const subCategoryLabel = file.sub_category 
    ? LOGO_CATEGORIES.find(c => c.value === file.sub_category)?.label 
    : null
  
  // Determine background for logos
  const getLogoBg = () => {
    if (file.category !== 'logo') return 'bg-zinc-800/50'
    if (file.sub_category === 'monochrome-dark') return 'bg-white'
    if (file.sub_category === 'monochrome-light') return 'bg-zinc-900'
    if (file.sub_category === 'icon') return 'bg-gradient-to-br from-indigo-500/20 to-violet-500/20'
    return 'bg-zinc-800/50'
  }
  
  // Get badge label
  const getBadgeLabel = () => {
    if (file.category === 'logo' && subCategoryLabel) return subCategoryLabel
    if (file.category === 'post') return 'Post'
    return 'Ürün'
  }
  
  return (
    <>
      <div className="file-card rounded-2xl overflow-hidden group">
        <div className={cn(
          "relative aspect-square flex items-center justify-center p-4",
          getLogoBg()
        )}>
          {/* Actions */}
          <div className="actions absolute top-3 right-3 flex gap-1 z-10">
            {isImage && (
              <button 
                onClick={() => setShowPreview(true)}
                className="p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            )}
            <a 
              href={file.file_url} 
              download={file.file_name}
              className="p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
            <button 
              onClick={() => onDelete(file.id)}
              disabled={isDeleting}
              className="p-1.5 rounded-lg bg-black/50 text-white hover:bg-rose-500/70 transition-colors disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </button>
          </div>
          
          {/* Primary Badge */}
          {file.is_primary && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
              <span className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-black">
                <Star className="w-3 h-3" />
                Ana Logo
              </span>
            </div>
          )}
          
          {/* Thumbnail */}
          {isImage ? (
            <img 
              src={file.file_url} 
              alt={file.file_name}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <ImageIcon className="w-12 h-12 text-zinc-500" />
          )}
        </div>
        
        <div className="p-4">
          <p className="text-sm font-medium text-white truncate" title={file.file_name}>
            {file.file_name}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className={cn("badge", config.badgeClass)}>{getBadgeLabel()}</span>
            <span className="text-xs text-zinc-500 font-mono">{formatFileSize(file.file_size)}</span>
          </div>
          
          {/* Set as Primary (for logos only) */}
          {file.category === 'logo' && !file.is_primary && onSetPrimary && (
            <button
              onClick={() => onSetPrimary(file.id)}
              className="w-full mt-3 px-3 py-2 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              Ana Logo Yap
            </button>
          )}
        </div>
      </div>
      
      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl bg-zinc-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">{file.file_name}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-zinc-800 rounded-lg">
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

// ==========================================
// MAIN COMPONENT
// ==========================================
export function CustomerFilesTab({ customer, onUpdate }: CustomerFilesTabProps) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [files, setFiles] = useState<CustomerFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FileCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'size'>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadCategory, setUploadCategory] = useState<FileCategory>('logo')
  const [uploadLogoType, setUploadLogoType] = useState<LogoSubCategory>('primary')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; file: CustomerFile | null }>({ isOpen: false, file: null })
  
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
  
  // Create preview URLs when files are selected
  useEffect(() => {
    if (pendingFiles.length > 0) {
      const urls = pendingFiles.map(file => {
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file)
        }
        return ''
      })
      setPreviewUrls(urls)
      
      // Cleanup
      return () => {
        urls.forEach(url => {
          if (url) URL.revokeObjectURL(url)
        })
      }
    } else {
      setPreviewUrls([])
    }
  }, [pendingFiles])
  
  // Stats
  const stats = useMemo(() => ({
    logo: files.filter(f => f.category === 'logo').length,
    product: files.filter(f => f.category === 'product').length,
    post: files.filter(f => f.category === 'post').length,
    total: files.length
  }), [files])
  
  // Filtered & Sorted (with search)
  const filteredFiles = useMemo(() => {
    let result = activeFilter === 'all' 
      ? files 
      : files.filter(f => f.category === activeFilter)
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(f => 
        f.file_name.toLowerCase().includes(query) ||
        (f.sub_category && f.sub_category.toLowerCase().includes(query))
      )
    }
    
    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'name':
          return a.file_name.localeCompare(b.file_name)
        case 'size':
          return (b.file_size || 0) - (a.file_size || 0)
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })
    
    return result
  }, [files, activeFilter, sortBy, searchQuery])
  
  // Group by category
  const groupedFiles = useMemo(() => ({
    logo: filteredFiles.filter(f => f.category === 'logo'),
    product: filteredFiles.filter(f => f.category === 'product'),
    post: filteredFiles.filter(f => f.category === 'post')
  }), [filteredFiles])
  
  // Drag & Drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      setPendingFiles(droppedFiles)
      setUploadModalOpen(true)
    }
  }, [])
  
  // File input handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setPendingFiles(Array.from(e.target.files))
      setUploadModalOpen(true)
    }
  }
  
  // Upload files
  const handleUpload = async () => {
    if (!userId || pendingFiles.length === 0) return
    
    setIsUploading(true)
    setUploadError(null)
    
    try {
      for (const file of pendingFiles) {
        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
          setUploadError(`Desteklenmeyen dosya tipi: ${file.type}`)
          continue
        }
        
        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
          setUploadError('Dosya boyutu 10MB\'dan büyük olamaz')
          continue
        }
        
        // Generate unique filename
        const ext = file.name.split('.').pop()
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`
        const filePath = `${userId}/${customer.id}/${uploadCategory}/${uniqueName}`
        
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
            customer_id: customer.id,
            category: uploadCategory,
            sub_category: uploadCategory === 'logo' ? uploadLogoType : null,
            file_name: file.name,
            file_url: publicUrl,
            file_size: file.size,
            mime_type: file.type,
            is_primary: false
          })
        
        if (dbError) throw dbError
      }
      
      setUploadModalOpen(false)
      setPendingFiles([])
      setPreviewUrls([])
      fetchFiles()
      onUpdate?.()
    } catch (err: any) {
      console.error('Upload error:', err)
      setUploadError(err.message || 'Yükleme sırasında hata oluştu')
    } finally {
      setIsUploading(false)
    }
  }
  
  // Close upload modal
  const closeUploadModal = () => {
    setUploadModalOpen(false)
    setPendingFiles([])
    setPreviewUrls([])
    setUploadError(null)
  }
  
  // Delete file
  const handleDelete = async () => {
    const file = deleteModal.file
    if (!file) return
    
    setDeletingId(file.id)
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
        .eq('id', file.id)
      
      if (error) throw error
      
      setFiles(files.filter(f => f.id !== file.id))
      setDeleteModal({ isOpen: false, file: null })
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
  
  // File Section Component
  const FileSection = ({ category, files: sectionFiles }: { category: FileCategory; files: CustomerFile[] }) => {
    if (sectionFiles.length === 0) return null
    
    const config = getCategoryConfig(category)
    const Icon = config.icon
    const gridCols = category === 'logo' 
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
      : category === 'product'
        ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon className={cn("w-5 h-5", config.textClass)} />
            <h3 className="text-lg font-semibold text-white">{config.pluralLabel}</h3>
            <span className="badge badge-neutral font-mono">{sectionFiles.length}</span>
          </div>
          <button 
            onClick={() => {
              setUploadCategory(category)
              setUploadModalOpen(true)
            }}
            className={cn("text-sm flex items-center gap-1 transition-colors", config.textClass, "hover:opacity-80")}
          >
            <Plus className="w-4 h-4" />
            {config.addLabel}
          </button>
        </div>
        
        <div className={cn("grid gap-5", gridCols)}>
          {sectionFiles.map(file => (
            <FileCard
              key={file.id}
              file={file}
              onDelete={(id) => {
                const f = files.find(x => x.id === id)
                if (f) setDeleteModal({ isOpen: true, file: f })
              }}
              onSetPrimary={category === 'logo' ? handleSetPrimary : undefined}
              isDeleting={deletingId === file.id}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div 
          onClick={() => setActiveFilter(activeFilter === 'logo' ? 'all' : 'logo')}
          className={cn(
            "glass-card rounded-2xl p-5 card-hover cursor-pointer",
            activeFilter === 'logo' ? "glow-indigo" : ""
          )}
        >
          <div className="flex items-center gap-4">
            <div className="icon-box icon-box-indigo">
              <PenTool className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white font-mono mb-1">{stats.logo}</p>
              <p className="text-sm text-zinc-500">Logo</p>
            </div>
          </div>
        </div>
        
        <div 
          onClick={() => setActiveFilter(activeFilter === 'product' ? 'all' : 'product')}
          className={cn(
            "glass-card rounded-2xl p-5 card-hover cursor-pointer",
            activeFilter === 'product' ? "glow-emerald" : ""
          )}
        >
          <div className="flex items-center gap-4">
            <div className="icon-box icon-box-emerald">
              <Package className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white font-mono mb-1">{stats.product}</p>
              <p className="text-sm text-zinc-500">Ürün Görseli</p>
            </div>
          </div>
        </div>
        
        <div 
          onClick={() => setActiveFilter(activeFilter === 'post' ? 'all' : 'post')}
          className={cn(
            "glass-card rounded-2xl p-5 card-hover cursor-pointer",
            activeFilter === 'post' ? "glow-amber" : ""
          )}
        >
          <div className="flex items-center gap-4">
            <div className="icon-box icon-box-amber">
              <ImageIcon className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white font-mono mb-1">{stats.post}</p>
              <p className="text-sm text-zinc-500">Örnek Post</p>
            </div>
          </div>
        </div>
        
        <div 
          onClick={() => setActiveFilter('all')}
          className={cn(
            "glass-card rounded-2xl p-5 card-hover cursor-pointer",
            activeFilter === 'all' ? "glow-violet" : ""
          )}
        >
          <div className="flex items-center gap-4">
            <div className="icon-box icon-box-violet">
              <Folder className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white font-mono mb-1">{stats.total}</p>
              <p className="text-sm text-zinc-500">Toplam</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "rounded-2xl p-8 text-center cursor-pointer transition-all",
          "border-2 border-dashed",
          isDragging 
            ? "border-emerald-500/80 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5" 
            : "border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-violet-500/3 hover:border-indigo-500/60 hover:from-indigo-500/10 hover:to-violet-500/6"
        )}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <div className="flex flex-col items-center">
          <div className={cn(
            "icon-box mb-4",
            isDragging ? "icon-box-emerald" : "icon-box-indigo"
          )} style={{ width: 56, height: 56, borderRadius: 16 }}>
            <CloudUpload className={cn("w-7 h-7", isDragging ? "text-emerald-400" : "text-indigo-400")} />
          </div>
          <p className="text-white font-medium mb-1">Dosyaları sürükle bırak</p>
          <p className="text-sm text-zinc-500 mb-3">
            veya <span className="text-indigo-400 hover:text-indigo-300 font-medium">dosya seç</span>
          </p>
          <p className="text-xs text-zinc-600">PNG, JPG, SVG, WebP, GIF • Max 10MB</p>
        </div>
      </div>

      {/* Filter Bar with Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Dosya ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 pl-10 pr-8 py-1.5 h-9 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          
          <button
            onClick={() => setActiveFilter('all')}
            className={cn(
              "filter-btn flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all border",
              activeFilter === 'all'
                ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400"
                : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            Tümü
          </button>
          <button
            onClick={() => setActiveFilter('logo')}
            className={cn(
              "filter-btn flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all border",
              activeFilter === 'logo'
                ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400"
                : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
            )}
          >
            <PenTool className="w-3.5 h-3.5" />
            Logolar
          </button>
          <button
            onClick={() => setActiveFilter('product')}
            className={cn(
              "filter-btn flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all border",
              activeFilter === 'product'
                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
            )}
          >
            <Package className="w-3.5 h-3.5" />
            Ürün Görselleri
          </button>
          <button
            onClick={() => setActiveFilter('post')}
            className={cn(
              "filter-btn flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all border",
              activeFilter === 'post'
                ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
                : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
            )}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Örnek Postlar
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Sırala:</span>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-[120px] h-9 bg-white/5 border-white/10 text-white text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">En Yeni</SelectItem>
              <SelectItem value="oldest">En Eski</SelectItem>
              <SelectItem value="name">İsim (A-Z)</SelectItem>
              <SelectItem value="size">Boyut</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Search className="w-4 h-4" />
          <span>"{searchQuery}" için {filteredFiles.length} sonuç bulundu</span>
          <button 
            onClick={() => setSearchQuery('')}
            className="text-indigo-400 hover:text-indigo-300"
          >
            Temizle
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* File Sections */}
          {activeFilter === 'all' ? (
            <div className="space-y-8">
              <FileSection category="logo" files={groupedFiles.logo} />
              <FileSection category="product" files={groupedFiles.product} />
              <FileSection category="post" files={groupedFiles.post} />
            </div>
          ) : (
            <FileSection category={activeFilter} files={filteredFiles} />
          )}

          {/* Empty State - No files at all */}
          {files.length === 0 && (
            <div className="glass-card rounded-2xl p-12 border border-white/10 text-center">
              <div className="icon-box icon-box-default w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Folder className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="font-semibold text-white mb-2">Henüz dosya yüklenmedi</h3>
              <p className="text-sm text-zinc-500 mb-6">
                Logo, ürün görseli veya örnek postları buradan yükleyebilirsin.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary px-5 py-2.5 rounded-xl inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                İlk Dosyayı Yükle
              </button>
            </div>
          )}
          
          {/* Empty State - No search results */}
          {files.length > 0 && filteredFiles.length === 0 && searchQuery && (
            <div className="glass-card rounded-2xl p-12 border border-white/10 text-center">
              <div className="icon-box icon-box-default w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="font-semibold text-white mb-2">Sonuç bulunamadı</h3>
              <p className="text-sm text-zinc-500 mb-4">
                "{searchQuery}" ile eşleşen dosya bulunamadı.
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="btn-secondary px-4 py-2 rounded-xl"
              >
                Aramayı Temizle
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, file: null })}
        onConfirm={handleDelete}
        variant="danger"
        title="Dosyayı Sil"
        description={`"${deleteModal.file?.file_name}" dosyasını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Sil"
        cancelText="İptal"
        isLoading={deletingId === deleteModal.file?.id}
      />

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl" style={{ backgroundColor: '#18181b' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="icon-box icon-box-indigo" style={{ width: 40, height: 40 }}>
                  <Upload className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Dosya Yükle</h2>
              </div>
              <button 
                onClick={closeUploadModal}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Preview - Click to change file */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-video bg-white/5 rounded-xl border border-white/10 border-dashed hover:border-indigo-500/50 flex items-center justify-center overflow-hidden cursor-pointer transition-colors group"
              >
                {pendingFiles.length > 0 && pendingFiles[0].type.startsWith('image/') ? (
                  <>
                    <img
                      src={URL.createObjectURL(pendingFiles[0])}
                      alt={pendingFiles[0].name}
                      className="max-w-full max-h-full object-contain"
                      onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-sm text-white font-medium">Değiştirmek için tıkla</span>
                    </div>
                  </>
                ) : pendingFiles.length > 0 ? (
                  <FileIcon className="w-12 h-12 text-zinc-600" />
                ) : (
                  <div className="text-center">
                    <CloudUpload className="w-12 h-12 text-zinc-600 mx-auto mb-2 group-hover:text-indigo-400 transition-colors" />
                    <p className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">Dosya seçmek için tıkla</p>
                  </div>
                )}
                
                {/* File Info Overlay */}
                {pendingFiles.length > 0 && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/60 backdrop-blur">
                      <FileIcon className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm text-white truncate flex-1">{pendingFiles[0].name}</span>
                      <span className="text-xs text-zinc-400 font-mono">{formatFileSize(pendingFiles[0].size)}</span>
                      {pendingFiles.length > 1 && (
                        <span className="text-xs text-indigo-400 font-medium">+{pendingFiles.length - 1} dosya</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Category Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-zinc-300">
                  Dosya Tipi <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['logo', 'product', 'post'] as FileCategory[]).map(cat => {
                    const config = getCategoryConfig(cat)
                    const Icon = config.icon
                    return (
                      <label key={cat} className="cursor-pointer">
                        <input 
                          type="radio" 
                          name="fileType" 
                          value={cat} 
                          checked={uploadCategory === cat}
                          onChange={() => setUploadCategory(cat)}
                          className="peer sr-only" 
                        />
                        <div className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                          uploadCategory === cat 
                            ? "border-indigo-500 bg-indigo-500/10" 
                            : "border-white/10 hover:border-white/20"
                        )}>
                          <div className={cn(
                            "p-2 rounded-xl",
                            cat === 'logo' && "bg-indigo-500/10",
                            cat === 'product' && "bg-emerald-500/10",
                            cat === 'post' && "bg-amber-500/10"
                          )}>
                            <Icon className={cn("w-5 h-5", config.textClass)} />
                          </div>
                          <span className="text-sm font-medium text-zinc-300">{config.label}</span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>
              
              {/* Logo Type Selection */}
              {uploadCategory === 'logo' && (
                <div className="space-y-3">
                  <Label className="text-zinc-300">Logo Tipi</Label>
                  <Select value={uploadLogoType} onValueChange={(v) => setUploadLogoType(v as LogoSubCategory)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOGO_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Error */}
              {uploadError && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
              )}
              
              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={closeUploadModal}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  İptal
                </button>
                <button 
                  onClick={handleUpload}
                  disabled={isUploading || pendingFiles.length === 0}
                  className="flex-1 btn-primary px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Yükleniyor...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Yükle
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
