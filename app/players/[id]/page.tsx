'use server';

import {
   fetchAllLeagueDrafts,
   fetchDraftSelections,
   fetchPlayer,
   fetchTeams,
} from '@/app/utils/helpers';
import { createClient } from '@/app/utils/supabase/server';
import { DraftSelections } from '@/lib/types';

export type SearchParams = Promise<{
   [key: string]: string | string[] | undefined;
}>;

const PlayerPage = async ({
   params: { id },
   searchParams,
}: {
   params: { id: string };
   searchParams?: SearchParams;
}) => {
   const supabase = createClient();
   const league_id = await searchParams?.['league'];
   const player: Awaited<Player> = await fetchPlayer(supabase, id);
   const allTeams: Awaited<Team[]> = await fetchTeams(supabase, league_id);
   const previousDrafts: Awaited<Draft[]> = (
      await fetchAllLeagueDrafts(supabase, league_id)
   ).filter((draft) => draft.is_completed);

   const playerHistory: DraftSelection[] = [];

   for (const draft of previousDrafts) {
      const draftResult: Awaited<DraftSelections> = (
         await fetchDraftSelections(supabase, draft.id)
      )
         .filter((result) => result.player_id === Number(id))
         .map((result) => ({
            ...result,
            first_name: player.first_name,
            last_name: player.last_name,
         }))?.[0];
      if (draftResult) playerHistory.push(draftResult);
   }
   console.log(playerHistory);
   //    const teamHistory: Awaited<TeamHistory[]> = (
   //       await fetchAllTeamHistory(supabase)
   //    ).filter(
   //       (teamHistory) =>
   //          //  allTeams.some((team) => team.id === teamHistory.team_id) &&
   //          teamHistory.player_id === Number(id)
   //    );

   //    console.log(teamHistory);

   return <></>;
};

export default PlayerPage;
