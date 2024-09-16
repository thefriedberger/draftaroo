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
               created_at: string;
               draft_id: string;
               id: string;
               picks: number[];
               team_id: string;
            };
            Insert: {
               created_at?: string;
               draft_id: string;
               id?: string;
               picks: number[];
               team_id: string;
            };
            Update: {
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
               number_of_rounds: number | null;
               number_of_teams: number | null;
            };
            Insert: {
               created_at?: string;
               draft_picks?: Json | null;
               draft_style?: string | null;
               id?: string;
               keepers_enabled?: boolean | null;
               number_of_rounds?: number | null;
               number_of_teams?: number | null;
            };
            Update: {
               created_at?: string;
               draft_picks?: Json | null;
               draft_style?: string | null;
               id?: string;
               keepers_enabled?: boolean | null;
               number_of_rounds?: number | null;
               number_of_teams?: number | null;
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
               },
               {
                  foreignKeyName: 'leagues_owner_fkey';
                  columns: ['owner'];
                  isOneToOne: false;
                  referencedRelation: 'users';
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
               stats: Json[] | null;
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
               stats?: Json[] | null;
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
               stats?: Json[] | null;
               sweater_number?: number | null;
            };
            Relationships: [];
         };
         players_backup: {
            Row: {
               current_team: string;
               first_name: string;
               id: number;
               last_name: string;
               primary_position: string | null;
               stats: Json[] | null;
            };
            Insert: {
               current_team: string;
               first_name: string;
               id: number;
               last_name: string;
               primary_position?: string | null;
               stats?: Json[] | null;
            };
            Update: {
               current_team?: string;
               first_name?: string;
               id?: number;
               last_name?: string;
               primary_position?: string | null;
               stats?: Json[] | null;
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
         rosters: {
            Row: {
               created_at: string;
               id: string;
               is_keeper: boolean | null;
               league_id: string | null;
               player_id: number | null;
               team_id: string | null;
            };
            Insert: {
               created_at?: string;
               id: string;
               is_keeper?: boolean | null;
               league_id?: string | null;
               player_id?: number | null;
               team_id?: string | null;
            };
            Update: {
               created_at?: string;
               id?: string;
               is_keeper?: boolean | null;
               league_id?: string | null;
               player_id?: number | null;
               team_id?: string | null;
            };
            Relationships: [
               {
                  foreignKeyName: 'rosters_league_id_fkey';
                  columns: ['league_id'];
                  isOneToOne: false;
                  referencedRelation: 'leagues';
                  referencedColumns: ['league_id'];
               },
               {
                  foreignKeyName: 'rosters_player_id_fkey';
                  columns: ['player_id'];
                  isOneToOne: false;
                  referencedRelation: 'players';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'rosters_team_id_fkey';
                  columns: ['team_id'];
                  isOneToOne: false;
                  referencedRelation: 'teams';
                  referencedColumns: ['id'];
               }
            ];
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
               },
               {
                  foreignKeyName: 'teams_owner_fkey';
                  columns: ['owner'];
                  isOneToOne: false;
                  referencedRelation: 'users';
                  referencedColumns: ['id'];
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

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
   PublicTableNameOrOptions extends
      | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
      | { schema: keyof Database },
   TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
      ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
           Database[PublicTableNameOrOptions['schema']]['Views'])
      : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
   ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
        Row: infer R;
     }
      ? R
      : never
   : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
   ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
     }
      ? R
      : never
   : never;

export type TablesInsert<
   PublicTableNameOrOptions extends
      | keyof PublicSchema['Tables']
      | { schema: keyof Database },
   TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
      ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
      : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
   ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
        Insert: infer I;
     }
      ? I
      : never
   : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
   ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
     }
      ? I
      : never
   : never;

export type TablesUpdate<
   PublicTableNameOrOptions extends
      | keyof PublicSchema['Tables']
      | { schema: keyof Database },
   TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
      ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
      : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
   ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
        Update: infer U;
     }
      ? U
      : never
   : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
   ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
     }
      ? U
      : never
   : never;

export type Enums<
   PublicEnumNameOrOptions extends
      | keyof PublicSchema['Enums']
      | { schema: keyof Database },
   EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
      ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
      : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
   ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
   : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
   ? PublicSchema['Enums'][PublicEnumNameOrOptions]
   : never;
