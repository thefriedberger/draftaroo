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
      .match({ owner: user?.id });

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
            {teams?.map(async (team, index) => {
               const { data: leagues } = await supabase
                  .from('leagues')
                  .select('league_name')
                  .match({ league_id: team.league_id });

               return (
                  <Callout
                     key={index}
                     {...{
                        calloutText: `${team.team_name} - ${leagues?.[0].league_name}`,
                        link: {
                           href: `/leagues/${team.league_id}`,
                           text: 'View league',
                        },
                     }}
                  />
               );
            })}
         </div>
      </div>
   );
}
