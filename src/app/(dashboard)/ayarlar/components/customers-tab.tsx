'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { Plus, Pencil, Trash2, Loader2, X, Search, Building2, Eye, EyeOff } from 'lucide-react'
import type { Database } from '@/types/database.types'

type Customer = Database['public']['Tables']['customers']['Row']
type CustomerType = Database['public']['Enums']['customer_type']

interface FormData {
  name: string
  email: string
  phone: string
  notes: string
  customer_type: CustomerType
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  notes: '',
  customer_type: 'retainer'
}

const customerTypeLabels: Record<CustomerType, string> = {
  retainer: 'Retainer',
  project: 'Proje',
  passive: 'Pasif'
}

const customerTypeColors: Record<CustomerType, string> = {
  retainer: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  project: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  passive: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
}

export function CustomersTab() {
  const { appUser } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [searchQuery, setSearchQuery] = useState('')
  const [showPassive, setShowPassive] = useState(false)

  const supabase = createClient()
  const isAdmin = appUser?.role === 'admin'

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name', { ascending: true })

    if (!error && data) {
      setCustomers(data)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const openModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer)
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        notes: customer.notes || '',
        customer_type: customer.customer_type || 'retainer'
      })
    } else {
      setEditingCustomer(null)
      setFormData(initialFormData)
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCustomer(null)
    setFormData(initialFormData)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) return

    setSaving(true)
    try {
      if (editingCustomer) {
        await supabase
          .from('customers')
          .update({
            name: formData.name.trim(),
            email: formData.email.trim() || null,
            phone: formData.phone.trim() || null,
            notes: formData.notes.trim() || null,
            customer_type: formData.customer_type,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCustomer.id)
      } else {
        await supabase
          .from('customers')
          .insert({
            name: formData.name.trim(),
            email: formData.email.trim() || null,
            phone: formData.phone.trim() || null,
            notes: formData.notes.trim() || null,
            customer_type: formData.customer_type,
            user_id: appUser?.id || ''
          })
      }
      closeModal()
      fetchCustomers()
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu musteriyi silmek istediginize emin misiniz?')) return

    setDeleting(id)
    try {
      await supabase.from('customers').delete().eq('id', id)
      fetchCustomers()
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setDeleting(null)
    }
  }

  // Filtrele: arama + pasif göster/gizle
  const filteredCustomers = customers.filter(customer => {
    // Arama filtresi
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery)

    // Pasif filtresi: showPassive false ise pasif müşterileri gizle
    const matchesTypeFilter = showPassive || customer.customer_type !== 'passive'

    return matchesSearch && matchesTypeFilter
  })

  // Aktif müşteri sayısı (retainer + project)
  const activeCustomerCount = customers.filter(c => c.customer_type !== 'passive').length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
      </div>
    )
  }

  return (
    <>
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <Building2 className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Musteriler</h3>
              <p className="text-xs text-zinc-500">
                {activeCustomerCount} aktif musteri
                {showPassive && customers.length > activeCustomerCount && (
                  <span className="text-zinc-600"> (+{customers.length - activeCustomerCount} pasif)</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Pasifleri Göster Toggle */}
            <button
              onClick={() => setShowPassive(!showPassive)}
              className={`h-9 px-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                showPassive
                  ? 'bg-zinc-500/20 text-zinc-300 border border-zinc-500/30'
                  : 'bg-white/5 text-zinc-500 border border-white/10 hover:bg-white/10'
              }`}
            >
              {showPassive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="hidden sm:inline">Pasifleri {showPassive ? 'Gizle' : 'Goster'}</span>
            </button>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-3 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
            {/* Add Button - Only Admin */}
            {isAdmin && (
              <button
                onClick={() => openModal()}
                className="h-9 px-3 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-2 text-sm font-medium hover:bg-indigo-500/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Yeni Musteri
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Ad</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Telefon</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Tip</th>
                {isAdmin && (
                  <th className="text-right px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Islemler</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-5 py-8 text-center text-zinc-500 text-sm">
                    {searchQuery ? 'Arama sonucu bulunamadi' : 'Henuz musteri eklenmemis'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-white">{customer.name}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-zinc-400">{customer.email || '-'}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-zinc-400">{customer.phone || '-'}</span>
                    </td>
                    <td className="px-5 py-3">
                      {customer.customer_type ? (
                        <span className={`text-xs px-2 py-1 rounded-full border ${customerTypeColors[customer.customer_type]}`}>
                          {customerTypeLabels[customer.customer_type]}
                        </span>
                      ) : '-'}
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal(customer)}
                            className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            disabled={deleting === customer.id}
                            className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                          >
                            {deleting === customer.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-card rounded-2xl border border-white/10 w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-semibold text-white">
                {editingCustomer ? 'Musteri Duzenle' : 'Yeni Musteri'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                  Ad <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Musteri adi"
                  className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@ornek.com"
                  className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Telefon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0532 123 4567"
                  className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Musteri Tipi</label>
                <select
                  value={formData.customer_type}
                  onChange={(e) => setFormData({ ...formData, customer_type: e.target.value as CustomerType })}
                  className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="retainer">Retainer</option>
                  <option value="project">Proje</option>
                  <option value="passive">Pasif</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Notlar</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ek notlar..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 border-t border-white/5 flex items-center justify-end gap-2">
              <button
                onClick={closeModal}
                className="h-10 px-4 rounded-lg bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 transition-colors"
              >
                Iptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name.trim()}
                className="h-10 px-4 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingCustomer ? 'Guncelle' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
