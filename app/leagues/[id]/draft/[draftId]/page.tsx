'use server';

import { createDraft } from '@/app/utils/create-draft';
import getPlayers from '@/app/utils/get-players';
import {
   fetchDraftById,
   fetchDraftPicks,
   fetchDraftedPlayers,
   fetchLeague,
   fetchLeagueRules,
   fetchLeagueScoring,
   fetchTeam,
   fetchTeams,
   fetchWatchlist,
   getTimerDuration,
   getUser,
} from '@/app/utils/helpers';
import { createClient } from '@/app/utils/supabase/server';
import Board from '@/components/ui/board';
import { BoardProps, DraftPick } from '@/lib/types';
import { User } from '@supabase/supabase-js';

const Draft = async ({
   params,
}: {
   params: { id: string; draftId: string };
}) => {
   const supabase = createClient();

   const draft: Awaited<Draft> = await fetchDraftById(supabase, params.draftId);
   const user: Awaited<User | null> = await getUser(supabase);
   if (!user) return;

   const watchlist: Awaited<Watchlist> = await fetchWatchlist(
      supabase,
      user.id,
      draft
   );
   const draftPicks: Awaited<DraftPick[]> = await fetchDraftPicks(
      supabase,
      params.draftId
   );
   const league: Awaited<League> = await fetchLeague(supabase, params.id);
   const players: Awaited<Player[]> = await getPlayers(params.id);
   const team: Awaited<Team> = await fetchTeam(supabase, user.id, params.id);
   const leagueRules: Awaited<LeagueRules> = await fetchLeagueRules(
      supabase,
      league
   );

   const leagueScoring: Awaited<LeagueScoring> = await fetchLeagueScoring(
      supabase,
      league
   );

   const teams: Awaited<Team[]> = await fetchTeams(supabase, league);

   const draftedPlayers: Awaited<DraftSelection[]> = await fetchDraftedPlayers(
      supabase,
      draft
   );
   const timerDuration: Awaited<number> = await getTimerDuration(
      supabase,
      leagueRules.id
   );

   const boardProps: BoardProps = {
      league: league,
      leagueID: params.id,
      draft: draft,
      watchlist: watchlist,
      user: user,
      draftPicks: draftPicks,
      players: players,
      team: team,
      teams: teams,
      leagueRules: leagueRules,
      leagueScoring: leagueScoring,
      draftedPlayers: draftedPlayers,
      timerDuration: timerDuration ?? 120,
   };

   return (
      <>
         {!draft ? (
            <>
               <h1>Looks like you need to make a draft</h1>
               <button
                  onClick={() => createDraft({ supabase, params })}
                  type="button"
               >
                  Creat Draft
               </button>
            </>
         ) : (
            <>
               <Board {...boardProps} />
            </>
         )}
      </>
   );
};

export default Draft;
