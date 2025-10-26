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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          balance: number | null
          coldkey: string
          created_at: string | null
          daily_limit: number
          daily_spent: number | null
          endpoint: string
          hotkey: string
          id: string
          last_reset_date: string | null
          name: string
          status: string | null
          total_received: number | null
          total_sent: number | null
          tx_signature: string | null
          wallet_address: string
        }
        Insert: {
          balance?: number | null
          coldkey: string
          created_at?: string | null
          daily_limit: number
          daily_spent?: number | null
          endpoint: string
          hotkey: string
          id: string
          last_reset_date?: string | null
          name: string
          status?: string | null
          total_received?: number | null
          total_sent?: number | null
          tx_signature?: string | null
          wallet_address: string
        }
        Update: {
          balance?: number | null
          coldkey?: string
          created_at?: string | null
          daily_limit?: number
          daily_spent?: number | null
          endpoint?: string
          hotkey?: string
          id?: string
          last_reset_date?: string | null
          name?: string
          status?: string | null
          total_received?: number | null
          total_sent?: number | null
          tx_signature?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          agent_hotkey: string
          agent_id: string
          agent_name: string
          created_at: string | null
          id: string
          is_active: boolean | null
          key: string
          last_used: string | null
          name: string
          request_count: number | null
          wallet_address: string
        }
        Insert: {
          agent_hotkey: string
          agent_id: string
          agent_name: string
          created_at?: string | null
          id: string
          is_active?: boolean | null
          key: string
          last_used?: string | null
          name: string
          request_count?: number | null
          wallet_address: string
        }
        Update: {
          agent_hotkey?: string
          agent_id?: string
          agent_name?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key?: string
          last_used?: string | null
          name?: string
          request_count?: number | null
          wallet_address?: string
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          agent_id: string
          agent_name: string
          amount: number
          coldkey: string
          hotkey: string
          id: string
          processed_at: string | null
          purpose: string | null
          recipient: string
          requested_at: string | null
          status: string | null
          tx_signature: string | null
          wallet_address: string
        }
        Insert: {
          agent_id: string
          agent_name: string
          amount: number
          coldkey: string
          hotkey: string
          id: string
          processed_at?: string | null
          purpose?: string | null
          recipient: string
          requested_at?: string | null
          status?: string | null
          tx_signature?: string | null
          wallet_address: string
        }
        Update: {
          agent_id?: string
          agent_name?: string
          amount?: number
          coldkey?: string
          hotkey?: string
          id?: string
          processed_at?: string | null
          purpose?: string | null
          recipient?: string
          requested_at?: string | null
          status?: string | null
          tx_signature?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          agent_id: string | null
          amount: number
          description: string | null
          from_address: string
          id: string
          request_id: string | null
          status: string | null
          timestamp: string | null
          to_address: string
          tx_signature: string | null
          type: string
          wallet_address: string
        }
        Insert: {
          agent_id?: string | null
          amount: number
          description?: string | null
          from_address: string
          id: string
          request_id?: string | null
          status?: string | null
          timestamp?: string | null
          to_address: string
          tx_signature?: string | null
          type: string
          wallet_address: string
        }
        Update: {
          agent_id?: string | null
          amount?: number
          description?: string | null
          from_address?: string
          id?: string
          request_id?: string | null
          status?: string | null
          timestamp?: string | null
          to_address?: string
          tx_signature?: string | null
          type?: string
          wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      set_wallet_context: { Args: { wallet_addr: string }; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
