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
      profiles: {
        Row: {
          id: string
          total_ebooks_created: number
          credits_remaining: number
          updated_at: string
        }
        Insert: {
          id: string
          total_ebooks_created?: number
          credits_remaining?: number
          updated_at?: string
        }
        Update: {
          id?: string
          total_ebooks_created?: number
          credits_remaining?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ebooks: {
        Row: {
          id: string
          user_id: string
          title: string
          template_name: string
          content: Json
          created_at: string
          updated_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          template_name: string
          content: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          template_name?: string
          content?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ebooks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ebook_edits: {
        Row: {
          id: string
          ebook_id: string
          editor_id: string
          instruction: string
          edited_page_index: number
          created_at: string
        }
        Insert: {
          id?: string
          ebook_id: string
          editor_id: string
          instruction: string
          edited_page_index: number
          created_at?: string
        }
        Update: {
          id?: string
          ebook_id?: string
          editor_id?: string
          instruction?: string
          edited_page_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ebook_edits_ebook_id_fkey"
            columns: ["ebook_id"]
            isOneToOne: false
            referencedRelation: "ebooks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ebook_edits_editor_id_fkey"
            columns: ["editor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      download_tokens: {
        Row: {
          token: string
          ebook_id: string
          user_id: string
          format: string
          expires_at: string
          created_at?: string
        }
        Insert: {
          token: string
          ebook_id: string
          user_id: string
          format: string
          expires_at: string
          created_at?: string
        }
        Update: {
          token?: string
          ebook_id?: string
          user_id?: string
          format?: string
          expires_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "download_tokens_ebook_id_fkey"
            columns: ["ebook_id"]
            isOneToOne: false
            referencedRelation: "ebooks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "download_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
