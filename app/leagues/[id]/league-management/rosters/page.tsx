import getPlayers from '@/app/utils/get-players';
import {
   fetchDraftByLeague,
   fetchLeague,
   fetchTeams,
} from '@/app/utils/helpers';
import { createClient } from '@/app/utils/supabase/server';
import Rosters, { RosterProps } from './rosters';

const RosterPage = async ({ params: { id } }: { params: { id: string } }) => {
   const supabase = createClient();
   const league: Awaited<League> = await fetchLeague(supabase, id);
   const players: Awaited<Player[]> = await getPlayers(league);
   const teams: Awaited<Team[]> = await fetchTeams(
      supabase,
      league.league_id as string
   );
   const draft: Awaited<Draft> = await fetchDraftByLeague(
      supabase,
      id,
      new Date().getUTCFullYear()
   );
   const rosterProps: RosterProps = {
      league: league,
      players: players,
      teams: teams,
      draft: draft,
   };
   return (
      <div className="container">
         <Rosters {...rosterProps} />
      </div>
   );
};

export default RosterPage;
