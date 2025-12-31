'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createUser, updateUser } from '../actions'
import { 
  Users, 
  Plus, 
  Pencil, 
  X, 
  Check, 
  Mail, 
  UserCheck,
  UserX,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { UserRole } from '@/lib/auth-types'

interface User {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  is_active: boolean
  created_at: string
}

const ROLES = [
  { value: 'admin', label: 'Admin', color: 'emerald', description: 'Tam yetki' },
  { value: 'yonetici', label: 'Yönetici', color: 'amber', description: 'Teknik + Ayarlar' },
  { value: 'operasyon', label: 'Operasyon', color: 'violet', description: 'Teknik + Personel' },
  { value: 'personel', label: 'Personel', color: 'blue', description: 'Günlük işler' },
  { value: 'stajer', label: 'Stajyer', color: 'cyan', description: 'Günlük işler' },
]

export function UsersTab() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'personel' as UserRole,
    password: ''
  })

  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      setLoading(true)
      const { data, error } = await (supabase
        .from('users') as any)
        .select('*')
        .order('is_active', { ascending: false }) // Aktifler önce
        .order('full_name', { ascending: true })  // Sonra isme göre

      if (error) throw error
      setUsers(data || [])
    } catch (err: any) {
      console.error('Error fetching users:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function openAddModal() {
    setEditingUser(null)
    setFormData({ email: '', full_name: '', role: 'personel', password: '' })
    setError(null)
    setIsModalOpen(true)
  }

  function openEditModal(user: User) {
    setEditingUser(user)
    setFormData({
      email: user.email,
      full_name: user.full_name || '',
      role: user.role,
      password: ''
    })
    setError(null)
    setIsModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (editingUser) {
        // Server action ile güncelle
        const result = await updateUser(editingUser.id, {
          full_name: formData.full_name,
          role: formData.role
        })
        
        if (!result.success) {
          throw new Error(result.error)
        }
      } else {
        // Server action ile oluştur
        const result = await createUser({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          role: formData.role
        })
        
        if (!result.success) {
          throw new Error(result.error)
        }
      }

      await fetchUsers()
      setIsModalOpen(false)
    } catch (err: any) {
      console.error('Error saving user:', err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleUserStatus(user: User) {
    try {
      const result = await updateUser(user.id, { is_active: !user.is_active })
      if (!result.success) {
        throw new Error(result.error)
      }
      await fetchUsers()
    } catch (err: any) {
      console.error('Error toggling user status:', err)
      setError(err.message)
    }
  }

  function getRoleBadgeClasses(role: string) {
    switch (role) {
      case 'admin':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'operasyon':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/20'
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    }
  }

  // Aktif ve pasif kullanıcıları ayır
  const activeUsers = users.filter(u => u.is_active)
  const inactiveUsers = users.filter(u => !u.is_active)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Kullanıcılar</h2>
          <p className="text-sm text-zinc-500">Personel hesaplarını yönetin</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Kullanıcı
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="glass-card rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-white/10">
              <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Kullanıcı</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Rol</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Durum</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Kayıt</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {/* Aktif kullanıcılar */}
            {activeUsers.map((user) => (
              <tr key={user.id} className="border-b border-zinc-200 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                        {user.full_name || 'İsimsiz'}
                      </p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", getRoleBadgeClasses(user.role))}>
                    {ROLES.find(r => r.value === user.role)?.label || user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-emerald-400 text-sm">
                    <UserCheck className="w-4 h-4" />
                    Aktif
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-zinc-500">
                    {new Date(user.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Pencil className="w-4 h-4 text-zinc-400" />
                    </button>
                    <button
                      onClick={() => toggleUserStatus(user)}
                      className="p-2 rounded-lg transition-colors hover:bg-red-500/10 text-red-400"
                      title="Deaktif Et"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {/* Pasif kullanıcılar - soluk görünüm */}
            {inactiveUsers.length > 0 && (
              <>
                {/* Ayırıcı */}
                {activeUsers.length > 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-2 bg-zinc-100 dark:bg-white/5">
                      <span className="text-xs text-zinc-500 font-medium">Pasif Kullanıcılar ({inactiveUsers.length})</span>
                    </td>
                  </tr>
                )}
                {inactiveUsers.map((user) => (
                  <tr key={user.id} className="border-b border-zinc-200 dark:border-white/5 opacity-50 hover:opacity-75 transition-opacity">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-400 dark:bg-zinc-700 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            {user.full_name || 'İsimsiz'}
                          </p>
                          <p className="text-xs text-zinc-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border opacity-50", getRoleBadgeClasses(user.role))}>
                        {ROLES.find(r => r.value === user.role)?.label || user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-zinc-500 text-sm">
                        <UserX className="w-4 h-4" />
                        Pasif
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-zinc-500">
                        {new Date(user.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Pencil className="w-4 h-4 text-zinc-400" />
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user)}
                          className="p-2 rounded-lg transition-colors hover:bg-emerald-500/10 text-emerald-400"
                          title="Aktif Et"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-500">Henüz kullanıcı yok</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">
                {editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">E-posta</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!!editingUser}
                    className={cn(
                      "w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500",
                      editingUser && "opacity-50 cursor-not-allowed"
                    )}
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Ad Soyad</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ad Soyad"
                />
              </div>

              {/* Password - only for new */}
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Şifre</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="En az 6 karakter"
                    minLength={6}
                    required
                  />
                </div>
              )}

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Rol</label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.value as any })}
                      className="px-3 py-2.5 rounded-lg border text-sm font-medium transition-all"
                      style={formData.role === role.value ? {
                        backgroundColor: role.color === 'emerald' ? 'rgba(16,185,129,0.2)' : role.color === 'violet' ? 'rgba(139,92,246,0.2)' : 'rgba(59,130,246,0.2)',
                        borderColor: role.color === 'emerald' ? 'rgba(16,185,129,0.5)' : role.color === 'violet' ? 'rgba(139,92,246,0.5)' : 'rgba(59,130,246,0.5)',
                        color: role.color === 'emerald' ? 'rgb(52,211,153)' : role.color === 'violet' ? 'rgb(167,139,250)' : 'rgb(96,165,250)'
                      } : { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgb(161,161,170)' }}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  {ROLES.find(r => r.value === formData.role)?.description}
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editingUser ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
