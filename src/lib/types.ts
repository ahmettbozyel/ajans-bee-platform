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
    }
  }
}

// Helper types
export type Customer = Database['public']['Tables']['customers']['Row']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export type Post = Database['public']['Tables']['posts']['Row']
export type PostInsert = Database['public']['Tables']['posts']['Insert']
export type PostUpdate = Database['public']['Tables']['posts']['Update']

export type Platform = Database['public']['Enums']['platform_type']
export type ContentType = Database['public']['Enums']['content_type']
export type PostStatus = Database['public']['Enums']['post_status']
