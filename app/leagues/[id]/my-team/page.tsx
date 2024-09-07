'use server';

import { fetchTeam } from '@/app/utils/helpers';
import { createClient } from '@/app/utils/supabase/server';
import MyTeamForm from '@/components/ui/forms/my-team';
import { UserResponse } from '@supabase/supabase-js';

const MyTeam = async ({ params: { id } }: { params: { id: string } }) => {
   const supabase = createClient();
   const { data: user }: Awaited<UserResponse> = await supabase.auth.getUser();
   if (!user?.user) {
      return;
   }

   const team: Awaited<Team> = await fetchTeam(supabase, user.user.id, id);

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
