export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      Agency: {
        Row: {
          id: number;
          name: string;
          userId: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          userId?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          userId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_Agency_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["userId"];
          },
        ];
      };
      Client: {
        Row: {
          clientID: string;
          created_at: string;
          id: number;
          race: string;
          sex: string;
          userId: string;
        };
        Insert: {
          clientID: string;
          created_at?: string;
          id?: number;
          race: string;
          sex: string;
          userId: string;
        };
        Update: {
          clientID?: string;
          created_at?: string;
          id?: number;
          race?: string;
          sex?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_Client_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["userId"];
          },
        ];
      };
      EmailAddress: {
        Row: {
          email: string | null;
          id: string;
          userId: string;
        };
        Insert: {
          email?: string | null;
          id: string;
          userId: string;
        };
        Update: {
          email?: string | null;
          id?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_EmailAddress_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["userId"];
          },
        ];
      };
      Fund: {
        Row: {
          amount: number;
          created_at: string;
          fundTypeId: number;
          id: number;
          needsReceipt: boolean;
          receiptId: number | null;
          requestId: number;
          RFFType: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string;
          fundTypeId: number;
          id?: number;
          needsReceipt?: boolean;
          receiptId?: number | null;
          requestId: number;
          RFFType?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string;
          fundTypeId?: number;
          id?: number;
          needsReceipt?: boolean;
          receiptId?: number | null;
          requestId?: number;
          RFFType?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_Fund_fundTypeId_fkey";
            columns: ["fundTypeId"];
            isOneToOne: false;
            referencedRelation: "FundType";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_Fund_receiptId_fkey";
            columns: ["receiptId"];
            isOneToOne: false;
            referencedRelation: "Receipt";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_Fund_requestId_fkey";
            columns: ["requestId"];
            isOneToOne: false;
            referencedRelation: "Request";
            referencedColumns: ["id"];
          },
        ];
      };
      FundType: {
        Row: {
          created_at: string;
          id: number;
          typeName: string;
          userId: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          typeName: string;
          userId?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          typeName?: string;
          userId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_FundType_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["userId"];
          },
        ];
      };
      PostScreenAnswers: {
        Row: {
          additionalInformation: string | null;
          created_at: string;
          financialDifficulties: number;
          foodInsecurityStress: number;
          foodMoneyStress: number;
          housingQuality: number;
          housingSituation: number;
          id: number;
          requestId: number;
          transpoConfidence: number;
          transpoStress: number;
          utilityStress: number;
        };
        Insert: {
          additionalInformation?: string | null;
          created_at?: string;
          financialDifficulties: number;
          foodInsecurityStress: number;
          foodMoneyStress: number;
          housingQuality: number;
          housingSituation: number;
          id?: number;
          requestId: number;
          transpoConfidence: number;
          transpoStress: number;
          utilityStress: number;
        };
        Update: {
          additionalInformation?: string | null;
          created_at?: string;
          financialDifficulties?: number;
          foodInsecurityStress?: number;
          foodMoneyStress?: number;
          housingQuality?: number;
          housingSituation?: number;
          id?: number;
          requestId?: number;
          transpoConfidence?: number;
          transpoStress?: number;
          utilityStress?: number;
        };
        Relationships: [
          {
            foreignKeyName: "public_PostScreenAnswers_requestId_fkey";
            columns: ["requestId"];
            isOneToOne: false;
            referencedRelation: "Request";
            referencedColumns: ["id"];
          },
        ];
      };
      PreScreenAnswers: {
        Row: {
          additionalInformation: string | null;
          created_at: string;
          financialDifficulties: number;
          foodInsecurityStress: number;
          foodMoneyStress: number;
          housingQuality: number;
          housingSituation: number;
          id: number;
          requestId: number;
          transpoConfidence: number;
          transpoStress: number;
          utilityStress: number;
        };
        Insert: {
          additionalInformation?: string | null;
          created_at?: string;
          financialDifficulties: number;
          foodInsecurityStress: number;
          foodMoneyStress: number;
          housingQuality: number;
          housingSituation: number;
          id?: number;
          requestId: number;
          transpoConfidence: number;
          transpoStress: number;
          utilityStress: number;
        };
        Update: {
          additionalInformation?: string | null;
          created_at?: string;
          financialDifficulties?: number;
          foodInsecurityStress?: number;
          foodMoneyStress?: number;
          housingQuality?: number;
          housingSituation?: number;
          id?: number;
          requestId?: number;
          transpoConfidence?: number;
          transpoStress?: number;
          utilityStress?: number;
        };
        Relationships: [
          {
            foreignKeyName: "public_PreScreenAnswers_requestId_fkey";
            columns: ["requestId"];
            isOneToOne: false;
            referencedRelation: "Request";
            referencedColumns: ["id"];
          },
        ];
      };
      Receipt: {
        Row: {
          created_at: string;
          fundId: number;
          id: number;
          requestId: number;
          url: string;
          userId: string;
        };
        Insert: {
          created_at?: string;
          fundId: number;
          id?: number;
          requestId: number;
          url: string;
          userId: string;
        };
        Update: {
          created_at?: string;
          fundId?: number;
          id?: number;
          requestId?: number;
          url?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_Receipt_fundId_fkey";
            columns: ["fundId"];
            isOneToOne: false;
            referencedRelation: "Fund";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_Receipt_requestId_fkey";
            columns: ["requestId"];
            isOneToOne: false;
            referencedRelation: "Request";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_Receipt_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["userId"];
          },
        ];
      };
      Request: {
        Row: {
          agencyId: number;
          agreementUrl: string;
          approved: boolean;
          clientId: number;
          created_at: string;
          denied: boolean;
          details: string;
          hasPostScreen: boolean;
          hasPreScreen: boolean;
          id: number;
          implementation: string;
          needsReceipts: boolean;
          paid: boolean;
          pendingApproval: boolean;
          pendingPayout: boolean;
          postScreenAnswerId: number | null;
          preScreenAnswerId: number | null;
          RFF: string[] | null;
          SDOH: string[] | null;
          sustainability: string;
          userId: string;
        };
        Insert: {
          agencyId: number;
          agreementUrl: string;
          approved?: boolean;
          clientId: number;
          created_at?: string;
          denied?: boolean;
          details: string;
          hasPostScreen?: boolean;
          hasPreScreen?: boolean;
          id?: number;
          implementation: string;
          needsReceipts?: boolean;
          paid?: boolean;
          pendingApproval?: boolean;
          pendingPayout?: boolean;
          postScreenAnswerId?: number | null;
          preScreenAnswerId?: number | null;
          RFF?: string[] | null;
          SDOH?: string[] | null;
          sustainability: string;
          userId: string;
        };
        Update: {
          agencyId?: number;
          agreementUrl?: string;
          approved?: boolean;
          clientId?: number;
          created_at?: string;
          denied?: boolean;
          details?: string;
          hasPostScreen?: boolean;
          hasPreScreen?: boolean;
          id?: number;
          implementation?: string;
          needsReceipts?: boolean;
          paid?: boolean;
          pendingApproval?: boolean;
          pendingPayout?: boolean;
          postScreenAnswerId?: number | null;
          preScreenAnswerId?: number | null;
          RFF?: string[] | null;
          SDOH?: string[] | null;
          sustainability?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_Request_agencyId_fkey";
            columns: ["agencyId"];
            isOneToOne: false;
            referencedRelation: "Agency";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_Request_clientId_fkey";
            columns: ["clientId"];
            isOneToOne: false;
            referencedRelation: "Client";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_Request_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["userId"];
          },
        ];
      };
      User: {
        Row: {
          created_at: string;
          first_name: string | null;
          id: number;
          isBanned: boolean;
          last_name: string | null;
          userId: string;
        };
        Insert: {
          created_at?: string;
          first_name?: string | null;
          id?: number;
          isBanned?: boolean;
          last_name?: string | null;
          userId: string;
        };
        Update: {
          created_at?: string;
          first_name?: string | null;
          id?: number;
          isBanned?: boolean;
          last_name?: string | null;
          userId?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
