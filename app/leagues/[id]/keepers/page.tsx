'use server';
import getPlayers from '@/app/utils/get-players';
import {
   fetchDraftPicks,
   fetchDrafts,
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
   const drafts: Awaited<Draft[]> = await fetchDrafts(supabase, id);

   let draftYear = new Date().getFullYear();
   const draft = drafts?.filter(
      (draft) => !draft.is_completed && Number(draft.draft_year) === draftYear // TODO: make this logic better, maybe
   )?.[0] as Draft;

   if (
      drafts?.find(
         (draft) =>
            Number(draft.draft_year) === draftYear && !draft.is_completed
      )
   ) {
      draftYear -= 1;
   }

   const previousDraft = drafts?.filter(
      (draft) => draft.is_completed && Number(draft.draft_year) === draftYear
   )?.[0] as Draft;

   const previousDraftSelections: Awaited<DraftSelection[]> =
      await fetchDraftSelections(supabase, previousDraft?.id);

   if (!previousDraftSelections) {
      return <h1 className="dark:text-white">{'No keepers'}</h1>;
   }

   if (!draft) {
      return (
         <h1 className="dark:text-white">You need to create a draft silly</h1>
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
   const players: Awaited<Player[]> = await getPlayers(league);
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

   const getFirstRoundRequiredPicks = (player) => {
      switch (player.times_kept) {
         case 1: {
            return [1].concat(picks.slice(picks.length - 7));
         }
         case 2: {
            return [1].concat(picks.slice(picks.length - 14));
         }
         case 3: {
            return [1].concat(picks.slice(picks.length - 21));
         }
         default: {
            return picks;
         }
      }
   };

   const populatePicksNeeded = (player: RosterPlayer) => {
      if (!picks) return;
      if (!player.draft_position) return [leagueRules.number_of_rounds];
      if (player.draft_position === 1) {
         if (player.times_kept > 0) {
            return getFirstRoundRequiredPicks(player);
         }
         return [player.draft_position];
      }
      return [player.draft_position - 1];
   };

   const populatePicksUsed = (player: RosterPlayer) => {
      if (!draftSelections.length) return;

      // console.log(draftSelections);
      const foundPlayer = draftSelections.filter(
         (selection) => selection.player_id === player.player_id
      )[0];

      let picksUsed: number[] = [];
      if (player.draft_position === 1) {
         if (player.times_kept > 0) {
            picksUsed = getFirstRoundRequiredPicks(player);
         } else {
            picksUsed = [1];
         }
      }

      if (foundPlayer?.player_id === 8476945) {
         // console.log(foundPlayer, picksUsed);
      }

      return foundPlayer ? foundPlayer.picks_used : [];
   };

   const keeperFormProps: KeeperFormProps = {
      team: team,
      userPicks: userPicks?.picks ?? [],
      players: players,
      roster: teamHistory.map((player: TeamHistory) => {
         const foundPlayer = previousDraftSelections.find(
            (selection) => selection.player_id === player.player_id
         );

         const rosterPlayer: Partial<RosterPlayer> = {
            ...player,
            draft_position: foundPlayer?.round ?? null,
            times_kept:
               foundPlayer?.round === 1
                  ? player.times_kept === 0
                     ? 0
                     : (player.times_kept ?? 1) + 1
                  : 0,
         };

         rosterPlayer.picks_needed = populatePicksNeeded(
            rosterPlayer as RosterPlayer
         );
         rosterPlayer.picks_used = populatePicksUsed(
            rosterPlayer as RosterPlayer
         );

         return rosterPlayer;
      }) as RosterPlayer[],
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
