import { players } from '@/json/players';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export default async function AddTeams() {
   const addTeam = async () => {
      'use server';
      const supabase = createServerActionClient<Database>({ cookies });
      players.forEach(async (player) => {
         await supabase
            .from('players')
            .insert([
               {
                  id: player.id,
                  first_name: player.firstName,
                  last_name: player.lastName,
                  current_team: player.currentTeam,
                  primary_position: player.primaryPosition,
                  stats: player.stats ? player.stats : null,
               },
            ])
            .select();
      });
      revalidatePath('/');
   };
   return (
      <>
         <form action={addTeam}>
            <button className="bg-white" type="submit">
               Submit
            </button>
         </form>
      </>
   );
}
