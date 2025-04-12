export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_preferences: {
        Row: {
          id: string
          user_id: string
          domain_id: string
          keyword_id: string | null
          is_favorite: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          domain_id: string
          keyword_id?: string | null
          is_favorite?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          domain_id?: string
          keyword_id?: string | null
          is_favorite?: boolean
          created_at?: string
        }
      }
    }
  }
}