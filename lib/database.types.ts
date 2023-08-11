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
               id: string;
               league_id: string;
               timer: number | null;
            };
            Insert: {
               created_at?: string | null;
               id?: string;
               league_id: string;
               timer?: number | null;
            };
            Update: {
               created_at?: string | null;
               id?: string;
               league_id?: string;
               timer?: number | null;
            };
            Relationships: [];
         };
         draft_selections: {
            Row: {
               created_at: string | null;
               drafted_at: number | null;
               id: string;
               owned_by: string | null;
               player: number | null;
            };
            Insert: {
               created_at?: string | null;
               drafted_at?: number | null;
               id?: string;
               owned_by?: string | null;
               player?: number | null;
            };
            Update: {
               created_at?: string | null;
               drafted_at?: number | null;
               id?: string;
               owned_by?: string | null;
               player?: number | null;
            };
            Relationships: [
               {
                  foreignKeyName: 'draft_selections_owned_by_fkey';
                  columns: ['owned_by'];
                  referencedRelation: 'teams';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'draft_selections_player_fkey';
                  columns: ['player'];
                  referencedRelation: 'players';
                  referencedColumns: ['id'];
               }
            ];
         };
         leagues: {
            Row: {
               created_at: string | null;
               league_id: string;
               league_name: string | null;
               league_rules: Json[] | null;
               league_scoring: Json[] | null;
               owner: string;
            };
            Insert: {
               created_at?: string | null;
               league_id?: string;
               league_name?: string | null;
               league_rules?: Json[] | null;
               league_scoring?: Json[] | null;
               owner: string;
            };
            Update: {
               created_at?: string | null;
               league_id?: string;
               league_name?: string | null;
               league_rules?: Json[] | null;
               league_scoring?: Json[] | null;
               owner?: string;
            };
            Relationships: [
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
            Relationships: [
               {
                  foreignKeyName: 'profiles_id_fkey';
                  columns: ['id'];
                  referencedRelation: 'users';
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
                  referencedRelation: 'players';
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
               owner: string;
               team_name: string | null;
            };
            Insert: {
               created_at?: string | null;
               id?: string;
               league_id: string;
               owner: string;
               team_name?: string | null;
            };
            Update: {
               created_at?: string | null;
               id?: string;
               league_id?: string;
               owner?: string;
               team_name?: string | null;
            };
            Relationships: [
               {
                  foreignKeyName: 'teams_owner_fkey';
                  columns: ['owner'];
                  referencedRelation: 'profiles';
                  referencedColumns: ['id'];
               }
            ];
         };
         watchlist: {
            Row: {
               created_at: string | null;
               id: number;
               owner: string;
               players: number[] | null;
            };
            Insert: {
               created_at?: string | null;
               id?: number;
               owner: string;
               players?: number[] | null;
            };
            Update: {
               created_at?: string | null;
               id?: number;
               owner?: string;
               players?: number[] | null;
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
}
