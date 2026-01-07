// Supabase Database Types
// Son güncelleme: 2026-01-05
export type Database = {
  public: {
    Tables: {
      // ==================== USERS ====================
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'yonetici' | 'operasyon' | 'personel' | 'stajer'
          is_active: boolean
          created_at: string
          updated_at: string
          phone: string | null
          address: string | null
          blood_type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | '0+' | '0-' | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          health_notes: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'yonetici' | 'operasyon' | 'personel' | 'stajer'
          is_active?: boolean
          created_at?: string
          updated_at?: string
          phone?: string | null
          address?: string | null
          blood_type?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | '0+' | '0-' | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          health_notes?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'yonetici' | 'operasyon' | 'personel' | 'stajer'
          is_active?: boolean
          created_at?: string
          updated_at?: string
          phone?: string | null
          address?: string | null
          blood_type?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | '0+' | '0-' | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          health_notes?: string | null
          avatar_url?: string | null
        }
      }
      // ==================== ATTENDANCE ====================
      app_attendance: {
        Row: {
          id: string
          user_id: string
          date: string
          check_in: string | null
          check_out: string | null
          notes: string | null
          created_at: string
          updated_at: string
          check_in_lat: number | null
          check_in_lng: number | null
          check_out_lat: number | null
          check_out_lng: number | null
          check_in_location_type: 'office' | 'home' | 'other' | 'unknown' | null
          check_out_location_type: 'office' | 'home' | 'other' | 'unknown' | null
          status: 'normal' | 'late' | 'early_leave' | 'absent' | 'leave' | 'remote' | 'holiday' | null
          late_minutes: number | null
          overtime_minutes: number | null
          early_leave_minutes: number | null
          record_type: 'normal' | 'leave' | 'sick' | 'remote' | 'holiday' | null
          admin_notes: string | null
          late_reason: string | null
          overtime_reason: string | null
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          check_in?: string | null
          check_out?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          check_in_lat?: number | null
          check_in_lng?: number | null
          check_out_lat?: number | null
          check_out_lng?: number | null
          check_in_location_type?: 'office' | 'home' | 'other' | 'unknown' | null
          check_out_location_type?: 'office' | 'home' | 'other' | 'unknown' | null
          status?: 'normal' | 'late' | 'early_leave' | 'absent' | 'leave' | 'remote' | 'holiday' | null
          late_minutes?: number | null
          overtime_minutes?: number | null
          early_leave_minutes?: number | null
          record_type?: 'normal' | 'leave' | 'sick' | 'remote' | 'holiday' | null
          admin_notes?: string | null
          late_reason?: string | null
          overtime_reason?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          check_in?: string | null
          check_out?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          check_in_lat?: number | null
          check_in_lng?: number | null
          check_out_lat?: number | null
          check_out_lng?: number | null
          check_in_location_type?: 'office' | 'home' | 'other' | 'unknown' | null
          check_out_location_type?: 'office' | 'home' | 'other' | 'unknown' | null
          status?: 'normal' | 'late' | 'early_leave' | 'absent' | 'leave' | 'remote' | 'holiday' | null
          late_minutes?: number | null
          overtime_minutes?: number | null
          early_leave_minutes?: number | null
          record_type?: 'normal' | 'leave' | 'sick' | 'remote' | 'holiday' | null
          admin_notes?: string | null
          late_reason?: string | null
          overtime_reason?: string | null
        }
      }
      // ==================== TASK CATEGORIES ====================
      app_task_categories: {
        Row: {
          id: string
          name: string
          slug: string
          color: string
          icon: string
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          color?: string
          icon?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          color?: string
          icon?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      // ==================== DAILY TASKS ====================
      app_daily_tasks: {
        Row: {
          id: string
          user_id: string
          brand_id: string | null
          category_id: string
          description: string
          status: 'active' | 'paused' | 'completed'
          start_time: string
          end_time: string | null
          paused_at: string | null
          total_duration: number
          revision_count: number
          work_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          brand_id?: string | null
          category_id: string
          description: string
          status?: 'active' | 'paused' | 'completed'
          start_time?: string
          end_time?: string | null
          paused_at?: string | null
          total_duration?: number
          revision_count?: number
          work_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          brand_id?: string | null
          category_id?: string
          description?: string
          status?: 'active' | 'paused' | 'completed'
          start_time?: string
          end_time?: string | null
          paused_at?: string | null
          total_duration?: number
          revision_count?: number
          work_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      // ==================== TASK REVISIONS ====================
      app_task_revisions: {
        Row: {
          id: string
          task_id: string
          revision_number: number
          note: string | null
          start_time: string
          end_time: string | null
          duration: number
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          revision_number: number
          note?: string | null
          start_time?: string
          end_time?: string | null
          duration?: number
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          revision_number?: number
          note?: string | null
          start_time?: string
          end_time?: string | null
          duration?: number
          created_at?: string
        }
      }
      // ==================== NOTIFICATIONS ====================
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          is_read: boolean
          related_user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          is_read?: boolean
          related_user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          is_read?: boolean
          related_user_id?: string | null
          created_at?: string
        }
      }
      // ==================== CUSTOMERS ====================
      // Sadeleştirilmiş müşteri tablosu (12 alan)
      customers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          email: string | null
          phone: string | null
          notes: string | null
          user_id: string
          customer_type: 'retainer' | 'project' | 'passive'
          billing_contact_name: string | null
          billing_contact_email: string | null
          billing_contact_phone: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          email?: string | null
          phone?: string | null
          notes?: string | null
          user_id: string
          customer_type?: 'retainer' | 'project' | 'passive'
          billing_contact_name?: string | null
          billing_contact_email?: string | null
          billing_contact_phone?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          email?: string | null
          phone?: string | null
          notes?: string | null
          user_id?: string
          customer_type?: 'retainer' | 'project' | 'passive'
          billing_contact_name?: string | null
          billing_contact_email?: string | null
          billing_contact_phone?: string | null
        }
      }
      app_service_providers: {
        Row: {
          id: string
          name: string
          service_type: 'hosting' | 'domain' | 'ssl' | 'email'
          base_price_usd: number
          billing_cycle: 'monthly' | 'yearly'
          is_active: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          service_type: 'hosting' | 'domain' | 'ssl' | 'email'
          base_price_usd?: number
          billing_cycle?: 'monthly' | 'yearly'
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          service_type?: 'hosting' | 'domain' | 'ssl' | 'email'
          base_price_usd?: number
          billing_cycle?: 'monthly' | 'yearly'
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      app_technical_services: {
        Row: {
          id: string
          brand_id: string
          provider_id: string
          service_type: 'hosting' | 'domain' | 'ssl' | 'email'
          identifier: string
          renewal_date: string | null
          discount_percent: number
          quantity: number
          status: 'active' | 'pending_renewal' | 'expired' | 'cancelled'
          auto_renew: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          provider_id: string
          service_type: 'hosting' | 'domain' | 'ssl' | 'email'
          identifier: string
          renewal_date?: string | null
          discount_percent?: number
          quantity?: number
          status?: 'active' | 'pending_renewal' | 'expired' | 'cancelled'
          auto_renew?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          provider_id?: string
          service_type?: 'hosting' | 'domain' | 'ssl' | 'email'
          identifier?: string
          renewal_date?: string | null
          discount_percent?: number
          quantity?: number
          status?: 'active' | 'pending_renewal' | 'expired' | 'cancelled'
          auto_renew?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      app_renewal_history: {
        Row: {
          id: string
          service_id: string
          renewed_at: string
          price_usd: number
          exchange_rate: number | null
          price_try: number | null
          payment_status: 'paid' | 'pending' | 'overdue'
          invoice_no: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          service_id: string
          renewed_at?: string
          price_usd: number
          exchange_rate?: number | null
          price_try?: number | null
          payment_status?: 'paid' | 'pending' | 'overdue'
          invoice_no?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          service_id?: string
          renewed_at?: string
          price_usd?: number
          exchange_rate?: number | null
          price_try?: number | null
          payment_status?: 'paid' | 'pending' | 'overdue'
          invoice_no?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          created_at: string
          customer_id: string
          user_id: string
          platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'
          content_type: 'post' | 'story' | 'reel' | 'carousel'
          brief: string
          generated_content: string
          status: 'draft' | 'approved' | 'published'
          metadata: Record<string, unknown> | null
        }
        Insert: {
          id?: string
          created_at?: string
          customer_id: string
          user_id: string
          platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'
          content_type: 'post' | 'story' | 'reel' | 'carousel'
          brief: string
          generated_content: string
          status?: 'draft' | 'approved' | 'published'
          metadata?: Record<string, unknown> | null
        }
        Update: {
          id?: string
          created_at?: string
          customer_id?: string
          user_id?: string
          platform?: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'
          content_type?: 'post' | 'story' | 'reel' | 'carousel'
          brief?: string
          generated_content?: string
          status?: 'draft' | 'approved' | 'published'
          metadata?: Record<string, unknown> | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      platform_type: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok'
      content_type: 'post' | 'story' | 'reel' | 'carousel'
      post_status: 'draft' | 'approved' | 'published'
      customer_type: 'retainer' | 'project' | 'passive'
      customer_status: 'active' | 'inactive'
      service_type: 'hosting' | 'domain' | 'ssl' | 'email'
      payment_status: 'pending' | 'paid' | 'overdue'
      billing_cycle: 'monthly' | 'yearly'
      service_status: 'active' | 'pending_renewal' | 'expired' | 'cancelled'
      // Yeni enum'lar
      user_role: 'admin' | 'yonetici' | 'operasyon' | 'personel' | 'stajer'
      blood_type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | '0+' | '0-'
      attendance_status: 'normal' | 'late' | 'early_leave' | 'absent' | 'leave' | 'remote' | 'holiday'
      location_type: 'office' | 'home' | 'other' | 'unknown'
      record_type: 'normal' | 'leave' | 'sick' | 'remote' | 'holiday'
      task_status: 'active' | 'paused' | 'completed'
    }
  }
}

// Helper types
export type Customer = Database['public']['Tables']['customers']['Row']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export type ServiceProvider = Database['public']['Tables']['app_service_providers']['Row']
export type ServiceProviderInsert = Database['public']['Tables']['app_service_providers']['Insert']
export type ServiceProviderUpdate = Database['public']['Tables']['app_service_providers']['Update']

export type TechnicalService = Database['public']['Tables']['app_technical_services']['Row']
export type TechnicalServiceInsert = Database['public']['Tables']['app_technical_services']['Insert']
export type TechnicalServiceUpdate = Database['public']['Tables']['app_technical_services']['Update']

export type RenewalHistory = Database['public']['Tables']['app_renewal_history']['Row']
export type RenewalHistoryInsert = Database['public']['Tables']['app_renewal_history']['Insert']
export type RenewalHistoryUpdate = Database['public']['Tables']['app_renewal_history']['Update']

export type Post = Database['public']['Tables']['posts']['Row']
export type PostInsert = Database['public']['Tables']['posts']['Insert']
export type PostUpdate = Database['public']['Tables']['posts']['Update']

export type Platform = Database['public']['Enums']['platform_type']
export type ContentType = Database['public']['Enums']['content_type']
export type PostStatus = Database['public']['Enums']['post_status']
export type CustomerType = Database['public']['Enums']['customer_type']
export type CustomerStatus = Database['public']['Enums']['customer_status']
export type ServiceType = Database['public']['Enums']['service_type']
export type PaymentStatus = Database['public']['Enums']['payment_status']
export type BillingCycle = Database['public']['Enums']['billing_cycle']
export type ServiceStatus = Database['public']['Enums']['service_status']

// Yeni helper types
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Attendance = Database['public']['Tables']['app_attendance']['Row']
export type AttendanceInsert = Database['public']['Tables']['app_attendance']['Insert']
export type AttendanceUpdate = Database['public']['Tables']['app_attendance']['Update']

export type TaskCategory = Database['public']['Tables']['app_task_categories']['Row']
export type TaskCategoryInsert = Database['public']['Tables']['app_task_categories']['Insert']
export type TaskCategoryUpdate = Database['public']['Tables']['app_task_categories']['Update']

export type DailyTask = Database['public']['Tables']['app_daily_tasks']['Row']
export type DailyTaskInsert = Database['public']['Tables']['app_daily_tasks']['Insert']
export type DailyTaskUpdate = Database['public']['Tables']['app_daily_tasks']['Update']

export type TaskRevision = Database['public']['Tables']['app_task_revisions']['Row']
export type TaskRevisionInsert = Database['public']['Tables']['app_task_revisions']['Insert']
export type TaskRevisionUpdate = Database['public']['Tables']['app_task_revisions']['Update']

export type Notification = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update']

// Enum helper types
export type UserRole = Database['public']['Enums']['user_role']
export type BloodType = Database['public']['Enums']['blood_type']
export type AttendanceStatus = Database['public']['Enums']['attendance_status']
export type LocationType = Database['public']['Enums']['location_type']
export type RecordType = Database['public']['Enums']['record_type']
export type TaskStatus = Database['public']['Enums']['task_status']
