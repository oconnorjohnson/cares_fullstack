export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
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
      Asset: {
        Row: {
          cardType: string | null;
          created_at: string;
          FundId: number | null;
          FundTypeId: number;
          id: number;
          isAvailable: boolean;
          isCARES: boolean;
          isExpended: boolean;
          isReserved: boolean;
          isRFF: boolean;
          lastFour: number | null;
          totalValue: number;
          TransactionId: number;
          UserId: string;
        };
        Insert: {
          cardType?: string | null;
          created_at?: string;
          FundId?: number | null;
          FundTypeId: number;
          id?: number;
          isAvailable?: boolean;
          isCARES?: boolean;
          isExpended?: boolean;
          isReserved?: boolean;
          isRFF?: boolean;
          lastFour?: number | null;
          totalValue: number;
          TransactionId: number;
          UserId: string;
        };
        Update: {
          cardType?: string | null;
          created_at?: string;
          FundId?: number | null;
          FundTypeId?: number;
          id?: number;
          isAvailable?: boolean;
          isCARES?: boolean;
          isExpended?: boolean;
          isReserved?: boolean;
          isRFF?: boolean;
          lastFour?: number | null;
          totalValue?: number;
          TransactionId?: number;
          UserId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_Asset_FundId_fkey";
            columns: ["FundId"];
            isOneToOne: false;
            referencedRelation: "Fund";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_Asset_FundTypeId_fkey";
            columns: ["FundTypeId"];
            isOneToOne: false;
            referencedRelation: "FundType";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_Asset_TransactionId_fkey";
            columns: ["TransactionId"];
            isOneToOne: false;
            referencedRelation: "Transaction";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_Asset_UserId_fkey";
            columns: ["UserId"];
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
          id: number;
          userId: string;
        };
        Insert: {
          email?: string | null;
          id?: number;
          userId: string;
        };
        Update: {
          email?: string | null;
          id?: number;
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
          AssetIds: number[] | null;
          created_at: string;
          fundTypeId: number;
          id: number;
          isCARES: boolean | null;
          isRFF: boolean | null;
          needsReceipt: boolean | null;
          paid: boolean;
          receiptId: number | null;
          requestId: number;
          TransactionId: number | null;
        };
        Insert: {
          amount: number;
          AssetIds?: number[] | null;
          created_at?: string;
          fundTypeId: number;
          id?: number;
          isCARES?: boolean | null;
          isRFF?: boolean | null;
          needsReceipt?: boolean | null;
          paid?: boolean;
          receiptId?: number | null;
          requestId: number;
          TransactionId?: number | null;
        };
        Update: {
          amount?: number;
          AssetIds?: number[] | null;
          created_at?: string;
          fundTypeId?: number;
          id?: number;
          isCARES?: boolean | null;
          isRFF?: boolean | null;
          needsReceipt?: boolean | null;
          paid?: boolean;
          receiptId?: number | null;
          requestId?: number;
          TransactionId?: number | null;
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
          {
            foreignKeyName: "public_Fund_TransactionId_fkey";
            columns: ["TransactionId"];
            isOneToOne: false;
            referencedRelation: "Transaction";
            referencedColumns: ["id"];
          },
        ];
      };
      FundType: {
        Row: {
          created_at: string;
          id: number;
          needsReceipt: boolean;
          typeName: string;
          userId: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          needsReceipt?: boolean;
          typeName: string;
          userId?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          needsReceipt?: boolean;
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
      OperatingBalance: {
        Row: {
          availableBalance: number;
          id: number;
          last_updated: string;
          reservedBalance: number;
          totalBalance: number;
          TransactionId: number | null;
          version: number;
        };
        Insert: {
          availableBalance: number;
          id?: number;
          last_updated?: string;
          reservedBalance: number;
          totalBalance: number;
          TransactionId?: number | null;
          version?: number;
        };
        Update: {
          availableBalance?: number;
          id?: number;
          last_updated?: string;
          reservedBalance?: number;
          totalBalance?: number;
          TransactionId?: number | null;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "public_OperatingBalance_TransactionId_fkey";
            columns: ["TransactionId"];
            isOneToOne: false;
            referencedRelation: "Transaction";
            referencedColumns: ["id"];
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
          agreementUrl: string | null;
          approved: boolean;
          clientId: number;
          created_at: string;
          denied: boolean;
          details: string;
          hasPostScreen: boolean;
          hasPreScreen: boolean;
          hasReceipts: boolean;
          id: number;
          implementation: string;
          needsReceipts: boolean | null;
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
          agreementUrl?: string | null;
          approved?: boolean;
          clientId: number;
          created_at?: string;
          denied?: boolean;
          details: string;
          hasPostScreen?: boolean;
          hasPreScreen?: boolean;
          hasReceipts?: boolean;
          id?: number;
          implementation: string;
          needsReceipts?: boolean | null;
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
          agreementUrl?: string | null;
          approved?: boolean;
          clientId?: number;
          created_at?: string;
          denied?: boolean;
          details?: string;
          hasPostScreen?: boolean;
          hasPreScreen?: boolean;
          hasReceipts?: boolean;
          id?: number;
          implementation?: string;
          needsReceipts?: boolean | null;
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
      RFFBalance: {
        Row: {
          availableBalance: number;
          id: number;
          last_updated: string;
          reservedBalance: number;
          totalBalance: number;
          TransactionId: number | null;
          version: number;
        };
        Insert: {
          availableBalance: number;
          id?: number;
          last_updated?: string;
          reservedBalance: number;
          totalBalance: number;
          TransactionId?: number | null;
          version?: number;
        };
        Update: {
          availableBalance?: number;
          id?: number;
          last_updated?: string;
          reservedBalance?: number;
          totalBalance?: number;
          TransactionId?: number | null;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "public_RFFBalance_TransactionId_fkey";
            columns: ["TransactionId"];
            isOneToOne: false;
            referencedRelation: "Transaction";
            referencedColumns: ["id"];
          },
        ];
      };
      Transaction: {
        Row: {
          created_at: string;
          details: string | null;
          FundTypeId: number | null;
          id: number;
          isCARES: boolean;
          isDeposit: boolean;
          isDisbursement: boolean;
          isPurchase: boolean;
          isReservation: boolean | null;
          isReversal: boolean;
          isRFF: boolean;
          previousBalance: number | null;
          quantity: number | null;
          RequestId: number | null;
          totalValue: number;
          TransactionId: number | null;
          unitValue: number | null;
          UserId: string;
        };
        Insert: {
          created_at?: string;
          details?: string | null;
          FundTypeId?: number | null;
          id?: number;
          isCARES?: boolean;
          isDeposit?: boolean;
          isDisbursement?: boolean;
          isPurchase?: boolean;
          isReservation?: boolean | null;
          isReversal?: boolean;
          isRFF?: boolean;
          previousBalance?: number | null;
          quantity?: number | null;
          RequestId?: number | null;
          totalValue: number;
          TransactionId?: number | null;
          unitValue?: number | null;
          UserId: string;
        };
        Update: {
          created_at?: string;
          details?: string | null;
          FundTypeId?: number | null;
          id?: number;
          isCARES?: boolean;
          isDeposit?: boolean;
          isDisbursement?: boolean;
          isPurchase?: boolean;
          isReservation?: boolean | null;
          isReversal?: boolean;
          isRFF?: boolean;
          previousBalance?: number | null;
          quantity?: number | null;
          RequestId?: number | null;
          totalValue?: number;
          TransactionId?: number | null;
          unitValue?: number | null;
          UserId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_Transaction_FundTypeId_fkey";
            columns: ["FundTypeId"];
            isOneToOne: false;
            referencedRelation: "FundType";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_Transaction_RequestId_fkey";
            columns: ["RequestId"];
            isOneToOne: false;
            referencedRelation: "Request";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_Transaction_TransactionId_fkey";
            columns: ["TransactionId"];
            isOneToOne: false;
            referencedRelation: "Transaction";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_Transaction_UserId_fkey";
            columns: ["UserId"];
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
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
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
