import { supabaseStorage } from '@/app/utils/constants';
import getPlayers from '@/app/utils/get-players';
import {
   fetchDraftSelections,
   fetchLeague,
   fetchLeagueRules,
   fetchTeams,
} from '@/app/utils/helpers';
import { createClient } from '@/app/utils/supabase/server';
import DraftResults from '@/components/ui/draft-results';
import Image from 'next/image';

const DraftResultsPage = async ({
   params,
}: {
   params: { id: string; draftId: string };
}) => {
   const supabase = createClient();

   const league: Awaited<League> = await fetchLeague(supabase, params.id);
   const leagueRules: Awaited<LeagueRules> = await fetchLeagueRules(
      supabase,
      league
   );
   const draftResults: Awaited<DraftSelection[]> = await fetchDraftSelections(
      supabase,
      params.draftId
   );
   const players: Awaited<Player[]> = await getPlayers(league);
   const teams: Awaited<Team[]> = await fetchTeams(
      supabase,
      league.league_id as string
   );
   return (
      <>
         {!draftResults ? (
            <Image
               src={supabaseStorage['Results']}
               alt="Draft Results Meme"
               width={500}
               height={696}
               className="mt-5"
            />
         ) : (
            <DraftResults
               draftResults={draftResults}
               leagueRules={leagueRules}
               teams={teams}
               players={players}
            />
         )}
      </>
   );
};
export default DraftResultsPage;
