'use client'

import { useState, useEffect } from 'react'
import {
  User, Mail, Phone, Save, Loader2, Building2,
  CheckCircle, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { Customer } from '@/lib/customer-types'

interface CustomerContactTabProps {
  customer: Customer
  onSave: (data: ContactFormData) => Promise<void>
  isLoading?: boolean
}

export interface ContactFormData {
  billing_contact_name: string | null
  billing_contact_email: string | null
  billing_contact_phone: string | null
}

export function CustomerContactTab({ customer, onSave, isLoading }: CustomerContactTabProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    billing_contact_name: customer.billing_contact_name || '',
    billing_contact_email: customer.billing_contact_email || '',
    billing_contact_phone: customer.billing_contact_phone || ''
  })
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Reset form when customer changes
  useEffect(() => {
    setFormData({
      billing_contact_name: customer.billing_contact_name || '',
      billing_contact_email: customer.billing_contact_email || '',
      billing_contact_phone: customer.billing_contact_phone || ''
    })
  }, [customer])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveStatus('idle')

    try {
      await onSave({
        billing_contact_name: formData.billing_contact_name || null,
        billing_contact_email: formData.billing_contact_email || null,
        billing_contact_phone: formData.billing_contact_phone || null
      })
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch {
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const hasChanges =
    formData.billing_contact_name !== (customer.billing_contact_name || '') ||
    formData.billing_contact_email !== (customer.billing_contact_email || '') ||
    formData.billing_contact_phone !== (customer.billing_contact_phone || '')

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 border border-zinc-200 dark:border-white/10 mb-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-500/20 dark:to-blue-500/20 border border-cyan-200 dark:border-cyan-500/20">
            <Building2 className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Fatura İletişim Bilgileri</h2>
            <p className="text-sm text-zinc-500">Yenileme hatırlatmaları ve fatura bildirimleri için kullanılır</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="glass-card rounded-2xl p-6 border border-zinc-200 dark:border-white/10 space-y-6">

          {/* Contact Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <User className="w-4 h-4 text-zinc-400" />
              İletişim Kişisi
            </Label>
            <Input
              value={formData.billing_contact_name || ''}
              onChange={(e) => setFormData({ ...formData, billing_contact_name: e.target.value })}
              placeholder="Ad Soyad"
              className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-500"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-zinc-400" />
              E-posta Adresi
            </Label>
            <Input
              type="email"
              value={formData.billing_contact_email || ''}
              onChange={(e) => setFormData({ ...formData, billing_contact_email: e.target.value })}
              placeholder="ornek@sirket.com"
              className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-500"
            />
            <p className="text-xs text-zinc-400">Yenileme hatırlatmaları bu adrese gönderilir</p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-zinc-400" />
              Telefon Numarası
            </Label>
            <Input
              type="tel"
              value={formData.billing_contact_phone || ''}
              onChange={(e) => setFormData({ ...formData, billing_contact_phone: e.target.value })}
              placeholder="+90 5XX XXX XX XX"
              className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-500"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-200 dark:border-white/10 pt-6">
            <div className="flex items-center justify-between">
              {/* Status Message */}
              <div className="flex items-center gap-2">
                {saveStatus === 'success' && (
                  <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    Kaydedildi
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="flex items-center gap-1.5 text-sm text-rose-600 dark:text-rose-400">
                    <AlertCircle className="w-4 h-4" />
                    Hata oluştu
                  </span>
                )}
                {hasChanges && saveStatus === 'idle' && (
                  <span className="text-sm text-amber-600 dark:text-amber-400">
                    Kaydedilmemiş değişiklikler var
                  </span>
                )}
              </div>

              {/* Save Button */}
              <Button
                type="submit"
                disabled={saving || isLoading || !hasChanges}
                className={cn(
                  "btn-press flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg transition-all",
                  hasChanges
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/25"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                )}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Kaydet
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Info Card */}
      <div className="mt-6 glass-card rounded-2xl p-5 border border-zinc-200 dark:border-white/10 bg-gradient-to-br from-amber-50/50 dark:from-amber-950/20 to-orange-50/50 dark:to-orange-950/10">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-amber-500">💡</span>
          Bilgi
        </h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Bu bilgiler teknik hizmet yenilemelerinde (hosting, domain, SSL) hatırlatma göndermek için kullanılır.
          E-posta adresi girilmezse hatırlatmalar sadece panel üzerinden görüntülenebilir.
        </p>
      </div>
    </div>
  )
}
