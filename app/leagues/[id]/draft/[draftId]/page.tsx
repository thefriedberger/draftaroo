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
import Board from '@/components/ui/draft/board';
import { BoardProps, DraftPick } from '@/lib/types';
import { User } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';

type DraftProps = {
   league: League;
   draft: Draft;
   watchlist: Watchlist;
   user: User;
   draftPicks: DraftPick[];
   players: Player[];
   team: Team;
   teams: Team[];
   leagueRules: LeagueRules;
   leagueScoring: LeagueScoring;
   draftedPlayers: DraftSelection[];
   timerDuration: number;
};

const getDraftProps = cache(
   async ({
      id,
      draftId,
   }: {
      id: string;
      draftId: string;
   }): Promise<DraftProps> => {
      const supabase = createClient();

      const user: Awaited<User | null> = await getUser(supabase);

      if (!user) throw new Error('User is required');

      const draft: Awaited<Draft> = await fetchDraftById(supabase, draftId);
      const draftedPlayers: Awaited<DraftSelection[]> =
         await fetchDraftedPlayers(supabase, draft);
      const draftPicks: Awaited<DraftPick[]> = await fetchDraftPicks(
         supabase,
         draftId
      );
      const league: Awaited<League> = await fetchLeague(supabase, id);
      const players: Awaited<Player[]> = await getPlayers(id);
      const team: Awaited<Team> = await fetchTeam(supabase, user.id, id);
      const leagueRules: Awaited<LeagueRules> = await fetchLeagueRules(
         supabase,
         league
      );
      const leagueScoring: Awaited<LeagueScoring> = await fetchLeagueScoring(
         supabase,
         league
      );
      const teams: Awaited<Team[]> = await fetchTeams(
         supabase,
         league.league_id as string
      );
      const timerDuration: Awaited<number> = await getTimerDuration(
         supabase,
         leagueRules.id
      );
      const watchlist: Awaited<Watchlist> = await fetchWatchlist(
         supabase,
         user.id,
         draft
      );

      return {
         league,
         draft,
         watchlist,
         user,
         draftPicks,
         players,
         team,
         teams,
         leagueRules,
         leagueScoring,
         draftedPlayers,
         timerDuration,
      };
   }
);

const Draft = async ({
   params,
}: {
   params: { id: string; draftId: string };
}) => {
   const supabase = createClient();
   let {
      league,
      draft,
      watchlist,
      user,
      draftPicks,
      players,
      team,
      teams,
      leagueRules,
      leagueScoring,
      draftedPlayers,
      timerDuration,
   } = await getDraftProps({ draftId: params.draftId, id: params.id });

   if (!players.length) {
      console.log("We didn't get the players");
      revalidatePath(`/leagues/${params.id}/draft/${params.draftId}`);
   }

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
