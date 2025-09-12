'use server';
import getPlayers from '@/app/utils/get-players';
import {
   fetchDraftPicks,
   fetchDraftSelections,
   fetchLeagueRules,
   fetchRosters,
} from '@/app/utils/helpers';
import KeeperForm, { KeeperFormProps } from '@/components/ui/forms/keepers';
import { DraftPick, KeeperViewProps } from '@/lib/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
export interface RosterPlayer extends TeamHistory {
   picks_needed: number[];
   times_kept: number;
   picks_used: number[];
   picks_available: boolean;
}
const KeepersTab = async ({ league, team, draft }: KeeperViewProps) => {
   const supabase = createClientComponentClient<Database>();
   if (!team) {
      return <></>;
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

   teamHistory.map(
      (player: any) => (
         (player.picks_needed = populatePicksNeeded(player as RosterPlayer)),
         (player.picks_used = populatePicksUsed(player as RosterPlayer))
      )
   );

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
      <>
         <KeeperForm {...keeperFormProps} />
      </>
   );
};

export default KeepersTab;
