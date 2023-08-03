import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginNav from './login-nav';
import NewTeam from './new-team';
import RealtimeTeams from './realtime-teams';

export default async function Home() {
   const supabase = createServerComponentClient<Database>({ cookies });
   const {
      data: { session },
   } = await supabase.auth.getSession();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   if (!session) {
      redirect('/unauthenticated');
   }

   const { data: teams } = await supabase.from('teams').select('*');

   return (
      <>
         <LoginNav />

         <NewTeam />
         <RealtimeTeams teamsList={teams ?? []} />
      </>
   );
}
