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
   const players: Awaited<Player[]> = await getPlayers(params.id);
   const teams: Awaited<Team[]> = await fetchTeams(
      supabase,
      league.league_id as string
   );
   return (
      <>
         {!draftResults ? (
            <Image
               src="https://mfiegmjwkqpipahwvcbz.supabase.co/storage/v1/object/sign/images/94z6kg.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvOTR6NmtnLmpwZyIsImlhdCI6MTcyNzUzMjcyNywiZXhwIjoxNzU5MDY4NzI3fQ.7iyE5cvryvH7ofn2x168f-pujBM1DgiFnsLdXTOPNSg&t=2024-09-28T14%3A12%3A07.366Z"
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
