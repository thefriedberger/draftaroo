export type Json =
   | string
   | number
   | boolean
   | null
   | { [key: string]: Json | undefined }
   | Json[];

export type Database = {
   // Allows to automatically instantiate createClient with right options
   // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
   __InternalSupabase: {
      PostgrestVersion: '12.2.2 (db9da0b)';
   };
   public: {
      Tables: {
         draft: {
            Row: {
               created_at: string | null;
               current_pick: number;
               draft_year: string | null;
               end_time: number | null;
               id: string;
               is_active: boolean;
               is_completed: boolean | null;
               league_id: string;
               start_time: string | null;
            };
            Insert: {
               created_at?: string | null;
               current_pick?: number;
               draft_year?: string | null;
               end_time?: number | null;
               id?: string;
               is_active?: boolean;
               is_completed?: boolean | null;
               league_id: string;
               start_time?: string | null;
            };
            Update: {
               created_at?: string | null;
               current_pick?: number;
               draft_year?: string | null;
               end_time?: number | null;
               id?: string;
               is_active?: boolean;
               is_completed?: boolean | null;
               league_id?: string;
               start_time?: string | null;
            };
            Relationships: [
               {
                  foreignKeyName: 'draft_league_id_fkey';
                  columns: ['league_id'];
                  isOneToOne: false;
                  referencedRelation: 'leagues';
                  referencedColumns: ['league_id'];
               }
            ];
         };
         draft_picks: {
            Row: {
               auto_draft: boolean;
               created_at: string;
               draft_id: string;
               id: string;
               picks: number[];
               team_id: string;
            };
            Insert: {
               auto_draft?: boolean;
               created_at?: string;
               draft_id: string;
               id?: string;
               picks: number[];
               team_id: string;
            };
            Update: {
               auto_draft?: boolean;
               created_at?: string;
               draft_id?: string;
               id?: string;
               picks?: number[];
               team_id?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'draft_order_draft_id_fkey';
                  columns: ['draft_id'];
                  isOneToOne: false;
                  referencedRelation: 'draft';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'draft_order_team_id_fkey';
                  columns: ['team_id'];
                  isOneToOne: false;
                  referencedRelation: 'teams';
                  referencedColumns: ['id'];
               }
            ];
         };
         draft_selections: {
            Row: {
               created_at: string | null;
               draft_id: string;
               id: string;
               is_keeper: boolean;
               pick: number;
               player_id: number;
               round: number;
               team_id: string;
            };
            Insert: {
               created_at?: string | null;
               draft_id: string;
               id?: string;
               is_keeper?: boolean;
               pick: number;
               player_id: number;
               round: number;
               team_id: string;
            };
            Update: {
               created_at?: string | null;
               draft_id?: string;
               id?: string;
               is_keeper?: boolean;
               pick?: number;
               player_id?: number;
               round?: number;
               team_id?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'draft_selections_draft_id_fkey';
                  columns: ['draft_id'];
                  isOneToOne: false;
                  referencedRelation: 'draft';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'draft_selections_team_id_fkey';
                  columns: ['team_id'];
                  isOneToOne: false;
                  referencedRelation: 'teams';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'fk_player_id';
                  columns: ['player_id'];
                  isOneToOne: false;
                  referencedRelation: 'players';
                  referencedColumns: ['id'];
               }
            ];
         };
         league_rules: {
            Row: {
               created_at: string;
               draft_picks: Json | null;
               draft_style: string | null;
               id: string;
               keepers_enabled: boolean | null;
               number_of_rounds: number;
               number_of_teams: number;
               timer_duration: number;
            };
            Insert: {
               created_at?: string;
               draft_picks?: Json | null;
               draft_style?: string | null;
               id?: string;
               keepers_enabled?: boolean | null;
               number_of_rounds?: number;
               number_of_teams: number;
               timer_duration?: number;
            };
            Update: {
               created_at?: string;
               draft_picks?: Json | null;
               draft_style?: string | null;
               id?: string;
               keepers_enabled?: boolean | null;
               number_of_rounds?: number;
               number_of_teams?: number;
               timer_duration?: number;
            };
            Relationships: [];
         };
         league_scoring: {
            Row: {
               assists: number | null;
               blocked: number | null;
               goals: number | null;
               goalsAgainst: number | null;
               hits: number | null;
               id: string;
               pim: number | null;
               plusMinus: number | null;
               powerPlayAssists: number | null;
               powerPlayGoals: number | null;
               powerPlayPoints: number | null;
               saves: number | null;
               shortHandedAssists: number | null;
               shortHandedGoals: number | null;
               shortHandedPoints: number | null;
               shots: number | null;
               shutouts: number | null;
               wins: number | null;
            };
            Insert: {
               assists?: number | null;
               blocked?: number | null;
               goals?: number | null;
               goalsAgainst?: number | null;
               hits?: number | null;
               id?: string;
               pim?: number | null;
               plusMinus?: number | null;
               powerPlayAssists?: number | null;
               powerPlayGoals?: number | null;
               powerPlayPoints?: number | null;
               saves?: number | null;
               shortHandedAssists?: number | null;
               shortHandedGoals?: number | null;
               shortHandedPoints?: number | null;
               shots?: number | null;
               shutouts?: number | null;
               wins?: number | null;
            };
            Update: {
               assists?: number | null;
               blocked?: number | null;
               goals?: number | null;
               goalsAgainst?: number | null;
               hits?: number | null;
               id?: string;
               pim?: number | null;
               plusMinus?: number | null;
               powerPlayAssists?: number | null;
               powerPlayGoals?: number | null;
               powerPlayPoints?: number | null;
               saves?: number | null;
               shortHandedAssists?: number | null;
               shortHandedGoals?: number | null;
               shortHandedPoints?: number | null;
               shots?: number | null;
               shutouts?: number | null;
               wins?: number | null;
            };
            Relationships: [];
         };
         leagues: {
            Row: {
               created_at: string | null;
               league_id: string;
               league_name: string | null;
               league_rules: string | null;
               league_scoring: string | null;
               owner: string;
            };
            Insert: {
               created_at?: string | null;
               league_id: string;
               league_name?: string | null;
               league_rules?: string | null;
               league_scoring?: string | null;
               owner: string;
            };
            Update: {
               created_at?: string | null;
               league_id?: string;
               league_name?: string | null;
               league_rules?: string | null;
               league_scoring?: string | null;
               owner?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'leagues_league_rules_fkey';
                  columns: ['league_rules'];
                  isOneToOne: false;
                  referencedRelation: 'league_rules';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'leagues_league_scoring_fkey';
                  columns: ['league_scoring'];
                  isOneToOne: false;
                  referencedRelation: 'league_scoring';
                  referencedColumns: ['id'];
               }
            ];
         };
         players: {
            Row: {
               current_team: string;
               first_name: string;
               headshot: string | null;
               id: number;
               is_active: boolean;
               last_name: string;
               primary_position: string | null;
               stats: Json | null;
               sweater_number: number | null;
            };
            Insert: {
               current_team: string;
               first_name: string;
               headshot?: string | null;
               id: number;
               is_active?: boolean;
               last_name: string;
               primary_position?: string | null;
               stats?: Json | null;
               sweater_number?: number | null;
            };
            Update: {
               current_team?: string;
               first_name?: string;
               headshot?: string | null;
               id?: number;
               is_active?: boolean;
               last_name?: string;
               primary_position?: string | null;
               stats?: Json | null;
               sweater_number?: number | null;
            };
            Relationships: [];
         };
         profiles: {
            Row: {
               email: string;
               first_name: string | null;
               id: string;
               last_name: string | null;
               username: string | null;
            };
            Insert: {
               email: string;
               first_name?: string | null;
               id: string;
               last_name?: string | null;
               username?: string | null;
            };
            Update: {
               email?: string;
               first_name?: string | null;
               id?: string;
               last_name?: string | null;
               username?: string | null;
            };
            Relationships: [];
         };
         team_history: {
            Row: {
               created_at: string | null;
               draft_position: number | null;
               id: string;
               is_keeper: boolean | null;
               player_id: number | null;
               team_id: string;
               times_kept: number | null;
            };
            Insert: {
               created_at?: string | null;
               draft_position?: number | null;
               id?: string;
               is_keeper?: boolean | null;
               player_id?: number | null;
               team_id: string;
               times_kept?: number | null;
            };
            Update: {
               created_at?: string | null;
               draft_position?: number | null;
               id?: string;
               is_keeper?: boolean | null;
               player_id?: number | null;
               team_id?: string;
               times_kept?: number | null;
            };
            Relationships: [
               {
                  foreignKeyName: 'team_history_player_id_fkey';
                  columns: ['player_id'];
                  isOneToOne: false;
                  referencedRelation: 'players';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'team_history_team_id_fkey';
                  columns: ['team_id'];
                  isOneToOne: false;
                  referencedRelation: 'teams';
                  referencedColumns: ['id'];
               }
            ];
         };
         team_history_duplicate: {
            Row: {
               created_at: string | null;
               draft_position: number | null;
               id: string;
               is_keeper: boolean | null;
               player_id: number | null;
               team_id: string;
               times_kept: number | null;
            };
            Insert: {
               created_at?: string | null;
               draft_position?: number | null;
               id?: string;
               is_keeper?: boolean | null;
               player_id?: number | null;
               team_id: string;
               times_kept?: number | null;
            };
            Update: {
               created_at?: string | null;
               draft_position?: number | null;
               id?: string;
               is_keeper?: boolean | null;
               player_id?: number | null;
               team_id?: string;
               times_kept?: number | null;
            };
            Relationships: [
               {
                  foreignKeyName: 'team_history_duplicate_player_id_fkey';
                  columns: ['player_id'];
                  isOneToOne: false;
                  referencedRelation: 'players';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'team_history_duplicate_team_id_fkey';
                  columns: ['team_id'];
                  isOneToOne: false;
                  referencedRelation: 'teams';
                  referencedColumns: ['id'];
               }
            ];
         };
         teams: {
            Row: {
               created_at: string | null;
               id: string;
               league_id: string;
               owner: string | null;
               team_name: string;
            };
            Insert: {
               created_at?: string | null;
               id?: string;
               league_id: string;
               owner?: string | null;
               team_name: string;
            };
            Update: {
               created_at?: string | null;
               id?: string;
               league_id?: string;
               owner?: string | null;
               team_name?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'teams_league_id_fkey';
                  columns: ['league_id'];
                  isOneToOne: false;
                  referencedRelation: 'leagues';
                  referencedColumns: ['league_id'];
               }
            ];
         };
         watchlist: {
            Row: {
               created_at: string | null;
               draft_id: string | null;
               id: string;
               owner: string;
               players: number[] | null;
            };
            Insert: {
               created_at?: string | null;
               draft_id?: string | null;
               id?: string;
               owner: string;
               players?: number[] | null;
            };
            Update: {
               created_at?: string | null;
               draft_id?: string | null;
               id?: string;
               owner?: string;
               players?: number[] | null;
            };
            Relationships: [
               {
                  foreignKeyName: 'watchlist_draft_id_fkey';
                  columns: ['draft_id'];
                  isOneToOne: false;
                  referencedRelation: 'draft';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'watchlist_owner_fkey';
                  columns: ['owner'];
                  isOneToOne: false;
                  referencedRelation: 'profiles';
                  referencedColumns: ['id'];
               }
            ];
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
   keyof Database,
   'public'
>];

