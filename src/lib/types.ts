// Supabase Database Types
export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          brand_name: string | null
          sector: string | null
          brand_voice: string | null
          target_audience: string | null
          notes: string | null
          user_id: string
          // Karar #13 - Müşteri tipi
          customer_type: 'retainer' | 'project' | null
          // Karar #14 - Müşteri durumu
          status: 'active' | 'inactive' | null
          // Faz 1 alanları
          website_url: string | null
          sub_sector: string | null
          business_type: string | null
          email: string | null
          phone: string | null
          location: string | null
          social_media: Record<string, unknown> | null
          brand_description: string | null
          mission: string | null
          vision: string | null
          slogan: string | null
          usp: string | null
          target_age_range: string | null
          target_geography: string | null
          product_categories: string[] | null
          top_products: string[] | null
          price_segment: string | null
          competitors: Record<string, unknown>[] | null
          do_not_do: string[] | null
          must_emphasize: string[] | null
          special_events: Record<string, unknown>[] | null
          ai_research_date: string | null
          ai_research_status: string | null
          // Faz 2 alanları - Marka Değerleri
          brand_values: string[] | null
          buying_motivations: string[] | null
          // Faz 2 alanları - İçerik Stratejisi
          content_pillars: Record<string, unknown>[] | null
          // Faz 2 alanları - Platform Kuralları
          platform_rules: Record<string, unknown> | null
          // Faz 2 alanları - Örnek İçerikler
          example_captions: Record<string, unknown> | null
          // Faz 2 alanları - Kelime Haritası
          word_mapping: Record<string, unknown>[] | null
          // Faz 2 alanları - Marka Görselleri
          brand_colors: Record<string, unknown> | null
          brand_fonts: Record<string, unknown> | null
          brand_assets: Record<string, unknown> | null
          // Faz 2 alanları - Entegrasyonlar
          integrations: Record<string, unknown> | null
          // AI Research Alanları
          pain_points: Record<string, unknown>[] | null
          hook_sentences: Record<string, unknown>[] | null
          cta_standards: Record<string, unknown>[] | null
          forbidden_words: Record<string, unknown>[] | null
          seasonal_calendar: Record<string, unknown>[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          brand_name?: string | null
          sector?: string | null
          brand_voice?: string | null
          target_audience?: string | null
          notes?: string | null
          user_id: string
          customer_type?: 'retainer' | 'project' | null
          status?: 'active' | 'inactive' | null
          website_url?: string | null
          sub_sector?: string | null
          business_type?: string | null
          email?: string | null
          phone?: string | null
          location?: string | null
          social_media?: Record<string, unknown> | null
          brand_description?: string | null
          mission?: string | null
          vision?: string | null
          slogan?: string | null
          usp?: string | null
          target_age_range?: string | null
          target_geography?: string | null
          product_categories?: string[] | null
          top_products?: string[] | null
          price_segment?: string | null
          competitors?: Record<string, unknown>[] | null
          do_not_do?: string[] | null
          must_emphasize?: string[] | null
          special_events?: Record<string, unknown>[] | null
          ai_research_date?: string | null
          ai_research_status?: string | null
          brand_values?: string[] | null
          buying_motivations?: string[] | null
          content_pillars?: Record<string, unknown>[] | null
          platform_rules?: Record<string, unknown> | null
          example_captions?: Record<string, unknown> | null
          word_mapping?: Record<string, unknown>[] | null
          brand_colors?: Record<string, unknown> | null
          brand_fonts?: Record<string, unknown> | null
          brand_assets?: Record<string, unknown> | null
          integrations?: Record<string, unknown> | null
          pain_points?: Record<string, unknown>[] | null
          hook_sentences?: Record<string, unknown>[] | null
          cta_standards?: Record<string, unknown>[] | null
          forbidden_words?: Record<string, unknown>[] | null
          seasonal_calendar?: Record<string, unknown>[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          brand_name?: string | null
          sector?: string | null
          brand_voice?: string | null
          target_audience?: string | null
          notes?: string | null
          user_id?: string
          customer_type?: 'retainer' | 'project' | null
          status?: 'active' | 'inactive' | null
          website_url?: string | null
          sub_sector?: string | null
          business_type?: string | null
          email?: string | null
          phone?: string | null
          location?: string | null
          social_media?: Record<string, unknown> | null
          brand_description?: string | null
          mission?: string | null
          vision?: string | null
          slogan?: string | null
          usp?: string | null
          target_age_range?: string | null
          target_geography?: string | null
          product_categories?: string[] | null
          top_products?: string[] | null
          price_segment?: string | null
          competitors?: Record<string, unknown>[] | null
          do_not_do?: string[] | null
          must_emphasize?: string[] | null
          special_events?: Record<string, unknown>[] | null
          ai_research_date?: string | null
          ai_research_status?: string | null
          brand_values?: string[] | null
          buying_motivations?: string[] | null
          content_pillars?: Record<string, unknown>[] | null
          platform_rules?: Record<string, unknown> | null
          example_captions?: Record<string, unknown> | null
          word_mapping?: Record<string, unknown>[] | null
          brand_colors?: Record<string, unknown> | null
          brand_fonts?: Record<string, unknown> | null
          brand_assets?: Record<string, unknown> | null
          integrations?: Record<string, unknown> | null
          pain_points?: Record<string, unknown>[] | null
          hook_sentences?: Record<string, unknown>[] | null
          cta_standards?: Record<string, unknown>[] | null
          forbidden_words?: Record<string, unknown>[] | null
          seasonal_calendar?: Record<string, unknown>[] | null
        }
      }
      technical_services: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          customer_id: string
          user_id: string
          service_type: 'hosting' | 'domain' | 'ssl' | 'email'
          name: string
          platform: string | null
          renewal_date: string | null
          payment_status: 'pending' | 'paid' | 'overdue'
          price: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id: string
          user_id: string
          service_type: 'hosting' | 'domain' | 'ssl' | 'email'
          name: string
          platform?: string | null
          renewal_date?: string | null
          payment_status?: 'pending' | 'paid' | 'overdue'
          price?: number | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id?: string
          user_id?: string
          service_type?: 'hosting' | 'domain' | 'ssl' | 'email'
          name?: string
          platform?: string | null
          renewal_date?: string | null
          payment_status?: 'pending' | 'paid' | 'overdue'
          price?: number | null
          notes?: string | null
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
      customer_type: 'retainer' | 'project'
      customer_status: 'active' | 'inactive'
      service_type: 'hosting' | 'domain' | 'ssl' | 'email'
      payment_status: 'pending' | 'paid' | 'overdue'
    }
  }
}

// Helper types
export type Customer = Database['public']['Tables']['customers']['Row']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export type TechnicalService = Database['public']['Tables']['technical_services']['Row']
export type TechnicalServiceInsert = Database['public']['Tables']['technical_services']['Insert']
export type TechnicalServiceUpdate = Database['public']['Tables']['technical_services']['Update']

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
