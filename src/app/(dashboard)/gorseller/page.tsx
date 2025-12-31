'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  PenTool, Package, ImageIcon, Folder, Download, Trash2, Star,
  Layers, Search, X, Loader2, Eye, Building2, Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// ==========================================
// TYPES
// ==========================================
type FileCategory = 'logo' | 'product' | 'post'

interface CustomerFile {
  id: string
  customer_id: string
  category: FileCategory
  sub_category: string | null
  file_name: string
  file_url: string
  file_size: number
  mime_type: string
  is_primary: boolean
  created_at: string
  customer?: {
    id: string
    brand_name: string
  }
}

interface Customer {
  id: string
  brand_name: string
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
      glowClass: 'glow-indigo',
      iconBoxClass: 'icon-box-indigo',
      badgeClass: 'badge-indigo',
      textClass: 'text-indigo-400',
    },
    product: {
      label: 'Ürün Görseli',
      pluralLabel: 'Ürün Görselleri',
      icon: Package,
      glowClass: 'glow-emerald',
      iconBoxClass: 'icon-box-emerald',
      badgeClass: 'badge-emerald',
      textClass: 'text-emerald-400',
    },
    post: {
      label: 'Örnek Post',
      pluralLabel: 'Örnek Postlar',
      icon: ImageIcon,
      glowClass: 'glow-amber',
      iconBoxClass: 'icon-box-amber',
      badgeClass: 'badge-amber',
      textClass: 'text-amber-400',
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
  onPreview,
  isDeleting
}: {
  file: CustomerFile
  onDelete: (file: CustomerFile) => void
  onPreview: (file: CustomerFile) => void
  isDeleting: boolean
}) {
  const isImage = file.mime_type?.startsWith('image/')
  const config = getCategoryConfig(file.category)

  const getLogoBg = () => {
    if (file.category !== 'logo') return 'bg-zinc-800/50'
    if (file.sub_category === 'monochrome-dark') return 'bg-white'
    if (file.sub_category === 'monochrome-light') return 'bg-zinc-900'
    return 'bg-zinc-800/50'
  }

  return (
    <div className="file-card rounded-2xl overflow-hidden group">
      <div className={cn(
        "relative aspect-square flex items-center justify-center p-4",
        getLogoBg()
      )}>
        {/* Actions */}
        <div className="actions absolute top-3 right-3 flex gap-1 z-10">
          {isImage && (
            <button
              onClick={() => onPreview(file)}
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
            onClick={() => onDelete(file)}
            disabled={isDeleting}
            className="p-1.5 rounded-lg bg-black/50 text-white hover:bg-rose-500/70 transition-colors disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Primary Badge */}
        {file.is_primary && (
          <div className="absolute top-3 left-3 z-10">
            <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-black">
              <Star className="w-3 h-3" />
              Ana
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
        <div className="flex items-center gap-2 mt-2">
          {file.customer && (
            <span className="badge badge-violet text-[10px] truncate max-w-[100px]" title={file.customer.brand_name}>
              {file.customer.brand_name}
            </span>
          )}
          <span className={cn("badge", config.badgeClass)}>{config.label}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-zinc-500">{new Date(file.created_at).toLocaleDateString('tr-TR')}</span>
          <span className="text-xs text-zinc-500 font-mono">{formatFileSize(file.file_size)}</span>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function GorsellerPage() {
  const supabase = createClient()

  const [files, setFiles] = useState<CustomerFile[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<FileCategory | 'all'>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'size'>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; file: CustomerFile | null }>({ isOpen: false, file: null })
  const [previewFile, setPreviewFile] = useState<CustomerFile | null>(null)

  // Fetch files and customers
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        // Fetch all customers first
        const { data: customersData, error: customersError } = await supabase
          .from('customers')
          .select('id, brand_name')
          .eq('status', 'active')
          .order('brand_name')

        if (customersError) throw customersError
        const customersList: Customer[] = (customersData || []) as Customer[]
        setCustomers(customersList)

        // Fetch all files
        const { data: filesData, error: filesError } = await supabase
          .from('customer_files')
          .select('*')
          .order('created_at', { ascending: false })

        if (filesError) throw filesError

        // Map customer info to files
        const customersMap = new Map<string, Customer>(customersList.map(c => [c.id, c]))
        const filesWithCustomers = ((filesData || []) as CustomerFile[]).map(file => ({
          ...file,
          customer: customersMap.get(file.customer_id) || undefined
        }))

        setFiles(filesWithCustomers)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Stats
  const stats = useMemo(() => ({
    logo: files.filter(f => f.category === 'logo').length,
    product: files.filter(f => f.category === 'product').length,
    post: files.filter(f => f.category === 'post').length,
    total: files.length
  }), [files])

  // Filtered & Sorted files
  const filteredFiles = useMemo(() => {
    let result = [...files]

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter(f => f.category === activeCategory)
    }

    // Filter by customer
    if (selectedCustomer !== 'all') {
      result = result.filter(f => f.customer_id === selectedCustomer)
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(f =>
        f.file_name.toLowerCase().includes(query) ||
        f.customer?.brand_name.toLowerCase().includes(query)
      )
    }

    // Sort
    result.sort((a, b) => {
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
  }, [files, activeCategory, selectedCustomer, searchQuery, sortBy])

  // Group by category
  const groupedFiles = useMemo(() => ({
    logo: filteredFiles.filter(f => f.category === 'logo'),
    product: filteredFiles.filter(f => f.category === 'product'),
    post: filteredFiles.filter(f => f.category === 'post')
  }), [filteredFiles])

  // Delete handler
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
    } catch (err) {
      console.error('Error deleting file:', err)
    } finally {
      setDeletingId(null)
    }
  }

  // File Section Component
  const FileSection = ({ category, sectionFiles }: { category: FileCategory; sectionFiles: CustomerFile[] }) => {
    if (sectionFiles.length === 0) return null

    const config = getCategoryConfig(category)
    const Icon = config.icon

    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Icon className={cn("w-5 h-5", config.textClass)} />
          <h3 className="text-lg font-semibold text-white">{config.pluralLabel}</h3>
          <span className="badge badge-neutral font-mono">{sectionFiles.length}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {sectionFiles.map(file => (
            <FileCard
              key={file.id}
              file={file}
              onDelete={(f) => setDeleteModal({ isOpen: true, file: f })}
              onPreview={setPreviewFile}
              isDeleting={deletingId === file.id}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Tüm Dosyalar</h2>
        <p className="text-sm text-zinc-500 mt-1">Tüm markaların görselleri, logoları ve içerik dosyaları</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => setActiveCategory(activeCategory === 'logo' ? 'all' : 'logo')}
          className={cn(
            "glass-card rounded-2xl p-5 card-hover cursor-pointer",
            activeCategory === 'logo' ? "glow-indigo" : ""
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
          onClick={() => setActiveCategory(activeCategory === 'product' ? 'all' : 'product')}
          className={cn(
            "glass-card rounded-2xl p-5 card-hover cursor-pointer",
            activeCategory === 'product' ? "glow-emerald" : ""
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
          onClick={() => setActiveCategory(activeCategory === 'post' ? 'all' : 'post')}
          className={cn(
            "glass-card rounded-2xl p-5 card-hover cursor-pointer",
            activeCategory === 'post' ? "glow-amber" : ""
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
          onClick={() => setActiveCategory('all')}
          className={cn(
            "glass-card rounded-2xl p-5 card-hover cursor-pointer",
            activeCategory === 'all' ? "glow-violet" : ""
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

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-white/10">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Dosya veya marka ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Brand Filter */}
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-zinc-500" />
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Tüm Markalar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Markalar</SelectItem>
                {customers.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.brand_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-500" />
            <Select value={activeCategory} onValueChange={(v) => setActiveCategory(v as FileCategory | 'all')}>
              <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                <SelectItem value="logo">Logolar</SelectItem>
                <SelectItem value="product">Ürün Görselleri</SelectItem>
                <SelectItem value="post">Örnek Postlar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Sırala:</span>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-[120px] bg-white/5 border-white/10 text-white text-sm">
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

        {/* Active Filters */}
        {(selectedCustomer !== 'all' || activeCategory !== 'all' || searchQuery) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
            <span className="text-xs text-zinc-500">Aktif filtreler:</span>
            {selectedCustomer !== 'all' && (
              <span className="badge badge-violet flex items-center gap-1">
                {customers.find(c => c.id === selectedCustomer)?.brand_name}
                <button onClick={() => setSelectedCustomer('all')} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {activeCategory !== 'all' && (
              <span className={cn("badge flex items-center gap-1", getCategoryConfig(activeCategory).badgeClass)}>
                {getCategoryConfig(activeCategory).label}
                <button onClick={() => setActiveCategory('all')} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="badge badge-neutral flex items-center gap-1">
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCustomer('all')
                setActiveCategory('all')
                setSearchQuery('')
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 ml-auto"
            >
              Tümünü Temizle
            </button>
          </div>
        )}
      </div>

      {/* Search Results Info */}
      {(searchQuery || selectedCustomer !== 'all' || activeCategory !== 'all') && (
        <div className="text-sm text-zinc-500">
          {filteredFiles.length} dosya bulundu
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
          {activeCategory === 'all' ? (
            <div className="space-y-8">
              <FileSection category="logo" sectionFiles={groupedFiles.logo} />
              <FileSection category="product" sectionFiles={groupedFiles.product} />
              <FileSection category="post" sectionFiles={groupedFiles.post} />
            </div>
          ) : (
            <FileSection category={activeCategory} sectionFiles={filteredFiles} />
          )}

          {/* Empty State */}
          {files.length === 0 && (
            <div className="glass-card rounded-2xl p-12 border border-white/10 text-center">
              <div className="icon-box icon-box-default w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Folder className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="font-semibold text-white mb-2">Henüz dosya yüklenmedi</h3>
              <p className="text-sm text-zinc-500">
                Marka detay sayfalarından dosya yükleyebilirsiniz.
              </p>
            </div>
          )}

          {/* No Results */}
          {files.length > 0 && filteredFiles.length === 0 && (
            <div className="glass-card rounded-2xl p-12 border border-white/10 text-center">
              <div className="icon-box icon-box-default w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="font-semibold text-white mb-2">Sonuç bulunamadı</h3>
              <p className="text-sm text-zinc-500 mb-4">
                Filtreleri değiştirerek tekrar deneyin.
              </p>
              <button
                onClick={() => {
                  setSelectedCustomer('all')
                  setActiveCategory('all')
                  setSearchQuery('')
                }}
                className="btn-secondary px-4 py-2 rounded-xl"
              >
                Filtreleri Temizle
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

      {/* Preview Modal */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl bg-zinc-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              {previewFile?.file_name}
              {previewFile?.customer && (
                <span className="badge badge-violet text-xs">{previewFile.customer.brand_name}</span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-zinc-800 rounded-lg min-h-[400px]">
            {previewFile && (
              <img
                src={previewFile.file_url}
                alt={previewFile.file_name}
                className="max-w-full max-h-[60vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
