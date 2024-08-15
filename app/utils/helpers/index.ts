import { SupabaseClient, User } from '@supabase/supabase-js';
import { cache } from 'react';
export const getUser = cache(async (supabase: SupabaseClient<Database>) => {
   const { data, error } = await supabase.auth.getUser();
   return data;
});
export const fetchTeam = cache(
   async (
      supabase: SupabaseClient<Database>,
      userId: string,
      leaguId: string
   ): Promise<Team> => {
      const { data: team, error } = await supabase
         .from('teams')
         .select('*')
         .match({ owner: userId, league_id: leaguId });
      return team?.[0] as Team;
   }
);

export const fetchTeams = cache(
   async (
      supabase: SupabaseClient<Database>,
      leagueId: string
   ): Promise<Array<Team>> => {
      const { data: teams, error } = await supabase
         .from('teams')
         .select('*')
         .match({ league_id: leagueId });

      return teams as Team[];
   }
);

export const fetchAllUserTeams = cache(
   async (
      supabase: SupabaseClient<Database>,
      userId: string
   ): Promise<Array<Team>> => {
      const { data: teams, error } = await supabase
         .from('teams')
         .select('*')
         .match({ owner: userId });

      return teams as Team[];
   }
);

export const fetchDraftSelections = cache(
   async (
      supabase: SupabaseClient<Database>,
      draftId: string
   ): Promise<DraftSelection[]> => {
      const { data: draftSelections, error } = await supabase
         .from('draft_selections')
         .select('*')
         .match({ draft_id: draftId });
      return draftSelections as DraftSelection[];
   }
);

export const fetchProfile = cache(
   async (supabase: SupabaseClient<Database>, user: User): Promise<Profile> => {
      const { data, error } = await supabase
         .from('profiles')
         .select('*')
         .match({ id: user?.id });
      return data?.[0] as Profile;
   }
);

export const fetchLeagues = cache(
   async (supabase: SupabaseClient<Database>): Promise<Array<League>> => {
      const { data, error } = await supabase.from('leagues').select('*');
      return data as League[];
   }
);

export const fetchLeague = cache(
   async (
      supabase: SupabaseClient<Database>,
      leagueId: string
   ): Promise<League> => {
      const { data: league, error } = await supabase
         .from('leagues')
         .select('*')
         .match({ league_id: leagueId });

      return league?.[0] as League;
   }
);

export const fetchWatchlist = async (
   supabase: SupabaseClient<Database>,
   user: User
): Promise<Watchlist> => {
   const { data: watchlist } = await supabase
      .from('watchlist')
      .select('*')
      .match({ owner: user?.id });
   if (!watchlist?.length) {
      const { data } = await supabase
         .from('watchlist')
         .insert({ owner: user?.id, players: [] })
         .match({})
         .select('*');
      return data?.[0] as Watchlist;
   }
   return watchlist?.[0] as Watchlist;
};

export const fetchDrafts = async (
   supabase: SupabaseClient<Database>,
   leagueId: string
): Promise<Array<Draft>> => {
   const { data: drafts, error } = await supabase
      .from('draft')
      .select('*')
      .match({ league_id: leagueId });

   return drafts as Draft[];
};

export type DraftFetchType = {
   leagueId: string;
   draftYear: number;
   draftId: string;
};
export const fetchDraft = cache(
   async (
      supabase: SupabaseClient<Database>,
      leagueId?: string | null,
      draftId?: string | null,
      draftYear?: number | null
   ): Promise<Draft> => {
      const matchObj: any = {
         id: leagueId ?? null,
         league_id: draftId ?? null,
         draft_year: draftYear ?? null,
      };

      Object.keys(matchObj).forEach((key: any) => {
         if (matchObj[key] === null) {
            delete matchObj[key];
         }
      });
      const { data: draft, error } = await supabase
         .from('draft')
         .select('*')
         .match(matchObj);

      return draft?.[0] as Draft;
   }
);

export const fetchLeagueRules = async (
   supabase: SupabaseClient,
   league: League
): Promise<LeagueRules> => {
   const { data } = await supabase
      .from('league_rules')
      .select('*')
      .match({ id: league?.league_rules });

   return data?.[0] as LeagueRules;
};

export const updateSupabaseWatchlist = async (
   supabase: SupabaseClient<Database>,
   watchlist: number[],
   userId: string,
   draftId: string
): Promise<Array<number>> => {
   let playerIDs: number[] = [];
   if (!watchlist.length) return watchlist;

   for (const playerID of watchlist) {
      playerIDs.push(playerID);
   }

   const { data, error } = await supabase
      .from('watchlist')
      .update({ players: playerIDs })
      .match({ owner: userId, draft_id: draftId })
      .select('*');
   return data?.[0]?.players as number[];
};

export const fetchPlayers = cache(
   async (supabase: SupabaseClient): Promise<Player[]> => {
      const { data: players, error } = await supabase
         .from('players')
         .select('*');

      return players as Player[];
   }
);

export const fetchRosters = async (
   supabase: SupabaseClient,
   teamId: string
): Promise<TeamHistory[]> => {
   const { data, error } = await supabase
      .from('team_history')
      .select('*')
      .match({ team_id: teamId });
   return data as TeamHistory[];
};