export type Tables<
   DefaultSchemaTableNameOrOptions extends
      | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
      | { schema: keyof DatabaseWithoutInternals },
   TableName extends DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
   }
      ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
           DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
      : never = never
> = DefaultSchemaTableNameOrOptions extends {
   schema: keyof DatabaseWithoutInternals;
}
   ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
        Row: infer R;
     }
      ? R
      : never
   : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
   ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
     }
      ? R
      : never
   : never;

export type TablesInsert<
   DefaultSchemaTableNameOrOptions extends
      | keyof DefaultSchema['Tables']
      | { schema: keyof DatabaseWithoutInternals },
   TableName extends DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
   }
      ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
      : never = never
> = DefaultSchemaTableNameOrOptions extends {
   schema: keyof DatabaseWithoutInternals;
}
   ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
        Insert: infer I;
     }
      ? I
      : never
   : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
   ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
     }
      ? I
      : never
   : never;

export type TablesUpdate<
   DefaultSchemaTableNameOrOptions extends
      | keyof DefaultSchema['Tables']
      | { schema: keyof DatabaseWithoutInternals },
   TableName extends DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
   }
      ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
      : never = never
> = DefaultSchemaTableNameOrOptions extends {
   schema: keyof DatabaseWithoutInternals;
}
   ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
        Update: infer U;
     }
      ? U
      : never
   : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
   ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
     }
      ? U
      : never
   : never;

export type Enums<
   DefaultSchemaEnumNameOrOptions extends
      | keyof DefaultSchema['Enums']
      | { schema: keyof DatabaseWithoutInternals },
   EnumName extends DefaultSchemaEnumNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
   }
      ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
      : never = never
> = DefaultSchemaEnumNameOrOptions extends {
   schema: keyof DatabaseWithoutInternals;
}
   ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
   : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
   ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
   : never;

export type CompositeTypes<
   PublicCompositeTypeNameOrOptions extends
      | keyof DefaultSchema['CompositeTypes']
      | { schema: keyof DatabaseWithoutInternals },
   CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
   }
      ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
      : never = never
> = PublicCompositeTypeNameOrOptions extends {
   schema: keyof DatabaseWithoutInternals;
}
   ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
   : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
   ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
   : never;

export const Constants = {
   public: {
      Enums: {},
   },
} as const;
