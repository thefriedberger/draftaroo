'use server';

import { fetchTeam } from '@/app/utils/helpers';
import MyTeamForm from '@/components/ui/forms/my-team';
import { buttonClasses } from '@/components/ui/helpers/buttons';
import AuthModal from '@/components/ui/modals/auth';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { UserResponse } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const MyTeam = async ({ params: { id } }: { params: { id: string } }) => {
   const supabase = createServerComponentClient<Database>({ cookies });
   const { data: user }: Awaited<UserResponse> = await supabase.auth.getUser();
   if (!user?.user) {
      return (
         <>
            <h1 className={'dark:text-white'}>You must log in to see this</h1>
            <AuthModal buttonClass={buttonClasses} />
         </>
      );
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
