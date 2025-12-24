'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, Pencil, Trash2, Building2, ArrowRight, Clock, Globe, Users } from 'lucide-react'
import { getRecentCustomers, addToRecentCustomers, formatRelativeTime, type RecentCustomer } from '@/lib/local-storage'
import { CustomerBriefForm } from '@/components/customers/customer-brief-form'
import type { Customer, CustomerFormData } from '@/lib/customer-types'
import { SECTORS, BRAND_VOICES, calculateBriefCompletion } from '@/lib/customer-types'

// Helper functions
function getSectorLabel(value: string): string {
  return SECTORS.find(s => s.value === value)?.label || value
}

function getBrandVoiceLabel(value: string): string {
  return BRAND_VOICES.find(v => v.value === value)?.label || value
}

export default function MusterilerPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [recentCustomers, setRecentCustomers] = useState<RecentCustomer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  const supabase = createClient()

  // Fetch customers
  useEffect(() => {
    fetchCustomers()
    setRecentCustomers(getRecentCustomers())
  }, [])

  async function fetchCustomers() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCustomers(data || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter customers by search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.brand_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.sector?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Open sheet for new customer
  function handleNewCustomer() {
    setEditingCustomer(null)
    setSheetOpen(true)
  }

  // Open sheet for editing
  function handleEditCustomer(customer: Customer) {
    setEditingCustomer(customer)
    setSheetOpen(true)
  }

  // Save customer (create or update)
  async function handleSaveCustomer(formData: CustomerFormData) {
    setFormLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Oturum bulunamadı')

      // Clean up empty values
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => {
          if (v === null || v === undefined || v === '') return false
          if (Array.isArray(v) && v.length === 0) return false
          if (typeof v === 'object' && Object.keys(v).length === 0) return false
          return true
        })
      )

      if (editingCustomer) {
        // Update
        const { error } = await supabase
          .from('customers')
          // @ts-ignore
          .update({
            ...cleanedData,
            updated_at: new Date().toISOString()
          } as any)
          .eq('id', editingCustomer.id)

        if (error) throw error
      } else {
        // Create
        const { error } = await supabase
          .from('customers')
          // @ts-ignore
          .insert({
            ...cleanedData,
            user_id: user.id
          } as any)

        if (error) throw error
      }

      setSheetOpen(false)
      setEditingCustomer(null)
      fetchCustomers()
    } catch (error) {
      console.error('Error saving customer:', error)
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  // Delete customer
  async function handleDeleteCustomer() {
    if (!customerToDelete) return

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerToDelete.id)

      if (error) throw error

      setDeleteDialogOpen(false)
      setCustomerToDelete(null)
      fetchCustomers()
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }

  // Select customer (for content creation)
  function handleSelectCustomer(customer: Customer) {
    addToRecentCustomers({
      id: customer.id,
      name: customer.name,
      sector: customer.sector || ''
    })
    setRecentCustomers(getRecentCustomers())
    window.location.href = `/icerik-uret?customer=${customer.id}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Müşteriler</h1>
          <p className="text-muted-foreground mt-1">
            Müşteri brief&apos;lerini yönetin
          </p>
        </div>
        
        <Sheet open={sheetOpen} onOpenChange={(open) => {
          setSheetOpen(open)
          if (!open) setEditingCustomer(null)
        }}>
          <SheetTrigger asChild>
            <Button onClick={handleNewCustomer}>
