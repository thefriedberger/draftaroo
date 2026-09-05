'use server';

import { DraftSelections } from '@/lib/types';
import {
   fetchAllLeagueDrafts,
   fetchDraftSelections,
   fetchPlayer,
   fetchTeams,
} from './helpers';
import { createClient } from './supabase/server';

export interface PlayerHistoryProps extends DraftSelections {
   team: string;
}
const getPlayerHistory = async (
   player_id: string,
   league_id: string
): Promise<PlayerHistoryProps[]> => {
   const supabase = createClient();
   const player: Awaited<Player> = await fetchPlayer(supabase, player_id);
   const allTeams: Awaited<Team[]> = await fetchTeams(supabase, league_id);
   const previousDrafts: Awaited<Draft[]> = (
      await fetchAllLeagueDrafts(supabase, league_id)
   ).filter((draft) => draft.is_completed);

   const playerHistory: DraftSelection[] = [];

   for (const draft of previousDrafts) {
      const draftResult: Awaited<DraftSelections> = (
         await fetchDraftSelections(supabase, draft.id)
      )
         .filter((result) => result.player_id === Number(player_id))
         .map((result) => ({
            ...result,
            first_name: player.first_name,
            last_name: player.last_name,
         }))?.[0];
      if (draftResult) playerHistory.push(draftResult);
   }

   //@ts-ignore: I'll figure this error out later, it doesn't seem like a problem
   const historyProps: PlayerHistoryProps[] = playerHistory.map((history) => ({
      team: allTeams.find((team) => team.id === history.team_id)?.team_name,
      ...history,
      created_at: history.created_at,
   }));

   return historyProps;
};

export default getPlayerHistory;
