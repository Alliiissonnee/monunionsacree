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
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocks_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocks_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consents: {
        Row: {
          accepte_le: string
          id: number
          retire_le: string | null
          type: string
          user_id: string
          version: string
        }
        Insert: {
          accepte_le?: string
          id?: never
          retire_le?: string | null
          type: string
          user_id: string
          version: string
        }
        Update: {
          accepte_le?: string
          id?: never
          retire_le?: string | null
          type?: string
          user_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "consents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      criteria: {
        Row: {
          accepte_enfants: boolean | null
          age_max: number
          age_min: number
          situations_acceptees: Database["public"]["Enums"]["situation_matrimoniale"][]
          territoires: Database["public"]["Enums"]["territoire"][]
          updated_at: string
          user_id: string
          valeurs_importantes: string[]
        }
        Insert: {
          accepte_enfants?: boolean | null
          age_max?: number
          age_min?: number
          situations_acceptees?: Database["public"]["Enums"]["situation_matrimoniale"][]
          territoires?: Database["public"]["Enums"]["territoire"][]
          updated_at?: string
          user_id: string
          valeurs_importantes?: string[]
        }
        Update: {
          accepte_enfants?: boolean | null
          age_max?: number
          age_min?: number
          situations_acceptees?: Database["public"]["Enums"]["situation_matrimoniale"][]
          territoires?: Database["public"]["Enums"]["territoire"][]
          updated_at?: string
          user_id?: string
          valeurs_importantes?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "criteria_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_private: {
        Row: {
          id: string
          telephone: string | null
          updated_at: string
        }
        Insert: {
          id: string
          telephone?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          telephone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_private_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          a_enfants: boolean | null
          created_at: string
          date_naissance: string | null
          delai_mariage: Database["public"]["Enums"]["delai_mariage"] | null
          genre: Database["public"]["Enums"]["genre"] | null
          id: string
          langues: string[]
          mobilite: Database["public"]["Enums"]["mobilite"] | null
          niveau_etudes: string | null
          prenom: string
          presentation: string | null
          profession: string | null
          role: Database["public"]["Enums"]["role_membre"]
          situation:
            | Database["public"]["Enums"]["situation_matrimoniale"]
            | null
          souhait_enfants: Database["public"]["Enums"]["souhait_enfants"] | null
          statut: Database["public"]["Enums"]["statut_compte"]
          territoire: Database["public"]["Enums"]["territoire"] | null
          updated_at: string
          valeurs: string[]
          ville: string | null
        }
        Insert: {
          a_enfants?: boolean | null
          created_at?: string
          date_naissance?: string | null
          delai_mariage?: Database["public"]["Enums"]["delai_mariage"] | null
          genre?: Database["public"]["Enums"]["genre"] | null
          id: string
          langues?: string[]
          mobilite?: Database["public"]["Enums"]["mobilite"] | null
          niveau_etudes?: string | null
          prenom: string
          presentation?: string | null
          profession?: string | null
          role?: Database["public"]["Enums"]["role_membre"]
          situation?:
            | Database["public"]["Enums"]["situation_matrimoniale"]
            | null
          souhait_enfants?:
            | Database["public"]["Enums"]["souhait_enfants"]
            | null
          statut?: Database["public"]["Enums"]["statut_compte"]
          territoire?: Database["public"]["Enums"]["territoire"] | null
          updated_at?: string
          valeurs?: string[]
          ville?: string | null
        }
        Update: {
          a_enfants?: boolean | null
          created_at?: string
          date_naissance?: string | null
          delai_mariage?: Database["public"]["Enums"]["delai_mariage"] | null
          genre?: Database["public"]["Enums"]["genre"] | null
          id?: string
          langues?: string[]
          mobilite?: Database["public"]["Enums"]["mobilite"] | null
          niveau_etudes?: string | null
          prenom?: string
          presentation?: string | null
          profession?: string | null
          role?: Database["public"]["Enums"]["role_membre"]
          situation?:
            | Database["public"]["Enums"]["situation_matrimoniale"]
            | null
          souhait_enfants?:
            | Database["public"]["Enums"]["souhait_enfants"]
            | null
          statut?: Database["public"]["Enums"]["statut_compte"]
          territoire?: Database["public"]["Enums"]["territoire"] | null
          updated_at?: string
          valeurs?: string[]
          ville?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          details: string | null
          id: number
          motif: Database["public"]["Enums"]["motif_signalement"]
          reported_id: string
          reporter_id: string
          statut: Database["public"]["Enums"]["statut_signalement"]
          traite_le: string | null
          traite_par: string | null
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: never
          motif: Database["public"]["Enums"]["motif_signalement"]
          reported_id: string
          reporter_id?: string
          statut?: Database["public"]["Enums"]["statut_signalement"]
          traite_le?: string | null
          traite_par?: string | null
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: never
          motif?: Database["public"]["Enums"]["motif_signalement"]
          reported_id?: string
          reporter_id?: string
          statut?: Database["public"]["Enums"]["statut_signalement"]
          traite_le?: string | null
          traite_par?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_reported_id_fkey"
            columns: ["reported_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_traite_par_fkey"
            columns: ["traite_par"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      creer_profil_membre: { Args: { u: unknown }; Returns: undefined }
      est_admin: { Args: never; Returns: boolean }
      est_bloque: { Args: { a: string; b: string }; Returns: boolean }
      est_moderateur: { Args: never; Returns: boolean }
      peut_voir_profil: {
        Args: {
          cible_genre: Database["public"]["Enums"]["genre"]
          cible_id: string
          cible_statut: Database["public"]["Enums"]["statut_compte"]
        }
        Returns: boolean
      }
    }
    Enums: {
      delai_mariage: "moins_6_mois" | "6_12_mois" | "1_2_ans" | "plus_2_ans"
      genre: "femme" | "homme"
      mobilite: "meme_ville" | "meme_territoire" | "mayotte_reunion" | "partout"
      motif_signalement:
        | "faux_profil"
        | "harcelement"
        | "comportement_inapproprie"
        | "demande_argent"
        | "propos_deplaces"
        | "spam"
        | "autre"
      role_membre: "membre" | "moderateur" | "admin"
      situation_matrimoniale: "celibataire" | "divorce" | "veuf"
      souhait_enfants: "oui" | "non" | "ouvert"
      statut_compte: "en_attente" | "valide" | "suspendu" | "masque"
      statut_signalement: "en_attente" | "en_cours" | "traite" | "rejete"
      territoire: "mayotte" | "reunion" | "autre"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      delai_mariage: ["moins_6_mois", "6_12_mois", "1_2_ans", "plus_2_ans"],
      genre: ["femme", "homme"],
      mobilite: ["meme_ville", "meme_territoire", "mayotte_reunion", "partout"],
      motif_signalement: [
        "faux_profil",
        "harcelement",
        "comportement_inapproprie",
        "demande_argent",
        "propos_deplaces",
        "spam",
        "autre",
      ],
      role_membre: ["membre", "moderateur", "admin"],
      situation_matrimoniale: ["celibataire", "divorce", "veuf"],
      souhait_enfants: ["oui", "non", "ouvert"],
      statut_compte: ["en_attente", "valide", "suspendu", "masque"],
      statut_signalement: ["en_attente", "en_cours", "traite", "rejete"],
      territoire: ["mayotte", "reunion", "autre"],
    },
  },
} as const
