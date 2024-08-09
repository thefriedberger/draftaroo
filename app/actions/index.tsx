import { SupabaseClient, User } from '@supabase/supabase-js';

export const fetchTeam = async (
   supabase: SupabaseClient<Database>,
   user: User
) => {
   const { data, error } = await supabase
      .from('teams')
      .select('*')
      .match({ owner: user?.id });
   if (data) return data as Team;
   // if (data) setUserTeams(data as Team);
};

export const fetchTeams = async (supabase: SupabaseClient<Database>) => {
   const { data, error } = await supabase.from('teams').select('*');
   if (data && data.length) return data as Team;
   if (error) return false;
   // if (data && data.length !== 0 && user) {
   //    setTeams(data as Team);
   //    setUserTeams(data.filter((team) => team.owner === user.id));
   // }
   // if (error) setShouldFetchTeams(false);
};

export const fetchProfile = async (
   supabase: SupabaseClient<Database>,
   user: User
) => {
   const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .match({ id: user?.id });
   if (data) return data;
   if (error) return false;
   // if (data) setProfile(data);
   // if (error) setShouldFetchProfile(false);
};

export const fetchLeagues = async (supabase: SupabaseClient<Database>) => {
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
};

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

export const fetchDrafts = async (supabase: SupabaseClient<Database>) => {
   const { data: draft, error } = await supabase.from('draft').select('*');
   // if (draft) setDrafts(draft);
};
