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
      alternate_techniques: {
        Row: {
          author_id: string | null
          created_at: string
          description: string
          guide_id: string
          id: string
          is_verified: boolean | null
          steps: Json | null
          title: string
          upvotes: number | null
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          description: string
          guide_id: string
          id?: string
          is_verified?: boolean | null
          steps?: Json | null
          title: string
          upvotes?: number | null
        }
        Update: {
          author_id?: string | null
          created_at?: string
          description?: string
          guide_id?: string
          id?: string
          is_verified?: boolean | null
          steps?: Json | null
          title?: string
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "alternate_techniques_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "repair_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_ratings: {
        Row: {
          created_at: string
          guide_id: string
          id: string
          rating: number
          review: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          guide_id: string
          id?: string
          rating: number
          review?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          guide_id?: string
          id?: string
          rating?: number
          review?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_ratings_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "repair_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          is_pro: boolean | null
          subscription_expires_at: string | null
          subscription_status:
          | Database["public"]["Enums"]["subscription_status"]
          | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_pro?: boolean | null
          subscription_expires_at?: string | null
          subscription_status?:
          | Database["public"]["Enums"]["subscription_status"]
          | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_pro?: boolean | null
          subscription_expires_at?: string | null
          subscription_status?:
          | Database["public"]["Enums"]["subscription_status"]
          | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      repair_guides: {
        Row: {
          author_id: string | null
          created_at: string
          description: string | null
          device_brand: string | null
          device_category: string
          device_model: string | null
          difficulty: string | null
          estimated_time: string | null
          id: string
          is_pro_only: boolean | null
          is_verified: boolean | null
          parts: Json | null
          rating_count: number | null
          rating_sum: number | null
          steps: Json
          title: string
          tools: Json | null
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          description?: string | null
          device_brand?: string | null
          device_category: string
          device_model?: string | null
          difficulty?: string | null
          estimated_time?: string | null
          id?: string
          is_pro_only?: boolean | null
          is_verified?: boolean | null
          parts?: Json | null
          rating_count?: number | null
          rating_sum?: number | null
          steps?: Json
          title: string
          tools?: Json | null
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          created_at?: string
          description?: string | null
          device_brand?: string | null
          device_category?: string
          device_model?: string | null
          difficulty?: string | null
          estimated_time?: string | null
          id?: string
          is_pro_only?: boolean | null
          is_verified?: boolean | null
          parts?: Json | null
          rating_count?: number | null
          rating_sum?: number | null
          steps?: Json
          title?: string
          tools?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      repair_progress: {
        Row: {
          completed_at: string | null
          completed_steps: number[] | null
          current_step: number | null
          device_info: Json
          guide_id: string | null
          id: string
          notes: string | null
          photos: Json | null
          started_at: string
          status: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_steps?: number[] | null
          current_step?: number | null
          device_info: Json
          guide_id?: string | null
          id?: string
          notes?: string | null
          photos?: Json | null
          started_at?: string
          status?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_steps?: number[] | null
          current_step?: number | null
          device_info?: Json
          guide_id?: string | null
          id?: string
          notes?: string | null
          photos?: Json | null
          started_at?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "repair_progress_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "repair_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_applications: {
        Row: {
          created_at: string
          credentials: string
          experience_years: number | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          specialties: string[] | null
          status: Database["public"]["Enums"]["technician_status"] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          credentials: string
          experience_years?: number | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          specialties?: string[] | null
          status?: Database["public"]["Enums"]["technician_status"] | null
          user_id: string
        }
        Update: {
          created_at?: string
          credentials?: string
          experience_years?: number | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          specialties?: string[] | null
          status?: Database["public"]["Enums"]["technician_status"] | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          id: string
          author_id: string | null
          title: string
          content: string
          device_category: string
          device_model: string | null
          signal_strength: number | null
          is_pinned: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id?: string | null
          title: string
          content: string
          device_category: string
          device_model?: string | null
          signal_strength?: number | null
          is_pinned?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string | null
          title?: string
          content?: string
          device_category?: string
          device_model?: string | null
          signal_strength?: number | null
          is_pinned?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      community_comments: {
        Row: {
          id: string
          post_id: string
          author_id: string | null
          content: string
          is_verified_solution: boolean | null
          verified_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id?: string | null
          content: string
          is_verified_solution?: boolean | null
          verified_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_id?: string | null
          content?: string
          is_verified_solution?: boolean | null
          verified_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          }
        ]
      }
      community_likes: {
        Row: {
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          post_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_pro_user: { Args: { _user_id: string }; Returns: boolean }
      is_verified_technician: { Args: { _user_id: string }; Returns: boolean }
      increment_signal_strength: { Args: { post_id: string }; Returns: void }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      subscription_status:
      | "active"
      | "canceled"
      | "past_due"
      | "trialing"
      | "inactive"
      technician_status: "pending" | "approved" | "rejected"
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
      app_role: ["admin", "moderator", "user"],
      subscription_status: [
        "active",
        "canceled",
        "past_due",
        "trialing",
        "inactive",
      ],
      technician_status: ["pending", "approved", "rejected"],
    },
  },
} as const
