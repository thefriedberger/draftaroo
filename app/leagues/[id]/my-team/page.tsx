'use server';

import { fetchTeam, getUser } from '@/app/utils/helpers';
import { createClient } from '@/app/utils/supabase/server';
import MyTeamForm from '@/components/ui/forms/my-team';
import { User } from '@supabase/supabase-js';

const MyTeam = async ({ params: { id } }: { params: { id: string } }) => {
   const supabase = createClient();
   const user: Awaited<User | null> = await getUser(supabase);
   if (!user) {
      return;
   }

   const team: Awaited<Team> = await fetchTeam(supabase, user.id, id);

   return (
      <>
         {team && (
            <>
               <h2
                  className="font-bold text-xl text-black dark:text-white mb-2"
                  key={team.id}
               >
                  {team?.team_name}
               </h2>
               <MyTeamForm team={team} />
            </>
         )}
      </>
   );
};

export default MyTeam;
