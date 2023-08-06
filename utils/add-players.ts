import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { players } from '../../json/players';

export async function AddPlayers() {
   const supabase = createRouteHandlerClient<Database>({ cookies });
   players.forEach(async (player) => {
      await supabase.from('players').insert([
         {
            first_name: player.firstName,
            last_name: player.lastName,
            current_team: player.currentTeam,
            primary_position: player.primaryPosition,
            stats: player.stats,
         },
      ]);
   });
}
