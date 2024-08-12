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
   ) => {
      const { data, error } = await supabase
         .from('teams')
         .select('*')
         .match({ owner: userId, league_id: leaguId });
      if (data) return data?.[0] as Team;
   }
);

export const fetchTeams = cache(
   async (supabase: SupabaseClient<Database>, leagueId: string) => {
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
   async (supabase: SupabaseClient<Database>, user: User) => {
      const { data, error } = await supabase
         .from('profiles')
         .select('*')
         .match({ id: user?.id });
      if (data) return data;
      if (error) return false;
   }
);

export const fetchLeagues = cache(
   async (supabase: SupabaseClient<Database>) => {
      const { data, error } = await supabase.from('leagues').select('*');
      return data;
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
   async (supabase: SupabaseClient<Database>, leagueId: string) => {
      const { data: league, error } = await supabase
         .from('leagues')
         .select('*')
         .match({ league_id: leagueId });

      return league?.[0];
   }
);

export const fetchWatchlist = async (
   supabase: SupabaseClient<Database>,
   user: User
) => {
   const { data } = await supabase
      .from('watchlist')
      .select('*')
      .match({ owner: user?.id });
   if (!data?.length) {
      const { data } = await supabase
         .from('watchlist')
         .insert({ owner: user?.id, players: [] })
         .match({})
         .select('*');
      if (data?.[0]?.players) {
         // setShouldUpdateWatchlist(false);
         // setWatchlist(data?.[0]?.players);
      }
   }
   if (data) {
      if (data?.[0]?.players) {
         // setShouldUpdateWatchlist(false);
         // setWatchlist(data?.[0]?.players);
      }
   }
};

export const fetchDrafts = async (
   supabase: SupabaseClient<Database>,
   leagueId: string
) => {
   const { data: drafts, error } = await supabase
      .from('draft')
      .select('*')
      .match({ league_id: leagueId });

   return drafts?.[0];
};

export const fetchDraft = cache(
   async (
      supabase: SupabaseClient<Database>,
      leagueId: string,
      draftYear: number
   ) => {
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
) => {
   let playerIDs: number[] = [];
   if (!watchlist) return;

   if (watchlist && watchlist?.length) {
      for (const playerID of watchlist) {
         playerIDs.push(playerID);
      }

      const { data, error } = await supabase
         .from('watchlist')
         .update({ players: playerIDs })
         .match({ owner: userId, draft_id: draftId })
         .select('*');
      if (data) {
         if (data?.[0]?.players) {
            return data?.[0]?.players;
         }
      }
   }
};
