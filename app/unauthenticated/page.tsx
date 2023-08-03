import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginNav from '../login-nav';

export default async function Unauthenticated() {
   const supabase = createServerComponentClient<Database>({ cookies });
   const {
      data: { session },
   } = await supabase.auth.getSession();

   if (session) {
      redirect('/');
   }

   return (
      <>
         <LoginNav />
         <p className="text-white">Please sign in to see todos!</p>
      </>
   );
}
