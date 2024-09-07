'use server';
import { fetchTeams } from '@/app/utils/helpers';
import { createClient } from '@/app/utils/supabase/server';
import TeamAdmin from '@/components/ui/team-admin';
import { UserResponse } from '@supabase/supabase-js';

const TeamsTab = async ({ league }: { league: League }) => {
   if (!league?.league_id) return;
   const supabase = createClient();
   const user: Awaited<UserResponse> = await supabase.auth.getUser();

   const teams: Awaited<Team[]> = await fetchTeams(supabase, league);

   return (
      <>
         {user &&
            teams &&
            teams
               .filter((team: Team) => {
                  if (league && league !== undefined)
                     return team.league_id === league.league_id;
               })
               .map((team: Team) => {
                  return <TeamAdmin key={team.id} team={team} />;
               })}
      </>
   );
};

export default TeamsTab;
