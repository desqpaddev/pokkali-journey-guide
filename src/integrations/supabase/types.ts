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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blogs: {
        Row: {
          author_name: string | null
          content: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          published_at: string | null
          slug: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          id: string
          num_guests: number
          package_id: string
          preferred_language: string | null
          status: string
          total_amount: number
          tour_date: string
          user_id: string
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          num_guests?: number
          package_id: string
          preferred_language?: string | null
          status?: string
          total_amount?: number
          tour_date: string
          user_id: string
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          num_guests?: number
          package_id?: string
          preferred_language?: string | null
          status?: string
          total_amount?: number
          tour_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          audio_english_url: string | null
          audio_hindi_url: string | null
          audio_malayalam_url: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          latitude: number
          longitude: number
          name: string
          package_id: string
          stop_order: number
          story_english: string | null
          story_hindi: string | null
          story_malayalam: string | null
          trigger_radius_meters: number
        }
        Insert: {
          audio_english_url?: string | null
          audio_hindi_url?: string | null
          audio_malayalam_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          latitude: number
          longitude: number
          name: string
          package_id: string
          stop_order: number
          story_english?: string | null
          story_hindi?: string | null
          story_malayalam?: string | null
          trigger_radius_meters?: number
        }
        Update: {
          audio_english_url?: string | null
          audio_hindi_url?: string | null
          audio_malayalam_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number
          longitude?: number
          name?: string
          package_id?: string
          stop_order?: number
          story_english?: string | null
          story_hindi?: string | null
          story_malayalam?: string | null
          trigger_radius_meters?: number
        }
        Relationships: [
          {
            foreignKeyName: "destinations_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_steps: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          package_id: string
          step_order: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          package_id: string
          step_order: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          package_id?: string
          step_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_steps_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration_hours: number | null
          hero_image_url: string | null
          id: string
          is_active: boolean
          max_group_size: number | null
          min_group_size: number | null
          price_per_person: number
          slug: string
          tagline: string | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          max_group_size?: number | null
          min_group_size?: number | null
          price_per_person?: number
          slug: string
          tagline?: string | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          hero_image_url?: string | null
          id?: string
          is_active?: boolean
          max_group_size?: number | null
          min_group_size?: number | null
          price_per_person?: number
          slug?: string
          tagline?: string | null
          title?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          audio_english_url: string | null
          audio_hindi_url: string | null
          audio_malayalam_url: string | null
          created_at: string
          description: string | null
          destination_id: string | null
          id: string
          image_url: string | null
          name: string
          price: number | null
          qr_code: string
          story_english: string | null
          story_hindi: string | null
          story_malayalam: string | null
        }
        Insert: {
          audio_english_url?: string | null
          audio_hindi_url?: string | null
          audio_malayalam_url?: string | null
          created_at?: string
          description?: string | null
          destination_id?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number | null
          qr_code: string
          story_english?: string | null
          story_hindi?: string | null
          story_malayalam?: string | null
        }
        Update: {
          audio_english_url?: string | null
          audio_hindi_url?: string | null
          audio_malayalam_url?: string | null
          created_at?: string
          description?: string | null
          destination_id?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number | null
          qr_code?: string
          story_english?: string | null
          story_hindi?: string | null
          story_malayalam?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          preferred_language: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          preferred_language?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_first_admin: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
