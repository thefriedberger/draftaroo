'use server';
import { fetchTeams } from '@/app/utils/helpers';
import TeamAdmin from '@/components/team-admin';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { UserResponse } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const TeamsTab = async ({ league }: { league: League }) => {
   if (!league?.league_id) return;
   const supabase = createServerComponentClient<Database>({ cookies });
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
