import { fetchAllTeamHistory, fetchDraftSelections } from '../utils/helpers';
import { createClient } from '../utils/supabase/server';

export async function POST(request: Request) {
   const { league_id, draft_id } = await request?.json();

   if (!league_id) {
      return new Response('No league id provided', { status: 500 });
   }
   if (!draft_id) {
      return new Response('No draft id provided', { status: 500 });
   }

   const supabase = createClient();

   try {
      const draftSelections = await fetchDraftSelections(
         supabase,
         draft_id as string
      );
      const teamHistory = await fetchAllTeamHistory(supabase);

      const teamIds = draftSelections
         .map((selection) => selection.team_id)
         .filter((value, index, self) => self.indexOf(value) === index);

      const filteredHistory = teamHistory.filter((player) => {
         const foundPlayer = draftSelections.some(
            (draftee) =>
               draftee.player_id === player.player_id &&
               player.team_id === draftee.team_id &&
               draftee.round === 1
         );
         return foundPlayer || !teamIds.includes(player.team_id);
      });
   } catch (error) {
      return new Response(`Error: ${error}`, { status: 500 });
   }
   return new Response('Successfully created new draft!', { status: 200 });
}
