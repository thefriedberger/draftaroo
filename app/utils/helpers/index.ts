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
      const { data, error } = await supabase
         .from('teams')
         .select('*')
         .match({ owner: userId, league_id: leaguId });
      return data?.[0] as Team;
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
      console.log(teams);
      return teams as Team[];
   }
);
export const fetchDraftSelections = cache(
   async (supabase: SupabaseClient<Database>, draftId: string) => {
      const { data: draftSelections, error } = await supabase
         .from('draft_selections')
         .select('*')
         .match({ draft_id: draftId });
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
      // if (data) {
      //    if (teams.length === 0 && data?.[0].owner === user.id) {
      //       setLeagues(data as League);
      //    }
      //    teams?.forEach((team: Team) => {
      //       if (team.league_id === data?.[0].league_id) {
      //          setLeagues(data as League);
      //       }
      //    });
      // }
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
): Promise<Array<number>> => {
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
      return data?.[0]?.players as number[];
   }
   return watchlist?.[0]?.players as number[];
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

export const fetchDraft = cache(
   async (
      supabase: SupabaseClient<Database>,
      leagueId: string,
      draftYear: number
   ): Promise<Draft> => {
      const { data: draft, error } = await supabase
         .from('draft')
         .select('*')
         .match({ league_id: leagueId, draft_year: draftYear });

      console.log('fetched draft: ', draft, error);
      return draft?.[0] as Draft;
   }
);

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
