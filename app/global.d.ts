import type { Database as DB } from '@/lib/database.types';

declare global {
   type Database = DB;
   type Team = DB['public']['Tables']['teams']['Row'];
   type League = DB['public']['Tables']['leagues']['Update'];
   type Player = DB['public']['Tables']['players']['Row'];
   type Watchlist = DB['public']['Tables']['watchlist']['Row'];
   type Draft = DB['public']['Tables']['draft']['Row'];
   type DraftSelection = DB['public']['Tables']['draft_selections']['Row'];
   type Profile = DB['public']['Tables']['profiles']['Row'];
   type TeamHistory = DB['public']['Tables']['team_history']['Row'];
   type LeagueRules = DB['public']['Tables']['league_rules']['Row'];
   type LeagueScoring = DB['public']['Tables']['league_scoring']['Row'];
}
