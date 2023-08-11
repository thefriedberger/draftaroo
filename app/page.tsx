import Callout from '@/components/callout';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Home() {
   const supabase = createServerComponentClient<Database>({ cookies });
   const {
      data: { session },
   } = await supabase.auth.getSession();

   const {
      data: { user },
   } = await supabase.auth.getUser();

   const { data: teams } = await supabase
      .from('teams')
      .select('*')
      .match({ id: user?.id });

   return (
      <div className="pt-5 text-white text-center">
         <h1 className="text-3xl">Welcome to Draftaroo!</h1>
         <div className="grid grid-flow-row">
            <Callout
               {...{
                  calloutText: 'Want to create a new league?',
                  link: {
                     href: '/leagues/create',
                     text: 'Create league',
                  },
               }}
            />
            <Callout
               {...{
                  calloutText: 'New user?',
                  link: {
                     href: '/login',
                     text: 'Create account',
                  },
               }}
            />
            <Callout
               {...{
                  calloutText: 'Ready to draft?',
                  link: {
                     href: '/draft',
                     text: 'Join draft',
                  },
               }}
            />
         </div>
      </div>
   );
}
