export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      app_attendance: {
        Row: {
          admin_notes: string | null
          check_in: string | null
          check_in_lat: number | null
          check_in_lng: number | null
          check_in_location_type: string | null
          check_out: string | null
          check_out_lat: number | null
          check_out_lng: number | null
          check_out_location_type: string | null
          created_at: string | null
          date: string
          early_leave_minutes: number | null
          id: string
          late_minutes: number | null
          late_reason: string | null
          leave_reason: string | null
          leave_type: string | null
          notes: string | null
          overtime_minutes: number | null
          overtime_reason: string | null
          record_type: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          check_in?: string | null
          check_in_lat?: number | null
          check_in_lng?: number | null
          check_in_location_type?: string | null
          check_out?: string | null
          check_out_lat?: number | null
          check_out_lng?: number | null
          check_out_location_type?: string | null
          created_at?: string | null
          date?: string
          early_leave_minutes?: number | null
          id?: string
          late_minutes?: number | null
          late_reason?: string | null
          leave_reason?: string | null
          leave_type?: string | null
          notes?: string | null
          overtime_minutes?: number | null
          overtime_reason?: string | null
          record_type?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          check_in?: string | null
          check_in_lat?: number | null
          check_in_lng?: number | null
          check_in_location_type?: string | null
          check_out?: string | null
          check_out_lat?: number | null
          check_out_lng?: number | null
          check_out_location_type?: string | null
          created_at?: string | null
          date?: string
          early_leave_minutes?: number | null
          id?: string
          late_minutes?: number | null
          late_reason?: string | null
          leave_reason?: string | null
          leave_type?: string | null
          notes?: string | null
          overtime_minutes?: number | null
          overtime_reason?: string | null
          record_type?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_company_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      app_daily_tasks: {
        Row: {
          brand_id: string | null
          category_id: string
          created_at: string | null
          description: string
          end_time: string | null
          id: string
          paused_at: string | null
          revision_count: number | null
          start_time: string
          status: string
          total_duration: number | null
          updated_at: string | null
          user_id: string
          work_date: string
        }
        Insert: {
          brand_id?: string | null
          category_id: string
          created_at?: string | null
          description: string
          end_time?: string | null
          id?: string
          paused_at?: string | null
          revision_count?: number | null
          start_time?: string
          status?: string
          total_duration?: number | null
          updated_at?: string | null
          user_id: string
          work_date?: string
        }
        Update: {
          brand_id?: string | null
          category_id?: string
          created_at?: string | null
          description?: string
          end_time?: string | null
          id?: string
          paused_at?: string | null
          revision_count?: number | null
          start_time?: string
          status?: string
          total_duration?: number | null
          updated_at?: string | null
          user_id?: string
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_tasks_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_tasks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "app_task_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_holidays: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          id: string
          is_recurring: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      app_renewal_history: {
        Row: {
          created_at: string | null
          exchange_rate: number | null
          id: string
          invoice_no: string | null
          notes: string | null
          payment_status: string
          price_try: number | null
          price_usd: number
          renewed_at: string
          service_id: string
        }
        Insert: {
          created_at?: string | null
          exchange_rate?: number | null
          id?: string
          invoice_no?: string | null
          notes?: string | null
          payment_status?: string
          price_try?: number | null
          price_usd: number
          renewed_at?: string
          service_id: string
        }
        Update: {
          created_at?: string | null
          exchange_rate?: number | null
          id?: string
          invoice_no?: string | null
          notes?: string | null
          payment_status?: string
          price_try?: number | null
          price_usd?: number
          renewed_at?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "renewal_history_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "app_technical_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "renewal_history_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "overdue_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "renewal_history_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "this_week_renewals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "renewal_history_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "upcoming_renewals"
            referencedColumns: ["id"]
          },
        ]
      }
      app_service_providers: {
        Row: {
          base_price_usd: number
          billing_cycle: string
          created_at: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          service_type: string
          updated_at: string | null
        }
        Insert: {
          base_price_usd?: number
          billing_cycle?: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          service_type: string
          updated_at?: string | null
        }
        Update: {
          base_price_usd?: number
          billing_cycle?: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          service_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      app_task_categories: {
        Row: {
          color: string
          created_at: string | null
          icon: string
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          color?: string
          created_at?: string | null
          icon?: string
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          color?: string
          created_at?: string | null
          icon?: string
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      app_task_revisions: {
        Row: {
          created_at: string | null
          duration: number | null
          end_time: string | null
          id: string
          note: string | null
          revision_number: number
          start_time: string
          task_id: string
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          end_time?: string | null
          id?: string
          note?: string | null
          revision_number: number
          start_time?: string
          task_id: string
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          end_time?: string | null
          id?: string
          note?: string | null
          revision_number?: number
          start_time?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_revisions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "app_daily_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      app_technical_services: {
        Row: {
          auto_renew: boolean | null
          brand_id: string
          created_at: string | null
          discount_percent: number | null
          id: string
          identifier: string
          notes: string | null
          provider_id: string
          quantity: number | null
          renewal_date: string | null
          service_type: string
          status: string
          updated_at: string | null
        }
        Insert: {
          auto_renew?: boolean | null
          brand_id: string
          created_at?: string | null
          discount_percent?: number | null
          id?: string
          identifier: string
          notes?: string | null
          provider_id: string
          quantity?: number | null
          renewal_date?: string | null
          service_type: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          auto_renew?: boolean | null
          brand_id?: string
          created_at?: string | null
          discount_percent?: number | null
          id?: string
          identifier?: string
          notes?: string | null
          provider_id?: string
          quantity?: number | null
          renewal_date?: string | null
          service_type?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technical_services_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technical_services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "app_service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      app_weekly_schedules: {
        Row: {
          created_at: string | null
          id: string
          schedule: Json
          updated_at: string | null
          week_start: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          schedule: Json
          updated_at?: string | null
          week_start: string
        }
        Update: {
          created_at?: string | null
          id?: string
          schedule?: Json
          updated_at?: string | null
          week_start?: string
        }
        Relationships: []
      }
      cms_activity_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          model: string | null
          model_id: string | null
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          model?: string | null
          model_id?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          model?: string | null
          model_id?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cms_activity_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          model: string | null
          model_id: string | null
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          model?: string | null
          model_id?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          model?: string | null
          model_id?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cms_blog_categories: {
        Row: {
          created_at: string | null
          id: string
          parent_id: string | null
          site_id: string | null
          slug: string
          sort_order: number | null
          status: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          parent_id?: string | null
          site_id?: string | null
          slug: string
          sort_order?: number | null
          status?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          parent_id?: string | null
          site_id?: string | null
          slug?: string
          sort_order?: number | null
          status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_blog_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cms_blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_blog_categories_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "cms_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_blog_category_translations: {
        Row: {
          category_id: string
          description: string | null
          id: string
          lang: string
          meta_description: string | null
          meta_title: string | null
          name: string
        }
        Insert: {
          category_id: string
          description?: string | null
          id?: string
          lang: string
          meta_description?: string | null
          meta_title?: string | null
          name: string
        }
        Update: {
          category_id?: string
          description?: string | null
          id?: string
          lang?: string
          meta_description?: string | null
          meta_title?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_blog_category_translations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "cms_blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_blog_post_translations: {
        Row: {
          content: string | null
          excerpt: string | null
          id: string
          lang: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          post_id: string
          title: string
        }
        Insert: {
          content?: string | null
          excerpt?: string | null
          id?: string
          lang: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          post_id: string
          title: string
        }
        Update: {
          content?: string | null
          excerpt?: string | null
          id?: string
          lang?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          post_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_blog_post_translations_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "cms_blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_blog_posts: {
        Row: {
          category_id: string | null
          created_at: string | null
          created_by: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          site_id: string | null
          slug: string
          status: string | null
          updated_at: string | null
          views: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          site_id?: string | null
          slug: string
          status?: string | null
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          site_id?: string | null
          slug?: string
          status?: string | null
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "cms_blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_blog_posts_featured_image_fkey"
            columns: ["featured_image"]
            isOneToOne: false
            referencedRelation: "cms_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_blog_posts_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "cms_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_content_categories: {
        Row: {
          content_type_id: string
          created_at: string | null
          id: string
          image: string | null
          parent_id: string | null
          slug: string
          sort_order: number | null
          status: boolean | null
        }
        Insert: {
          content_type_id: string
          created_at?: string | null
          id?: string
          image?: string | null
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          status?: boolean | null
        }
        Update: {
          content_type_id?: string
          created_at?: string | null
          id?: string
          image?: string | null
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_categories_content_type_id_fkey"
            columns: ["content_type_id"]
            isOneToOne: false
            referencedRelation: "cms_content_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_content_categories_image_fkey"
            columns: ["image"]
            isOneToOne: false
            referencedRelation: "cms_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_content_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cms_content_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_content_category_translations: {
        Row: {
          category_id: string
          description: string | null
          id: string
          lang: string
          meta_description: string | null
          meta_title: string | null
          name: string
        }
        Insert: {
          category_id: string
          description?: string | null
          id?: string
          lang: string
          meta_description?: string | null
          meta_title?: string | null
          name: string
        }
        Update: {
          category_id?: string
          description?: string | null
          id?: string
          lang?: string
          meta_description?: string | null
          meta_title?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_category_translations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "cms_content_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_content_field_values: {
        Row: {
          content_id: string
          created_at: string | null
          field_id: string
          id: string
          lang: string
          value: string | null
        }
        Insert: {
          content_id: string
          created_at?: string | null
          field_id: string
          id?: string
          lang?: string
          value?: string | null
        }
        Update: {
          content_id?: string
          created_at?: string | null
          field_id?: string
          id?: string
          lang?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_field_values_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "cms_contents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_content_field_values_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "cms_content_type_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_content_translations: {
        Row: {
          content: string | null
          content_id: string
          custom_fields: Json | null
          excerpt: string | null
          id: string
          lang: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          title: string
        }
        Insert: {
          content?: string | null
          content_id: string
          custom_fields?: Json | null
          excerpt?: string | null
          id?: string
          lang: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          title: string
        }
        Update: {
          content?: string | null
          content_id?: string
          custom_fields?: Json | null
          excerpt?: string | null
          id?: string
          lang?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_translations_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "cms_contents"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_content_type_field_translations: {
        Row: {
          field_id: string
          help_text: string | null
          id: string
          label: string
          lang: string
          placeholder: string | null
        }
        Insert: {
          field_id: string
          help_text?: string | null
          id?: string
          label: string
          lang: string
          placeholder?: string | null
        }
        Update: {
          field_id?: string
          help_text?: string | null
          id?: string
          label?: string
          lang?: string
          placeholder?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_type_field_translations_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "cms_content_type_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_content_type_fields: {
        Row: {
          content_type_id: string
          field_name: string
          field_options: Json | null
          field_type: string | null
          id: string
          is_required: boolean | null
          is_translatable: boolean | null
          sort_order: number | null
        }
        Insert: {
          content_type_id: string
          field_name: string
          field_options?: Json | null
          field_type?: string | null
          id?: string
          is_required?: boolean | null
          is_translatable?: boolean | null
          sort_order?: number | null
        }
        Update: {
          content_type_id?: string
          field_name?: string
          field_options?: Json | null
          field_type?: string | null
          id?: string
          is_required?: boolean | null
          is_translatable?: boolean | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_type_fields_content_type_id_fkey"
            columns: ["content_type_id"]
            isOneToOne: false
            referencedRelation: "cms_content_types"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_content_type_translations: {
        Row: {
          content_type_id: string
          id: string
          lang: string
          name: string
          name_singular: string
        }
        Insert: {
          content_type_id: string
          id?: string
          lang: string
          name: string
          name_singular: string
        }
        Update: {
          content_type_id?: string
          id?: string
          lang?: string
          name?: string
          name_singular?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_type_translations_content_type_id_fkey"
            columns: ["content_type_id"]
            isOneToOne: false
            referencedRelation: "cms_content_types"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_content_types: {
        Row: {
          created_at: string | null
          has_categories: boolean | null
          has_featured_image: boolean | null
          icon: string | null
          id: string
          site_id: string | null
          slug: string
          sort_order: number | null
          status: boolean | null
        }
        Insert: {
          created_at?: string | null
          has_categories?: boolean | null
          has_featured_image?: boolean | null
          icon?: string | null
          id?: string
          site_id?: string | null
          slug: string
          sort_order?: number | null
          status?: boolean | null
        }
        Update: {
          created_at?: string | null
          has_categories?: boolean | null
          has_featured_image?: boolean | null
          icon?: string | null
          id?: string
          site_id?: string | null
          slug?: string
          sort_order?: number | null
          status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_types_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "cms_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_contents: {
        Row: {
          category_id: string | null
          content_type_id: string
          created_at: string | null
          created_by: string | null
          custom_fields: Json | null
          featured_image: string | null
          gallery: Json | null
          id: string
          published_at: string | null
          site_id: string | null
          slug: string
          sort_order: number | null
          status: string | null
          updated_at: string | null
          views: number | null
        }
        Insert: {
          category_id?: string | null
          content_type_id: string
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          featured_image?: string | null
          gallery?: Json | null
          id?: string
          published_at?: string | null
          site_id?: string | null
          slug: string
          sort_order?: number | null
          status?: string | null
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          category_id?: string | null
          content_type_id?: string
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          featured_image?: string | null
          gallery?: Json | null
          id?: string
          published_at?: string | null
          site_id?: string | null
          slug?: string
          sort_order?: number | null
          status?: string | null
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_contents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "cms_content_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_contents_content_type_id_fkey"
            columns: ["content_type_id"]
            isOneToOne: false
            referencedRelation: "cms_content_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_contents_featured_image_fkey"
            columns: ["featured_image"]
            isOneToOne: false
            referencedRelation: "cms_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_contents_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "cms_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_form_field_translations: {
        Row: {
          field_id: string
          help_text: string | null
          id: string
          label: string
          lang: string
          options: Json | null
          placeholder: string | null
        }
        Insert: {
          field_id: string
          help_text?: string | null
          id?: string
          label: string
          lang: string
          options?: Json | null
          placeholder?: string | null
        }
        Update: {
          field_id?: string
          help_text?: string | null
          id?: string
          label?: string
          lang?: string
          options?: Json | null
          placeholder?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_form_field_translations_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "cms_form_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_form_fields: {
        Row: {
          field_name: string
          field_options: Json | null
          field_type: string | null
          form_id: string
          id: string
          is_required: boolean | null
          sort_order: number | null
          validation: Json | null
        }
        Insert: {
          field_name: string
          field_options?: Json | null
          field_type?: string | null
          form_id: string
          id?: string
          is_required?: boolean | null
          sort_order?: number | null
          validation?: Json | null
        }
        Update: {
          field_name?: string
          field_options?: Json | null
          field_type?: string | null
          form_id?: string
          id?: string
          is_required?: boolean | null
          sort_order?: number | null
          validation?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_form_fields_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "cms_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_form_submissions: {
        Row: {
          created_at: string | null
          data: Json
          files: Json | null
          form_id: string
          id: string
          ip_address: string | null
          lang: string | null
          notes: string | null
          page_url: string | null
          read_at: string | null
          read_by: string | null
          status: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          files?: Json | null
          form_id: string
          id?: string
          ip_address?: string | null
          lang?: string | null
          notes?: string | null
          page_url?: string | null
          read_at?: string | null
          read_by?: string | null
          status?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          files?: Json | null
          form_id?: string
          id?: string
          ip_address?: string | null
          lang?: string | null
          notes?: string | null
          page_url?: string | null
          read_at?: string | null
          read_by?: string | null
          status?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_form_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "cms_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_form_translations: {
        Row: {
          form_id: string
          id: string
          lang: string
          name: string
        }
        Insert: {
          form_id: string
          id?: string
          lang: string
          name: string
        }
        Update: {
          form_id?: string
          id?: string
          lang?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_form_translations_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "cms_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_forms: {
        Row: {
          created_at: string | null
          email_template: string | null
          email_to: string | null
          id: string
          site_id: string | null
          slug: string
          status: boolean | null
          success_message: Json | null
        }
        Insert: {
          created_at?: string | null
          email_template?: string | null
          email_to?: string | null
          id?: string
          site_id?: string | null
          slug: string
          status?: boolean | null
          success_message?: Json | null
        }
        Update: {
          created_at?: string | null
          email_template?: string | null
          email_to?: string | null
          id?: string
          site_id?: string | null
          slug?: string
          status?: boolean | null
          success_message?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_forms_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "cms_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_languages: {
        Row: {
          code: string
          created_at: string | null
          flag: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          native_name: string
          site_id: string | null
          sort_order: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          flag?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          native_name: string
          site_id?: string | null
          sort_order?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          flag?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          native_name?: string
          site_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_languages_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "cms_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_media: {
        Row: {
          alt_text: string | null
          created_at: string | null
          description: string | null
          filename: string
          filepath: string
          filesize: number
          filetype: string
          folder: string | null
          height: number | null
          id: string
          mime_type: string
          original_name: string
          site_id: string | null
          title: string | null
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          description?: string | null
          filename: string
          filepath: string
          filesize: number
          filetype: string
          folder?: string | null
          height?: number | null
          id?: string
          mime_type: string
          original_name: string
          site_id?: string | null
          title?: string | null
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          description?: string | null
          filename?: string
          filepath?: string
          filesize?: number
          filetype?: string
          folder?: string | null
          height?: number | null
          id?: string
          mime_type?: string
          original_name?: string
          site_id?: string | null
          title?: string | null
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_media_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "cms_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_menu_item_translations: {
        Row: {
          id: string
          lang: string
          menu_item_id: string
          title: string
        }
        Insert: {
          id?: string
          lang: string
          menu_item_id: string
          title: string
        }
        Update: {
          id?: string
          lang?: string
          menu_item_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_menu_item_translations_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "cms_menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_menu_items: {
        Row: {
          icon: string | null
          id: string
          menu_id: string
          parent_id: string | null
          reference_id: string | null
          sort_order: number | null
          status: boolean | null
          target: string | null
          type: string | null
          url: string | null
        }
        Insert: {
          icon?: string | null
          id?: string
          menu_id: string
          parent_id?: string | null
          reference_id?: string | null
          sort_order?: number | null
          status?: boolean | null
          target?: string | null
          type?: string | null
          url?: string | null
        }
        Update: {
          icon?: string | null
          id?: string
          menu_id?: string
          parent_id?: string | null
          reference_id?: string | null
          sort_order?: number | null
          status?: boolean | null
          target?: string | null
          type?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_menu_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "cms_menus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cms_menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_menus: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          site_id: string | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          site_id?: string | null
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          site_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_menus_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "cms_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_page_translations: {
        Row: {
          content: string | null
          id: string
          lang: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          page_id: string
          title: string
        }
        Insert: {
          content?: string | null
          id?: string
          lang: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          page_id: string
          title: string
        }
        Update: {
          content?: string | null
          id?: string
          lang?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          page_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_page_translations_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "cms_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_pages: {
        Row: {
          created_at: string | null
          created_by: string | null
          featured_image: string | null
          id: string
          parent_id: string | null
          site_id: string | null
          slug: string
          sort_order: number | null
          status: string | null
          template: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          featured_image?: string | null
          id?: string
          parent_id?: string | null
          site_id?: string | null
          slug: string
          sort_order?: number | null
          status?: string | null
          template?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          featured_image?: string | null
          id?: string
          parent_id?: string | null
          site_id?: string | null
          slug?: string
          sort_order?: number | null
          status?: string | null
          template?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_pages_featured_image_fkey"
            columns: ["featured_image"]
            isOneToOne: false
            referencedRelation: "cms_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_pages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cms_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cms_pages_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "cms_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_settings: {
        Row: {
          created_at: string | null
          id: string
          lang: string | null
          setting_group: string | null
          setting_key: string
          setting_value: string | null
          site_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lang?: string | null
          setting_group?: string | null
          setting_key: string
          setting_value?: string | null
          site_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lang?: string | null
          setting_group?: string | null
          setting_key?: string
          setting_value?: string | null
          site_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_settings_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "cms_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_sites: {
        Row: {
          created_at: string | null
          domain: string | null
          favicon_url: string | null
          id: string
          is_active: boolean | null
          logo: string | null
          logo_url: string | null
          name: string
          settings: Json | null
          slug: string
          theme: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          favicon_url?: string | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          logo_url?: string | null
          name: string
          settings?: Json | null
          slug: string
          theme?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          favicon_url?: string | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          logo_url?: string | null
          name?: string
          settings?: Json | null
          slug?: string
          theme?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cms_user_sites: {
        Row: {
          created_at: string | null
          id: string
          role: string | null
          site_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string | null
          site_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string | null
          site_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_user_sites_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "cms_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          last_login: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          last_login?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          last_login?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          billing_contact_email: string | null
          billing_contact_name: string | null
          billing_contact_phone: string | null
          created_at: string
          customer_type: Database["public"]["Enums"]["customer_type"]
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_contact_email?: string | null
          billing_contact_name?: string | null
          billing_contact_phone?: string | null
          created_at?: string
          customer_type?: Database["public"]["Enums"]["customer_type"]
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_contact_email?: string | null
          billing_contact_name?: string | null
          billing_contact_phone?: string | null
          created_at?: string
          customer_type?: Database["public"]["Enums"]["customer_type"]
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          address: string | null
          avatar_url: string | null
          blood_type: string | null
          created_at: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string | null
          health_notes: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          blood_type?: string | null
          created_at?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          health_notes?: string | null
          id: string
          is_active?: boolean | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          blood_type?: string | null
          created_at?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          health_notes?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      daily_stats: {
        Row: {
          active_customers: number | null
          active_services: number | null
          monthly_renewal_value: number | null
          overdue_services: number | null
          renewals_this_week: number | null
          report_date: string | null
        }
        Relationships: []
      }
      overdue_services: {
        Row: {
          brand_name: string | null
          days_until: number | null
          id: string | null
          identifier: string | null
          provider_name: string | null
          renewal_date: string | null
          service_type: string | null
        }
        Relationships: []
      }
      this_week_renewals: {
        Row: {
          brand_name: string | null
          days_until: number | null
          id: string | null
          identifier: string | null
          provider_name: string | null
          renewal_date: string | null
          service_type: string | null
        }
        Relationships: []
      }
      upcoming_renewals: {
        Row: {
          base_price_usd: number | null
          billing_contact_email: string | null
          billing_contact_name: string | null
          brand_name: string | null
          days_until: number | null
          id: string | null
          identifier: string | null
          notification_type: string | null
          provider_name: string | null
          renewal_date: string | null
          service_type: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      content_type: "post" | "story" | "reel" | "carousel"
      customer_type: "retainer" | "project" | "passive"
      file_category: "logo" | "product" | "post"
      logo_sub_category:
        | "primary"
        | "white"
        | "black"
        | "icon"
        | "vertical"
        | "horizontal"
      payment_status: "pending" | "paid" | "overdue" | "cancelled"
      platform_type:
        | "instagram"
        | "facebook"
        | "twitter"
        | "linkedin"
        | "tiktok"
      post_status: "draft" | "approved" | "published"
      service_type: "hosting" | "domain" | "ssl" | "email"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      content_type: ["post", "story", "reel", "carousel"],
      customer_type: ["retainer", "project", "passive"],
      file_category: ["logo", "product", "post"],
      logo_sub_category: [
        "primary",
        "white",
        "black",
        "icon",
        "vertical",
        "horizontal",
      ],
      payment_status: ["pending", "paid", "overdue", "cancelled"],
      platform_type: ["instagram", "facebook", "twitter", "linkedin", "tiktok"],
      post_status: ["draft", "approved", "published"],
      service_type: ["hosting", "domain", "ssl", "email"],
    },
  },
} as const
