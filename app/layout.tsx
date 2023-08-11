import { PageContextProvider } from '@/components/context/page-context';
import Nav from '@/components/nav';
import {
   User,
   createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import './globals.css';

export const metadata = {
   title: 'Draftaroo',
   description: 'A custom fantasy sports drafting app',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const supabase = createServerComponentClient<Database>({ cookies });

   const {
      data: { user },
   } = await supabase.auth.getUser();
   return (
      <PageContextProvider>
         <html lang="en">
            <body id="DraftarooApp" className="min-h-screen bg-background ">
               <header>
                  <Nav {...{ user: user || ({} as User) }} />
               </header>
               <main className="flex flex-col items-center">{children}</main>
            </body>
         </html>
      </PageContextProvider>
   );
}
