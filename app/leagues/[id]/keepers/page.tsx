'use server';
import getPlayers from '@/app/utils/get-players';
import {
   fetchDraftByLeague,
   fetchDraftPicks,
   fetchDraftSelections,
   fetchLeague,
   fetchLeagueRules,
   fetchRosters,
   fetchTeam,
   getUser,
} from '@/app/utils/helpers';
import { createClient } from '@/app/utils/supabase/server';
import KeeperSkeleton from '@/components/skeletons/keeper-skeleton';
import KeeperForm, { KeeperFormProps } from '@/components/ui/forms/keepers';
import { DraftPick } from '@/lib/types';
import { User } from '@supabase/supabase-js';
import { Suspense } from 'react';

export interface RosterPlayer extends TeamHistory {
   picks_needed: number[];
   times_kept: number;
   picks_used: number[];
   picks_available: boolean;
}
const Keepers = async ({ params: { id } }: { params: { id: string } }) => {
   const supabase = createClient();
   const user: Awaited<User | null> = await getUser(supabase);

   const team: Awaited<Team> = await fetchTeam(
      supabase,
      user?.id as string,
      id
   );
   const league: Awaited<League> = await fetchLeague(supabase, id);
   const draft: Awaited<Draft> = await fetchDraftByLeague(
      supabase,
      id,
      new Date().getFullYear()
   );

   if (!draft) {
      return (
         <p className="dark:text-white">You need to create a draft silly</p>
      );
   }

   if (!team) {
      return <p>{'No team :('}</p>;
   }
   if (!league.league_id) return <></>;
   const leagueRules: Awaited<LeagueRules> = await fetchLeagueRules(
      supabase,
      league
   );
   const draftPicks: Awaited<DraftPick[]> = await fetchDraftPicks(
      supabase,
      draft.id
   );
   const draftSelections: Awaited<DraftSelection[]> =
      await fetchDraftSelections(supabase, draft?.id);
   const userPicks = draftPicks.filter(
      (draftPick) => draftPick.team_id === team.id
   )[0];
   const players: Awaited<Player[]> = await getPlayers(league.league_id);
   const numberOfTeams = leagueRules.number_of_teams;
   const numberOfRounds = leagueRules.number_of_rounds;
   const teamHistory: Awaited<TeamHistory[]> = await fetchRosters(
      supabase,
      team.id
   );

   const picks =
      numberOfTeams && userPicks?.picks
         ? userPicks.picks.map((pick: number) => {
              return Math.ceil(pick / numberOfTeams);
           })
         : [];

   const populatePicksNeeded = (player: RosterPlayer) => {
      if (!picks) return;
      if (!player.draft_position) return [leagueRules.number_of_rounds];
      if (player.draft_position === 1) {
         if (player.times_kept > 0) {
            switch (player.times_kept) {
               case 1: {
                  return [1].concat(picks.slice(picks.length - 7));
               }
               case 2: {
                  return [1].concat(picks.slice(picks.length - 14));
               }
               default: {
                  return picks;
               }
            }
         }
         return [player.draft_position];
      }
      return [player.draft_position - 1];
   };

   const populatePicksUsed = (player: RosterPlayer) => {
      if (!draftSelections.length) return;

      const foundPlayer = draftSelections.filter(
         (selection) => selection.player_id === player.player_id
      );
      return [foundPlayer?.[0]?.round] ?? null;
   };
   teamHistory.map((player: any) => {
      const foundPlayer = draftSelections.find(
         (selection) =>
            selection.player_id === player.player_id &&
            selection.team_id === team.id
      );
      return (
         (player.times_kept = foundPlayer?.is_keeper
            ? player.times_kept + 1
            : 0),
         (player.picks_needed = populatePicksNeeded(player as RosterPlayer)),
         (player.picks_used = populatePicksUsed(player as RosterPlayer))
      );
   });
   const keeperFormProps: KeeperFormProps = {
      team: team,
      userPicks: userPicks?.picks ?? [],
      players: players,
      roster: teamHistory as RosterPlayer[],
      numberOfRounds: numberOfRounds ?? 0,
      numberOfTeams: numberOfTeams ?? 0,
      draft: draft,
   };

   return (
      <div className="lg:max-w-2xl w-full lg:px-5">
         {draft.is_active || draft.is_completed ? (
            <h1 className="dark:text-white text-2xl text-center mt-5">
               You can&apos;t set keepers because draft is active or completed
            </h1>
         ) : (
            <Suspense fallback={<KeeperSkeleton />}>
               <KeeperForm {...keeperFormProps} />
            </Suspense>
         )}
      </div>
   );
};

export default Keepers;
