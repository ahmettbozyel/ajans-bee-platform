'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { BloodType } from '@/lib/auth-types'
import {
  User,
  Phone,
  MapPin,
  Droplets,
  AlertCircle,
  Heart,
  Lock,
  Loader2,
  Check,
  Camera,
  Eye,
  EyeOff,
  Mail,
  Shield
} from 'lucide-react'

const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-']

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  yonetici: 'Yönetici',
  operasyon: 'Operasyon',
  personel: 'Personel',
  stajer: 'Stajyer'
}

export function ProfileTab() {
  const { appUser, refreshUser } = useAuth()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [bloodType, setBloodType] = useState<BloodType | ''>('')
  const [emergencyContactName, setEmergencyContactName] = useState('')
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('')
  const [healthNotes, setHealthNotes] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // UI state
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // Fetch user data
  useEffect(() => {
    if (appUser) {
      setPhone(appUser.phone || '')
      setAddress(appUser.address || '')
      setBloodType(appUser.blood_type || '')
      setEmergencyContactName(appUser.emergency_contact_name || '')
      setEmergencyContactPhone(appUser.emergency_contact_phone || '')
      setHealthNotes(appUser.health_notes || '')
      setAvatarUrl(appUser.avatar_url || null)
      setLoading(false)
    }
  }, [appUser])

  // Save profile
  const handleSaveProfile = async () => {
    if (!appUser) return

    setSavingProfile(true)
    setError(null)

    try {
      const { error: updateError } = await (supabase as any)
        .from('users')
        .update({
          phone: phone || null,
          address: address || null,
          blood_type: bloodType || null,
          emergency_contact_name: emergencyContactName || null,
          emergency_contact_phone: emergencyContactPhone || null,
          health_notes: healthNotes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', appUser.id)

      if (updateError) throw updateError

      // Refresh user data
      if (refreshUser) await refreshUser()

      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 2000)
    } catch (err: any) {
      console.error('Profile save error:', err)
      setError('Profil kaydedilirken bir hata oluştu')
    } finally {
      setSavingProfile(false)
    }
  }

  // Change password
  const handleChangePassword = async () => {
    setPasswordError(null)

    if (!currentPassword) {
      setPasswordError('Mevcut şifrenizi girin')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('Yeni şifre en az 6 karakter olmalı')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Şifreler eşleşmiyor')
      return
    }

    setSavingPassword(true)

    try {
      // First verify current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: appUser?.email || '',
        password: currentPassword
      })

      if (signInError) {
        setPasswordError('Mevcut şifre yanlış')
        setSavingPassword(false)
        return
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) throw updateError

      // Clear form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      setPasswordSaved(true)
      setTimeout(() => setPasswordSaved(false), 2000)
    } catch (err: any) {
      console.error('Password change error:', err)
      setPasswordError('Şifre değiştirilirken bir hata oluştu')
    } finally {
      setSavingPassword(false)
    }
  }

  // Upload avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !appUser) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Lütfen bir resim dosyası seçin')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Dosya boyutu 2MB\'dan küçük olmalı')
      return
    }

    setUploadingAvatar(true)
    setError(null)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${appUser.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update user
      const { error: updateError } = await (supabase as any)
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', appUser.id)

      if (updateError) throw updateError

      setAvatarUrl(publicUrl)
      if (refreshUser) await refreshUser()
    } catch (err: any) {
      console.error('Avatar upload error:', err)
      setError('Fotoğraf yüklenirken bir hata oluştu')
    } finally {
      setUploadingAvatar(false)
    }
  }

  if (loading) {
    return (
      <div className="glass-card rounded-2xl border border-white/10 p-12 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hata Mesajı */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <p className="text-sm text-rose-400">{error}</p>
        </div>
      )}

      {/* Kişisel Bilgiler */}
      <div className="glass-card rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <User className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Kişisel Bilgiler</h3>
            <p className="text-sm text-zinc-500">Profil bilgilerinizi güncelleyin</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-white/5 border-2 border-white/10 flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-zinc-500">
                    {appUser?.full_name?.charAt(0).toUpperCase() || '?'}
                  </span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-colors disabled:opacity-50"
              >
                {uploadingAvatar ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">Max 2MB, JPG/PNG</p>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-4">
            {/* Read-only fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-zinc-400 mb-1.5 block">Ad Soyad</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={appUser?.full_name || ''}
                    disabled
                    className="w-full h-11 pl-10 pr-4 rounded-xl text-sm text-zinc-400 bg-white/5 border border-white/10 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-1.5 block">E-posta</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={appUser?.email || ''}
                    disabled
                    className="w-full h-11 pl-10 pr-4 rounded-xl text-sm text-zinc-400 bg-white/5 border border-white/10 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-zinc-400 mb-1.5 block">Rol</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={ROLE_LABELS[appUser?.role || ''] || appUser?.role || ''}
                    disabled
                    className="w-full h-11 pl-10 pr-4 rounded-xl text-sm text-zinc-400 bg-white/5 border border-white/10 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-1.5 block">Telefon</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0532 123 45 67"
                    className="w-full h-11 pl-10 pr-4 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-1.5 block">Adres</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Adres bilgileriniz..."
                  rows={2}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acil Durum Bilgileri */}
      <div className="glass-card rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <Heart className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Acil Durum Bilgileri</h3>
            <p className="text-sm text-zinc-500">Acil durumlarda ulaşılacak bilgiler</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-zinc-400 mb-1.5 block">Kan Grubu</label>
            <div className="relative">
              <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value as BloodType | '')}
                className="w-full h-11 pl-10 pr-4 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">Seçin...</option>
                {BLOOD_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-1.5 block">Acil Durumda Aranacak Kişi</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                placeholder="Ad Soyad"
                className="w-full h-11 pl-10 pr-4 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-1.5 block">Acil Durumda Aranacak Telefon</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="tel"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                placeholder="0532 123 45 67"
                className="w-full h-11 pl-10 pr-4 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="text-sm text-zinc-400 mb-1.5 block">Sağlık Notu (Opsiyonel)</label>
            <div className="relative">
              <AlertCircle className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <textarea
                value={healthNotes}
                onChange={(e) => setHealthNotes(e.target.value)}
                placeholder="Alerji, kronik hastalık, kullanılan ilaçlar vs."
                rows={2}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Save Profile Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="h-11 px-6 rounded-xl text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {savingProfile ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : profileSaved ? (
              <Check className="w-4 h-4" />
            ) : null}
            {profileSaved ? 'Kaydedildi!' : 'Profili Kaydet'}
          </button>
        </div>
      </div>

      {/* Şifre Değiştir */}
      <div className="glass-card rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Lock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Şifre Değiştir</h3>
            <p className="text-sm text-zinc-500">Hesap şifrenizi güncelleyin</p>
          </div>
        </div>

        {passwordError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <p className="text-sm text-rose-400">{passwordError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-zinc-400 mb-1.5 block">Mevcut Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-10 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-1.5 block">Yeni Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-10 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-1.5 block">Yeni Şifre Tekrar</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-10 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleChangePassword}
            disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
            className="h-11 px-6 rounded-xl text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {savingPassword ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : passwordSaved ? (
              <Check className="w-4 h-4" />
            ) : null}
            {passwordSaved ? 'Güncellendi!' : 'Şifreyi Güncelle'}
          </button>
        </div>
      </div>
    </div>
  )
}
