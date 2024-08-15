'use server';
import {
   fetchDraftSelections,
   fetchLeagueRules,
   fetchPlayers,
   fetchRosters,
} from '@/app/utils/helpers';
import KeeperForm, { KeeperFormProps } from '@/components/ui/forms/keepers';
import { KeeperViewProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
export interface RosterPlayer extends TeamHistory {
   picks_needed: number[];
   times_kept: number;
   picks_used: number[];
   picks_available: boolean;
}
const KeepersTab = async ({ league, team, draft }: KeeperViewProps) => {
   const supabase = createClientComponentClient<Database>();
   if (!team?.id) {
      return <></>;
   }
   const leagueRules: Awaited<LeagueRules> = await fetchLeagueRules(
      supabase,
      league
   );
   const draftSelections: Awaited<DraftSelection[]> =
      await fetchDraftSelections(supabase, draft.id);
   const leaguePicks: any = leagueRules?.draft_picks;
   const userPicks = leaguePicks[team.id];
   const players: Awaited<Player[]> = await fetchPlayers(supabase);
   const numberOfTeams = leagueRules.number_of_teams;
   const numberOfRounds = leagueRules.number_of_rounds;
   const teamHistory: Awaited<TeamHistory[]> = await fetchRosters(
      supabase,
      team.id
   );

   const picks =
      numberOfTeams &&
      userPicks.map((pick: number) => {
         return Math.ceil(pick / numberOfTeams);
      });

   const populatePicksNeeded = (player: RosterPlayer) => {
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

   teamHistory.map(
      (player: any) => (
         (player.picks_needed = populatePicksNeeded(player as RosterPlayer)),
         (player.picks_used = populatePicksUsed(player as RosterPlayer))
      )
   );

   const keeperFormProps: KeeperFormProps = {
      team: team,
      picks: picks,
      players: players,
      roster: teamHistory as RosterPlayer[],
      numberOfRounds: numberOfRounds ?? 0,
      draft: draft,
   };

   return (
      <>
         <KeeperForm {...keeperFormProps} />
      </>
   );
};

export default KeepersTab;
