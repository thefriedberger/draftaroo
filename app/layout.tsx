import { PageContextProvider } from '@/components/context/page-context';
import Nav from '@/components/nav';
import { Analytics } from '@vercel/analytics/react';
import ContextWrapper from './context-wrapper';
import './globals.css';

export const metadata = {
   title: 'Draftaroo',
   description: 'A custom fantasy sports drafting app',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <PageContextProvider>
         <ContextWrapper>
            <html lang="en">
               <body
                  id="DraftarooApp"
                  className="min-h-screen bg-paper-primary dark:bg-gray-dark"
               >
                  <header>
                     <Nav />
                  </header>
                  <main className="flex flex-col items-center">{children}</main>
                  <Analytics />
               </body>
            </html>
         </ContextWrapper>
      </PageContextProvider>
   );
}
