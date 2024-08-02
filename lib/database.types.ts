export type Json =
   | string
   | number
   | boolean
   | null
   | { [key: string]: Json | undefined }
   | Json[];

export interface Database {
   public: {
      Tables: {
         draft: {
            Row: {
               created_at: string | null;
               current_pick: number;
               id: string;
               is_active: boolean;
               league_id: string;
            };
            Insert: {
               created_at?: string | null;
               current_pick?: number;
               id?: string;
               is_active?: boolean;
               league_id: string;
            };
            Update: {
               created_at?: string | null;
               current_pick?: number;
               id?: string;
               is_active?: boolean;
               league_id?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'draft_league_id_fkey';
                  columns: ['league_id'];
                  referencedRelation: 'leagues';
                  referencedColumns: ['league_id'];
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
                  referencedRelation: 'draft';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'draft_selections_team_id_fkey';
                  columns: ['team_id'];
                  referencedRelation: 'teams';
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
                  referencedRelation: 'league_rules';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'leagues_league_scoring_fkey';
                  columns: ['league_scoring'];
                  referencedRelation: 'league_scoring';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'leagues_owner_fkey';
                  columns: ['owner'];
                  referencedRelation: 'users';
                  referencedColumns: ['id'];
               }
            ];
         };
         players: {
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
         team_history: {
            Row: {
               created_at: string | null;
               draft_position: number | null;
               id: string;
               is_keeper: boolean | null;
               player_id: number | null;
               season: number | null;
               team_id: string;
            };
            Insert: {
               created_at?: string | null;
               draft_position?: number | null;
               id?: string;
               is_keeper?: boolean | null;
               player_id?: number | null;
               season?: number | null;
               team_id: string;
            };
            Update: {
               created_at?: string | null;
               draft_position?: number | null;
               id?: string;
               is_keeper?: boolean | null;
               player_id?: number | null;
               season?: number | null;
               team_id?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'team_history_player_id_fkey';
                  columns: ['player_id'];
                  referencedRelation: 'players_backup';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'team_history_team_id_fkey';
                  columns: ['team_id'];
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
                  referencedRelation: 'leagues';
                  referencedColumns: ['league_id'];
               },
               {
                  foreignKeyName: 'teams_owner_fkey';
                  columns: ['owner'];
                  referencedRelation: 'users';
                  referencedColumns: ['id'];
               }
            ];
         };
         watchlist: {
            Row: {
               created_at: string | null;
               id: string;
               owner: string;
               players: number[] | null;
            };
            Insert: {
               created_at?: string | null;
               id?: string;
               owner: string;
               players?: number[] | null;
            };
            Update: {
               created_at?: string | null;
               id?: string;
               owner?: string;
               players?: number[] | null;
            };
            Relationships: [
               {
                  foreignKeyName: 'watchlist_owner_fkey';
                  columns: ['owner'];
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
}
