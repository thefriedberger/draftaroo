import '@/app/globals.css';
import { PageContextProvider } from '@/components/context/page-context';
import Nav from '@/components/ui/nav';
import { User } from '@supabase/supabase-js';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import { getUser } from './utils/helpers';
import { createClient } from './utils/supabase/server';
export const metadata: Metadata = {
   title: 'Draftaroo',
   description: 'A custom fantasy sports drafting app',
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
   return (
      <PageContextProvider user={user}>
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
