export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          application_type: string | null
          college_id: string | null
          created_at: string | null
          decision_date: string | null
          id: string
          notes: string | null
          status: string | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          application_type?: string | null
          college_id?: string | null
          created_at?: string | null
          decision_date?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          application_type?: string | null
          college_id?: string | null
          created_at?: string | null
          decision_date?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      college_majors: {
        Row: {
          college_id: string | null
          id: string
          major_name: string
        }
        Insert: {
          college_id?: string | null
          id?: string
          major_name: string
        }
        Update: {
          college_id?: string | null
          id?: string
          major_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "college_majors_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          acceptance_rate: number | null
          application_deadline: string | null
          created_at: string | null
          early_deadline: string | null
          enrollment: number | null
          id: string
          location: string | null
          name: string
          ranking: string | null
          state: string | null
          tuition_in_state: number | null
          tuition_out_state: number | null
          website_url: string | null
        }
        Insert: {
          acceptance_rate?: number | null
          application_deadline?: string | null
          created_at?: string | null
          early_deadline?: string | null
          enrollment?: number | null
          id?: string
          location?: string | null
          name: string
          ranking?: string | null
          state?: string | null
          tuition_in_state?: number | null
          tuition_out_state?: number | null
          website_url?: string | null
        }
        Update: {
          acceptance_rate?: number | null
          application_deadline?: string | null
          created_at?: string | null
          early_deadline?: string | null
          enrollment?: number | null
          id?: string
          location?: string | null
          name?: string
          ranking?: string | null
          state?: string | null
          tuition_in_state?: number | null
          tuition_out_state?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
      essays: {
        Row: {
          ai_feedback: string | null
          application_id: string | null
          content: string | null
          created_at: string | null
          id: string
          prompt: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
          word_count: number | null
        }
        Insert: {
          ai_feedback?: string | null
          application_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          prompt?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          word_count?: number | null
        }
        Update: {
          ai_feedback?: string | null
          application_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          prompt?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "essays_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          act_score: number | null
          created_at: string | null
          email: string | null
          first_name: string | null
          gpa: number | null
          graduation_year: number | null
          high_school: string | null
          id: string
          intended_major: string | null
          last_name: string | null
          sat_score: number | null
          updated_at: string | null
        }
        Insert: {
          act_score?: number | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          gpa?: number | null
          graduation_year?: number | null
          high_school?: string | null
          id: string
          intended_major?: string | null
          last_name?: string | null
          sat_score?: number | null
          updated_at?: string | null
        }
        Update: {
          act_score?: number | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          gpa?: number | null
          graduation_year?: number | null
          high_school?: string | null
          id?: string
          intended_major?: string | null
          last_name?: string | null
          sat_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_colleges: {
        Row: {
          college_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          college_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          college_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_colleges_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
