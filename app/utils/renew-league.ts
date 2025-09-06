'use server';

import { createDraft } from './create-draft';
import {
   fetchAllLeagueDrafts,
   fetchAllTeamHistory,
   fetchDraftSelections,
   fetchTeams,
} from './helpers';
import { createClient } from './supabase/server';

const renewLeague = async (leagueId: string) => {
   if (!leagueId) {
      return new Response('No league id provided', { status: 500 });
   }

   const supabase = createClient();

   try {
      const drafts = await fetchAllLeagueDrafts(supabase, leagueId).then(
         (drafts) =>
            drafts.sort(
               (a, b) =>
                  parseInt(b?.draft_year || '0') -
                  parseInt(a?.draft_year || '0')
            )
      );

      const draftResults = await fetchDraftSelections(
         supabase,
         drafts.filter(
            ({ draft_year }) =>
               draft_year &&
               parseInt(draft_year) !== new Date().getUTCFullYear()
         )[0].id
      ).then((results) =>
         results.filter((result) => result.round === 1 && result.is_keeper)
      );

      const teamIds = await fetchTeams(supabase, leagueId).then((teams) =>
         teams.map((team) => team.id)
      );

      const teamHistory = await fetchAllTeamHistory(supabase);

      const teamHistoryToRemove = teamHistory.filter(
         (team) =>
            teamIds.includes(team.team_id) &&
            !draftResults.some((result) => result.player_id === team.player_id)
      );

      console.log(teamHistoryToRemove.length);
      for (const player of teamHistoryToRemove) {
         const { data, error } = await supabase
            .from('team_history')
            .delete()
            .eq('id', player.id);
         console.log(data, error);
      }
      for (const player of draftResults) {
         const { data, error } = await supabase.from('team_history').upsert(
            {
               player_id: player.player_id,
               team_id: player.team_id,
               draft_position: player.round ?? null,
               is_keeper: false,
               times_kept:
                  (teamHistory.find(
                     (history) => history.player_id === player.player_id
                  )?.times_kept as number) + 1,
            },
            { onConflict: 'player_id,team_id' }
         );
      }
      if (
         !drafts.some(
            ({ draft_year }) =>
               draft_year &&
               parseInt(draft_year) === new Date().getUTCFullYear()
         )
      ) {
         const response = await createDraft({
            supabase,
            params: { id: leagueId },
         });
      }
   } catch (error) {
      console.log(error);
      return;
   }
   return;
};

export default renewLeague;
