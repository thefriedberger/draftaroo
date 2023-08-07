import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Home() {
   const supabase = createServerComponentClient<Database>({ cookies });
   //  const {
   //     data: { session },
   //  } = await supabase.auth.getSession();

   //  if (!session) {
   //     redirect('/unauthenticated');
   //  }

   const { data: teams } = await supabase.from('teams').select('*');

   return (
      <div className="pt-5 text-white text-center">
         <h1 className="text-3xl text-bold mb-3">
            Hey, how&apos;d you get here?
         </h1>
         <p>
            It looks like you found the site before it&apos;s ready, please
            check back later!
         </p>
      </div>
   );
}
