import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import NewTeam from './new-team';
import RealtimeTeams from './realtime-teams';

export default async function Home() {
   const supabase = createServerComponentClient<Database>({ cookies });
   const {
      data: { session },
   } = await supabase.auth.getSession();

   if (!session) {
      redirect('/unauthenticated');
   }

   const { data: teams } = await supabase.from('teams').select('*');

   return (
      <>
         <h1 className="text-white">Hello, {session.user.email}</h1>
         <NewTeam />
         <RealtimeTeams teamsList={teams ?? []} />
      </>
   );
}
