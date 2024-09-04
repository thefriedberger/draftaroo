'use server';

import { createDraft } from '@/app/utils/create-draft';
import getPlayers from '@/app/utils/get-players';
import {
   fetchDraft,
   fetchDraftPicks,
   fetchDraftedPlayers,
   fetchLeague,
   fetchLeagueRules,
   fetchLeagueScoring,
   fetchTeam,
   fetchTeams,
   fetchWatchlist,
} from '@/app/utils/helpers';
import Board from '@/components/ui/board';
import AuthModal from '@/components/ui/modals/auth';
import { BoardProps, DraftPick } from '@/lib/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { UserResponse } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const Draft = async ({
   params,
}: {
   params: { id: string; draftId: string };
}) => {
   const supabase = createServerComponentClient<Database>({ cookies });

   const draft: Awaited<Draft> = await fetchDraft(supabase, params.draftId);
   const { data: user }: Awaited<UserResponse> = await supabase.auth.getUser();
   if (!user?.user)
      return (
         <>
            <h1 className={'dark:text-white'}>You must log in to see this</h1>
            <AuthModal buttonClass="py-2 px-4 rounded-md no-underline" />
         </>
      );
   const watchlist: Awaited<Watchlist> = await fetchWatchlist(
      supabase,
      user.user
   );
   const draftPicks: Awaited<DraftPick[]> = await fetchDraftPicks(
      supabase,
      params.draftId
   );
   const league: Awaited<League> = await fetchLeague(supabase, params.id);
   const players: Awaited<Player[]> = await getPlayers(params.id);
   const team: Awaited<Team> = await fetchTeam(
      supabase,
      user.user.id,
      params.id
   );
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

   const boardProps: BoardProps = {
      league: league,
      leagueID: params.id,
      draft: draft,
      watchlist: watchlist,
      user: user.user,
      draftPicks: draftPicks,
      players: players,
      team: team,
      teams: teams,
      leagueRules: leagueRules,
      leagueScoring: leagueScoring,
      draftedPlayers: draftedPlayers,
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
