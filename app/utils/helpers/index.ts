import {
   DraftTimerFields,
   TIMER_DURATION,
} from '@/components/ui/timer/new-timer';
import { DraftPick } from '@/lib/types';
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
      leagueId: string
   ): Promise<Team> => {
      const { data: team, error } = await supabase
         .from('teams')
         .select('*')
         .match({ owner: userId, league_id: leagueId });
      return team?.[0] as Team;
   }
);

export const fetchTeams = cache(
   async (
      supabase: SupabaseClient<Database>,
      league: League
   ): Promise<Array<Team>> => {
      const { data: teams, error } = await supabase
         .from('teams')
         .select('*')
         .match({ league_id: league.league_id });

      return teams as Team[];
   }
);

export const fetchTeamHistory = async (
   supabase: SupabaseClient,
   team: Team
): Promise<Array<TeamHistory>> => {
   const { data: team_history, error } = await supabase
      .from('team_history')
      .select('*')
      .match({ team_id: team.id });

   return team_history as TeamHistory[];
};

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

export const fetchDraftedPlayers = async (
   supabase: SupabaseClient,
   draft: Draft
): Promise<DraftSelection[]> => {
   const { data } = await supabase
      .from('draft_selections')
      .select('*')
      .match({ draft_id: draft?.id });
   return data as DraftSelection[];
};

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

export const fetchOwnerByTeam = async (
   supabase: SupabaseClient,
   teamId: string
): Promise<string> => {
   const { data: team, error } = await supabase
      .from('teams')
      .select('owner')
      .match({ id: teamId });

   return team?.[0]?.owner as string;
};

export const fetchWatchlist = async (
   supabase: SupabaseClient<Database>,
   userId: string,
   draft: Draft
): Promise<Watchlist> => {
   const { data: watchlist } = await supabase
      .from('watchlist')
      .select('*')
      .match({ owner: userId, draft_id: draft.id });
   if (!watchlist?.length) {
      const { data } = await supabase
         .from('watchlist')
         .insert({ owner: userId, players: [], draft_id: draft.id })
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

export const fetchDraftByLeague = cache(
   async (
      supabase: SupabaseClient<Database>,
      leagueId: string,
      draftYear: number
   ): Promise<Draft> => {
      const { data: draft, error } = await supabase
         .from('draft')
         .select('*')
         .match({ draft_year: draftYear, league_id: leagueId });

      return draft?.[0] as Draft;
   }
);
export const fetchDraftById = cache(
   async (
      supabase: SupabaseClient<Database>,
      draftId: string
   ): Promise<Draft> => {
      const { data: draft, error } = await supabase
         .from('draft')
         .select('*')
         .match({ id: draftId });

      return draft?.[0] as Draft;
   }
);

export const fetchDraftPicks = async (
   supabase: SupabaseClient,
   draftId: string
): Promise<DraftPick[]> => {
   const { data: draftPicks, error } = await supabase
      .from('draft_picks')
      .select('*')
      .match({ draft_id: draftId });

   return draftPicks as DraftPick[];
};

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

export const fetchLeagueScoring = async (
   supabase: SupabaseClient,
   league: League
): Promise<LeagueScoring> => {
   const { data } = await supabase
      .from('league_scoring')
      .select('*')
      .match({ id: league?.league_scoring });

   return data?.[0] as LeagueScoring;
};

export const updateSupabaseWatchlist = async (
   supabase: SupabaseClient<Database>,
   watchlist: number[],
   userId: string,
   draftId: string
) => {
   const { data, error } = await supabase
      .from('watchlist')
      .update({ players: watchlist })
      .match({ owner: userId, draft_id: draftId })
      .select('*');
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

export const setMainTimer = async (
   supabase: SupabaseClient,
   draftId: string,
   timerValue: number
) => {
   const { data, error } = await supabase
      .from('draft')
      .update({ end_time: timerValue })
      .match({ id: draftId });
};

export const getTimerData = async (
   supabase: SupabaseClient,
   draftId: string
): Promise<DraftTimerFields> => {
   const { data: draft, error } = await supabase
      .from('draft')
      .select('*')
      .eq('id', draftId)
      .single();
   return draft as DraftTimerFields;
};

export const convertTime = (time: number) => {
   const hours = Math.floor(time * (1 / 60));
   const minutes = Math.round(time - hours * 60);
   return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
};

export const handlePick = async (
   supabase: SupabaseClient,
   draft: Draft,
   currentPick: number
) => {
   setMainTimer(supabase, draft.id, Date.now() + TIMER_DURATION * 1000);

   await supabase
      .from('draft')
      .update({ current_pick: currentPick + 1 })
      .match({ id: draft.id });
};
export interface HandleDraftSelectionsProps {
   supabase: SupabaseClient;
   player: Player;
   teamId: string;
   draft: Draft;
   currentRound: number;
   currentPick: number;
}
export const handleDraftSelection = async ({
   supabase,
   player,
   teamId,
   draft,
   currentRound,
   currentPick,
}: HandleDraftSelectionsProps) => {
   const { data, error } = await supabase.from('draft_selections').insert({
      player_id: player.id,
      team_id: teamId,
      draft_id: draft.id,
      round: currentRound,
      pick: currentPick,
   });
   if (error) {
      console.log(error);
      return;
   }
   handlePick(supabase, draft, currentPick);
};
