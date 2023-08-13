import { PageContextProvider } from '@/components/context/page-context';
import Nav from '@/components/nav';
import { getUser } from '@/utils/get-user';
import { User } from '@supabase/auth-helpers-nextjs';
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
   const user = await getUser();

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
