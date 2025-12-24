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
          tone_of_voice: string | null
          target_audience: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          brand_name?: string | null
          sector?: string | null
          tone_of_voice?: string | null
          target_audience?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          brand_name?: string | null
          sector?: string | null
          tone_of_voice?: string | null
          target_audience?: string | null
          notes?: string | null
          user_id?: string
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
