import '@/app/globals.css';
import { PageContextProvider } from '@/components/context/page-context';
import Nav from '@/components/ui/nav';
import { User } from '@supabase/supabase-js';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import {
   fetchAllUserTeams,
   fetchDrafts,
   fetchUserLeagues,
   getUser,
} from './utils/helpers';
import { createClient } from './utils/supabase/server';
export const metadata: Metadata = {
   title: 'Draftaroo',
   description: 'A custom fantasy hockey drafting app',
   applicationName: 'Draftaroo',
};
export const dynamic = 'force-dynamic';

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const supabase = createClient();
   const user: Awaited<User | null> = await getUser(supabase);

   if (!user) {
      return (
         <PageContextProvider>
            <html lang="en">
               <body
                  id="DraftarooApp"
                  className="min-h-screen bg-paper-light dark:bg-gray-dark"
               >
                  <header>
                     <Nav />
                  </header>
                  <main className="flex flex-col items-center">{children}</main>
                  <SpeedInsights />
               </body>
            </html>
         </PageContextProvider>
      );
   }

   const userTeams: Awaited<Team[]> = await fetchAllUserTeams(
      supabase,
      user.id
   );

   const leagues: Awaited<League[]> = [];
   for (const team of userTeams) {
      if (team) {
         const foundLeague: Awaited<League> = await fetchUserLeagues(
            supabase,
            team
         );
         leagues.push(foundLeague);
      }
   }
   if (!leagues.length) {
      return <></>;
   }

   let drafts: Awaited<Draft[]> = [];

   for (const league of leagues) {
      if (league.league_id) {
         await fetchDrafts(supabase, league.league_id).then((response) =>
            response.forEach((draft) => drafts.push(draft))
         );
      }
   }

   return (
      <PageContextProvider user={user}>
         <html lang="en">
            <body
               id="DraftarooApp"
               className="min-h-screen bg-paper-light dark:bg-gray-dark"
            >
               <header className="sticky top-0 z-50">
                  <Nav
                     user={user}
                     leagues={leagues}
                     userTeams={userTeams}
                     drafts={drafts}
                  />
               </header>
               <main className="flex flex-col items-center">{children}</main>
               <SpeedInsights />
            </body>
         </html>
      </PageContextProvider>
   );
}
