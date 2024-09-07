import '@/app/globals.css';
import { PageContextProvider } from '@/components/context/page-context';
import Nav from '@/components/ui/nav';
import { UserResponse } from '@supabase/supabase-js';
import { Metadata } from 'next';
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
   const {
      data: { user },
   }: Awaited<UserResponse> = await supabase.auth.getUser();

   if (!user) {
      return (
         <PageContextProvider>
            {/* <ContextWrapper> */}
            <html lang="en">
               <body
                  id="DraftarooApp"
                  className="min-h-screen bg-paper-light dark:bg-gray-dark"
               >
                  <header>
                     <Nav />
                  </header>
                  <main className="flex flex-col items-center">{children}</main>
               </body>
            </html>
            {/* </ContextWrapper> */}
         </PageContextProvider>
      );
   }
   return (
      <PageContextProvider user={user}>
         {/* <ContextWrapper> */}
         <html lang="en">
            <body
               id="DraftarooApp"
               className="min-h-screen bg-paper-light dark:bg-gray-dark"
            >
               <header>
                  <Nav />
               </header>
               <main className="flex flex-col items-center">{children}</main>
            </body>
         </html>
         {/* </ContextWrapper> */}
      </PageContextProvider>
   );
}
