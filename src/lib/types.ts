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
          brand_voice: string | null  // renamed from tone_of_voice
          target_audience: string | null
          notes: string | null
          user_id: string
          // Yeni alanlar
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
