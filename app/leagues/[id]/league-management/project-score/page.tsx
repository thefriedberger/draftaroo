'use server';

import getPlayers from '@/app/utils/get-players';
import { fetchLeague, fetchLeagueScoring } from '@/app/utils/helpers';
import { createClient } from '@/app/utils/supabase/server';
import { PlayerList } from './ui';

const ProjectScore = async ({ params: { id } }: { params: { id: string } }) => {
   const supabase = createClient();
   const league = await fetchLeague(supabase, id);
   const leagueScoring = await fetchLeagueScoring(supabase, league);
   const players: Awaited<Player[]> = await getPlayers(league);

   const playerListProps = {
      players: players,
      scoring: leagueScoring,
   };

   return (
      <div className="container">{<PlayerList {...playerListProps} />}</div>
   );
};

export default ProjectScore;
