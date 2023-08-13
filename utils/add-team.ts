'use server';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function addTeam(formData: FormData) {
   console.log('adding team');
   const supabase = createServerActionClient<Database>({ cookies });
   const teamName = String(formData.get('team_name'));
   const leagueId = String(formData.get('league_id'));

   const league = await supabase
      .from('leagues')
      .select('*')
      .match({ league_id: leagueId });

   const owner = league?.data?.[0]?.owner;

   if (owner && leagueId) {
      const { error } = await supabase.from('teams').insert({
         team_name: teamName,
         owner: owner,
         league_id: leagueId,
      });
      if (error) return error;
   }
}
